const Todo = require('../models/Todo')
const jwt = require('jsonwebtoken')

const getAllTodos = (req, res) => {
    // console.log(req.user._id)
    Todo.find({user_id: req.user._id})
        .then((sonuc) => {            
            res.json(sonuc)
        })
        .catch(err => res.json(err))
}
const addTodo = async (req, res) => {
    if (req.err) {
        res.status(req.err.statusCode).json({
            success: false,
            code: 404,
            message: "Bir hata oluştu: " + req.err
        })

    } else {
        try {
            console.log(req.body)
            const todo = Todo.create({
                title: req.body.title,
                content: req.body.content,
                recommendation: req.body.recommendation,
                user_id: req.user._id
            })
                .then((todo) => {
                    res.status(200).json({
                        "success": true,
                        "code": 200,
                        "message": "Database'e ekleme yapıldı.",
                        "data": todo
                    })
                })
                .catch((err) => {
                    res.status(404).json({
                        "success": false,
                        "code": 404,
                        "message": "Görev eklenemedi: " + err,
                    })

                })
        } catch (err) {
            res.json(err)
            console.log(err);

        }
    }
}

const deleteTodo = async (req, res) => {
    if (req.err) {
        res.status(req.err.statusCode).json({
            success: false,
            code: 404,
            message: "Bir hata oluştu."
        })

    } else {
        try {
            console.log(req.body)
            Todo.findByIdAndDelete({ _id: req.body.id })
            .then((todo) => {
                res.status(200).json({
                    "success": true,
                    "code": 200,
                    "message": "Görev silindi",
                    "data": todo
                })
            })
            .catch((err) => {
                res.status(400).json({
                    "success": false,
                    "code": 400,
                    "message": "Görev silinemedi.",
                })

            })
        } catch (error) {
            res.json(err)
            console.log(err);
        }
        
    }
}

const updateTodo = async (req, res) => {
    if (req.err) {
        res.status(req.err.statusCode).json({
            success: false,
            code: 404,
            message: "Bir hata oluştu."
        })

    } else {
        try {
            const {title, content} = req.body
            // console.log("deeeee" + req.body.title + "req. conten" + req.body.content)
            Todo.findByIdAndUpdate(req.body.id, {title, content}, { new: true}) //güncellenmiş versiyon fönfürmesi için
            .then((todo) => {
                res.status(200).json({
                    "success": true,
                    "code": 200,
                    "message": "Görev günvellendi",
                    "data": todo
                })
            })
            .catch((err) => {
                res.status(400).json({
                    "success": false,
                    "code": 400,
                    "message": "Görev güncellenemedi.",
                })

            })
        } catch (error) {
            res.json(err)
            console.log(err);
        }
        
    }
}

const statusTodo = async (req, res) => {
    if (req.err) {
        res.status(req.err.statusCode).json({
            success: false,
            code: 404,
            message: "Bir hata oluştu."
        })

    } else {
        try {
            console.log("deeeee" + req.body.id + "req. conten" + req.body.status)
            Todo.findByIdAndUpdate(req.body.id, {status: req.body.status}, { new: true}) //güncellenmiş versiyon fönfürmesi için
            .then((todo) => {
                res.status(200).json({
                    "success": true,
                    "code": 200,
                    "message": "Görev günvellendi",
                    "data": todo
                })
            })
            .catch((err) => {
                res.status(400).json({
                    "success": false,
                    "code": 400,
                    "message": "Görev güncellenemedi.",
                })

            })
        } catch (error) {
            res.json(err)
            console.log(err);
        }
        
    }
}

module.exports = {
    getAllTodos,
    addTodo,
    deleteTodo,
    updateTodo,
    statusTodo
}