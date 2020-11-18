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
  ColorPropType,
} from "react-native";
import { connect } from "react-redux";
import { NavigationProp } from "@react-navigation/native";
import { RootState } from "../../backend/reducers/RootReducer";
import { Ionicons } from "@expo/vector-icons";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import VN_NAME from "../../config/vn_name";
import words from "../../data/words";
import WordCard, { Word } from "../cards/WordCard";
import WordScreen from "../cards/WordScreen";

const { width, height } = Dimensions.get("window");
const SharedElementStack = createSharedElementStackNavigator();
const mapStateToProps = (state: RootState) => {
  return {
    dictionaryState: state.dictionaryReducer,
  };
};
type HomeScreenProps = ReturnType<typeof mapStateToProps>;
export default connect(mapStateToProps, {})(HomeScreenStack);
function HomeScreenStack(props: HomeScreenProps) {
  useEffect(() => {
    console.log("HELLO HOME");
    console.log(props.dictionaryState);
    if (props.dictionaryState) {
      let dictionary = props.dictionaryState.dictionary;
      for (let key of Object.keys(dictionary)) {
        console.log(key);
      }
    }
  }, [props.dictionaryState]);
  return (
    <SharedElementStack.Navigator
      mode="modal"
      screenOptions={{
        gestureEnabled: false,
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
            return [
              {
                id: `item.${item.word}.image`,
                animation: "move",
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
function HomeScreen(props) {
  const navigation: NavigationProp<any> = props.navigation;
  const [wordList, setWordList] = useState<Word[]>(words);
  const [keyWord, setKeyWord] = useState<string>("");
  const [chosenWord, setChosenWord] = useState<Word | undefined>(undefined);

  useEffect(() => {
    setWordList(
      words.filter((item) =>
        item.word.toLowerCase().includes(keyWord.toLowerCase())
      )
    );
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
    marginBottom: 150,
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
