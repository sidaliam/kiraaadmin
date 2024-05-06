import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import useF from "../../Hooks/useF";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/Authcontext";
import { useNotification } from "../../context/Notificationcontext";
import "react-toastify/dist/ReactToastify.css";
import "./Datatableconf.scss";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosinstance } from "../../config";
const Datatable = ({ columns }) => {
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const [formattedUnavailableData, setFormattedUnavailableData] = useState([]);
  const [selectionofroom, setselectionofroom] = useState([]);
  const [selectionids, setselectionids] = useState([]);
  const { user } = useContext(AuthContext);
  const userid = user._id;
  const [selectedRoomIds, setSelectedRoomIds] = useState([]); // Variable d'état pour stocker les ID des chambres sélectionnées
  const { countFalseResponses, setCountFalseResponses } = useNotification();
  const [selectedroomnumber, setselectedroomnumber] = useState();
  const [selectedattes, setselectedattes] = useState([]);

  // Fonction pour gérer les changements de sélection dans le DataGrid

  const { data: datahotel, loading: lodainghotel } = useF(`/users/hotels/${userid}`
  );
  const { data, loading } = useF(`/orders/`);

  const roomIds = [];

  if (datahotel && !lodainghotel) {
    datahotel.forEach((hotel) => {
      if (hotel.rooms) {
        hotel.rooms.forEach((room) => {
          roomIds.push(room._id);
        });
      }
    });
  }

  if (data && !loading) {
    const orderRoomIds = [];

    data.forEach((order) => {
      if (order.room) {
        orderRoomIds.push(order.room);
      }
    });
  }

  if (data && !loading && datahotel && !lodainghotel) {
    const orderRoomIds = data.map((order) => order.room);
    const commonRoomIds = orderRoomIds.filter((roomId) =>
      roomIds.includes(roomId)
    );
  }

  useEffect(() => {
    if (roomIds.length > 0) {
      const fetchRoomOrders = async () => {
        try {
          const response = await axiosinstance.get(`/orders/byRoomIds`, {
            params: {
              roomIds: roomIds,
            },
          });

          // Formatage des dates pour chaque commande
          const formattedData = response.data.map((item) => {
            const formattedUnavailable = item.unavailable.map((date) => {
              return new Date(date).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              });
            });
            return {
              ...item,
              unavailable: formattedUnavailable.join(", "),
            };
          });

          // Mettez les données formatées dans le state
          setFormattedUnavailableData(formattedData);
          const newCountFalseResponses = formattedData.filter(
            (item) => item.reponse === "false"
          ).length;
          setCountFalseResponses(newCountFalseResponses);
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des commandes :",
            error
          );
        }
      };

      fetchRoomOrders();
    }
  }, [roomIds]);

  const handleSelectionModelChange = (newSelection) => {
    setSelectedRoomIds(newSelection);

    const selectedRooms = formattedUnavailableData
      .filter((item) => newSelection.includes(item._id.toString()))
      .map((selectedRow) => selectedRow.room);

    const selectedIds = formattedUnavailableData
      .filter((item) => newSelection.includes(item._id.toString()))
      .map((selectedRow) => selectedRow._id);

    const selectedRoomNumbers = formattedUnavailableData
      .filter((item) => newSelection.includes(item._id.toString()))
      .map((selectedRow) => selectedRow.idroomnumber); // Récupérer les ID des chambres

    const selectedUnavailableDates = formattedUnavailableData
      .filter((item) => newSelection.includes(item._id.toString()))
      .flatMap((selectedRow) => selectedRow.unavailable.split(",")) // Split les dates si elles sont séparées par des virgules
      .map((dateString) => {
        const [day, month, year] = dateString.trim().split("/");
        return Date.parse(`${month}/${day}/${year}`);
      });

    console.log("Rooms sélectionnées : ", selectedRooms);
    console.log("Id des chambres sélectionnées :", selectedIds);
    console.log("ID des chambres sélectionnées :", selectedRoomNumbers); // Afficher les ID des chambres
    console.log(
      "Dates indisponibles sélectionnées :",
      selectedUnavailableDates
    );

    setselectionofroom(selectedRooms);
    setselectionids(selectedIds);
    setselectedroomnumber(selectedRoomNumbers);
    setselectedattes(selectedUnavailableDates);
  };

  const handleclickbutton = async () => {
    try {
      await Promise.all(
        selectedroomnumber.map(async (room) => {
          // Utilisez await pour attendre la résolution de la requête
          const res = await axiosinstance.put(`rooms/availabality/${room}`, {
            dates: selectedattes,
          });
  
          return res.data;
        })
      );
      await Promise.all(
        selectionids.map(async (ids) => {
          const res = await axiosinstance.put(`orders/response/${ids}`);
          return res.data;
        })
      );
      await Promise.all(
        selectionofroom.map(async (roomId) => {
          const res = await axiosinstance.put(`rooms/toggleAvailability/${roomId}`);
          return res.data;
        })
      );
  
      setCountFalseResponses((prevCount) => prevCount - 1);
    } catch (error) {
      console.error("Une erreur s'est produite lors de la confirmation de la commande :", error);
    }
  };
  

  const handleclickbutton2 = async () => {
    // Utilisez selectedRoomContent dans votre logique Axios
    await Promise.all(
      selectionids.map(async (ids) => {
        const res = await axiosinstance.delete(`orders/${ids}`);
        return res.data;
      })
    );
  };

  const getRowClassName = (params) => {
    // Vérifiez si la commande est confirmée
    const isConfirmed = formattedUnavailableData.find(
      (item) => item._id === params.row._id
    )?.reponse;

    // Vérifiez si la commande est terminée
    const isTerminated =
      formattedUnavailableData.find((item) => item._id === params.row._id)
        ?.reponse === "terminé";

    // Si la commande est confirmée, appliquez la classe CSS pour colorier la ligne en vert
    if (isConfirmed) {
      return "confirmed-row";
    }
    // Si la commande est terminée, appliquez la classe CSS pour colorier la ligne en rouge
    else if (isTerminated) {
      return "termin-row";
    }
    // Sinon, appliquez la classe CSS pour colorier la ligne en gris
    else {
      return "notrep-row";
    }
  };

  return (
    <div className="datatable">
      <ToastContainer />
      <div className="start-container"></div>

      <div className="datatableTitle">
        {path}
        <div
          className="link"
          style={{
            backgroundColor: "rgb(16, 198, 107)",
            color: "white",
            minWidth: "64px",
            padding: "2px 5px",
            borderRadius: "5px",
            fontFamily: "var(--pure-material-font)",
            fontSize: "14px",
          }}
          onClick={handleclickbutton}
        >
          Confirme la commande
        </div>
        <div
          className="link"
          style={{
            backgroundColor: "rgb(232, 11, 99)",
            color: "white",
            minWidth: "64px",
            padding: "2px 5px",
            borderRadius: "5px",
            fontFamily: "var(--pure-material-font)",
            fontSize: "14px",
          }}
          onClick={handleclickbutton2}
        >
          Supprimer la commande
        </div>
      </div>

      <DataGrid
        className="datagrid"
        rows={formattedUnavailableData}
        columns={columns}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
        getRowId={(row) => row._id}
        selectionModel={selectedRoomIds} // ID des chambres sélectionnées
        onSelectionModelChange={handleSelectionModelChange} // Gérer les changements de sélection
        getRowClassName={getRowClassName}
      />
    </div>
  );
};

export default Datatable;
