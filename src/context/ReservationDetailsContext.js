// ReservationDetailsContext.js
import React, { createContext, useState, useEffect } from "react";

export const ReservationDetailsContext = createContext();

export const ReservationDetailsProvider = ({ children }) => {
  const [reservationDetails, setReservationDetails] = useState([]);

  // Charger les réservations depuis le stockage local lors de l'initialisation
  useEffect(() => {
    const storedReservationDetails = JSON.parse(localStorage.getItem("reservationDetails"));
    if (storedReservationDetails) {
      setReservationDetails(storedReservationDetails);
    }
  }, []);

  // Ajouter une réservation et mettre à jour le stockage local
  const addReservationDetails = (details) => {
    const updatedReservationDetails = [...reservationDetails, details];
    setReservationDetails(updatedReservationDetails);
    localStorage.setItem("reservationDetails", JSON.stringify(updatedReservationDetails));
  };

  const removeReservationDetails = (id) => {
    const updatedReservationDetails = reservationDetails.filter((details) => details.id !== id);
    setReservationDetails(updatedReservationDetails);
    localStorage.setItem("reservationDetails", JSON.stringify(updatedReservationDetails));
  };

  return (
    <ReservationDetailsContext.Provider value={{ reservationDetails, addReservationDetails,removeReservationDetails }}>
      {children}
    </ReservationDetailsContext.Provider>
  );
};
