require('dotenv').config({path: __dirname + '/../.env'}); 

module.exports = {
    secret: process.env.SECRET_TOKEN
}