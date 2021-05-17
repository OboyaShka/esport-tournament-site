import React, {useCallback, useContext, useEffect, useState} from "react"
import {TournamentNav} from "../../components/TournamentNav";
import {AuthContext} from "../../context/AuthContext";
import {Link, useParams} from "react-router-dom";
import {useHttp} from "../../hooks/http.hook";
import socket from "../../socket";
import {match} from "http-proxy-middleware/dist/context-matcher";

export const LoLTournamentBracket = () => {
    const auth = useContext(AuthContext)
    const tournamentId = useParams().id
    const matchId = useParams().idm
    //Подтягиваем информацию о турнире
    const [tournament, setTournament] = useState(null)
    const {loading, request} = useHttp()
    const [matches, setMatches] = useState([])
    const [matches1, setMatches1] = useState([])
    const [matches2, setMatches2] = useState([])
    const [matches4, setMatches4] = useState([])
    const [matches8, setMatches8] = useState([])
    const GHOST = "60997a65c61bea02000a4476"

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

                let Matches1Arr = []

                matches.map((match) => {
                    if (match.stateTour.includes('1/1')) {
                        Matches1Arr.push(match)
                    }
                })

                setMatches1(Matches1Arr)

                let Matches2Arr = []

                matches.map((match) => {
                    if (match.stateTour.includes('1/2')) {
                        Matches2Arr.push(match)
                    }
                })

                setMatches2(Matches2Arr)

                let Matches4Arr = []

                matches.map((match) => {
                    if (match.stateTour.includes('1/4')) {
                        Matches4Arr.push(match)
                    }
                })

                setMatches4(Matches4Arr)

                let Matches8Arr = []

                matches.map((match) => {
                    if (match.stateTour.includes('1/8')) {
                        Matches8Arr.push(match)
                    }
                })

                setMatches8(Matches8Arr)

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

    return (
        <div>{tournament &&
        <div>
            <div><h2 className="my-profile-title">{tournament.title}</h2></div>
            <TournamentNav></TournamentNav>
            {matches && matches != [] && tournament != [] && matches1 && matches2 && matches4 && matches8 &&
            <div className="bracket-content">

                {tournament.participants.length === 8 &&
                <div className="bracket-main-4">

                    <div className="bracket-final-4">
                        <h5 className="bracket-text">Финал 18:00</h5>
                        {matches1 != null && matches1 && matches1 != [] && matches1[0] != undefined &&
                        <Link to={`/lol/tournaments/${tournamentId}/matches/${matches1[0]._id}`}
                              style={{textDecoration: "none"}} className="bracket-match-final">
                            <div
                                className={matches1[0].winner && matches1[0].participants[0]._id === matches1[0].winner ? "bracket-match-final-l-w" : "bracket-match-final-l"}>
                                {matches1[0].participants[0] ? <div className="bracket-match-final-left">
                                    <div className="bracket-img-l">
                                        <img style={{maxWidth: "80%", borderRadius: "50%"}}
                                             src={matches1[0].participants[0].image}/>
                                    </div>
                                    <div
                                        className={matches1[0].winner && matches1[0].participants[0]._id === matches1[0].winner ? "bracket-match-text-final-w" : "bracket-match-text-final"}>{matches1[0].participants[0].nickname}</div>
                                </div> : ""}
                            </div>
                            <div
                                className={matches.winner && matches1[0].participants[1]._id === matches1[0].winner ? "bracket-match-final-r-w" : "bracket-match-final-r"}>
                                {matches1[0].participants[1] && <div className="bracket-match-final-right">
                                    <div
                                        className={matches1[0].winner && matches1[0].participants[1]._id === matches1[0].winner ? "bracket-match-text-final-w" : "bracket-match-text-final"}>{matches1[0].participants[1].nickname}</div>
                                    <div className="bracket-img-r">
                                        <img style={{maxWidth: "80%", borderRadius: "50%"}}
                                             src={matches1[0].participants[1].image}/>
                                    </div>
                                </div>}
                            </div>
                        </Link>}
                    </div>

                    {matches4 != null && matches4 && matches4 != [] && matches4[0] != undefined &&
                    <div className="bracket-main-content-4">
                        <div></div>

                        <div className="bracket-matches-chain">

                            <div>
                                <Link Link to={`/lol/tournaments/${tournamentId}/matches/${matches4[0]._id}`}
                                      style={{textDecoration: "none"}}
                                      className={matches4[0].winner && matches4[0].participants[0]._id === matches4[0].winner ? "bracket-match-t-w" : "bracket-match-t"}>
                                    {matches4[0].participants[0] ? <div className="bracket-match-block">
                                        <div className="bracket-img-l">
                                            <img style={{maxWidth: "80%", borderRadius: "50%"}}
                                                 src={matches4[0].participants[0].image}/>
                                        </div>
                                        <div
                                            className={matches4[0].winner && matches4[0].participants[0]._id === matches4[0].winner ? "bracket-match-text-w" : "bracket-match-text"}>{matches4[0].participants[0].nickname}</div>
                                    </div> : ""}     </Link>
                            </div>
                            <div className="bracket-match-border-block">
                                <div>
                                    <Link Link to={`/lol/tournaments/${tournamentId}/matches/${matches4[0]._id}`}
                                          style={{textDecoration: "none"}}
                                          className={matches4[0].winner && matches4[0].participants[1]._id === matches4[0].winner ? "bracket-match-b-w" : "bracket-match-b"}>
                                        {matches4[0].participants[1] ? <div className="bracket-match-block">
                                            <div className="bracket-img-l">
                                                <img style={{maxWidth: "80%", borderRadius: "50%"}}
                                                     src={matches4[0].participants[1].image}/>
                                            </div>
                                            <div
                                                className={matches4[0].winner && matches4[0].participants[1]._id === matches4[0].winner ? "bracket-match-text-w" : "bracket-match-text"}>{matches4[0].participants[1].nickname}</div>
                                        </div> : ""}   </Link>
                                </div>

                                <div>
                                    <Link Link to={`/lol/tournaments/${tournamentId}/matches/${matches4[1]._id}`}
                                          style={{textDecoration: "none"}}
                                          className={matches4[1].winner && matches4[1].participants[0]._id === matches4[1].winner ? "bracket-match-t-w" : "bracket-match-t"}>
                                        {matches4[1].participants[0] ? <div className="bracket-match-block">
                                            <div className="bracket-img-l">
                                                <img style={{maxWidth: "80%", borderRadius: "50%"}}
                                                     src={matches4[1].participants[0].image}/>
                                            </div>
                                            <div
                                                className={matches4[1].winner && matches4[1].participants[0]._id === matches4[1].winner ? "bracket-match-text-w" : "bracket-match-text"}>{matches4[1].participants[0].nickname}</div>
                                        </div> : ""} </Link>
                                </div>
                            </div>
                            <div>
                                <Link Link to={`/lol/tournaments/${tournamentId}/matches/${matches4[1]._id}`}
                                      style={{textDecoration: "none"}}
                                      className={matches4[1].winner && matches4[1].participants[1]._id === matches4[1].winner ? "bracket-match-b-w" : "bracket-match-b"}>
                                    {matches4[1].participants[1] ? <div className="bracket-match-block">
                                        <div className="bracket-img-l">
                                            <img style={{maxWidth: "80%", borderRadius: "50%"}}
                                                 src={matches4[1].participants[1].image}/>
                                        </div>
                                        <div
                                            className={matches4[1].winner && matches4[1].participants[1]._id === matches4[1].winner ? "bracket-match-text-w" : "bracket-match-text"}>{matches4[1].participants[1].nickname}</div>
                                    </div> : ""} </Link>
                            </div>
                        </div>

                        <div></div>
                    </div>}

                    {matches2 != null && matches2 && matches2 != [] && matches2[0] != undefined &&
                    <div className="bracket-main-content-2">
                        <div className="bracket-match-1-2">
                            <div className="bracket-match-1-2-border">
                                <div className="match-set-center">
                                    <Link to={`/lol/tournaments/${tournamentId}/matches/${matches2[0]._id}`}
                                          style={{textDecoration: "none"}}
                                          className={matches2[0].winner && matches2[0].participants[0]._id === matches2[0].winner ? "bracket-match-t-w" : "bracket-match-t"}>
                                        {matches2[0].participants[0] ? <div className="bracket-match-block">
                                            <div className="bracket-img-l">
                                                <img style={{maxWidth: "80%", borderRadius: "50%"}}
                                                     src={matches2[0].participants[0].image}/>
                                            </div>
                                            <div
                                                className={matches2[0].winner && matches2[0].participants[0]._id === matches2[0].winner ? "bracket-match-text-w" : "bracket-match-text"}>{matches2[0].participants[0].nickname}</div>
                                        </div> : ""}</Link>
                                </div>
                            </div>
                            <div className="match-set-center">
                                <Link to={`/lol/tournaments/${tournamentId}/matches/${matches2[0]._id}`}
                                      style={{textDecoration: "none"}}
                                      className={matches2[0].winner && matches2[0].participants[1]._id === matches2[0].winner ? "bracket-match-b-w" : "bracket-match-b"}>
                                    {matches2[0].participants[1] ? <div className="bracket-match-block">
                                        <div className="bracket-img-l">
                                            <img style={{maxWidth: "80%", borderRadius: "50%"}}
                                                 src={matches2[0].participants[1].image}/>
                                        </div>
                                        <div
                                            className={matches2[0].winner && matches2[0].participants[1]._id === matches2[0].winner ? "bracket-match-text-w" : "bracket-match-text"}>{matches2[0].participants[1].nickname}</div>
                                    </div> : ""}</Link>
                            </div>
                        </div>
                    </div>}

                    {matches2 != null && matches2 && matches2 != [] && matches2[0] != undefined &&
                    <div className="bracket-main-content-2">

                        <div className="bracket-match-1-2">
                            <div className="bracket-match-1-2-border-r">
                                <div className="match-set-center">
                                    <Link to={`/lol/tournaments/${tournamentId}/matches/${matches2[1]._id}`}
                                          style={{textDecoration: "none"}}
                                          className={matches2[1].winner && matches2[1].participants[0]._id === matches2[1].winner ? "bracket-match-t-w" : "bracket-match-t"}>
                                        {matches2[1].participants[0] ? <div className="bracket-match-block">
                                            <div className="bracket-img-l">
                                                <img style={{maxWidth: "80%", borderRadius: "50%"}}
                                                     src={matches2[1].participants[0].image}/>
                                            </div>
                                            <div
                                                className={matches2[1].winner && matches2[1].participants[0]._id === matches2[1].winner ? "bracket-match-text-w" : "bracket-match-text"}>{matches2[1].participants[0].nickname}</div>
                                        </div> : ""}</Link>
                                </div>
                            </div>
                            <div className="match-set-center">
                                <Link to={`/lol/tournaments/${tournamentId}/matches/${matches2[1]._id}`}
                                      style={{textDecoration: "none"}}
                                      className={matches2[1].winner && matches2[1].participants[1]._id === matches2[1].winner ? "bracket-match-b-w" : "bracket-match-b"}>
                                    {matches2[1].participants[1] ? <div className="bracket-match-block">
                                        <div className="bracket-img-l">
                                            <img style={{maxWidth: "80%", borderRadius: "50%"}}
                                                 src={matches2[1].participants[1].image}/>
                                        </div>
                                        <div
                                            className={matches2[1].winner && matches2[1].participants[1]._id === matches2[1].winner ? "bracket-match-text-w" : "bracket-match-text"}>{matches2[1].participants[1].nickname}</div>
                                    </div> : ""} </Link>
                            </div>
                        </div>
                    </div>}

                    {matches4 != null && matches4 && matches4 != [] && matches4[0] != undefined &&
                    <div className="bracket-main-content-4">
                        <div></div>

                        <div className="bracket-matches-chain">
                            <div  className="match-set-end">
                                <Link Link to={`/lol/tournaments/${tournamentId}/matches/${matches4[2]._id}`}
                                      style={{textDecoration: "none"}}
                                      className={matches4[2].winner && matches4[2].participants[0]._id === matches4[2].winner ? "bracket-match-t-w" : "bracket-match-t"}>
                                    {matches4[2].participants[0] ? <div className="bracket-match-block">
                                        <div className="bracket-img-l">
                                            <img style={{maxWidth: "80%", borderRadius: "50%"}}
                                                 src={matches4[2].participants[0].image}/>
                                        </div>
                                        <div
                                            className={matches4[2].winner && matches4[2].participants[0]._id === matches4[2].winner ? "bracket-match-text-w" : "bracket-match-text"}>{matches4[2].participants[0].nickname}</div>
                                    </div> : ""}  </Link>
                            </div>
                            <div className="bracket-match-border-block-r">
                                <div  className="match-set-end">
                                    <Link Link to={`/lol/tournaments/${tournamentId}/matches/${matches4[2]._id}`}
                                          style={{textDecoration: "none"}}
                                          className={matches4[2].winner && matches4[2].participants[1]._id === matches4[2].winner ? "bracket-match-b-w" : "bracket-match-b"}>
                                        {matches4[2].participants[1] ? <div className="bracket-match-block">
                                            <div className="bracket-img-l">
                                                <img style={{maxWidth: "80%", borderRadius: "50%"}}
                                                     src={matches4[2].participants[1].image}/>
                                            </div>
                                            <div
                                                className={matches4[2].winner && matches4[2].participants[1]._id === matches4[2].winner ? "bracket-match-text-w" : "bracket-match-text"}>{matches4[2].participants[1].nickname}</div>
                                        </div> : ""}</Link>
                                </div>

                                <div  className="match-set-end">
                                    <Link Link to={`/lol/tournaments/${tournamentId}/matches/${matches4[3]._id}`}
                                          style={{textDecoration: "none"}}
                                          className={matches4[3].winner && matches4[3].participants[0]._id === matches4[3].winner ? "bracket-match-t-w" : "bracket-match-t"}>
                                        {matches4[3].participants[0] ? <div className="bracket-match-block">
                                            <div className="bracket-img-l">
                                                <img style={{maxWidth: "80%", borderRadius: "50%"}}
                                                     src={matches4[3].participants[0].image}/>
                                            </div>
                                            <div
                                                className={matches4[3].winner && matches4[3].participants[0]._id === matches4[3].winner ? "bracket-match-text-w" : "bracket-match-text"}>{matches4[3].participants[0].nickname}</div>
                                        </div> : ""} </Link>
                                </div>
                            </div>
                            <div  className="match-set-end">
                                <Link Link to={`/lol/tournaments/${tournamentId}/matches/${matches4[3]._id}`}
                                      style={{textDecoration: "none"}}
                                      className={matches4[3].winner && matches4[3].participants[1]._id === matches4[3].winner ? "bracket-match-b-w" : "bracket-match-b"}>
                                    {matches4[3].participants[1] ? <div className="bracket-match-block">
                                        <div className="bracket-img-l">
                                            <img style={{maxWidth: "80%", borderRadius: "50%"}}
                                                 src={matches4[3].participants[1].image}/>
                                        </div>
                                        <div
                                            className={matches4[3].winner && matches4[3].participants[1]._id === matches4[3].winner ? "bracket-match-text-w" : "bracket-match-text"}>{matches4[3].participants[1].nickname}</div>
                                    </div> : ""}  </Link>
                            </div>
                        </div>

                        <div></div>
                    </div>}

                    <div className="bracket-text bracket-main-text">1/4 18:00</div>
                    <div className="bracket-text bracket-main-text">1/2 18:00</div>
                    <div className="bracket-text bracket-main-text">1/2 18:00</div>
                    <div className="bracket-text bracket-main-text">1/4 18:00</div>

                </div>}

                {tournament.participants.length > 8 && tournament.participants.length <=16 &&
                <div className="bracket-main-8">

                    <div className="bracket-final-8">
                        <h5 className="bracket-text">Финал 18:45</h5>
                        {matches1 != null && matches1 && matches1 != [] && matches1[0] != undefined &&
                        <Link to={`/lol/tournaments/${tournamentId}/matches/${matches1[0]._id}`}
                              style={{textDecoration: "none"}} className="bracket-match-final">
                            <div
                                className={matches1[0].winner && matches1[0].participants[0]._id === matches1[0].winner ? "bracket-match-final-l-w" : "bracket-match-final-l"}>
                                {matches1[0].participants[0] ? <div className="bracket-match-final-left">
                                    <div className="bracket-img-l">
                                        <img style={{maxWidth: "80%", borderRadius: "50%"}}
                                             src={matches1[0].participants[0].image}/>
                                    </div>
                                    <div
                                        className={matches1[0].winner && matches1[0].participants[0]._id === matches1[0].winner ? "bracket-match-text-final-w" : "bracket-match-text-final"}>{matches1[0].participants[0].nickname}</div>
                                </div> : ""}
                            </div>
                            <div
                                className={matches.winner && matches1[0].participants[1]._id === matches1[0].winner ? "bracket-match-final-r-w" : "bracket-match-final-r"}>
                                {matches1[0].participants[1] && <div className="bracket-match-final-right">
                                    <div
                                        className={matches1[0].winner && matches1[0].participants[1]._id === matches1[0].winner ? "bracket-match-text-final-w" : "bracket-match-text-final"}>{matches1[0].participants[1].nickname}</div>
                                    <div className="bracket-img-r">
                                        <img style={{maxWidth: "80%", borderRadius: "50%"}}
                                             src={matches1[0].participants[1].image}/>
                                    </div>
                                </div>}
                            </div>
                        </Link>}
                    </div>

                    {matches8 != null && matches8 && matches8 != [] && matches8[0] != undefined &&
                    <div className="bracket-main-content-8">

                        <div className="bracket-matches-chain">
                            {matches8[0].participants[0]._id != GHOST ?
                                <Link to={`/lol/tournaments/${tournamentId}/matches/${matches8[0]._id}`}
                                      style={{textDecoration: "none"}}
                                      className={matches8[0].winner && matches8[0].participants[0]._id === matches8[0].winner ? "bracket-match-t-w" : "bracket-match-t"}>
                                    {matches8[0].participants[0] ? <div className="bracket-match-block">
                                        <div className="bracket-img-l">
                                            <img style={{maxWidth: "80%", borderRadius: "50%"}}
                                                 src={matches8[0].participants[0].image}/>
                                        </div>
                                        <div
                                            className={matches8[0].winner && matches8[0].participants[0]._id === matches8[0].winner ? "bracket-match-text-w" : "bracket-match-text"}>{matches8[0].participants[0].nickname}</div>
                                    </div> : ""}
                                </Link> :
                                <div className="bracket-match-t bracket-match-no-text">Нет оппонента</div>}

                            <div className="bracket-match-border-block">
                                <div>
                                    {matches8[0].participants[1]._id  != GHOST ?
                                        <Link to={`/lol/tournaments/${tournamentId}/matches/${matches8[0]._id}`}
                                              style={{textDecoration: "none"}}
                                              className={matches8[0].winner && matches8[0].participants[1]._id === matches8[0].winner ? "bracket-match-b-w" : "bracket-match-b"}>
                                            {matches8[0].participants[1] ? <div className="bracket-match-block">
                                                <div className="bracket-img-l">
                                                    <img style={{maxWidth: "80%", borderRadius: "50%"}}
                                                         src={matches8[0].participants[1].image}/>
                                                </div>
                                                <div
                                                    className={matches8[0].winner && matches8[0].participants[1]._id === matches8[0].winner ? "bracket-match-text-w" : "bracket-match-text"}>{matches8[0].participants[1].nickname}</div>
                                            </div> : ""}
                                        </Link> :
                                        <div className="bracket-match-t bracket-match-no-text">Нет оппонента</div>}
                                </div>

                                <div>

                                    {matches8[1].participants[0]._id  !=GHOST ?
                                        <Link to={`/lol/tournaments/${tournamentId}/matches/${matches8[1]._id}`}
                                              style={{textDecoration: "none"}}
                                              className={matches8[1].winner && matches8[1].participants[0]._id === matches8[1].winner ? "bracket-match-t-w" : "bracket-match-t"}>
                                            {matches8[1].participants[0] ? <div className="bracket-match-block">
                                                <div className="bracket-img-l">
                                                    <img style={{maxWidth: "80%", borderRadius: "50%"}}
                                                         src={matches8[1].participants[0].image}/>
                                                </div>
                                                <div
                                                    className={matches8[1].winner && matches8[1].participants[0]._id === matches8[1].winner ? "bracket-match-text-w" : "bracket-match-text"}>{matches8[1].participants[0].nickname}
                                                </div>
                                            </div> : ""}
                                        </Link> :
                                        <div className="bracket-match-t bracket-match-no-text">Нет оппонента</div>}


                                </div>
                            </div>
                            <div>
                                {matches8[1].participants[1]._id  != GHOST ?
                                    <Link to={`/lol/tournaments/${tournamentId}/matches/${matches8[1]._id}`}
                                          style={{textDecoration: "none"}}
                                          className={matches8[1].winner && matches8[1].participants[1]._id === matches8[1].winner ? "bracket-match-b-w" : "bracket-match-b"}>
                                        {matches8[1].participants[1] ? <div className="bracket-match-block">
                                            <div className="bracket-img-l">
                                                <img style={{maxWidth: "80%", borderRadius: "50%"}}
                                                     src={matches8[1].participants[1].image}/>
                                            </div>
                                            <div
                                                className={matches8[1].winner && matches8[1].participants[1]._id === matches8[1].winner ? "bracket-match-text-w" : "bracket-match-text"}>{matches8[1].participants[1].nickname}</div>
                                        </div> : ""}</Link> :
                                    <div className="bracket-match-t bracket-match-no-text">Нет оппонента</div>}

                            </div>
                        </div>

                        <div></div>
                        <div className="bracket-matches-chain">
                            <div>
                                {matches8[2].participants[0]._id  != GHOST ?
                                    <Link to={`/lol/tournaments/${tournamentId}/matches/${matches8[2]._id}`}
                                          style={{textDecoration: "none"}}
                                          className={matches8[2].winner && matches8[2].participants[0]._id === matches8[2].winner ? "bracket-match-t-w" : "bracket-match-t"}>
                                        {matches8[2].participants[0] ? <div className="bracket-match-block">
                                            <div className="bracket-img-l">
                                                <img style={{maxWidth: "80%", borderRadius: "50%"}}
                                                     src={matches8[2].participants[0].image}/>
                                            </div>
                                            <div
                                                className={matches8[2].winner && matches8[2].participants[0]._id === matches8[2].winner ? "bracket-match-text-w" : "bracket-match-text"}>{matches8[2].participants[0].nickname}</div>
                                        </div> : ""} </Link> :
                                    <div className="bracket-match-t bracket-match-no-text">Нет оппонента</div>}
                            </div>
                            <div className="bracket-match-border-block">
                                <div>
                                    {matches8[2].participants[1]._id  !=GHOST ?
                                        <Link to={`/lol/tournaments/${tournamentId}/matches/${matches8[2]._id}`}
                                              style={{textDecoration: "none"}}
                                              className={matches8[2].winner && matches8[2].participants[1]._id === matches8[2].winner ? "bracket-match-b-w" : "bracket-match-b"}>
                                            {matches8[2].participants[1] ? <div className="bracket-match-block">
                                                <div className="bracket-img-l">
                                                    <img style={{maxWidth: "80%", borderRadius: "50%"}}
                                                         src={matches8[2].participants[1].image}/>
                                                </div>
                                                <div
                                                    className={matches8[2].winner && matches8[2].participants[1]._id === matches8[2].winner ? "bracket-match-text-w" : "bracket-match-text"}>{matches8[2].participants[1].nickname}</div>
                                            </div> : ""}  </Link> :
                                        <div className="bracket-match-t bracket-match-no-text">Нет оппонента</div>}
                                </div>

                                <div>
                                    {matches8[3].participants[0]._id  != GHOST ?
                                        <Link to={`/lol/tournaments/${tournamentId}/matches/${matches8[3]._id}`}
                                              style={{textDecoration: "none"}}
                                              className={matches8[3].winner && matches8[3].participants[0]._id === matches8[3].winner ? "bracket-match-t-w" : "bracket-match-t"}>
                                            {matches8[3].participants[0] ? <div className="bracket-match-block">
                                                <div className="bracket-img-l">
                                                    <img style={{maxWidth: "80%", borderRadius: "50%"}}
                                                         src={matches8[3].participants[0].image}/>
                                                </div>
                                                <div
                                                    className={matches8[3].winner && matches8[3].participants[0]._id === matches8[3].winner ? "bracket-match-text-w" : "bracket-match-text"}>{matches8[3].participants[0].nickname}</div>
                                            </div> : ""}</Link> :
                                        <div className="bracket-match-t bracket-match-no-text">Нет оппонента</div>}
                                </div>
                            </div>
                            <div>
                                {matches8[3].participants[1]._id  != GHOST ?
                                    <Link to={`/lol/tournaments/${tournamentId}/matches/${matches8[3]._id}`}
                                          style={{textDecoration: "none"}}
                                          className={matches8[3].winner && matches8[3].participants[1]._id === matches8[3].winner ? "bracket-match-b-w" : "bracket-match-b"}>
                                        {matches8[3].participants[1] ? <div className="bracket-match-block">
                                            <div className="bracket-img-l">
                                                <img style={{maxWidth: "80%", borderRadius: "50%"}}
                                                     src={matches8[3].participants[1].image}/>
                                            </div>
                                            <div
                                                className={matches8[3].winner && matches8[3].participants[1]._id === matches8[3].winner ? "bracket-match-text-w" : "bracket-match-text"}>{matches8[3].participants[1].nickname}</div>
                                        </div> : ""} </Link> :
                                    <div className="bracket-match-t bracket-match-no-text">Нет оппонента</div>}
                            </div>
                        </div>
                    </div>
                    }

                    {matches4 != null && matches4 && matches4 != [] && matches4[0] != undefined &&
                    <div className="bracket-main-content-4">
                        <div></div>

                        <div className="bracket-matches-chain">

                            <div className="match-set-center">
                                <Link Link to={`/lol/tournaments/${tournamentId}/matches/${matches4[0]._id}`}
                                      style={{textDecoration: "none"}}
                                      className={matches4[0].winner && matches4[0].participants[0]._id === matches4[0].winner ? "bracket-match-t-w" : "bracket-match-t"}>
                                    {matches4[0].participants[0] ? <div className="bracket-match-block">
                                        <div className="bracket-img-l">
                                            <img style={{maxWidth: "80%", borderRadius: "50%"}}
                                                 src={matches4[0].participants[0].image}/>
                                        </div>
                                        <div
                                            className={matches4[0].winner && matches4[0].participants[0]._id === matches4[0].winner ? "bracket-match-text-w" : "bracket-match-text"}>{matches4[0].participants[0].nickname}</div>
                                    </div> : ""}     </Link>
                            </div>
                            <div className="bracket-match-border-block">
                                <div className="match-set-center">
                                    <Link Link to={`/lol/tournaments/${tournamentId}/matches/${matches4[0]._id}`}
                                          style={{textDecoration: "none"}}
                                          className={matches4[0].winner && matches4[0].participants[1]._id === matches4[0].winner ? "bracket-match-b-w" : "bracket-match-b"}>
                                        {matches4[0].participants[1] ? <div className="bracket-match-block">
                                            <div className="bracket-img-l">
                                                <img style={{maxWidth: "80%", borderRadius: "50%"}}
                                                     src={matches4[0].participants[1].image}/>
                                            </div>
                                            <div
                                                className={matches4[0].winner && matches4[0].participants[1]._id === matches4[0].winner ? "bracket-match-text-w" : "bracket-match-text"}>{matches4[0].participants[1].nickname}</div>
                                        </div> : ""}   </Link>
                                </div>

                                <div className="match-set-center">
                                    <Link Link to={`/lol/tournaments/${tournamentId}/matches/${matches4[1]._id}`}
                                          style={{textDecoration: "none"}}
                                          className={matches4[1].winner && matches4[1].participants[0]._id === matches4[1].winner ? "bracket-match-t-w" : "bracket-match-t"}>
                                        {matches4[1].participants[0] ? <div className="bracket-match-block">
                                            <div className="bracket-img-l">
                                                <img style={{maxWidth: "80%", borderRadius: "50%"}}
                                                     src={matches4[1].participants[0].image}/>
                                            </div>
                                            <div
                                                className={matches4[1].winner && matches4[1].participants[0]._id === matches4[1].winner ? "bracket-match-text-w" : "bracket-match-text"}>{matches4[1].participants[0].nickname}</div>
                                        </div> : ""} </Link>
                                </div>
                            </div>
                            <div className="match-set-center">
                                <Link Link to={`/lol/tournaments/${tournamentId}/matches/${matches4[1]._id}`}
                                      style={{textDecoration: "none"}}
                                      className={matches4[1].winner && matches4[1].participants[1]._id === matches4[1].winner ? "bracket-match-b-w" : "bracket-match-b"}>
                                    {matches4[1].participants[1] ? <div className="bracket-match-block">
                                        <div className="bracket-img-l">
                                            <img style={{maxWidth: "80%", borderRadius: "50%"}}
                                                 src={matches4[1].participants[1].image}/>
                                        </div>
                                        <div
                                            className={matches4[1].winner && matches4[1].participants[1]._id === matches4[1].winner ? "bracket-match-text-w" : "bracket-match-text"}>{matches4[1].participants[1].nickname}</div>
                                    </div> : ""} </Link>
                            </div>
                        </div>

                        <div></div>
                    </div>}

                    {matches2 != null && matches2 && matches2 != [] && matches2[0] != undefined &&
                    <div className="bracket-main-content-2">
                        <div className="bracket-match-1-2">
                            <div className="bracket-match-1-2-border">
                                <div className="match-set-center">
                                    <Link to={`/lol/tournaments/${tournamentId}/matches/${matches2[0]._id}`}
                                          style={{textDecoration: "none"}}
                                          className={matches2[0].winner && matches2[0].participants[0]._id === matches2[0].winner ? "bracket-match-t-w" : "bracket-match-t"}>
                                        {matches2[0].participants[0] ? <div className="bracket-match-block">
                                            <div className="bracket-img-l">
                                                <img style={{maxWidth: "80%", borderRadius: "50%"}}
                                                     src={matches2[0].participants[0].image}/>
                                            </div>
                                            <div
                                                className={matches2[0].winner && matches2[0].participants[0]._id === matches2[0].winner ? "bracket-match-text-w" : "bracket-match-text"}>{matches2[0].participants[0].nickname}</div>
                                        </div> : ""}</Link>
                                </div>
                            </div>
                            <div className="match-set-center">
                                <Link to={`/lol/tournaments/${tournamentId}/matches/${matches2[0]._id}`}
                                      style={{textDecoration: "none"}}
                                      className={matches2[0].winner && matches2[0].participants[1]._id === matches2[0].winner ? "bracket-match-b-w" : "bracket-match-b"}>
                                    {matches2[0].participants[1] ? <div className="bracket-match-block">
                                        <div className="bracket-img-l">
                                            <img style={{maxWidth: "80%", borderRadius: "50%"}}
                                                 src={matches2[0].participants[1].image}/>
                                        </div>
                                        <div
                                            className={matches2[0].winner && matches2[0].participants[1]._id === matches2[0].winner ? "bracket-match-text-w" : "bracket-match-text"}>{matches2[0].participants[1].nickname}</div>
                                    </div> : ""}</Link>
                            </div>
                        </div>
                    </div>}

                    {matches2 != null && matches2 && matches2 != [] && matches2[0] != undefined &&
                    <div className="bracket-main-content-2">

                        <div className="bracket-match-1-2">
                            <div className="bracket-match-1-2-border-r">
                                <div className="match-set-center">
                                    <Link to={`/lol/tournaments/${tournamentId}/matches/${matches2[1]._id}`}
                                          style={{textDecoration: "none"}}
                                          className={matches2[1].winner && matches2[1].participants[0]._id === matches2[1].winner ? "bracket-match-t-w" : "bracket-match-t"}>
                                        {matches2[1].participants[0] ? <div className="bracket-match-block">
                                            <div className="bracket-img-l">
                                                <img style={{maxWidth: "80%", borderRadius: "50%"}}
                                                     src={matches2[1].participants[0].image}/>
                                            </div>
                                            <div
                                                className={matches2[1].winner && matches2[1].participants[0]._id === matches2[1].winner ? "bracket-match-text-w" : "bracket-match-text"}>{matches2[1].participants[0].nickname}</div>
                                        </div> : ""}</Link>
                                </div>
                            </div>
                            <div className="match-set-center">
                                <Link to={`/lol/tournaments/${tournamentId}/matches/${matches2[1]._id}`}
                                      style={{textDecoration: "none"}}
                                      className={matches2[1].winner && matches2[1].participants[1]._id === matches2[1].winner ? "bracket-match-b-w" : "bracket-match-b"}>
                                    {matches2[1].participants[1] ? <div className="bracket-match-block">
                                        <div className="bracket-img-l">
                                            <img style={{maxWidth: "80%", borderRadius: "50%"}}
                                                 src={matches2[1].participants[1].image}/>
                                        </div>
                                        <div
                                            className={matches2[1].winner && matches2[1].participants[1]._id === matches2[1].winner ? "bracket-match-text-w" : "bracket-match-text"}>{matches2[1].participants[1].nickname}</div>
                                    </div> : ""} </Link>
                            </div>
                        </div>
                    </div>}

                    {matches4 != null && matches4 && matches4 != [] && matches4[0] != undefined &&
                    <div className="bracket-main-content-4">
                        <div></div>

                        <div className="bracket-matches-chain">
                            <div className="match-set-center">
                                <Link Link to={`/lol/tournaments/${tournamentId}/matches/${matches4[2]._id}`}
                                      style={{textDecoration: "none"}}
                                      className={matches4[2].winner && matches4[2].participants[0]._id === matches4[2].winner ? "bracket-match-t-w" : "bracket-match-t"}>
                                    {matches4[2].participants[0] ? <div className="bracket-match-block">
                                        <div className="bracket-img-l">
                                            <img style={{maxWidth: "80%", borderRadius: "50%"}}
                                                 src={matches4[2].participants[0].image}/>
                                        </div>
                                        <div
                                            className={matches4[2].winner && matches4[2].participants[0]._id === matches4[2].winner ? "bracket-match-text-w" : "bracket-match-text"}>{matches4[2].participants[0].nickname}</div>
                                    </div> : ""}  </Link>
                            </div>
                            <div className="bracket-match-border-block-r">
                                <div className="match-set-center">
                                    <Link Link to={`/lol/tournaments/${tournamentId}/matches/${matches4[2]._id}`}
                                          style={{textDecoration: "none"}}
                                          className={matches4[2].winner && matches4[2].participants[1]._id === matches4[2].winner ? "bracket-match-b-w" : "bracket-match-b"}>
                                        {matches4[2].participants[1] ? <div className="bracket-match-block">
                                            <div className="bracket-img-l">
                                                <img style={{maxWidth: "80%", borderRadius: "50%"}}
                                                     src={matches4[2].participants[1].image}/>
                                            </div>
                                            <div
                                                className={matches4[2].winner && matches4[2].participants[1]._id === matches4[2].winner ? "bracket-match-text-w" : "bracket-match-text"}>{matches4[2].participants[1].nickname}</div>
                                        </div> : ""}</Link>
                                </div>

                                <div className="match-set-center">
                                    <Link Link to={`/lol/tournaments/${tournamentId}/matches/${matches4[3]._id}`}
                                          style={{textDecoration: "none"}}
                                          className={matches4[3].winner && matches4[3].participants[0]._id === matches4[3].winner ? "bracket-match-t-w" : "bracket-match-t"}>
                                        {matches4[3].participants[0] ? <div className="bracket-match-block">
                                            <div className="bracket-img-l">
                                                <img style={{maxWidth: "80%", borderRadius: "50%"}}
                                                     src={matches4[3].participants[0].image}/>
                                            </div>
                                            <div
                                                className={matches4[3].winner && matches4[3].participants[0]._id === matches4[3].winner ? "bracket-match-text-w" : "bracket-match-text"}>{matches4[3].participants[0].nickname}</div>
                                        </div> : ""} </Link>
                                </div>
                            </div>
                            <div className="match-set-center">
                                <Link Link to={`/lol/tournaments/${tournamentId}/matches/${matches4[3]._id}`}
                                      style={{textDecoration: "none"}}
                                      className={matches4[3].winner && matches4[3].participants[1]._id === matches4[3].winner ? "bracket-match-b-w" : "bracket-match-b"}>
                                    {matches4[3].participants[1] ? <div className="bracket-match-block">
                                        <div className="bracket-img-l">
                                            <img style={{maxWidth: "80%", borderRadius: "50%"}}
                                                 src={matches4[3].participants[1].image}/>
                                        </div>
                                        <div
                                            className={matches4[3].winner && matches4[3].participants[1]._id === matches4[3].winner ? "bracket-match-text-w" : "bracket-match-text"}>{matches4[3].participants[1].nickname}</div>
                                    </div> : ""}  </Link>
                            </div>
                        </div>

                        <div></div>
                    </div>}

                    {matches8 != null && matches8 && matches8 != [] && matches8[0] != undefined &&
                    <div className="bracket-main-content-8">
                        <div className="bracket-matches-chain">
                            <div className="match-set-end">
                                {matches8[4].participants[0]._id  != GHOST ?
                                    <Link to={`/lol/tournaments/${tournamentId}/matches/${matches8[4]._id}`}
                                          style={{textDecoration: "none"}}
                                          className={matches8[4].winner && matches8[4].participants[0]._id === matches8[4].winner ? "bracket-match-t-w" : "bracket-match-t"}>
                                        {matches8[4].participants[0] ? <div className="bracket-match-block">
                                            <div className="bracket-img-l">
                                                <img style={{maxWidth: "80%", borderRadius: "50%"}}
                                                     src={matches8[4].participants[0].image}/>
                                            </div>
                                            <div
                                                className={matches8[4].winner && matches8[4].participants[0]._id === matches8[4].winner ? "bracket-match-text-w" : "bracket-match-text"}>{matches8[4].participants[0].nickname}</div>
                                        </div> : ""}</Link> :
                                    <div className="bracket-match-t bracket-match-no-text">Нет оппонента</div>}
                            </div>
                            <div className="bracket-match-border-block-r">
                                <div className="match-set-end">
                                    {matches8[4].participants[1]._id  != GHOST ?
                                        <Link to={`/lol/tournaments/${tournamentId}/matches/${matches8[4]._id}`}
                                              style={{textDecoration: "none"}}
                                              className={matches8[4].winner && matches8[4].participants[1]._id === matches8[4].winner ? "bracket-match-b-w" : "bracket-match-b"}>
                                            {matches8[4].participants[1] ? <div className="bracket-match-block">
                                                <div className="bracket-img-l">
                                                    <img style={{maxWidth: "80%", borderRadius: "50%"}}
                                                         src={matches8[4].participants[1].image}/>
                                                </div>
                                                <div
                                                    className={matches8[4].winner && matches8[4].participants[1]._id === matches8[4].winner ? "bracket-match-text-w" : "bracket-match-text"}>{matches8[4].participants[1].nickname}</div>
                                            </div> : ""}</Link> :
                                        <div className="bracket-match-t bracket-match-no-text">Нет оппонента</div>}
                                </div>

                                <div className="match-set-end">
                                    {matches8[5].participants[0]._id != GHOST ?
                                        <Link to={`/lol/tournaments/${tournamentId}/matches/${matches8[5]._id}`}
                                              style={{textDecoration: "none"}}
                                              className={matches8[5].winner && matches8[5].participants[0]._id === matches8[5].winner ? "bracket-match-t-w" : "bracket-match-t"}>
                                            {matches8[5].participants[0] ? <div className="bracket-match-block">
                                                <div className="bracket-img-l">
                                                    <img style={{maxWidth: "80%", borderRadius: "50%"}}
                                                         src={matches8[5].participants[0].image}/>
                                                </div>
                                                <div
                                                    className={matches8[5].winner && matches8[5].participants[0]._id === matches8[5].winner ? "bracket-match-text-w" : "bracket-match-text"}>{matches8[5].participants[0].nickname}</div>
                                            </div> : ""} </Link> :
                                        <div className="bracket-match-t bracket-match-no-text">Нет оппонента</div>}
                                </div>
                            </div>
                            <div className="match-set-end">
                                {matches8[5].participants[1]._id  != GHOST ?
                                    <Link to={`/lol/tournaments/${tournamentId}/matches/${matches8[5]._id}`}
                                          style={{textDecoration: "none"}}
                                          className={matches8[5].winner && matches8[5].participants[1]._id === matches8[5].winner ? "bracket-match-b-w" : "bracket-match-b"}>
                                        {matches8[5].participants[1] ? <div className="bracket-match-block">
                                            <div className="bracket-img-l">
                                                <img style={{maxWidth: "80%", borderRadius: "50%"}}
                                                     src={matches8[5].participants[1].image}/>
                                            </div>
                                            <div
                                                className={matches8[5].winner && matches8[5].participants[1]._id === matches8[5].winner ? "bracket-match-text-w" : "bracket-match-text"}>{matches8[5].participants[1].nickname}</div>
                                        </div> : ""} </Link> :
                                    <div className="bracket-match-t bracket-match-no-text">Нет оппонента</div>}
                            </div>
                        </div>

                        <div></div>
                        <div className="bracket-matches-chain">
                            <div className="match-set-end">
                                {matches8[6].participants[0]._id  != GHOST ?
                                    <Link to={`/lol/tournaments/${tournamentId}/matches/${matches8[6]._id}`}
                                          style={{textDecoration: "none"}}
                                          className={matches8[6].winner && matches8[6].participants[0]._id === matches8[6].winner ? "bracket-match-t-w" : "bracket-match-t"}>
                                        {matches8[6].participants[0] ? <div className="bracket-match-block">
                                            <div className="bracket-img-l">
                                                <img style={{maxWidth: "80%", borderRadius: "50%"}}
                                                     src={matches8[6].participants[0].image}/>
                                            </div>
                                            <div
                                                className={matches8[6].winner && matches8[6].participants[0]._id === matches8[6].winner ? "bracket-match-text-w" : "bracket-match-text"}>{matches8[6].participants[0].nickname}</div>
                                        </div> : ""} </Link> :
                                    <div className="bracket-match-t bracket-match-no-text">Нет оппонента</div>}
                            </div>
                            <div className="bracket-match-border-block-r">
                                <div className="match-set-end">
                                    {matches8[6].participants[1]._id  !=GHOST ?
                                        <Link to={`/lol/tournaments/${tournamentId}/matches/${matches8[6]._id}`}
                                              style={{textDecoration: "none"}}
                                              className={matches8[6].winner && matches8[6].participants[1]._id === matches8[6].winner ? "bracket-match-b-w" : "bracket-match-b"}>
                                            {matches8[6].participants[1] ? <div className="bracket-match-block">
                                                <div className="bracket-img-l">
                                                    <img style={{maxWidth: "80%", borderRadius: "50%"}}
                                                         src={matches8[6].participants[1].image}/>
                                                </div>
                                                <div
                                                    className={matches8[6].winner && matches8[6].participants[1]._id === matches8[6].winner ? "bracket-match-text-w" : "bracket-match-text"}>{matches8[6].participants[1].nickname}</div>
                                            </div> : ""} </Link> :
                                        <div className="bracket-match-t bracket-match-no-text">Нет оппонента</div>}
                                </div>

                                <div className="match-set-end">
                                    {matches8[7].participants[0]._id  != GHOST  ?
                                        <Link to={`/lol/tournaments/${tournamentId}/matches/${matches8[7]._id}`}
                                              style={{textDecoration: "none"}}
                                              className={matches8[7].winner && matches8[7].participants[0]._id === matches8[7].winner ? "bracket-match-t-w" : "bracket-match-t"}>
                                            {matches8[7].participants[0] ? <div className="bracket-match-block">
                                                <div className="bracket-img-l">
                                                    <img style={{maxWidth: "80%", borderRadius: "50%"}}
                                                         src={matches8[7].participants[0].image}/>
                                                </div>
                                                <div
                                                    className={matches8[7].winner && matches8[7].participants[0]._id === matches8[7].winner ? "bracket-match-text-w" : "bracket-match-text"}>{matches8[7].participants[0].nickname}</div>
                                            </div> : ""} </Link> :
                                        <div className="bracket-match-t bracket-match-no-text">Нет оппонента</div>}
                                </div>
                            </div>
                            <div className="match-set-end">
                                {matches8[7].participants[1]._id  != GHOST ?
                                    <Link to={`/lol/tournaments/${tournamentId}/matches/${matches8[7]._id}`}
                                          style={{textDecoration: "none"}}
                                          className={matches8[7].winner && matches8[7].participants[1]._id === matches8[7].winner ? "bracket-match-b-w" : "bracket-match-b"}>
                                        {matches8[7].participants[1] ? <div className="bracket-match-block">
                                            <div className="bracket-img-l">
                                                <img style={{maxWidth: "80%", borderRadius: "50%"}}
                                                     src={matches8[7].participants[1].image}/>
                                            </div>
                                            <div
                                                className={matches8[7].winner && matches8[7].participants[1]._id === matches8[7].winner ? "bracket-match-text-w" : "bracket-match-text"}>{matches8[7].participants[1].nickname}</div>
                                        </div> : ""} </Link> :
                                    <div className="bracket-match-t bracket-match-no-text">Нет оппонента</div>}
                            </div>
                        </div>
                    </div>}


                    <div className="bracket-text bracket-main-text">1/8 18:00</div>
                    <div className="bracket-text bracket-main-text">1/4 18:15</div>
                    <div className="bracket-text bracket-main-text">1/2 18:30</div>
                    <div className="bracket-text bracket-main-text">1/2 18:30</div>
                    <div className="bracket-text bracket-main-text">1/4 18:15</div>
                    <div className="bracket-text bracket-main-text">1/8 18:00</div>
                </div>}


            </div>
            }
        </div>}
        </div>)

}