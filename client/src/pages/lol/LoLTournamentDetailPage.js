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


export const LoLTournamentDetailPage = (callback, inputs) => {
    const [tournament, setTournament] = useState( null)
    const tournamentId = useParams().id
    const {loading, request} = useHttp()
    const auth = useContext(AuthContext)
    const [user, setUser] = useState( null)
    const history = useHistory()
    const message = useMessage()
    const roles = auth.userRoles
    const [timerDays, setTimerDays] = useState('00')
    const [timerHours, setTimerHours] = useState('00')
    const [timerMinutes, setTimerMinutes] = useState('00')
    const [timerSeconds, setTimerSeconds] = useState('00')


    let interval = useRef()

    const startTimer = () =>{

        if(tournament) {
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
    useEffect(()=>{
        startTimer()
        return() => {
            clearInterval(interval.current)
        }
    })

    useEffect(()=>{
        socket.on('TOURNAMENTS/NEWSTATE', ( state ) => {
            getTournament()
        })
    },[])


    const addingHandler = useCallback( async ( ) => {
        try {
            socket.emit('TOURNAMENTS/REGISTRED', auth.token, tournamentId)
        } catch (e) {}
    }, [])

    useEffect(()=>{
        socket.on('TOURNAMENTS/REGISTRED:RES', ( state ) => {
            getTournament()
        })
    },[])

    const errorHandler = async () => {
        history.push("lol/profile")
        message('Заполните имя призывателя')
    }

    const fetchUser = useCallback(async () => {
        try{
            const fetched = await request('/api/user/info', 'GET', null, {
                Authorization: `Bearer ${auth.token}`} )
            setUser(fetched)
        }catch (e) {

        }
    },[request])

    useEffect(()=>{
        fetchUser()
    },[fetchUser])


    //Подтягиваем информацию о турнире
    const getTournament = useCallback( async() => {
        try{
            const fetched = await request(`/api/tournaments/${tournamentId}`, 'GET', null)
            setTournament(fetched)
        }catch (e) {

        }
    }, [tournamentId, request])

    useEffect(() => {
        getTournament()

    },[getTournament])


    const cancelHandler = useCallback( async ( ) => {
        try {
            const data = await request('/api/tournaments/accept', 'PUT', {tournamentId, option: "delete"}, {
                Authorization: `Bearer ${auth.token}`
            })
            getTournament()
        } catch (e) {}
    }, [auth.token, request])

    const editHandler = useCallback( async () => {
        try {
            history.push(`/tournament/create?id=${tournamentId}`)
        } catch (e) {}
    }, [auth.token, request])

    const deleteHandler = useCallback( async () => {
        try {
            const data = await request('/api/tournaments/delete', 'DELETE', {tournamentId}, {
                Authorization: `Bearer ${auth.token}`
            })
            message(data.message)
            history.push('/tournaments')
        } catch (e) {}
    }, [auth.token, request])

    return(
        <div>
            {tournament && <h2 className="my-profile-title">{tournament.title}</h2>}
            {roles && roles.includes('ADMIN') &&<button className="waves-effect waves-light btn-large" onClick={deleteHandler}>Удалить турнир</button>}
            {roles && roles.includes('ADMIN') &&<button className="waves-effect waves-light btn-large" onClick={editHandler}>Редактировать турнир</button>}
            <TournamentNav></TournamentNav>
            {tournament && user && <div className="tournament-about-container">
                <div className="tournament-info-top">
                    <img src={tournament.image}/>
                    <div className="tournaments-description">
                        <div>Описание</div>
                        {tournament.description}
                    </div>
                </div>
                <div className="tournament-info-bottom">
                    <div className="tournament-state card-bubble">
                        {(auth.token? (!tournament.participants.includes(auth.userId)?<button className="tournament-register-button info-bubble" onClick={user.summonersName!= null ? addingHandler : errorHandler}><div>Зарегистрироваться</div></button>:
                            <button className="tournament-register-button info-bubble" onClick={cancelHandler}><div>Отменить участие</div></button>)
                            :( <Link className="tournament-register-button info-bubble"> to='/authentication'>Записаться на турнир</Link>))}
                        <button className="tournament-confirm-button info-bubble"><div>Подтвердить участие</div></button>
                    </div>
                    <div className="tournament-state card-bubble">
                        <div className="tournament-state-info info-bubble">
                            <div>{tournament.stateTour}</div>
                            <img src={BigLine}/>
                            <p>Состояние турнира</p>
                        </div>
                        <div className="tournament-state-info info-bubble">
                            <div className="tournament-timer">
                                <p>{timerDays}д</p>
                                <p>{timerHours}ч</p>
                                <p>{timerMinutes}м</p>
                                <p>{timerSeconds}с</p>
                            </div>
                            <img src={BigLine}/>
                            <p>Следующий этап начнётся через</p>
                        </div>
                    </div>
                    <div className="tournament-info card-bubble">
                        <div className="tournament-state-info info-bubble">
                            <div>{tournament.participants.length}/16</div>
                            <img src={Line}/>
                            <p>Игроки</p>
                        </div>
                        <div className="tournament-state-info info-bubble">
                            <div>5x5</div>
                            <img src={Line}/>
                            <p>Формат</p>
                        </div>
                        <div className="tournament-state-info info-bubble">
                            <div>Daily</div>
                            <img src={Line}/>
                            <p>Тип</p>
                        </div>
                        <div className="tournament-state-info info-bubble">
                            <div>24.05</div>
                            <img src={Line}/>
                            <p>Дата</p>
                        </div>
                        <div className="tournament-state-info info-bubble">
                            <div style={{fontSize: "34px", marginTop: "40px"}}>Бесплатно</div>
                            <img src={Line}/>
                            <p>Взнос</p>
                        </div>
                        <div className="tournament-state-info info-bubble">
                            <div>200 R</div>
                            <img src={Line}/>
                            <p>Призовые</p>
                        </div>
                    </div>
                </div>

            </div>}
        </div>
    )
}