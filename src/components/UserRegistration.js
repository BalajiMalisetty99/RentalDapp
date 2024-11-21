import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Alert } from "@mui/material";

const UserRegistration = ({ setUserCredentials }) => {
    // State for form fields
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [error, setError] = useState(""); // Error state
    const [credentials, setCredentials] = useState(null); // State to store generated credentials
    const navigate = useNavigate();

    // Function to handle registration
    const handleRegister = () => {
        // Validate form fields
        if (!name || !email || !phone) {
            setError("Please fill all fields.");
            return;
        }

        // Generate username and password
        const username = name.toLowerCase().replace(/\s+/g, '');
        const password = Math.random().toString(36).substr(2, 8); // Random 8-character password

        // Set user credentials (passed down via props)
        setUserCredentials({ username, password, email, phone });

        // Save credentials to the local state
        setCredentials({ username, password });

        // Clear any previous error
        setError("");

        alert(`Your Credentials:\nUsername: ${username}\nPassword: ${password}`);

        // Do NOT navigate here; allow the user to see credentials first
    };

    return (
        <Box 
            sx={{ 
                maxWidth: 400, 
                mx: 'auto', 
                mt: 5, 
                p: 3, 
                bgcolor: 'white', 
                borderRadius: 2, 
                boxShadow: 2 
            }}
        >
            <Typography variant="h5" align="center" gutterBottom>
                User Registration
            </Typography>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            <TextField
                label="Name"
                fullWidth
                margin="normal"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
                label="Phone"
                type="tel"
                fullWidth
                margin="normal"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
            <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleRegister}
                sx={{ mt: 2 }}
            >
                Register
            </Button>

            {/* Display generated credentials */}
            {credentials && (
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Your Credentials:
                    </Typography>
                    <TextField
                        label="Username"
                        fullWidth
                        margin="normal"
                        value={credentials.username}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <TextField
                        label="Password"
                        fullWidth
                        margin="normal"
                        value={credentials.password}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        onClick={() => navigate('/login')}
                        sx={{ mt: 2 }}
                    >
                        Proceed to Login
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default UserRegistration;
