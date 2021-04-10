const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const fileUpload = require('express-fileupload')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const Tournament = require('./models/Tournament')
const Match = require('./models/Match')
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
            return arr.map(i=>[Math.random(), i]).sort().map(i=>i[1])
        }

        const createBracket = async (tournament, format) => {

            const participantRandom = mixArr(tournament.participants)

            let p = -1
            while(participantRandom.length < format){
                participantRandom.splice(p, 0, null);
                p = p - 2
            }


            let flag = true
            let l = 1
            while (format >= 2) {
                for (let i = 0; i < format; i = i + 2) {

                    if (flag) {
                        const match = new Match(
                            {
                                tournament: tournament._id,
                                matchNumber: l,
                                stateTour: `1/${format}`,
                                participants: [participantRandom[i], participantRandom[i + 1]],
                                startDate: moment(tournament.nextStateDate).add(1, 'minutes').toDate().setSeconds(0, 0),
                            })
                        const tournamentPrep = await Tournament.updateOne(
                            {_id: tournament._id},
                            {$push: {matches: match.id}}
                        )
                        l++

                        await match.save()

                    } else {
                        const matches = await Match.find({stateTour: `1/${format * 2}`})

                        const matchNow = new Match(
                            {
                                tournament: tournament._id,
                                matchNumber: l,
                                stateTour: `1/${format}`,
                                prevMatches: [matches[i]._id, matches[i + 1]._id],
                            })

                        await matchNow.save()

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
                    let nextStage
                    switch (true) {
                        case tournament.participants.length < 8:
                            nextStage = "CANCELLATION"
                            console.log("Слишком мало людей")
                            break;
                        case tournament.participants.length === 8:
                            await createBracket(tournament, 8)

                            nextStage = "1/8//"
                            console.log("Сетка для топ 8")
                            break;
                        case 8 < tournament.participants.length <= 16:

                            await createBracket(tournament, 16)

                            nextStage = "1/16"
                            console.log("Сетка для топ 16")
                            break;
                        case 17 <= tournament.participants.length <= 32:
                            nextStage = "1/32"
                            console.log("Сетка для топ 32")
                            break;
                        case 33 <= tournament.participants.length <= 64:
                            nextStage = "1/64"
                            console.log("Сетка для топ 64")
                            break;
                    }
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
                    const tournament16 = await Tournament.updateOne({_id: tournament._id},
                        {
                            $set: {
                                stateTour: "1/16",
                                nextStateTour: "1/8",
                                nextStateDate: moment(tournament.nextStateDate).add(3, 'minutes').toDate().setSeconds(0, 0),
                            }
                        }
                    )
                    io.emit('TOURNAMENTS/NEWSTATE', tournament16.stateTour)


                    // setTimeout(async ()=>{
                    //     setInterval(async ()=>{
                    //         const matches = await Match.find({winner: {$exists: false}})
                    //         let a = 0
                    //         if(matches.length != 0){
                    //             const tournament16 = await Tournament.updateOne({_id: tournament._id},
                    //                 {
                    //                     $set: {
                    //                         nextStateDate: moment(tournament.nextStateDate).add(3 + a, 'minutes').toDate().setSeconds(0, 0),
                    //                     }
                    //                 }
                    //             )
                    //             a++
                    //             io.emit('TOURNAMENTS/NEWSTATE', tournament16.stateTour)
                    //         }
                    //     },1000*60)
                    // }, 1000 * 60 * 1)

                    console.log("1/16 отработал")
                    break
                case "1/8":
                    const tournament8 = await Tournament.updateOne({_id: tournament._id},
                        {
                            $set: {
                                stateTour: "1/8",
                                nextStateTour: "1/4",
                                nextStateDate: moment(tournament.nextStateDate).add(5, 'minutes').toDate().setSeconds(0, 0),
                            }
                        }
                    )
                    io.emit('TOURNAMENTS/NEWSTATE', tournament8.stateTour)
                    console.log("1/8 отработал")
                    break
                case "1/4":
                    const tournament4 = await Tournament.updateOne({_id: tournament._id},
                        {
                            $set: {
                                stateTour: "1/4",
                                nextStateTour: "1/2",
                                nextStateDate: moment(tournament.nextStateDate).add(5, 'minutes').toDate().setSeconds(0, 0),
                            }
                        }
                    )
                    io.emit('TOURNAMENTS/NEWSTATE', tournament4.stateTour)
                    console.log("1/4 отработал")
                    break
                case "1/2":
                    const tournament2 = await Tournament.updateOne({_id: tournament._id},
                        {
                            $set: {
                                stateTour: "1/2",
                                nextStateTour: "COMPLETION",
                                nextStateDate: moment(tournament.nextStateDate).add(5, 'minutes').toDate().setSeconds(0, 0),
                            }
                        }
                    )
                    io.emit('TOURNAMENTS/NEWSTATE', tournament2.stateTour)
                    console.log(tournament.participants.length)
                    console.log("1/2 отработал")
                    break
                case "COMPLETION":
                    const tournamentFinish = await Tournament.updateOne({_id: tournament._id},
                        {
                            $set: {
                                stateTour: "COMPLETION",
                                nextStateTour: "FINISH",
                            }
                        }
                    )
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
        })

        io.on('connection', async (socket) => {

            // connection.on("open", async () => {
            //     console.log("connected to Mongo")
            //     const stream = connection.collection("tournaments").watch()
            //
            //
            //
            //
            //     //[{$match: { game: "League of Legends" }}]
            //
            //     // stream.on("change", (change) => {
            //     //     console.log(1)
            //     // })
            //
            //     // stream.on( 'change', async (item) =>{
            //     //     console.log(item)
            //     // })
            //
            //     // stream.on( '', ( item ) =>{
            //     //     console.log(item)
            //     // } )
            //
            //     // stream.insert({title: "Турнир 1"}, () =>{
            //     //     console.log(1)
            //     // } )
            //
            //
            //     // stream.on("change", (change) => {
            //     //     console.log(change)
            //     // })
            //
            // })


            socket.on('TOURNAMENTS/STATECHANGE', async (tournamentId, state) => {

                const tournament = await Tournament.updateOne({_id: tournamentId},
                    {
                        $set: {
                            stateTour: state,
                        }
                    }
                )
                io.emit('TOURNAMENTS/NEWSTATE', state)
            })

            socket.on('TOURNAMENTS/REGISTRED', async (token, tournamentId) => {

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
            })
        })


    } catch
        (e) {
        console.log('Server error', e.message)
        process.exit(1)
    }
}

start()

