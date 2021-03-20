import React, {useCallback, useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {useHttp} from "../hooks/http.hook";
import {Loader} from "../components/Loader";
import {TournamentsCreatePage} from "./TournamentCreatePage";
import {TournamentCard} from "../components/TournamentCard";

export const TournamentDetailPage = (callback, inputs) => {
    //const [tournament, setTournament] = useState( null)
    const tournamentId = useParams().id
    const {request, loading} = useHttp()

    // const getTournament = useCallback( async() => {
    //     try{
    //         const fetched = await request(`/api/tournaments/${tournamentId}`, 'GET', null)
    //         setTournament(fetched)
    //     }catch (e) {
    //
    //     }
    // }, [tournamentId, request])
    //
    // useEffect(() => {
    //     getTournament()
    // },[getTournament])
    //
    // if(loading){
    //     return <Loader/>
    // }

    return(
            <TournamentCard tournamentId={tournamentId}/>
    )
}