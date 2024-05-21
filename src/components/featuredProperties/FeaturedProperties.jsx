import React, { useState } from "react";
import "./featuredProperties.css";
import { Link } from "react-router-dom";
import useF from "../../Hooks/useF";
const FeaturedProperties = () => {
  const { data, error, loading } = useF("/rooms");
  const [visibleVoitures, setVisibleVoitures] = useState(12);

  const handleCarClick = (car) => {
    localStorage.setItem("selectedVoiture", JSON.stringify(car));
    localStorage.removeItem("selectedmodeles");
  };

  return (<div>
    <div className="fp">
      
      {loading ? (
        "Loading ...."
      ) : error ? (
        "Error fetching data."
      ) : (
        <>
          {data.slice(0, visibleVoitures).map((car) => (
            <Link
              key={car._id}
              to={`/hotels/${car._id}`}
              className="fpItemLink"
              style={{ textDecoration: "none" }}
            >
              <div className="fpItem" onClick={() => handleCarClick(car)}>
                <div className="card">
                  {car.photos && car.photos.length > 0 && (
                    <img src={car.photos[0]} alt="" className="fpImg" />
                  )}
                  <div className="card-body">
                    <span className="fpName">{car.modéle}</span>
                    <span className="fpCity">Année: {car.année}</span>
                    <span className="fpCity">Color: {car.couleur}</span>
                    <span className="fpCity">moteur: {car.moteur}</span>
                    <span className="fpCity">ville: {car.hotelDetails.city}</span>
                    <span className="fpCity" style={{color:"green"}}>telephone: 0{car.hotelDetails.cheapestPrice}</span>

                    <span className="fpPrice">Prix: {car.price} DA</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
           
        </>
     
      )}
    
      </div>
      <div className="showMoreButtonContainer">

{data.length > visibleVoitures && (
  <button className="showMoreButton" onClick={() => setVisibleVoitures(visibleVoitures +12)}>
    Voir plus
  </button>
)}
</div>
    </div>
  );
};

export default FeaturedProperties;
