import React, {useCallback, useEffect, useState} from "react";
import {useHttp} from "../hooks/http.hook";
import {useMessage} from "../hooks/message.hook";
import {Link} from "react-router-dom";

export const ParticipantsTable = (participants)=> {
    const {loading, request} = useHttp()
    const message = useMessage()
    const [participant, setParticipant] = useState([])

    const getParticipants = useCallback( async() => {
        try{
            const fetched = await request(`/api/participants`, 'POST', participants)
            setParticipant(fetched)
        }catch (e) {
        }
    }, [participants, request])

    useEffect(() => {
        getParticipants()
    },[getParticipants])


    if(participant){
        return (
            <div>
                <table>
                    <thead>
                    <tr>
                        <th>Аватар</th>
                        <th>Имя</th>
                        <th>Ссылка</th>
                    </tr>
                    </thead>

                    <tbody>
                    {participant.map((user, i)=>{
                        return(
                            <tr key={i}>
                                <td>{user.image}</td>
                                <td>{user.nickname}</td>
                                <td><Link to={`/profile/${user.id}`}>Ссылка на профиль</Link></td>
                            </tr>
                        )
                    })}

                    </tbody>
                </table>
            </div>
        )
    }

    return(
        <></>
    )

}