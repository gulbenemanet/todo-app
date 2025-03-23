const express = require('express')
const app = express();
const cors = require('cors');
const router = require('./routes/routes');
const dotenv = require('dotenv');
dotenv.config();
require('./config/token_black_list_interval')

app.use(cors());
app.use(express.urlencoded({
    'extended': 'true'
}));
app.use(express.json());

require('./config/db_connection')
app.use('/', router);

app.listen(process.env.PORT, () => {
    console.log('Sunucu ayağa kaldırıldı.');
})