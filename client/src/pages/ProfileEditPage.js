import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useHttp} from "./../hooks/http.hook";
import {AuthContext} from "./../context/AuthContext";
import {Loader} from "./../components/Loader";
import FileUpload from "./../components/FileUpload";
import {useMessage} from "./../hooks/message.hook";
import {useHistory} from "react-router-dom";
import {GameContext} from "./../context/GameContext";
import Arror from "./../img/left_arrow_button.svg";

export const ProfileEditPage = () => {
    const history = useHistory()
    const [user, setUser] = useState([])
    const {loading, request} = useHttp()
    const auth = useContext(AuthContext)
    const message = useMessage()
    const [sumName, setSumName] = useState(null)
    const [form, setForm] = useState({
        image: null, summonersName: null
    })
    const {game, setGame} = useContext(GameContext)
    const gameContext = useContext(GameContext)

    const changeHandler = event => {
        setForm({...form, summonersName: event.target.value, steamID: event.target.value})
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
            const storageName = 'userData'

            const data = await request('/api/user/edit', 'PUT', {...form}, {
                Authorization: `Bearer ${auth.token}`
            })

            auth.avatarInfo(form.image)
            //
            // fetchUser()

            history.push(`/${game}/profile`)

        } catch (e) {
        }
    }, [auth.token, request, {...form}])


    if (loading) {
        return <Loader/>
    }
    const backButton = () => {
        history.go(-1)
    }


    return (
        <div className="auth-content">
            <div  className="profile-header my-profile-title">
                <a className="back-button" onClick={e => {
                    backButton()
                }}>
                    <img src={Arror}/>
                </a>
                <h2 style={{paddingLeft:"45px",marginLeft: "50px"}}>Редактирование</h2>
            </div>
            <div className="edit-bubble">
                <div className="profile-edit-header">

                    <h3 className="nickname-card">{user.nickname}</h3>
                    <div><img style={{width: "15%", borderRadius: "50%"}} src={user.image}/></div>
                </div>

                <div className="edit-upload-center">
                    <div className="edit-upload">
                        <FileUpload form={form} setForm={setForm}/>
                    </div>
                </div>
                <div className="tournaments-search auth-padding edit-padding">
                    <input style={{width: "360px"}}
                           id="summonersName"
                           name="summonersName"
                           type="text"
                           disabled={loading}
                           onChange={changeHandler}
                           defaultValue={user.summonersName}
                        //value={user.summonersName}
                    />
                    <label>Имя призывателя</label>
                </div>
                <div className="tournaments-search auth-padding edit-padding">
                    <input style={{width: "360px"}}
                           id="steamID"
                           name="steamID"
                           type="text"
                           disabled={loading}
                           onChange={changeHandler}
                           defaultValue={user.steamID}
                        //value={user.summonersName}
                    />
                    <label>Steam ID</label>
                </div>
                <div className="center">
                    <button
                        className="button-register-confirm"
                        onClick={editHandler}
                    >Сохранить
                    </button>
                </div>
            </div>
        </div>
    )
}