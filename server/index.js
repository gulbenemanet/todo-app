const express = require('express')
const app = express();
const cors = require('cors');
const router = require('./routes/routes');
const dotenv = require('dotenv');
app.use(cors());
app.use(express.urlencoded({
    'extended': 'true'
}));
app.use(express.json());
dotenv.config();
require('./config/db_connection')
app.use('/', router);

app.listen(process.env.PORT, () => {
    console.log('Sunucu ayağa kaldırıldı.');
})