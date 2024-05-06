import "./list.scss"
import Datatable2 from "../../components/datatable room/Datatable2"
import Header from "../../components/header/Header";


const Listur = ({columns}) => {
  return (
    <div className="list">
    
      <div className="listContainer">
        
        <Header/>
        <Datatable2 columns={columns}/>
      </div>
    </div>
  )
}

export default Listur