import React, {useCallback, useContext, useEffect, useState} from 'react'

import {Link, useHistory, useParams} from "react-router-dom";
import {useHttp} from "../../hooks/http.hook";
import {useMessage} from "../../hooks/message.hook";
import {AuthContext} from "../../context/AuthContext";
import Red from "../../img/header_img/redcoin.svg";
import Blue from "../../img/header_img/bluecoin.svg";
import Edit from "../../img/nav_img/edit.svg";
import TournamentIcon from "../../img/profile_img/tournament_icon.svg";
import LineIcon from "../../img/profile_img/line_statistics_icon.svg";
import CupIcon from "../../img/profile_img/cup_icon.svg";
import PedestalIcon from "../../img/profile_img/pedestal_icon.svg";
import TrendIcon from "../../img/profile_img/trend_icon.svg";
import moment from "moment";
import Participants from "../../img/nav_img/profile_icon.svg";
import Arror from "../../img/left_arrow_button.svg";
import {GameContext} from "../../context/GameContext";
import RedCoinStat from "../../img/profile_img/redcoin_stat.svg";
import BlueCoinStat from "../../img/profile_img/bluecoin_stat.svg";

export const Dota2ProfileDetailPage = () => {
    const profileId = useParams().id
    const {loading, request} = useHttp()
    const [profile, setProfile] = useState(null)
    const [mytournaments, setMytournaments] = useState()
    const auth = useContext(AuthContext)
    const history = useHistory()
    const {game, setGame} = useContext(GameContext)
    const gameContext = useContext(GameContext)

    //Подтягиваем информацию о профиле
    const getProfile = useCallback(async () => {
        try {
            const fetched = await request(`/api/user/${profileId}`, 'GET', null)
            setProfile(fetched)
        } catch (e) {

        }
    }, [setProfile, request])

    useEffect(() => {
        getProfile()
    }, [getProfile])

    const fetchMyTournaments = useCallback(async () => {
        try {
            const fetch = await request('/api/profile/tournaments', 'GET', null, {
                Authorization: `Bearer ${auth.token}`,
                game: game
            })
            setMytournaments(fetch)
        } catch (e) {

        }
    }, [request])

    useEffect(() => {
        fetchMyTournaments()
    }, [fetchMyTournaments])

    const backButton = () => {
        history.go(-1)
    }

    return (
        <div>
            {profile && <div className="my-profile-container">
                <div  className="profile-header my-profile-title">
                    <a className="back-button" onClick={e => {
                        backButton()
                    }}>
                        <img src={Arror}/>
                    </a>
                    <h2>Профиль {profile.nickname}</h2>
                </div>
                <div className="my-profile-card">
                    <div className="info-card">

                        <img style={{maxWidth: "90%", borderRadius: "50%"}} src={profile.image}/>
                        <div className="info-card-profile">

                            <div>
                                <h3 className="nickname-card">{profile.nickname}</h3>
                                <p className="summonersname-card">Steam ID: {profile.steamID}</p>
                            </div>
                        </div>
                        {/*<div className="currency">*/}
                        {/*    <div className="redcoin">0 R<img src={Red}/></div>*/}
                        {/*    <div className="redcoin">0 B<img src={Blue}/></div>*/}
                        {/*</div>*/}
                        <div className="info-card-main">
                            <div>DISCORD: нет данных</div>
                        </div>

                    </div>


                </div>
                <div className="my-profile-statistics">
                    <div className="statistics-card-area">
                        <div className="statistics-card">
                            <div className="card-container">
                                <img className="line-statistics" src={TournamentIcon}/>
                                <img src={LineIcon}/>
                                <var className="stat-var-block">{profile.stat_dota2_tournaments_played}</var>
                            </div>
                        </div>
                        <p>Турниров сыграно</p>
                    </div>
                    <div className="statistics-card-area">
                        <div className="statistics-card">
                            <div className="card-container">
                                <img className="line-statistics" src={CupIcon}/>
                                <img src={LineIcon}/>
                                <var className="stat-var-block">{profile.stat_dota2_tournaments_wins}</var>
                            </div>
                        </div>
                        <p>Побед в турнирах</p>
                    </div>
                    <div className="statistics-card-area">
                        <div className="statistics-card">
                            <div className="card-container">
                                <img className="line-statistics" src={PedestalIcon}/>
                                <img src={LineIcon}/>
                                <var className="stat-var-block">{profile.stat_dota2_tournaments_prizer}</var>
                            </div>
                        </div>
                        <p>Призовых мест</p>
                    </div>


                    <div className="statistics-card-area">
                        <div className="statistics-card">
                            <div className="card-container">
                                <img className="line-statistics" src={TrendIcon}/>
                                <img src={LineIcon}/>
                                <var className="stat-font-size">{profile.stat_dota2_tournaments_rating}</var>
                            </div>
                        </div>
                        <p>Рейтинг на сайте</p>
                    </div>
                    <div className="statistics-card-area">
                        <div className="statistics-card">
                            <div className="card-container">
                                <img className="line-statistics" src={RedCoinStat}/>
                                <img src={LineIcon}/>
                                <var className="stat-font-size">{profile.stat_dota2_total_RC}</var>
                            </div>
                        </div>
                        <p>Заработано RedCoin</p>
                    </div>
                    <div className="statistics-card-area">
                        <div className="statistics-card">
                            <div className="card-container">
                                <img className="line-statistics" src={BlueCoinStat}/>
                                <img src={LineIcon}/>
                                <var className="stat-font-size">{profile.stat_dota2_total_BC}</var>
                            </div>
                        </div>
                        <p>Заработано BlueCoin</p>
                    </div>
                </div>
                <div className="my-profile-title-games">Турниры</div>
                {!loading && mytournaments && <div className="my-profile-games">
                    {!mytournaments.length ?
                        (<p>Турниров на данный момент нет</p>) :
                        mytournaments.map((item, index) => {
                            return (
                                <Link className="tournament-card" key={index} to={`/lol/tournaments/${item._id}`}>
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

            </div>}
        </div>
    )
}