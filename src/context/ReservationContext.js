// GlobalContext.js
import React, { createContext, useState, useEffect } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [reservationDetails, setReservationDetails] = useState([]);

  useEffect(() => {
    const storedReservationDetails = JSON.parse(
      localStorage.getItem("reservationDetails")
    );
    if (storedReservationDetails) {
      console.log(
        "ReservationDetails chargé depuis le localStorage :",
        storedReservationDetails
      );
      setReservationDetails(storedReservationDetails);
    }
  }, []);

  const addReservationDetails = (details) => {
    const updatedReservationDetails = [...reservationDetails, details];
    setReservationDetails(updatedReservationDetails);
    localStorage.setItem(
      "reservationDetails",
      JSON.stringify(updatedReservationDetails)
    );
  };

  const removeReservationDetails = (id) => {
    const updatedReservationDetails = reservationDetails.filter(
      (details) => details.id !== id
    );
    setReservationDetails(updatedReservationDetails);
    localStorage.setItem(
      "reservationDetails",
      JSON.stringify(updatedReservationDetails)
    );
  };

  const [reservationCount, setReservationCount] = useState(() => {
    const storedReservationCount = JSON.parse(
      localStorage.getItem("reservationCount")
    );
    return storedReservationCount !== null ? storedReservationCount : 0;
  });

  useEffect(() => {
    localStorage.setItem("reservationCount", JSON.stringify(reservationCount));
  }, [reservationCount]);

 

  const increaseReservationCount = () => {
    setReservationCount((prevCount) => prevCount + 1);
  };

  const decreaseReservationCount = () => {
    setReservationCount((prevCount) => prevCount - 1);
  };

  useEffect(() => {
    console.log(
      "Mise à jour du localStorage avec ReservationCount :",
      reservationCount
    );
    localStorage.setItem("reservationCount", JSON.stringify(reservationCount));
  }, [reservationCount]);

  return (
    <GlobalContext.Provider
      value={{
        reservationDetails,
        addReservationDetails,
        removeReservationDetails,
        reservationCount,
        increaseReservationCount,
        decreaseReservationCount,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
