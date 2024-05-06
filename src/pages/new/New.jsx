import "./new.scss";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import axios from "axios";
import Header from "../../components/header/Header";
import { axiosinstance } from "../../config";

const New = ({ inputs, title }) => {
  const [file, setFile] = useState("");
  const [info,setinfo]=useState({})
  const handlechange=(e)=>{
    setinfo(prev=>({...prev,[e.target.id]:e.target.value}))
    

  }
  const handleclick= async (e)=>{
    e.preventDefault()
    const data= new FormData()
    data.append("file",file)
    data.append("upload_preset","upload")
    try{
      const uploadResponse= await axios.post("https://api.cloudinary.com/v1_1/dqycmx4a0/image/upload",data)
      const {url}=uploadResponse.data
      const newUser={
        ...info,
        img:url,
      }
      await axiosinstance.post("/auth/register",newUser)


    }
    catch(err){
      console.log(err)
      

    }
  }
  return (
    <div className="new">
     
      <div className="newContainer">
      <Header/>
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>

              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input onChange={handlechange} type={input.type} placeholder={input.placeholder} id={input.id} />
                </div>
              ))}
              <button onClick={handleclick}>Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;
