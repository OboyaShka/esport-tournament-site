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

export const LoLTournamentsPage = () => {
    const [tournaments, setTournament] = useState([])
    const {loading, request} = useHttp()
    const auth = useContext(AuthContext)
    const roles = auth.userRoles
    const gameContext = useContext(GameContext)

    const fetchTournaments = useCallback(async () => {
        try {
            const fetched = await request('/api/tournaments', 'GET', null)
            setTournament(fetched)
        } catch (e) {

        }
    }, [request])

    useEffect(() => {
        fetchTournaments()
    }, [fetchTournaments])

    if (loading) {
        return <Loader/>
    }

    const optionsType =[
        { value: 'Daily', label: 'Daily' },
        { value: 'Premium', label: 'Premium' },
        { value: 'Elite', label: 'Elite' }
    ]

    const optionsFormat =[
        { value: '1x1', label: '1x1' },
        { value: '5x5', label: '5x5' },
        { value: '5x5 RTC', label: '5x5 RTC' }
    ]

    return (
        <div className="tournaments-container">
            <div className="tournaments-title">Турниры</div>
            <div className="tournaments-filter">
                <div className="tournaments-search">
                    <input name="s" placeholder="Название турнира..." type="search"/>
                    <button type="submit">
                        <img src={SearchIcon}/></button>
                </div>
                <div><Select className="select-type" placeholder="Тип турнира..." options={optionsType}/></div>
                <div><Select className="select-type" placeholder="Формат турнира..." options={optionsFormat}/></div>
            </div>
            {roles && roles.includes('ADMIN') &&
            <div className="button" >

                <Link className="waves-effect waves-light btn-large" to='/tournament/create' >Создать</Link>
            </div>}
            {!loading && <div className="tournaments-cards">
                {!tournaments.length ?
                    (<p>Турниров на данный момент нет</p>) :
                    tournaments.map((item, index) => {
                        return (
                            <Link className="tournament-card" onClick={gameContext.setTournamentNav("tournament")}  key={index} to={`/lol/tournaments/${item._id}`}>
                                <div className="image-card">
                                    <h5 className="card-title">{item.title}</h5>
                                    <img style={{width: "100%"}} src={item.image}/>
                                </div>

                                <div className="card-left">
                                    <div className="card-format"><b>Формат: </b> {item.typeTour==="Daily"?"1x1": item.typeTour==="Premium"?"5x5 RTC":item.typeTour==="Elite"?"5x5 RTC":""}</div>
                                    <div className="card-format"><b>Тип: </b>{item.typeTour}</div>
                                    <div className="card-date">
                                        <b>{moment(item.date).format("DD.MM")}</b> {moment(item.date).format("HH:mm")}
                                    </div>
                                </div>
                                <div className="card-right">
                                    <div className="card-format"><b>Взнос: </b>{item.typeTour==="Daily"?"Бесплатно": item.typeTour==="Premium"? `${item.payment} RC`:item.typeTour==="Elite"?`${item.payment} BC`:""}</div>
                                    <div className="card-format"><b>Призовые: </b>{item.typeTour==="Daily"?`${item.prize} RC`: item.typeTour==="Premium"? `${item.prize} BC`:item.typeTour==="Elite"?`${item.prize} BC`:""}</div>
                                    <div className="card-participants"><img
                                        src={Participants}/>{item.participants.length}/32
                                    </div>
                                </div>

                            </Link>
                        )
                    })}
            </div>
            }

        </div>
    )
}