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
import { Video } from "expo-av";
import AudioPlayer from "../media/AudioPlayer";
const { width, height } = Dimensions.get("window");

interface WordScreenProps {
  word: Word | undefined;
}
const WordScreen = (props: WordScreenProps) => {
  return (
    <SafeAreaView>
      <ScrollView style={{ marginVertical: 10 }}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          contentContainerStyle={{ alignItems: "center" }}
        >
          {props.word?.image !== "" && (
            <Image
              source={{
                uri: props.word?.image,
              }}
              style={{
                marginTop: 5,
                width: width,
                height: height / 2.5,
              }}
              resizeMode="cover"
            />
          )}
          {props.word?.video !== "" && (
            <View
              style={{
                marginTop: 10,
                alignItems: "center",
              }}
            >
              <Video
                source={{
                  uri: props.word?.video,
                }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="cover"
                shouldPlay
                useNativeControls={true}
                isLooping
                style={{
                  width: width * 0.85,
                  height: height / 3,
                  borderRadius: 10,
                }}
              />
            </View>
          )}
        </ScrollView>
        {props.word?.audio !== "" && (
          <View
            style={{
              marginHorizontal: 10,
            }}
          >
            <AudioPlayer uri={props.word?.audio} />
          </View>
        )}
        <View
          style={{
            margin: 10,
          }}
        >
          <Text style={styles.mainWord}>{props.word?.word}</Text>
          <Text style={styles.typeWord}>{props.word?.type}</Text>
          <Text style={styles.explanation}>{props.word?.explanation}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WordScreen;
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
  typeWord: {
    color: "#ff425b",
    fontWeight: "bold",
    margin: 5,
  },
});
