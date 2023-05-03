import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { OrderBook } from "../../../store/types";
import { dimensions } from "../../../appConstants";
import _ from "lodash";
import { useAppSelector } from "../../../store/selectors";

type OrderBookViewProps = {
  orderBook: OrderBook;
};

const ProgressBar = ({
  percent,
  color,
  isBid,
}: {
  percent: number;
  color: string;
  isBid?: boolean;
}) => {
  return (
    <View
      style={{
        position: "absolute",
        left: isBid ? undefined : 0,
        right: isBid ? 0 : undefined,
        top: 0,
        bottom: 0,
        width: `${percent}%`,
        backgroundColor: color,
      }}
    ></View>
  );
};

const AskRow = ({
  price,
  total,
  max,
}: {
  price: number;
  total: number;
  max: number;
}) => {
  const percent = (Math.abs(total) / max) * 100;
  return (
    <View style={[rowStyles.container]}>
      <ProgressBar percent={percent} color="#FF5722" isBid={false} />
      <Text style={rowStyles.askPriceText}>
        {price.toLocaleString("en-US")}
      </Text>
      <Text style={rowStyles.askTotalText}>{Math.abs(total).toFixed(3)}</Text>
    </View>
  );
};

const BidRow = ({
  price,
  total,
  max,
}: {
  price: number;
  total: number;
  max: number;
}) => {
  const percent = (total / max) * 100;
  return (
    <View style={rowStyles.container}>
      <ProgressBar percent={percent} color="#4CAF50" isBid />
      <Text style={rowStyles.bidTotalText}>{Math.abs(total).toFixed(3)}</Text>
      <Text style={rowStyles.bidPriceText}>
        {price.toLocaleString("en-US")}
      </Text>
    </View>
  );
};
const rowStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: dimensions.normal,
    paddingVertical: dimensions.normal / 2,
  },
  askTotalText: {
    flex: 1,
    paddingHorizontal: dimensions.normal,
    textAlign: "right",
  },
  askPriceText: {
    flex: 1,
  },
  bidTotalText: {
    flex: 1,
    paddingHorizontal: dimensions.normal,
  },
  bidPriceText: {
    flex: 1,
    textAlign: "right",
  },
});

export const OrderBookView = () => {
  const orderBook = useAppSelector((state) => state.app.book);

  const maxAsks = _.min(Object.values(orderBook.asks)) || 0;
  const maxBids = _.max(Object.values(orderBook.bids)) || 0;
  const max = Math.max(Math.abs(maxAsks), maxBids);
  return (
    <View style={styles.container}>
      <View style={styles.bid}>
        {Object.entries(orderBook.bids).map((e) => (
          <BidRow key={e[0]} max={max} price={parseFloat(e[0])} total={e[1]} />
        ))}
      </View>
      <View style={styles.ask}>
        {Object.entries(orderBook.asks).map((e) => (
          <AskRow key={e[0]} max={max} price={parseFloat(e[0])} total={e[1]} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  ask: {
    flex: 1,
  },
  bid: {
    flex: 1,
  },
});
