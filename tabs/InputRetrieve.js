import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import tw from "twrnc";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

const InputRetrieve = ({ navigation }) => {
  const [name, setName] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationPermission, setLocationPermission] = useState(false);

  // Request location permission and fetch current location
  useEffect(() => {
    const getLocationPermission = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission to access location was denied");
          return;
        }
        setLocationPermission(true);
        getCurrentLocation(); // Fetch location after permission is granted
      } catch (error) {
        Alert.alert("Error requesting location permission. Please try again.");
        console.error("Location permission error:", error);
      }
    };

    getLocationPermission();
  }, []);

  // Get the current location
  const getCurrentLocation = async () => {
    try {
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High, // Use high accuracy for better results
      });
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
    } catch (error) {
      Alert.alert("Error fetching location. Please try again.");
      console.error("Error fetching location:", error);
    }
  };

  // Handle the form submission
  const handleCoordinatesSubmit = async () => {
    if (!name.trim() || latitude === null || longitude === null) {
      Alert.alert(
        "Please enter your name and make sure your location is detected."
      );
      return;
    }

    try {
      const userData = {
        name: name.trim(),
        coordinates: {
          latitude,
          longitude,
        },
      };

      // Save user data to AsyncStorage
      await AsyncStorage.setItem("userData", JSON.stringify(userData));

      // Navigate to the next screen after storing data
      navigation.navigate("Escape");
    } catch (error) {
      console.error("Error saving data:", error);
      Alert.alert("Error saving data. Please try again.");
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

        <View style={styles.buttonContainer}>
          <Button
            title="Submit"
            onPress={handleCoordinatesSubmit}
            color="#FF6347"
          />
        </View>
      </View>

      <View style={styles.tipsContainer}>
        <Text style={tw`text-xl text-center`}>Tips:</Text>
        <Text style={tw`text-sm text-gray-600 text-center mt-2`}>
          Your GPS will help us track your location. Ensure it's enabled for
          survival!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    justifyContent: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 10,
    width: "50%",
    alignSelf: "center",
  },
  tipsContainer: {
    marginTop: 0,
    paddingHorizontal: 20,
  },
});

export default InputRetrieve;
