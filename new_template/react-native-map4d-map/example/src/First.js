import React, { useState } from 'react'
import { SafeAreaView, StyleSheet, View, Button, Image, Text } from 'react-native'

const FirstScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.content1}>
        <View style={styles.selectLocation1}>
          <Button
            title="Login"
            onPress={() => navigation.navigate("Home", { name: 'Dung' })}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  content1: {
    width: '100%',
    flex: 1,
    marginTop: 50,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectLocation1: {
    width: '90%',
    backgroundColor: '#fff'
  },
})

export default FirstScreen
