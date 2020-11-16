import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Audio } from "expo-av";
export interface AudioPlayerProps {
  uri: string;
}

export default function AudioPlayer(props: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackInstance, setPlaybackInstance] = useState(null);
  const [volume, setVolume] = useState<number>(1.0);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const size = 40;

  const onPlaybackStatusUpdate = (status) => {
    setIsBuffering(status.isBuffering);
  };
  const loadAudio = async () => {
    try {
      const _playbackInstance = new Audio.Sound();
      const source = { uri: props.uri };
      const status = {
        shouldPlay: isPlaying,
        volume,
      };
      _playbackInstance.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      await _playbackInstance.loadAsync(source, status, false);
      await _playbackInstance.setIsLoopingAsync(true);
      setPlaybackInstance(_playbackInstance);
    } catch (e) {
      console.log(e);
    }
  };
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };
  useEffect(() => {
    if (playbackInstance) {
      !isPlaying
        ? playbackInstance?.pauseAsync()
        : playbackInstance?.playAsync();
    }
  }, [isPlaying]);
  const audioSetup = async () => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
      shouldDuckAndroid: true,
      staysActiveInBackground: true,
      playThroughEarpieceAndroid: false,
    });
    loadAudio();
  };

  useEffect(() => {
    if (props.uri && props.uri !== "") {
      audioSetup();
    }
  }, [props]);

  return (
    <View style={{ width: "100%" }}>
      <View style={styles.controls}>
        <TouchableOpacity 
            style={{
                margin: 10,
                marginLeft: 20
            }}
        onPress={() => togglePlayback()}>
          {isPlaying ? (
            <Ionicons name="ios-pause" size={size} color="white" />
          ) : (
            <Ionicons name="ios-play-circle" size={size} color="white" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  controls: {
    flexDirection: "row",
    width: "100%",
    marginTop: 15,
    backgroundColor: "black",
    borderRadius: 10
  },
});
