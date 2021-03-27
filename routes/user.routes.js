const {Router} = require('express')
const auth = require('../middleware/auth.middleware')
const router = Router()
const config = require('config')
const User = require('../models/User')

// /api/user/info
router.get(
    '/info',
    auth,
    async (req, res) => {
        try {

            const user = await User.findOne({_id: req.user.userId})
            res.json({user: user})

        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
        }
    })

router.get(
    '/:id',
    async (req, res) => {
        try {

            const user = await User.findOne({_id: req.params.id})

            res.json(user)

        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
        }
    })


// /api/user/edit
router.put(
    '/edit',
    auth,
    async (req, res) => {
        try {
            const {image, summonersName} = req.body

            console.log(summonersName)

            if(image != null) {
                const user = await User.updateOne({_id: req.user.userId},
                    {
                        $set: {
                            image: image
                        }
                    }
                )
            }

            if(summonersName != null) {
                const user = await User.updateOne({_id: req.user.userId},
                    {
                        $set: {
                            summonersName: summonersName
                        }
                    }
                )
            }

            res.status(201).json({message: 'Профиль отредактирован'})

        } catch (e) {
            res.status(500).json({message: e})
        }
    })

module.exports = router;