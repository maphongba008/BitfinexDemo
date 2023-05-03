import { SafeAreaProvider } from "react-native-safe-area-context";
import { Container, Header } from "./components";
import { Provider } from "react-redux";
import { store } from "./store";
import RootNavigation from "./navigation";
export default () => {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <RootNavigation />
      </Provider>
    </SafeAreaProvider>
  );
};
