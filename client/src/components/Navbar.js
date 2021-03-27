import React, {useContext} from 'react'
import {NavLink, useHistory} from "react-router-dom";
import {AuthContext} from "../context/AuthContext";

export const Navbar = () => {
    const history = useHistory()
    const auth = useContext(AuthContext)

    const logoutHandler = event => {
        event.preventDefault()
        auth.logout()
        history.push('/')
    }
    const loginHandler = event => {
        event.preventDefault()
        auth.login()
        history.push('/authentication')
    }

    return (
        <nav>
            <div className="nav-wrapper">
                <a href="#" className="brand-logo">Название</a>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li><NavLink to="/news">Новости</NavLink></li>
                    <li><NavLink to="/tournaments" >Турниры</NavLink></li>
                    {auth.isAuthenticated &&<li><NavLink to="/profile">Профиль</NavLink></li>}
                    { auth.isAuthenticated ?
                        <li><NavLink to="/" onClick={logoutHandler}>Выйти</NavLink></li>:<li><NavLink to="/authentication" onClick={loginHandler}>Войти</NavLink></li>}

                </ul>
            </div>
        </nav>

    )
}