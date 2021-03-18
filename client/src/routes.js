import React from 'react'
import {ProfilePage} from './pages/ProfilePage'
import {MainPage} from './pages/MainPage'
import {AuthPage} from './pages/AuthPage'
import {Switch, Redirect, BrowserRouter as Router } from 'react-router-dom';

export const useRoutes = isAuthenticated => {
    if (isAuthenticated){
        return(
            <Switch>
                <Router path="/main" exact>
                    <MainPage />
                </Router>
                <Router path="/profile" exact>
                    <ProfilePage />
                </Router>
                <Router path="/" exact>
                    <AuthPage />
                </Router>
                <Redirect to="/main" />
            </Switch>
        )
    }

    return (
        <Switch>
            <Router path="/main" exact>
                <MainPage />
            </Router>
            <Router path="/profile" exact>
                <ProfilePage />
            </Router>
            <Router path="/" exact>
                <AuthPage />
            </Router>
            <Redirect to="/main" />
        </Switch>
    )
}