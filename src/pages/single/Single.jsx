import React from "react";
import "./single.scss";
import Header from "../../components/header/Header";
import { useLocation } from "react-router-dom";
import useF from "../../Hooks/useF";

const Single = () => {
  const location = useLocation();
  const idroom = location.pathname.split("/")[2];
  const { data, loading, error } = useF(`/rooms/${idroom}`);

  // Vérification de l'état de chargement et d'erreur
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {" "}
      <Header />
      <div className="single">
        <div className="singleContainer">
          <div className="top">
            <div className="left">
              <div className="editButton">Edit</div>
              <h1 className="title">Information</h1>
              <div className="item">
                <div className="details">
                  <h1 className="itemTitle">{data.marque}</h1>
                  <h1 className="itemTitle">{data.modéle}</h1>
                  <div className="detailItem">
                    <span className="itemKey">Couleur :</span>
                    <span className="itemValue">{data.couleur}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Année:</span>
                    <span className="itemValue">{data.année}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Prix:</span>
                    <span className="itemValue">{data.price}</span>
                  </div>
                  <div className="phot">
                    {data.photos &&
                      data.photos.map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          style={{
                            width: "150px",
                            height: "100px",
                            marginRight: "5px",
                            marginTop: "10px",
                          }}
                          alt={`Photo ${index + 1}`}
                          className="photo"
                        />
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Single;
