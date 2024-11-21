import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Typography,
  Button,
  Container,
  Paper,
} from '@mui/material';

function AddHouse({ addHouse }) {
  const [houseData, setHouseData] = useState({
    name: '',
    image: '',
    location: '',
    price: '',
    contact: '',
    description: '',
  });

  // State variables for blockchain interaction
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const navigate = useNavigate();

  // Replace these with your contract details
  const contractAddress = '0x78b02e9c67EFc395EcB5c45B292ca6ADB5324366';
  const abi = [
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


  useEffect(() => {
    // Initialize provider, signer, and contract on component mount
    const initializeBlockchain = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = provider.getSigner();
        setProvider(provider);
        setSigner(signer);

        const contract = new ethers.Contract(contractAddress, abi, signer);
        setContract(contract);
      } catch (error) {
        console.error('Error connecting to blockchain:', error);
      }
    };
    initializeBlockchain();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHouseData({ ...houseData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (contract) {
      try {
        const userAddress = await signer.getAddress();
        // Construct the log message with address and price
        const logMessage = `User at ${userAddress} Added house with address: ${houseData.location}, price: ${houseData.price}`;

        // Interact with the smart contract to update the log
        const tx = await contract.updateLog(logMessage);
        await tx.wait(); // Wait for the transaction to be mined
        console.log('Log updated in smart contract');

        // Add the house data (e.g., to local storage or backend) if needed
        addHouse(houseData);

        // Redirect to home page after adding the house
        navigate('/home');
      } catch (error) {
        console.error('Error updating log in smart contract:', error);
        alert('Failed to add house to the blockchain');
      }
    } else {
      alert('Blockchain connection not established');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
        <Typography variant="h4" gutterBottom>
          Add a Rental House
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="House Name"
            name="name"
            value={houseData.name}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Image URL"
            name="image"
            value={houseData.image}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Location"
            name="location"
            value={houseData.location}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Rental Price"
            name="price"
            type="number"
            value={houseData.price}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Contact Number"
            name="contact"
            value={houseData.contact}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            name="description"
            value={houseData.description}
            onChange={handleChange}
            multiline
            rows={4}
            required
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            Add House
          </Button>
        </form>
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          sx={{ marginTop: 2 }}
          onClick={() => navigate('/checklog')} // Navigate to CheckLogs page
        >
          Check Logs
        </Button>
      </Paper>
    </Container>
  );
}

export default AddHouse;
