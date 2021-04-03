import React, {useContext, useEffect} from 'react'
import {NavLink, useHistory} from "react-router-dom";
import {AuthContext} from "../context/AuthContext";
import {GameContext} from "../context/GameContext";
import TournamentIcon from "../img/nav_img/tournament_icon.svg"
import ProfileIcon from "../img/nav_img/profile_icon.svg"
import NewsIcon from "../img/nav_img/news_icon.svg"
import TeamsIcon from "../img/nav_img/teams_icon.svg"

export const Navbar = () => {
    const history = useHistory()
    const auth = useContext(AuthContext)
    const gameContext = useContext(GameContext)



    useEffect(()=>{

    },[gameContext.game])

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

    const optionHandler = event =>{
        gameContext.setOption(event)
    }


    return (
        <nav className="option-nav">
            <ul className="option-container">
                <li className="option-li"><img src={TournamentIcon}/><NavLink style={{outline: 0}} className="option-link" onClick={e=>{optionHandler("tournaments")}} to={`/${gameContext.game}/tournaments`}>{gameContext.option === "tournaments"? <b>Турниры</b> : "Турниры"}</NavLink></li>
                <li className="option-li"><img src={NewsIcon}/><NavLink style={{outline: 0}} className="option-link" onClick={e=>{optionHandler("news")}} to={`/${gameContext.game}/news`}>{gameContext.option === "news"? <b>Новости</b> : "Новости"}</NavLink></li>
                {auth.isAuthenticated && <li className="option-li"><img src={ProfileIcon}/><NavLink style={{outline: 0}} className="option-link" onClick={e=>{optionHandler("profile")}} to={`/${gameContext.game}/profile`}>{gameContext.option === "profile"? <b>Мой аккаунт</b> : "Мой аккаунт"}</NavLink></li>}
                {auth.isAuthenticated && <li className="option-li"><img src={TeamsIcon}/><NavLink style={{outline: 0}} className="option-link" onClick={e=>{optionHandler("profile")}} to={`/${gameContext.game}/profile`}>Мои команды</NavLink></li>}
            </ul>
        </nav>
    )
}