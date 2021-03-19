import React from 'react'
import {Link, useHistory} from "react-router-dom";
import {AuthContext} from "../context/AuthContext";


export const TournamentsPage = () => {
    const history = useHistory()


    return (
        <div>
            <Link to='/profile'>Создать турнир</Link>
        </div>
    )
}