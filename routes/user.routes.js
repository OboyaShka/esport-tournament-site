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

module.exports = router;