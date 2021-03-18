import React, {useContext} from 'react'
import {NavLink, useHistory} from "react-router-dom";
import {AuthContext} from "../context/AuthContext";

export const Navbar = () => {
    const history = useHistory()
    const auth = useContext(AuthContext)

    const logoutHandler = event => {
        event.preventDefault()
        auth.logout()
        history.push('/main')
    }
    const loginHandler = event => {
        event.preventDefault()
        auth.login()
        history.push('/')
    }
    console.log(auth)
    return (
        <nav>
            <div className="nav-wrapper">
                <a href="#" className="brand-logo">Название</a>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li><NavLink to="/main">Главная</NavLink></li>
                    <li><NavLink to="/profile">Профиль</NavLink></li>
                    { auth.isAuthenticated ?
                        <li><a href="/" onClick={logoutHandler}>Выйти</a></li>:<li><a href="/profile" onClick={loginHandler}>Войти</a></li>}

                </ul>
            </div>
        </nav>

    )
}