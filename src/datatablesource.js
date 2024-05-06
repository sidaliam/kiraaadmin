export const userColumns = [
  { field: "id", headerName: "ID", width: 70 },
  {
    field: "user",
    headerName: "User",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img className="cellImg" src={params.row.img || "https://i.ibb.co/MBtjqXQ/no-avatar.gif"} alt="avatar" />
          {params.row.username}
        </div>
      );
    },
  },
  {
    field: "country",
    headerName: "Country",
    width: 230,
  },

  {
    field: "city",
    headerName: "City",
    width: 100,
  },
  {
    field: "phone",
    headerName: "Phone",
    width: 100,
  }
];
export const HotelColumns = [
  
  {
    field: "name",
    headerName: "nom de l'agence",
    width: 250,
  },

 
  {
    field: "city",
    headerName: "ville",
    width: 100,
  },
  {
    field: "address",
    headerName: "address",
    width: 200,
  },
 
  {
    field: "cheapestPrice",
    headerName: "telephone",
    width: 150,

  },
  

  {
    field: "description",
    headerName: "livraison",
    width: 150,

  },
  { field: "_id", headerName: "ID", width: 270 },
];

