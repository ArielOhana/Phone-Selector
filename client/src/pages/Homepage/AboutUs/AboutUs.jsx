import "./AboutUs.css"
import Logo from "../../../images/PhoneSelectorImage.png"
import { Typography } from "@mui/material"
function AboutUs() {
    return (
      <>
      <div id="about_us_container">
        <div id="about_us_content_container">
        <Typography
              variant="h2">
              <b>About us</b>
            </Typography>
            <br />
            <Typography
              variant="h5">
Introducing our revolutionary mobile application designed to revolutionize how you discover, evaluate, and select your next smartphone: Phone Selector!
            </Typography><br />
            <Typography
              variant="h5">
Phone Selector is your ultimate companion in the world of smartphones, offering comprehensive data and insightful ratings to help you make informed decisions. Say goodbye to endless hours of research and confusion – with Phone Selector, finding the perfect phone has never been easier.

</Typography><br />
            <Typography
              variant="h5">
Our app boasts an extensive database featuring the latest smartphones from all major brands. Whether you're interested in the newest flagship devices or budget-friendly options, Phone Selector has you covered. Simply browse through our intuitive interface to explore detailed specifications, user reviews, and expert ratings for each phone.            </Typography>
        </div>
        <div id="about_us_image_container">
          <img src={Logo} alt="" />
        </div>
      </div>
      </>
    )
  }
  
export default AboutUs
  