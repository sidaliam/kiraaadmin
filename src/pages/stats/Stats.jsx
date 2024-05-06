import React, { useState } from "react";
import useF from "../../Hooks/useF";
import { AuthContext } from "../../context/Authcontext";
import { useEffect } from "react";
import { useContext } from "react";
import header from "../../components/header/Header";
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";
import { axiosinstance } from "../../config";
const Stats = () => {
  const [totale, settotale] = useState();
  const [confirm, setconfirm] = useState();
  const [ModelCounts, setModelCounts] = useState({});
  const [voiturecomm, setvoiturecomm] = useState([]);
  const [clientCounts, setclientCounts] = useState({});
  const [formattedUnavailableData, setFormattedUnavailableData] = useState([]);
  const { user } = useContext(AuthContext);
  const userid = user._id;

  const { data: datahotel, loading: lodainghotel } = useF(
    `/users/hotels/${userid}`
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
          // Traitement des données de réponse ici
          const formattedData = response.data.map((item) => {
            return {
              ...item,
            };
          });
          // Mettez les données formatées dans le state
          setFormattedUnavailableData(formattedData);
        } catch (error) {
          // Gestion des erreurs ici
        }
      };

      fetchRoomOrders();
    }
  }, [roomIds]);

  useEffect(() => {
    if (formattedUnavailableData.length > 0) {
      // Calcul du total des montants des commandes avec order.response=true
      const total = formattedUnavailableData.reduce((acc, order) => {
        // Vérifier si order.response est true avant d'ajouter le montant
        if (order.reponse === true) {
          return acc + order.totale;
        } else {
          return acc; // Si order.response est false, ne pas ajouter au total
        }
      }, 0);
      settotale(total);

      // Calcul du nombre de commandes confirmées
      const confirmedOrdersCount = formattedUnavailableData.filter(
        (order) => order.reponse === true
      ).length;
      setconfirm(confirmedOrdersCount);

      const counts = {};
      formattedUnavailableData.forEach((order) => {
        if (!counts[order.modéle]) {
          counts[order.modéle] = 0;
        }
        if (order.reponse === true) {
          counts[order.modéle]++;
        }
      });
      setModelCounts(counts);

      const counts2 = {};
      formattedUnavailableData.forEach((order) => {
        if (!counts2[order.username]) {
          counts2[order.username] = 0;
        }
        if (order.reponse === true) {
          counts2[order.username]++;
        }
      });
      setclientCounts(counts2);
    }
  }, [formattedUnavailableData]);

  const clientsArray = Object.entries(clientCounts);
  const maxClient = clientsArray.reduce(
    (acc, [client, count]) => {
      return count > acc.count ? { client, count } : acc;
    },
    { client: "", count: 0 }
  );

  const maxClientName = maxClient.client;


  // Effet pour mettre à jour ModelCounts
  useEffect(() => {
    if (formattedUnavailableData.length > 0) {
      // Initialisation d'un objet pour stocker les comptages des commandes par modèle de voiture
      const counts = {};

      // Boucle à travers les données de commandes
      formattedUnavailableData.forEach((order) => {
        // Créez une clé unique en combinant le nom et l'ID de la voiture
        const carKey = ` nom voiture : ${order.modéle}  id : ${order.room}`;

        // Vérifier si la commande est confirmée
        if (order.reponse === true) {
          // Si la clé n'existe pas encore dans l'objet counts, l'initialiser à 0
          if (!counts[carKey]) {
            counts[carKey] = 0;
          }
          // Incrémenter le compteur pour cette clé
          counts[carKey]++;
        }
      });

      // Mettre à jour le state avec les comptages des commandes par modèle de voiture
      setModelCounts(counts);
    }
  }, [formattedUnavailableData]);

  return (
    <div>
    <Header />
    <h2> <br/></h2>
    <table style={{ borderCollapse: 'collapse', width: '98%',marginLeft:'1%' }}>
      <thead>
        <tr>
          <th style={{ border: '1px solid black', padding: '8px',background:'rgba(96,194,222,255)' }}>Statistique</th>
          <th style={{ border: '1px solid black', padding: '8px',background:'rgba(240,148,65,255)' }}>Valeur</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ border: '1px solid black', padding: '8px' }}>Nombre de commandes reçues</td>
          <td style={{ border: '1px solid black', padding: '8px' }}>{formattedUnavailableData.length}</td>
        </tr>
        <tr>
          <td style={{ border: '1px solid black', padding: '8px' }}>Nombre de commandes confirmées</td>
          <td style={{ border: '1px solid black', padding: '8px' }}>{confirm}</td>
        </tr>
        <tr>
          <td style={{ border: '1px solid black', padding: '8px' }}>Nombre de commandes non confirmées</td>
          <td style={{ border: '1px solid black', padding: '8px' }}>{formattedUnavailableData.length - confirm}</td>
        </tr>
        <tr>
          <td style={{ border: '1px solid black', padding: '8px' }}>Entrée d'argent</td>
          <td style={{ border: '1px solid black', padding: '8px' }}>{totale} DA</td>
        </tr>
        <tr>
          <td style={{ border: '1px solid black', padding: '8px' }}>Voitures les plus commandées</td>
          <td style={{ border: '1px solid black', padding: '8px' }}>
            <ol>
              {Object.keys(ModelCounts).map((carKey, index) => (
                <li key={index}>{carKey}: {ModelCounts[carKey]} Commande(s) Confirmé</li>
              ))}
            </ol>
          </td>
        </tr>
        <tr>
          <td style={{ border: '1px solid black', padding: '8px' }}>
            Client ayant le plus commandé chez vous
          </td>
          <td style={{ border: '1px solid black', padding: '8px' }}>
            {maxClientName} avec un nombre de commande de: {maxClient.count}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  );
};

export default Stats;
