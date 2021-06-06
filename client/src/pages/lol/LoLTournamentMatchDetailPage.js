import React, {useCallback, useContext, useEffect, useState} from "react"
import {TournamentNav} from "../../components/TournamentNav";
import {AuthContext} from "../../context/AuthContext";
import socket from "../../socket";
import {Link, useHistory, useParams} from "react-router-dom";
import {useHttp} from "../../hooks/http.hook";
import FileUpload from "../../components/FileUpload";
import {ChatMatch} from "../../components/ChatMatch"
import {Modal} from "../../components/Modal"
import Arror from "../../img/left_arrow_button.svg"
import moment from "moment";

export const LoLTournamentMatchDetailPage = () => {
    const auth = useContext(AuthContext)
    const history = useHistory()
    const tournamentId = useParams().id
    const matchId = useParams().idm
    //Подтягиваем информацию о турнире
    const [tournament, setTournament] = useState(null)
    const {loading, request} = useHttp()
    const [match, setMatch] = useState([])
    const [form, setForm] = useState({image: ''})
    const [modalActive, setModalActive] = useState(false)
    const thisToken = new Date



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


    const sendScreen = useCallback(async () => {
        try {
            socket.emit('TOURNAMENT/MATCH-SCREEN', matchId, form.image)

            return () => socket.off('TOURNAMENT/MATCH-SCREEN')
        } catch (e) {
        }
    }, [form.image != ''])

    const getMatches = useCallback(async () => {
        try {

            socket.emit('TOURNAMENT/MATCH', matchId, tournamentId)

            return () => socket.off('TOURNAMENT/MATCH')
        } catch (e) {
        }
    }, [])


    useEffect(() => {
        socket.on('TOURNAMENT/MATCH:RES', async (matchIdKey, match) => {
            if(matchIdKey===matchId){
                setMatch(match)
            }


        })

        return () => socket.off('TOURNAMENT/MATCH:RES')
    }, [])


    useEffect(() => {
        getMatches()
    }, [getMatches])

    useEffect(() => {
        socket.on('TOURNAMENT/MATCH-SCREEN:RES', (state) => {

            getTournament()
            getMatches()

        })

        return () => socket.off('TOURNAMENT/MATCH-SCREEN:RES')
    }, [])

    useEffect(() => {
        socket.on('TOURNAMENTS/NEWSTATE', (state) => {

            getTournament()
            getMatches()

        })

        return () => socket.off('TOURNAMENTS/NEWSTATE')
    }, [])

    const setWinner = useCallback(async (n) => {
        try {
            socket.emit('TOURNAMENT/MATCH-WINNER', matchId, n)


            return () => socket.off('TOURNAMENT/MATCH-WINNER')
        } catch (e) {
            console.log(e)
        }
    }, [])

    useEffect(() => {
        socket.on('TOURNAMENT/MATCH-WINNER:RES', () => {
            getTournament()
            getMatches()


        })

        return () => socket.off('TOURNAMENT/MATCH-WINNER:RES')
    }, [])

    const delWinner = useCallback(async () => {
        try {
            socket.emit('TOURNAMENT/MATCH-RESET', matchId)

            return () => socket.off('TOURNAMENT/MATCH-RESET')
        } catch (e) {
        }
    }, [])

    const backButton = () => {
        history.go(-1)
    }

    return (
        <div>
            {console.log(match)}
            {!tournament && <h2 className="my-profile-title">Турнир</h2>}
            {tournament &&
            <div className="match-header">
                <a className="back-button" onClick={e => {
                    backButton()
                }}>
                    <img src={Arror}/>
                </a>
                <h2 className="my-profile-title">{tournament.title}</h2>
            </div>}
            {!!match && !!tournament && match.stateTour && tournament.stateTour && match.stateTour != null && tournament.stateTour != null &&

            <div className="detail-match">
                {auth.userRoles && auth.userRoles.includes("ADMIN", "MODERATOR") &&
                <div className="morderator-buttons">
                    <div className="moderator-button">
                        <button className="chat-button" onClick={e => {
                            setWinner(0)
                        }}>Левый победил
                        </button>
                    </div>
                    <div className="moderator-button">
                        <button className="chat-button" onClick={e => {
                            delWinner()
                        }}>Ресет
                        </button>
                    </div>
                    <div className="moderator-button">
                        <button className="chat-button" onClick={e => {
                            setWinner(1)
                        }}>Правый победил
                        </button>
                    </div>
                </div>}
                <div className="players-match">
                    <Link to={match && match.participants[0] != null ? `/lol/profile/${match.participants[0]._id}` : ""}
                          className={match.participants[0] != null ? "left-gamer-indicator" : "left-gamer-indicator disalbed-a"}
                          style={{background: match.winner ? (match.participants[0] != null ? (match.participants[0]._id && match.winner === match.participants[0]._id ? "#a5c6b1" : "#fe7968") : "#fe7968") : ""}}>
                        <div className="players-match-l">
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
                                            <p className="summonersname-card">{match.participants[0].summonersName}</p>
                                        </div>
                                    </div> :
                                    (!match.winner ?
                                            <div className="info-card-profile">
                                                <div className="noenemy noenemy-block">
                                                    <h3 className="nickname-card">Ожидание игрока</h3>
                                                    <p className="summonersname-card"></p>
                                                </div>
                                            </div> :
                                            <div className="info-card-profile">
                                                <div className="noenemy noenemy-block">
                                                    <h3 className="nickname-card">Нет оппонента</h3>
                                                    <p className="summonersname-card"></p>
                                                </div>
                                            </div>
                                    )
                                }
                            </div>
                        </div>
                    </Link>
                    {tournament.stateTour && tournament.stateTour != null &&
                    <div className="left-gamer-indicator"
                         style={tournament.stateTour != null && tournament.stateTour === match.stateTour ? {background: "#9BC3FF"} :
                             (match.winner ? {background: "#c1c8c7"} : {background: "#f2b9cc"})}>
                        <div className="time-match">
                            <p>{match.stateTour === "1/1" ? "Финал" : match.stateTour} {moment(tournament.date).add(45, 'minutes').format("HH:mm")}</p>
                        </div>
                    </div>}

                    <Link to={match && match.participants[1] != null ? `/lol/profile/${match.participants[1]._id}` : ""}
                          className="left-gamer-indicator"
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
                                                <div className="noenemy noenemy-block">
                                                    <h3 className="nickname-card">Ожидание игрока</h3>
                                                    <p className="summonersname-card"></p>
                                                </div>
                                            </div> :
                                            <div className="info-card-profile">
                                                <div className="noenemy noenemy-block">
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
                    </Link>
                </div>
                {auth.userRoles ? (match.participants[0] != null && match.participants[1] != null &&
                    (match.participants[0]._id === auth.userId ||
                        match.participants[1]._id === auth.userId) || auth.userRoles.includes("ADMIN") || auth.userRoles.includes("MODERATOR")) ?
                    <div className="bottom-match">
                        <div>
                            {/*Кнопки*/}
                            {match.screen &&
                            <div className="match-screen">
                                <img onClick={e => {
                                    setModalActive(true)
                                }} style={{width: "100%"}} src={match.screen} alt=""></img>
                                <Modal active={modalActive} setActive={setModalActive} link={match.screen}></Modal>
                            </div>

                            }


                            <FileUpload form={form} setForm={setForm}/>
                            <button className="chat-button load-button input__wrapper send-win-btn" onClick={e => {
                                sendScreen()
                            }}>Отправить победу
                            </button>
                        </div>

                        <ChatMatch matchId={matchId}></ChatMatch>

                        <div className="match-description">
                            <h6>Руководство</h6>
                            <p style={{lineHeight: "1.5"}}>
                                Игрок ниже по сетке создаёт игру, после чего приглашает оппонента.<br/> Настройки игры
                                для турнира ARAM. <br/>
                                Игра завершается после первого убийства. Победитель отправляет скриншот с победой, после
                                чего модератор подтверждает победу в паре.
                            </p>
                        </div>
                    </div>:
                    match.screen ?
                        <div className="match-screen-view">
                            <img onClick={e => {
                                setModalActive(true)
                            }} style={{width: "50%", borderRadius:"25px"}} src={match.screen} alt=""></img>
                            <Modal active={modalActive} setActive={setModalActive} link={match.screen}></Modal>
                        </div>:  <div className="match-screen-view">Скриншота нет</div>
                    :
                    match.screen ?
                    <div className="match-screen-view">
                        <img onClick={e => {
                            setModalActive(true)
                        }} style={{width: "50%", borderRadius:"25px"}} src={match.screen} alt=""></img>
                        <Modal active={modalActive} setActive={setModalActive} link={match.screen}></Modal>
                    </div>:  <div className="match-screen-view">Скриншота нет</div>

                }
            </div>
            }

        </div>
    )
}