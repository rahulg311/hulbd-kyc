import React from "react";
import { useNavigate } from "react-router-dom";
// import thankslogo from "../../Images/thankslogos.png";
import logo from "../assest/Images/logo@2x.png";
// import Celebration from "../Users/Celebration";

const Thanks = () => {
  const navigate = useNavigate();

  const onHandle = () => {
    sessionStorage.clear("token");
    navigate("/");
  };

  return (
<div className="vh-100 d-flex flex-column">
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand ms-3" href="/">
            <img src={logo} alt="Logo" height="30" />
          </a>
        </div>
      </nav>

      {/* Thank You Card */}
      <div className="container d-flex justify-content-center align-items-center flex-grow-1">
        <div className="card text-center shadow-lg p-4" style={{ maxWidth: "400px" }}>
          <div className="card-body">
            <h2 className="card-title text-dark">Thank You!</h2>
            <p className="text-muted">Your Kyc has been completed successfully.</p>
            <button
              className="btn btn-dark w-100 mt-3"
              type="button"
              onClick={onHandle}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Thanks;
