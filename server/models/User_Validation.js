const Joi = require('joi')

const signupValidation = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
})

module.exports = signupValidation