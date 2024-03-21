import { useContext, useRef, useState } from 'react';
import { Box, Button, Checkbox, FormControlLabel, TextField, Typography } from "@mui/material";
import "./SignIn.css";
import Context from '../../Context';
import { useNavigate } from 'react-router-dom';

function SignIn() {
    const { setActiveUser, postRequest, setToastData } = useContext(Context);
    const UsernameRef = useRef(null);
    const PasswordRef = useRef(null);
    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const navigate = useNavigate();
    const [rememberMe, setRememberMe] = useState(false);
    const NavigateTo = (destination) => {
        navigate(destination);
      };
    const handleSignIn = async () => {
        const username = UsernameRef.current.value;
        const password = PasswordRef.current.value;
        let valid = true;

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

        const user = { username, password };
        const response = await postRequest("/users/SignIn", user);
        console.log(response);
        if (response.data.message.includes("Username or password incorrect"))
        {
            setUsernameError(true);
            setPasswordError(true);
            valid = false;
        }
        if(response.data.message.includes("Please verify your email address"))
            valid =false;
        if(valid == false)
        {
            setToastData({ type: "error", content: response.data.message })
            return;
        }
        setToastData({type: "success", content: response.data.message})
        setActiveUser(response.data.user);
        if(rememberMe)
        {
            localStorage.setItem('username', user.username);
            localStorage.setItem('password', user.password);    
        }
        NavigateTo("/");
    };

    return (
        <div className="sign_in_main">
            <div className="sign_in_container">
                <Typography
                    style={{
                        color: "#2222ff",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                    }}
                    variant="h2"
                >
                    Sign In
                </Typography>
                <Box
                    component="form"
                    sx={{ width: "60%", display: "flex", justifyContent: "space-evenly", height: "60%", alignItems: "center", flexDirection: "column" ,minHeight:'400px'}}
                    noValidate
                    autoComplete="off"
                >
                    <TextField
                        label="Username"
                        name="username"
                        required
                        fullWidth
                        color="secondary"
                        inputRef={UsernameRef}
                        error={usernameError}
                        defaultValue={localStorage.getItem('username')|| ''}
                        InputLabelProps={{ style: { color: '#2222ff', fontSize: "1.9rem" } }}
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
                        color="secondary"
                        defaultValue={localStorage.getItem('password') || ''}
                        InputLabelProps={{ style: { color: '#2222ff', fontSize: "1.9rem" } }}
                        InputProps={{ style: { color: 'white', fontSize: "2rem" } }}
                    />
                    <Button variant="contained" color="secondary" size="large" onClick={handleSignIn} sx={{ fontSize: "2rem" }}>
                        Sign In
                    </Button>
                </Box>
                <FormControlLabel
    control={
        <Checkbox
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
        />
    }
    label="Remember me"
    sx={{ fontSize: '2rem', color: 'white' }} 
/>
            </div>
        </div>
    );
}

export default SignIn;
