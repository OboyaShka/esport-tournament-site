import React, {useCallback, useContext, useEffect, useState} from "react"
import {TournamentNav} from "../../components/TournamentNav";
import {AuthContext} from "../../context/AuthContext";
import socket from "../../socket";
import {useParams} from "react-router-dom";
import {useHttp} from "../../hooks/http.hook";

export const LoLTournamentMatchDetailPage = () => {
    const auth = useContext(AuthContext)
    const tournamentId = useParams().id
    const matchId = useParams().idm
    //Подтягиваем информацию о турнире
    const [tournament, setTournament] = useState(null)
    const {loading, request} = useHttp()
    const [match, setMatch] = useState([])

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
            socket.emit('TOURNAMENT/MATCH', matchId)

            socket.on('TOURNAMENT/MATCH:RES', async (match) => {
                setMatch(match)
            })

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
    }, [])

    const setWinner = useCallback(async (n) => {
        try {
                socket.emit('TOURNAMENT/MATCH-WINNER', matchId, n)

        } catch (e) {
            console.log(e)
        }
    }, [])



    const delWinner = useCallback(async () => {
        try {


        } catch (e) {
        }
    }, [])

    useEffect(() => {
        socket.on('TOURNAMENT/MATCH-WINNER:RES', () => {
            getTournament()
            getMatches()
        })
    }, [])


    return (
        <div>
            {!tournament && <h2 className="my-profile-title">Турнир</h2>}
            {tournament && <h2 className="my-profile-title">{tournament.title}</h2>}
            {match && match.participants &&
            <div className="detail-match">
                <div>
                    <button onClick={e => {
                        setWinner(0)
                    }}>Левый победил
                    </button>
                    <button onClick={e => {
                        delWinner()
                    }}>Ресет
                    </button>
                    <button onClick={e => {
                        setWinner(1)
                    }}>Правый победил
                    </button>
                </div>
                <div className="players-match">
                    {tournament.stateTour&&
                    <div className="left-gamer-indicator"
                         style={{background: match.winner ? (match.participants[0] != null ? (match.winner === match.participants[0]._id ? "#a5c6b1" : "#fe7968") : "#fe7968") : ""}}>
                        <div className="players-match-l">
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
                                                    <h3 className="nickname-card">Ожидание игрока</h3>
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
                    </div>}
                    {tournament.stateTour&&
                    <div className="left-gamer-indicator"
                         style={tournament.stateTour != null && tournament.stateTour === match.stateTour ? {background: "#9BC3FF"} :
                             (match.winner ? {background: "#c1c8c7"} : {background: "#f2b9cc"})}>
                        <div className="time-match"><p>{match.stateTour} 18:00</p></div>
                    </div>}

                    <div className="left-gamer-indicator"
                         style={{background: match.winner ? (match.participants[1] != null ? (match.participants[1]._id && match.winner === match.participants[1]._id ? "#a5c6b1" : "#fe7968") : "#fe7968") : ""}}>
                        <div className="players-match-r">
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
                                                    <h3 className="nickname-card">Ожидание игрока</h3>
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
                </div>
                {(match.participants[0] != null && match.participants[0] != null &&
                    (match.participants[0]._id === auth.userId ||
                        match.participants[1]._id === auth.userId) || auth.userRoles.includes("ADMIN") || auth.userRoles.includes("MODERATOR")) &&
                <div className="bottom-match">
                    <div>Кнопки</div>
                    <div className="chat-match"></div>
                    <div>Описание</div>
                </div>}
            </div>
            }
        </div>
    )
}