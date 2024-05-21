import "./propertyList.css";
import useF from "../../Hooks/useF";
const PropertyList = () => {
  const { data, error, loading } = useF("/hotels/Countbytypes");
  const images = [
    "https://images.pexels.com/photos/1388069/pexels-photo-1388069.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/3422964/pexels-photo-3422964.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/1519192/pexels-photo-1519192.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/3089389/pexels-photo-3089389.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/3509411/pexels-photo-3509411.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  ];
  return (
    <div className="pList">
      {loading ? (
        "chargement..."
      ) : (
        <>
          {data &&
            data.map((item,i) => (
              <div className="pListItem" key={item.id}>
                <img
                  src={images[i]}
                  alt=""
                  className="pListImg"
                />
                <div className="pListTitles">
                  <h1>{item.count}</h1>
                </div>
              </div>
            ))}
        </>
      )}
    </div>
  );
};

export default PropertyList;
