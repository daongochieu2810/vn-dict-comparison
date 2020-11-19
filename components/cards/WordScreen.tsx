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
const WordScreen = ({ navigation, route }) => {
  const { item } = route.params;
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ marginVertical: 10 }}>
        <Image source={{ uri: item.image }} style={styles.wordImage} />

        <Text style={styles.mainWord}>{item.word}</Text>

        <Text style={styles.explanation}>{item.explanation}</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Text>Back</Text>
        </TouchableOpacity>
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
