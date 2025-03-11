import React, { useEffect, useState } from "react";
import { decodeToken } from "../auth/decodeToken";
import axios from "axios";
import SearchIcon from '@mui/icons-material/Search';
import {
    Container,
    Typography,
    Box,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button
} from "@mui/material";
import { Delete, Logout, People, Edit } from "@mui/icons-material";

const Accueil = () => {
    const [username, setUsername] = useState("");
    const [users, setUsers] = useState([]);
    const [userToDelete, setUserToDelete] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);
    const [editFormData, setEditFormData] = useState({
        username: '',
        email: ''
    });
    const [searchTerm, setSearchTerm] = useState('');

    // Récupération des utilisateurs
    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:3001/user/getAllUsers");
            setUsers(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const filteredUsers = users.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );

    // Ouvrir la boîte de dialogue d'édition
    const handleEditClick = (user) => {
        setUserToEdit(user);
        setEditFormData({
            username: user.username,
            email: user.email
        });
        setEditDialogOpen(true);
    };

    // Gestion des inputs du formulaire d'édition
    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Soumission de la mise à jour
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3001/user/updateUser/${userToEdit.id}`, editFormData);
            
            // Mise à jour locale de la liste des utilisateurs
            setUsers(users.map(user =>
                user.id === userToEdit.id
                    ? { ...user, ...editFormData }
                    : user
            ));
            setEditDialogOpen(false);
        } catch (error) {
            console.error(error);
        }
    };

    // Annuler l'édition
    const handleEditCancel = () => {
        setEditDialogOpen(false);
        setUserToEdit(null);
        setEditFormData({ username: '', email: '' });
    };

    // Vérifier si l'utilisateur connecté est celui qui est affiché
    const isCurrentUser = (userId) => {
        const token = localStorage.getItem('token');
        if (!token) return false;
        const decodedToken = decodeToken(token);
        return decodedToken && parseInt(decodedToken.id) === userId;
    };

    // Suppression d'un utilisateur
    const handleDeleteClick = async (user) => {
        try {
            setUserToDelete(user);
            await axios.delete(`http://localhost:3001/user/deleteUser/${user.id}`);
            setUsers(users.filter(u => u.id !== user.id));
        } catch (error) {
            console.error(error);
        } finally {
            setUserToDelete(null);
        }
    };

    // Récupération du token et des utilisateurs au chargement
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

    // Déconnexion
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
                <Typography variant="h6" align="center">
                    Bienvenue, {username}!
                </Typography>

                <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                    <People sx={{ fontSize: 40, color: "primary.main" }} />
                </Box>

                <Typography variant="h5" sx={{ mt: 3 }}>
                    Liste des utilisateurs :
                </Typography>

                <Box display="flex" justifyContent="center" mt={2}>
                <TextField
                    label="Rechercher un utilisateur"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <SearchIcon style={{ marginRight: 8 }} />
                        ),
                    }}
                />
                </Box>
                <List>
                    {filteredUsers.map((user) => (
                        <ListItem key={user.id} divider>
                            <ListItemText primary={user.username} secondary={user.email} />
                            <ListItemSecondaryAction>
                                {!isCurrentUser(user.id) && (
                                    <>
                                        <IconButton edge="end" color="primary" onClick={() => handleEditClick(user)}>
                                            <Edit />
                                        </IconButton>
                                        <IconButton edge="end" color="error" onClick={() => handleDeleteClick(user)}>
                                            <Delete />
                                        </IconButton>
                                    </>
                                )}
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>

                <Box display="flex" justifyContent="center" mt={3}>
                    <IconButton color="primary" onClick={logout} sx={{ fontSize: 40 }}>
                        <Logout />
                    </IconButton>
                </Box>
            </Box>

            {/* Boîte de dialogue pour l'édition */}
            <Dialog open={editDialogOpen} onClose={handleEditCancel}>
                <DialogTitle>Modifier l'utilisateur</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Nom d'utilisateur"
                        name="username"
                        value={editFormData.username}
                        onChange={handleEditInputChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        name="email"
                        value={editFormData.email}
                        onChange={handleEditInputChange}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditCancel} color="secondary">Annuler</Button>
                    <Button onClick={handleEditSubmit} color="primary">Enregistrer</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Accueil;
