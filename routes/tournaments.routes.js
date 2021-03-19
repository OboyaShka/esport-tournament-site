const {Router} = require('express')
const Tournament = require('../models/Tournament')
const Game = require('../models/Game')
const User = require('../models/User')
const Role = require('../models/Role')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const router = Router()

// /api/tournaments/create
router.post(
    '/create',
    async (req, res) => {
        try {
            const {token, title, game, description , image, participants, date} = req.body

            const decoded = jwt.verify(token, config.get('jwtSecret'));

            if (!decoded.userRoles.includes("ADMIN") && !decoded.userRoles.includes("MODERATOR")){
                return res.status(403).json({message: 'У вас доступа'})
            }

            const candidate = await Tournament.findOne({title})
            if (candidate) {
                return res.status(400).json({message: 'Такой турнир уже существует'})
            }

            const candidateGame = await Game.findOne({value:  game})

            if (!candidateGame) {
                return res.status(400).json({message: 'Такой игры нет'})
            }

            const tournament = new Tournament(
                {title: title,
                    game: game,
                    description: description,
                    image: image,
                    participants: participants,
                    date: date})

            await tournament.save()


            res.status(201).json({message: 'Турнир создан'})

        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
        }
    })


module.exports = router