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
import { Ionicons } from "@expo/vector-icons";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import VN_NAME from "../../config/vn_name";
import words from "../../data/words";
import WordCard, { Word } from "../cards/WordCard";
import WordScreen from "../cards/WordScreen";

const { width, height } = Dimensions.get("window");
const Stack = createSharedElementStackNavigator();
export function HomeScreenStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={() => ({
          headerShown: false,
        })}
      />
      <Stack.Screen
        name="WordScreen"
        component={WordScreen}
        options={(navigation) => ({
          headerShown: false,
        })}
        sharedElementsConfig={(route) => {
          const { data } = route.params;
          if (data.word) {
            return [
              {
                id: `${data.word}.image`,
                animation: "move",
                resize: "clip",
                align: "center-top",
              },
              {
                id: `${data.word}.name`,
                animation: "fade",
                resize: "clip",
                align: "left-center",
              },
            ];
          }
        }}
      />
    </Stack.Navigator>
  );
}
export default function HomeScreen({ navigation }) {
  const [wordList, setWordList] = useState<Word[]>(words);
  const [keyWord, setKeyWord] = useState<string>("");
  const [chosenWord, setChosenWord] = useState<Word | undefined>(undefined);

  useEffect(() => {
    setWordList(words.filter((item) => item.word.includes(keyWord)));
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
          keyboardShouldPersistTaps={"handled"}
          data={wordList}
          keyExtractor={(item, index) => item + " " + index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => navigation.push("WordScreen", { data: item })}
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
