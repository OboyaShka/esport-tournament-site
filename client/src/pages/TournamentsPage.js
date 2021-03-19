import React from 'react'
import {Link, useHistory} from "react-router-dom";
import {AuthContext} from "../context/AuthContext";


export const TournamentsPage = () => {
    const history = useHistory()


    return (
        <div>
            <Link to='/tournaments/create'>Создать турнир</Link>
        </div>
    )
}