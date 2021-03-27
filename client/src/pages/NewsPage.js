import React, {useCallback, useContext, useEffect, useState} from 'react'
import {Link, useHistory} from "react-router-dom";
import {AuthContext} from "../context/AuthContext";
import {useHttp} from "../hooks/http.hook";
import {Loader} from "../components/Loader";
import {TournamentsList} from "../components/TournamentsList";
import {NewsList} from "../components/NewsList";


export const NewsPage = () => {
    const [news, setNews] = useState([])
    const {loading, request} = useHttp()
    const auth = useContext(AuthContext)
    const roles = auth.userRoles

    const fetchTournaments = useCallback(async () => {
        try{
            const fetched = await request('/api/news', 'GET', null )
            setNews(fetched)
        }catch (e) {

        }
    },[request])

    useEffect(()=>{
        fetchTournaments()
    },[fetchTournaments])

    if(loading){
        return <Loader/>
    }

    return (
        <div>
            <div>
                {roles && roles.includes('ADMIN') && <Link className="waves-effect waves-light btn-large" to='/new/create'>Создать Новость</Link>}
            </div>
            <div>
                {!loading && <NewsList news={news}/>}
            </div>
        </div>
    )
}