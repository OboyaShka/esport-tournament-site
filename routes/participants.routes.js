const {Router} = require('express')
const router = Router()
const User = require('../models/User')

// /api/participants/
router.post(
    '/',
    async (req, res) => {
        try {
            const {participants} = req.body

            const participant = await User.find({_id: {$in: participants}})

            let participantInfo = []

            participant.forEach((participant, i) => {
                participantInfo.push({
                    id: participant.id,
                    nickname: participant.nickname,
                    image: participant.image
                })
                // participant = {
                //     id: participant.id,
                //     nickname: participant.nickname,
                //     image: participant.image
                // }
            })

            //res.json({participant: participantInfo})

            res.json(participantInfo)
        } catch (e) {
            res.status(500).json({message: e})
        }
    })

module.exports = router