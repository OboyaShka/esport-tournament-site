import React, {useCallback, useContext, useEffect, useState} from 'react'
import {Link, useHistory} from "react-router-dom";
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";
import {Loader} from "./Loader";
import {useMessage} from "../hooks/message.hook";
import {ParticipantsTable} from "./ParticipantsTable";
import moment from 'moment'

export const NewsCard = ({newsId}) => {
    const {loading, request} = useHttp()
    const message = useMessage()
    const auth = useContext(AuthContext)
    const [news, setNews] = useState( null)
    const history = useHistory()
    const roles = auth.userRoles
    const [user, setUser] = useState( null)



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



    const editHandler = useCallback( async () => {
        try {
            history.push(`/new/create?id=${newsId}`)
        } catch (e) {}
    }, [auth.token, request])

    const deleteHandler = useCallback( async () => {
        try {
            const data = await request('/api/news/delete', 'DELETE', {newsId}, {
                Authorization: `Bearer ${auth.token}`
            })
            message(data.message)
            history.push('/news')
        } catch (e) {}
    }, [auth.token, request])

    //Подтягиваем информацию о новости
    const getNews = useCallback( async() => {
        try{
            const fetched = await request(`/api/news/${newsId}`, 'GET', null)
            setNews(fetched)
        }catch (e) {

        }
    }, [newsId, request])

    useEffect(() => {
        getNews()
    },[getNews])



    if(news){
        return (
            <div className="auth-content">
                {roles && roles.includes('ADMIN') &&<button className="waves-effect waves-light btn-large" onClick={deleteHandler}>Удалить Новость</button>}
                {roles && roles.includes('ADMIN') &&<button className="waves-effect waves-light btn-large" onClick={editHandler}>Редактировать Новость</button>}
                <div className="news-bubble">
                <h3  className="auth-title">{news.title}</h3>
                <p  className="news-topic">{news.topic}</p>
                <img style={{width: "100%"}} src={news.image}/>
                <p className="text-news">{news.content}</p>
                <p className="text-news news-date-text">{moment(news.date).format("DD/MM/YY HH:mm")}</p>
            </div>
            </div>
        )

    }
    return <></>
}