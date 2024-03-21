import { Input, Typography } from '@mui/material';
import './Homepage.css';
import SearchIcon from '@mui/icons-material/Search';
import MovingLine from './MovingLineComponent/MovingLine';
import AboutUs from './AboutUs/AboutUs.jsx';
function Homepage() {
  return (
    <>
    <div className="main_homepage_div">
      <div className='above_main_homepage'>
      <Typography
              style={{
                color: "white",
              }}
              variant="h2">
              Phone selector
            </Typography>
            <Typography
              style={{
                color: "white",
              }}
              variant="h4">
              Search below for the phone you seek to review
            </Typography>
            </div>
            <div id='input_div'>
  <div style={{ position: 'relative' }}>
    <input
      type="text"
      style={{
        width: '100%',
        fontSize: '1.5rem',
        borderWidth: '1px',
        borderColor: 'rgba(255, 255, 255, 0.8)',
        padding: '8px 40px 8px 8px', 
        borderRadius: '4px',
        outline: 'none',
        boxSizing: 'border-box',
        background: 'rgba(255, 255, 255, 0.3)', 
        color:'white',
      }}
    />
    <SearchIcon
      style={{
        position: 'absolute',
        top: '50%',
        right: '8px',
        transform: 'translateY(-50%)',
        color: 'white',
        cursor:'pointer',
      }}
    />
  </div>
  </div>
</div>
<div className='moving_line_div'>
      <MovingLine/>
    </div>
    <div className='about_us_div'>
      <AboutUs/>
    </div>
   
    </>
  );
}

export default Homepage;
