const {Router} = require('express')
const Tournament = require('../models/Tournament')
const Game = require('../models/Game')
const News = require('../models/News')
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
            const {title, topic, image, content, date} = req.body


            if (!req.user.userRoles.includes("ADMIN") && !req.user.userRoles.includes("MODERATOR")) {
                return res.status(403).json({message: 'У вас нет доступа'})
            }

            console.log({title, topic, image, content, date})

            const candidateNews = await Tournament.findOne({title})
            if (candidateNews) {
                return res.status(400).json({message: 'Такая новость уже существует'})
            }

            const news = new News(
                {
                    title: title,
                    topic: topic,
                    image: image,
                    content: content,
                    date: date,
                })

            await news.save()


            res.status(201).json({message: 'Новость создана'})

        } catch (e) {
            res.status(500).json({message: e})
        }
    })

// /api/news/edit
router.put(
    '/edit',
    auth,
    async (req, res) => {
        try {
            const {title, topic, image, content, OBJECT_ID} = req.body


            if (!req.user.userRoles.includes("ADMIN") && !req.user.userRoles.includes("MODERATOR")) {
                return res.status(403).json({message: 'У вас нет доступа'})
            }

            const news = await News.updateOne({_id: OBJECT_ID},
                {
                    $set: {
                        title: title,
                        topic: topic,
                        image: image,
                        content: content,
                    }
                }
            )


            res.status(201).json({message: 'Новость отредактирована'})

        } catch (e) {
            res.status(500).json({message: e})
        }
    })


// /api/news/delete
router.delete(
    '/delete',
    auth,
    async (req, res) => {
        try {
            const {newsId} = req.body

            if (!req.user.userRoles.includes("ADMIN") && !req.user.userRoles.includes("MODERATOR")) {
                return res.status(403).json({message: 'У вас доступа'})
            }

            const news = await News.findOneAndDelete({_id: newsId})

            res.status(204).json({message: 'Турнир удалён'})

        } catch (e) {
            res.status(500).json({message: e})
        }
    })


// /api/news
router.get('/', async (req, res) => {
    try {
        const news = await News.find()
        res.json(news)
    } catch (e) {
        res.status(500).json({message: e})
    }
})
//
// // /api/news/:id
router.get('/:id', async (req, res) => {
    try {
        const news = await News.findById(req.params.id)
        res.json(news)
    } catch (e) {
        res.status(500).json({message: e})
    }
})


module.exports = router