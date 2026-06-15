import axios from "axios";

const STOCK_API_BASE_URL = "http://localhost:5000/api/stocks";

export const buyStockApi = async ({ userId, symbol, companyName, quantity, price }) => {
  const res = await axios.post(`${STOCK_API_BASE_URL}/buy`, {
    userId,
    symbol,
    companyName,
    quantity,
    price,
  });

  return res.data;
};

export const sellStockApi = async ({ userId, symbol, companyName, quantity, price }) => {
  const res = await axios.post(`${STOCK_API_BASE_URL}/sell`, {
    userId,
    symbol,
    companyName,
    quantity,
    price,
  });

  return res.data;
};

export const getHoldingsApi = async (userId) => {
  const res = await axios.get(`${STOCK_API_BASE_URL}/portfolio/${userId}`);
  return res.data;
};

export const getOrdersApi = async (userId) => {
  const res = await axios.get(`${STOCK_API_BASE_URL}/transactions/${userId}`);
  return res.data;
};
