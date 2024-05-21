import "./searchItem.css";
import { Link } from "react-router-dom";


const SearchItem = ({ item }) => {
  return (
    <div className="searchItem">
      <img src={item.photos[0]} alt="" className="siImg" />
      <div className="siDesc">
        <h1 className="siTitle">{item.name}</h1>
        <span className="siDistance">{item.city}</span>
        <span className="siDistance" style={{backgroundColor:"white"}}>{item.address}</span>
        <span className="siDistance">livraison:{item.Featured}</span>

        <span className="siSubtitle">
          notre agence a la voiture que tu cherches et d'autres 
        </span>
        <span className="siFeatures">{item.desc}</span>
        <span className="vt"> nos voitures : </span>
        <span className="siFeatures">{item.rooms.map((room)=>(
           <span className="siFeatures" key={room._id} ><ul ><li > {room.marque} {room.modéle}</li></ul></span>
        ))}</span>
        <span className="siCancelOp"> </span>
        <span className="siCancelOpSubtitle">
          
        </span>
      </div>
      <div className="siDetails">
        {item.rating && (
          <div className="siRating">
            <span>Excellent</span>
            <button>{item.rating}</button>
          </div>
        )}

        <div className="siDetailTexts">
          
          
          <Link to={`/hotels/${item._id}`}>
            <button className="siCheckButton">Voir la disponibilité</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;
