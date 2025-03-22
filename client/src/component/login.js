import React, { useState } from 'react'
import "./login.css"
import { useNavigate } from "react-router-dom";
// import { Button, Checkbox, Form, Input} from 'antd' // sonra ekle 

const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
  
    const submit = async (e) => {
        e.preventDefault()

        try {
            const res = await fetch("http://localhost:5000/signIn", {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({username, password})
            })
            const data = await res.json();
            // console.log(data)
            if(res.ok) {
                localStorage.setItem("token", data.data.token)
                navigate("/todo")
            } else {
                alert('Hatalı giriş')
                // error handler ile ekrana yazdırrrr!!
            }
        } catch (error) {
            console.error("Error: ", error)
        }
    }
    return (
        <div>
            <h3>Yapılacaklar Listenizi Düzenleyin</h3>
            <form onSubmit={submit}>
                <div className="text_area">
                    <label htmlFor="username" className="form-label">Kullanıcı Adı:</label>
                    <input type="text" className="text-input" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required/>
                </div>
                <div className="text_area">
                    <label htmlFor="password" className="form-label">Şifre :</label>
                    <input type="password" className="text-input" id="password" name='password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn">Giriş Yap</button>
            </form>
        </div>
    )
};


export default Login;
