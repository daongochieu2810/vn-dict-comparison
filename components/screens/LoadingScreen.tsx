import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import fb from "../../backend/backend";
export default function LoadingScreen(props) {
  useEffect(() => {
    fb.auth.onAuthStateChanged((user) => {
      props.navigation.navigate(user ? "App" : "Login");
    });
  });
  return (
    <View
      style={{
        ...styles.container,
        position: "absolute",
        left: 0,
        top: 0,
        backgroundColor: "#FFFFFF",
        opacity: 0.5,
        zIndex: 2,
      }}
    >
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
});
