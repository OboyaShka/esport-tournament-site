import React from 'react'
import {Link} from 'react-router-dom';

export const TournamentsList = ({tournaments}) => {
    if (!tournaments.length){
        return <p>Турниров на данный момент нет</p>
    }

    return (
        <div>
            {tournaments.map((item, index)=> {
                return (
                    <div key={index} className="row">
                        <div className="col s12 m6">
                            <div className="card blue-grey darken-1">
                                <div className="card-content white-text">
                                    <span className="card-title">{item.title}</span>
                                    <p>Игра: {item.game}</p>
                                    <p>Описание: {item.description}</p>
                                    <p>Участников: {item.participants.length}</p>
                                    <p>Дата проведения: {item.date}</p>
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
