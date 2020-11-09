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

import VN_NAME from "../../config/vn_name";
import words from "../../data/words";
import { Word } from "../cards/WordCard";
import WordModal from "../cards/WordModal";

const { height, width } = Dimensions.get("window");

export default function ComparisonScreen() {
  const [wordList, setWordList] = useState<Word[]>(words);
  const [keyWord, setKeyWord] = useState<string>();
  const [chosenWord, setChosenWord] = useState<Word | undefined>();

  useEffect(() => {
    setWordList(words.filter((item) => item.word.includes(keyWord || "")));
  }, [keyWord]);
  
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.title}>{VN_NAME.COMPARISON_SCREEN}</Text>
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
        <View
          style={{ flexDirection: "row", marginTop: 15, paddingHorizontal: 5 }}
        >
          <FlatList
            data={wordList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => {
                    setChosenWord(item);
                }}
                style={{
                  ...styles.compCard,
                  borderTopLeftRadius: index === 0 ? 10 : 0,
                  borderBottomLeftRadius: index === words.length - 1 ? 10 : 0,
                }}
              >
                <Text style={styles.word}>{item.word}</Text>
              </TouchableOpacity>
            )}
          />
          <FlatList
            data={wordList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => {
                  setChosenWord(item);
                }}
                style={{
                  ...styles.compCard,
                  borderTopRightRadius: index === 0 ? 10 : 0,
                  borderBottomRightRadius: index === words.length - 1 ? 10 : 0,
                }}
              >
                <Text style={styles.word}>{item.word}</Text>
              </TouchableOpacity>
            )}
          />
          <Modal
            transparent={true}
            visible={chosenWord ? true : false}
            animationType="slide"
          >
            <SafeAreaView style={{ flex: 1, backgroundColor: "#00000080" }}>
              <View style={styles.modal}>
                <TouchableOpacity
                  style={styles.closeModal}
                  onPress={() => {
                    setChosenWord(undefined);
                  }}
                >
                  <Ionicons name="ios-close" size={40} color="red" />
                </TouchableOpacity>
                <WordModal word={chosenWord} />
              </View>
            </SafeAreaView>
          </Modal>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === "ios" ? 0 : 30,
    padding: 10,
    alignItems: "center",
    height: height,
  },
  title: {
    fontSize: width / 15,
    textAlign: "center",
  },
  compCard: {
    padding: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  word: {
    textAlign: "center",
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
