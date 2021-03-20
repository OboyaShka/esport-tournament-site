const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth.middleware')
const multer = require('multer')
const moment = require('moment')




router.post(
    '/',
    auth,
    async (req, res) => {
        try {
            console.log(req.files)
           if(req.files === null) {
               return res.status(400).json({msg: 'No file upload'})
           }

           const file = req.files.file
            console.log(file)
            file.mv(`${__dirname}/uploads/${file.name}`, err=>{
                if(err){
                    return res.status(500).json({message: e})
                }
            })

            res.json({ fileName: file.name, filePath: `/uploads/${file.name}`})
        } catch (e) {
            res.status(500).json({message: e})
        }
    })


module.exports = router