import React, {useCallback, useContext, useEffect, useRef, useState} from 'react'
import {Link, useHistory, useParams} from 'react-router-dom'
import {useHttp} from "../../hooks/http.hook";
import {Loader} from "../../components/Loader";
import {TournamentsCreatePage} from "../TournamentCreatePage";
import {TournamentCard} from "../../components/TournamentCard";
import {TournamentNav} from "../../components/TournamentNav";
import BigLine from "../../img/tournament_info_big_line.svg"
import Line from "../../img/tournament_info_line.svg"
import {AuthContext} from "../../context/AuthContext";
import socket from "../../socket";
import {useMessage} from "../../hooks/message.hook";
import moment from "moment";
import Arror from "../../img/left_arrow_button.svg";
import GoldCup from "../../img/tournament_img/cup_gold.svg"
import SilverCup from "../../img/tournament_img/cup_silver.svg"
import BronzeCup from "../../img/tournament_img/cup_bronze.svg"
import {GameContext} from "../../context/GameContext";
import {useNotification} from "../../hooks/notificationProvider.hook";

export const LoLTournamentDetailPage = (callback, inputs) => {
    const [tournament, setTournament] = useState(null)
    const tournamentId = useParams().id
    const {loading, request} = useHttp()
    const auth = useContext(AuthContext)
    const [user, setUser] = useState(null)
    const history = useHistory()
    const message = useMessage()
    const roles = auth.userRoles
    const [timerDays, setTimerDays] = useState('00')
    const [timerHours, setTimerHours] = useState('00')
    const [timerMinutes, setTimerMinutes] = useState('00')
    const [timerSeconds, setTimerSeconds] = useState('00')
    const [stage, setStage] = useState(null)
    const {game, setGame} = useContext(GameContext)
    const gameContext = useContext(GameContext)
    const dispatch = useNotification();

    let interval = useRef()

    const startTimer = () => {

        if (tournament) {
            const countdownDate = new Date(tournament.nextStateDate).getTime()


            interval = setInterval(() => {
                const now = new Date()
                const distance = countdownDate - now;

                const days = Math.floor(distance / (1000 * 60 * 60 * 24)).toString()
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60))).toString()
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString()
                const seconds = Math.floor((distance % (1000 * 60)) / 1000).toString()

                if (distance < 0) {
                    clearInterval(interval.current)
                } else {
                    setTimerDays(days)
                    setTimerHours(hours)
                    setTimerMinutes(minutes)
                    setTimerSeconds(seconds)
                }
            }, 1000)
        }
    }
    useEffect(() => {
        startTimer()
        return () => {
            clearInterval(interval.current)
        }
    })

    useEffect(() => {
        socket.on('TOURNAMENTS/NEWSTATE', (state) => {
            getTournament()
            startTimer()
            return () => {
                clearInterval(interval.current)
            }
        })
    }, [])


    const addingHandler = useCallback(async () => {
        try {
            socket.emit('TOURNAMENTS/REGISTRED', auth.token, tournamentId)

            return () => socket.off('TOURNAMENTS/REGISTRED')
        } catch (e) {
        }
    }, [])

    useEffect(() => {
        socket.on('TOURNAMENTS/REGISTRED:RES', (state) => {
            getTournament()
        })

        return () => socket.off('TOURNAMENTS/REGISTRED:RES')
    }, [])

    const cancelHandler = useCallback(async () => {
        try {
            socket.emit('TOURNAMENTS/CANCEL', auth.token, tournamentId)

            return () => socket.off('TOURNAMENTS/CANCEL')
        } catch (e) {
        }
    }, [])

    useEffect(() => {
        socket.on('TOURNAMENTS/CANCEL:RES', (state) => {
            getTournament()
        })

        return () => socket.off('TOURNAMENTS/CANCEL:RES')
    }, [])

    const acceptHandler = useCallback(async () => {
        try {
            socket.emit('TOURNAMENTS/CONFIRM', auth.token, tournamentId)

            return () => socket.off('TOURNAMENTS/CONFIRM')
        } catch (e) {
        }
    }, [])

    useEffect(() => {
        socket.on('TOURNAMENTS/CONFIRM:RES', (state) => {
            getTournament()
        })

        return () => socket.off('TOURNAMENTS/CONFIRM:RES')
    }, [])

    const errorHandler = async () => {

        dispatch({
            type: "error",
            message: "Введите игровой никнейм",
        })
        history.replace(`/${game}/profile-edit`)

    }

    const fetchUser = useCallback(async () => {
        try {
            const fetched = await request('/api/user/info', 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setUser(fetched)
        } catch (e) {

        }
    }, [request])

    useEffect(() => {
        fetchUser()
    }, [fetchUser])


    //Подтягиваем информацию о турнире
    const getTournament = useCallback(async () => {
        try {
            const fetched = await request(`/api/tournaments/${tournamentId}`, 'GET', null)
            setTournament(fetched)

            switch (fetched.stateTour) {
                case "WAITING":
                    setStage("Регистрация")
                    break
                case "CONFIRMATION":
                    setStage("Подтверждение")
                    break
                case "PREPARATION":
                    setStage("Подготовка")
                    break
                case "WAITING":
                    setStage("Регистрация")
                    break
                case "COMPLETION":
                    setStage("Завершён")
                    break
                case "1/1":
                    setStage("Финал")
                    break
                default:
                    setStage(fetched.stateTour)
                    break
            }
        } catch (e) {

        }
    }, [tournamentId, request])

    useEffect(() => {
        getTournament()

    }, [getTournament])


    const editHandler = useCallback(async () => {
        try {
            history.push(`/tournament/create?id=${tournamentId}`)
        } catch (e) {
        }
    }, [auth.token, request])

    const deleteHandler = useCallback(async () => {
        try {
            const data = await request('/api/tournaments/delete', 'DELETE', {tournamentId}, {
                Authorization: `Bearer ${auth.token}`
            })
            message(data.message)
            history.push('/tournaments')
        } catch (e) {
        }
    }, [auth.token, request])

    const backButton = () => {
        history.replace(`/${game}/tournaments`)
    }

    return (
        <div>
            {tournament &&
            <div>
                <div className="profile-header my-profile-title">
                    <a className="back-button" onClick={e => {
                        backButton()
                    }}>
                        <img src={Arror}/>
                    </a>
                    <h2>{tournament.title}</h2>
                </div>
                {user && roles &&
                <div style={{display: "flex"}}>
                    {roles.includes('ADMIN') && <button className="button" style={{marginRight: "20px"}}
                                                        onClick={editHandler}>Редактировать</button>}
                    {roles.includes('ADMIN') && <button className="button" onClick={deleteHandler}>Удалить</button>}
                </div>}

                <TournamentNav></TournamentNav>
                <div className="tournament-about-container">
                    <div className="tournament-info-top">
                        <img className="tournament-info-top-img" src={tournament.image}/>
                        <div className="tournaments-description">
                            <div>Описание</div>
                            {tournament.description}
                        </div>
                        {tournament.stateTour != "COMPLETION" ?
                            <div className="winners-block-none">
                                <div className="card-bubble winners-place">
                                    <div className="cup-img"><img src={GoldCup}/></div>
                                    <div className="winners-content">{tournament.prize / 2} RC</div>
                                    <div className="winners-player-zero">Ожидание призёра</div>

                                </div>
                                <div className="card-bubble winners-place">
                                    <div className="cup-img"><img src={SilverCup}/></div>
                                    <div className="winners-content">{tournament.prize / 2 / 2} RC</div>
                                    <div className="winners-player-zero">Ожидание призёра</div>
                                </div>
                                <div className="card-bubble winners-place">
                                    <div className="cup-img"><img src={BronzeCup}/></div>
                                    <div className="winners-content">{tournament.prize / 2 / 2 / 2 / 2} RC</div>
                                    <div className="winners-player-zero">Ожидание призёра</div>
                                </div>
                            </div> :
                            <div className="winners-block">
                                <div className="card-bubble winners-place winners-grid-1">
                                    <div className="cup-img"><img src={GoldCup}/></div>
                                    <div className="winners-content">{tournament.prize / 2} RC</div>
                                    <Link to={`/lol/profile/${tournament.place1._id}`} className="winners-player"><img
                                        style={{width: "60px", borderRadius: "50%"}}
                                        src={tournament.place1.image ? tournament.place1.image : ""}/>{tournament.stateTour != "COMPLETION" ? "Ожидание призёра" : tournament.place1.nickname}
                                    </Link>
                                </div>
                                <div className="card-bubble winners-place winners-grid-2">
                                    <div className="cup-img"><img src={SilverCup}/></div>
                                    <div className="winners-content">{tournament.prize / 2 / 2} RC</div>
                                    <Link to={`/lol/profile/${tournament.place2._id}`} className="winners-player"><img
                                        style={{width: "60px", borderRadius: "50%"}}
                                        src={tournament.place1.image ? tournament.place2.image : ""}/>{tournament.stateTour != "COMPLETION" ? "Ожидание призёра" : tournament.place2.nickname}
                                    </Link>
                                </div>
                                <div className="card-bubble winners-place">
                                    <div className="cup-img"><img src={BronzeCup}/></div>
                                    <div className="winners-content-34">{tournament.prize / 2 / 2 / 2 / 2} RC</div>
                                    <div className="winners-player-34"><Link
                                        to={`/lol/profile/${tournament.place34[0]._id}`}
                                        className="place34-content center"><img
                                        style={{width: "60px", borderRadius: "50%"}}
                                        src={tournament.place34[0].image ? tournament.place34[0].image : ""}/></Link>
                                    </div>
                                </div>
                                <div className="card-bubble winners-place">
                                    <div className="cup-img"><img src={BronzeCup}/></div>
                                    <div className="winners-content-34">{tournament.prize / 2 / 2 / 2 / 2} RC</div>
                                    <div className="winners-player-34"><Link
                                        to={`/lol/profile/${tournament.place34[1]._id}`}
                                        className="center place34-content"><img
                                        style={{width: "60px", borderRadius: "50%"}}
                                        src={tournament.place34[1].image ? tournament.place34[1].image : ""}/></Link>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                    <div className="tournament-info-bottom">
                        <div className="tournament-state card-bubble">
                            {(auth.token ? (!tournament.participants.includes(auth.userId) ?
                                <button className="tournament-confirm-button info-bubble"
                                        disabled={tournament.stateTour != "WAITING"}
                                        onClick={user && user.summonersName && user.summonersName != null ? addingHandler : errorHandler}>
                                    <div>Зарегистрироваться</div>
                                </button> :
                                <button className="tournament-register-button info-bubble" onClick={cancelHandler}
                                        disabled={tournament.stateTour != "WAITING"}>
                                    <div>Отменить участие</div>
                                </button>)
                                : (<Link style={{outline: "none", textDecoration: "none"}}
                                         className="tournament-register-button info-bubble" to='/authentication'>
                                    <div>Записаться на турнир</div>
                                </Link>))}
                            {auth.token ?
                            !tournament.candidates.includes(auth.userId)?
                                <button className="tournament-confirm-button info-bubble"
                                        disabled={tournament.stateTour != "CONFIRMATION"} onClick={acceptHandler}>
                                    <div>Подтвердить участие</div>
                                </button> :
                                <button className="tournament-confirm-button info-bubble"
                                        disabled onClick={acceptHandler}>
                                    <div>Участие подтверждено</div>
                                </button>
                                :<button className="tournament-confirm-button info-bubble"
                                         disabled>
                                    <div>Подтвердить участие</div>
                                </button>
                            }
                        </div>
                        <div className="tournament-state card-bubble">

                            <div className="tournament-state-info info-bubble">
                                <div className={stage === "Подтверждение" ? "font-size-40" : ""}>{stage}</div>
                                <img src={BigLine}/>
                                <p>Состояние турнира</p>
                            </div>
                            <div className="tournament-state-info info-bubble">
                                {tournament.stateTour === "COMPLETION" ? <div>Завершён</div> :
                                    timerDays != "00" && timerHours != "00" && timerMinutes != "00" && timerSeconds != "00" ?
                                        <div className="tournament-timer">
                                            <p>{timerDays}д</p>
                                            <p>{timerHours}ч</p>
                                            <p>{timerMinutes}м</p>
                                            <p>{timerSeconds}с</p>
                                        </div> : <div className="timer-zero"></div>}
                                <img src={BigLine}/>
                                <p>Следующий этап начнётся через</p>
                            </div>
                        </div>
                        <div className="tournament-info card-bubble">
                            {tournament.stateTour === "WAITING" &&
                            <div className="tournament-state-info info-bubble">
                                <div>{tournament.participants.length}</div>
                                <img src={Line}/>
                                <p>Зарегистрировано</p>
                            </div>}
                            {tournament.stateTour === "CONFIRMATION" &&
                            <div className="tournament-state-info info-bubble">
                                <div>{tournament.candidates.length}/{tournament.participants.length}</div>
                                <img src={Line}/>
                                <p>Подтверждение</p>
                            </div>}
                            {tournament.stateTour != "WAITING" && tournament.stateTour != "CONFIRMATION" &&
                            <div className="tournament-state-info info-bubble">
                                <div>{tournament.participants.length}</div>
                                <img src={Line}/>
                                <p>Участников</p>
                            </div>}
                            <div className="tournament-state-info info-bubble">
                                <div>{tournament.typeTour === "Daily" ? "1x1" : tournament.typeTour === "Premium" ? "5x5 RTC" : tournament.typeTour === "Elite" ? "5x5 RTC" : ""}</div>
                                <img src={Line}/>
                                <p>Формат</p>
                            </div>
                            <div className="tournament-state-info info-bubble">
                                <div>{tournament.typeTour}</div>
                                <img src={Line}/>
                                <p>Тип</p>
                            </div>
                            <div className="tournament-state-info info-bubble">
                                <div>{moment(tournament.date).format("DD.MM")}</div>
                                <img src={Line}/>
                                <p>Дата</p>
                            </div>
                            <div className="tournament-state-info info-bubble">
                                <div className={tournament.typeTour != "Daily" ? "stat-tour-font-size" : ""} style={{
                                    fontSize: "34px",
                                    marginTop: "40px"
                                }}>{tournament.typeTour === "Daily" ? "Бесплатно" : tournament.typeTour === "Premium" ? `${tournament.payment} RC` : tournament.typeTour === "Elite" ? `${tournament.payment} BC` : ""}</div>
                                <img src={Line}/>
                                <p>Взнос</p>
                            </div>
                            <div className="tournament-state-info info-bubble">
                                <div
                                    className="stat-tour-font-size">{tournament.typeTour === "Daily" ? `${tournament.prize} RC` : tournament.typeTour === "Premium" ? `${tournament.prize} BC` : tournament.typeTour === "Elite" ? `${tournament.prize} BC` : ""}</div>
                                <img src={Line}/>
                                <p>Призовые</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>}
        </div>
    )
}