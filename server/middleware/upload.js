const multer= require("multer")
const path = require("path")
const fs = require('fs')

const uploadDir = path.join(__dirname, "uploads")
if(!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir)
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,uploadDir)
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})


const fileFilter = (req, file, cb) => {
    const tipler = ["image/jpeg", "image/png", "application/pdf"]
    if(tipler.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error("İzin erilen dosya tipleri: jpeg, png, pdf"), false)
    }
}

const upload = multer({storage, fileFilter})

module.exports = upload