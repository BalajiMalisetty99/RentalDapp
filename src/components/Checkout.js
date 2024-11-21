import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Typography, Box, Button, CircularProgress } from "@mui/material";
import Web3 from "web3";
import { ethers } from "ethers";

function Checkout() {
    const location = useLocation();
    const { house } = location.state || {};
    const [loading, setLoading] = useState(false);
    const [transactionHash, setTransactionHash] = useState("");
    const [logLoading, setLogLoading] = useState(false); // New state for log update loading

    if (!house) {
        return <Typography variant="h6">No house selected for checkout.</Typography>;
    }

    const TokenABI = [
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "payer",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "message",
                    "type": "string"
                }
            ],
            "name": "PaymentLogged",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "oldMessage",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "newMessage",
                    "type": "string"
                }
            ],
            "name": "MessageUpdated",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "message",
                    "type": "string"
                }
            ],
            "name": "AdminMessage",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "oldLog",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "newLog",
                    "type": "string"
                }
            ],
            "name": "LogUpdated",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "_amount",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "m",
                    "type": "string"
                }
            ],
            "name": "transfer",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_newMessage",
                    "type": "string"
                }
            ],
            "name": "HouseAdded",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_newMessage",
                    "type": "string"
                }
            ],
            "name": "HouseRented",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_adminMessage",
                    "type": "string"
                }
            ],
            "name": "logAdminMessage",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_newLog",
                    "type": "string"
                }
            ],
            "name": "updateLog",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "fetchLog",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "symbol",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "totalSupply",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "message",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "log",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];
    

    const handleCheckout = async () => {
        try {
            setLoading(true);

            // Check if MetaMask is installed
            if (typeof window.ethereum === "undefined") {
                alert("MetaMask is not installed. Please install MetaMask to proceed.");
                setLoading(false);
                return;
            }

            // Request MetaMask to connect
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.getAccounts();
            const userAddress = "0x1612018E557282469a301EE720597687dC262F3D";
            
            // Convert the house price to Ether (assuming the price is in USD for simplicity)
            const ethPrice = (house.price / 9000000).toFixed(18);

            // Define transaction parameters
            const transactionParameters = {
                to: "0x31dB0c72472020B364DbEe448d3758B8d57b5Ff5", // Replace with the recipient address
                from: userAddress,
                value: web3.utils.toWei(ethPrice, "ether"), // Convert the amount to Wei
                gas: "200000", // Set an appropriate gas limit
            };

            // Send transaction
            const txHash = await window.ethereum.request({
                method: "eth_sendTransaction",
                params: [transactionParameters],
            });

            setTransactionHash(txHash);
            alert(`Transaction successful! Hash: ${txHash}`);
        } catch (error) {
            console.error("Error during payment:", error);
            alert("Transaction failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateLog = async () => {
        try {
            setLogLoading(true);
            const CONTRACT_ADDRESS = "0x78b02e9c67EFc395EcB5c45B292ca6ADB5324366";
            // Use ethers' Web3Provider for consistency with AddHouse component
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []); // Request account access if needed
            const signer = provider.getSigner(); // Get the connected signer
    
            // Initialize the contract with ABI, address, and signer
            const tokenContract = new ethers.Contract(CONTRACT_ADDRESS, TokenABI, signer);
    
            // Construct the log message
            const logMessage = `\n User at ${await signer.getAddress()} bought house at ${house.location} for ${house.price}`;
    
            // Call the updateLog function on the contract
            const tx = await tokenContract.updateLog(logMessage);
            await tx.wait(); // Wait for the transaction to be mined
    
            alert("Log updated successfully in the smart contract!");
        } catch (error) {
            console.error("Error updating log in smart contract:", error);
            alert("Failed to update the log.");
        } finally {
            setLogLoading(false);
        }
    };

    return (
        <Box p={2}>
            <Typography variant="h4" gutterBottom>
                Checkout
            </Typography>
            <Typography variant="h6">{house.name}</Typography>
            <Typography variant="body1">Location: {house.location}</Typography>
            <Typography variant="body1">Price: ${house.price}/month</Typography>
            <Typography variant="body1">Contact: {house.contact}</Typography>
            <Typography variant="body1">Description: {house.description}</Typography>

            <Button
                variant="contained"
                color="primary"
                onClick={handleCheckout}
                disabled={loading}
                sx={{ mt: 2 }}
            >
                {loading ? <CircularProgress size={24} /> : "Pay and Rent"}
            </Button>

            <Button
                variant="contained"
                color="secondary"
                onClick={handleUpdateLog}
                disabled={logLoading || !transactionHash}
                sx={{ mt: 2, ml: 2 }}
            >
                {logLoading ? <CircularProgress size={24} /> : "Update Log"}
            </Button>

            {transactionHash && (
                <Typography variant="body2" color="text.secondary" mt={2}>
                    Transaction Hash: {transactionHash}
                </Typography>
            )}
        </Box>
    );
}

export default Checkout;
