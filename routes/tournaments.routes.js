const {Router} = require('express')
const Tournament = require('../models/Tournament')
const Game = require('../models/Game')
const User = require('../models/User')
const Role = require('../models/Role')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const router = Router()
const auth = require('../middleware/auth.middleware')


// /api/tournaments/create
router.post(
    '/create',
    auth,
    async (req, res) => {
        try {
            const {title, game, description, image, date} = req.body


            if (!req.user.userRoles.includes("ADMIN") && !req.user.userRoles.includes("MODERATOR")) {
                return res.status(403).json({message: 'У вас доступа'})
            }

            const candidate = await Tournament.findOne({title})
            if (candidate) {
                return res.status(400).json({message: 'Такой турнир уже существует'})
            }

            const candidateGame = await Game.findOne({value: game})

            if (!candidateGame) {
                return res.status(400).json({message: 'Такой игры нет'})
            }

            const tournament = new Tournament(
                {
                    title: title,
                    game: game,
                    description: description,
                    image: image,
                    participants: [],
                    date: date
                })

            await tournament.save()


            res.status(201).json({message: 'Турнир создан'})

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
            {const tournamentParticipants = await Tournament.findOne({_id: tournamentId})
            if(option === "add")
            {

                if(tournamentParticipants.participants.includes(req.user.userId)) {
                    return res.status(400).json({message: 'Пользователь уже зарегистрирован'})
                }


                const tournament = await Tournament.updateOne(
                    {_id: tournamentId},
                    {$push: {participants: req.user.userId}}
                )

                const userTournament = await User.updateOne(
                    {_id: req.user.userId},
                    {$push: {tournaments: tournamentId}}
                )

                res.status(201).json({message: 'Пользователь добавлен в турнир'})}
            else
            {
                if(!tournamentParticipants.participants.includes(req.user.userId)) {
                    return res.status(400).json({message: 'Пользователь не зарегистрирован на турнире'})
                }


                const tournament = await Tournament.findOneAndUpdate(
                    {_id: tournamentId},
                    {$pull: {participants: req.user.userId}}
                )

                const userTournament = await User.findOneAndUpdate(
                    {_id: req.user.userId},
                    {$pull: {tournaments: tournamentId}}
                )

                res.status(201).json({message: 'Пользователь удалён с турнира'})}
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