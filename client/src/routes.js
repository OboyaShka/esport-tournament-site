import React from 'react'
import {ProfilePage} from './pages/lol/LoLProfilePage'
import {MainPage} from './pages/lol/LoLNewsPage'
import {AuthPage} from './pages/AuthPage'
import {Switch, Redirect, Route } from 'react-router-dom';
import {TournamentsPage} from "./pages/TournamentsPage";
import {TournamentsCreatePage} from "./pages/TournamentCreatePage";
import {TournamentDetailPage} from "./pages/lol/LoLTournamentDetailPage";
import {RegisterPage} from "./pages/RegisterPage";
import {ProfileDetailPage} from "./pages/lol/LoLProfileDetailPage";
import {NewsCreatePage} from "./pages/NewsCreate";
import {NewsDetailPage} from "./pages/lol/LoLNewsDetailPage";

import {LoLPage} from "./pages/lol/LoLPage";
import {LoLTournamentsPage} from "./pages/lol/LoLTournamentsPage";
import {LoLNewsPage} from "./pages/lol/LoLNewsPage";
import {LoLNewsDetailPage} from "./pages/lol/LoLNewsDetailPage";
import {LoLTournamentDetailPage} from "./pages/lol/LoLTournamentDetailPage";
import {LoLProfilePage} from "./pages/lol/LoLProfilePage";
import {LoLProfileDetailPage} from "./pages/lol/LoLProfileDetailPage";

export const useRoutes = (isAuthenticated)=> {

    if (isAuthenticated){
        return(
            <Switch>
                <Route path="/lol" exact>
                    <LoLPage />
                </Route>
                <Route path="/lol/tournaments" exact>
                    <LoLTournamentsPage />
                </Route>
                <Route path="/lol/tournaments/:id" exact>
                    <LoLTournamentDetailPage />
                </Route>
                <Route path="/lol/news" exact>
                    <LoLNewsPage />
                </Route>
                <Route path="/lol/news/:id" exact>
                    <LoLNewsDetailPage />
                </Route>
                <Route path="/lol/profile" exact>
                    <LoLProfilePage />
                </Route>
                <Route path="/lol/profile/:id" exact>
                    <LoLProfileDetailPage />
                </Route>

                <Route path="/new/create" exact>
                    <NewsCreatePage />
                </Route>
                <Route path="/tournament/create">
                    <TournamentsCreatePage />
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
            <Route path="/tournaments" exact>
                <TournamentsPage />
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