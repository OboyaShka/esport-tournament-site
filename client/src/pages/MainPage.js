import Logo from "../img/prev_logo.svg";
import Dota2 from "../img/prev_dota2.svg";
import LoL from "../img/prev_lol.svg";
import CS from "../img/prev_cs.svg";
import {Link} from "react-router-dom";

export const MainPage = () => {


    return (
        <div className="window-main-content">
            <div className="start-main-content">
                <div className="prev-logo">
                    <img src={Logo} alt="logo"/>
                </div>
                <div className="prev-text">
                    <div>Ежедневные призовые турниры<br/> по твоей любимой игре</div>
                </div>
                <div className="prev-text-sub">
                    <div>Зарегистрируйся на турнир прямо сейчас</div>
                </div>
                <div className="prev-games">
                    <div className="prev-games-items">
                        <Link to="lol/tournaments" style={{ outline: "none"}}><img src={LoL} alt="logo"/></Link>
                        <Link to="dota2/tournaments" style={{ outline: "none"}}><img src={Dota2} alt="logo"/></Link>
                        <Link to="cs/tournaments" style={{ outline: "none"}}><img src={CS} alt="logo"/></Link>
                    </div>
                </div>
            </div>
        </div>
    )

}