const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("DB'ye bağlanldı"))
    .catch(err => console.log("DB'ye bağlanırken hata oluştu: " + err))