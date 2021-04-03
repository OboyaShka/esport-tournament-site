const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const fileUpload = require('express-fileupload')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const Tournament = require('./models/Tournament')
const User = require('./models/User')
const jwt = require('jsonwebtoken')

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

async function start(){
    try{
        await mongoose.connect(config.get('mongoUri'),{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })

        io.on('connection', async (socket)=>{
            socket.on('TOURNAMENTS/STATECHANGE', async ( tournamentId, state ) => {

                const tournament = await Tournament.updateOne({_id: tournamentId},
                    {
                        $set: {
                            stateTour: state,
                        }
                    }
                )
                io.emit('TOURNAMENTS/NEWSTATE', state)
            })

            socket.on('TOURNAMENTS/REGISTRED', async ( token, tournamentId ) => {

                const tournamentParticipants = await Tournament.findOne({_id: tournamentId})

                const decoded = jwt.verify(token, config.get('jwtSecret'))

                if (!tournamentParticipants.participants.includes(decoded.userId)) {

                    const tournament = await Tournament.updateOne(
                        {_id: tournamentId},
                        {$push: {participants: decoded.userId}}
                    )

                    const userTournament = await User.updateOne(
                        {_id: decoded.userId},
                        {$push: {tournaments: {tournamentId: tournamentId, status: "REGISTERED"} }}
                    )

                    io.emit('TOURNAMENTS/REGISTRED:RES', 'Пользователь зарегистрирован на турнир')
                }
            })
        })


        http.listen( PORT, ()=> console.log(`App has been started on port ${PORT}...`))
    } catch (e) {
        console.log('Server error', e.message)
        process.exit(1)
    }
}

start()

