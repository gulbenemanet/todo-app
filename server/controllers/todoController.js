const Todo = require('../models/Todo')
const jwt = require('jsonwebtoken')
require('dotenv').config();
const path = require("path")

// const OpenAI = require('openai')
const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");
// const openai = new OpenAI({
//     apiKey: " ",
// })
// async function getCompletion(content) {
//     try {
//         const completion = await openai.chat.completions.create({
//             model: "gpt-4o-mini",
//             messages: [
//                 { role: "user", content: `Generate recommendations based on the to-do content: ${content}` },
//             ],
//         });

//         console.log(completion.choices[0].message);
//     } catch (error) {
//         console.error("Error:", error);
//     }
// }

const apiKey = process.env.API_KEY
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

async function getCompletion(content) {
    const chatSession = model.startChat({
        generationConfig,
        history: [
        ],
    });

    const result = await chatSession.sendMessage(`Generate a single-sentence recommendation based on the to-do content, focusing on either suggested priority, potential categorization, or a helpful tip in only Turkish: ${content}`);
    // console.log(result.response.text());
    return result.response.text();
}

const getAllTodos = (req, res) => {
    // console.log(req.user._id)
    Todo.find({ user_id: req.user._id })
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
            // console.log(req.file)
            const result = await getCompletion(req.body.content)
            // console.log(result)

            const filePath = req.file ? req.file.path : null

            const todo = Todo.create({
                title: req.body.title,
                content: req.body.content,
                recommendation: result,
                user_id: req.user._id,
                file: filePath
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
            // console.log(req.body)
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
            const { title, content } = req.body
            const recommendation = await getCompletion(req.body.content)
            // console.log("deeeee" + req.body.title + "req. conten" + req.body.content)
            // console.log(recommendation);

            Todo.findByIdAndUpdate(req.body.id, { title, content, recommendation }, { new: true }) //güncellenmiş versiyon fönfürmesi için
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
            // console.log("deeeee" + req.body.id + "req. conten" + req.body.status)
            Todo.findByIdAndUpdate(req.body.id, { status: req.body.status }, { new: true }) //güncellenmiş versiyon fönfürmesi için
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

const searchTodos = async (req, res) => {
    try {
        // console.log(req.params)
        const aranacak = req.params.aranacak;
        // console.log(typeof(aranacak))
        Todo.find({
            user_id: req.user._id,
            $or: [
                { title: { $regex: aranacak, $options: 'i' } },
                { content: { $regex: aranacak, $options: 'i' } }
            ]
        })
            .then(sonuc => res.json(sonuc))
            .catch((err) => {
                res.status(404).json({
                    "success": false,
                    "code": 400,
                    "message": "Bulunamadı." + err,
                })

            })
    } catch (error) {
        res.json(err)
        console.log(err);
    }

}

const download = async (req, res) => {
    try {
        // console.log("geldiiiii")
        const fileName = req.params.fileName
        const id = req.user._id

        // console.log(fileName)

        const todo = await Todo.findOne({
            user_id: id,
            file: fileName
        })
            .then(sonuc => {
                res.download(fileName, (err) => {
                    if (err) {
                        res.status(404).json({
                            "success": false,
                            "code": 400,
                            "message": "Bulunamadı." + err,
                        })
                    }
                });
            })
            .catch((err) => {
                res.status(404).json({
                    "success": false,
                    "code": 400,
                    "message": "Bulunamadı." + err,
                })

            })


    } catch (error) {

    }
}

module.exports = {
    getAllTodos,
    addTodo,
    deleteTodo,
    updateTodo,
    statusTodo,
    searchTodos,
    download
}