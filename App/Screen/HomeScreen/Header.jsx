import { View, Image, StyleSheet } from "react-native";
import React from "react";
import { useUser } from "@clerk/clerk-expo";
import { FontAwesome5 } from "@expo/vector-icons";

export default function Header() {
  const { user } = useUser();

  return (
    <View style={styles.container}>
      {/* User Avatar */}
      <Image
        source={{ uri: user?.imageUrl }}
        style={styles.avatar}
      />

      {/* App Logo */}
      <Image
        source={require("./../../../assets/images/logo1.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Filter Icon */}
      <FontAwesome5 name="filter" size={26} color="black" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 99,
  },
  logo: {
    width: 200,
    height: 45,
  },
});
