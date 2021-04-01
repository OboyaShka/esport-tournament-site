import {createContext} from 'react'

function noop() {}

export const AuthContext = createContext({
    token: null,
    userId: null,
    userRoles: null,
    userNickname: null,
    userAvatar: null,
    login: noop,
    logout: noop,
    isAuthenticated: false
})