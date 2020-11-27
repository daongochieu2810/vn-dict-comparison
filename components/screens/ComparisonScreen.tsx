import React, { useState, useEffect, useRef } from "react";
import {
  Animated,
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
import WordCard, { Word } from "../cards/WordCard";
import WordScreen from "../cards/WordScreen";

const { height, width } = Dimensions.get("window");
const mapStateToProps = (state: RootState) => {
  return {
    dictionaryState: state.dictionaryReducer,
  };
};
export interface ComparisonBasicProps {
  mounted: boolean;
}
type ComparisonScreenProps = ReturnType<typeof mapStateToProps> &
  ComparisonBasicProps;
export default connect(mapStateToProps, {})(ComparisonScreen);
function ComparisonScreen(props: ComparisonScreenProps) {
  const headerHeight = height / 5.5;
  const [baseList, setBaseList] = useState<Word[]>([]);
  const [wordList, setWordList] = useState<Word[]>([]);
  const [keyWord, setKeyWord] = useState<string>("");
  const [chosenWord, setChosenWord] = useState<Word | undefined>();

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
    let dictionaryState = props.dictionaryState;
    let allWords: Word[] = [];
    if (dictionaryState) {
      for (let key of Object.keys(dictionaryState.dictionary)) {
        allWords = [...allWords, ...dictionaryState.dictionary[key]];
      }
    }
    allWords = allWords.filter((item) => item.groupComp !== null);
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
        <Animated.View
          style={{
            width: width,
            padding: 10,
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
            {VN_NAME.COMPARISON_SCREEN}
          </Text>
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
            style={{
              backgroundColor: "white",
            }}
            scrollEventThrottle={16}
            ref={ref}
            onScroll={handleScroll}
            onMomentumScrollEnd={handleSnap}
            showsVerticalScrollIndicator={false}
            data={wordList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View
                style={{
                  flexDirection: "row",
                  borderRadius: 10,
                  marginTop: 10,
                  marginBottom: index === wordList.length - 1 ? 300 : 0,
                }}
              >
                <TouchableOpacity
                  style={{
                    borderRadius: 10,
                  }}
                  onPress={() => {
                    setChosenWord(item);
                  }}
                >
                  <WordCard word={item} width={width * 0.43} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    borderRadius: 10,
                  }}
                  onPress={() => {
                    setChosenWord(item.groupComp);
                  }}
                >
                  <WordCard word={item.groupComp} width={width * 0.43} />
                </TouchableOpacity>
              </View>
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
    width: "50%",
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
