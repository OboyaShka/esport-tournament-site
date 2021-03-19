import React, {useState, useEffect, useContext} from 'react'
import {useHttp} from "../hooks/http.hook";
import {useMessage} from "../hooks/message.hook";
import {AuthContext} from "../context/AuthContext";
import {useHistory, Redirect} from 'react-router-dom'
import {Loader} from "../components/Loader";


export const AuthPage = () => {
    const history = useHistory()
    const auth = useContext(AuthContext)
    const message = useMessage()
    const {loading, error, request, clearError} = useHttp()
    const [form, setForm] = useState({
        email: '', password: ''
    })

    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError])

    useEffect(() => {
        window.M.updateTextFields()
    }, [])


    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value})
    }

    const registerHandler = async () => {
        try {
            const data = await request('/api/auth/register', 'POST', {...form})
            message(data.message)
        } catch (e) {

        }
    }

    const loginHandler = async (event) => {
        try {
            const data = await request('/api/auth/login', 'POST', {...form})
            auth.login(data.token, data.userId, data.userRoles)
            if(data.token){
                history.push('/')
            }
        } catch (e) {

        }
    }

    if(loading) {
        return <Loader/>
    }


    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <h1>Название</h1>
                <div className="card blue-grey darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Авторизация</span>

                        <div>
                            <div className="input-field">
                                <input
                                    id="email"
                                    name="email"
                                    type="text"
                                    className="login-input"
                                    value={form.email}
                                    onChange={changeHandler}
                                />
                                <label htmlFor="email">Введите e-mail</label>
                            </div>
                            <div className="input-field">
                                <input
                                    id="password"
                                    name="password"
                                    type="text"
                                    className="login-input"
                                    disabled={loading}
                                    value={form.password}
                                    onChange={changeHandler}
                                />
                                <label htmlFor="password">Введите пароль</label>
                            </div>
                        </div>
                        <div className="card-action">
                            <button
                                className="btn yellow darken-4"
                                onClick={loginHandler}
                            >Войти
                            </button>
                            <button
                                className="btn grey lighten-1 black-text"
                                onClick={registerHandler}
                                disabled={loading}
                            >Регистрация
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}