import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/AuthContext";
import {Loader} from "../../components/Loader";
import FileUpload from "../../components/FileUpload";
import {useMessage} from "../../hooks/message.hook";
import {useHistory} from "react-router-dom";
import Red from "../../img/header_img/redcoin.svg";
import Blue from "../../img/header_img/bluecoin.svg";
import Edit from "../../img/nav_img/edit.svg";
import LineIcon from "../../img/profile_img/line_statistics_icon.svg";
import TournamentIcon from "../../img/profile_img/tournament_icon.svg";
import CupIcon from "../../img/profile_img/cup_icon.svg";
import PedestalIcon from "../../img/profile_img/pedestal_icon.svg";
import TrendIcon from "../../img/profile_img/trend_icon.svg";
import MoreIcon from "../../img/profile_img/more_icon.svg";


export const LoLProfilePage = () => {
    const history = useHistory()
    const [user, setUser] = useState([])
    const {loading, request} = useHttp()
    const auth = useContext(AuthContext)
    const message = useMessage()
    const [sumName, setSumName] = useState(null)
    const [form, setForm] = useState({
        image: null, summonersName: null
    })

    const changeHandler = event => {
        setForm({...form, summonersName: event.target.value})
    }


    const fetchUser = useCallback(async () => {
        try {
            const fetched = await request('/api/user/info', 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            form.image = fetched.image
            form.summonersName = fetched.summonersName
            setUser(fetched)
        } catch (e) {

        }
    }, [request])

    useEffect(() => {
        fetchUser()
    }, [fetchUser])

    const editHandler = useCallback(async () => {
        try {
            const data = await request('/api/user/edit', 'PUT', {...form}, {
                Authorization: `Bearer ${auth.token}`
            })
            message(data.message)

            fetchUser()
        } catch (e) {
        }
    }, [auth.token, request, {...form}])


    if (loading) {
        return <Loader/>
    }

    return (
        <div className="my-profile-container">
            <h2 className="my-profile-title">Мой аккаунт</h2>
            <div className="my-profile-card">
                <div className="info-card">

                    <img style={{maxWidth: "80%", borderRadius: "50%"}} src={user.image}/>
                    <div className="info-card-profile">

                        <div>
                            <h3 className="nickname-card">{user.nickname}</h3>
                            <p className="summonersname-card">{user.summonersName}</p>
                        </div>
                    </div>
                    <div className="currency">
                        <div className="redcoin">0 R<img src={Red}/></div>
                        <div className="redcoin">0 B<img src={Blue}/></div>
                    </div>
                    <div className="info-card-main">
                        <div>Почта: {user.email}</div>
                        <div>Почта: {user.email}</div>
                        <div>Почта: {user.email}</div>
                    </div>
                    <div className="card-edit"><img src={Edit}/></div>
                </div>


            </div>
            <div className="my-profile-statistics">
                    <div className="statistics-card-area">
                        <div className="statistics-card">
                            <div className="card-container">
                                <img className="line-statistics" src={TournamentIcon}/>
                                <img src={LineIcon}/>
                                <var>12</var>
                            </div>
                        </div>
                        <p>Турниров сыграно</p>
                    </div>
                    <div className="statistics-card-area">
                        <div className="statistics-card">
                            <div className="card-container">
                                <img className="line-statistics" src={CupIcon}/>
                                <img src={LineIcon}/>
                                <var>12</var>
                            </div>
                        </div>
                        <p>Побед в турнирах</p>
                    </div>

                    <div className="open-statistics">
                        <div className="statistics-card-more">
                            <img src={MoreIcon}/>
                        </div>
                    </div>

                    <div className="statistics-card-area">
                        <div className="statistics-card">
                            <div className="card-container">
                                <img className="line-statistics" src={PedestalIcon}/>
                                <img src={LineIcon}/>
                                <var>12</var>
                            </div>
                        </div>
                        <p>Призовых мест</p>
                    </div>
                    <div className="statistics-card-area">
                        <div className="statistics-card">
                            <div className="card-container">
                                <img className="line-statistics" src={TrendIcon}/>
                                <img src={LineIcon}/>
                                <var>12</var>
                            </div>
                        </div>
                        <p>Рейтинг на сайте</p>
                    </div>
            </div>
            <div className="my-profile-games">3</div>
        </div>
    )
}