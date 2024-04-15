import React, { useContext, useEffect, useState } from "react";
import Context from "../../Context";
import "./Phonepage.css";
import { useLocation, useNavigate } from "react-router-dom";
import RadarChart from "react-svg-radar-chart";
import "react-svg-radar-chart/build/css/index.css";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";

function Phonepage() {
  const navigate = useNavigate();
  const [receivedData, setReceivedData] = useState(null);
  const { getRequest, postRequest, user, setToastData } = useContext(Context);
  const location = useLocation();
  const { phoneData, isverified } = location.state || {};
  const [verified, setVerified] = useState(isverified);
  const [editData, setEditData] = useState(false);

  useEffect(() => {
    if (phoneData && verified) {
      setReceivedData(phoneData);
    } else if (phoneData) {
      getAPI();
    }
  }, [phoneData]);

  useEffect(() => {
    if (receivedData) {
      buildRatingObject();
    }
  }, [receivedData]);

  const getAPI = async () => {
    try {
      const response = await getRequest(
        `/phones/getPhonesDetailsByURL/${phoneData.url}`
      );
      response.data.name = phoneData.name;
      response.data.url = phoneData.url;
      response.data.image = phoneData.image;
      setReceivedData(response.data);
    } catch (error) {
      console.error("Error fetching API data:", error);
      setToastData({
        type: "error",
        content: `We got no further data on ${phoneData.name}`,
      });
      navigate("/");
    }
  };
  const SaveEdit = async () => {
    try {
      const response = await postRequest("/phones/updatePhone", receivedData);
      console.log(response)
      setToastData({ type: response.data.type, content: response.data.content });
    } catch (error) {
      setToastData({
        type: "error",
        content: `We couldn't save ${phoneData.name}`,
      });
    }
  };

  const buildRatingObject = () => {
    let newObject = { data: {}, meta: { color: "green" } };

    if (receivedData?.rating) {
      for (const element of receivedData.rating) {
        newObject.data[element.category] = parseFloat(element.value / 10) || 0;
      }
    }
    return newObject;
  };

  const buildCaptionObject = () => {
    let newObject = {};
    if (receivedData?.rating) {
      for (const element of receivedData.rating) {
        newObject[element.category] = element.category;
      }
    }
    return newObject;
  };

  const data = [buildRatingObject()];
  const captions = buildCaptionObject();

  const validPhoneClick = async () => {
    const response = await postRequest("/phones/Addphone", receivedData);
    setToastData({ content: response.data.content, type: response.data.type });
    if (response.data.type === "success" || response.data.type === "info")
      setVerified(true);
  };

  const handleCategoryChange = (e, index) => {
    const updatedProperties = [...receivedData.properties];
    updatedProperties[index].category = e.target.value;
    setReceivedData((prevData) => ({
      ...prevData,
      properties: updatedProperties,
    }));
  };

  const handleValueChange = (e, index) => {
    const updatedProperties = [...receivedData.properties];
    updatedProperties[index].value = e.target.value;
    setReceivedData((prevData) => ({
      ...prevData,
      properties: updatedProperties,
    }));
  };
  const handleCategoryChangeOfRating = (e, index) => {
    const updatedrating = [...receivedData.rating];
    updatedrating[index].category = e.target.value;
    setReceivedData((prevData) => ({
      ...prevData,
      rating: updatedrating,
    }));
  };

  const handleValueChangeOfRating = (e, index) => {
    const updatedrating = [...receivedData.rating];
    updatedrating[index].value = e.target.value;
    setReceivedData((prevData) => ({
      ...prevData,
      rating: updatedrating,
    }));
  };

  return (
    <>
      <div className="phonepage-header"></div>
      <div className="phonepage-main">
        <div className="phonepage-image-div">
          <img src={phoneData?.image} alt="" />
          {user.isAdmin && receivedData && (
            <div className="phonepage-verify-div">
              <h2 className="phonepage-verify-text">
                Click on the button below to {verified ? "edit" : "verify"}{" "}
                phone data
              </h2>
              <Button
                variant="contained"
                color={verified ? "info" : "success"}
                size="large"
                onClick={
                  verified
                    ? () => setEditData((prev) => !prev)
                    : validPhoneClick
                }
                sx={{ fontSize: "2rem" }}
              >
                {verified ? "Edit" : "Valid"}
              </Button>
            </div>
          )}
        </div>
        <div className="phonepage-details-div">
          <h1 className="phonepage-name">
            {phoneData?.name} {verified ? "✅" : ""}
          </h1>
          {receivedData &&
            !editData &&
            receivedData.properties.map((element, index) => (
              <h2
                className="phonepage-details-text"
                key={index}
              >{`${element.category} : ${element.value}`}</h2>
            ))}
          {receivedData && !editData && (
            <RadarChart captions={captions} data={data} size={450} />
          )}
          {receivedData && editData && (
            <div>
              {receivedData.properties.map((element, index) => (
                <div key={index} className="edit-input-container">
                  <TextField
                    id={`category-${index}`}
                    label="Category"
                    defaultValue={element.category}
                    color="info"
                    variant="outlined"
                    onChange={(e) => handleCategoryChange(e, index)}
                    InputLabelProps={{
                      style: {
                        color: "#f900ff",
                      },
                    }}
                  />
                  <TextField
                    id={`value-${index}`}
                    label="Value"
                    defaultValue={element.value}
                    color="info"
                    variant="outlined"
                    onChange={(e) => handleValueChange(e, index)}
                    InputLabelProps={{
                      style: {
                        color: "#f900ff",
                      },
                    }}
                  />
                </div>
              ))}
              <div className="edit-input-container">
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  onClick={() => {
                    const updatedProperties = [...receivedData.properties];
                    updatedProperties.push({ category: "", value: "" });
                    setReceivedData((prevData) => ({
                      ...prevData,
                      properties: updatedProperties,
                    }));
                  }}
                  sx={{ fontSize: "1.2rem" }}
                >
                  Add
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="large"
                  onClick={() => {
                    const updatedProperties = [...receivedData.properties];
                    updatedProperties.pop();
                    setReceivedData((prevData) => ({
                      ...prevData,
                      properties: updatedProperties,
                    }));
                  }}
                  sx={{ fontSize: "1.2rem" }}
                >
                  Remove
                </Button>
              </div>
              {receivedData.rating.map((element, index) => (
                <div key={index} className="edit-input-container">
                  <TextField
                    id={`category-${index}`}
                    label="Category"
                    defaultValue={element.category}
                    color="success"
                    variant="outlined"
                    onChange={(e) => handleCategoryChangeOfRating(e, index)}
                    InputLabelProps={{
                      style: {
                        color: "#26a826",
                      },
                    }}
                  />
                  <TextField
                    id={`value-${index}`}
                    label="Value"
                    defaultValue={element.value}
                    color="success"
                    variant="outlined"
                    onChange={(e) => handleValueChangeOfRating(e, index)}
                    InputLabelProps={{
                      style: {
                        color: "#26a826",
                      },
                    }}
                  />
                </div>
              ))}
              <div className="edit-input-container">
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  onClick={() => {
                    const updatedrating = [...receivedData.rating];
                    updatedrating.push({ category: "", value: "" });
                    setReceivedData((prevData) => ({
                      ...prevData,
                      rating: updatedrating,
                    }));
                  }}
                  sx={{ fontSize: "1.2rem" }}
                >
                  Add
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="large"
                  onClick={() => {
                    const updatedrating = [...receivedData.rating];
                    updatedrating.pop();
                    setReceivedData((prevData) => ({
                      ...prevData,
                      rating: updatedrating,
                    }));
                  }}
                  sx={{ fontSize: "1.2rem" }}
                >
                  Remove
                </Button>
              </div>
              <div className="edit-input-container">
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={SaveEdit}
                  sx={{ fontSize: "1.2rem" }}
                >
                  Save
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Phonepage;
