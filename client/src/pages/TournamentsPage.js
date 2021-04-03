import React, {useCallback, useContext, useEffect, useState} from 'react'
import {Link, useHistory} from "react-router-dom";
import {AuthContext} from "../context/AuthContext";
import {useHttp} from "../hooks/http.hook";
import {Loader} from "../components/Loader";
import {TournamentsList} from "../components/TournamentsList";


export const TournamentsPage = () => {
    const [tournaments, setTournament] = useState([])
    const {loading, request} = useHttp()
    const auth = useContext(AuthContext)
    const roles = auth.userRoles

    const fetchTournaments = useCallback(async () => {
        try{
            const fetched = await request('/api/tournaments', 'GET', null )
            setTournament(fetched)
        }catch (e) {
            
        }
    },[request])

    useEffect(()=>{
        fetchTournaments()
    },[fetchTournaments])

    if(loading){
        return <Loader/>
    }

    return (
        <div>
            <div>
                {roles && roles.includes('ADMIN') && <Link to='/tournament/create'>Создать турнир</Link>}
            </div>
            <div>
            {!loading && <TournamentsList tournaments={tournaments}/>}
            </div>
        </div>
    )
}