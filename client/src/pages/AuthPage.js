import React, {useState, useEffect, useContext} from 'react'
import {useHttp} from "../hooks/http.hook";
import {useMessage} from "../hooks/message.hook";
import {AuthContext} from "../context/AuthContext";
import {useHistory, Redirect} from 'react-router-dom'
import {Loader} from "../components/Loader";
import {GameContext} from "../context/GameContext";
import {useNotification} from "../hooks/notificationProvider.hook";

export const AuthPage = () => {
    const history = useHistory()
    const auth = useContext(AuthContext)
    const dispatch = useNotification();
    const message = useMessage()
    const {loading, error, request, clearError} = useHttp()
    const [form, setForm] = useState({
        email: '', password: ''
    })
    const {game, setGame} = useContext(GameContext)
    const gameContext = useContext(GameContext)
    const passwordField = document.getElementById('password')

    useEffect(() => {
        if (error != false) {
            dispatch({
                type: "error",
                message: error,
            })
        }
    }, [error, clearError])

    useEffect(() => {

    }, [])


    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value})
    }

    const registerHandler = async () => {
        history.push('/registration')
    }

    const loginHandler = async (event) => {
        try {
            const data = await request('/api/auth/login', 'POST', {...form})
            auth.login(data.token, data.userId, data.userRoles, data.userNickname, data.userAvatar, data.redCoin, data.blueCoin)
            gameContext.setOption("profile")
            if (data.token) {
                history.push(`/${game}/profile`)
            }
        } catch (e) {
            if (error != false) {
                dispatch({
                    type: "error",
                    message: error,
                })
            }
        }
    }

    const pressNextForm = (e) => {
        if (e.key === "Enter") {
            e.SuppressKeyPress = true;
            passwordField.focus()

        }
    }

    const pressEnter = (e) => {
        if (e.key === "Enter") {
            e.SuppressKeyPress = true;
            loginHandler()

        }
    }

    if (loading) {
        return (<div className="auth-content">
            <div className="loader-center">
                <Loader/>
            </div>
        </div>)
    }


    return (
        <div className="auth-content">
            <div className="auth-bubble">
                <div className="auth-title">Авторизация</div>
                <div className="tournaments-search auth-padding">
                    <input style={{width: "360px"}}
                           autoFocus
                           placeholder="Почта"
                           id="email"
                           name="email"
                           type="text"
                           className="login-input"
                           value={form.email}
                           onChange={changeHandler}
                           onKeyDown={e => {
                               pressNextForm(e)
                           }}
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
                           onKeyDown={e => {
                               pressEnter(e)
                           }}
                    />
                </div>

                <div className="card-action">
                    <button
                        disabled={form.password===""||form.email===""}
                        onClick={loginHandler}
                        className="button-login"
                    >Войти
                    </button>
                    <button
                        className="button-register"
                        onClick={registerHandler}
                        disabled={loading}
                    >Регистрация
                    </button>
                </div>
            </div>
        </div>
    )
}