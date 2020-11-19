import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { connect } from "react-redux";
import { NavigationProp } from "@react-navigation/native";
import { RootState } from "../../backend/reducers/RootReducer";
import { Ionicons } from "@expo/vector-icons";
import VN_NAME from "../../config/vn_name";
import words from "../../data/words";
import WordCard, { Word } from "../cards/WordCard";
import WordScreen from "../cards/WordScreen";

const { width, height } = Dimensions.get("window");
const mapStateToProps = (state: RootState) => {
  return {
    dictionaryState: state.dictionaryReducer,
  };
};
type HomeScreenProps = ReturnType<typeof mapStateToProps>;
export default connect(mapStateToProps, {})(HomeScreen);
function HomeScreen(props: HomeScreenProps) {
  const [baseList, setBaseList] = useState<Word[]>([]);
  const [wordList, setWordList] = useState<Word[]>([]);
  const [keyWord, setKeyWord] = useState<string>("");
  const [chosenWord, setChosenWord] = useState<Word | undefined>(undefined);
  useEffect(() => {
    let dictionaryState = props.dictionaryState;
    let allWords: Word[] = [];
    if (dictionaryState) {
      for (let key of Object.keys(dictionaryState.dictionary)) {
        allWords = [...allWords, ...dictionaryState.dictionary[key]];
      }
    }
    console.log(allWords)
    setBaseList(allWords);
    setWordList(allWords);
  }, [props.dictionaryState]);
  useEffect(() => {
    setWordList(
      baseList.filter((item) =>
        item.word.toLowerCase().includes(keyWord.toLowerCase())
      )
    );
  }, [keyWord]);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View
          style={{
            padding: 10,
            width: width,
            backgroundColor: "#ff425b",
            borderBottomLeftRadius: 20,
          }}
        >
          <Text style={styles.title}>{VN_NAME.DICTIONARY_SCREEN}</Text>
          <View style={styles.searchArea}>
            <View style={styles.searchIconContainer}>
              <Ionicons name="ios-search" size={30} color="gray" />
            </View>
            <TextInput
              style={styles.searchBar}
              value={keyWord}
              onChangeText={(text) => {
                setKeyWord(text);
              }}
            />
          </View>
        </View>
        <View style={{ flexDirection: "row", marginBottom: -50 }}>
          <View
            style={{ width: "50%", height: 50, backgroundColor: "white" }}
          ></View>
          <View
            style={{ width: "50%", height: 50, backgroundColor: "#ff425b" }}
          ></View>
        </View>
        <View
          style={{
            width: width,
            alignItems: "center",
            backgroundColor: "white",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          <FlatList
            style={styles.wordList}
            keyboardShouldPersistTaps={"always"}
            showsVerticalScrollIndicator={false}
            data={wordList}
            keyExtractor={(item, index) => item + " " + index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={{
                  borderRadius: 10,
                  marginBottom: index === wordList.length - 1 ? 300 : 0,
                }}
                onPress={() => {}}
              >
                <WordCard word={item} />
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
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
    color: "white",
  },
  wordList: {
    marginVertical: 10,
    marginBottom: 150,
  },
  searchArea: {
    width: "100%",
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  searchBar: {
    backgroundColor: "white",
    borderTopRightRadius: 25,
    width: "85%",
    alignSelf: "stretch",
    borderBottomRightRadius: 25,
    height: 50,
    paddingRight: 20,
    paddingLeft: 10,
  },
  searchIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    backgroundColor: "white",
    paddingLeft: 20,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
  },
});
