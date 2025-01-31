import "./App.css";
import { Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

// import Home from "./Pages/Home";

import Authentication from "./Pages/Authentication";
import { useState } from "react";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Thanks from "./Pages/Thanks";

function App() {

  const [token, setToken] = useState(sessionStorage.getItem("token"));


  return (
   

    <Routes>
      <Route path="/" element={<Login setToken={setToken} />} />
      <Route
        path="/home"
        element={
          <Authentication token={token}>
            <Home />
          </Authentication>
        }
      />
       <Route
        path="/Thanks"
        element={
          <Authentication token={token}>
            <Thanks />
          </Authentication>
        }
      />
    </Routes>
  );
}

export default App;
