const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Token = require('../models/Token')

const getAllUsers = (req, res) => {
    User.find()
        .then(sonuc => res.json(sonuc))
}

const signUp = async (req, res) => {
    if (req.err) {
        // console.log(req.err);
        if (req.err.details[0].type == 'any.required') {
            res.status(req.err.statusCode).json({
                success: false,
                code: 400,
                message: "Lütfen bütün alanları doldurun."
            })
        } else if (req.err.details[0].type == 'string.username') {
            res.status(req.err.statusCode).json({
                success: false,
                code: 400,
                message: "Lütfen geçerli bir username girin."
            })
        }
    } else {
        try {
            // console.log(req.body)
            var hashedPassword = await bcrypt.hash(req.body.password, 8);
            const user = User.create({
                username: req.body.username,
                password: hashedPassword
            })
                .then((user) => {
                    const token = jwt.sign({
                        id: user._id
                    }, 'supersecret', {
                        expiresIn: '24h'
                    })
                    res.status(200).json({
                        "success": true,
                        "code": 200,
                        "message": "Database'e ekleme yapıldı.",
                        "data": {
                            profile: user,
                            token: token
                        }
                    })
                })
                .catch((err) => {
                    if (err.code == 11000) {
                        res.status(409).json({
                            "success": false,
                            "code": 409,
                            "message": `Daha önceden bu ${Object.keys(err.keyPattern)[0]} ile kaydolunmuş.`,
                        })
                    } else if (err) {
                        res.json(err)
                    }
                })
        } catch (err) {
            res.json(err)
            console.log(err);

        }
    }
}

const signIn = async (req, res) => {
    const user = await User.findOne({ username: req.body.username })
        .then(async (user) => {
            if (!user) {
                res.status(404).json({
                    "success": false,
                    "code": 404,
                    "message": "Verilen userName bilgileri hatalıdır."
                })
            } else {
                bcrypt.compare(req.body.password, user.password, (error, result) => {
                    if (error) {
                        res.json(error)
                    } else if (!result) {
                        res.status(404).json({
                            "success": false,
                            "code": 404,
                            "message": "Verilen password bilgileri hatalıdır.",
                        })  // şifre hatalı
                    } else if (result) {
                        const token = jwt.sign({ id: user._id }, 'supersecret', {
                            expiresIn: '24h'
                        })
                        res.status(200).json({
                            "success": true,
                            "code": 200,
                            "message": "Girişiniz başarıyla yapıldı.",
                            "data": {
                                profile: user,
                                token: token
                            }
                        })

                    }

                })
            }
        }).catch((err) => {
            res.json(err)
        })
}

const me = (req, res) => {
    res.json(req.user)
}

const logOut = async (req, res) => {
    const headersToken = await req.headers['authorization'].split(' ')[1];    
    const token = Token.create({
        token: headersToken
    })
        .then((docs) => {
            // console.log(docs);
            res.status(200).json({
                "success": true,
                "code": 200,
                "message": "Çıkış işlemi başarıyla yapıldı."
            })

        })
        .catch((err) => {
            if (err) {
                res.json(err)
            }
        })
}

const errorG = (req, res) => {
    res.json('Hata :(')
}

module.exports = {
    getAllUsers,
    signUp,
    signIn,
    me,
    errorG,
    logOut
}