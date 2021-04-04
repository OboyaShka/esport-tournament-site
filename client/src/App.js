import React, {useState} from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import {useRoutes} from "./routes";
import {useAuth} from "./hooks/auth.hook";
import {AuthContext} from "./context/AuthContext";
import {GameContext} from "./context/GameContext";
import {Navbar} from "./components/Navbar";
import {Loader} from "./components/Loader";
import {Header} from "./components/Header";
import {Footer} from "./components/Footer";
import {GameNavbar} from "./components/GameNavbar";


function App() {
    const {token, login, logout, userId, userRoles, userNickname, userAvatar, ready} = useAuth()
    const isAuthenticated = !!token
    const routes = useRoutes(isAuthenticated)
    const [game, setGame] = useState("lol")
    const [option, setOption] = useState("tournaments")
    const [tournamentNav, setTournamentNav] = useState()

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
            <GameContext.Provider value={{
                game, setGame, option, setOption, tournamentNav, setTournamentNav
            }}>
            <Router>
                <div className="container">
                    <Header></Header>
                    <div className="main-container">
                        <div className="nav-bar">
                            <GameNavbar></GameNavbar>
                            <Navbar></Navbar>
                        </div>
                        <div className="content-container">
                            {routes}
                        </div>
                    </div>
                    <Footer></Footer>
                </div>
            </Router>
            </GameContext.Provider>
        </AuthContext.Provider>
    )
}

export default App
