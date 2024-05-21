import "./hotel.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useF from "../../Hooks/useF";
import { AuthContext } from "../../Context/Authcontext";
import Reserv from "../../components/Reservation/Reserv";
import { GlobalContext } from "../../Context/ReservationContext";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { FcBusinessman, FcShipped } from "react-icons/fc";
import { CgPhone } from "react-icons/cg";
import { AiTwotoneEnvironment } from "react-icons/ai";
import { Helmet } from "react-helmet-async";
import { axiosinstance } from "../../config";

const Hotel = () => {
  const [datess, setDatess] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [openDate, setOpenDate] = useState(false);
  const seletedvoitures = localStorage.getItem("selectedVoiture");
  const voiture = JSON.parse(seletedvoitures);
  const seletedmodels = localStorage.getItem("selectedmodeles");
  const modéle = JSON.parse(seletedmodels);
  const [searchcar, setsearchcar] = useState([]);
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [openmodal, setOpenmodal] = useState(false);
  const [dates, setDates] = useState(null);
  const [roomNumbers, setRoomNumbers] = useState("");

  useEffect(() => {
    const storedDates = localStorage.getItem("selectedDates");
    if (storedDates) {
      setDates(JSON.parse(storedDates));
    }
  }, []);

  const handleOpen = (i) => {
    setSlideNumber(i);
    setOpen(true);
  };

  const handleMove = (direction) => {
    let newSlideNumber;

    if (direction === "l") {
      newSlideNumber = slideNumber === 0 ? 5 : slideNumber - 1;
    } else {
      newSlideNumber = slideNumber === 5 ? 0 : slideNumber + 1;
    }

    setSlideNumber(newSlideNumber);
  };

  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { data, error, loading } = useF(`/hotels/find/${id}`);
  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

  function dayDifference(date1, date2) {
    // Vérifier si les dates sont égales
    if (date2.getTime() === date1.getTime()) {
      return 1; // Si les dates sont égales, retourner 1
    } else {
      // Calculer la différence en jours normalement
      const timeDiff = Math.abs(date2.getTime() - date1.getTime());
      const diffDays = Math.ceil(timeDiff / MILLISECONDS_PER_DAY);
      return diffDays;
    }
  }

  const days =
    dates && dates[0]?.endDate && dates[0]?.startDate
      ? dayDifference(new Date(dates[0].endDate), new Date(dates[0].startDate))
      : 0;

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleclick = () => {
    if (user) {
      setOpenmodal(true);
    } else {
      navigate("/login");
    }
  };

  const { data: datavoiture } = useF(`/hotels/room/${id}`);

  const foundCars = datavoiture.filter((voiture) => voiture.modéle === modéle);

  // Mise à jour de searchcar
  useEffect(() => {
    if (foundCars) {
      setsearchcar(foundCars);
    }
  }, [foundCars]);

  // Pour commande de voitures
  const reservationContext = useContext(GlobalContext);
  const { increaseReservationCount } = reservationContext;
  const { addReservationDetails } = useContext(GlobalContext);
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
    datess && datess[0]
      ? getdateesinrange(datess[0].startDate, datess[0].endDate)
      : [];

  const alldates2 =
    dates && dates[0]
      ? getdateesinrange(dates[0].startDate, dates[0].endDate)
      : [];

  const handleclick2 = async () => {
    if (user) {
      try {
        const formattedDates = alldates.map((date) =>
          new Date(date).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        );

        increaseReservationCount();
        // Ajouter les détails de la réservation au contexte
        addReservationDetails({
          id: voiture._id, // ou un autre identifiant unique
          modele: voiture.modéle, // Correction : "modèle" au lieu de "modéle"
          dates: formattedDates.join(" ,"),
          // Ajoutez d'autres détails que vous souhaitez afficher
        });

        const addOrders = async () => {
          const roomIdee = voiture.roomNumbers.map(
            (roomnumber) => roomnumber._id
          );
          const idroomnumbeur = roomIdee[0];
          try {
            const addorder = await axiosinstance.post(
              `/orders/neworder/${user._id}/${voiture._id}`,
              {
                unavailable: alldates,
                username: user.username,
                télephone: user.phone, // Correction : "téléphone" au lieu de "télephone"
                modéle: voiture.modéle, // Correction : "modele" au lieu de "modéle"
                totale: voiture.price * alldates.length, // le totale de la commande
                idroomnumber: idroomnumbeur,
              }
            );

            // Ajouter la gestion de la réponse de la requête axios.post si nécessaire
            return addorder.data;
            
          } catch (error) {
            // Gestion des erreurs ici
            console.error("Une erreur s'est produite :", error);
          }
        };

        await addOrders();
        alert("commande envoyée");
      } catch (err) {
        // Gestion des erreurs ici
        console.error("Une erreur s'est produite :", err);
      }
    } else {
      navigate("/login");
    }
  };

  const [imageAgrandie, setImageAgrandie] = useState(null); // Utilisez null pour indiquer qu'aucune image n'est agrandie

  const handleImageClick = (photo) => {
    setImageAgrandie(photo);
  };

  const handleCloseImageAgrandie = () => {
    setImageAgrandie(null); // Réinitialise l'état pour cacher l'image agrandie
  };

  const isAvailable = (roomNumber) => {
    const isFound = roomNumber.unavailableDates.some((date) =>
      alldates.includes(new Date(date).getTime())
    );

    return !isFound;
  };

  const isAvailable2 = (roomNumber) => {
    const isFound = roomNumber.unavailableDates.some((date) =>
      alldates2.includes(new Date(date).getTime())
    );

    return !isFound;
  };

  return (
    <div>
      <Helmet>
        <title>reservation</title>
        <meta name="description" content="" />{" "}
      </Helmet>
      <Navbar />
      <Header />
      {!modéle &&
        voiture && ( // If modéle is not available, use voiture
          <div className="hotelContainer">
            {open && (
              <div className="slider">
                <FontAwesomeIcon
                  icon={faCircleXmark}
                  className="close"
                  onClick={() => setOpen(false)}
                />
                <FontAwesomeIcon
                  icon={faCircleArrowLeft}
                  className="arrow"
                  onClick={() => handleMove("l")}
                />
                <div className="sliderWrapper">
                  {voiture.photos && voiture.photos.length > 0 && (
                    <img
                      src={voiture.photos[slideNumber]}
                      alt=""
                      className="sliderImg"
                    />
                  )}
                </div>
                <FontAwesomeIcon
                  icon={faCircleArrowRight}
                  className="arrow"
                  onClick={() => handleMove("r")}
                />
              </div>
            )}
            <div className="ctrdate">
              <h3 style={{ marginLeft: "2%" }}>
                Choisissez la date à laquelle vous souhaitez louer votre voiture
                :
                <br />
                <br />
                <div className="headerSearchItem">
                  <FontAwesomeIcon
                    icon={faCalendarDays}
                    className="headerIcon"
                    style={{ color: "rgb(0, 53, 128)" }}
                  />
                  <span
                    onClick={() => setOpenDate(!openDate)}
                    className="headerSearchText"
                    style={{ color: "rgb(0, 53, 128)" }}
                  >
                    {`${format(datess[0].startDate, "MM/dd/yyyy")} to ${format(
                      datess[0].endDate,
                      "MM/dd/yyyy"
                    )}`}
                  </span>
                  {openDate && (
                    <DateRange
                      editableDateInputs={true}
                      onChange={(item) => setDatess([item.selection])}
                      moveRangeOnFirstSelection={false}
                      ranges={datess}
                      className="datex"
                      minDate={new Date()}
                    />
                  )}
                </div>
              </h3>
            </div>

            <br />
            <br />

            <div className="hotelWrapper">
              <h3 className="hotelTitle">
                {voiture.marque} {voiture.modéle}
              </h3>
              <h3 className="hotelTitle"></h3>

              <div className="rdesc">
                <h5
                  style={{
                    marginBottom: "5px",
                    borderBottom: "1px solid",
                    borderColor: "white",
                    paddingBottom: "2px",
                  }}
                >
                  Année : {voiture.année}
                </h5>

                <h5
                  style={{
                    marginBottom: "5px",
                    borderBottom: "1px solid",
                    borderColor: "white",
                    paddingBottom: "2px",
                  }}
                >
                  Moteur : {voiture.moteur}
                </h5>

                <h5
                  style={{
                    marginBottom: "5px",
                    borderBottom: "1px solid",
                    borderColor: "white",
                    paddingBottom: "2px",
                  }}
                >
                  Couleur : {voiture.couleur}
                </h5>

                <h5
                  style={{
                    marginBottom: "5px",
                    borderBottom: "1px solid",
                    borderColor: "white",
                    paddingBottom: "2px",
                  }}
                >
                  {" "}
                  <FcBusinessman /> Chaufeur : {voiture.hotelDetails.title}
                </h5>

                <h5
                  style={{
                    marginBottom: "5px",
                    borderBottom: "1px solid",
                    borderColor: "white",
                    paddingBottom: "2px",
                  }}
                >
                  {" "}
                  <FcShipped /> Livraison : {voiture.hotelDetails.desc}
                </h5>

                <h5
                  style={{
                    display: "inline-block",
                    verticalAlign: "middle",
                    marginBottom: "5px",
                    borderBottom: "1px solid",
                    borderColor: "white",
                    paddingBottom: "2px",
                  }}
                >
                  Disponibilité :{" "}
                  {voiture.roomNumbers.map((roomnumber) => (
                    <h5
                      style={{
                        display: "inline-block",
                        verticalAlign: "middle",
                      }}
                    >
                      {!isAvailable(roomnumber) ? (
                        <>
                          <AiOutlineClose
                            style={{
                              marginRight: "5px",
                              fontSize: "30px",
                              color: "red",
                              verticalAlign: "middle",
                            }}
                          />
                          <h3
                            style={{
                              color: "red",
                              display: "inline-block",
                              verticalAlign: "middle",
                            }}
                          >
                            non disponible
                          </h3>
                        </>
                      ) : (
                        <>
                          <AiOutlineCheck
                            style={{
                              marginRight: "5px",
                              fontSize: "30px",
                              color: "green",
                              verticalAlign: "middle",
                            }}
                          />
                          <h3
                            style={{
                              color: "green",
                              display: "inline-block",
                              verticalAlign: "middle",
                            }}
                          >
                            disponible
                          </h3>
                        </>
                      )}
                    </h5>
                  ))}
                </h5>
              </div>

              <div className="rdesc">
                <h5
                  style={{
                    color: "orange",
                    backgroundColor: "white",
                    width: "max-content",
                    borderRadius: "5px",
                    paddingLeft: "2px",
                    paddingRight: "2px",
                    fontSize: "18px",
                  }}
                >
                  Prix : {voiture.price} DA /par jour
                </h5>
              </div>
              <h4> {voiture.hotelDetails.name} </h4>

              <div className="hotelAddress">
                <AiTwotoneEnvironment
                  style={{ fontSize: "20px", color: "blue" }}
                />

                <h6>
                  <span className="hotelDistance" style={{ fontSize: "20px" }}>
                    {voiture.hotelDetails.city}
                  </span>
                </h6>
              </div>
              <div className="hotelAddress">
                <h3>{voiture.hotelDetails.address}</h3>
                <h6>
                  <span className="hotelDistance"></span>
                </h6>
              </div>

              <span className="hotelPriceHighlight">
                <CgPhone /> 0{voiture.hotelDetails.cheapestPrice}
              </span>
              <div className="hotelImages">
                {voiture.photos?.map((photo, i) => (
                  <div className="hotelImgWrapper" key={i}>
                    <img
                      src={photo}
                      alt=""
                      className="hotelImg"
                      onClick={() => handleImageClick(photo)}
                    />
                  </div>
                ))}
                {imageAgrandie && (
                  <div
                    className="imageAgrandieOverlay"
                    onClick={handleCloseImageAgrandie}
                  >
                    <img src={imageAgrandie} alt="" className="imageAgrandie" />
                  </div>
                )}
              </div>
              <div className="hotelDetails">
                <div className="hotelDetailsTexts">
                  <h1 className="hotelTitle">
                    description de la voiture : <br />
                  </h1>
                  {voiture.description}
                  <br />
                  <br />
                </div>

                <div className="hotelDetailsPrice">
                  <span></span>

                  <h3>Total à payer : {voiture.price * alldates.length} DA</h3>

                  {voiture.roomNumbers.map((roomnumber) => (
                    <button
                      key={roomnumber._id}
                      className="bookNow"
                      onClick={handleclick2}
                      disabled={!isAvailable(roomnumber)}
                      style={{
                        pointerEvents: !isAvailable(roomnumber)
                          ? "none"
                          : "auto",
                      }}
                    >
                      Commandez la {voiture.modéle}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      {!voiture &&
        modéle &&
        Array.isArray(searchcar) &&
        searchcar.map((searchcarr, index) => (
          <div key={index} className="hotelContainer">
            {open && (
              <div className="slider">
                <FontAwesomeIcon
                  icon={faCircleXmark}
                  className="close"
                  onClick={() => setOpen(false)}
                />
                <FontAwesomeIcon
                  icon={faCircleArrowLeft}
                  className="arrow"
                  onClick={() => handleMove("l")}
                />
                <div className="sliderWrapper">
                  {searchcarr.photos && searchcarr.photos.length > 0 && (
                    <img
                      src={searchcarr.photos[slideNumber]}
                      alt=""
                      className="sliderImg"
                    />
                  )}
                </div>
                <FontAwesomeIcon
                  icon={faCircleArrowRight}
                  className="arrow"
                  onClick={() => handleMove("r")}
                />
              </div>
            )}
            <div className="hotelWrapper">
              <h3 className="hotelTitle">
                {searchcarr.marque} {searchcarr.modéle}
              </h3>
              <h3 className="hotelTitle"></h3>

              <div className="rdesc">
                <div className="rdesc">
                  <h5
                    style={{
                      marginBottom: "5px",
                      borderBottom: "1px solid",
                      borderColor: "white",
                      paddingBottom: "2px",
                    }}
                  >
                    Année : {searchcarr.année}
                  </h5>

                  <h5
                    style={{
                      marginBottom: "5px",
                      borderBottom: "1px solid",
                      borderColor: "white",
                      paddingBottom: "2px",
                    }}
                  >
                    Moteur : {searchcarr.moteur}
                  </h5>

                  <h5
                    style={{
                      marginBottom: "5px",
                      borderBottom: "1px solid",
                      borderColor: "white",
                      paddingBottom: "2px",
                    }}
                  >
                    Couleur : {searchcarr.couleur}
                  </h5>

                  <h5
                    style={{
                      marginBottom: "5px",
                      borderBottom: "1px solid",
                      borderColor: "white",
                      paddingBottom: "2px",
                    }}
                  >
                    {" "}
                    <FcBusinessman /> Chaufeur : {searchcarr.hotelDetails.title}
                  </h5>

                  <h5
                    style={{
                      marginBottom: "5px",
                      borderBottom: "1px solid",
                      borderColor: "white",
                      paddingBottom: "2px",
                    }}
                  >
                    {" "}
                    <FcShipped /> Livraison : {searchcarr.hotelDetails.desc}
                  </h5>

                  <h5
                    style={{
                      display: "inline-block",
                      verticalAlign: "middle",
                      marginBottom: "5px",
                      borderBottom: "1px solid",
                      borderColor: "white",
                      paddingBottom: "2px",
                    }}
                  >
                    Disponibilité :{" "}
                    {searchcarr.roomNumbers.map((roomnumber) => (
                      <h5
                        style={{
                          display: "inline-block",
                          verticalAlign: "middle",
                        }}
                      >
                        {!isAvailable(roomnumber) ? (
                          <>
                            <AiOutlineClose
                              style={{
                                marginRight: "5px",
                                fontSize: "30px",
                                color: "red",
                                verticalAlign: "middle",
                              }}
                            />
                            <h3
                              style={{
                                color: "red",
                                display: "inline-block",
                                verticalAlign: "middle",
                              }}
                            >
                              non disponible
                            </h3>
                          </>
                        ) : (
                          <>
                            <AiOutlineCheck
                              style={{
                                marginRight: "5px",
                                fontSize: "30px",
                                color: "green",
                                verticalAlign: "middle",
                              }}
                            />
                            <h3
                              style={{
                                color: "green",
                                display: "inline-block",
                                verticalAlign: "middle",
                              }}
                            >
                              disponible
                            </h3>
                          </>
                        )}
                      </h5>
                    ))}
                  </h5>
                </div>
              </div>

              <div className="rdesc">
                <h5
                  style={{
                    color: "orange",
                    backgroundColor: "white",
                    width: "max-content",
                    borderRadius: "5px",
                    paddingLeft: "2px",
                    paddingRight: "2px",
                    fontSize: "18px",
                  }}
                >
                  Prix : {searchcarr.price} DA /par jour
                </h5>
              </div>
              <div className="rdesc">
                <h4> {data.name}</h4>
              </div>

              <div className="hotelAddress">
                <AiTwotoneEnvironment
                  style={{ fontSize: "20px", color: "blue" }}
                />

                <h5>
                  <span className="hotelDistance" style={{ fontSize: "20px" }}>
                    {" "}
                    {data.city}
                  </span>
                </h5>
              </div>
              <h4>
                <span>{data.address}</span>
              </h4>
              <span className="hotelPriceHighlight">
                <CgPhone /> 0{searchcarr.hotelDetails.cheapestPrice}{" "}
              </span>
              <div className="hotelImages">
                {searchcarr.photos?.map((photo, i) => (
                  <div className="hotelImgWrapper" key={i}>
                    <img
                      src={photo}
                      alt=""
                      className="hotelImg"
                      onClick={() => handleImageClick(photo)}
                    />
                  </div>
                ))}
                {imageAgrandie && (
                  <div
                    className="imageAgrandieOverlay"
                    onClick={handleCloseImageAgrandie}
                  >
                    <img src={imageAgrandie} alt="" className="imageAgrandie" />
                  </div>
                )}
              </div>
              <div className="hotelDetails">
                <div className="hotelDetailsTexts">
                  <h1 className="hotelTitle">description de la voiture</h1>
                  <p className="hotelDesc">{searchcarr.description}</p>
                </div>
                <div className="hotelDetailsPrice">
                  <h1>commandez pour {days} jour(s)</h1>
                  <span>
                    commandez la voiture en ligne et recevez votre réservation
                  </span>
                  <h2>
                    <b>{searchcarr.price * days} DA</b> ({days} jour(s))
                  </h2>
                  {searchcar && searchcar.length > 0 && (
                    <button className="bookNow" onClick={handleclick}>
                      commandez la {searchcarr.modéle}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

      {!voiture &&
        !modéle && ( // If both voiture and modéle are not available, use hotel information
          <div className="hotelContainer">
            {open && (
              <div className="slider">
                <FontAwesomeIcon
                  icon={faCircleXmark}
                  className="close"
                  onClick={() => setOpen(false)}
                />
                <FontAwesomeIcon
                  icon={faCircleArrowLeft}
                  className="arrow"
                  onClick={() => handleMove("l")}
                />
                <div className="sliderWrapper">
                  {data.photos && data.photos.length > 0 && (
                    <img
                      src={data.photos[slideNumber]}
                      alt=""
                      className="sliderImg"
                    />
                  )}
                </div>
                <FontAwesomeIcon
                  icon={faCircleArrowRight}
                  className="arrow"
                  onClick={() => handleMove("r")}
                />
              </div>
            )}
            <div className="hotelWrapper">
              <h3 className="hotelTitle">{searchcar.marque}</h3>
              <h3 className="hotelTitle">{data.name}</h3>

              <img
                style={{ maxWidth: "75%", height: "auto" }}
                src={data.photos}
                alt=""
                className="imgihotel"
              />

              <h5
                style={{
                  marginBottom: "5px",
                  borderBottom: "1px solid",
                  borderColor: "white",
                  paddingBottom: "2px",
                }}
              >
                {" "}
                <FcBusinessman /> chaufeur : {data.title}
              </h5>

              <h5
                style={{
                  marginBottom: "5px",
                  borderBottom: "1px solid",
                  borderColor: "white",
                  paddingBottom: "2px",
                }}
              >
                {" "}
                <FcShipped /> livraison : {data.desc}
              </h5>
              <div className="hotelAddress">
                <AiTwotoneEnvironment
                  style={{ fontSize: "20px", color: "blue" }}
                />

                <h5>
                  <span className="hotelDistance" style={{ fontSize: "20px" }}>
                    {" "}
                    {data.city}
                  </span>
                </h5>

                <h4>
                  <span>{data.address}</span>
                </h4>
              </div>
              <div className="hotelImages">
                {searchcar.photos?.map((photo, i) => (
                  <div className="hotelImgWrapper" key={i}>
                    <img
                      onClick={() => handleOpen(i)}
                      src={photo}
                      alt=""
                      className="hotelImg"
                    />
                  </div>
                ))}
              </div>
              <div className="hotelDetails">
                <div className="hotelDetailsTexts">
                  <span className="vt"> nos voitures : </span>
                  <span className="siFeatures">
                    {data.rooms &&
                      data.rooms.map((room) => (
                        <span className="siFeatures" key={room._id}>
                          <ul>
                            <li>
                              {room.marque} {room.modéle}
                            </li>
                          </ul>
                        </span>
                      ))}
                  </span>
                </div>
                <div className="hotelDetailsPrice">
                  <h1>commandez pour {days} jours</h1>
                  <span>voici nos voitures à commander</span>
                  <span>cochez voiture choisie</span>
                  <h2>({days} jour(s))</h2>
                  <button className="bookNow" onClick={handleclick}>
                    commandez ici
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      {openmodal && (
        <Reserv setopen={setOpenmodal} hotelid={id} searchcar={searchcar} />
      )}
      <Footer />
    </div>
  );
};

export default Hotel;
