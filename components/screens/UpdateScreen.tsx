import React, { useState, useRef, useEffect } from "react";
import {
  Animated,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  Dimensions,
  TextInput,
  Image,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Video } from "expo-av";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from "expo-image-picker";
import { connect } from "react-redux";
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
import { Word } from "../cards/WordCard";
import { RootState } from "../../backend/reducers/RootReducer";
import { AnyAction, Dispatch } from "redux";
import * as DocumentPicker from "expo-document-picker";
import AudioPlayer from "../media/AudioPlayer";
import firebase from "../../backend/backend";
import VN_NAME from "../../config/vn_name";
import Toast from "react-native-toast-message";

const { width, height } = Dimensions.get("window");

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

const mapStateToProps = (state: RootState) => {
  return {
    dictionaryState: state.dictionaryReducer,
  };
};
type UpdateScreenProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;
export default connect(mapStateToProps, mapDispatchToProps)(UpdateScreen);
function UpdateScreen(props: UpdateScreenProps) {
  const [name, setName] = useState<string>("");
  const [explanation, setExplanation] = useState<string>("");
  const [groupComp, setGroupComp] = useState<Word>(null);
  const [groupCompText, setGroupCompText] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [compError, setCompError] = useState<boolean>(false);
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const [image, setImage] = useState<string>("");
  const [video, setVideo] = useState<string>("");
  const [audio, setAudio] = useState<string>("");

  const [groups, setGroups] = useState<Word[]>([]);
  const [groupSuggestion, setGroupSuggestion] = useState<Word[]>([]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    let dictionaryState = props.dictionaryState;
    let allWords: Word[] = [];
    if (dictionaryState) {
      for (let key of Object.keys(dictionaryState.dictionary)) {
        allWords = [...allWords, ...dictionaryState.dictionary[key]];
      }
    }
    setGroups(allWords);
  }, [props]);
  const fadeIn = () => {
    setShowDropDown(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };
  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setShowDropDown(false);
  };
  const uploadData = async (url: string, id: string, type: string) => {
    try {
      const blob: Blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", url, true);
        xhr.send(null);
      });
      const extension = blob.type.split("/")[1];

      const ref = firebase.storage
        .ref()
        .child(`dictionary/${id}/${type}.${extension}`);
      const snapshot = await ref.put(blob);
      const downloadUrl = await snapshot.ref.getDownloadURL();
      return downloadUrl;
    } catch (e) {
      console.log(e);
    }
  };
  const submit = async () => {
    setIsUploading(true);
    const dictionaryState = props.dictionaryState;
    const id = dictionaryState.size.toString();
    if (
      name === "" ||
      explanation === "" ||
      groupComp === null ||
      type === ""
    ) {
      setError("Chưa đủ thông tin!");
      return;
    }
    let imageUrl = "",
      audioUrl = "",
      videoUrl = "";
    if (image !== "") {
      imageUrl = await uploadData(image, id, "image");
    }
    if (audio !== "") {
      audioUrl = await uploadData(audio, id, "audio");
    }
    if (video !== "") {
      videoUrl = await uploadData(video, id, "video");
    }
    let word: Word = {
      id: id,
      word: name,
      type: type,
      groupComp: groupComp,
      explanation: explanation,
      image: imageUrl,
      audio: audioUrl,
      video: videoUrl,
    };
    let dictCollection = firebase.dictCollection;
    await dictCollection.add(word).catch((e) => console.log(e));
    if (!props.dictionaryState) {
      props.reduxSetDictionary({
        dictionary: {},
        size: 0,
      });
    }
    props.reduxAddDictionary(word);
    setIsUploading(false);
    Toast.show({
      type: "success",
      position: "top",
      text1: 'Đã thêm từ',
      text2: "Thành công",
      visibilityTime: 3000,
      autoHide: true,
    });
  };
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };
  const pickDocument = async (type: string) => {
    let result = await DocumentPicker.getDocumentAsync({
      type: type,
      copyToCacheDirectory: false,
    });
    if (result.type !== "cancel") {
      if (type === "audio/*") {
        setAudio(result.uri);
      } else if (type === "video/*") {
        setVideo(result.uri);
      }
    }
  };

  return (
    <SafeAreaView>
      {isUploading && (
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
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        resetScrollToCoords={{ x: 0, y: 0 }}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        scrollEnabled={true}
        enableAutomaticScroll={Platform.OS === "ios"}
      >
        <>
          <View
            style={{
              paddingBottom: 20,
              width: width,
              backgroundColor: "#ff425b",
              borderBottomLeftRadius: 20,
            }}
          >
            <Text style={styles.title}>{VN_NAME.UPDATE_SCREEN}</Text>
          </View>
          <View style={{ flexDirection: "row", marginBottom: -50 }}>
            <View
              style={{ width: "50%", height: 50, backgroundColor: "white" }}
            ></View>
            <View
              style={{ width: "50%", height: 50, backgroundColor: "#ff425b" }}
            ></View>
          </View>
          <View style={styles.container}>
            <View style={styles.form}>
              <Text style={styles.updateTitle}>{VN_NAME.UPDATE_NAME}</Text>
              <TextInput
                style={styles.updateInput}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                }}
              />

              <Text style={styles.updateTitle}>
                {VN_NAME.UPDATE_EXPLANATION}
              </Text>
              <TextInput
                style={styles.updateInput}
                value={explanation}
                onChangeText={(text) => {
                  setExplanation(text);
                }}
              />
              <Text style={styles.updateTitle}>{VN_NAME.UPDATE_TYPE}</Text>
              <TextInput
                style={styles.updateInput}
                value={type}
                onChangeText={(text) => {
                  setType(text);
                }}
              />

              <Text style={styles.updateTitle}>{VN_NAME.UPDATE_GROUP}</Text>
              <TextInput
                style={{
                  ...styles.updateInput,
                  color: compError ? "red" : "black",
                }}
                onBlur={() => {
                  if (groupComp === null) {
                    setCompError(true);
                  }
                }}
                onFocus={() => {
                  setCompError(false);
                }}
                value={groupCompText}
                onChangeText={(text) => {
                  if (text !== "") {
                    let currSuggestions = [];
                    for (let group of groups) {
                      if (
                        group.word.toLowerCase().includes(text.toLowerCase())
                      ) {
                        currSuggestions.push(group);
                      }
                    }
                    if (currSuggestions.length > 0) {
                      setCompError(false);
                      fadeIn();
                    } else {
                      setCompError(true);
                      fadeOut();
                    }
                    setGroupSuggestion(currSuggestions);
                  } else {
                    setCompError(false);
                    fadeOut();
                  }
                  setGroupCompText(text);
                }}
              />
              {compError && (
                <View style={{ marginBottom: 10 }}>
                  <Text style={{ color: "red" }}>
                    Không tìm thấy từ, sẽ được bỏ trống
                  </Text>
                </View>
              )}

              {showDropDown && (
                <Animated.View
                  style={{ ...styles.dropDown, opacity: fadeAnim }}
                >
                  <FlatList
                    data={groupSuggestion}
                    horizontal={true}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                      <TouchableOpacity
                        style={styles.drowDownOption}
                        onPress={() => {
                          setGroupComp(item);
                          setGroupCompText(item.word);
                          fadeOut();
                        }}
                      >
                        <Text>{item.word}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </Animated.View>
              )}

              <Text
                style={{
                  ...styles.updateTitle,
                  marginTop: showDropDown ? -20 : 0,
                }}
              >
                {VN_NAME.UPDATE_IMAGE}
              </Text>
              <View style={{ alignSelf: "baseline" }}>
                <TouchableOpacity
                  style={styles.chooseImage}
                  onPress={() => {
                    pickImage();
                  }}
                >
                  <Text style={{ color: "white" }}>{VN_NAME.CHOOSE_IMAGE}</Text>
                </TouchableOpacity>
              </View>
              {image !== null && image !== "" && (
                <Image source={{ uri: image }} style={styles.image} />
              )}
              <Text
                style={{
                  ...styles.updateTitle,
                  marginTop: 10,
                }}
              >
                {VN_NAME.UPDATE_AUDIO}
              </Text>
              <View style={{ alignSelf: "baseline" }}>
                <TouchableOpacity
                  style={styles.chooseImage}
                  onPress={() => {
                    pickDocument("audio/*");
                  }}
                >
                  <Text style={{ color: "white" }}>{VN_NAME.CHOOSE_AUDIO}</Text>
                </TouchableOpacity>
              </View>
              {audio !== null && audio !== "" && (
                <View>
                  <AudioPlayer uri={audio} />
                </View>
              )}
              <Text
                style={{
                  ...styles.updateTitle,
                  marginTop: 10,
                }}
              >
                {VN_NAME.UPDATE_VIDEO}
              </Text>
              <View style={{ alignSelf: "baseline" }}>
                <TouchableOpacity
                  style={styles.chooseImage}
                  onPress={() => {
                    pickDocument("video/*");
                  }}
                >
                  <Text style={{ color: "white" }}>{VN_NAME.CHOOSE_VIDEO}</Text>
                </TouchableOpacity>
              </View>
              {video !== null && video !== "" && (
                <View
                  style={{
                    marginTop: 10,
                    alignItems: "center",
                  }}
                >
                  <Video
                    source={{
                      uri: video,
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
              {error !== "" && (
                <Text style={{ color: "red", marginTop: 20 }}>{error}</Text>
              )}
              <TouchableOpacity style={styles.submitButton} onPress={submit}>
                <Text style={{ color: "white", textAlign: "center" }}>
                  {VN_NAME.UPLOAD}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    width: width,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  image: {
    width: width * 0.88,
    height: height * 0.3,
    borderRadius: 5,
    marginTop: 10,
  },
  chooseImage: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: "#ff425b",
    marginTop: 10,
  },
  drowDownOption: {
    padding: 5,
    paddingHorizontal: 10,
    backgroundColor: "white",
    marginRight: 10,
    borderRadius: 5,
  },
  dropDown: {
    backgroundColor: "black",
    zIndex: 1,
    marginTop: -20,
    borderRadius: 5,
    height: 40,
    padding: 5,
  },
  title: {
    fontSize: width / 15,
    textAlign: "center",
    marginTop: 20,
    color: "white",
  },
  updateTitle: {
    fontSize: width / 23,
  },
  updateInput: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 50,
    marginBottom: 20,
    marginHorizontal: 5,
  },
  form: {
    marginTop: 20,
    marginHorizontal: 5,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 20,
    shadowColor: "black",
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  submitButton: {
    borderRadius: 5,
    backgroundColor: "#1c6bff",
    paddingVertical: 10,
    marginTop: 20,
  },
});
