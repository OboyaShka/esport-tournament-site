import React, {useCallback, useContext, useEffect, useState} from 'react'
import {TournamentNav} from "../../components/TournamentNav";
import SearchIcon from "../../img/search_icon.svg";
import {Link, useParams} from "react-router-dom";
import GoldCup from "../../img/gold_cup.svg";
import {useHttp} from "../../hooks/http.hook";
import socket from "../../socket";

export const LoLTournamentTeams = () => {
    const tournamentId = useParams().id
    const teamId = useParams().idm
    const [team, setTeam] = useState([])
    const [tournament, setTournament] = useState(null)
    const {loading, request} = useHttp()


    //Подтягиваем информацию о турнире
    const getTournament = useCallback(async () => {
        try {
            const fetched = await request(`/api/tournaments/${tournamentId}`, 'GET', null)
            setTournament(fetched)

        } catch (e) {

        }
    }, [tournamentId, request])

    useEffect(() => {
        getTournament()

    }, [getTournament])

    const getTeams = useCallback(async () => {
        try {
            socket.emit('TOURNAMENT/TEAM', tournamentId, teamId)

            socket.on('TOURNAMENT/TEAM:RES', async (team) => {

                setTeam(team);
            })


            return () => socket.off('TOURNAMENT/TEAM:RES')
        } catch (e) {
        }
    }, [])

    useEffect(() => {
        getTeams()
    }, [getTeams])


    return (
        <div>
            {tournament && <h2 className="my-profile-title">Команды {tournament.title}</h2>}

            <div className="participants-content">

                {/*<div className="participants-cards">*/}
                {/*    {participants && participants.map((participant) => {*/}
                {/*        return (*/}
                {/*            <Link to={`/lol/profile/${participant._id}`} className="participants-card">*/}
                {/*                <div className="participants-card-img">*/}
                {/*                    <img src={participant.image}*/}
                {/*                         style={{width: "100%", borderRadius: "25px 0 0 25px"}}/>*/}
                {/*                </div>*/}
                {/*                <div className="participants-card-info">*/}
                {/*                    <div className="participants-card-nickname">{participant.nickname}</div>*/}
                {/*                    <div className="participants-card-summonersname">{participant.summonersName}</div>*/}
                {/*                    {tournament.type==="Daily"?*/}
                {/*                        <div className="participants-card-elo">Рейтинг: {participant.stat_lol_tournaments_rating}</div>:""}*/}
                {/*                </div>*/}
                {/*                <div className="participants-card-statistic"><var>0</var> <img style={{maxWidth: "50%"}}*/}
                {/*                                                                               src={GoldCup}/></div>*/}
                {/*            </Link>*/}
                {/*        )*/}
                {/*    })*/}


                {/*    }*/}
                {/*</div>*/}
            </div>
        </div>)

}