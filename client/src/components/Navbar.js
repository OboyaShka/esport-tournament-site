import React, {useContext} from 'react'
import {NavLink, useHistory} from "react-router-dom";
import {AuthContext} from "../context/AuthContext";
import TournamentIcon from "../img/nav_img/tournament_icon.svg"
import ProfileIcon from "../img/nav_img/profile_icon.svg"
import NewsIcon from "../img/nav_img/news_icon.svg"
import TeamsIcon from "../img/nav_img/teams_icon.svg"

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
        <nav className="option-nav">
            <ul className="option-container">
                <li className="option-li"><img src={TournamentIcon}/><NavLink className="option-link" to="/lol/tournaments">Турниры</NavLink></li>
                <li className="option-li"><img src={NewsIcon}/><NavLink className="option-link" to="/lol/news">Новости</NavLink></li>
                {auth.isAuthenticated && <li className="option-li"><img src={ProfileIcon}/><NavLink className="option-link" to="/lol/profile">Мой аккаунт</NavLink></li>}
                {auth.isAuthenticated && <li className="option-li"><img src={TeamsIcon}/><NavLink className="option-link" to="/lol/profile">Мои команды</NavLink></li>}
            </ul>
        </nav>
    )
}