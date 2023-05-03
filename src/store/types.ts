export type OrderBook = {
  bids: { [key: string]: number };
  asks: { [key: string]: number };
};

export type AppState = {
  book: OrderBook;
  connectionState: string;
};

export type ReduxState = {
  app: AppState;
};
