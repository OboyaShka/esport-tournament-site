import React, {useCallback, useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {useHttp} from "../../hooks/http.hook";
import {Loader} from "../../components/Loader";
import {TournamentsCreatePage} from "../TournamentCreatePage";
import {TournamentCard} from "../../components/TournamentCard";
import {TournamentNav} from "../../components/TournamentNav";

export const LoLTournamentDetailPage = (callback, inputs) => {

    const tournamentId = useParams().id

    return(
        <div>
            <h2 className="my-profile-title">Турнир такой-то</h2>
            <TournamentNav></TournamentNav>
            <TournamentCard tournamentId={tournamentId}/>
        </div>
    )
}