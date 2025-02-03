import React, { useState } from "react";
import logo from "../assest/Images/emami2.png";
import logo1 from "../assest/Images/emami1.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import logos from "../assest/Images/logo@2x.png";

const LoginPage = ({ setToken }) => {
  const optpath =
    "https://api1.parinaam.in/api/StopMalaria/CheckMobileNoAndSendOTP";
  const optVerifypath =
    " https://api1.parinaam.in/api/StopMalaria/otpauthentication";
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(mobileNumber)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    const data = { UserMobile: mobileNumber };

    try {
      const res = await axios.post(optpath, data);

      if (res?.data?.CheckMobileNoAndSendOTP?.[0]?.Messages ==="OTP sent successfully") {
        toast.success("OTP sent successfully");
        console.log("OTP:", res.data.CheckMobileNoAndSendOTP[0].OTP); // Log OTP for testing (remove in production)
        setShowOtp(true); // Show OTP input field
      } else {
        toast.error(res?.data?.CheckMobileNoAndSendOTP?.[0]?.Messages);
        console.log("error",res?.data?.CheckMobileNoAndSendOTP?.[0]?.Messages)
        // alert("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);

      if (error.response) {
        alert(error.response.data?.message || "Server responded with an error");
      } else if (error.request) {
        alert(
          "No response received from server. Please check your internet connection."
        );
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(otp)) {
      toast.error("Please enter a valid 6-digit OTP!");
      return;
    }

    const data = { UserMobile: mobileNumber, otp: otp };
    console.log("UserMobile: mobileNumber, otp: otp", mobileNumber, otp);

    try {
      const res = await axios.post(optVerifypath, data);

      if (res?.data?.otpauthentication?.[0]?.Message === "OTP is matched") {
        toast.success("OTP verified successfully!");
        sessionStorage.setItem("token", mobileNumber);

        setToken(otp); // Store token (you may replace it with actual token)
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } else {
        toast.error("OTP does not match. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);

      if (error.response) {
        toast.error(
          error.response.data?.message || "Server responded with an error"
        );
      } else if (error.request) {
        toast.error(
          "No response received from the server. Please check your internet connection."
        );
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="vh-100">
      <nav className="navbar navbar-dark bg-dark">
        <div className="containe">
          <a className="navbar-brand ms-3" href="">
            <img src={logos} alt="Logo" height="30" />
          </a>
        </div>
      </nav>
      <div className="App backgroundlogin vh-90 d-flex align-items-center justify-content-center bg_b">
        <ToastContainer />
        {/* <h6 className="bold mb-4 d-flex justify-content-right">Bank Details</h6> */}
        <div
          className="card p-4 shadow-sm mobileSize text-cente1r rounded-3"
          style={{ maxWidth: "400px", width: "100%" }}
        >
          {/* Logo Section */}
          {/* <div className="mb-4 d-flex justify-content-center align-items-center">
          <img
            src={logo1}
            alt="Logo 1"
            className="img-fluid"
            style={{ maxHeight: "80px", width: "auto" }}
          />
          <img
            src={logo}
            alt="Logo 2"
            className="img-fluid ms-3"
            style={{ maxHeight: "60px", width: "auto" }}
          />
        </div> */}

          {!showOtp ? (
            // Mobile Login Form

            <form onSubmit={handleLogin}>
              {/* <h5 className="mb-4">Login with Mobile Number</h5> */}
              <h6 className="bold mb-4 d-flex justify-content-right">
                Fill all given fields
              </h6>
              <div className="mb-3">
                <label className="bold mb-1 d-flex justify-content-right">
                  Phone Number
                </label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter Number"
                  value={mobileNumber}
                  required
                  onChange={(e) => setMobileNumber(e.target.value)}
                />
              </div>
              <button className="btn btn-dark w-100" type="submit">
                Send OTP
              </button>
            </form>
          ) : (
            // OTP Verification Form
            <form onSubmit={handleVerifyOtp}>
              {/* <p className="mb-4">Enter OTP sent to {mobileNumber}</p> */}
              <h6 className="bold mb-4 d-flex justify-content-right">
                Fill all given feild
              </h6>

              <label className=" disabled bold mb-1 d-flex justify-content-right">
                Phone Number
              </label>
              <p className=" mb-1 text-gray d-flex justify-content-right">
                {" "}
                {mobileNumber}
              </p>

              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter OTP"
                  value={otp}
                  required
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <button className="btn btn-dark w-100" type="submit">
                Verify OTP
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
