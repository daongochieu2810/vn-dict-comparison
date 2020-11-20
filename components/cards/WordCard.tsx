import React from "react";
import { StyleSheet, View, Text, Dimensions, Image } from "react-native";
import { SharedElement } from "react-navigation-shared-element";

const { width, height } = Dimensions.get("window");

export interface Word {
  id: string;
  word: string;
  type: string;
  explanation: string;
  groupComp: string;
  image: string;
  audio: string;
  video: string;
}

interface WordCardProps {
  word: Word;
  width: number;
}

export default function WordCard(props: WordCardProps) {
  return (
    <View style={{...styles.container, width: props.width}}>
      <View style={{ flex: 1 }}>
        <Text style={styles.mainWord}>{props.word.word}</Text>
        <Text style={styles.typeWord}>{props.word.type}</Text>
        <Text
          style={styles.explanation}
          numberOfLines={Math.floor(height / 100) - 1}
        >
          {props.word.explanation}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 10,
    height: height * 0.3,
    padding: 10,
    margin: 10,
    shadowColor: "black",
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    backgroundColor: "white",
  },
  mainWord: {
    fontWeight: "bold",
    fontSize: 18,
    margin: 5,
  },
  typeWord: {
    color: "#ff425b",
    fontWeight: "bold",
    margin: 5,
  },
  explanation: {
    padding: 5,
    marginRight: 5,
  },
  wordImage: {
    width: width * 0.4,
    height: height * 0.2,
    borderRadius: 10,
  },
});
