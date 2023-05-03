import _ from "lodash";
import {
  handleBulkMessagesReceived,
  handleMessageReceived,
  setConnectionState,
} from "./appSlice";
import { globalDispatch } from "./dispatcher";

const wsHost = "wss://api-pub.bitfinex.com/ws/2";

let ws: WebSocket | undefined = undefined;

export const startWs = ({
  prec = "P0",
  len = 25,
  symbol = "tBTCUSD",
  freq = "F1",
}: {
  prec?: "P0" | "P1" | "p2" | "P3" | "P4";
  len?: number;
  symbol?: string;
  freq?: "FO" | "F1";
}) => {
  ws = new WebSocket(wsHost);
  ws.onmessage = (message) => {
    const msg = JSON.parse(message.data);
    if (msg.event) {
      console.log("event message", msg.event);
      if (msg.event === "subscribed") {
        globalDispatch(setConnectionState("connected"));
      }
      return;
    }
    const [_channelId, possibleArray] = msg;
    if (typeof possibleArray === "string") {
      console.log("possibleArray is string", possibleArray);
      return;
    }
    if (typeof possibleArray[0] === "number") {
      globalDispatch(handleMessageReceived(possibleArray));
    }
    if (Array.isArray(possibleArray[0])) {
      globalDispatch(handleBulkMessagesReceived(possibleArray));
    }
  };

  ws.onopen = () => {
    globalDispatch(setConnectionState("connecting"));
    const msg = JSON.stringify({
      event: "subscribe",
      channel: "book",
      symbol,
      len,
      freq,
      prec,
    });

    ws?.send(msg);
  };

  ws.onclose = () => {
    globalDispatch(setConnectionState("disconnected"));
  };
};

export const stopWs = () => {
  ws?.close();
};
