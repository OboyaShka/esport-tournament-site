import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";
import {Loader} from "../components/Loader";
import FileUpload from "../components/FileUpload";
import {useMessage} from "../hooks/message.hook";

export const ProfilePage = () => {

    const [user, setUser] = useState([])
    const {loading, request} = useHttp()
    const auth = useContext(AuthContext)
    const message = useMessage()
    const [sumName, setSumName] = useState(null)
    const [form, setForm] = useState({
        image: null, summonersName: null
    })

    const changeHandler = (event) => {
        setForm({...form, [event.target.name]: event.target.value})
    }

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



    const fetchUser = useCallback(async () => {
        try{
            const fetched = await request('/api/user/info', 'GET', null, {
                Authorization: `Bearer ${auth.token}`} )

            setUser(fetched.user)
        }catch (e) {

        }
    },[request])

    useEffect(()=>{
        fetchUser()
    },[fetchUser])




    if(loading){
        return <Loader/>
    }

    return (
        <div>
            <h1>{user.nickname}</h1>
            <div><img style={{width: "10%"}} src={user.image}/></div>
            <input
                id="summonersName"
                name="summonersName"
                type="summonersName"
                className="login-input"
                defaultValue={user.summonersName}
                onChange={changeHandler}
            />
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