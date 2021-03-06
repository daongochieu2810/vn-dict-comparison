import React, { useState, useEffect, useRef } from "react";
import {
  Animated,
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Modal,
  ActivityIndicator,
} from "react-native";
import { connect } from "react-redux";
import { NavigationProp } from "@react-navigation/native";
import { RootState } from "../../backend/reducers/RootReducer";
import { Ionicons } from "@expo/vector-icons";
import VN_NAME from "../../config/vn_name";
import fb from "../../backend/backend";
import WordCard, { Word } from "../cards/WordCard";
import WordScreen from "../cards/WordScreen";
import {
  setDictionary,
  addDictionary,
  delDictionary,
  editDictionary,
} from "../../backend/actions/DictionaryAction";
import {
  Dictionary,
  DictionaryState,
  DictionaryActionTypes,
} from "../../backend/types/DictionaryType";

import { AnyAction, Dispatch } from "redux";
const { width, height } = Dimensions.get("window");
const mapStateToProps = (state: RootState) => {
  return {
    dictionaryState: state.dictionaryReducer,
  };
};
const mapDispatchToProps = (dispatch: Dispatch<DictionaryActionTypes>) => {
  return {
    reduxSetDictionary: (dictionaryState: DictionaryState) => {
      dispatch(setDictionary(dictionaryState));
    },
    reduxAddDictionary: (word: Word) => {
      dispatch(addDictionary(word));
    },
    reduxDelDictionary: (word: Word) => {
      dispatch(delDictionary(word));
    },
    reduxEditDictionary: (word: Word) => {
      dispatch(editDictionary(word));
    },
  };
};
export interface HomeBasicProps {
  mounted: boolean;
}
type HomeScreenProps = ReturnType<typeof mapStateToProps> &
  HomeBasicProps &
  ReturnType<typeof mapDispatchToProps>;
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
function HomeScreen(props: HomeScreenProps) {
  const headerHeight = height / 5.5;
  const [baseList, setBaseList] = useState<Word[]>([]);
  const [wordList, setWordList] = useState<Word[]>([]);
  const [keyWord, setKeyWord] = useState<string>("");
  const [chosenWord, setChosenWord] = useState<Word | undefined>(undefined);
  const [isRetrieving, setIsRetrieving] = useState<boolean>(false);
  const ref = useRef(null);
  const scrollY = useRef(new Animated.Value(0));
  const scrollYClamped = Animated.diffClamp(scrollY.current, 0, headerHeight);
  const translateY = scrollYClamped.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -(headerHeight / 2.5)],
  });

  const translateYNumber = useRef();

  translateY.addListener(({ value }) => {
    translateYNumber.current = value;
  });
  const handleScroll = Animated.event(
    [
      {
        nativeEvent: {
          contentOffset: {
            y: scrollY.current,
          },
        },
      },
    ],
    {
      useNativeDriver: true,
    }
  );
  const getCloser = (value, checkOne, checkTwo) =>
    Math.abs(value - checkOne) < Math.abs(value - checkTwo)
      ? checkOne
      : checkTwo;

  const handleSnap = ({ nativeEvent }) => {
    const offsetY = nativeEvent.contentOffset.y;
    if (
      !(
        translateYNumber.current === 0 ||
        translateYNumber.current === -headerHeight / 2
      )
    ) {
      if (ref.current) {
        ref.current?.scrollToOffset({
          offset:
            getCloser(translateYNumber.current, -headerHeight / 2, 0) ===
            -headerHeight / 2
              ? offsetY + headerHeight / 2
              : offsetY - headerHeight / 2,
        });
      }
    }
  };
  useEffect(() => {
    setIsRetrieving(true);
    props.reduxSetDictionary({
      dictionary: {},
      size: 0,
    });
    fb.dictCollection
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(function (doc) {
          props.reduxAddDictionary(doc.data());
        });
      })
      .then(() => {
        setIsRetrieving(false);
      });
  }, [props.mounted]);
  useEffect(() => {
    let dictionaryState = props.dictionaryState;
    let allWords: Word[] = [];
    if (dictionaryState) {
      for (let key of Object.keys(dictionaryState.dictionary)) {
        allWords = [...allWords, ...dictionaryState.dictionary[key]];
      }
    }
    //console.log(allWords);
    setBaseList(allWords);
    setWordList(allWords);
  }, [props]);
  useEffect(() => {
    if (keyWord.trim() !== "") {
      setWordList(
        baseList.filter((item) =>
          item.word.toLowerCase().includes(keyWord.toLowerCase())
        )
      );
    }
  }, [keyWord]);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        {isRetrieving && (
          <View
            style={{
              width: width,
              height: height,
              position: "absolute",
              left: 0,
              top: 0,
              justifyContent: "center",
              alignContent: "center",
              backgroundColor: "#FFFFFF",
              opacity: 0.5,
              zIndex: 2,
            }}
          >
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
        <Animated.View
          style={{
            padding: 10,
            width: width,
            backgroundColor: "#ff425b",
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            transform: [
              {
                translateY,
              },
            ],
          }}
        >
          <Text style={{ ...styles.title, height: headerHeight / 2.5 }}>
            {VN_NAME.DICTIONARY_SCREEN}
          </Text>

          <View style={{ ...styles.searchArea }}>
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
        </Animated.View>
        <Animated.View
          style={{
            width: width,
            alignItems: "center",
            backgroundColor: "white",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            transform: [
              {
                translateY,
              },
            ],
          }}
        >
          <Animated.FlatList
            scrollEventThrottle={16}
            ref={ref}
            onScroll={handleScroll}
            onMomentumScrollEnd={handleSnap}
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
                onPress={() => {
                  setChosenWord(item);
                }}
              >
                <WordCard word={item} width={width * 0.9} />
              </TouchableOpacity>
            )}
          />
        </Animated.View>
      </View>
      <Modal
        visible={chosenWord ? true : false}
        animationType="slide"
        onRequestClose={() => {
          setChosenWord(undefined);
        }}
      >
        <SafeAreaView
          style={{
            width: width,
            height: height,
          }}
        >
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 5,
              }}
            >
              <TouchableOpacity
                style={{
                  marginTop: 20,
                  marginLeft: 10,
                  borderRadius: 20,
                  backgroundColor: "#ff425b",
                  alignSelf: "baseline",
                  width: 40,
                  height: 40,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => {
                  setChosenWord(undefined);
                }}
              >
                <Ionicons name="ios-arrow-round-back" size={36} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  marginTop: 20,
                  marginRight: 20,
                }}
                onPress={() => {
                  if (chosenWord) {
                    props.reduxDelDictionary(chosenWord);
                    setBaseList(baseList.filter((item) => item !== chosenWord));
                    setWordList(baseList.filter((item) => item !== chosenWord));
                    setChosenWord(undefined);
                  }
                }}
              >
                <Text style={{ fontSize: 20, color: "#ff425b" }}>Xóa</Text>
              </TouchableOpacity>
            </View>
            <WordScreen word={chosenWord} />
          </View>
        </SafeAreaView>
      </Modal>
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
