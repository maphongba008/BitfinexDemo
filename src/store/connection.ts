import _ from "lodash";
import {
  handleBulkMessagesReceived,
  handleMessageReceived,
  setConnectionState,
} from "./appSlice";
import { globalDispatch } from "./dispatcher";

const wsHost = "wss://api-pub.bitfinex.com/ws/2";

let ws: WebSocket | undefined = undefined;

// only send messages every X milliseconds to reduce number of render, and improve performance
// update it for your needs
const UPDATE_INTERVAL = 100;

// let events: any[] = [];
// let lastUpdate = 0;
// let timeoutId: any = 0;
// const handleEvent = (event: any) => {
//   const now = Date.now();
//   timeoutId && clearTimeout(timeoutId);
//   if (now - lastUpdate > UPDATE_INTERVAL) {
//     console.log("send dispatch with ", events.length);
//     globalDispatch(handleBulkMessagesReceived([...events, event]));
//     events = [];
//     lastUpdate = now;
//   } else {
//     events.push(event);
//     setTimeout(() => {
//       globalDispatch(handleBulkMessagesReceived([...events]));
//       events = [];
//       lastUpdate = Date.now();
//     }, UPDATE_INTERVAL)
//   }
// };

let events: any[] = [];
let intervalId: any = 0;
const handleEvent = (event: any) => {
  events.push(event);
};

// only send messages every X milliseconds to reduce number of render, and improve performance
const startDispatchEventsInterval = () => {
  intervalId && clearInterval(intervalId);
  intervalId = setInterval(() => {
    if (!events.length) {
      console.log(Date.now(), "skip event");

      return;
    }
    console.log(Date.now(), "dispatch event with length", events.length);
    globalDispatch(handleBulkMessagesReceived(events));

    events = [];
  }, UPDATE_INTERVAL);
};

export const startWs = ({
  prec = "P0",
  len = 25,
  symbol = "tBTCUSD",
  freq = "F1",
}: {
  prec?: string;
  len?: number;
  symbol?: string;
  freq?: "FO" | "F1";
}) => {
  if (ws) {
    return;
  }
  startDispatchEventsInterval();
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
      // globalDispatch(handleMessageReceived(possibleArray));
      console.log("new book event");
      handleEvent(possibleArray);
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
};

export const stopWs = () => {
  console.log("stop ws", intervalId);
  ws?.close();
  globalDispatch(setConnectionState("disconnected"));
  intervalId && clearInterval(intervalId);
  ws = undefined;
};
