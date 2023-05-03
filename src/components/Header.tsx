import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { dimensions } from "../appConstants";

export type HeaderProps = {
  title: string;
  backEnabled?: boolean;
};

export const Header = ({ title, backEnabled }: HeaderProps) => {
  return (
    <View style={styles.container}>
      <Text numberOfLines={2} style={styles.title}>
        {title}
      </Text>
      {backEnabled && (
        <TouchableOpacity activeOpacity={0.7} style={styles.backButton}>
          <Text>Back</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: dimensions.navBarHeight,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "grey",
  },
  backButton: {
    padding: dimensions.normal,
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginHorizontal: 20,
    textAlign: "center",
    flex: 1,
    fontSize: dimensions.fontTitle,
  },
});
