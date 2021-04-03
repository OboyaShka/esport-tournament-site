import React, {useContext} from 'react'
import {NavLink, useHistory} from "react-router-dom";
import {AuthContext} from "../context/AuthContext";
import TournamentIcon from "../img/nav_img/tournament_icon.svg"
import ProfileIcon from "../img/nav_img/profile_icon.svg"
import NewsIcon from "../img/nav_img/news_icon.svg"
import TeamsIcon from "../img/nav_img/teams_icon.svg"
import Logo from "../img/header_img/footer_logo.svg";
import Red from "../img/header_img/redcoin.svg";
import Blue from "../img/header_img/bluecoin.svg";
import Bell from "../img/header_img/bell.svg";
import Line from "../img/header_img/line_profile.svg";
import Arrow from "../img/header_img/bottom_arrow.svg";

export const Footer = () => {
    const history = useHistory()
    const auth = useContext(AuthContext)

    const logoutHandler = event => {
        event.preventDefault()
        auth.logout()
        history.push('/')
    }


    return (
        <footer>
            <div className="flex-header-container">
                <div className="header-logo">
                    <a href="#" className="header-logo-link">
                        <img src={Logo} alt="logo"/>
                    </a>
                </div>
                <section className="section-content"></section>
                <div className="footer-container">
                    <a className="footer-item">
                        О компании
                    </a>
                    <a className="footer-item">
                        Политика приватности
                    </a>
                    <a className="footer-item">
                        Сотруднечество
                    </a>
                    <a className="footer-item">
                        Помощь
                    </a>
                    <a className="footer-item">
                        Обратная связь
                    </a>
                </div>


            </div>
        </footer>
    )
}