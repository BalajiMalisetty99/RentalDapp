import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from "@mui/material";

function HouseCard({ house }) {
    const navigate = useNavigate();

    const handleRentNow = () => {
        // Navigate to checkout page with the house data
        navigate('/checkout', { state: { house } });
    };

    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardMedia
                component="img"
                height="140"
                image={house.image}
                alt={house.name}
            />
            <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                    {house.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Location: {house.location}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Price: ${house.price}/month
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Contact: {house.contact}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Description: {house.description}
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleRentNow} // Call the function to navigate
                    sx={{ mt: 1 }}
                >
                    Rent Now
                </Button>
            </CardContent>
        </Card>
    );
}

export default HouseCard;
