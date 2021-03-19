import React from 'react'
import {ProfilePage} from './pages/ProfilePage'
import {MainPage} from './pages/MainPage'
import {AuthPage} from './pages/AuthPage'
import {Switch, Redirect, Route } from 'react-router-dom';
import {TournamentsPage} from "./pages/TournamentsPage";


export const useRoutes = (isAuthenticated)=> {

    if (isAuthenticated){
        return(
            <Switch>
                <Route path="/" exact>
                    <MainPage />
                </Route>
                <Route path="/tournaments" exact>
                    <TournamentsPage />
                </Route>
                <Route path="/profile" exact>
                    <ProfilePage />
                </Route>
                <Route path="/authentication" exact>
                    <AuthPage />
                </Route>
                <Redirect to="/" />
            </Switch>
        )
    }

    return (
        <Switch>
            <Route path="/" exact>
                <MainPage />
            </Route>
            <Route path="/tournaments" exact>
                <TournamentsPage />
            </Route>
            <Route path="/authentication" exact>
                <AuthPage />
            </Route>
            <Redirect to="/" />
        </Switch>
    )
}