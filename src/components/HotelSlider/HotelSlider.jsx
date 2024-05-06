import React, { useState } from "react";
import "./HotelSlider.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowLeft, faCircleArrowRight, faCircleXmark } from "@fortawesome/free-solid-svg-icons";

const HotelSlider = ({ photos }) => {
  const [startIndex, setStartIndex] = useState(0);
  const [enlargedIndex, setEnlargedIndex] = useState(null); // Etat pour suivre quelle photo est actuellement agrandie

  const visiblePhotos = photos.slice(startIndex, startIndex + 3);

  const handlePrev = () => {
    setStartIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  const handleNext = () => {
    setStartIndex((prevIndex) => Math.min(photos.length - 3, prevIndex + 1));
  };

  const handleImageClick = (index) => {
    setEnlargedIndex(index); // Met à jour l'état pour agrandir la photo correspondante
  };

  const handleClose = () => {
    setEnlargedIndex(null); // Réinitialise l'état lorsque l'utilisateur ferme l'agrandissement de la photo
  };

  return (
    <div className="slider">
      {enlargedIndex !== null && ( // Affiche la version agrandie de la photo si un index est défini
        <div className="enlargedPhotoOverlay" onClick={handleClose}>
          <img src={photos[enlargedIndex]} alt="" className="enlargedPhoto" />
        </div>
      )}
      <FontAwesomeIcon icon={faCircleXmark} className="close" onClick={handleClose} />
      <FontAwesomeIcon icon={faCircleArrowLeft} className="arrow left" onClick={handlePrev} />
      <div className="sliderWrapper">
        {visiblePhotos.map((photo, index) => (
          <img key={index} src={photo} alt="" className="sliderImg" onClick={() => handleImageClick(startIndex + index)} />
        ))}
      </div>
      <FontAwesomeIcon icon={faCircleArrowRight} className="arrow right" onClick={handleNext} />
    </div>
  );
};

export default HotelSlider;
