import React, {useState, useEffect, useContext} from 'react'
import {useHttp} from "../hooks/http.hook";
import {useMessage} from "../hooks/message.hook";
import {AuthContext} from "../context/AuthContext";
import {useHistory, Redirect} from 'react-router-dom'
import {Loader} from "../components/Loader";
import {useNotification} from "../hooks/notificationProvider.hook";


export const RegisterPage = () => {
    const history = useHistory()
    const auth = useContext(AuthContext)
    const message = useMessage()
    const {loading, error, request, clearError} = useHttp()
    const [form, setForm] = useState({
        nickname: '', email: '', password: ''
    })
    const dispatch = useNotification();

    // useEffect(() => {
    //     window.M.updateTextFields()
    // }, [])

    useEffect(() => {
        if (error != false) {
            dispatch({
                type: "error",
                message: error,
            })
        }
    }, [error, clearError])

    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value})
    }

    const registerHandler = async () => {
        try {
            form.email = form.email.toLowerCase()


            const data = await request('/api/auth/register', 'POST', {...form})

            dispatch({
                type: "SUCCESS",
                message: data.message,
            })

            history.push('authentication')
        } catch (e) {
            console.log(error)
            if (error != false) {
                dispatch({
                    type: "error",
                    message: error,
                })
            }
        }
    }

    const cancelHandler = async (event) => {
        history.push('authentication')
    }

    if (loading) {
        return <Loader/>
    }


    return (
        <div className="auth-content">
            <div className="register-bubble">
                <div className="auth-title">Регистрация</div>
                <div className="tournaments-search auth-padding">
                    <input style={{width: "360px"}}
                           placeholder="Никнейм"
                           id="nickname"
                           name="nickname"
                           type="text"
                           className="login-input"
                           value={form.nickname}
                           onChange={changeHandler}
                    />
                </div>
                <div className="tournaments-search auth-padding">
                    <input style={{width: "360px"}}
                           placeholder="Почта"
                           id="email"
                           name="email"
                           type="text"
                           className="login-input"
                           value={form.email}
                           onChange={changeHandler}
                    />
                </div>
                <div className="tournaments-search auth-padding">
                    <input style={{width: "360px"}}
                           placeholder="Пароль"
                           id="password"
                           name="password"
                           type="password"
                           className="login-input"
                           disabled={loading}
                           value={form.password}
                           onChange={changeHandler}
                    />
                </div>

                <div className="card-action">
                    <button
                        disabled={form.password===""||form.email===""||form.nickname===""}
                        className="button-register-confirm"
                        onClick={registerHandler}
                    >Зарегистрироваться
                    </button>
                    <button
                        className="button-register-cancel"
                        onClick={cancelHandler}
                        disabled={loading}
                    >Отмена
                    </button>
                </div>
            </div>
        </div>
    )

}