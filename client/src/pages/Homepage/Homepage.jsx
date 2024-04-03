import { Typography } from '@mui/material';
import './Homepage.css';
import SearchIcon from '@mui/icons-material/Search';
import MovingLine from './MovingLineComponent/MovingLine';
import AboutUs from './AboutUs/AboutUs.jsx';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import Context from '../../Context.jsx';
function Homepage() {
  const {setPhoneSearched} = useContext(Context)
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const onSubmit = (data) => {
    setPhoneSearched(data.phone);
    navigate('/Searchpage');
  };
  const handleIconClick = () => {
    handleSubmit(onSubmit)(); // Manually trigger form submission
  };

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
  <form onSubmit={handleSubmit(onSubmit)}>
    <input
     {...register("phone")} 
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
    onClick={handleIconClick}
      style={{
        position: 'absolute',
        top: '50%',
        right: '8px',
        transform: 'translateY(-50%)',
        color: 'white',
        cursor:'pointer',
      }}
    />
    </form>
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
