import React, {useCallback, useContext, useEffect, useState} from 'react'
import {Link, useHistory} from "react-router-dom";
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";
import {Loader} from "./Loader";
import {useMessage} from "../hooks/message.hook";
import {ParticipantsTable} from "./ParticipantsTable";
import moment from 'moment'
import socket from "../socket";


export const TournamentCard = ({tournamentId}) => {
    const {loading, request} = useHttp()
    const message = useMessage()
    const auth = useContext(AuthContext)
    const [tournament, setTournament] = useState( null)
    const history = useHistory()
    const roles = auth.userRoles
    const [user, setUser] = useState( null)
    const DataNow = new moment(Date()).format("DD/MM/YY HH:mm")
    const Data = new Date()
    const [stateT, setStateT] = useState( null)


    useEffect(()=>{
        socket.on('TOURNAMENTS/NEWSTATE', ( state ) => {
            getTournament()
        })
    },[])


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

    //Добавляем/удаляем пользователя из списка участников турнира
    const confirmHandler = useCallback( async ( ) => {
        try {
            const data = await request('/api/tournaments/accept', 'PUT', {tournamentId, option: "confirm"}, {
                Authorization: `Bearer ${auth.token}`,
            })
            getTournament()
        } catch (e) {}
    }, [auth.token, request])


    const addingHandler = useCallback( async ( ) => {
        try {
            const data = await request('/api/tournaments/accept', 'PUT', {tournamentId, option: "add"}, {
                Authorization: `Bearer ${auth.token}`,
            })
            getTournament()
        } catch (e) {}
    }, [auth.token, request])

    const cancelHandler = useCallback( async ( ) => {
        try {
            const data = await request('/api/tournaments/accept', 'PUT', {tournamentId, option: "delete"}, {
                Authorization: `Bearer ${auth.token}`
            })
            getTournament()
        } catch (e) {}
    }, [auth.token, request])

    const errorHandler = async () => {
        history.push("/profile")
        message('Заполните имя призывателя')
    }

    const stateHandler = useCallback( async () => {
        try {
            socket.emit('TOURNAMENTS/STATECHANGE', tournamentId, "CONFIRMATION")
        } catch (e) {}
    }, [])

    const cancelStateHandler = useCallback( async () => {
        try {
            socket.emit('TOURNAMENTS/STATECHANGE', tournamentId, "WAITING")
        } catch (e) {}
    }, [])



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


    //
    // if(loading){
    //     return <Loader/>
    // }
    if(tournament && user){

            return (
                <div>
                    {roles && roles.includes('ADMIN') &&<button className="waves-effect waves-light btn-large" onClick={deleteHandler}>Удалить турнир</button>}
                    {roles && roles.includes('ADMIN') &&<button className="waves-effect waves-light btn-large" onClick={editHandler}>Редактировать турнир</button>}
                    {roles && roles.includes('ADMIN') &&<button className="waves-effect waves-light btn-large" onClick={stateHandler}>Начать подготовку</button>}
                    {roles && roles.includes('ADMIN') &&<button className="waves-effect waves-dark btn-large" onClick={cancelStateHandler}>Отменить подготовку</button>}
                    <h1>{tournament.title}</h1>
                    <p>Игра: {tournament.game}</p>
                    <p>Тип: {tournament.typeTour}</p>
                    <p>Статус: {tournament.stateTour}</p>
                    <img style={{width: "80%"}} src={tournament.image}/>
                    <p>Описание: {tournament.description}</p>
                    <p>Участников: {tournament.participants.length}</p>
                    <p>Дата проведения: {moment(tournament.date).format("DD/MM/YY HH:mm")}</p>

                    <p>Сейчас: {DataNow}</p>
                    <h4>Участников зарегистрировалось: {tournament.participants.length}</h4>

                    {tournament.stateTour === "WAITING"?((auth.token? (!tournament.participants.includes(auth.userId)?<button className="waves-effect waves-light btn-large"  onClick={user.summonersName != null ? addingHandler : errorHandler}>Записаться на турнир</button>:
                        <button className="waves-effect waves-light btn-large" onClick={cancelHandler}>Отменить участие</button>)
                    :( <Link className="waves-effect waves-light btn-large" to='/authentication'>Записаться на турнир</Link>))):""}

                    { tournament.stateTour === "CONFIRMATION"? <button className="waves-effect waves-light btn-large" onClick={confirmHandler}>Подтвердить участие</button>:""}

                    <ParticipantsTable participants={tournament.participants} tournamentId={tournamentId} />
                </div>
            )

    }
    return <></>
}