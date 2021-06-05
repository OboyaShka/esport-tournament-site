import {createContext} from 'react'

function noop() {}

export const AuthContext = createContext({
    token: null,
    userId: null,
    userRoles: null,
    userNickname: null,
    userAvatar: null,
    redCoin: null,
    blueCoin: null,
    login: noop,
    logout: noop,
    cashInfo: noop,
    avatarInfo: noop,
    isAuthenticated: false,
})