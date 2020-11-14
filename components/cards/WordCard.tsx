import React from "react";
import { StyleSheet, View, Text, Dimensions, Image } from "react-native";
import { SharedElement } from "react-navigation-shared-element";


const { width, height } = Dimensions.get("window");

export interface Word {
  word: string;
  explanation: string;
  image: string;
}

interface WordCardProps {
  word: Word;
}

export default function WordCard(props: WordCardProps) {
  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
      <SharedElement id={`item.${props.word.word}.name`}>
          <Text style={styles.mainWord}>{props.word.word}</Text>
    </SharedElement>
    
            
          <Text
            style={styles.explanation}
            numberOfLines={Math.floor(height / 100) - 1}
          >
            {props.word.explanation}
          </Text>
        
      </View>
     <SharedElement id={`item.${props.word.word}.name`}>
          <Image source={{uri : props.word.image}} style={styles.wordImage} />
    </SharedElement>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    width: width * 0.9,
    maxHeight: height * 0.25,
    padding: 10,
    margin: 10,
  },
  mainWord: {
    fontWeight: "bold",
    fontSize: 18,
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
