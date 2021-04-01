import React, {useCallback, useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {useHttp} from "../../hooks/http.hook";
import {Loader} from "../../components/Loader";
import {TournamentsCreatePage} from "../TournamentCreatePage";
import {TournamentCard} from "../../components/TournamentCard";

export const LoLTournamentDetailPage = (callback, inputs) => {
    const tournamentId = useParams().id


    return(
            <TournamentCard tournamentId={tournamentId}/>
    )
}