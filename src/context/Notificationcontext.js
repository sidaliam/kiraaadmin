// NotificationContext.js
import React, { createContext, useContext, useEffect, useReducer } from "react";
import axios from "axios";
import useF from "../Hooks/useF";
import { AuthContext } from "./Authcontext";
import { axiosinstance } from "../config";

export const NotificationContext = createContext();

const initialState = {
  countFalseResponses: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_COUNT_FALSE_RESPONSES":
      return { ...state, countFalseResponses: action.payload };
    default:
      return state;
  }
};

export const NotificationProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const userid = user ? user._id : null;
  const [state, dispatch] = useReducer(reducer, initialState);
  const { data: datahotel, loading: loadingHotel } = useF(`/users/hotels/${userid}`);
  const { data, loading } = useF(`/orders/`);

  const getRoomIds = (hotel) =>
    hotel.rooms ? hotel.rooms.map((room) => room._id) : [];

  const roomIds = datahotel
    ? datahotel.flatMap((hotel) => getRoomIds(hotel))
    : [];

  useEffect(() => {
    const fetchRoomOrders = async () => {
      try {
        const response = await axiosinstance.get(`/orders/byRoomIds`, {
          params: {
            roomIds: roomIds,
          },
        });

        const formattedData = response.data.map((item) => ({
          ...item,
        }));

        dispatch({
          type: "SET_COUNT_FALSE_RESPONSES",
          payload: formattedData.filter((item) => item.reponse === false).length,
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des commandes :", error);
      }
    };

    if (roomIds.length > 0) {
      fetchRoomOrders();
    }
  }, [roomIds]);

  const value = {
    countFalseResponses: state.countFalseResponses,
    setCountFalseResponses: dispatch, // Replace with your actual dispatch function
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
