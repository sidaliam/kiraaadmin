import React from "react";
import Datatableconf from "../../components/datatable confirmation/Datatableconf";
import Header from "../../components/header/Header";


const Listeconf = ({columns}) => {
  return (
    <div className="list">
      
      <div className="listContainer">
        
        <Header/>
        <Datatableconf columns={columns} />
      </div>
    </div>
  );
};

export default Listeconf;
