import React from 'react'
import {ProfilePage} from './pages/ProfilePage'
import {MainPage, NewsPage} from './pages/NewsPage'
import {AuthPage} from './pages/AuthPage'
import {Switch, Redirect, Route } from 'react-router-dom';
import {TournamentsPage} from "./pages/TournamentsPage";
import {TournamentsCreatePage} from "./pages/TournamentCreatePage";
import {TournamentDetailPage} from "./pages/TournamentDetailPage";
import {RegisterPage} from "./pages/RegisterPage";
import {ProfileDetailPage} from "./pages/ProfileDetailPage";
import {NewsCreatePage} from "./pages/NewsCreate";
import {NewsDetailPage} from "./pages/NewsDetailPage";

export const useRoutes = (isAuthenticated)=> {

    if (isAuthenticated){
        return(
            <Switch>
                <Route path="/news" exact>
                    <NewsPage />
                </Route>
                <Route path="/news/:id" exact>
                    <NewsDetailPage />
                </Route>
                <Route path="/new/create" exact>
                    <NewsCreatePage />
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
            <Route path="/news" exact>
                <NewsPage />
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