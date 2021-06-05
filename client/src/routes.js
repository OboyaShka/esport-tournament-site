import React from 'react'

import {AuthPage} from './pages/AuthPage'
import {Switch, Redirect, Route } from 'react-router-dom';
import {TournamentsCreatePage} from "./pages/TournamentCreatePage";

import {RegisterPage} from "./pages/RegisterPage";

import {NewsCreatePage} from "./pages/NewsCreate";
import {NewsDetailPage} from "./pages/lol/LoLNewsDetailPage";

import {LoLPage} from "./pages/lol/LoLPage";
import {LoLTournamentsPage} from "./pages/lol/LoLTournamentsPage";
import {LoLNewsPage} from "./pages/lol/LoLNewsPage";
import {LoLNewsDetailPage} from "./pages/lol/LoLNewsDetailPage";
import {LoLTournamentDetailPage} from "./pages/lol/LoLTournamentDetailPage";
import {LoLProfilePage} from "./pages/lol/LoLProfilePage";
import {LoLProfileDetailPage} from "./pages/lol/LoLProfileDetailPage";
import {LoLTournamentRules} from "./pages/lol/LoLTournamentRules";
import {LoLTournamentParticipants} from "./pages/lol/LoLTournamentParticipants";
import {LoLTournamentBracket} from "./pages/lol/LoLTournamentBracket";
import {LoLTournamentMatches} from "./pages/lol/LoLTournamentMatches";
import {LoLTournamentMatchDetailPage} from "./pages/lol/LoLTournamentMatchDetailPage";

