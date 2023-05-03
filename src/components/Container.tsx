import { StyleSheet, View, ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../appConstants";

export const Container = (props: ViewProps) => {
  const { top, bottom } = useSafeAreaInsets();
  return (
    <View {...props} style={[styles.container, props.style]}>
      <View style={{ height: top }} />
      {props.children}
      <View style={{ height: bottom }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
});
