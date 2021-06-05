import {useState, useCallback, useEffect} from 'react'

const storageName = 'userData'

export const useAuth = () => {
    const [token, setToken] = useState (null)
    const [userId, setUserId] = useState (null)
    const [userRoles, setUserRoles] = useState (null)
    const [userNickname, setNickname] = useState (null)
    const [userAvatar, setUserAvatar] = useState (null)
    const [ready, setReady] = useState (false)
    const [redCoin, setRedCoin] = useState (null)
    const [blueCoin, setBlueCoin] = useState (null)

    const login = useCallback( (jwtToken, id, roles, nickname, avatar, redCoin, blueCoin) => {
        setToken(jwtToken)
        setUserId(id)
        setUserRoles(roles)
        setNickname(nickname)
        setUserAvatar(avatar)
        setRedCoin(redCoin)
        setBlueCoin(blueCoin)
        localStorage.setItem(storageName, JSON.stringify({
             token: jwtToken, userId: id, userRoles: roles, userNickname: nickname, userAvatar: avatar, redCoin:redCoin, blueCoin:blueCoin
        }))
    }, [])

    const cashInfo = useCallback( (redCoin, blueCoin) => {
        setRedCoin(redCoin)
        setBlueCoin(blueCoin)
        localStorage.setItem(storageName, JSON.stringify({
            redCoin:redCoin, blueCoin:blueCoin
        }))
    }, [])


    const avatarInfo = useCallback( (avatar) => {
        setUserAvatar(avatar)
        localStorage.setItem(storageName, JSON.stringify({
            userAvatar: avatar
        }))
    }, [])

    const logout = useCallback( () => {
        setToken(null )
        setUserId(null)
        setUserRoles(null)
        setNickname(null)
        setUserAvatar(null)
        setRedCoin(null)
        setBlueCoin(null)
        localStorage.removeItem(storageName)
    }, [])

    useEffect( () => {
        const data = JSON.parse(localStorage.getItem(storageName))
        if (data && data.token){
            login(data.token, data.userId, data.userRoles, data.userNickname, data.userAvatar, data.redCoin, data.blueCoin)
        }
        setReady(true)
    }, [login])

    useEffect( () => {
        const data = JSON.parse(localStorage.getItem(storageName))
        if (data && data.token){
            cashInfo(data.redCoin, data.blueCoin)
        }
        setReady(true)
    }, [cashInfo])

    useEffect( () => {
        const data = JSON.parse(localStorage.getItem(storageName))
        if (data && data.token){
            avatarInfo(data.userAvatar)
        }
        setReady(true)
    }, [avatarInfo])

    return {login, logout, cashInfo, avatarInfo, token, userId, userRoles, userNickname,userAvatar, redCoin, blueCoin, ready,}
}