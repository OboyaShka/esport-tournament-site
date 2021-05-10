import React, {useContext} from 'react'
import {NavLink, useHistory} from "react-router-dom";
import {AuthContext} from "../context/AuthContext";
import Logo from "../img/header_img/header_logo.svg"
import Blue from "../img/header_img/bluecoin.svg"
import Red from "../img/header_img/redcoin.svg"
import Bell from "../img/header_img/bell.svg"
import Line from "../img/header_img/line_profile.svg"
import IconProfile from "../img/header_img/icon_profile.svg"
import Arrow from "../img/header_img/bottom_arrow.svg"

export const Header = () => {
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
            <header>
                <div className="flex-header-container">
                    <div className="header-logo">
                        <a href="#" className="header-logo-link">
                            <img src={Logo} alt="logo"/>
                        </a>
                    </div>
                    <section className="section-content"></section>
                    <div className="profile-container">
                        <div className="currency">
                            <var className="redcoin">0 R
                                <img src={Red}/></var>
                            <var className="bluecoin">0 B
                                <img src={Blue}/></var>
                        </div>
                        <div className="bell">
                            <img src={Bell}/>
                        </div>
                        <div className="barricade">
                            <img src={Line}/>
                        </div>
                        <h3 className="profile">{ auth.userNickname }</h3>
                        <img className="profile-img" src={ auth.userAvatar }/>
                        {/*<img src={IconProfile}/>*/}

                        <ul id="nav-mobile" className="right hide-on-med-and-down">
                            {auth.isAuthenticated ?
                                <li><NavLink to="/" onClick={logoutHandler}>Выйти</NavLink></li> :
                                <li><NavLink to="/authentication" onClick={loginHandler}>Войти</NavLink></li>}
                        </ul>
                        <img src={Arrow}/>
                    </div>


                </div>
            </header>
    )
}