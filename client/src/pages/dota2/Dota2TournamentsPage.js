import React, {useCallback, useContext, useEffect, useState} from 'react'
import {Link, useHistory} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import {useHttp} from "../../hooks/http.hook";
import {Loader} from "../../components/Loader";
import moment from "moment";
import GameTest from "../../img/profile_img/games-league-of-legends-78709.jpg";
import Participants from "../../img/nav_img/profile_icon.svg";
import SearchIcon from "../../img/search_icon.svg";
import {GameContext} from "../../context/GameContext";
import Select from "react-select"
import {Dota2TournamentsCards} from "./Dota2TournamentsCards"

export const Dota2TournamentsPage = () => {

    const auth = useContext(AuthContext)

    const roles = auth.userRoles

    const [format, setFormat] = useState("all")
    const [type, setType] = useState("all")
    const [search, setSearch] = useState("")

    const optionsType =[
        { value: 'all', label: 'Все' },
        { value: 'Daily', label: 'Daily' },
        { value: 'Premium', label: 'Premium' },
        { value: 'Elite', label: 'Elite' }
    ]

    const optionsFormat =[
        { value: 'all', label: 'Все' },
        { value: '1x1', label: '1x1' },
        { value: '5x5', label: '5x5' },
        { value: '5x5 RTC', label: '5x5 RTC' }
    ]

    const selectTypeChange = e =>{
        setType(e.value)

    }

    const searchInput = e =>{
        setSearch(e.target.value)
    }

    return (
        <div className="tournaments-container">
            <div className="tournaments-title">Турниры по Dota 2</div>
            <div className="tournaments-filter">
                <div className="tournaments-search">
                    <input name="s" placeholder="Название турнира..." onChange={e=>searchInput(e)} type="search"/>
                    <button type="submit">
                        <img src={SearchIcon}/></button>
                </div>

                <div><Select  onChange={e =>selectTypeChange(e)} className="select-type" id="select_type" placeholder="Тип турнира..." options={optionsType}/></div>

            </div>

            {roles && roles.includes('ADMIN') &&
            <div className="button" >

                <Link className="waves-effect waves-light btn-large" to='/tournament/create' >Создать</Link>
            </div>}
            <Dota2TournamentsCards type={type} search={search}/>

        </div>
    )
}