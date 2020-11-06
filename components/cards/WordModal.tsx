import React from 'react'
import { StyleSheet, View, Text, Image, ScrollView, Dimensions } from 'react-native';
import { Word } from './WordCard';

const { width, height } = Dimensions.get('window');

interface WordModalProps {
    word: Word | undefined
}
export default function WordModal(props : WordModalProps) {
    return (
        <ScrollView>
            <Image source={{uri: props.word?.image}} resizeMode='cover' style={styles.wordImage}/>
            <Text style={styles.mainWord}>
                {props.word?.word}
            </Text>
            <Text style={styles.explanation}>
                {props.word?.explanation}
            </Text>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    mainWord: {
        fontWeight: 'bold',
        fontSize: 18,
        margin: 5,
        marginTop: 10
    },
    explanation: {
        padding: 5,
        marginRight: 5
    },
    wordImage: {
        width: width * 0.95,
        height: height * 0.4,
        borderRadius: 10
    }
})