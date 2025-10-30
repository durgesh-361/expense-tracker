import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:5000/api/transactions";

// Fetch all transactions
export const fetchTransactions = createAsyncThunk(
  "transactions/fetch",
  async () => {
    const res = await axios.get(API);
    return res.data;
  }
);

// Add a new transaction
export const addTransaction = createAsyncThunk(
  "transactions/add",
  async (data) => {
    const res = await axios.post(API, data);
    return res.data;
  }
);

// Update a transaction
export const updateTransaction = createAsyncThunk(
  "transactions/updateTransaction",
  async (transaction) => {
    const { id, ...data } = transaction;
    const res = await axios.put(`${API}/${id}`, data);
    return res.data;
  }
);

// Delete a transaction
export const deleteTransaction = createAsyncThunk(
  "transactions/delete",
  async (id) => {
    await axios.delete(`${API}/${id}`);
    return id;
  }
);

const transactionSlice = createSlice({
  name: "transactions",
  initialState: { items: [], status: "idle" },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const index = state.items.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t._id !== action.payload);
      });
  },
});

export default transactionSlice.reducer;
