import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { SharedElement } from "react-navigation-shared-element";
import { Word } from "./WordCard";
import { TouchableOpacity } from "react-native-gesture-handler";
import { StackNavigationProp } from "@react-navigation/stack";
const { width, height } = Dimensions.get("window");

interface WordScreenProps {
  word: Word | undefined;
}
const WordScreen = (props: WordScreenProps) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ marginVertical: 10 }}>
        <Text style={styles.mainWord}>{props.word?.word}</Text>

        <Text style={styles.explanation}>{props.word?.explanation}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WordScreen;
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
  },
  mainWord: {
    fontWeight: "bold",
    fontSize: 18,
    margin: 5,
    marginTop: 10,
  },
  explanation: {
    padding: 5,
    marginRight: 5,
  },
  wordImage: {
    width: width * 0.95,
    height: height * 0.4,
    borderRadius: 10,
  },
});
