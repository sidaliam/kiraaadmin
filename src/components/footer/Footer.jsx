import {
faCar,faHome,faHotel,faUser,faWarehouse
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./footer.css";
import logo from "../../image/logo kiraa orange.png"
import { faFacebook, faInstagram, faYoutube, faTwitter } from '@fortawesome/free-brands-svg-icons';


const Footer = () => {
  return (
    <>
      <div classNameName="bodyc">
<div classNameName="footerv">
<div className="footerf">
<div className="rowx">
<a id="ico" href="#"><FontAwesomeIcon icon={faFacebook} /></a>
<a id="ico" href="#"><FontAwesomeIcon icon={faInstagram} /></a>
<a id="ico" href="#"><FontAwesomeIcon icon={faYoutube} /></a>
<a id="ico" href="#"><FontAwesomeIcon icon={faTwitter} /></a>
</div>

<div className="rowx">
<ul>
<li><a href="/">nos voitures</a></li>
<li><a href="/agences">agences</a></li>
<li><a href="/contact">contact</a></li>
<li><a href="/about">qui sommes nous</a></li>
<li><a href="#" style={{ display: "none" }}>Career</a></li>
</ul>
</div>

<div className="rowx" style={{  color : "whitesmoke" }}>
INFERNO Copyright © 2021 Inferno - All rights reserved || Designed By: Mahesh 
</div>
</div>
</div>
</div>
    </>
  );
};

export default Footer;
