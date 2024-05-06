import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { userInputs } from "./formSource";
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/Authcontext";
import { Navigate } from "react-router-dom";
import { roomColumns, confirmationColumns } from "./datatablesource2";
import { HotelColumns, userColumns } from "./datatablesource";
import Newhotels from "./pages/new hotels/Newhotels";
import NewRoom from "./pages/new room/NewRoom";
import Listur from "./pages/list copy/Listur";
import Listeconf from "./pages/listconf/Listeconf";
import Stats from "./pages/stats/Stats";

function App() {
  const { darkMode } = useContext(DarkModeContext);
  const Protectedroute = ({ children }) => {
    const { user } = useContext(AuthContext);
    if (!user) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route
              index
              element={
                <Protectedroute>
                    <List columns={HotelColumns} />
                </Protectedroute>
              }
            />
            <Route path="login" element={<Login />} />
            <Route path="users">
              <Route
                index
                element={
                  <Protectedroute>
                    <Listur columns={userColumns} />
                  </Protectedroute>
                }
              />
              <Route
                path=":userId"
                element={
                  <Protectedroute>
                    <Single />
                  </Protectedroute>
                }
              />
              <Route
                path="new"
                element={
                  <Protectedroute>
                    <New inputs={userInputs} title="Add New User" />
                  </Protectedroute>
                }
              />
            </Route>
            <Route path="hotels">
              <Route
                index
                element={
                  <Protectedroute>
                    <List columns={HotelColumns} />
                  </Protectedroute>
                }
              />
              <Route
                path=":hotelid"
                element={
                  <Protectedroute>
                    <Single />
                  </Protectedroute>
                }
              />
              <Route
                path="new"
                element={
                  <Protectedroute>
                    <Newhotels />
                  </Protectedroute>
                }
              />
            </Route>
            <Route path="rooms">
              <Route
                index
                element={
                  <Protectedroute>
                    <Listur columns={roomColumns} />
                  </Protectedroute>
                }
              />
              <Route
                path=":roomid"
                element={
                  <Protectedroute>
                    <Single />
                  </Protectedroute>
                }
              />
              <Route
                path="new"
                element={
                  <Protectedroute>
                    <NewRoom />
                  </Protectedroute>
                }
              />
            </Route>
            <Route path="confirmations">
              <Route
                index
                element={
                  <Protectedroute>
                    <Listeconf columns={confirmationColumns} />
                  </Protectedroute>
                }
              />
              <Route
                path=":roomid"
                element={
                  <Protectedroute>
                    <Single />
                  </Protectedroute>
                }
              />
              <Route
                path="new"
                element={
                  <Protectedroute>
                    <NewRoom />
                  </Protectedroute>
                }
              />
            </Route>
            <Route path="statistique">
              <Route
                index
                element={
                  <Protectedroute>
                    <Stats/>
                  </Protectedroute>
                }
              />


            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
