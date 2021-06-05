const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const fileUpload = require('express-fileupload')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const Tournament = require('./models/Tournament')
const Match = require('./models/Match')
const Message = require('./models/Message')
const User = require('./models/User')
const jwt = require('jsonwebtoken')
const moment = require('moment')
const schedule = require('node-schedule');


app.use(express.json({extended: true}))
app.use(fileUpload())

app.use('/api/upload', require('./routes/upload.routes'))
app.use('/api/user', require('./routes/user.routes'))
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/tournaments', require('./routes/tournaments.routes'))
app.use('/api/participants', require('./routes/participants.routes'))
app.use('/api/news', require('./routes/news.routes'))
app.use('/api/profile', require('./routes/profile.routes'))

const PORT = config.get('port') || 5000
const GHOST = config.get('ghost')

async function start() {
    try {
        http.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))

        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })


        // const connection = mongoose.connection
        const mixArr = (arr) => {
            return arr.map(i => [Math.random(), i]).sort().map(i => i[1])
        }

        //Проверка на победителей в этапе
        const checkWinner = (tournament, stage, stageTime, delayTimer, delayInterval) => {
            let a = stageTime + 1
            let checkWinnerTimer = setTimeout(() => {
                console.log('Таймаут отработал')
                checkWinnerTimer = setInterval(async () => {
                    console.log('Интервал отработал')
                    const matches = await Match.find({
                        winner: {$exists: false},
                        tournament: tournament._id,
                        stateTour: stage
                    },)

                    if (matches.length > 0) {
                        const tournamentTimer = await Tournament.updateOne({_id: tournament._id},
                            {
                                $set: {
                                    nextStateDate: moment(tournament.nextStateDate).add(a, 'minutes').toDate().setSeconds(0, 0),
                                }
                            })

                        io.emit('TOURNAMENTS/NEWSTATE', tournamentTimer.stateTour)
                    } else {
                        clearInterval(checkWinnerTimer)
                    }
                    a = a + 1
                }, delayInterval)
            }, delayTimer)

        }

        //Обновление состояния турнира
        const updateTourStage = async (tournament, stage, nextStage) => {
            const tournament16 = await Tournament.updateOne({_id: tournament._id},
                {
                    $set: {
                        stateTour: stage,
                        nextStateTour: nextStage,
                        nextStateDate: moment(tournament.nextStateDate).add(3, 'minutes').toDate().setSeconds(0, 0),
                    }
                }
            )
            io.emit('TOURNAMENTS/NEWSTATE', tournament16.stateTour)
        }

        //Создание сетки и заполнение её первого этапа участниками
        const createBracket = async (tournament, format) => {

            const participantsNumber = format * 2

            //Миксовка участников
            const participantRandom = mixArr(tournament.participants)

            //Добавление пустых мест при недоборе
            let p = -1
            while (participantRandom.length < participantsNumber) {
                participantRandom.splice(p, 0, GHOST);
                p = p - 2
            }


            let flag = true
            let l = 1       //Номер каждого матча
            while (format >= 1) {   //Пока не построится вся сетка
                for (let i = 0; i < format * 2; i = i + 2) {    //Для каждой пары участников

                    if (flag) {                             //При первом этапе создаём матчи с заполненными участниками
                        const match = new Match(
                            {
                                tournament: tournament._id,
                                matchNumber: l,
                                stateTour: `1/${format}`,
                                participants: [participantRandom[i], participantRandom[i + 1]],
                                startDate: moment(tournament.nextStateDate).add(1, 'minutes').toDate().setSeconds(0, 0),
                                messages: []
                            })
                        const tournamentPrep = await Tournament.updateOne(
                            {_id: tournament._id},
                            {$push: {matches: match.id}}
                        )
                        l++

                        await match.save()

                    } else {                                //При последующих создаём пустные матчи


                        const matches = await Match.find({stateTour: `1/${format * 2}`, tournament: tournament._id})


                        const matchNow = new Match(
                            {
                                tournament: tournament._id,
                                matchNumber: l,
                                stateTour: `1/${format}`,
                                participants: [null, null],
                                prevMatches: [matches[i]._id, matches[i + 1]._id],
                                messages: []
                            })

                        await matchNow.save()

                        //Проставляем последующие матчи для предыдущих

                        const matchPrev1 = await Match.updateOne({_id: matches[i]._id},
                            {
                                $set: {
                                    nextMatch: matchNow._id
                                }
                            })


                        const matchPrev2 = await Match.updateOne({_id: matches[i + 1]._id},
                            {
                                $set: {
                                    nextMatch: matchNow._id
                                }
                            })


                        //Добавляем матчи к турниру
                        const tournamentPrep = await Tournament.updateOne(
                            {_id: tournament._id},
                            {$push: {matches: matchNow.id}}
                        )


                        l++
                    }

                }
                flag = false;
                format = format / 2
            }
        }


        //Главная функция проверки текущего состояния и перехода в следующее
        const changeTournamentState = async (item) => {
            const tournament = await Tournament.findOne({_id: item._id})
            switch (tournament.nextStateTour) {
                case "CONFIRMATION":
                    const tournamentC = await Tournament.updateOne({_id: tournament._id},
                        {
                            $set: {
                                stateTour: "CONFIRMATION",
                                nextStateTour: "PREPARATION",
                                nextStateDate: tournament.date.setSeconds(0, 0)
                            }
                        }
                    )
                    io.emit('TOURNAMENTS/NEWSTATE', tournamentC.stateTour)
                    console.log("CONFIRMATION отработал")
                    break
                case "PREPARATION":

                    const tournamentConfirm = await Tournament.updateOne({_id: item._id},
                        {
                            $set: {
                                participants: tournament.candidates
                            }
                        })

                    let nextStage

                    switch (true) {
                        case tournament.participants.length < 8:
                            nextStage = "CANCELLATION"
                            console.log("Слишком мало людей")
                            break;
                        case tournament.participants.length === 8:
                            await createBracket(tournament, 4)

                            nextStage = "1/4"
                            console.log("Сетка для топ 4")
                            break;
                        case 8 < tournament.participants.length <= 16:

                            await createBracket(tournament, 8)

                            nextStage = "1/8"
                            console.log("Сетка для топ 8")
                            break;
                        case 17 <= tournament.participants.length <= 32:

                            await createBracket(tournament, 16)
                            nextStage = "1/16"
                            console.log("Сетка для топ 16")
                            break;
                        case 33 <= tournament.participants.length <= 64:
                            await createBracket(tournament, 32)

                            nextStage = "1/32"
                            console.log("Сетка для топ 32")
                            break;
                    }

                    const matchesWithGhost = await Match.find({
                        participants: {$in: GHOST},
                        tournament: tournament._id,
                    },)

                    matchesWithGhost.map(async (item) => {

                        const matchWinner = await Match.updateOne({_id: item._id},
                            {
                                $set: {
                                    winner: item.participants[1]
                                }
                            })

                        if (item.matchNumber % 2 != 0) {

                            const match3 = await Match.updateOne({_id: item.nextMatch},
                                {
                                    $pop: {
                                        participants: -1
                                    }
                                })

                            const match1 = await Match.updateOne({_id: item.nextMatch},
                                {
                                    $push: {
                                        participants: {
                                            $each: [item.participants[1]],
                                            $position: 0
                                        }
                                    }
                                }
                            )
                        } else {

                            const match4 = await Match.updateOne({_id: item.nextMatch},
                                {
                                    $pop: {
                                        participants: 1
                                    }
                                })

                            const match2 = await Match.updateOne({_id: item.nextMatch},
                                {
                                    $push: {
                                        participants: {
                                            $each: [item.participants[1]],
                                            $position: 1
                                        }
                                    }
                                }
                            )
                        }

                    })

                    const tournamentP = await Tournament.updateOne({_id: tournament._id},
                        {
                            $set: {
                                stateTour: "PREPARATION",
                                nextStateTour: nextStage,
                                nextStateDate: moment(tournament.nextStateDate).add(1, 'minutes').toDate().setSeconds(0, 0),
                            }
                        }
                    )
                    io.emit('TOURNAMENTS/NEWSTATE', tournamentP.stateTour)
                    console.log("PREPARATION отработал")
                    break
                case "1/16":

                    await updateTourStage(tournament, '1/16', '1/8')

                    await checkWinner(tournament, '1/16', 3, 1000 * 60, 1000 * 60)

                    console.log("1/16 отработал")
                    break
                case "1/8":

                    await updateTourStage(tournament, '1/8', '1/4')

                    await checkWinner(tournament, '1/8', 3, 1000 * 60, 1000 * 60)

                    console.log("1/8 отработал")
                    break
                case "1/4":

                    await updateTourStage(tournament, '1/4', '1/2')

                    await checkWinner(tournament, '1/4', 3, 1000 * 60, 1000 * 60)

                    console.log("1/4 отработал")
                    break
                case "1/2":

                    await updateTourStage(tournament, '1/2', '1/1')

                    await checkWinner(tournament, '1/2', 3, 1000 * 60, 1000 * 60)

                    console.log("1/2 отработал")
                    break
                case "1/1":

                    await updateTourStage(tournament, '1/1', 'COMPLETION')

                    await checkWinner(tournament, '1/1', 3, 1000 * 60, 1000 * 60)

                    console.log("1/1 отработал")
                    break
                case "COMPLETION":

                    let place1
                    let place2
                    let place3
                    let place4

                    const final = await Match.findOne({tournament: tournament._id, stateTour: "1/1"})
                    place1 = final.winner
                    place2 = final.loser


                    const semiFinal1 = await Match.findOne({
                        tournament: tournament._id,
                        stateTour: "1/2",
                        winner: place1
                    })

                    place3 = semiFinal1.loser

                    const semiFinal2 = await Match.findOne({
                        tournament: tournament._id,
                        stateTour: "1/2",
                        winner: place2
                    })

                    place4 = semiFinal2.loser


                    const place1Obj = await User.findOne({_id: place1})
                    const place2Obj = await User.findOne({_id: place2})
                    const place3Obj = await User.findOne({_id: place3})
                    const place4Obj = await User.findOne({_id: place4})


                    const place1ObjFix = {
                        _id: place1Obj._id,
                        image: place1Obj.image,
                        nickname: place1Obj.nickname,
                        summonersName: place1Obj.summonersName
                    }
                    const place2ObjFix = {
                        _id: place2Obj._id,
                        image: place2Obj.image,
                        nickname: place2Obj.nickname,
                        summonersName: place2Obj.summonersName
                    }
                    const place3ObjFix = {
                        _id: place3Obj._id,
                        image: place3Obj.image,
                        nickname: place3Obj.nickname,
                        summonersName: place3Obj.summonersName
                    }
                    const place4ObjFix = {
                        _id: place4Obj._id,
                        image: place4Obj.image,
                        nickname: place4Obj.nickname,
                        summonersName: place4Obj.summonersName
                    }

                    const tournamentFinish = await Tournament.updateOne({_id: tournament._id},
                        {
                            $set: {
                                stateTour: "COMPLETION",
                                nextStateTour: "FINISH",
                                place1: place1ObjFix,
                                place2: place2ObjFix,
                                place34: [place3ObjFix, place4ObjFix]
                            }
                        }
                    )

                    let tournamentPrize1 = (tournament.prize) / 2
                    let tournamentPrize2 = (tournament.prize) / 2 / 2
                    let tournamentPrize34 = (tournament.prize) / 2 / 2 / 2 / 2

                    switch (tournament.game) {
                        case "lol":
                            tournament.participants.map(async (gamer, i) => {
                                const player = await User.updateOne({_id: gamer._id}, {
                                    $inc: {stat_lol_tournaments_played: 1}
                                })
                            })


                            switch (tournament.typeTour) {
                                case "Daily":
                                    const win1 = await User.updateOne({_id: place1}, {
                                        $inc: {
                                            redCoin: tournamentPrize1,
                                            stat_lol_total_RC: tournamentPrize1,
                                            stat_lol_tournaments_wins: 1,
                                            stat_lol_tournaments_prizer: 1,
                                            stat_lol_tournaments_rating: 100
                                        }
                                    })

                                    const win2 = await User.updateOne({_id: place2}, {
                                        $inc: {
                                            redCoin: tournamentPrize2,
                                            stat_lol_total_RC: tournamentPrize2,
                                            stat_lol_tournaments_prizer: 1,
                                            stat_lol_tournaments_rating: 50
                                        }
                                    })

                                    const win3 = await User.updateOne({_id: place3}, {
                                        $inc: {
                                            redCoin: tournamentPrize34,
                                            stat_lol_total_RC: tournamentPrize34,
                                            stat_lol_tournaments_prizer: 1,
                                            stat_lol_tournaments_rating: 25
                                        }
                                    })

                                    const win4 = await User.updateOne({_id: place4}, {
                                        $inc: {
                                            redCoin: tournamentPrize34,
                                            stat_lol_total_RC: tournamentPrize34,
                                            stat_lol_tournaments_prizer: 1,
                                            stat_lol_tournaments_rating: 25
                                        }
                                    })
                                    break
                                case "Premium":
                                    const win21 = await User.updateOne({_id: place1}, {
                                        $inc: {
                                            blueCoin: tournamentPrize1,
                                            stat_lol_total_BC: tournamentPrize1,
                                            stat_lol_tournaments_wins: 1,
                                            stat_lol_tournaments_prizer: 1,
                                            stat_lol_tournaments_rating: 500
                                        }
                                    })

                                    const win22 = await User.updateOne({_id: place2}, {
                                        $inc: {
                                            blueCoin: tournamentPrize2,
                                            stat_lol_total_BC: tournamentPrize2,
                                            stat_lol_tournaments_prizer: 1,
                                            stat_lol_tournaments_rating: 250
                                        }
                                    })

                                    const win23 = await User.updateOne({_id: place3}, {
                                        $inc: {
                                            blueCoin: tournamentPrize34,
                                            stat_lol_total_BC: tournamentPrize34,
                                            stat_lol_tournaments_prizer: 1,
                                            stat_lol_tournaments_rating: 125
                                        }
                                    })

                                    const win24 = await User.updateOne({_id: place4}, {
                                        $inc: {
                                            blueCoin: tournamentPrize34,
                                            stat_lol_total_BC: tournamentPrize34,
                                            stat_lol_tournaments_prizer: 1,
                                            stat_lol_tournaments_rating: 125
                                        }
                                    })
                                    break
                                case "Elite":
                                    const win31 = await User.updateOne({_id: place1}, {
                                        $inc: {
                                            blueCoin: tournamentPrize1,
                                            stat_lol_total_BC: tournamentPrize1,
                                            stat_lol_tournaments_wins: 1,
                                            stat_lol_tournaments_prizer: 1,
                                            stat_lol_tournaments_rating: 5000
                                        }
                                    })

                                    const win32 = await User.updateOne({_id: place2}, {
                                        $inc: {
                                            blueCoin: tournamentPrize2,
                                            stat_lol_total_BC: tournamentPrize2,
                                            stat_lol_tournaments_prizer: 1,
                                            stat_lol_tournaments_rating: 2500
                                        }
                                    })

                                    const win33 = await User.updateOne({_id: place3}, {
                                        $inc: {
                                            blueCoin: tournamentPrize34,
                                            stat_lol_total_BC: tournamentPrize34,
                                            stat_lol_tournaments_prizer: 1,
                                            stat_lol_tournaments_rating: 1000
                                        }
                                    })

                                    const win34 = await User.updateOne({_id: place4}, {
                                        $inc: {
                                            blueCoin: tournamentPrize34,
                                            stat_lol_total_BC: tournamentPrize34,
                                            stat_lol_tournaments_prizer: 1,
                                            stat_lol_tournaments_rating: 1000
                                        }
                                    })
                                    break
                                default:
                                    console.log('Что-то пошло не так')
                                    break
                            }

                            break
                        case "dota2":
                            tournament.participants.map(async (gamer, i) => {
                                const player = await User.updateOne({_id: gamer._id}, {
                                    $inc: {stat_dota2_tournaments_played: 1}
                                })

                                switch (tournament.typeTour) {
                                    case "Daily":
                                        const win1 = await User.updateOne({_id: place1}, {
                                            $inc: {
                                                redCoin: (tournament.prize) / 2,
                                                stat_dota2_total_RC: (tournament.prize) / 2,
                                                stat_dota2_tournaments_wins: 1,
                                                stat_dota2_tournaments_prizer: 1,
                                                stat_dota2_tournaments_rating: 100
                                            }
                                        })

                                        const win2 = await User.updateOne({_id: place2}, {
                                            $inc: {
                                                redCoin: (tournament.prize) / 2 / 2,
                                                stat_dota2_total_RC: (tournament.prize) / 2 / 2,
                                                stat_dota2_tournaments_prizer: 1,
                                                stat_dota2_tournaments_rating: 50
                                            }
                                        })

                                        const win3 = await User.updateOne({_id: place3}, {
                                            $inc: {
                                                redCoin: (tournament.prize) / 2 / 2 / 2 / 2,
                                                stat_dota2_total_RC: (tournament.prize) / 2 / 2 / 2 / 2,
                                                stat_dota2_tournaments_prizer: 1,
                                                stat_dota2_tournaments_rating: 25
                                            }
                                        })

                                        const win4 = await User.updateOne({_id: place4}, {
                                            $inc: {
                                                redCoin: (tournament.prize) / 2 / 2 / 2 / 2,
                                                stat_dota2_total_RC: (tournament.prize) / 2 / 2 / 2 / 2,
                                                stat_dota2_tournaments_prizer: 1,
                                                stat_dota2_tournaments_rating: 25
                                            }
                                        })
                                        break
                                    case "Premium":
                                        const win21 = await User.updateOne({_id: place1}, {
                                            $inc: {
                                                blueCoin: (tournament.prize) / 2,
                                                stat_dota2_total_BC: (tournament.prize) / 2,
                                                stat_dota2_tournaments_wins: 1,
                                                stat_dota2_tournaments_prizer: 1,
                                                stat_dota2_tournaments_rating: 500
                                            }
                                        })

                                        const win22 = await User.updateOne({_id: place2}, {
                                            $inc: {
                                                blueCoin: (tournament.prize) / 2 / 2,
                                                stat_dota2_total_BC: (tournament.prize) / 2 / 2,
                                                stat_dota2_tournaments_prizer: 1,
                                                stat_dota2_tournaments_rating: 250
                                            }
                                        })

                                        const win23 = await User.updateOne({_id: place3}, {
                                            $inc: {
                                                blueCoin: (tournament.prize) / 2 / 2 / 2 / 2,
                                                stat_dota2_total_BC: (tournament.prize) / 2 / 2 / 2 / 2,
                                                stat_dota2_tournaments_prizer: 1,
                                                stat_dota2_tournaments_rating: 125
                                            }
                                        })

                                        const win24 = await User.updateOne({_id: place4}, {
                                            $inc: {
                                                blueCoin: (tournament.prize) / 2 / 2 / 2 / 2,
                                                stat_dota2_total_BC: (tournament.prize) / 2 / 2 / 2 / 2,
                                                stat_dota2_tournaments_prizer: 1,
                                                stat_dota2_tournaments_rating: 125
                                            }
                                        })
                                        break
                                    case "Elite":
                                        const win31 = await User.updateOne({_id: place1}, {
                                            $inc: {
                                                blueCoin: (tournament.prize) / 2,
                                                stat_dota2_total_BC: (tournament.prize) / 2,
                                                stat_dota2_tournaments_wins: 1,
                                                stat_dota2_tournaments_prizer: 1,
                                                stat_dota2_tournaments_rating: 5000
                                            }
                                        })

                                        const win32 = await User.updateOne({_id: place2}, {
                                            $inc: {
                                                blueCoin: (tournament.prize) / 2 / 2,
                                                stat_dota2_total_BC: (tournament.prize) / 2 / 2,
                                                stat_dota2_tournaments_prizer: 1,
                                                stat_dota2_tournaments_rating: 2500
                                            }
                                        })

                                        const win33 = await User.updateOne({_id: place3}, {
                                            $inc: {
                                                blueCoin: (tournament.prize) / 2 / 2 / 2 / 2,
                                                stat_dota2_total_BC: (tournament.prize) / 2 / 2 / 2 / 2,
                                                stat_dota2_tournaments_prizer: 1,
                                                stat_dota2_tournaments_rating: 1000
                                            }
                                        })

                                        const win34 = await User.updateOne({_id: place4}, {
                                            $inc: {
                                                blueCoin: (tournament.prize) / 2 / 2 / 2 / 2,
                                                stat_dota2_total_BC: (tournament.prize) / 2 / 2 / 2 / 2,
                                                stat_dota2_tournaments_prizer: 1,
                                                stat_dota2_tournaments_rating: 1000
                                            }
                                        })
                                        break
                                    default:
                                        console.log('Что-то пошло не так')
                                        break
                                }
                            })
                            break
                        default:
                            console.log('Что-то пошло не так')
                            break
                    }

                    io.emit('CASH/UPDATE-HEADER')
                    io.emit('CASH/UPDATE-STAT')

                    io.emit('TOURNAMENTS/NEWSTATE', tournamentFinish.stateTour)

                    console.log("Завершение отработало")
                    break
                case "CANCELLATION":
                    const tournamentCancel = await Tournament.updateOne({_id: tournament._id},
                        {
                            $set: {
                                stateTour: "CANCELLATION",
                                nextStateTour: "CANCEL",
                            }
                        }
                    )
                    io.emit('TOURNAMENTS/NEWSTATE', tournamentCancel.stateTour)
                    console.log("Турнир отменён")
                    break
                default:
                    console.log('Что-то пошло не так')
                    break
            }

        }

        schedule.scheduleJob('*/60 * * * * *', async () => {
            try {
                console.log('\n')
                const nowDate = new Date()
                nowDate.setSeconds(0, 0)
                console.log("Время: ", nowDate)
                const tournaments = await Tournament.find({nextStateDate: nowDate})
                if (tournaments.length === 0) {
                    console.log("Турниров нет!")
                } else {
                    console.log("Нашло!")
                    tournaments.map(async (item) => {
                        await changeTournamentState(item)
                    })
                }
                console.log('\n')
            } catch (e) {
                console.log("В итерациях произошла ошибка")
            }
        })

        io.on('connection', async (socket) => {

            //Смена состояния турнира

            socket.on('TOURNAMENTS/STATECHANGE', async (tournamentId, state) => {
                try {
                    const tournament = await Tournament.updateOne({_id: tournamentId},
                        {
                            $set: {
                                stateTour: state,
                            }
                        }
                    )
                    io.emit('TOURNAMENTS/NEWSTATE', state)
                } catch (e) {
                    console.log("TOURNAMENTS/STATECHANGE")
                }
            })

            //Регистрация пользователя на турнир

            socket.on('TOURNAMENTS/REGISTRED', async (token, tournamentId) => {
                try {
                    const tournamentParticipants = await Tournament.findOne({_id: tournamentId})

                    const decoded = jwt.verify(token, config.get('jwtSecret'))

                    if (!tournamentParticipants.participants.includes(decoded.userId)) {

                        const tournament = await Tournament.updateOne(
                            {_id: tournamentId},
                            {$push: {participants: decoded.userId}}
                        )

                        const userTournament = await User.updateOne(
                            {_id: decoded.userId},
                            {$push: {tournaments: {tournamentId: tournamentId, status: "REGISTERED"}}}
                        )


                        io.emit('TOURNAMENTS/REGISTRED:RES', 'Пользователь зарегистрирован на турнир')
                    }
                } catch (e) {
                    console.log("TOURNAMENTS/REGISTRED")
                }
            })

            socket.on('TOURNAMENTS/CANCEL', async (token, tournamentId) => {
                try {
                    const tournamentParticipants = await Tournament.findOne({_id: tournamentId})

                    const decoded = jwt.verify(token, config.get('jwtSecret'))

                    if (tournamentParticipants.participants.includes(decoded.userId)) {

                        const tournament = await Tournament.updateOne(
                            {_id: tournamentId},
                            {$pull: {participants: decoded.userId}}
                        )

                        const userTournament = await User.updateOne(
                            {_id: decoded.userId},
                            {$pull: {tournaments: {tournamentId: tournamentId, status: "REGISTERED"}}}
                        )


                        io.emit('TOURNAMENTS/CANCEL:RES', 'Пользователь удалён на турнир')
                    }
                } catch (e) {
                    console.log("TOURNAMENTS/CANCEL")
                }
            })

            socket.on('TOURNAMENTS/CONFIRM', async (token, tournamentId) => {
                try {
                    const tournamentParticipants = await Tournament.findOne({_id: tournamentId})

                    const decoded = jwt.verify(token, config.get('jwtSecret'))

                    if (!tournamentParticipants.candidates.includes(decoded.userId) && tournamentParticipants.participants.includes(decoded.userId)) {

                        const tournament = await Tournament.updateOne(
                            {_id: tournamentId},
                            {$push: {candidates: decoded.userId}}
                        )

                        io.emit('TOURNAMENTS/CONFIRM:RES', 'Пользователь является участником турнира')
                    }
                } catch (e) {
                    console.log("TOURNAMENTS/CONFIRM")
                }
            })


            socket.on('TOURNAMENT/MATCHES', async (tournamentId) => {
                const tournament = await Tournament.findOne({_id: tournamentId})
                try {

                    let matchesArr = []
                    if (tournament.matches && tournament.matches != null) {

                        Promise.all(tournament.matches.map(async (matchId) => {

                                const match = await Match.findOne({_id: matchId})

                                if (match && match.participants[0] != null && match.participants[0]) {
                                    const gamer1 = await User.findOne({_id: match.participants[0]})
                                    match.participants[0] = gamer1
                                }

                                if (match && match.participants[1] != null && match.participants[1]) {
                                    const gamer2 = await User.findOne({_id: match.participants[1]})
                                    match.participants[1] = gamer2
                                }

                                return match
                            }
                        ))
                            .then((matchesArr) => matchesArr.sort((a, b) => a.stateTour > b.stateTour ? 1 : -1))
                            .then((matchesArr) => matchesArr.reverse())
                            .then((matchesArr) => io.emit('TOURNAMENT/MATCHES:RES', matchesArr))

                    }
                } catch (e) {
                    console.log("TOURNAMENT/MATCHES")
                }
            })

            socket.on('TOURNAMENT/MATCH', async (matchId) => {
                    try {

                        const match = await Match.findOne({_id: matchId})

                        if (match && match.participants[0] != null && match.participants[0]) {
                            const gamer1 = await User.findOne({_id: match.participants[0]})
                            match.participants[0] = gamer1
                        }

                        if (match && match.participants[1] != null && match.participants[1]) {
                            const gamer2 = await User.findOne({_id: match.participants[1]})
                            match.participants[1] = gamer2
                        }

                        io.emit('TOURNAMENT/MATCH:RES', match)
                    } catch (e) {
                        console.log("TOURNAMENT/MATCH")
                    }

                }
            )

            socket.on('TOURNAMENT/MATCH-WINNER', async (matchId, n) => {
                    try {
                        const match = await Match.findOne({_id: matchId})

                        let d

                        if (n === 0) {
                            d = 1
                        } else d = 0


                        const matchWinner = await Match.updateOne(
                            {_id: matchId},
                            {
                                $set: {
                                    winner: match.participants[n],
                                    loser: match.participants[d],
                                }
                            }
                        )

                        if (match.matchNumber % 2 != 0) {

                            const match3 = await Match.updateOne({_id: match.nextMatch},
                                {
                                    $pop: {
                                        participants: -1
                                    }
                                })

                            const match1 = await Match.updateOne({_id: match.nextMatch},
                                {
                                    $push: {
                                        participants: {
                                            $each: [match.participants[n]],
                                            $position: 0
                                        }
                                    }
                                }
                            )
                        } else {
                            const match4 = await Match.updateOne({_id: match.nextMatch},
                                {
                                    $pop: {
                                        participants: 1
                                    }
                                })

                            const match2 = await Match.updateOne({_id: match.nextMatch},
                                {
                                    $push: {
                                        participants: {
                                            $each: [match.participants[n]],
                                            $position: 1
                                        }
                                    }
                                }
                            )
                        }


                        io.emit('TOURNAMENT/MATCH-WINNER:RES')
                    } catch (e) {
                        console.log("TOURNAMENT/MATCH-WINNER")
                    }
                }
            )

            socket.on('TOURNAMENT/MATCH-RESET', async (matchId) => {
                try {
                    const match = await Match.findOne({_id: matchId})


                    if (match.matchNumber % 2 != 0) {

                        const match3 = await Match.updateOne({_id: match.nextMatch},
                            {
                                $pop: {
                                    participants: -1
                                }
                            })

                        const match1 = await Match.updateOne({_id: match.nextMatch},
                            {
                                $push: {
                                    participants: {
                                        $each: [null],
                                        $position: 0
                                    }
                                }
                            }
                        )
                    } else {
                        const match4 = await Match.updateOne({_id: match.nextMatch},
                            {
                                $pop: {
                                    participants: 1
                                }
                            })

                        const match2 = await Match.updateOne({_id: match.nextMatch},
                            {
                                $push: {
                                    participants: {
                                        $each: [null],
                                        $position: 1
                                    }
                                }
                            }
                        )
                    }

                    const matchWinner = await Match.updateOne(
                        {_id: matchId}, {$unset: {winner: 1, loser: 1}}, {multi: true});


                    io.emit('TOURNAMENT/MATCH-WINNER:RES')
                } catch (e) {
                    console.log("TOURNAMENT/MATCH-RESET")
                }
            })

            socket.on('TOURNAMENT/MATCH-SCREEN', async (matchId, screen) => {
                    try {

                        const match = await Match.updateOne({_id: matchId},
                            {
                                $set: {
                                    screen: screen
                                }
                            }
                        )

                        io.emit('TOURNAMENT/MATCH-SCREEN:RES')
                    } catch (e) {
                        console.log("TOURNAMENT/MATCH-SCREEN")
                    }
                }
            )

            socket.on('TOURNAMENT/MATCH-SCREEN', async (matchId, screen) => {
                    try {
                        const match = await Match.updateOne({_id: matchId},
                            {
                                $set: {
                                    screen: screen
                                }
                            }
                        )

                        io.emit('TOURNAMENT/MATCH-SCREEN:RES')
                    } catch (e) {
                        console.log("TOURNAMENT/MATCH-SCREEN")
                    }
                }
            )

            socket.on('TOURNAMENT/MESSAGE', async (matchIdProps, message, user, nickname) => {
                    try {

                        let matchId = matchIdProps.matchId

                        let date = new Date()

                        const messageCreate = new Message({
                            content: message,
                            user: user,
                            nickname: nickname,
                            match: matchId,
                            date: date,
                        })

                        const match = await Match.updateOne(
                            {_id: matchId},
                            {$push: {messages: messageCreate._id}}
                        )

                        await messageCreate.save();


                        io.emit('TOURNAMENT/MESSAGE:RES')
                    } catch (e) {
                        console.log("TOURNAMENT/MESSAGE")
                    }
                }
            )

            socket.on('TOURNAMENT/GET-MESSAGES', async (matchIdProps) => {
                    try {
                        let matchId = matchIdProps.matchId

                        const match = await Match.findOne(
                            {_id: matchId})


                        Promise.all(match.messages.map(async (messageId) => {

                                const message = await Message.findOne({_id: messageId})


                                return message
                            }
                        ))
                            .then((messageArr) => messageArr.sort((a, b) => b.date > a.date ? 1 : -1))
                            .then((messageArr) => io.emit('TOURNAMENT/GET-MESSAGES:RES', messageArr))

                    } catch (e) {
                        console.log("TOURNAMENT/GET-MESSAGES")
                    }
                }
            )

            socket.on('TOURNAMENT/PARTICIPANTS', async (tournamentId, search) => {
                    try {
                        console.log(search)
                        if (search === "" || search === null) {
                            const tournament = await Tournament.findOne({_id: tournamentId})

                            // console.log(tournament)

                            Promise.all(tournament.participants.map(async (participantId) => {

                                    const participant = await User.findOne({_id: participantId})
                                    return participant
                                }
                            ))
                                .then((participantsArr) => io.emit('TOURNAMENT/PARTICIPANTS:RES', participantsArr))
                        } else {

                            const tournament = await Tournament.findOne({_id: tournamentId})

                            // console.log(tournament)

                            Promise.all(tournament.participants.map(async (participantId) => {

                                    const participant = await User.findOne({
                                        _id: participantId,
                                        nickname: {$regex: search}
                                    })
                                    return participant
                                }
                            ))
                                .then((participantsArr) => participantsArr.filter(item => item!=null))
                                .then((participantsArr) => io.emit('TOURNAMENT/PARTICIPANTS:RES', participantsArr))

                        }
                    } catch (e) {
                        console.log("TOURNAMENT/PARTICIPANTS")
                    }
                }
            )

            //Конец
        })


    } catch
        (e) {
        console.log('Server error', e.message)
        process.exit(1)
    }
}

start()

