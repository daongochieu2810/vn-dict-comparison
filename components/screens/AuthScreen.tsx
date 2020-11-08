import React from 'react';
import {StyleSheet, View, Text, SafeAreaView, Platform} from 'react-native';

export default function AuthScreen() {
    return (
    <SafeAreaView style={styles.container}>
        <View>
            <Text>Auth</Text>
        </View>
    </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: Platform.OS === 'ios' ? 0 : 30,
        padding: 10,
        alignItems: 'center'
    }
})