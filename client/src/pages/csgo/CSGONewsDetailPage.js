import React from 'react'

import {useParams} from "react-router-dom";
import {NewsCard} from "../../components/NewsCard";

export const CSGONewsDetailPage = () => {


    const newsId = useParams().id
    return(
        <NewsCard newsId={newsId}/>
    )
}