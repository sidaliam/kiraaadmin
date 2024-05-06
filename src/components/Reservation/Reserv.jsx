import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import useF from "../../Hooks/useF";
import React, { useState } from "react";
import { useContext } from "react";
import { SearchContext } from "../../Context/Searchcontext";
import "./Reserv.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/Authcontext";
import { GlobalContext } from "../../Context/ReservationContext";
import { useEffect } from "react";
const Reserv = ({ setopen, hotelid, searchcar }) => {
  const reservationContext = useContext(GlobalContext);
  const { increaseReservationCount } = reservationContext;
  const { addReservationDetails } = useContext(GlobalContext);

  const { data } = useF(`/hotels/room/${hotelid}`);
  console.log(data);
  const [selectedrooms, setselectedrooms] = useState([]);
  const [selectedidrooms, setselectedidrooms] = useState([]);
  const [selectedmodele, setselectedmodele] = useState([]);
  const [selectedpicture, setselectedpicture] = useState([]);
  const handleSelect = (e, roomId, itemId, modele, photos) => {
    const checked = e.target.checked;
    if (checked) {
      // Ajouter un objet { roomId, itemId } à selectedRooms
      setselectedrooms([...selectedrooms, roomId]);
      // Ajouter l'ID de l'élément sélectionné à la variable selectedidrooms
      setselectedidrooms([...selectedidrooms, itemId]);
      //Ajout du modéle
      setselectedmodele([...selectedmodele, modele]);

      setselectedpicture([...selectedpicture, photos]);
    } else {
      //Retirer le modéle
      setselectedmodele(selectedmodele.filter((mod) => mod !== modele));
      // Retirer l'objet { roomId, itemId } de selectedRooms
      setselectedrooms(selectedrooms.filter((item) => item !== roomId));
      // Retirer l'ID de l'élément désélectionné de selectedidrooms
      setselectedidrooms(selectedidrooms.filter((id) => id !== itemId));
      // Retirer la photo de l'élément désélectionné de selectedidrooms
      setselectedpicture(selectedpicture.filter((id) => id !== photos));
    }
  };

  const [dates, setDates] = useState(null); // State pour stocker les dates sélectionnées localement
  // Effet pour récupérer les dates depuis le stockage local lors du chargement du composant
  useEffect(() => {
    const storedDates = localStorage.getItem("selectedDates");
    if (storedDates) {
      setDates(JSON.parse(storedDates));
    }
  }, []);
  const { user } = useContext(AuthContext);
  console.log("modéle", selectedmodele);
  console.log("roomid", selectedidrooms);
  console.log("Roomnumberid", selectedrooms);
  const getdateesinrange = (startdate, enddate) => {
    const start = new Date(startdate);
    const end = new Date(enddate);
    const date = new Date(start.getTime());
    let list = [];
    while (date <= end) {
      list.push(new Date(date).getTime());
      date.setDate(date.getDate() + 1);
    }
    return list;
  };

  const alldates =
    dates && dates[0]
      ? getdateesinrange(dates[0].startDate, dates[0].endDate)
      : [];

  const isavailable = (roomnumber) => {
    const isfound = roomnumber.unavailableDates.some((date) =>
      alldates.includes(new Date(date).getTime())
    );
    return !isfound;
  };

  const navigate = useNavigate();

  const handleclick = async () => {
    const formattedDates = alldates.map((date) =>
      new Date(date).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    );

    try {
      increaseReservationCount();
      // Ajouter les détails de la réservation au contexte
      addReservationDetails({
        id: selectedidrooms, // ou un autre identifiant unique
        modele: selectedmodele,
        dates: formattedDates.join(" ,"),
        photos: selectedpicture,
        // Ajoutez d'autres détails que vous souhaitez afficher
      });

      setopen(false);

      // Rediriger l'utilisateur vers la page des réservations après la réservation
      navigate("/reservations");

      await Promise.all(
        selectedrooms.map((roomId) => {
          const res = axios.put(`/rooms/availabality/${roomId}`, {
            dates: alldates,
          });

          return res.data;
        })
      );

      const addOrders = async () => {
        try {
          for (let i = 0; i < selectedidrooms.length; i++) {
            const idroom = selectedidrooms[i];
            const model = selectedmodele[i];

            const addorder = await axios.post(
              `/orders/neworder/${user._id}/${idroom}`,
              {
                unavailable: alldates,
                username: user.username,
                télephone: user.phone,
                modéle: model,
              }
            );
            return addorder.data;

            // Traitement de la réponse addorder.data si nécessaire
          }

          // Toutes les requêtes sont terminées
        } catch (error) {
          // Gestion des erreurs ici
          console.error("Une erreur s'est produite :", error);
        }
      };

      addOrders();

      setopen(false);
      navigate("/");
    } catch (err) {}
  };
  return (
    <div className="reserve">
      <div className="Container">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="rclose"
          onClick={() => setopen(false)}
        />
        <span>Nos voitures disponibles :</span>
  
        {searchcar && searchcar.length > 0 ? (
          // If searchcar exists, display its information
          searchcar.map((item) => (
            <div key={item._id} className="ritem">
              <div className="rinfo">
                <div className="rdesc">{item.modéle}</div>
                <div className="rdesc">{item.année}</div>
                <div className="rdesc">{item.couleur}</div>
                <div className="rdesc">{item.disponible}</div>

                <div className="rdesc" style={{color : "orange"}}>{item.price} DA</div>

                <img
                  src={
                    item.photos && item.photos.length > 0
                      ? item.photos[0]
                      : "placeholder.jpg"
                  }
                  alt={item.modéle}
                  className="room-image"
                  style={{ width: "300px", height: "200px" }}
                />
  
                <div className="rSelectRooms">
                  {item.roomNumbers.map((roomNumber) => (
                    <div key={roomNumber._id} className="room">
                      <input
                        type="checkbox"
                        value={roomNumber._id}
                        onChange={(e) =>
                          handleSelect(
                            e,
                            roomNumber._id,
                            item._id,
                            item.modéle,
                            item.photos

                          )
                        }
                        disabled={!item.disponible}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          // If searchcar doesn't exist, display data information
          data.map((item) => (
            <div key={item._id} className="ritem">
              {item !== null ? (
                <div className="rinfo">
                  <div className="rdesc">{item.modéle}</div>
                  <div className="rdesc">{item.année}</div>
                  <div className="rdesc">{item.couleur}</div>
                  <div className="rdesc">{item.disponible}</div>

                  <div className="rdesc" style={{color : "orange"}}>{item.price} DA</div>

                  <img
                    src={
                      item.photos && item.photos.length > 0
                        ? item.photos[0]
                        : "placeholder.jpg"
                    }
                    alt={item.modéle}
                    className="room-image"
                    style={{ width: "300px", height: "200px" }}
                  />
  
                  <div className="rSelectRooms">
                    {item.roomNumbers.map((roomNumber) => (
                      <div key={roomNumber._id} className="room">
                        <input
                          type="checkbox"
                          value={roomNumber._id}
                          onChange={(e) =>
                            handleSelect(
                              e,
                              roomNumber._id,
                              item._id,
                              item.modéle,
                              item.photos
                            )
                          }
                          disabled={!item.disponible}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rtitle">not available</div>
              )}
            </div>
          ))
        )}
  
        <button className="rbutton" onClick={handleclick}>
          Réserver maintenant !
        </button>
      </div>
    </div>
  );
  
};

export default Reserv;
