const {Router} = require('express')
const Tournament = require('../models/Tournament')
const Game = require('../models/Game')
const User = require('../models/User')
const StateTour = require('../models/StateTour')
const Role = require('../models/Role')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const router = Router()
const auth = require('../middleware/auth.middleware')
const moment = require('moment')

// /api/tournaments/create
router.post(
    '/create',
    auth,
    async (req, res) => {
        try {
            const {title, game, typeTour, description, image, date} = req.body


            if (!req.user.userRoles.includes("ADMIN") && !req.user.userRoles.includes("MODERATOR")) {
                return res.status(403).json({message: 'У вас нет доступа'})
            }

            const candidate = await Tournament.findOne({title})
            if (candidate) {
                return res.status(400).json({message: 'Такой турнир уже существует'})
            }

            const candidateGame = await Game.findOne({value: game})

            if (!candidateGame) {
                return res.status(400).json({message: 'Такой игры нет'})
            }

            const stateTour = await StateTour.findOne({value: "WAITING"})

            const tournament = new Tournament(
                {
                    title: title,
                    game: game,
                    typeTour: typeTour,
                    stateTour: stateTour.value,
                    description: description,
                    image: image,
                    participants: [],
                    date: date,
                    nextStateDate: moment(date).subtract(1, 'minutes').toDate().setSeconds(0, 0),
                    nextStateTour: "CONFIRMATION"
                })

            await tournament.save()


            res.status(201).json({message: 'Турнир создан'})

        } catch (e) {
            res.status(500).json({message: e})
        }
    })

// /api/tournaments/edit
router.put(
    '/edit',
    auth,
    async (req, res) => {
        try {
            const {title, game, typeTour, description, image, date, OBJECT_ID} = req.body


            if (!req.user.userRoles.includes("ADMIN") && !req.user.userRoles.includes("MODERATOR")) {
                return res.status(403).json({message: 'У вас нет доступа'})
            }

            const tournament = await Tournament.updateOne({_id: OBJECT_ID},
                {
                    $set: {
                        title: title,
                        game: game,
                        typeTour: typeTour,
                        description: description,
                        image: image,
                        date: date,
                        nextStateDate: moment(date).subtract(1, 'minutes').toDate().setSeconds(0, 0),
                        nextStateTour: "CONFIRMATION"
                    }
                }
            )


            res.status(201).json({message: 'Турнир отредактирован'})

        } catch (e) {
            res.status(500).json({message: e})
        }
    })

// /api/tournaments/delete
router.delete(
    '/delete',
    auth,
    async (req, res) => {
        try {
            const {tournamentId} = req.body

            if (!req.user.userRoles.includes("ADMIN") && !req.user.userRoles.includes("MODERATOR")) {
                return res.status(403).json({message: 'У вас доступа'})
            }

            const tournament = await Tournament.findOneAndDelete({_id: tournamentId})

            res.status(204).json({message: 'Турнир удалён'})

        } catch (e) {
            res.status(500).json({message: e})
        }
    })

// /api/tournaments/adding
router.put(
    '/accept',
    auth,
    async (req, res) => {
        try {
            const {tournamentId, option} = req.body
            {
                const tournamentParticipants = await Tournament.findOne({_id: tournamentId})
                switch(option){
                    case "add":
                        if (tournamentParticipants.participants.includes(req.user.userId)) {
                            return res.status(400).json({message: 'Пользователь уже зарегистрирован'})
                        }


                        const tournament = await Tournament.updateOne(
                            {_id: tournamentId},
                            {$push: {participants: req.user.userId}}
                        )

                        const userTournament = await User.updateOne(
                            {_id: req.user.userId},
                            {$push: {tournaments: {tournamentId: tournamentId, status: "REGISTERED"} }}
                        )

                        res.status(201).json({message: 'Пользователь добавлен в турнир'})

                        break
                    case "delete":
                        if (!tournamentParticipants.participants.includes(req.user.userId)) {
                            return res.status(400).json({message: 'Пользователь не зарегистрирован на турнире'})
                        }


                        const tournamentDel = await Tournament.findOneAndUpdate(
                            {_id: tournamentId},
                            {$pull: {participants: req.user.userId}}
                        )

                        const userTournamentDel = await User.findOneAndUpdate(
                            {_id: req.user.userId},
                            {$pull: {tournaments: {tournamentId: tournamentId, status: "REGISTERED"}}}
                        )

                        res.status(201).json({message: 'Пользователь удалён с турнира'})
                        break
                    case "confirm":
                        if (!tournamentParticipants.participants.includes(req.user.userId)) {
                            return res.status(400).json({message: 'Пользователь не зарегистрирован на турнире'})
                        }

                        const userTournamentConfirm = await User.findOneAndUpdate(
                            {_id: req.user.userId},
                            {$set: {tournaments: {tournamentId: tournamentId, status: "ACCEPTED"}}}
                        )

                        break

                }

            }
        } catch (e) {
            res.status(500).json({message: e})
        }
    })


// /api/tournaments
router.get('/', async (req, res) => {
    try {
        const tournaments = await Tournament.find()
        res.json(tournaments)
    } catch (e) {
        res.status(500).json({message: e})
    }
})

// /api/tournaments/:id
router.get('/:id', async (req, res) => {
    try {
        const tournament = await Tournament.findById(req.params.id)
        res.json(tournament)
    } catch (e) {
        res.status(500).json({message: e})
    }
})


module.exports = router