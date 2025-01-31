import React, { useEffect, useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../assest/Images/logo@2x.png";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  let GetPayoutDetailspath = "https://api1.parinaam.in/api/KYCdetails/GetPayoutDetails";
  let UploadkycDatapath = "https://api1.parinaam.in/api/KYCdetails/UploadkycData";
  let userMoToken = sessionStorage.getItem("token");
  const [GetPayoutDetailsData, setGetPayoutDetailsData] = useState(""); 
  console.log("GetPayoutDetailsData", GetPayoutDetailsData);
  const [kycData, setKycData] = useState({
    Name: "",
    Mobileno: userMoToken,
    BankName: " ",
    AccountNumber: "",
    IFSCCode: "",
    CancelledCheckPhoto: "",
    CancelledCheckPhotoFile: "",
    PanNo: "",
    PanNoPhoto: "",
    PanNoPhotoFile: "",
    CreateBy: "",
  });
  console.log("kycData", kycData);
  useEffect(() => {
    GetPayoutDetailsApi();
  }, []);

  const GetPayoutDetailsApi = async () => {
    try {
      let data = { UserMobile: userMoToken };

      const res = await axios.post(GetPayoutDetailspath, data);
      // console.log("Response:", res?.data?.GetPayoutDetails);

      // Check if response contains the expected data structure
      if ( res?.data?.GetPayoutDetails?.length > 0 &&res?.data?.GetPayoutDetails[0].Status === 1) {
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
  //  async function uploadFile(file, filename, folderName) {
  //   console.log("id proof file name------ ", file, filename, folderName);
  //   try {
  //     console.log("uploadFile filename:", filename);

  //     const formData = new FormData();
  //     formData.append("filename", filename);
  //     formData.append("folderName", folderName);

  //     // Ensure file is not null or undefined
  //     if (!file) {
  //       console.error("File is required but not supplied.");
  //       return false;
  //     }

  //     formData.append("file", file);
  //     console.log("formData:", formData);

  //     return await axios({
  //       method: "post",
  //       // url: uploadFileBaeUrl + 'uploadFile',
  //       url: UploadkycDatapath,
  //       data: formData,
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     })
  //       .then((res) => {
  //         return res.status == 200;
  //       })
  //       .catch((err) => {
  //         console.log("err:", err);
  //         return false;
  //       });
  //   } catch (error) {
  //     // Handle errors
  //     console.error("Error uploading file:", error);
  //     return false;
  //   }
  // }

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   let data ={
  //      UserMobile:userMoToken,
  //      JsonData:kycData
  //   }

  //   try {
  //     if (kycData.GSTImageFile) {
  //       console.log("KYC----------", kycData?.GSTImage, kycData.GSTImageFile);
  //       // const uniq_filenameGSTImage = generateUniqueFilename(kycData?.GSTImage, UserPancardData, "GST" );
  //       let isFileUploadedGSTImage = await uploadFile(kycData?.GSTImageFile, uniq_filenameGSTImage,"RetailerKyc");
  //       // uniq_GSTImageFile = uniq_filenameGSTImage;
  //       if (!isFileUploadedGSTImage) {
  //         toast.error("Cannot upload GST Image File !");
  //         return;
  //       }
  //     } else {
  //       toast.error("please upload GST Image File");
  
  //       console.log("please upload GST Image File");
  //       return;
  //     }
  //     const res = await axios.post(UploadkycDatapath,data);

  //     // Check if response contains the expected data structure
  //     if (res?.data?.UploadkycData[0]?.Message === "Ok") {
  //       toast.success("Successfully Uploaded data!");
  //       setTimeout(() => {
  //         navigate("/Thanks");
  //       }, 1000);
        
  //       setKycData({
  //         Name: "",
  //         Mobileno: userMoToken,
  //         BankName: " ",
  //         AccountNumber: "",
  //         IFSCCode: "",
  //         CancelledCheckPhoto: "",
  //         CancelledCheckPhotoFile: "",
  //         PanNo: "",
  //         PanNoPhoto: "",
  //         PanNoPhotoFile: "",
  //         CreateBy: "",
  //       })
  //     } else {
  //       console.warn("No valid payout details found.");
  //     }
  //   } catch (error) {
  //     console.error("Error sumbit payout details:", error);

  //     if (error.response) {
  //       console.error("Server Error:", error.response.data);
  //     } else if (error.request) {
  //       console.error("Network Error: No response from server.");
  //     } else {
  //       console.error("Request Setup Error:", error.message);
  //     }
  //   }

  //   // console.log("kycData-----", kycData);
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // if (!kycData.CancelledCheckPhoto) {
    //   toast.error("Please upload Cancelled Cheque File");
    //   console.log("Please upload Cancelled Cheque File");
    //   return;
    // }
  
    try {
    
      //   // Upload the file first
      // let isFileUploadedGSTImage = await uploadFile(kycData.PanNoPhotoFile, kycData.PanNoPhoto,"hulKyc");
    
  
      // if (!isFileUploadedGSTImage) {
      //   toast.error("Cannot upload Cancelled Cheque File!");
      //   return;
      // }
  
      // After file upload, prepare data for API call
      let data = {
        UserMobile: userMoToken,
        JsonData: kycData,
      };
  
      // Make API call after successful file upload
      const res = await axios.post(UploadkycDatapath, data);
  
      if (res?.data?.UploadkycData?.[0]?.Message === "Ok") {
        toast.success("Successfully Uploaded data!");
  
        setTimeout(() => {
          navigate("/Thanks");
        }, 1000);
  
        // Reset form data
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
      } else {
        console.warn("No valid payout details found.");
      }
    } catch (error) {
      console.error("Error submitting payout details:", error);
  
      if (error.response) {
        console.error("Server Error:", error.response.data);
      } else if (error.request) {
        console.error("Network Error: No response from server.");
      } else {
        console.error("Request Setup Error:", error.message);
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

      <div className="container">
        <div className="form-container bg-white p-4 mt-4 rounded shadow mx-auto">
          <h4 className="fw-bold">Bank Details</h4>
          <p>
            <strong>Attendance:</strong> {GetPayoutDetailsData?.TotalWorkedDays}{" "}
            days
          </p>
          <p>
            <strong>Payment:</strong> ₹{GetPayoutDetailsData?.TotalPayout}
          </p>
          {
            GetPayoutDetailsData.Status==1  ?
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
              required
                type="text"
                className="form-control"
                placeholder="Enter your Bank"
                value={kycData.BankName}
                onChange={(e) =>
                  setKycData({ ...kycData, BankName: e.target.value })
                }
             
              />
            </div>
            <div className="mb-3">
              <label className="form-label">
                Account Number <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter your Account Number"
                value={kycData.AccountNumber}
                onChange={(e) =>
                  setKycData({ ...kycData, AccountNumber: e.target.value })
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
              <label className="form-label">Cancelled Cheque Photo </label>
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
                // minlength="8"
                //     maxlength="10"
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
          : ""}
        </div>
      </div>
    </>
  );
};

export default Home;
