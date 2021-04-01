import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import {useRoutes} from "./routes";
import {useAuth} from "./hooks/auth.hook";
import {AuthContext} from "./context/AuthContext";
import {Navbar} from "./components/Navbar";
import {Loader} from "./components/Loader";
import {Header} from "./components/Header";
import {GameNavbar} from "./components/GameNavbar";


function App() {
    const {token, login, logout, userId, userRoles, userNickname,userAvatar, ready} = useAuth()
    const isAuthenticated = !!token
    const routes = useRoutes(isAuthenticated)

    if (!ready) {
        return <Loader/>;
    }

    return (
        <AuthContext.Provider value={{
            token,
            login,
            logout,
            userId,
            userRoles,
            userNickname,
            userAvatar,
            isAuthenticated
        }}>
            <Router>
                <div className="container">
                <Header></Header>
                    <div className="main-container">
                        <div className="nav-bar">
                            <GameNavbar ></GameNavbar>
                            <Navbar></Navbar>
                        </div>
                        <div className="content-container">
                            {routes}
                        </div>
                    </div>
                </div>
            </Router>
        </AuthContext.Provider>
    )
}

export default App
