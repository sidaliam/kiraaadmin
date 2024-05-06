import React from "react";
import "./Start.css";
import image1 from "../../images/R.jpg"


const Start = () => {

  return (
    <div className="reserve">
       
      <div className="Container">
        <br />
        <br />
        <br />
        <img className="image2" src={image1}/>
        <br />
        <br />
        <br />
        <span className="text2">There's a fresh receipt in your inbox!</span>
        
        <button className="rbutton">
          Reserve now!
        </button>
        <span className="text3">Remind me later </span>
      </div>
    </div>
  );
};

export default Start;
