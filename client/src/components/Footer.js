import React, {useContext} from 'react'
import {Link, useHistory} from "react-router-dom";
import {AuthContext} from "../context/AuthContext";
import Logo from "../img/header_img/footer_logo.svg";

export const Footer = () => {


    return (
        <footer>
            <div className="flex-header-container">
                <div className="header-logo">
                    <Link to="/" className="header-logo-link">
                        <img src={Logo} alt="logo"/>
                    </Link>
                </div>
                <section className="section-content"></section>
                <div className="footer-container">
                    <a className="footer-item">
                        О нас
                    </a>
                    <a className="footer-item">
                        Политика приватности
                    </a>
                    <a className="footer-item">
                        Сотрудничество
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