import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState } from "react";
import useF from "../../Hooks/useF";
import { useEffect } from "react";
import axios from "axios"
import {useLocation} from "react-router-dom"
import { useContext } from "react";
import { AuthContext } from "../../context/Authcontext";

const Datatable = ({columns}) => {
  const location=useLocation()
  const path=location.pathname.split("/")[1]
  const [list, setlist] = useState([]);
  const { user} = useContext(AuthContext);
  const userid = user._id

  const handleDelete = async (id) => {
    
    try{
      await axios.delete(`/${path}/${id}`)
      setlist(list.filter((item) => item._id !== id));

    }
    catch{

    }
  };
  const { data, loading, error } = useF(`/users/hotels/${userid}`);
  useEffect(()=>{
    setlist(data)
  },[data])


  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to="/users/test" style={{ textDecoration: "none" }}>
              <div className="viewButton">View</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row._id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];
  return (
    <div className="datatable">
      <div className="datatableTitle">
         {path}
        <Link to={`/${path}/new`} className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={list}
        columns={columns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
        getRowId={(row) => row._id}
      />
    </div>
  );
};

export default Datatable;
