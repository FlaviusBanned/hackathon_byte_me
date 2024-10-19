import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';

const InputRetrieve = ({ navigation }) => {
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const handleCoordinatesSubmit = async () => {
    if (!name || !latitude || !longitude) {
      Alert.alert('Please enter your name and valid coordinates');
      return;
    }
    
    const latNum = parseFloat(latitude);
    const longNum = parseFloat(longitude);
    
    if (isNaN(latNum) || isNaN(longNum) || latNum < -90 || latNum > 90 || longNum < -180 || longNum > 180) {
      Alert.alert('Please enter valid numeric coordinates within the ranges:\nLatitude: -90 to 90\nLongitude: -180 to 180');
      return;
    }
  
    try {
      const userData = {
        name: name.trim(),
        coordinates: {
          latitude: latNum,
          longitude: longNum,
        },
      };

      await AsyncStorage.setItem('userData', JSON.stringify(userData));
  
      navigation.navigate('Escape');
    } catch (error) {
      console.error('Error saving data:', error);
      Alert.alert('Error saving data. Please try again.');
    }
  };
  

  return (
    <View style={tw`flex-1 bg-gray-100 p-4`}>
      <View style={styles.formContainer}>
        <Text style={tw`text-2xl text-center mb-2`}>
          If you want to survive, I suggest you complete these:
        </Text>
        <TextInput
          style={tw`border border-gray-300 rounded-lg p-3 mb-2 shadow-md bg-white`}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor="#FF6347"
        />
        <TextInput
          style={tw`border border-gray-300 rounded-lg p-3 mb-2 shadow-md bg-white`}
          value={latitude}
          onChangeText={setLatitude}
          placeholder="Enter your latitude (e.g., 45.6350)"
          placeholderTextColor="#FF6347"
          keyboardType="numeric"
        />
        <TextInput
          style={tw`border border-gray-300 rounded-lg p-3 mb-2 shadow-md bg-white`}
          value={longitude}
          onChangeText={setLongitude}
          placeholder="Enter your longitude (e.g., 25.5925)"
          placeholderTextColor="#FF6347"
          keyboardType="numeric"
        />

        <View style={styles.buttonContainer}>
          <Button title="Submit" onPress={handleCoordinatesSubmit} color="#FF6347" />
        </View>
      </View>

      <View style={styles.tipsContainer}>
        <Text style={tw`text-xl text-center`}>Tips:</Text>
        <Text style={tw`text-sm text-gray-600 text-center mt-2`}>
          You can use your GPS, compass, or beacons to find your coordinates quickly. Time is ticking!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 10,
    width: '50%',
    alignSelf: 'center',
  },
  tipsContainer: {
    marginTop: 0,
    paddingHorizontal: 20,
  },
});

export default InputRetrieve;
