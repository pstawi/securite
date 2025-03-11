import React, { useEffect, useState } from "react";
import { decodeToken } from "../auth/decodeToken";
import axios from "axios";
import { Container, Typography, List, ListItem, ListItemText, Button, Box } from "@mui/material";

const Accueil = () => {
    const [username, setUsername] = useState("");
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded = decodeToken(token);
            setUsername(decoded.username);
        } else {
            alert("Invalid token");
            window.location.href = "/login";
        }
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:3001/user/getAllUsers");
            setUsers(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteClick = async (user) => {
        if (!window.confirm(`Voulez-vous vraiment supprimer ${user.username} ?`)) return;

        try {
            await axios.delete(`http://localhost:3001/user/deleteUser/${user.id}`);
            setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la suppression de l'utilisateur.");
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Accueil
                </Typography>
                <Typography variant="h6">Bienvenue, {username}!</Typography>
                <Typography variant="h5" sx={{ mt: 2 }}>Liste des utilisateurs:</Typography>
                <List>
                    {users.map((user) => (
                        <ListItem key={user.id} divider>
                            <ListItemText primary={user.username} secondary={user.email} />
                            <Button 
                                variant="contained" 
                                color="error" 
                                onClick={() => handleDeleteClick(user)}
                            >
                                Supprimer
                            </Button>
                        </ListItem>
                    ))}
                </List>
                <Button variant="contained" color="secondary" fullWidth sx={{ mt: 2 }} onClick={logout}>
                    Logout
                </Button>
            </Box>
        </Container>
    );
};

export default Accueil;
