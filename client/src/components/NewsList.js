import React from 'react'
import {Link} from 'react-router-dom';
import moment from "moment";

export const NewsList = ({news}) => {
    if (!news.length){
        return <p>Новостей на данный момент нет</p>
    }

    return (
        <div>
            {news.map((item, index)=> {
                return (
                    <div key={index}className="row">
                        <div className="col s12 m7">
                            <div className="card">
                                <div className="card-image">
                                    <img src={item.image}/>
                                    <span className="card-title">{item.title}</span>

                                </div>
                                <div className="card-content">
                                    <p>Топик: {item.topic}</p>
                                    <p>Описание: {item.content}</p>
                                    <p>Дата публикации: {moment(item.date).format("DD/MM/YY HH:mm")}</p>
                                </div>
                                <div className="card-action">
                                    <Link to={`news/${item._id}`}>Подробнее</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
