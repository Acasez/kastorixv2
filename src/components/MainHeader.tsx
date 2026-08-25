import "../CSS/headerStyle.css";
import { NavLink } from "react-router-dom";

export default function MainHeader() {
  return (
    <>
      <nav className="topnav" role="navigation">
        <ul>
          <li>
            <NavLink to="/" end>
              <u>Edvin Skogsholm Sanne</u>
            </NavLink>
          </li>
          <li>
            <NavLink to="/EdvinsNestedTooltips">
              Edvin's Nested Tooltips
            </NavLink>
          </li>
          <li>
            <NavLink to="/Amsvartne">Amsvartne</NavLink>
          </li>
          <li>
            <a href="#">Mariestad Board Game ▼</a>
            <div className="dropdown_menu">
              <ul>
                <li>
                  <NavLink to="/MariestadClimateGame">
                    Mariestad Board Game
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/MariestadDigitalAdaptation">
                    Mariestad Digital Adaptation
                  </NavLink>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <a href="#">Ion Internship ▼</a>
            <div className="dropdown_menu">
              <ul>
                <li>
                  <NavLink to="/IonInternship">Ion Internship</NavLink>
                </li>
                <li>
                  <NavLink to="/HighFrontierTutorial">High Frontier</NavLink>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <NavLink to="/CityState">City State</NavLink>
          </li>
          <li>
            <NavLink to="/ToHelAndBack">To Hel and Back</NavLink>
          </li>
          <li>
            <NavLink to="/landOfTheArcane">Land of the Arcane</NavLink>
          </li>
          <li>
            <NavLink to="/Kastorix">Kastorix</NavLink>
          </li>
          <li>
            <NavLink to="/AboutMe">About Me</NavLink>
          </li>
          {/* <li>
            <a href="#">About Me ▼</a>
            <div className="dropdown_menu">
              <ul>
                <li>
                  <NavLink to="/AboutMe">About Me</NavLink>
                </li>
                <li>
                  <a href="#">🞀 CV's</a>
                  <div className="dropdown_menu">
                    <ul>
                      <li>
                        <NavLink to="/EnglishCV">English</NavLink>
                      </li>
                      <li>
                        <a href="swedishCV.html">Swedish</a>
                      </li>
                    </ul>
                  </div>
                </li>
                <li>
                  <a href="#">🞀 Fan Content</a>
                  <div className="dropdown_menu">
                    <ul>
                      <li>
                        <NavLink to="/AOW4Tomes">
                          Age of Wonders 4 Tomes
                        </NavLink>
                      </li>
                      <li>
                        <a href="myherosnap.html">My Hero Snap</a>
                      </li>
                      <li>
                        <a href="meridianSunsets.html">Meridian Sunsets</a>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </li> */}
        </ul>
      </nav>
    </>
  );
}
