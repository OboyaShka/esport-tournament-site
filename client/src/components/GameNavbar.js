import React, {useContext} from 'react'
import {BrowserRouter as Router, NavLink, useHistory} from "react-router-dom";
import {AuthContext} from "../context/AuthContext";
import {Navbar} from "./Navbar";
import Dota2 from "../img/nav_img/dota2.svg"
import LoL from "../img/nav_img/lol.svg"
import Menu from "../img/nav_img/menu_icon.svg"

export const GameNavbar = () => {
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

    const logHandler = event => {
        event.preventDefault()
        history.push("/lol/tournaments")
    }

    return (
            <nav className="game-nav">
                {/*<div className="game-option"><NavLink to="/lol/tournaments">League of Legends</NavLink></div>*/}
                <div className="game-option-menu"><img src={Menu}></img></div>
                <div className="game-list">
                    <button className="game-option"><img className="game-option-img" src={LoL}></img></button>
                    <button className="game-option"><img className="game-option-img" src={Dota2}></img></button>
                </div>
            </nav>
    )
}