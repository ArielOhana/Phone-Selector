import React, { useContext, useEffect, useState } from "react";
import Context from "../../Context";
import "./Phonepage.css";
import { useLocation, useNavigate } from "react-router-dom";
import RadarChart from "react-svg-radar-chart";
import "react-svg-radar-chart/build/css/index.css";
import { Button } from "@mui/material";

function Phonepage() {
    const navigate = useNavigate();
  const [receivedData, setReceivedData] = useState(null);
  const { getRequest,postRequest,user,setToastData } = useContext(Context);
  const location = useLocation();
  const { phoneData,verified} = location.state || {};
  useEffect(() => {
    if (phoneData && verified)
    {
        setReceivedData(phoneData)
    }
    else if (phoneData) {
      getAPI();
    }
  }, [phoneData]);

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
      setToastData({type:'error', content:`We got no further data on ${phoneData.name}`})
      navigate("/");
    }
  };

  useEffect(() => {
    if (receivedData) {
      buildRatingObject();
    }
  }, [receivedData]);

  const buildRatingObject = () => {
    let newObject = { data: {}, meta: { color: "green" } };

    if (receivedData?.rating) {
      for (const element of receivedData.rating) {
        newObject.data[element.category] = parseFloat(element.value /10) || 0;
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
  const validPhoneClick = async() => {
    const response = await postRequest("/phones/Addphone",receivedData);
    setToastData({content: response.data.content,type:response.data.type})
  }
  return (
    <>
      <div className="phonepage-header"></div>
      <div className="phonepage-main">
        <div className="phonepage-image-div">
          <img src={phoneData?.image} alt="" />
          {((user.isAdmin && !verified) && receivedData)&& ( <div className="phonepage-verify-div">
                <h2 className="phonepage-verify-text">Click on the button below to validate this phone data</h2>
                <Button variant="contained" color="success" size="large" onClick={validPhoneClick} sx={{ fontSize: "2rem" }}>
                        Valid
                    </Button>
          </div>)}
         
        </div>
        <div className="phonepage-details-div">
          <h1 className="phonepage-name">{phoneData?.name} {verified ? "✅" : ""}</h1>
          {receivedData &&
            receivedData.properties.map((element, index) => (
              <h2
                className="phonepage-details-text"
                key={index}
              >{`${element.category} : ${element.value}`}</h2>
            ))}
          {receivedData && (
            <RadarChart captions={captions} data={data} size={450} />
          )}
        </div>
      </div>
    </>
  );
}

export default Phonepage;
