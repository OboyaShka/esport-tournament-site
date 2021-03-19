import {useState, useCallback, useEffect} from 'react'

const storageName = 'userData'

export const useAuth = () => {
    const [token, setToken] = useState (null)
    const [userId, setUserId] = useState (null)
    const [userRoles, setUserRoles] = useState (null)
    const [ready, setReady] = useState (false)

    const login = useCallback( (jwtToken, id, roles) => {
        setToken(jwtToken)
        setUserId(id)
        setUserRoles(roles)

        localStorage.setItem(storageName, JSON.stringify({
             token: jwtToken, userId: id, userRoles: roles
        }))
    }, [])

    const logout = useCallback( () => {
        setToken(null )
        setUserId(null)
        setUserRoles(null)
        localStorage.removeItem(storageName)
    }, [])

    useEffect( () => {
        const data = JSON.parse(localStorage.getItem(storageName))

        if (data && data.token){
            login(data.token, data.userId, data.userRoles)
        }
        setReady(true)
    }, [login])

    return {login, logout, token, userId, userRoles, ready}
}