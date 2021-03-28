const {Router} = require('express')
const router = Router()
const User = require('../models/User')

// /api/participants/
router.post(
    '/',
    async (req, res) => {
        try {
            const {participants, tournamentId} = req.body

            const participant = await User.find({_id: {$in: participants}})



            let participantInfo = []

            participant.forEach((participant, i) => {

                let tournamentInfo = participant.tournaments.find(city => city.tournamentId == tournamentId)

                console.log(tournamentInfo)

                participantInfo.push({
                    id: participant.id,
                    nickname: participant.nickname,
                    image: participant.image,
                    tournaments: tournamentInfo
                })

            })

            //res.json({participant: participantInfo})

            res.json(participantInfo)
        } catch (e) {
            res.status(500).json({message: e})
        }
    })

module.exports = router