import React, { useState, useEffect } from "react";
import { Layout, Input, Button, Modal, message } from "antd";
import { LuPencilLine, LuSearch, LuLogOut } from 'react-icons/lu';
import { AiOutlineDelete, AiOutlinePlus, AiOutlineDownload } from "react-icons/ai";
import { MdOutlineCancel } from "react-icons/md";
import "./home.css"
import { useNavigate } from "react-router-dom";

const { Content, Sider } = Layout;
const Home = () => {
    const navigate = useNavigate()

    const [searchTerm, setSearchTerm] = useState("");
    const [file, setFile] = useState(null) // neden bu null
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        id: ""
    });
    const showModal = () => {
        setIsModalOpen(true);
    };
    const showEditModal = (todo) => {
        setFormData({
            title: todo.title,
            content: todo.content,
            id: todo._id
        });
        setIsEditModalOpen(true)
    };
    const fileChange = (e) => {
        setFile(e.target.files[0])
    }
    const [todos, setTodos] = useState([])
    useEffect(() => {
        const getAllTodos = async () => {
            try {
                const token = localStorage.getItem("token")
                const res = await fetch("http://localhost:5000/allTodos", {
                    method: 'GET',
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                })

                if (res.ok) {
                    const data = await res.json()
                    setTodos(data);
                } else {
                    message.error("Görevler yüklenemedi.")
                }
            } catch (error) {
                message.error("görev yükleme isteği atılamadı")
            }
        }
        getAllTodos();
    }, [])
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const url = searchTerm
                    ? `http://localhost:5000/search/${encodeURIComponent(searchTerm)}`
                    : "http://localhost:5000/allTodos";

                const res = await fetch(url, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (res.ok) {
                    const data = await res.json();
                    setTodos(data);
                } else {
                    message.error("Arama yapılamadı.");
                }
            } catch (error) {
                message.error("İstek gönderilemedi.");
            }
        };
        fetchData();
    }, [searchTerm]);
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [id, setId] = useState("")

    const handleOk = async () => {
        if (!title.trim() || !content.trim()) {
            message.error("Lütfen başlık ve içeriği doldurun.") // çalışmıyor ekrana yazdırmıyor 
            return;
        }
        try {
            const body = new FormData();
            body.append("title", title)
            body.append("content", content)
            if (file) body.append("file", file)
            const token = localStorage.getItem("token")
            const res = await fetch("http://localhost:5000/addTodo", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: body
            })
            if (res.ok) {
                message.success("Görev eklendi") // sayfayı yenile
                window.location.reload();
                setIsModalOpen(false);
                setTitle("");
                setContent("");
            } else {
                message.error("Hata")
            }
        } catch (error) {
            message.error("İstek gönderilmedi")
        }
    };

    const deleteTodo = async (id) => {
        try {
            const token = localStorage.getItem("token")
            const res = await fetch("http://localhost:5000/deleteTodo", {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ id })
            })
            if (res.ok) {
                message.success("Görev silindi") // sayfayı yenile
                window.location.reload();

            } else {
                message.error("Hata")
            }
        } catch (error) {
            message.error("İstek gönderilmedi")
        }
    }

    const editTodo = async () => {
        try {
            const token = localStorage.getItem("token")
            console.log(formData)
            const res = await fetch("http://localhost:5000/updateTodo",
                {
                    method: "PUT",
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ title: formData.title, content: formData.content, id: formData.id })
                })
            if (res.ok) {
                message.success("Görev güncellendi") // sayfayı yenile
                setTodos(todos.map(todo =>
                    todo._id === formData.id ? { ...todo, ...formData } : todo
                ))
                window.location.reload();
                handleCancel();

            } else {
                message.error("Hata")
            }
        } catch (error) {
            message.error("İstek gönderilmedi")
        }
    }
    const updateStatus = async (id, status) => {
        const newStatus = status === "completed" ? "pending" : "completed"
        try {
            const token = localStorage.getItem("token")
            const res = await fetch("http://localhost:5000/statusTodo", {
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ id, status: newStatus })
            })
            if (res.ok) {
                setTodos(todos.map(todo =>
                    todo._id === id ? { ...todo, status: newStatus } : todo
                ))
            }
        } catch (error) {
            message.error("status güncellenmedi")
        }
    }
    const handleCancel = () => {
        setIsModalOpen(false);
        setIsEditModalOpen(false)
        setFormData({ title: "", content: "", id: "" })
    };
    const getFormattedDate = () => {
        const now = new Date();
        const hour = String(now.getHours()).padStart(2, '0');
        const minute = String(now.getMinutes()).padStart(2, '0');
        const second = String(now.getSeconds()).padStart(2, '0');

        return `_${hour} ${minute} ${second}`;
    };
        
    const downloadBtn = async (todo) => {
        try {
            const fileName = todo.file.split('/').pop()
            const token = localStorage.getItem('token')

            const res = await fetch(`http://localhost:5000/download/${encodeURIComponent(fileName)}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
        
            if (res.ok) {
                const fname = todo.title + getFormattedDate()
                const blob = await res.blob()
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url;
                a.download = fname
                document.body.appendChild(a)
                a.click()
                window.URL.revokeObjectURL(url)
                document.body.removeChild(a)
            } else {
                message.error("Hata")
            }
        } catch (error) {

        }
    }

    const logout = async () => {
        // navigate("/")
        try {
            const token = localStorage.getItem("token")
            const res = await fetch("http://localhost:5000/logout", {
                method: 'GET',
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            if (res.ok) {
                localStorage.removeItem('token')
                navigate("/")
            } else {
                message.error("Çıkış yapılamadı.")
            }
        } catch (error) {
            message.error("çıkış yapma isteği atılamadı")
        }
    }

    return (
        <Layout className="home-layout">
            <Sider width={300} className="right_side">
                <div className="sider-content">
                    <Button className="button" icon={<AiOutlinePlus />} onClick={showModal}>To Do Ekle</Button>
                    <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel} className="modal" closable={false}>
                        <div className="modal-content">
                            <Input placeholder="Başlık" className="title" name="title" id="title" value={title} onChange={(e) => setTitle(e.target.value)} ></Input>
                            <div className="title-line"></div>
                            <Input placeholder="Eklemek istediğiniz görevi girin..." name="content" id="content" className="add-input" value={content} onChange={(e) => setContent(e.target.value)}></Input>
                            <div></div>
                            <Input type="file" className="fileInp" onChange={fileChange}></Input>
                        </div>
                    </Modal>
                </div>
                <Button className="button logout" icon={<LuLogOut />} onClick={logout}> Çıkış Yap</Button>
            </Sider>
            <Layout className="main">
                <Content className="content">
                    <div className="search">
                        <Input placeholder="Ara.." prefix={<LuSearch />} suffix={<MdOutlineCancel onClick={() => setSearchTerm('')} />} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
                    </div>
                    <div className="todo-list">
                        {todos.map((todo) => (
                            <div key={todo._id} className="todo-item">
                                <input
                                    type="checkbox"
                                    checked={todo.status === "completed"}
                                    onChange={() => updateStatus(todo._id, todo.status)}
                                />
                                <div className="todo-text" style={{ textDecoration: todo.status === "completed" ? "line-through" : "none", opacity: todo.status === "completed" }}>
                                    <strong>{todo.title}</strong>
                                    <p>{todo.content}</p>
                                    <em>{todo.recommendation}</em>
                                </div>
                                <Button className="button" icon={<LuPencilLine className="edit-icon" />} onClick={() => showEditModal(todo)} disabled={todo.status === "completed"}></Button>
                                <Modal open={isEditModalOpen} onOk={editTodo} onCancel={handleCancel} className="modal" closable={false}>
                                    <div className="modal-content">
                                        <Input placeholder="Başlık" className="title" name="title" id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} ></Input>
                                        <div className="title-line"></div>
                                        <Input placeholder="Eklemek istediğiniz görevi girin..." name="content" id="content" className="add-input" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })}></Input>
                                        <div></div>
                                    </div>
                                </Modal>
                                <Button className="button" icon={<AiOutlineDelete className="delete-icon" />} onClick={() => deleteTodo(todo._id)}></Button>
                                {todo.file && (
                                    <Button className="button" icon={<AiOutlineDownload className="download-icon" />} onClick={() => downloadBtn(todo)}></Button>
                                )}
                            </div>
                        ))}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default Home;
