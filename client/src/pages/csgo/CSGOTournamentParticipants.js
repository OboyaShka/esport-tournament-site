import React, {useCallback, useContext, useEffect, useState} from "react"
import {TournamentNav} from "../../components/TournamentNav";
import SearchIcon from "../../img/search_icon.svg";
import {AuthContext} from "../../context/AuthContext";
import GoldCup from "../../img/gold_cup.svg"
import {Link, useParams} from "react-router-dom";
import socket from "../../socket";
import {useHttp} from "../../hooks/http.hook";
import {Loader} from "../../components/Loader"

export const CSGOTournamentParticipants = () => {
    const auth = useContext(AuthContext)
    const tournamentId = useParams().id
    const [participants, setParticipants] = useState([])
    const [tournament, setTournament] = useState(null)
    const {loading, request} = useHttp()
    const [search, setSearch] = useState("")

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


    const getParticipants = useCallback(async (search) => {
        try {
            socket.emit('TOURNAMENT/PARTICIPANTS', tournamentId, search)

            socket.on('TOURNAMENT/PARTICIPANTS:RES', async (participants) => {
                setParticipants(participants);

            })


            return () => socket.off('TOURNAMENT/PARTICIPANTS:RES')
        } catch (e) {
        }
    }, [])

    useEffect(() => {
        getParticipants()
    }, [getParticipants])

    const inputSearch = e =>{
        getParticipants(e.target.value)
    }

    return (
        <div>
            {tournament && <h2 className="my-profile-title">{tournament.title}</h2>}
            <TournamentNav></TournamentNav>

            <div className="participants-content">
                <div className="tournaments-search">
                    <input onChange={e => inputSearch(e)} name="s" placeholder="Никнейм игрока..." type="search"/>
                    <button type="submit">
                        <img src={SearchIcon}/></button>
                </div>
                <div className="participants-cards">
                    {participants && participants.map((participant) => {
                        return (
                            <Link to={`/lol/profile/${participant._id}`} className="participants-card">
                                <div className="participants-card-img">
                                    <img src={participant.image}
                                         style={{width: "100%", borderRadius: "25px 0 0 25px"}}/>
                                </div>
                                <div className="participants-card-info">
                                    <div className="participants-card-nickname">{participant.nickname}</div>
                                    <div className="participants-card-summonersname">{participant.summonersName}</div>
                                    <div className="participants-card-elo">Рейтинг: {participant.stat_csgo_tournaments_rating}</div>
                                </div>
                                <div className="participants-card-statistic"><var>0</var> <img style={{maxWidth: "50%"}}
                                                                                               src={GoldCup}/></div>
                            </Link>
                        )
                    })


                    }
                </div>
            </div>
        </div>)

}