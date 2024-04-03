import React, { useContext, useEffect } from 'react';
import { CssBaseline, Modal } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Bounce, Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Context from '../../Context.jsx';
import Navbar from '../Navbar/Navbar.jsx';
import Footer from './Footer/Footer.jsx';
import SignUp from '../SignUp/SignUp.jsx';
function Layout() {
  const Data = useContext(Context);
 
useEffect(() => {
  if(Data?.toastData?.type =="success")
  {
  toast.success(Data?.toastData?.content, {
    position: "top-center",
    autoClose: 2400,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Slide,
    });
    Data.setToastData({})
  }
  if(Data?.toastData?.type =="info")
  {
  toast.info(Data?.toastData?.content, {
    position: "top-center",
    autoClose: 2400,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Slide,
    });
    Data.setToastData({})
  }
    if(Data?.toastData?.type == "error")
    {
      toast.error(Data?.toastData?.content, {
        position: "top-center",
        autoClose: 2400,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide,
        });
        Data.setToastData({})
    }
    
},[Data?.toastData]);

  
const themeOptions = {
  palette: {
    type: 'light',
    primary: {
      main: '#26a826',
    },
    secondary: {
      main: '#2222ff',
    },
    white:
    {
      main: '#fff',
    },
    gray:
    {
      main: '#313335',
    },
    lightBlue:
    {
      main:'#54AAFF',
    },
    whatsappgreen:
    {
      main:'#44FF44',
    },
    background: {
      default: '#ffffff',
      paper: '#d4d4d4',
    },
    error: {
      main: '#ff0e00',
    },
    warning: {
      main: '#edff00',
    },
    info: {
      main: '#f900ff',
    },
    success: {
      main: '#00ff09',
    },
    text: {
      primary: '#000000',
      secondary: '#fff',
    },
  },
};

  const theme = createTheme(themeOptions);



  
 

  return (
    <div style={{ backgroundColor: theme.palette.background.default }}>

      <ThemeProvider theme={theme}>   
      <ToastContainer/>
        <Navbar/>
        <Outlet />
        <Footer/>
      </ThemeProvider>
    </div>
  );
}

export default Layout;
