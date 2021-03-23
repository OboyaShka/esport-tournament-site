import React, {useCallback, useContext, useEffect, useState} from 'react'
import {Link, useHistory} from "react-router-dom";
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";
import {Loader} from "./Loader";
import {useMessage} from "../hooks/message.hook";

export const TournamentCard = ({tournamentId}) => {
    const {loading, request} = useHttp()
    const auth = useContext(AuthContext)
    const [user, setUser] = useState( null)
    const [tournament, setTournament] = useState( null)
    const history = useHistory()
    const message = useMessage()

    //Добавляем/удаляем пользователя из списка участников турнира

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


    if(loading){
        return <Loader/>
    }
    if(tournament){
        if(auth.token)
            return (

                <div>
                    <button className="waves-effect waves-light btn-large" onClick={deleteHandler}>Удалить турнир</button>
                    <button className="waves-effect waves-light btn-large" onClick={editHandler}>Редактировать турнир</button>
                    <h1>{tournament.title}</h1>
                    <p>Игра: {tournament.game}</p>
                    <img style={{width: "80%"}} src={tournament.image}/>
                    <p>Описание: {tournament.description}</p>
                    <p>Участников: {tournament.participants.length}</p>
                    <p>Дата проведения: {tournament.date}</p>
                    <h4>Участников зарегистрировалось: {tournament.participants.length}</h4>
                    {!tournament.participants.includes(auth.userId)?<button className="waves-effect waves-light btn-large"  onClick={addingHandler}>Записаться на турнир</button>:
                            <button className="waves-effect waves-light btn-large" onClick={cancelHandler}>Отменить участие</button>}


                </div>

            )
        return(
            <div>
                <h1>{tournament.title}</h1>
                <h4>Участников зарегистрировалось: {tournament.participants.length}</h4>
                <Link className="waves-effect waves-light btn-large" to='/authentication'>Записаться на турнир</Link>



            </div>
        )
    }
    return <></>
}