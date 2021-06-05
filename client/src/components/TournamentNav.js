import {NavLink, useHistory, useParams} from "react-router-dom";
import React, {useContext} from "react";
import {AuthContext} from "../context/AuthContext";
import {GameContext} from "../context/GameContext";
import {TournamentCard} from "./TournamentCard";
import Line from "../img/tournaments_nav_line.svg"

export const TournamentNav = ( ) => {
    const history = useHistory()
    const auth = useContext(AuthContext)
    const gameContext = useContext(GameContext)
    const tournamentId = useParams().id



    const optionHandler = event =>{
        gameContext.setTournamentNav(event)

    }

    return(
        <nav className="tournament-nav">
            <NavLink onClick={e=>{optionHandler("tournament")}}style={{outline: "none"}} className="tournaments_nav-link" to={`/${gameContext.game}/tournaments/${tournamentId}`}>О турнире <img hidden={gameContext.tournamentNav != "tournament"} src={Line}/></NavLink>
            <NavLink onClick={e=>{optionHandler("rules")}}style={{outline: "none"}} className="tournaments_nav-link" to={`/${gameContext.game}/tournaments/${tournamentId}/rules`}>Правила <img hidden={gameContext.tournamentNav != "rules"} src={Line}/></NavLink>
            <NavLink onClick={e=>{optionHandler("participants")}}style={{outline: "none"}} className="tournaments_nav-link" to={`/${gameContext.game}/tournaments/${tournamentId}/participants`}>Участники <img hidden={gameContext.tournamentNav != "participants"} src={Line}/></NavLink>
            <NavLink onClick={e=>{optionHandler("bracket")}}style={{outline: "none"}} className="tournaments_nav-link" to={`/${gameContext.game}/tournaments/${tournamentId}/bracket`}> Сетка <img hidden={gameContext.tournamentNav != "bracket"} src={Line}/></NavLink>
            <NavLink onClick={e=>{optionHandler("matches")}}style={{outline: "none"}} className="tournaments_nav-link" to={`/${gameContext.game}/tournaments/${tournamentId}/matches`}> Матчи <img hidden={gameContext.tournamentNav != "matches"} src={Line}/></NavLink>
        </nav>
    )

}

