import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { SharedElement } from "react-navigation-shared-element";
import { Word } from "./WordCard";
import { TouchableOpacity } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("window");

interface WordScreenProps {
  word: Word | undefined;
}
export default function WordScreen({ navigation, route }) {
  const props = route.params.data;
  return (
    <ScrollView>
      <SharedElement id={`${props.word}.image`}>
        <Image
          source={{ uri: props.image }}
          resizeMode="cover"
          style={styles.wordImage}
        />
      </SharedElement>
      <SharedElement id={`${props.word}.name`}>
        <Text style={styles.mainWord}>{props.word}</Text>
      </SharedElement>
     
        <Text style={styles.explanation}>{props.explanation}</Text>
     
      <TouchableOpacity onPress={() => {
          navigation.goBack();
      }}>
          <Text>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
