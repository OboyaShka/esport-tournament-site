const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth.middleware')
const multer = require('multer')
const moment = require('moment')


router.post(
    '/',
    async (req, res) => {
        try {

            if (req.files === null) {
                return res.status(400).json({message: 'Нет загруженного файла'})
            }


            const file = req.files.file

            const date = moment().format('DDMMYYYY-HHmmss_SSS')

            const nameFile = `${date}-${file.name}`

            if (!(file.mimetype === 'image/png') && !(file.mimetype === 'image/jpeg') && !(file.mimetype === 'image/jpg')) {
                return res.status(400).json({message: 'Файл не является картинкой'})
            }

            if (file.size > 1024 * 1024 * 5) {
                return res.status(400).json({message: 'Файл слишком большой'})
            }

            if (process.env.NODE_ENV === 'production') {
                file.mv(`esport-tournament-site/client/public/uploads/${nameFile}`, e => {
                    if (e) {
                        return res.status(500).json({message: e})
                    }
                })
            } else {
                file.mv(`C:/Users/OboyaShka/WebstormProjects/esport-tournament-site/client/public/uploads/${nameFile}`, e => {
                    if (e) {
                        return res.status(500).json({message: e})
                    }
                })
            }


            res.json({fileName: file.name, filePath: `/uploads/${nameFile}`})
        } catch (e) {
            res.status(500).json({message: "Что-то пошло не так"})
        }
    })


module.exports = router