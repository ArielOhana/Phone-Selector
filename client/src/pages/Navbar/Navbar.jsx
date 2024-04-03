import React, { useEffect, useState } from "react";
import "./Navbar.css";
import Context from "../../Context.jsx";
import { useContext } from "react";
import Logo from "../../images/PhoneSelectorImage.png";
import BlackLogo from "../../images/BlackPhoneSelectorImage.png";
import { Button, Modal, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";


function Navbar() {
  const { userLogged, user} = useContext(Context);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll); // for the unmount
    };
  }, []);

  const NavigateTo = (destination) => {
    navigate(destination);
  };

  return (
    <>
   
      <div className={`main_navbar_div ${scrolled && "colored-background"}`}>
        <div className="logo_div" onClick={() => NavigateTo("")}>
          <img src={scrolled ? BlackLogo : Logo} alt="logo" />
        </div>
        {!userLogged ? (<><div className="links">
          <Button
            variant={scrolled ? "contained" : "outlined"}
            color="secondary"
            onClick={() => NavigateTo("SignIn")}
          >
            Sign In
          </Button>
          <Button
            variant={scrolled ? "contained" : "outlined"}
            color="info"
            onClick={() => NavigateTo("SignUp")}
          >
            Sign Up
          </Button>
        </div>
    </>) : (<>
      <Typography
              style={{
                color: "white",
                marginRight:'30px',
              }}
              variant="h4">
              {`Hello, ${user.username}!`}
            </Typography>
    </>)}
        
      </div>
      
    </>
  );
}

export default Navbar;
