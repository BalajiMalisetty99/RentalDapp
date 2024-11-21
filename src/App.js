import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Typography, Box, Button, Container } from "@mui/material"; 
import AvailableHouses from './components/AvailableHouses';
import AddHouse from './components/AddHouse';
import CheckLog from './components/CheckLogs';
import Checkout from './components/Checkout';
import UserRegistration from './components/UserRegistration';
import Login from './components/Login';
import rental1 from "../src/assets/rental1.jpg";
import rental2 from "../src/assets/rental2.jpg";
import rental3 from "../src/assets/rental3.jpeg";
import './styles.css';

function App() {
    const [userCredentials, setUserCredentials] = useState(null); // To store registered user data
    const [isLoggedIn, setIsLoggedIn] = useState(false); // To track if the user is logged in

    const [houses, setHouses] = useState([
        {
            id: 1,
            name: "Spacious Apartment in Downtown",
            image: rental1,
            location: "Downtown, City Center",
            price: 1200,
            contact: "+123456789",
            description: "A beautiful 2-bedroom apartment located in the heart of downtown.",
        },
        {
            id: 2,
            name: "Cozy House in Suburb",
            image: rental2,
            location: "Suburb, Quiet Neighborhood",
            price: 1500,
            contact: "+987654321",
            description: "A cozy and quiet house perfect for families in a peaceful neighborhood.",
        },
        {
            id: 3,
            name: "Modern Condo with Ocean View",
            image: rental3,
            location: "Beachfront, Ocean View",
            price: 2500,
            contact: "+1122334455",
            description: "Enjoy a breathtaking ocean view from this modern 3-bedroom condo.",
        },
    ]);

    const addHouse = (house) => {
        setHouses([...houses, { ...house, id: houses.length + 1 }]);
    };

    return (
        <Box sx={{ backgroundColor: '#D0CDD7', minHeight: '100vh', paddingBottom: 5 }}>
            <Router>
                <Container sx={{ paddingTop: 3, paddingBottom: 3 }}>
                    <Typography variant="h3" align="center" gutterBottom>
                        Decentralized House Rental Application
                    </Typography>
                    <Routes>
                        {/* Registration Page */}
                        <Route
                            path="/"
                            element={
                                userCredentials ? (
                                    <Navigate to="/login" replace />
                                ) : (
                                    <UserRegistration setUserCredentials={setUserCredentials} />
                                )
                            }
                        />

                        {/* Login Page */}
                        <Route
                            path="/login"
                            element={
                                userCredentials && !isLoggedIn ? (
                                    <Login
                                        userCredentials={userCredentials}
                                        setIsLoggedIn={setIsLoggedIn}
                                    />
                                ) : (
                                    <Navigate to= "/home" />
                                )
                            }
                        />

                        {/* Home Page */}
                        <Route
                            path="/home"
                            element={
                                isLoggedIn ? (
                                    <>
                                        <Box display="flex" justifyContent="center" gap={2} mb={4}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                component="a"
                                                href="/home"
                                                sx={{ textTransform: 'none' }}
                                            >
                                                Available Houses
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                component="a"
                                                href="/add-house"
                                                sx={{ textTransform: 'none' }}
                                            >
                                                Add a Rental House
                                            </Button>
                                        </Box>
                                        <AvailableHouses houses={houses} />
                                    </>
                                ) : (
                                    <Navigate to="/" replace />
                                )
                            }
                        />

                        {/* Add House Page */}
                        <Route
    path="/add-house"
    element={<AddHouse addHouse={addHouse} />}
/>

                        {/* Additional Routes */}
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/checklog" element={<CheckLog />} />
                    </Routes>
                </Container>
            </Router>
        </Box>
    );
}

export default App;
