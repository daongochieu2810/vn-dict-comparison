import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  SafeAreaView,
  Dimensions,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RootState } from "../../backend/reducers/RootReducer";
import { connect } from "react-redux";
import VN_NAME from "../../config/vn_name";
import words from "../../data/words";
import { Word } from "../cards/WordCard";
import WordScreen from "../cards/WordScreen";

const { height, width } = Dimensions.get("window");
const mapStateToProps = (state: RootState) => {
  return {
    dictionaryState: state.dictionaryReducer,
  };
};
type ComparisonScreenProps = ReturnType<typeof mapStateToProps>;
export default connect(mapStateToProps, {})(ComparisonScreen);
function ComparisonScreen(props: ComparisonScreenProps) {
  const [baseList, setBaseList] = useState<Word[]>([]);
  const [wordList, setWordList] = useState<Word[]>([]);
  const [keyWord, setKeyWord] = useState<string>();
  const [chosenWord, setChosenWord] = useState<Word | undefined>();

  useEffect(() => {
    let dictionaryState = props.dictionaryState;
    let allWords: Word[] = [];
    if (dictionaryState) {
      for (let key of Object.keys(dictionaryState.dictionary)) {
        allWords = [...allWords, ...dictionaryState.dictionary[key]];
      }
    }
    setBaseList(allWords);
    setWordList(allWords);
  }, [props.dictionaryState]);
  useEffect(() => {
    setWordList(baseList.filter((item) => item.word.includes(keyWord || "")));
  }, [keyWord]);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View
          style={{
            width: width,
            padding: 10,
            backgroundColor: "#ff425b",
            borderBottomLeftRadius: 20,
          }}
        >
          <Text style={styles.title}>{VN_NAME.COMPARISON_SCREEN}</Text>
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
            paddingHorizontal: 10,
            paddingVertical: 20,
            width: width,
            alignItems: "center",
            backgroundColor: "white",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          <FlatList
            style={{
              width: width - 40,
              shadowColor: "black",
              shadowOffset: { width: 10, height: 10 },
              shadowOpacity: 0.1,
              shadowRadius: 10,
              elevation: 5,
              backgroundColor: "white",
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: "#ff425b",
              borderRadius: 20,
              marginBottom: 200,
            }}
            showsVerticalScrollIndicator={false}
            data={wordList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => {
                  setChosenWord(item);
                }}
                style={styles.compCard}
              >
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.word}>
                    {item.word}
                  </Text>
                  <Text style={styles.word}>
                    {item.word}
                  </Text>
                </View>
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
    height: height,
  },
  title: {
    color: "white",
    fontSize: width / 15,
    textAlign: "center",
  },
  compCard: {
    padding: 10,
    width: "100%",
    alignItems: "center",
  },
  word: {
    textAlign: "center",
    width: "50%"
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
    marginBottom: 10,
    alignSelf: "baseline",
  },
});
