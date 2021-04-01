import {useState, useCallback, useEffect} from 'react'

const storageName = 'userData'

export const useAuth = () => {
    const [token, setToken] = useState (null)
    const [userId, setUserId] = useState (null)
    const [userRoles, setUserRoles] = useState (null)
    const [userNickname, setNickname] = useState (null)
    const [userAvatar, setUserAvatar] = useState (null)
    const [ready, setReady] = useState (false)

    const login = useCallback( (jwtToken, id, roles, nickname, avatar) => {
        setToken(jwtToken)
        setUserId(id)
        setUserRoles(roles)
        setNickname(nickname)
        setUserAvatar(avatar)
        localStorage.setItem(storageName, JSON.stringify({
             token: jwtToken, userId: id, userRoles: roles, userNickname: nickname, userAvatar: avatar
        }))
    }, [])

    const logout = useCallback( () => {
        setToken(null )
        setUserId(null)
        setUserRoles(null)
        setNickname(null)
        setUserAvatar(null)
        localStorage.removeItem(storageName)
    }, [])

    useEffect( () => {
        const data = JSON.parse(localStorage.getItem(storageName))
        if (data && data.token){
            login(data.token, data.userId, data.userRoles, data.userNickname, data.userAvatar)
        }
        setReady(true)
    }, [login])

    return {login, logout, token, userId, userRoles, userNickname,userAvatar, ready}
}