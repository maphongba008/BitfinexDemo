import { Container, Header } from "../../components";
import { TouchableOpacity, Text, ScrollView } from "react-native";
import { useAppSelector } from "../../store/selectors";
import { startWs, stopWs } from "../../store/connection";
import React from "react";
console.log("home here");
const Home = () => {
  const state = useAppSelector((state) => state.app.book);
  const connectionState = useAppSelector((state) => state.app.connectionState);
  return (
    <Container>
      <Header title="Home" />
      <TouchableOpacity
        onPress={() => {
          startWs({});
        }}
      >
        <Text>Start WS</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          stopWs();
        }}
      >
        <Text>Stop WS</Text>
      </TouchableOpacity>
      <Text>{`Connection state: ${connectionState}`}</Text>
      <ScrollView>
        <Text>{JSON.stringify(state, null, 2)}</Text>
      </ScrollView>
    </Container>
  );
};

export default Home;
