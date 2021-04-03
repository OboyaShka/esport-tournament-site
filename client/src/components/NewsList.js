import React from 'react'
import {Link} from 'react-router-dom';
import moment from "moment";

export const NewsList = ({news}) => {
    if (!news.length){
        return <p>Новостей на данный момент нет</p>
    }

    return (
        <div>

        </div>
    )
}
