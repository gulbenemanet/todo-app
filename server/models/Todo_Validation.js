const Joi = require('joi')

const todoValidation = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().email().required(),
    recommendation: Joi.string().required(),
    status: Joi.string().required(),
    user_id: Joi.string().required(),
    file: Joi.string()
})

module.exports = todoValidation