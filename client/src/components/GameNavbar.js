import React, {useContext, useEffect} from 'react'
import { useHistory} from "react-router-dom";
import {AuthContext} from "../context/AuthContext";
import {GameContext} from "../context/GameContext";

import Dota2 from "../img/nav_img/dota2.svg"
import Dota2Active from "../img/nav_img/dota2_active_icon.svg"
import LoL from "../img/nav_img/lol.svg"
import LoLActive from "../img/nav_img/lol_active_icon.svg"
import CSGO from "../img/nav_img/csgo.svg"
import CSGOActive from "../img/nav_img/csgo_active_icon.svg"
import Menu from "../img/nav_img/menu_icon.svg"



export const GameNavbar = () => {
    const history = useHistory()
    const {game,option, setGame} = useContext(GameContext)
    const gameContext = useContext(GameContext)


    const GameHandler =  event => {
        setGame(event)
        // gameContext.setOption("tournaments")
    }


    useEffect(()=>{
        if(game) {
            history.push(`/${game}/${option}`)
        }
    },[game,history])

    return (
            <nav className="game-nav">
                <div className="game-option-menu"><img alt="Menu" src={Menu}></img></div>
                <div className="game-list">
                    <button className={game === "lol"?"game-option-active":"game-option"} onClick={event => (GameHandler("lol"))}>
                        <img  alt="LoL" className="game-option-img" src={game === "lol"? LoLActive: LoL}></img></button>
                    <button className={game === "dota2"?"game-option-active":"game-option"} onClick={event => (GameHandler("dota2"))}>
                        <img alt="Dota 2" className="game-option-img" src={game === "dota2"? Dota2Active: Dota2}></img></button>
                    <button className={game === "csgo"?"game-option-active":"game-option"} onClick={event => (GameHandler("csgo"))}>
                        <img alt="CS:GO" className="game-option-img" src={game === "csgo"? CSGOActive: CSGO}></img></button>
                </div>
            </nav>
    )
}