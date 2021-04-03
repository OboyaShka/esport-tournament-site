import React, {useContext, useEffect, useState} from 'react'
import {BrowserRouter as Router, NavLink, useHistory} from "react-router-dom";
import {AuthContext} from "../context/AuthContext";
import {GameContext} from "../context/GameContext";
import {Navbar} from "./Navbar";
import Dota2 from "../img/nav_img/dota2.svg"
import Dota2Active from "../img/nav_img/dota2_active_icon.svg"
import LoL from "../img/nav_img/lol.svg"
import LoLActive from "../img/nav_img/lol_active_icon.svg"
import Menu from "../img/nav_img/menu_icon.svg"



export const GameNavbar = () => {
    const history = useHistory()
    const auth = useContext(AuthContext)
    const {game, setGame} = useContext(GameContext)



    const GameHandler =  event => {
        setGame(event)

    }

    useEffect(()=>{
        if(game) {
            // history.push(`/${game}/tournaments`)
        }
    },[game])

    return (
            <nav className="game-nav">
                {/*<div className="game-option"><NavLink to="/lol/tournaments">League of Legends</NavLink></div>*/}
                <div className="game-option-menu"><img src={Menu}></img></div>
                <div className="game-list">
                    <button className={game === "lol"?"game-option-active":"game-option"} onClick={event => (GameHandler("lol"))}><img className="game-option-img" src={game === "lol"? LoLActive: LoL}></img></button>
                    <button className={game === "dota2"?"game-option-active":"game-option"} onClick={event => (GameHandler("dota2"))}><img className="game-option-img" src={game === "dota2"? Dota2Active: Dota2}></img></button>
                </div>
            </nav>
    )
}