import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Modal,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { NavigationProp } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import VN_NAME from "../../config/vn_name";
import words from "../../data/words";
import WordCard, { Word } from "../cards/WordCard";
import WordScreen from "../cards/WordScreen";

const { width, height } = Dimensions.get("window");
const SharedElementStack = createSharedElementStackNavigator();
export function HomeScreenStack() {

     const iosTransitionSpec = {
      animation: "spring",
      config: {
        stiffness: 1000,
        damping: 500,
        mass: 3,
        overshootClamping: true,
        restDisplacementThreshold: 10,
        restSpeedThreshold: 10,
      },
    };
    // ...
      return (
        <SharedElementStack.Navigator
          mode="modal"
          screenOptions={{
            useNativeDriver: true,
            gestureEnabled: false,
            transitionSpec: {
              open: iosTransitionSpec,
              close: iosTransitionSpec,
            },
            cardStyleInterpolator: ({ current: { progress } }) => ({
              cardStyle: {
                opacity: progress,
              },
            }),
          }}
          headerMode="none"
        >
          <SharedElementStack.Screen name="HomeScreen" component={HomeScreen} />
          <SharedElementStack.Screen
            name="WordScreen"
            component={WordScreen}
            sharedElementsConfig={(route, otherRoute, showing) => {
              const { item } = route.params;
              if (route.name === "WordScreen" && showing) {
                // Open animation fades in image, title and description
                return [
                  {
                    id: `item.${item.word}.image`,
                    animation: 'move'
                  },
                  {
                    id: `item.${item.word}.name`,
                    animation: "fade",
                    resize: "clip",
                    align: "left-top",
                  },
                  {
                    id: `item.${item.word}.explanation`,
                    animation: "fade",
                    resize: "clip",
                    align: "left-top",
                  },
                ];
              } 
            }}
          />
        </SharedElementStack.Navigator>
  );
}
export default function HomeScreen(props) {
  const navigation : NavigationProp<any> = props.navigation;
  const [wordList, setWordList] = useState<Word[]>(words);
  const [keyWord, setKeyWord] = useState<string>("");
  const [chosenWord, setChosenWord] = useState<Word | undefined>(undefined);

  useEffect(() => {
    setWordList(words.filter((item) => item.word.toLowerCase().includes(keyWord.toLowerCase())));
  }, [keyWord]);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.title}>{VN_NAME.DICTIONARY_SCREEN}</Text>
        <View style={styles.searchArea}>
          <View style={styles.searchIconContainer}>
            <Ionicons name="ios-search" size={35} />
          </View>
          <TextInput
            style={styles.searchBar}
            value={keyWord}
            onChangeText={(text) => {
              setKeyWord(text);
            }}
          />
        </View>
        <FlatList
          style={styles.wordList}
          keyboardShouldPersistTaps={"always"}
          data={wordList}
          keyExtractor={(item, index) => item + " " + index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => navigation.push("WordScreen", { item })}
            >
              <WordCard word={item} />
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    padding: 10,
    alignItems: "center",
  },
  modal: {
    height: height * 0.7,
    width: width,
    backgroundColor: "#e8e8e8",
    position: "absolute",
    bottom: 0,
    padding: 10,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "black",
  },
  closeModal: {
    paddingHorizontal: 10,
    alignSelf: "baseline",
    marginBottom: 10,
  },
  title: {
    textAlign: "center",
    fontSize: width / 15,
  },
  wordList: {
    marginVertical: 10,
  },
  searchArea: {
    marginTop: 10,
    flexDirection: "row",
  },
  searchBar: {
    backgroundColor: "#d9d9d9",
    width: "90%",
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    height: 40,
    paddingRight: 20,
    paddingLeft: 10,
  },
  searchIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    backgroundColor: "#d9d9d9",
    paddingLeft: 10,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
});
