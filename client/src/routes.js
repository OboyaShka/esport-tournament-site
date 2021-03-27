import React from 'react'
import {ProfilePage} from './pages/ProfilePage'
import {MainPage} from './pages/MainPage'
import {AuthPage} from './pages/AuthPage'
import {Switch, Redirect, Route } from 'react-router-dom';
import {TournamentsPage} from "./pages/TournamentsPage";
import {TournamentsCreatePage} from "./pages/TournamentCreatePage";
import {TournamentDetailPage} from "./pages/TournamentDetailPage";
import {RegisterPage} from "./pages/RegisterPage";
import {ProfileDetailPage} from "./pages/ProfileDetailPage";

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
                <Route path="/tournaments/:id" exact>
                    <TournamentDetailPage />
                </Route>
                <Route path="/tournament/create">
                    <TournamentsCreatePage />
                </Route>
                <Route path="/profile" exact>
                    <ProfilePage />
                </Route>
                <Route path="/profile/:id" exact>
                    <ProfileDetailPage />
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
            <Route path="/tournaments/:id" exact>
                <TournamentDetailPage />
            </Route>
            <Route path="/authentication" exact>
                <AuthPage />
            </Route>
            <Route path="/registration" exact>
                <RegisterPage />
            </Route>
            <Redirect to="/" />
        </Switch>
    )
}