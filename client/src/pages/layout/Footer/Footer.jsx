import "./Footer.css"
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { IconButton, Typography } from "@mui/material";
function Footer() {
    return (
      <>
       <div className='footer_main_div'><div>
            <Typography
            style={{color:"white"}}
              variant="h5">
 2024 Phone Selector | All right reserved ©</Typography>
            </div>
            <div className="footer_icons" >
                <a href="https://www.linkedin.com/in/ariel-ohana-15b7702b9?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank">
            <IconButton sx={{ fontSize:40, padding: '0' }}>
            <div style={{display:"flex", flexDirection:'column',alignItems:"center"}}>  <LinkedInIcon fontSize='large' color="lightBlue"/> <span style={{fontSize:12,margin:0, color:'white'}}>LinkedIn</span></div>
            </IconButton>
            </a>
            <a href="https://github.com/ArielOhana" target="_blank">
            <IconButton sx={{ fontSize:40, padding: '0' }}>
            <div style={{display:"flex", flexDirection:'column',alignItems:"center"}}>  <GitHubIcon fontSize='large' color="gray"/> <span style={{fontSize:12,margin:0, color:'white'}}>GitHub</span></div>
            </IconButton>
            </a>
            <a href="whatsapp://send?abid=+9720502337666&text=Hello%21%20I%20got%20redirected%20from%20Phone%20Selector%21" target="_blank">
  <IconButton sx={{ fontSize: 40, padding: '0' }}>
    <div style={{ display: "flex", flexDirection: 'column', alignItems: "center" }}>
      <WhatsAppIcon fontSize='large' color="whatsappgreen"/>
      <span style={{ fontSize: 12, margin: 0, color: 'white' }}>WhatsApp</span>
    </div>
  </IconButton>
</a>
            </div>
            </div>
            </>
    )
  }
  
export default Footer
  