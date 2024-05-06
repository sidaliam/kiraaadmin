import "./NewRoom.scss";
import { useState, useEffect } from "react";
import { roomInputs } from "../../formSource";
import useF from "../../Hooks/useF";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../context/Authcontext";
import DriveFolderUploadOutlined from "@mui/icons-material/DriveFolderUploadOutlined";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import { axiosinstance } from "../../config";

const NewRoom = () => {
  const [info, setInfo] = useState({});
  const [hotelId, setHotelId] = useState(undefined);
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newFiles = selectedFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const { user } = useContext(AuthContext);
  const userid = user._id;
  const { data, loading, error } = useF(`/users/hotels/${userid}`);

  const handleclick = async (e) => {
    e.preventDefault();
  
    console.log("handleclick function is called");
  
    try {
      const list = await Promise.all(
        files.map(async (fileObj) => {
          const data = new FormData();
          data.append("file", fileObj.file);
          data.append("upload_preset", "upload");
          console.log("FormData:", data); // Vérifier le contenu de FormData
          const uploadResponse = await axios.post(
            "https://api.cloudinary.com/v1_1/dqycmx4a0/image/upload",
            data
          );
          const { url } = uploadResponse.data;
          const secureUrl = url.replace("http://", "https://");
          return secureUrl;
        })
      );
  
      console.log("List of URLs:", list); // Vérifier les URLs des images uploadées
  
      const newRoom = {
        ...info,
        photos: list,
      };
  
      console.log("New Room Data:", newRoom); // Vérifier les données de la nouvelle chambre
  
      await axiosinstance.post(`/rooms/${hotelId}`, newRoom);
      navigate("/rooms")
  
      console.log("Room successfully added!"); // Vérifier si la requête POST a été effectuée avec succès
    } catch (err) {
      console.log("Error:", err); // Gérer les erreurs en affichant les messages d'erreur
    }
  };

  useEffect(() => {
    if (data.length > 0) {
      setHotelId(data[0]._id);
    }
  }, [data]);

  const handleImageDelete = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="new">
      <div className="newContainer">
        <Header />
        <div className="top">
          <input
            type="file"
            id="file"
            multiple
            onChange={handleChange}
            style={{ display: "none" }}
          />
          <div className="images-container">
            {files.map((fileObj, index) => (
              <div key={index} style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
                <img
                  src={fileObj.url}
                  alt={`Image ${index + 1}`}
                  style={{ width: "70px", height: "70px", marginRight: "5px", cursor: "pointer" }}
                  onClick={() => handleImageDelete(index)}
                />
                <button onClick={() => handleImageDelete(index)}>Supprimer</button>
              </div>
            ))}
          </div>
        </div>
        <div className="bottom">
          <div className="right">
            <form>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlined className="icon" />
                </label>
              </div>
              {roomInputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    onChange={(e) => setInfo((prev) => ({ ...prev, [input.id]: e.target.value }))}
                    type={input.type}
                    placeholder={input.placeholder}
                    id={input.id}
                  />
                </div>
              ))}
              <div className="formInput">
                <label>Choose a hotel</label>
                <select
                  id="hotelId"
                  onChange={(e) => setHotelId(e.target.value)}
                >
                  {loading
                    ? "Loading"
                    : data &&
                      data.map((hotel) => (
                        <option key={hotel._id} value={hotel._id}>
                          {hotel.name}
                        </option>
                      ))}
                </select>
              </div>
              <button onClick={handleclick}>ajouter</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRoom;
