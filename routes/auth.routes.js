const {Router} = require('express')
const User = require('../models/User')
const Role = require('../models/Role')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const {check, validationResult} = require('express-validator')
const router = Router()
const StateUser = require('../models/StateUser')

// /api/auth/register
router.post(
    '/register',
    [
        check('nickname', 'Минимальная длина имени 4 символа')
            .isLength({min: 4}),
        check('email', 'Некорректный email').isEmail(),
        check('password', 'Минимальная длина пароля 6 символов')
            .isLength({min: 6})
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при регистрации'
                })
            }
            const {nickname, email, password} = req.body

            const candidateName = await User.findOne({nickname})
            const candidate = await User.findOne({email})

            if (candidate) {
                return res.status(400).json({message: 'Такой e-mail уже зарегестрирован'})
            }

            if (candidateName) {
                return res.status(400).json({message: 'Пользователь с таким именем уже существует'})
            }


            const userRole = await Role.findOne({value: "USER"})
            const hashedPassword = await bcrypt.hash(password, 12)
            const user = new User({
                nickname,
                email,
                password: hashedPassword,
                image: "/default_icon.svg",
                roles: [userRole.value],
                tournaments: [],
                summonersName: null,
                steamID: null,
                redCoin: 0,
                blueCoin: 0,
                stat_lol_tournaments_played: 0,
                stat_lol_tournaments_wins: 0,
                stat_lol_tournaments_prizer: 0,
                stat_lol_tournaments_rating: 0,
                stat_lol_total_RC: 0,
                stat_lol_total_BC: 0,
                stat_dota2_tournaments_played: 0,
                stat_dota2_tournaments_wins: 0,
                stat_dota2_tournaments_prizer: 0,
                stat_dota2_tournaments_rating: 0,
                stat_dota2_total_RC: 0,
                stat_dota2_total_BC: 0,
                stat_csgo_tournaments_played:0,
                stat_csgo_tournaments_wins:0,
                stat_csgo_tournaments_prizer:0,
                stat_csgo_tournaments_rating:0,
                stat_csgo_total_RC:0,
                stat_csgo_total_BC:0,
            })

            await user.save()

            res.status(201).json({message: 'Ползователь создан'})

        } catch (e) {
            res.status(500).json({message: e})
        }
    })

// /api/auth/login
router.post(
    '/login',
    [
        check('email', 'Введите корректный email').normalizeEmail().isEmail(),
        check('password', 'Введите пароль').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при входе в систему'
                })
            }

            const {email, password} = req.body

            const user = await User.findOne({email})

            // const users = await User.find()
            //
            // Promise.all(users.map(async (us) => {
            //
            //         return `"${us._id}"`
            //     }
            // ))
            //     .then((usersID) => console.log(usersID))

            if (!user) {
                return res.status(400).json({message: 'Пользователь не найден'})
            }

            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.status(400).json({message: 'Неверный пароль, попробуйте снова'})
            }

            const token = jwt.sign(
                {userId: user.id, userRoles: user.roles},
                config.get('jwtSecret'),
                {expiresIn: '24h'}
            )

            res.json({
                token,
                userId: user.id,
                userRoles: user.roles,
                userNickname: user.nickname,
                userAvatar: user.image,
                redCoin: user.redCoin,
                blueCoin: user.blueCoin
            })

        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
        }
    })

module.exports = router