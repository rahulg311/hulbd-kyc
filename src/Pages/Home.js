import React, { useEffect, useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../assest/Images/logo@2x.png";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const Home = () => {
  const navigate = useNavigate();
  let GetPayoutDetailspath =
    "https://api1.parinaam.in/api/KYCdetails/GetPayoutDetails";
  let UploadkycDatapath =
    "https://api1.parinaam.in/api/KYCdetails/UploadkycData";
  let uploadFileName = "https://api3.parinaam.in/api/upload";
  let userMoToken = sessionStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [GetPayoutDetailsData, setGetPayoutDetailsData] = useState("");
  // console.log("GetPayoutDetailsData----", GetPayoutDetailsData);
  const [kycData, setKycData] = useState({
    Name: "",
    Mobileno: userMoToken,
    BankName: "",
    AccountNumber: "",
    IFSCCode: "",
    CancelledCheckPhoto: "",
    CancelledCheckPhotoFile: "",
    PanNo: "",
    PanNoPhoto: "",
    PanNoPhotoFile: "",
    CreateBy: "",
  });
  // console.log("kycData", kycData);
  useEffect(() => {
    GetPayoutDetailsApi();
  }, []);

  const GetPayoutDetailsApi = async () => {
    try {
      let data = { UserMobile: userMoToken };

      const res = await axios.post(GetPayoutDetailspath, data);
      // console.log("Response:", res?.data?.GetPayoutDetails);

      // Check if response contains the expected data structure
      if (res?.data?.GetPayoutDetails?.length > 0) {
        // console.log("Response:", res?.data?.GetPayoutDetails[0]);
        setGetPayoutDetailsData(res.data?.GetPayoutDetails[0]);
      } else {
        console.warn("No valid payout details found.");
      }
    } catch (error) {
      console.error("Error fetching payout details:", error);

      if (error.response) {
        console.error("Server Error:", error.response.data);
      } else if (error.request) {
        console.error("Network Error: No response from server.");
      } else {
        console.error("Request Setup Error:", error.message);
      }
    }
  };

  //  upload file
  async function uploadFile(file, filename) {
    // console.log("id proof file name------ ", file, filename);
    try {
      console.log("uploadFile filename:", filename);

      const formData = new FormData();
      formData.append("filename", filename);
      formData.append("folderName", "");

      // Ensure file is not null or undefined
      if (!file) {
        console.error("File is required but not supplied.");
        return false;
      }

      formData.append("file", file);
      console.log("formData:", formData);

      return await axios({
        method: "post",
        // url: uploadFileBaeUrl + 'uploadFile',
        url: uploadFileName,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          return res.status == 200;
        })
        .catch((err) => {
          console.log("err:", err);
          return false;
        });
    } catch (error) {
      // Handle errors
      console.error("Error uploading file:", error);
      return false;
    }
  }

  const generateUniqueFilename = (fileName, mobileNo, keyName, PanCards) => {
    if (!fileName || PanCards === "" || PanCards === null) {
      toast.error("pancard & filename is empty");
      return;
    }
    let currentDate = moment().format("DDMMYYYY");
    let fileParts = fileName.split(".");
    let ext = fileParts.length > 0 ? fileParts[fileParts.length - 1] : "";
    const uniqFilename = `${mobileNo}_${keyName}_${currentDate}.${ext}`;
    return uniqFilename;
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    if (!kycData.CancelledCheckPhoto) {
      toast.error("Please upload Cancelled Cheque File");
      setLoading(false);
      console.error("Error: No Cancelled Cheque File provided.");
      return;
    }

    try {
      // Generate unique filenames for uploads
      const uniq_filenamePanImage = generateUniqueFilename(
        kycData.PanNoPhoto,
        userMoToken,
        "PAN",
        kycData.PanNo
      );
      const uniq_filenameCHQImage = generateUniqueFilename(
        kycData.CancelledCheckPhoto,
        userMoToken,
        "CHQ",
        kycData.PanNo
      );
      const isFileUploadedPANImage = await uploadFile(
        kycData.PanNoPhotoFile,
        uniq_filenamePanImage
      );
      const isFileUploadedCancelledCheckPhoto = await uploadFile(
        kycData.CancelledCheckPhotoFile,
        uniq_filenameCHQImage
      );
      if (!isFileUploadedPANImage) {
        toast.error("Failed to upload PAN Card file. Please try again.");
        setLoading(false);
        console.error("File Upload Error: PAN Card upload failed.");
        return;
      }

      if (!isFileUploadedCancelledCheckPhoto) {
        toast.error("Failed to upload Cancelled Cheque file. Please try again.");
        console.error("File Upload Error: Cancelled Cheque upload failed.");
        setLoading(false);
        return;
      }

      // Update kycData with uploaded filenames
      const newkycData = {
        ...kycData,
        PanNoPhoto: uniq_filenamePanImage,
        CancelledCheckPhoto: uniq_filenameCHQImage,
      };
      // Prepare API payload
      const data = {
        UserMobile: userMoToken,
        JsonData: newkycData,
      };

      // console.log("Submitting KYC data:", data);

      // API call to upload KYC data
      const res = await axios.post(UploadkycDatapath, data);

      // Handle API response
      if (res?.data?.UploadkycData?.[0]?.Message ==="Kyc Details uploaded successfully") {
        toast.success(res?.data?.UploadkycData?.[0]?.Message);

        setTimeout(() => {
          setLoading(false);
          navigate("/Thanks");
        }, 1000);

        // Reset form fields after successful submission
        setKycData({
          Name: "",
          Mobileno: userMoToken,
          BankName: "",
          AccountNumber: "",
          IFSCCode: "",
          CancelledCheckPhoto: "",
          CancelledCheckPhotoFile: "",
          PanNo: "",
          PanNoPhoto: "",
          PanNoPhotoFile: "",
          CreateBy: "",
        });
      } else if (res?.data?.UploadkycData?.[0]?.Message == "Kyc data has already uploaded for this mobile number") {
        toast.error("Kyc data has already uploaded for this mobile number.");
        setLoading(false);
      } else {
        console.warn("API Response Error: No valid payout details found.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error submitting payout details:", error);

      if (error.response) {
        toast.error(
          `Server Error: ${
            error.response.data?.message || "An error occurred."
          }`
        );
        console.error("Server Response Error:", error.response.data);
      } else if (error.request) {
        toast.error(
          "Network Error: No response from server. Check your connection."
        );
        console.error("Network Error: No response received.");
      } else {
        toast.error("Unexpected Error: Please try again.");
        console.error("Unexpected Request Error:", error.message);
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <nav className="navbar navbar-dark bg-dark">
        <div className="containe">
          <a className="navbar-brand ms-3" href="/">
            <img src={logo} alt="Logo" height="30" />
          </a>
        </div>
      </nav>

      {loading ? (
        <div className="d-flex flex-column align-items-center justify-content-center vh-90 bg-light">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 fw-bold text-primary">Loading...</p>
        </div>
      ) : (
        <div className="container">
          {GetPayoutDetailsData.Status !== 3 ? (
            <div className="form-container bg-white p-4 mt-4 rounded shadow mx-auto">
              <h4 className="fw-bold">Bank Details</h4>
              <p>
                <strong>Attendance:</strong>{" "}
                {GetPayoutDetailsData?.TotalWorkedDays} days
              </p>
              <p>
                <strong>Payment:</strong> ₹{GetPayoutDetailsData?.TotalPayout}
              </p>
              <hr className="mt-5"/>
              {GetPayoutDetailsData.Status == 1 ? <div className="text-center text-success fw-bold mt-5 mb-5 rounded py-4">
                  ✅ KYC Data Already Uploaded 
                </div> :""}
              
              {GetPayoutDetailsData.Status == 2 ? (
                <form onSubmit={handleSubmit}>
                  {/* Name Field */}
                  <div className="mb-3">
                    <label className="form-label">
                      Name of user as per Bank Records
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your name"
                      value={kycData.Name}
                      onChange={(e) =>
                        setKycData({ ...kycData, Name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      Name of Bank<span className="text-danger">*</span>
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your name"
                      value={kycData.BankName}
                      onChange={(e) =>
                        setKycData({ ...kycData, BankName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Account Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      minlength="8"
                      maxlength="10"
                      className="form-control"
                      placeholder="Enter your Account Number"
                      value={kycData.AccountNumber}
                      onChange={(e) =>
                        setKycData({
                          ...kycData,
                          AccountNumber: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      IFSC Code <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your IFSC Code"
                      value={kycData.IFSCCode}
                      onChange={(e) =>
                        setKycData({ ...kycData, IFSCCode: e.target.value })
                      }
                      required
                    />
                  </div>

                  {/* Bank Selection */}
                  {/* <div className="mb-3">
            <label className="form-label"> Name of Bank <span className="text-danger">*</span></label>
            <select className="form-select" value={bank} onChange={(e) => setBank(e.target.value)} required>
              <option value="" disabled>--- Select option ---</option>
              <option value="SBI">State Bank of India</option>
              <option value="HDFC">HDFC Bank</option>
              <option value="ICICI">ICICI Bank</option>
              <option value="AXIS">Axis Bank</option>
            </select>
          </div> */}

                  {/* Upload Cancelled Cheque */}
                  <div className="mb-3">
                    <label className="form-label">
                      Cancelled cheque to "Cancelled Cheque/ Passbook / Screen
                      Shot of Bank App with account number and name showing{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => {
                        let file = e.target.files[0];
                        setKycData({
                          ...kycData,
                          CancelledCheckPhoto: file.name,
                          CancelledCheckPhotoFile: file,
                        });
                      }}
                      required
                    />
                  </div>

                  {/* PAN Card Number */}
                  <div className="mb-3">
                    <label className="form-label">
                      PAN Card <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      minlength="8"
                      maxlength="10"
                      //     title="Either 0 OR (10 chars minimum PanNumber)"
                      //     pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                      className="form-control"
                      placeholder="Enter PAN card number"
                      value={kycData.PanNo}
                      onChange={(e) =>
                        setKycData({ ...kycData, PanNo: e.target.value })
                      }
                      required
                    />
                  </div>

                  {/* Upload PAN Card */}
                  <div className="mb-3">
                    <label className="form-label">
                      PAN Card Photo <span className="text-danger">*</span>
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => {
                        console.log("file---", e.target.files);
                        let file = e.target.files[0];

                        setKycData({
                          ...kycData,
                          PanNoPhoto: file.name,
                          PanNoPhotoFile: file,
                        });
                      }}
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button type="submit" className="btn btn-dark w-100">
                    Submit
                  </button>
                </form>
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}
        </div>
      )}
    </>
  );
};

export default Home;
