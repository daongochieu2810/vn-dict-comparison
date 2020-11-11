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
  StatusBar
} from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from "expo-image-picker";
import { connect } from "react-redux";
import { setDictionary } from "../../backend/actions/DictionaryAction";
import {
  Dictionary,
  DictionaryState,
  DictionaryActionTypes,
} from "../../backend/types/DictionaryType";
import { RootState } from "../../backend/reducers/RootReducer";
import { AnyAction, Dispatch } from "redux";
import * as DocumentPicker from "expo-document-picker";
import VN_NAME from "../../config/vn_name";

const { width, height } = Dimensions.get("window");

const groups = ["n-l", "n-l", "n -l"];

const mapDispatchToProps = (dispatch: Dispatch<DictionaryActionTypes>) => {
  return {
    reduxSetDictionary: (dictionaryState: DictionaryState) => {
      dispatch(setDictionary(dictionaryState));
    },
  };
};

const mapStateToProps = (state: RootState) => {
  return {
    dictionaryReducer: state.dictionaryReducer,
  };
};
type UpdateScreenProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;
export default connect(mapStateToProps, mapDispatchToProps)(UpdateScreen);
function UpdateScreen(props: UpdateScreenProps) {
  const [name, setName] = useState<string>("");
  const [explanation, setExplanation] = useState<string>("");
  const [groupComp, setGroupComp] = useState<string>("");
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const [image, setImage] = useState<string>("");
  const fadeAnim = useRef(new Animated.Value(0)).current;

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
    console.log(result);
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <Text style={styles.title}>{VN_NAME.UPDATE_SCREEN}</Text>
        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          enableOnAndroid={true}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={true}
          enableAutomaticScroll={Platform.OS === "ios"}
        >
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

              <Text style={styles.updateTitle}>{VN_NAME.UPDATE_GROUP}</Text>
              <TextInput
                style={styles.updateInput}
                value={groupComp}
                onChangeText={(text) => {
                  if (text !== "") {
                    fadeIn();
                  } else {
                    fadeOut();
                  }
                  setGroupComp(text);
                }}
              />
              {showDropDown && (
                <Animated.View
                  style={{ ...styles.dropDown, opacity: fadeAnim }}
                >
                  <FlatList
                    data={groups}
                    horizontal={true}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                      <TouchableOpacity style={styles.drowDownOption}>
                        <Text>{item}</Text>
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
              <TouchableOpacity
                style={styles.chooseImage}
                onPress={() => {
                  pickImage();
                }}
              >
                <Text style={{ color: "white" }}>{VN_NAME.CHOOSE_IMAGE}</Text>
              </TouchableOpacity>
              {image !== "" && (
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
              <TouchableOpacity
                style={styles.chooseImage}
                onPress={() => {
                  pickDocument("audio/*");
                }}
              >
                <Text style={{ color: "white" }}>{VN_NAME.CHOOSE_AUDIO}</Text>
              </TouchableOpacity>
              <Text
                style={{
                  ...styles.updateTitle,
                  marginTop: 10,
                }}
              >
                {VN_NAME.UPDATE_VIDEO}
              </Text>
              <TouchableOpacity
                style={styles.chooseImage}
                onPress={() => {
                  pickDocument("video/*");
                }}
              >
                <Text style={{ color: "white" }}>{VN_NAME.CHOOSE_VIDEO}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.submitButton}>
                <Text style={{ color: "white", textAlign: "center" }}>
                  {VN_NAME.UPLOAD}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    marginHorizontal: 5
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
    backgroundColor: "black",
    alignSelf: "baseline",
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
  },
  updateTitle: {
    fontSize: width / 23,
  },
  updateInput: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: height / 25,
    marginBottom: 20,
    marginHorizontal: 5,
  },
  form: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    shadowOpacity: 0.2,
    paddingVertical: 20,
  },
  submitButton: {
    borderRadius: 5,
    backgroundColor: "#1c6bff",
    paddingVertical: 10,
    marginTop: 20,
  },
});
