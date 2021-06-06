import React, {useCallback, useContext, useEffect, useState} from "react"
import {TournamentNav} from "../../components/TournamentNav";
import {AuthContext} from "../../context/AuthContext";
import socket from "../../socket";
import {Link, useParams} from "react-router-dom";
import {useHttp} from "../../hooks/http.hook";
import Select from "react-select";

export const CSGOTournamentMatches = () => {
    const auth = useContext(AuthContext)
    const [matches, setMatches] = useState([])
    const tournamentId = useParams().id
    const [tournament, setTournament] = useState(null)
    const {loading, request} = useHttp()

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

    const getMatches = useCallback(async () => {
        try {
            socket.emit('TOURNAMENT/MATCHES', tournamentId)

            socket.on('TOURNAMENT/MATCHES:RES', async (matches, tournamentIdKey) => {
                if(tournamentId === tournamentIdKey){
                    setMatches(matches)
                }

            })


            return () => socket.off('TOURNAMENT/MATCHES:RES')
        } catch (e) {
        }
    }, [])

    useEffect(() => {
        socket.on('TOURNAMENT/MATCH-WINNER:RES', () => {
            getTournament()
            getMatches()


        })

        return () => socket.off('TOURNAMENT/MATCH-WINNER:RES')
    }, [])

    useEffect(() => {
        getMatches()
    }, [getMatches])

    useEffect(() => {
        socket.on('TOURNAMENTS/NEWSTATE', (state) => {
            getTournament()
            getMatches()

        })

        return () => socket.off('TOURNAMENTS/NEWSTATE')
    }, [])

    useEffect(() => {
        socket.on('TOURNAMENT/MATCH-WINNER:RES', () => {
            getTournament()
            getMatches()

        })

        return () => socket.off('TOURNAMENT/MATCH-WINNER:RES')
    }, [])

    const optionsType =[
        { value: 'Daily', label: 'Daily' },
        { value: 'Premium', label: 'Premium' },
        { value: 'Elite', label: 'Elite' }
    ]

    const optionsFormat =[
        { value: '1x1', label: '1x1' },
        { value: '5x5', label: '5x5' },
        { value: '5x5 RTC', label: '5x5 RTC' }
    ]

    return (
        <div>
            {!tournament && <h2 className="my-profile-title">Турнир</h2>}
            {tournament && <h2 className="my-profile-title">{tournament.title}</h2>}
            <TournamentNav></TournamentNav>
            {tournament &&
            <div className="matches">
                {/*<div className="matches-filters">*/}
                {/*    <div><Select className="matches-filters-selector select-type" placeholder="Поиск по игроку..." options={optionsType}/></div>*/}
                {/*    <div><Select className="matches-filters-selector select-type" placeholder="Этап матча..." options={optionsType}/></div>*/}
                {/*    <div><Select className=" matches-filters-selector select-type" placeholder="Состояние матча..." options={optionsFormat}/></div>*/}
                {/*</div>*/}
                {tournament.stateTour === "WAITING" || tournament.stateTour === "CONFIRMATION" ?
                    <div className="tour-not-ready-matches">Ожидание начала турнира</div>
                    :
                    <div className="matches-content">
                    {matches != [] && matches.map((match, index) => {
                        return (
                            !!match && !!tournament && match.stateTour && tournament.stateTour &&
                            <Link className="match-link" key={index}
                                  to={`/lol/tournaments/${tournamentId}/matches/${match._id}`}>
                                <div className={match.participants[0]!=null && match.participants[1]!=null && (match.participants[0]._id===(auth.userId)||match.participants[1]._id===(auth.userId))?"match-status-my":"match-status"}>
                                    <div className="match-indicator-l"
                                         style={{background: match.winner ? (match.participants[0] === null ? "#fe7968" : (match.winner === match.participants[0]._id ? "#a5c6b1" : "#fe7968")) : ""}}>
                                        <div className="match-card-l">
                                            <div className="left-gamer">
                                                {match.participants[0] && ((match.participants[0] === null) ?
                                                    <div className="match-gamer">
                                                        <img style={{maxWidth: "100%", borderRadius: "50%"}}
                                                                 src={auth.userAvatar}/>
                                                    </div> :
                                                    <div className="match-gamer">
                                                        <img style={{maxWidth: "100%", borderRadius: "50%"}}
                                                             src={match.participants[0].image}/>
                                                    </div>)
                                                }
                                                {match.participants[0] && (match.participants[0] != null) ?
                                                    <div className="info-card-profile">
                                                        <div>
                                                            <h3 className="nickname-card">{match.participants[0].nickname}</h3>
                                                            <p className="summonersname-card">{match.participants[0].steamID}</p>
                                                        </div>
                                                    </div> :
                                                    (!match.winner ?
                                                            <div className="info-card-profile">
                                                                <div>
                                                                    <h3 className="nickname-card">Ожидание</h3>
                                                                    <p className="summonersname-card"></p>
                                                                </div>
                                                            </div> :
                                                            <div className="info-card-profile">
                                                                <div className="noenemy">
                                                                    <h3 className="nickname-card">Нет оппонента</h3>
                                                                    <p className="summonersname-card"></p>
                                                                </div>
                                                            </div>
                                                    )
                                                }

                                            </div>
                                        </div>
                                    </div>
                                    {tournament.stateTour && match.stateTour &&
                                    <div className="match-indicator-c"
                                         style={tournament.stateTour === match.stateTour ? {background: "#9BC3FF"} :
                                             (match.winner ? {background: "#c1c8c7"} : {background: "#f2b9cc"})}>
                                        <div className="match-card-c">
                                            <div className="center-gamer">
                                                <p>vs</p>
                                                <div>
                                                    <p>{match.stateTour} 18:00</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>}
                                    <div className="match-indicator-r"
                                         style={{background: match.winner ? (match.participants[1] === null ? "#fe7968" : (match.winner === match.participants[1]._id ? "#a5c6b1" : "#fe7968")) : ""}}>
                                        <div className="match-card-r">
                                            <div className="right-gamer">
                                                {match.participants[1] && (match.participants[1] != null) ?
                                                    <div className="info-card-profile">
                                                        <div>
                                                            <h3 className="nickname-card">{match.participants[1].nickname}</h3>
                                                            <p className="summonersname-card">{match.participants[1].steamID}</p>
                                                        </div>
                                                    </div> :
                                                    (!match.winner ?
                                                            <div className="info-card-profile">
                                                                <div>
                                                                    <h3 className="nickname-card">Ожидание</h3>
                                                                    <p className="summonersname-card"></p>
                                                                </div>
                                                            </div> :
                                                            <div className="info-card-profile">
                                                                <div>
                                                                    <h3 className="nickname-card">Нет оппонента</h3>
                                                                    <p className="summonersname-card"></p>
                                                                </div>
                                                            </div>
                                                    )
                                                }
                                                {match.participants[1] && ((match.participants[1] === null) ?
                                                    <div className="match-gamer">
                                                        <img style={{maxWidth: "100%", borderRadius: "50%"}}
                                                             src={auth.userAvatar}/>
                                                    </div> :
                                                    <div className="match-gamer">
                                                        <img style={{maxWidth: "100%", borderRadius: "50%"}}
                                                             src={match.participants[1].image}/>
                                                    </div>)
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    {/*<div className="indicator-gamer-r" ></div>*/}

                                </div>
                            </Link>
                        )
                    })

                    }
                </div>}

            </div>}
        </div>)

}