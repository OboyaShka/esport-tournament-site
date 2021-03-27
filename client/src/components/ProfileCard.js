import React, {useCallback, useContext, useEffect, useState} from 'react'
import {Link, useHistory} from "react-router-dom";
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";
import {Loader} from "./Loader";
import {useMessage} from "../hooks/message.hook";
import {ParticipantsTable} from "./ParticipantsTable";

export const ProfileCard = ({profileId}) => {
    const {loading, request} = useHttp()
    const message = useMessage()
    const auth = useContext(AuthContext)
    const [user, setUser] = useState( null)
    const [profile, setProfile] = useState( null)
    const history = useHistory()
    const roles = auth.userRoles



    //Подтягиваем информацию о профиле
    const getProfile = useCallback( async() => {
        try{
            const fetched = await request(`/api/user/${profileId}`, 'GET', null)
            setProfile(fetched)
        }catch (e) {

        }
    }, [setProfile, request])

    useEffect(() => {
        getProfile()
    },[getProfile])



    if(loading){
        return <Loader/>
    }
    if(profile)
    {
        return(
        <div><h1>{profile.nickname}</h1></div>
        )
    }
    return <></>
}