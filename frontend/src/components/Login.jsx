import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    TextField,
    IconButton,
    Container,
    Typography,
    Box,
    Alert,
    InputAdornment
} from "@mui/material";
import { Email, Lock, Login as LoginIcon } from "@mui/icons-material";

const Login = () => {
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); 
        try {
            const res = await axios.post("http://localhost:3001/user/login", form);
            localStorage.setItem("token", res.data.data.token);
            navigate("/");
        } catch (error) {
            setError(error.response?.data?.error || "Erreur de connexion.");
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Login
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        margin="normal"
                        required
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Email />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        margin="normal"
                        required
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Box display="flex" justifyContent="center" mt={2}>
                        <IconButton type="submit" color="primary" sx={{ fontSize: 40 }}>
                            <LoginIcon />
                        </IconButton>
                    </Box>
                </form>
                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                    Don't have an account?{" "}
                    <a href="/register" style={{ textDecoration: "none", color: "#1976d2" }}>Register</a>
                </Typography>
            </Box>
        </Container>
    );
};

export default Login;
