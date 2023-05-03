import { createSlice } from "@reduxjs/toolkit";
import { AppState, OrderBook } from "./types";

const initialState: AppState = {
  book: {
    asks: {},
    bids: {},
  },
  connectionState: "disconnected",
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setConnectionState: (state, action) => {
      state.connectionState = action.payload;
    },
    handleMessageReceived: (state, action) => {
      const data = action.payload;
      const book = state.book;
      handleDataEvent(book, data);
    },
    handleBulkMessagesReceived: (state, action) => {
      const data = action.payload;
      const book = state.book;
      data.forEach((data: any) => handleDataEvent(book, data));
    },
  },
});

export const {
  handleMessageReceived,
  handleBulkMessagesReceived,
  setConnectionState,
} = appSlice.actions;

export default appSlice.reducer;

const handleDataEvent = (book: OrderBook, data: [number, number, number]) => {
  const [price, count, amount] = data;
  if (count > 0) {
    if (amount > 0) {
      book.bids[price] = (book.bids[price] || 0) + amount;
    } else if (amount < 0) {
      book.asks[price] = (book.asks[price] || 0) + amount;
    }
  } else if (count === 0) {
    if (amount === 1) {
      delete book.bids[price];
    } else if (amount === -1) {
      delete book.asks[price];
    }
  }
};
