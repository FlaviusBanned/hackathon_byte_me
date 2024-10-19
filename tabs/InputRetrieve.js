import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import tw from "twrnc";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

const InputRetrieve = ({ navigation }) => {
  const [name, setName] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationPermission, setLocationPermission] = useState(false);

  useEffect(() => {
    const getLocationPermission = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission to access location was denied");
          return;
        }
        setLocationPermission(true);
        getCurrentLocation(); 
      } catch (error) {
        Alert.alert("Error requesting location permission. Please try again.");
        console.error("Location permission error:", error);
      }
    };

    getLocationPermission();
  }, []);

  const getCurrentLocation = async () => {
    try {
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High, 
            });
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
    } catch (error) {
      Alert.alert("Error fetching location. Please try again.");
      console.error("Error fetching location:", error);
    }
  };

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

    
      await AsyncStorage.setItem("userData", JSON.stringify(userData));

    
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
          If you want to survive, I suggest you complete this:
        </Text>
        <TextInput
          style={tw`border border-gray-300 rounded-lg p-3 mb-2 shadow-md bg-white`}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor="#FF6347"
        />

        <View style={tw`w-4/5 p-6 items-center justify-center ml-9`}>
  <TouchableOpacity
    onPress={handleCoordinatesSubmit}
    style={tw`bg-[#FF6347] py-3 px-6 rounded-full shadow-lg`}
  >
    <Text style={tw`text-white text-lg text-center`}>Submit</Text>
  </TouchableOpacity>
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
  tipsContainer: {
    marginTop: 0,
    paddingHorizontal: 20,
  },
});

export default InputRetrieve;
