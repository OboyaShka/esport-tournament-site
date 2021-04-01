import React from 'react'

import {useParams} from "react-router-dom";
import {ProfileCard} from "../../components/ProfileCard";

export const LoLProfileDetailPage = () => {

    const profileId = useParams().id

    return(
        <ProfileCard profileId={profileId}/>
    )
}