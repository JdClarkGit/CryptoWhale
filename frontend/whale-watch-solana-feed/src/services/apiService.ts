import axios from 'axios';

// Create an axios instance for our backend API
const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// User endpoints
export const fetchUserData = async (userId: string) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

// Portfolio endpoints
export const fetchPortfolio = async (userId: string) => {
  const response = await api.get(`/portfolios/${userId}`);
  return response.data;
};

// Transaction endpoints
export const fetchTransactions = async (userId: string) => {
  const response = await api.get(`/transactions/${userId}`);
  return response.data;
};

export const createTransaction = async (
  userId: string,
  from: 'alpaca' | 'phantom_wallet' | 'metamask',
  to: 'alpaca' | 'phantom_wallet' | 'metamask',
  amountUSD: number
) => {
  const response = await api.post('/transactions', {
    userId,
    from,
    to,
    amountUSD
  });
  return response.data;
};

export const updateTransactionStatus = async (
  transactionId: string,
  status: 'pending' | 'completed' | 'failed',
  txHash?: string
) => {
  const response = await api.patch(`/transactions/${transactionId}`, {
    status,
    txHash
  });
  return response.data;
};
