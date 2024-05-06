import "./navbar.scss";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/Authcontext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { useNotification } from "../../context/Notificationcontext";


const Navbar = () => {
  const { dispatchx } = useContext(DarkModeContext);
  const { dispatch } = useContext(AuthContext);
  const { countFalseResponses } = useNotification();
  const navigate = useNavigate();
  const handleclick = (e) => {
    e.preventDefault();
    dispatch({ type: "LOGOUT" });
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div>
      <nav id="navbar">
        <ul className="menu">
          <li id="logo" title="Made by Johnny Stiwerson">
            <p>Custom Logo</p>
          </li>
          <li
            id="trigram"
            tabIndex="-1"
            title="CLICK ME!&#10I WORK WITHOUT JS :)"
          >
            <div>&#9776;</div>
          </li>
          <span id="responsive-menu">
            <ul className="menu">
              <Link to="/hotels" style={{ textDecoration: "none" }}>
                <li className="menu-option">
                  <p>siege</p>
                </li>
              </Link>
              <Link to="/rooms" style={{ textDecoration: "none" }}>
                <li className="menu-option">
                  <p>
                    voitures <strong>v</strong>
                  </p>
                  <ul id="products">
                    <li>Softwares</li>
                    <li>Hardwares</li>
                    <li>Others</li>
                  </ul>
                </li>
              </Link>
              <Link to="/confirmations" style={{ textDecoration: "none" }}>
                <li className="menu-option">
                  <p>
                    Confirmation{" "}
                    {countFalseResponses > 0 && (
                      <span style={{backgroundColor:"red", padding:"5px" , color:"white", borderRadius:"5px"}} >{countFalseResponses}</span>
                    )}
                  </p>
                </li>
              </Link>
              <li id="sign-in">
                <p>
                  <DarkModeOutlinedIcon
                    className="icon"
                    onClick={() => dispatchx({ type: "TOGGLE" })}
                  />
                </p>
                
              </li>
              <li id="sign-in">
                <p>
                  <DarkModeOutlinedIcon
                    className="icon"
                    onClick={() => dispatchx({ type: "TOGGLE" })}
                  />
                </p>
                
              </li>
              <li id="sign-up" onClick={handleclick}>
                <p>Sign out</p>
              </li>
            </ul>
          </span>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
