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
import { Person, Email, Lock, HowToReg } from "@mui/icons-material";

const Register = () => {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Réinitialisation de l'erreur
        try {
            await axios.post("http://localhost:3001/user/register", form);
            navigate("/login"); // Redirection après inscription réussie
        } catch (error) {
            setError(error.response?.data?.message || "Erreur lors de l'inscription.");
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Register
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        margin="normal"
                        required
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Person />
                                </InputAdornment>
                            ),
                        }}
                    />
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
                            <HowToReg />
                        </IconButton>
                    </Box>
                </form>
                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                    Already have an account?{" "}
                    <a href="/login" style={{ textDecoration: "none", color: "#1976d2" }}>Login</a>
                </Typography>
            </Box>
        </Container>
    );
};

export default Register;
