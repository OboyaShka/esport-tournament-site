import React from 'react'

import {useParams} from "react-router-dom";
import {ProfileCard} from "../components/ProfileCard";
import {NewsCard} from "../components/NewsCard";

export const NewsDetailPage = () => {


    const newsId = useParams().id
    return(
        <NewsCard newsId={newsId}/>
    )
}