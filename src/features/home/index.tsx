import { Container, Header } from "../../components";
import {
  TouchableOpacity,
  Text,
  ScrollView,
  View,
  ActivityIndicator,
  TextInput,
  Alert,
  StyleProp,
  ViewStyle,
} from "react-native";
import { useAppSelector } from "../../store/selectors";
import { startWs, stopWs } from "../../store/connection";
import React from "react";
import { OrderBookView } from "./component/OrderBookView";
import { colors, dimensions } from "../../appConstants";

const possiblePrecs = ["P0", "P1", "P2", "P3", "P4"];

const Button = ({
  text,
  onPress,
  style,
}: {
  onPress: () => void;
  text: string;
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      {...{
        onPress,
        style: [
          {
            padding: dimensions.normal,
            backgroundColor: colors.button,
          },
          style,
        ],
      }}
    >
      <Text style={{ color: "#FFF" }}>{text}</Text>
    </TouchableOpacity>
  );
};

const Home = () => {
  const connectionState = useAppSelector((state) => state.app.connectionState);
  const isConnecting = connectionState === "connecting";
  const isConnected = connectionState === "connected";
  const [prec, setPrec] = React.useState("P0");
  return (
    <Container>
      <Header title="Home" />
      <View style={{ padding: dimensions.normal, flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            paddingVertical: dimensions.normal,
          }}
        >
          <Button
            text="Connect"
            onPress={() => {
              startWs({ prec });
            }}
          />
          <Button
            style={{ marginLeft: dimensions.normal }}
            text="Disconnect"
            onPress={() => {
              stopWs();
            }}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text>Precision</Text>
          <TextInput
            style={{
              flex: 1,
              padding: dimensions.normal,
              borderWidth: 1,
              borderColor: colors.border,
              marginHorizontal: dimensions.normal * 2,
            }}
            value={prec}
            onChangeText={setPrec}
          />
          <Button
            text="Update"
            onPress={() => {
              if (!possiblePrecs.includes(prec)) {
                Alert.alert(
                  "Invalid precision",
                  "Precision must be one of P0, P1, P2, P3, P4",
                  [
                    {
                      text: "OK",
                    },
                  ]
                );
                return;
              }
              if (isConnected) {
                stopWs();
                startWs({ prec });
              }
            }}
          />
        </View>
        <Text
          style={{ marginTop: dimensions.normal }}
        >{`Connection state: ${connectionState}`}</Text>
        {isConnecting && (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <ActivityIndicator />
            <Text>Loading...</Text>
          </View>
        )}
        {isConnected && (
          <ScrollView>
            <OrderBookView />
          </ScrollView>
        )}
      </View>
    </Container>
  );
};

export default Home;
