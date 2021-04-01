import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useHttp} from "../../hooks/http.hook";
import {AuthContext} from "../../context/AuthContext";
import {Loader} from "../../components/Loader";
import FileUpload from "../../components/FileUpload";
import {useMessage} from "../../hooks/message.hook";
import {useHistory} from "react-router-dom";

export const LoLProfileEditPage = () => {
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
        try{
            const fetched = await request('/api/user/info', 'GET', null, {
                Authorization: `Bearer ${auth.token}`} )
            form.image = fetched.image
            form.summonersName = fetched.summonersName
            setUser(fetched)
        }catch (e) {

        }
    },[request])

    useEffect(()=>{
        fetchUser()
    },[fetchUser])

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


    if(loading){
        return <Loader/>
    }

    return (
        <div>
            <h1>{user.nickname}</h1>
            <div><img style={{width: "10%"}} src={user.image}/></div>
            <div className="input-field">
                <input
                    id="summonersName"
                    name="summonersName"
                    type="text"
                    disabled={loading}
                    onChange={changeHandler}
                    defaultValue={user.summonersName}
                    //value={user.summonersName}
                />
                <label htmlFor="password">Введите имя призывателя</label>
            </div>

            <FileUpload form={form} setForm={setForm}/>
            <div>Почта: {user.email}</div>
            <button
                className="btn yellow darken-4"
                onClick={editHandler}
            >Сохранить
            </button>
        </div>

    )
}