import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import '../App.css';

const CheckLogs = () => {
  // State variables for login, blockchain interaction, and log data
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [log, setLog] = useState('');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  // Replace with your contract address and ABI
  const contractAddress = '0x5C2747EC8F1Ca1C4EfD5c4f5444964A258B8f054';
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

  // Initialize provider, signer, and contract on component mount
  useEffect(() => {
    const initializeBlockchain = async () => {
      if (isAuthenticated) {
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
      }
    };
    initializeBlockchain();
  }, [isAuthenticated]);

  // Handle login form submission
  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'pass123') { // Simple authentication check
      setIsAuthenticated(true);
    } else {
      alert('Invalid username or password');
    }
  };

  // Function to fetch log from the contract
  const fetchLog = async () => {
    if (!contract) return;

    try {
      const logData = await contract.fetchLog();
      setLog(logData);
    } catch (error) {
      console.error('Error fetching log:', error);
      alert('Failed to fetch log from the blockchain');
    }
  };

  return (
    <div className="check-log-page">
      <h2>Check Logs</h2>

      {!isAuthenticated ? (
        <form onSubmit={handleLogin} className="login-form">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      ) : (
        <div>
          <button onClick={fetchLog} className="fetch-log-button">Fetch Log</button>
          {log && (
            <div className="log-display">
              <h3>Log Data:</h3>
              <p>{log}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckLogs;