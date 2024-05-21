import FeaturedPropertiesx from "../../components/featuredPropertiesx/FeaturedPropertiesx";
import Footer from "../../components/footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Navbar from "../../components/navbar/Navbar";
import { Helmet } from "react-helmet-async";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";
import { useState } from "react";
import { DateRange } from "react-date-range";
import Headerx from "../../components/headerx/Headerx";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
const Agence = () => {
  localStorage.removeItem("selectedVoiture");
  localStorage.removeItem("selectedmodeles");

  const [openDate, setOpenDate] = useState(false);
  const [selectedDates, setSelectedDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  return (
    <div>
      <Helmet>
        <title>agences</title>
        <meta name="description" content="voici nos agences disponibles " />
      </Helmet>
      <Navbar />
      <Headerx />
      <br />
      <br />
      <div className="ctrdate">
        <h3 style={{ marginLeft: "5%" }}>
          Choisissez la date à laquelle vous souhaitez louer votre voiture :
          <br />
          <br />
          <div className="headerSearchItem">
            <FontAwesomeIcon
              icon={faCalendarDays}
              className="chiki"
              style={{ color: "rgb(0, 53, 128)" }}
            />
            <span
              onClick={() => setOpenDate(!openDate)}
              className="picki"
              style={{ color: "rgb(0, 53, 128)", cursor: "pointer" }}
            >
              {`${format(selectedDates[0].startDate, "MM/dd/yyyy")} to ${format(
                selectedDates[0].endDate,
                "MM/dd/yyyy"
              )}`}
            </span>

            {openDate && (
              <div className="datePickerContainer">
                <div className="datePicker">
                  <div className="sicon" onClick={() => setOpenDate(false)}>
                    <FontAwesomeIcon icon={faTimes} style={{color:"black",cursor:'pointer',background:'white'}} />
                  </div>
                  <br />
                  <br />
                  <DateRange
                    editableDateInputs={true}
                    onChange={(item) => setSelectedDates([item.selection])}
                    moveRangeOnFirstSelection={false}
                    ranges={selectedDates}
                    className="datex"
                    minDate={new Date()}
                  />
                </div>
              </div>
            )}
          </div>
        </h3>
      </div>

      <div className="homeContainer">
        <h1 className="homeTitlee" style={{ color: "orange" }}>
          NOS AGENCES
        </h1>
        <FeaturedPropertiesx selectedDates={selectedDates} />
      </div>
      <Footer />
    </div>
  );
};

export default Agence;
