import "./list.scss"
import Datatable from "../../components/datatable/Datatable"
import Header from "../../components/header/Header";


const List = ({columns}) => {
  return (
    <div className="list">
      
      <div className="listContainer">
        
        <Header/>
        <Datatable columns={columns}/>
      </div>
    </div>
  )
}

export default List