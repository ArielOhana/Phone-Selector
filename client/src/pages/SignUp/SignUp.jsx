import { useContext, useRef, useState } from 'react';
import { Box, Button, TextField, Typography } from "@mui/material";
import "./SignUp.css";
import Context from '../../Context';
import { useNavigate } from 'react-router-dom';

function SignUp() {
    const { setActiveUser, postRequest, setToastData } = useContext(Context);
    const UsernameRef = useRef(null);
    const PasswordRef = useRef(null);
    const EmailRef = useRef(null);
    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const navigate = useNavigate();
    const NavigateTo = (destination) => {
        navigate(destination);
      };
    const handleSignUp = async () => {
        const username = UsernameRef.current.value;
        const password = PasswordRef.current.value;
        const email = EmailRef.current.value.toLowerCase(); // setting lowercase to avoid duplications
        let valid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError(true);
            valid = false;
        } else {
            setEmailError(false);
        }

        const passwordRegex = /^(?=.*[A-Z]).{8,}$/;
        if (!passwordRegex.test(password)) {
            setPasswordError(true);
            valid = false;
        } else {
            setPasswordError(false);
        }

        if (username.length < 8) {
            setUsernameError(true);
            valid = false;
        } else {
            setUsernameError(false);
        }
        if (valid == false)//checking for break;
        {
            setToastData({type:'error',content:"Please verify the segments below"})
            return;
        }

        const user = { username, password, email };
        const response = await postRequest("/users/signup", user);
        console.log(response);
        if (response.data.message.includes("Username already taken"))
        {
            setUsernameError(true);
            valid = false;
        }
        if (response.data.message.includes("Email address already taken"))
        {
            setEmailError(true);
            valid = false
        }
        if(valid == false) //checking for break again
        {
            setToastData({ type: "error", content: response.data.message })
            return;
        }
        setToastData({type: "success", content: response.data.message})
        NavigateTo("/signin");
    };

    return (
        <div className="sign_up_main">
            <div className="sign_up_container">
                <Typography
                    style={{
                        color: "#f900ff",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                    }}
                    variant="h2"
                >
                    Sign Up
                </Typography>
                <Box
                    component="form"
                    sx={{ width: "60%", display: "flex", justifyContent: "space-evenly", height: "60%",minHeight:'400px', alignItems: "center", flexDirection: "column" }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField
                        label="Username"
                        name="username"
                        required
                        fullWidth
                        color="info"
                        inputRef={UsernameRef}
                        error={usernameError}
                        helperText={usernameError ? "Username must be at least 8 characters long" : ""}
                        InputLabelProps={{ style: { color: '#f900ff', fontSize: "1.9rem" } }}
                        InputProps={{ style: { color: 'white', fontSize: "2rem" } }}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        name="password"
                        required
                        fullWidth
                        inputRef={PasswordRef}
                        error={passwordError}
                        helperText={passwordError ? "Password must be at least 8 characters long with one uppercase letter" : ""}
                        color="info"
                        InputLabelProps={{ style: { color: '#f900ff', fontSize: "1.9rem" } }}
                        InputProps={{ style: { color: 'white', fontSize: "2rem" } }}
                    />
                    <TextField
                        label="Email"
                        type="email"
                        name="email"
                        required
                        fullWidth
                        inputRef={EmailRef}
                        error={emailError}
                        helperText={emailError ? "Invalid email" : ""}
                        color="info"
                        InputLabelProps={{ style: { color: '#f900ff', fontSize: "1.9rem" } }}
                        InputProps={{ style: { color: 'white', fontSize: "2rem" } }}
                    />
                    <Button variant="contained" color="info" size="large" onClick={handleSignUp} sx={{ fontSize: "2rem" }}>
                        Sign Up
                    </Button>
                </Box>
            </div>
        </div>
    );
}

export default SignUp;