import {Dota2TournamentsPage} from "./pages/dota2/Dota2TournamentsPage";
import {Dota2Page} from "./pages/dota2/Dota2Page";
import {Dota2TournamentDetailPage} from "./pages/dota2/Dota2TournamentDetailPage";
import {Dota2TournamentRules} from "./pages/dota2/Dota2TournamentRules";
import {Dota2TournamentParticipants} from "./pages/dota2/Dota2TournamentParticipants";
import {Dota2TournamentBracket} from "./pages/dota2/Dota2TournamentBracket";
import {Dota2TournamentMatches} from "./pages/dota2/Dota2TournamentMatches";
import {Dota2TournamentMatchDetailPage} from "./pages/dota2/Dota2TournamentMatchDetailPage";
import {Dota2NewsPage} from "./pages/dota2/Dota2NewsPage";
import {Dota2NewsDetailPage} from "./pages/dota2/Dota2NewsDetailPage";
import {Dota2ProfilePage} from "./pages/dota2/Dota2ProfilePage";
import {Dota2ProfileDetailPage} from "./pages/dota2/Dota2ProfileDetailPage";
import {CSGOPage} from "./pages/csgo/CSGOPage";
import {CSGOTournamentsPage} from "./pages/csgo/CSGOTournamentsPage";
import {CSGOTournamentDetailPage} from "./pages/csgo/CSGOTournamentDetailPage";
import {CSGOTournamentRules} from "./pages/csgo/CSGOTournamentRules";
import {CSGOTournamentParticipants} from "./pages/csgo/CSGOTournamentParticipants";
import {CSGOTournamentBracket} from "./pages/csgo/CSGOTournamentBracket";
import {CSGOTournamentMatches} from "./pages/csgo/CSGOTournamentMatches";
import {CSGOTournamentMatchDetailPage} from "./pages/csgo/CSGOTournamentMatchDetailPage";
import {CSGONewsPage} from "./pages/csgo/CSGONewsPage";
import {CSGONewsDetailPage} from "./pages/csgo/CSGONewsDetailPage";
import {CSGOProfilePage} from "./pages/csgo/CSGOProfilePage";
import {CSGOProfileDetailPage} from "./pages/csgo/CSGOProfileDetailPage";
import {ProfileEditPage} from "./pages/ProfileEditPage";

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
                <Route path="/lol/tournaments/:id/rules" exact>
                    <LoLTournamentRules />
                </Route>
                <Route path="/lol/tournaments/:id/participants" exact>
                    <LoLTournamentParticipants/>
                </Route>
                <Route path="/lol/tournaments/:id/bracket" exact>
                    <LoLTournamentBracket/>
                </Route>
                <Route path="/lol/tournaments/:id/matches" exact>
                    <LoLTournamentMatches/>
                </Route>
                <Route path="/lol/tournaments/:id/matches/:idm" exact>
                    <LoLTournamentMatchDetailPage/>
                </Route>

                <Route path="/new/create" exact>
                    <NewsCreatePage />
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


                <Route path="/dota2" exact>
                    <Dota2Page />
                </Route>

                <Route path="/dota2/tournaments" exact>
                    <Dota2TournamentsPage />
                </Route>
                <Route path="/dota2/tournaments/:id" exact>
                    <Dota2TournamentDetailPage />
                </Route>
                <Route path="/dota2/tournaments/:id/rules" exact>
                    <Dota2TournamentRules />
                </Route>
                <Route path="/dota2/tournaments/:id/participants" exact>
                    <Dota2TournamentParticipants/>
                </Route>
                <Route path="/dota2/tournaments/:id/bracket" exact>
                    <Dota2TournamentBracket/>
                </Route>
                <Route path="/dota2/tournaments/:id/matches" exact>
                    <Dota2TournamentMatches/>
                </Route>
                <Route path="/dota2/tournaments/:id/matches/:idm" exact>
                    <Dota2TournamentMatchDetailPage/>
                </Route>

                <Route path="/dota2/news" exact>
                    <Dota2NewsPage />
                </Route>
                <Route path="/dota2/news/:id" exact>
                    <Dota2NewsDetailPage />
                </Route>

                <Route path="/dota2/profile" exact>
                    <Dota2ProfilePage />
                </Route>
                <Route path="/dota2/profile/:id" exact>
                    <Dota2ProfileDetailPage />
                </Route>



                <Route path="/csgo" exact>
                    <CSGOPage />
                </Route>

                <Route path="/csgo/tournaments" exact>
                    <CSGOTournamentsPage />
                </Route>
                <Route path="/csgo/tournaments/:id" exact>
                    <CSGOTournamentDetailPage />
                </Route>
                <Route path="/csgo/tournaments/:id/rules" exact>
                    <CSGOTournamentRules />
                </Route>
                <Route path="/csgo/tournaments/:id/participants" exact>
                    <CSGOTournamentParticipants/>
                </Route>
                <Route path="/csgo/tournaments/:id/bracket" exact>
                    <CSGOTournamentBracket/>
                </Route>
                <Route path="/csgo/tournaments/:id/matches" exact>
                    <CSGOTournamentMatches/>
                </Route>
                <Route path="/csgo/tournaments/:id/matches/:idm" exact>
                    <CSGOTournamentMatchDetailPage/>
                </Route>

                <Route path="/csgo/news" exact>
                    <CSGONewsPage />
                </Route>
                <Route path="/csgo/news/:id" exact>
                    <CSGONewsDetailPage />
                </Route>

                <Route path="/csgo/profile" exact>
                    <CSGOProfilePage />
                </Route>
                <Route path="/csgo/profile/:id" exact>
                    <CSGOProfileDetailPage />
                </Route>


                <Route path="/tournament/create">
                    <TournamentsCreatePage />
                </Route>

                <Route path="/profile-edit" exact>
                    <ProfileEditPage />
                </Route>

                <Route path="/authentication" exact>
                    <AuthPage />
                </Route>

                {/*<Redirect to="/" />*/}
            </Switch>
        )
    }

    return (
        <Switch>
            <Route path="/lol/tournaments" exact>
                <LoLTournamentsPage />
            </Route>
            <Route path="/lol/tournaments/:id" exact>
                <LoLTournamentDetailPage />
            </Route>
            <Route path="/lol/tournaments/:id/rules" exact>
                <LoLTournamentRules />
            </Route>
            <Route path="/lol/tournaments/:id/participants" exact>
                <LoLTournamentParticipants/>
            </Route>
            <Route path="/lol/tournaments/:id/bracket" exact>
                <LoLTournamentBracket/>
            </Route>
            <Route path="/lol/tournaments/:id/matches" exact>
                <LoLTournamentMatches/>
            </Route>
            <Route path="/lol/tournaments/:id/matches/:idm" exact>
                <LoLTournamentMatchDetailPage/>
            </Route>
            <Route path="/lol/profile/:id" exact>
                <LoLProfileDetailPage />
            </Route>

            <Route path="/lol/news" exact>
                <LoLNewsPage />
            </Route>
            <Route path="/lol/news/:id" exact>
                <LoLNewsDetailPage />
            </Route>

            <Route path="/dota2/tournaments" exact>
                <Dota2TournamentsPage />
            </Route>
            <Route path="/dota2/tournaments/:id" exact>
                <Dota2TournamentDetailPage />
            </Route>
            <Route path="/dota2/tournaments/:id/rules" exact>
                <Dota2TournamentRules />
            </Route>
            <Route path="/dota2/tournaments/:id/participants" exact>
                <Dota2TournamentParticipants/>
            </Route>
            <Route path="/dota2/tournaments/:id/bracket" exact>
                <Dota2TournamentBracket/>
            </Route>
            <Route path="/dota2/tournaments/:id/matches" exact>
                <Dota2TournamentMatches/>
            </Route>
            <Route path="/dota2/tournaments/:id/matches/:idm" exact>
                <Dota2TournamentMatchDetailPage/>
            </Route>

            <Route path="/dota2/news" exact>
                <Dota2NewsPage />
            </Route>
            <Route path="/dota2/news/:id" exact>
                <Dota2NewsDetailPage />
            </Route>

            <Route path="/dota2/profile/:id" exact>
                <Dota2ProfileDetailPage />
            </Route>


            <Route path="/csgo/tournaments" exact>
                <CSGOTournamentsPage />
            </Route>
            <Route path="/csgo/tournaments/:id" exact>
                <CSGOTournamentDetailPage />
            </Route>
            <Route path="/csgo/tournaments/:id/rules" exact>
                <CSGOTournamentRules />
            </Route>
            <Route path="/csgo/tournaments/:id/participants" exact>
                <CSGOTournamentParticipants/>
            </Route>
            <Route path="/csgo/tournaments/:id/bracket" exact>
                <CSGOTournamentBracket/>
            </Route>
            <Route path="/csgo/tournaments/:id/matches" exact>
                <CSGOTournamentMatches/>
            </Route>
            <Route path="/csgo/tournaments/:id/matches/:idm" exact>
                <CSGOTournamentMatchDetailPage/>
            </Route>

            <Route path="/csgo/profile/:id" exact>
                <CSGOProfileDetailPage />
            </Route>

            <Route path="/csgo/news" exact>
                <CSGONewsPage />
            </Route>
            <Route path="/csgo/news/:id" exact>
                <CSGONewsDetailPage />
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