module.exports = async function auth(req, res, next) {
    const jwt = require('jsonwebtoken')
    const User = require('../models/User')
    const Token = require('../models/Token')
    try {
        //console.log(req.headers);
        const token = await (req.headers['authorization'].split(' ')[1])
        //const token = await req.headers
        // console.log(token);
        if (token == null) {
            return res.status(401).json({
                success: false,
                code: 401,
                message: "Belirtilen token BOŞ."
            })
        }
        const isToken = Token.findOne({ token: token })
        .then(async (err, docs) => {
            if (err) {
                res.json(err);
            } else if (docs) {
                res.status(401).json({
                    success: false,
                    code: 401,
                    message: "Çıkış yaptığınız tokenle giremezsiniz."
                })
            } else {
                const sonuc = jwt.verify(token, 'supersecret')
                const bulunan = await User.findById(sonuc.id)
                req.user = bulunan
                next()
            }
        })

    } catch (err) {
        if (err.message == 'invalid signature') {
            res.status(401).json({
                success: false,
                code: 401,
                message: "Belirtilen token hatalı."
            })
        } else if (err.name == 'TokenExpiredError') {
            res.status(401).json({
                success: false,
                code: 401,
                message: "Token tüketim tarihini doldurmuştur."
            })
        } else {
            console.log(err);
            res.status(401).json({
                success: false,
                code: 401,
                message: "Sistemin bilmediği bir hata oluştu."
            })
        }

    }
}