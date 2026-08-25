import "../CSS/headerStyle.css";
import { NavLink } from "react-router-dom";

export default function MainHeader() {
  return (
    <>
      <nav className="topnav" role="navigation">
        <ul>
          <li>
            <NavLink to="/" end>
              <u>RPG Overview</u>
            </NavLink>
          </li>
          <li>
            <NavLink to="/CharacterSheet">CharacterSheet</NavLink>
          </li>
          <li>
            <NavLink to="/DMScreen">DM Screen</NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
}
