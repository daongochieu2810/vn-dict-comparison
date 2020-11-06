import React from 'react';
import { StyleSheet, View, Text, Dimensions, Image} from 'react-native';

const { width, height } = Dimensions.get('window');

export interface Word {
    word: string;
    explanation: string;
    image: string;
}

interface WordCardProps {
    word: Word;
}

export default function WordCard(props : WordCardProps) {
    return (
        <View style={styles.container}>
            <View style={{flex: 1}}>
            <Text style={styles.mainWord}>
                {props.word.word}
            </Text>
            <Text style={styles.explanation} numberOfLines={Math.floor(height / 100) - 1}>
                {props.word.explanation}
            </Text>
            </View>
            <Image source={{uri: props.word.image}} resizeMode='cover' style={styles.wordImage}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 10,
        width: width * 0.9,
        maxHeight: height * 0.25,
        padding: 10,
        margin: 10
    },
    mainWord: {
        fontWeight: 'bold',
        fontSize: 18,
        margin: 5
    },
    explanation: {
        padding: 5,
        marginRight: 5
    },
    wordImage: {
        width: width * 0.4,
        height: height * 0.2,
        borderRadius: 10
    }
})