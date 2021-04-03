const {Router} = require('express')
const auth = require('../middleware/auth.middleware')
const router = Router()
const config = require('config')
const User = require('../models/User')
const Tournament = require('../models/Tournament')



// /api/user/tour
router.get(
    '/tournaments',
    auth,
    async (req, res) => {
        try {


            const tournaments = await Tournament.find({participants: req.user.userId})



            res.json(tournaments)

        } catch (e) {
            res.status(500).json(e)
        }
    })

module.exports = router;