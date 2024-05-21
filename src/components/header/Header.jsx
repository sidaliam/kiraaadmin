import {
  faCar,
  faHome,
  faHotel,
  faWarehouse,
  faPhone

} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./header.css";

import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file

import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/Authcontext";
import { Link } from "react-router-dom";
import { useNotification } from "../../context/Notificationcontext";

const Header = ({ type }) => {
  const { countFalseResponses } = useNotification();
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  const handleclick = (e) => {
    e.preventDefault();
    dispatch({ type: "LOGOUT" });
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="header">
      <div
        className={
          type === "list" ? "headerContainer listMode" : "headerContainer"
        }
      >
        {type !== "list" && (
          <>
            <h1 className="headerTitle">Kiraa</h1>
            <p className="headerDesc">
              <div class="profile">
                {/* Nom du profil */}
                {user ? user.username : <div className="navItems"></div>}
                <div class="icon-slider">
                  <div class="icon-wrapper">
                    <a href="/rooms">
                      <div class="icon-container">
                        <FontAwesomeIcon icon={faCar} className="icon" />
                      </div>
                      <span className="icon-title">voitures</span>
                    </a>
                  </div>

                  <div class="icon-wrapper">
                    <a href="/hotels">
                      <div class="icon-container">
                        <FontAwesomeIcon icon={faHome} className="icon" />
                      </div>
                      <span className="icon-title">sieges</span>
                    </a>
                  </div>

                  <div class="icon-wrapper">
                    <a href="/statistique">
                      <div class="icon-container">
                        <FontAwesomeIcon icon={faHotel} className="icon" />
                      </div>
                      <span className="icon-title">stats</span>
                    </a>
                  </div>

                  
                </div>
              </div>

              <div class="shop">
                {/* Icône du shop */}
                <a href="/confirmations">
                  <FontAwesomeIcon icon={faPhone} />
                  {countFalseResponses > 0 && (
                    <span
                      style={{
                        backgroundColor: "red",
                        padding: "5px",
                        color: "white",
                        borderRadius: "5px",
                      }}
                    >
                      {countFalseResponses}
                    </span>
                  )}
                </a>
              </div>
            </p>

            {user ? (
              <button onClick={handleclick} className="logoutBtn">
                Logout
              </button>
            ) : (
              <Link to="/login">
                <button className="signInBtn">Sign in / Register</button>
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
