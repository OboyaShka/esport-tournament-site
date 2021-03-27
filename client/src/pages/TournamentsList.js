import React from 'react'
import {Link} from 'react-router-dom';
import moment from "moment";

export const TournamentsList = ({tournaments}) => {
    if (!tournaments.length){
        return <p>Турниров на данный момент нет</p>
    }

    return (
        <div>
            {tournaments.map((item, index)=> {
                return (
                    <div key={index}className="row">
                        <div className="col s12 m7">
                            <div className="card">
                                <div className="card-image">
                                    <img src={item.image}/>
                                        <span className="card-title">{item.title}</span>

                                </div>
                                <div className="card-content">
                                    <p>Игра: {item.game}</p>
                                    <p>Тип: {item.typeTour}</p>
                                    <p>Описание: {item.description}</p>
                                    <p>Участников: {item.participants.length}</p>
                                    <p>Дата проведения: {moment(item.date).format("DD/MM/YY HH:mm")}</p>
                                </div>
                                <div className="card-action">
                                    <Link to={`tournaments/${item._id}`}>Подробнее</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
