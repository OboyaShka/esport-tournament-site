import React, {useCallback, useContext, useEffect, useState} from 'react'
import {Link, useHistory} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import {useHttp} from "../../hooks/http.hook";
import {Loader} from "../../components/Loader";
import {TournamentsList} from "../../components/TournamentsList";
import {NewsList} from "../../components/NewsList";
import moment from "moment";
import SearchIcon from "../../img/search_icon.svg";
import Participants from "../../img/nav_img/profile_icon.svg";


export const LoLNewsPage = () => {
    const [news, setNews] = useState([])
    const {loading, request} = useHttp()
    const auth = useContext(AuthContext)
    const roles = auth.userRoles

    const fetchTournaments = useCallback(async () => {
        try {
            const fetched = await request('/api/news', 'GET', null)
            setNews(fetched)
        } catch (e) {

        }
    }, [request])

    useEffect(() => {
        fetchTournaments()
    }, [fetchTournaments])

    if (loading) {
        return <Loader/>
    }

    return (
        <div className="tournaments-container">
            <div className="tournaments-title">Турниры</div>
            <div className="tournaments-filter">
                <div className="tournaments-search">
                    <input name="s" placeholder="Название новости..." type="search"/>
                    <button type="submit">
                        <img src={SearchIcon}/></button>
                </div>
                <div>Фитльры типа</div>
                <div>Фильтры формы</div>
            </div>
            {/*<div>*/}
            {/*    {roles && roles.includes('ADMIN') && <Link className="waves-effect waves-light btn-large" to='/new/create'>Создать Новость</Link>}*/}
            {/*</div>*/}

            {!loading && <div className="tournaments-cards">
                {!news.length ?
                    (<p>Турниров на данный момент нет</p>) :
                    news.map((item, index) => {
                        return (
                            <Link className="news-card" key={index} to={`/lol/news/${item._id}`}>
                                <div className="image-card">
                                    <h4 className="news-card-title">{item.title}</h4>
                                    <p className="news-card-topic">{item.topic}</p>
                                    <img style={{width: "100%"}} src={item.image}/>
                                </div>

                                <div className="card-news">
                                    <div className="news-content">{item.content} </div>
                                    <div className="news-date">
                                        <b>{moment(item.date).format("DD.MM")}</b> {moment(item.date).format("HH:mm")}
                                    </div>
                                </div>


                            </Link>
                        )
                    })}
            </div>}

        </div>
    )
}