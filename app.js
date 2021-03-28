const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const fileUpload = require('express-fileupload')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const Tournament = require('./models/Tournament')

app.use(express.json({extended: true}))
app.use(fileUpload())

app.use('/api/upload', require('./routes/upload.routes'))
app.use('/api/user', require('./routes/user.routes'))
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/tournaments', require('./routes/tournaments.routes'))
app.use('/api/participants', require('./routes/participants.routes'))
app.use('/api/news', require('./routes/news.routes'))

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
        })


        http.listen( PORT, ()=> console.log(`App has been started on port ${PORT}...`))
    } catch (e) {
        console.log('Server error', e.message)
        process.exit(1)
    }
}

start()

