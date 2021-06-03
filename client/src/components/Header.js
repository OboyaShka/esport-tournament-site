import React, {useContext} from 'react'
import {Link, NavLink, useHistory} from "react-router-dom";
import {AuthContext} from "../context/AuthContext";
import Logo from "../img/header_img/header_logo.svg"
import Blue from "../img/header_img/bluecoin.svg"
import Red from "../img/header_img/redcoin.svg"
import Bell from "../img/header_img/bell.svg"
import Line from "../img/header_img/line_profile.svg"
import IconProfile from "../img/header_img/icon_profile.svg"
import Arrow from "../img/header_img/bottom_arrow.svg"
import {GameContext} from "../context/GameContext";

export const Header = () => {
    const history = useHistory()
    const auth = useContext(AuthContext)
    const {game, setGame} = useContext(GameContext)
    const gameContext = useContext(GameContext)

    const logoutHandler = event => {
        event.preventDefault()
        auth.logout()
        history.push(`/${game}/tournaments`)
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
                        <Link to="/" style={{ outline: "none"}} className="header-logo-link">
                            <img src={Logo} alt="logo"/>
                        </Link>
                    </div>
                    <section className="section-content"></section>
                    <div className="profile-container">
                        {auth.isAuthenticated && <div className="currency">
                            <var className="redcoin">0 RC
                                <img src={Red}/></var>
                            <var className="bluecoin">0 BC
                                <img src={Blue}/></var>
                        </div>}
                        {auth.isAuthenticated && <div className="bell">
                            <img src={Bell}/>
                        </div>}
                        {auth.isAuthenticated && <div className="barricade">
                            <img src={Line}/>
                        </div>}
                        {auth.isAuthenticated && <h3 className="profile">{ auth.userNickname }</h3>}
                        {auth.isAuthenticated && <img className="profile-img" src={ auth.userAvatar }/>}
                        {/*<img src={IconProfile}/>*/}

                        <ul id="nav-mobile" className="right hide-on-med-and-down">
                            {auth.isAuthenticated ?
                                <li><NavLink className="header-login-text" to="/" onClick={logoutHandler}>Выйти</NavLink></li> :
                                <li><NavLink className="header-login-text" to="/authentication" onClick={loginHandler}>Войти</NavLink></li>}
                        </ul>
                        {/*<img src={Arrow}/>*/}
                    </div>


                </div>
            </header>
    )
}