import React, {useCallback, useContext, useEffect, useState} from 'react'
import {Link} from "react-router-dom";
import moment from "moment";
import Participants from "../../img/nav_img/profile_icon.svg";
import {Loader} from "../../components/Loader";
import {useHttp} from "../../hooks/http.hook";
import {GameContext} from "../../context/GameContext";
import {AuthContext} from "../../context/AuthContext";

export const LoLTournamentsCards = (props) => {
    const auth = useContext(AuthContext)
    const [tournaments, setTournament] = useState([])
    const {loading, request} = useHttp()
    const roles = auth.userRoles
    const {game, setGame} = useContext(GameContext)
    const gameContext = useContext(GameContext)

    useEffect(()=>{
        fetchTournaments(props)
    },[props])

    const fetchTournaments = useCallback(async (props) => {
        try {
            const fetched = await request('/api/tournaments', 'POST',
                {
                    game: game,
                    type: props.type,
                    search: props.search,
                }
            )

            setTournament(fetched)

        } catch (e) {

        }
    }, [request])


    useEffect(() => {
        fetchTournaments(props)
    }, [fetchTournaments])


    if (loading) {
        return <Loader/>
    }

    return (<div>
            {!loading && <div className="tournaments-cards">
                {!tournaments.length ?
                    (<p className="bracket-match-text">Таких турниров на данный момент нет</p>) :
                    tournaments.map((item, index) => {
                        return (
                            <Link className="tournament-card" onClick={gameContext.setTournamentNav("tournament")}
                                  key={index} to={`/lol/tournaments/${item._id}`}>
                                <div className="image-card">
                                    <h5 className="card-title">{item.title}</h5>
                                    <img style={{width: "100%"}} src={item.image}/>
                                </div>

                                <div className="card-left">
                                    <div className="card-format">
                                        <b>Формат: </b> {item.typeTour === "Daily" ? "1x1" : item.typeTour === "Premium" ? "5x5 RTC" : item.typeTour === "Elite" ? "5x5 RTC" : ""}
                                    </div>
                                    <div className="card-format"><b>Тип: </b>{item.typeTour}</div>
                                    <div className="card-date">
                                        <b>{moment(item.date).format("DD.MM")}</b> {moment(item.date).format("HH:mm")}
                                    </div>
                                </div>
                                <div className="card-right">
                                    <div className="card-format">
                                        <b>Взнос: </b>{item.typeTour === "Daily" ? "Бесплатно" : item.typeTour === "Premium" ? `${item.payment} RC` : item.typeTour === "Elite" ? `${item.payment} BC` : ""}
                                    </div>
                                    <div className="card-format">
                                        <b>Призовые: </b>{item.typeTour === "Daily" ? `${item.prize} RC` : item.typeTour === "Premium" ? `${item.prize} BC` : item.typeTour === "Elite" ? `${item.prize} BC` : ""}
                                    </div>
                                    <div className="card-participants"><img
                                        src={Participants}/>
                                        {item.participants.length}/32
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