import React, {useCallback, useContext, useEffect, useState} from "react"
import {TournamentNav} from "../../components/TournamentNav";
import {AuthContext} from "../../context/AuthContext";
import socket from "../../socket";
import {Link, useParams} from "react-router-dom";
import {useHttp} from "../../hooks/http.hook";

export const LoLTournamentMatches = () => {
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

            socket.on('TOURNAMENT/MATCHES:RES', async (matches) => {
                 setMatches(matches);

            })


            return () => socket.off('TOURNAMENT/MATCHES:RES')
        } catch (e) {
        }
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

    return (
        <div>
            {!tournament && <h2 className="my-profile-title">Турнир</h2>}
            {tournament && <h2 className="my-profile-title">{tournament.title}</h2>}
            <TournamentNav></TournamentNav>
            <div className="matches">
                <div className="matches-filters">Фитльтры</div>
                <div className="matches-content">
                    {matches != [] && matches.map((match, index) => {
                        return (
                            !!match && !!tournament && match.stateTour && tournament.stateTour &&
                            <Link className="match-link" key={index}
                                  to={`/lol/tournaments/${tournamentId}/matches/${match._id}`}>
                                <div className="match-status">

                                    {/*<div className="indicator-gamer-l" ></div>*/}
                                    <div className="match-indicator-l"
                                         style={{background: match.winner ? (match.participants[0] === null ? "#fe7968" : (match.winner === match.participants[0]._id ? "#a5c6b1" : "#fe7968")) : ""}}>
                                        <div className="match-card-l">
                                            <div className="left-gamer">
                                                {match.participants[0] && (match.participants[0] === null) ?
                                                    <div className="match-gamer">
                                                        <img style={{maxWidth: "100%", borderRadius: "50%"}}
                                                             src={auth.userAvatar}/>
                                                    </div> :
                                                    <div className="match-gamer">
                                                        <img style={{maxWidth: "100%", borderRadius: "50%"}}
                                                             src={auth.userAvatar}/>
                                                    </div>
                                                }
                                                {match.participants[0] && (match.participants[0] != null) ?
                                                    <div className="info-card-profile">
                                                        <div>
                                                            <h3 className="nickname-card">{match.participants[0].nickname}</h3>
                                                            <p className="summonersname-card">{match.participants[0].summonersName}</p>
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
                                                            <p className="summonersname-card">{match.participants[1].summonersName}</p>
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
                                                {match.participants[1] && (match.participants[1] === null) ?
                                                    <div className="match-gamer">
                                                        <img style={{maxWidth: "100%", borderRadius: "50%"}}
                                                             src={auth.userAvatar}/>
                                                    </div> :
                                                    <div className="match-gamer">
                                                        <img style={{maxWidth: "100%", borderRadius: "50%"}}
                                                             src={auth.userAvatar}/>
                                                    </div>
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
                </div>

            </div>
        </div>)

}