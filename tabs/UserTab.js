import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, Alert } from 'react-native';
import tw from 'twrnc';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; 

const UserTab = () => {
  const [userData, setUserData] = useState(null);
  const [devices, setDevices] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const navigation = useNavigation(); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await AsyncStorage.getItem('userData');
        if (data) {
          setUserData(JSON.parse(data));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleChatPress = async () => {
      navigation.navigate('ChatRedirect'); 
    
  };

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      {userData && userData.coordinates ? (
        <MapView
          style={tw`flex-1`}
          initialRegion={{
            latitude: userData.coordinates.latitude,
            longitude: userData.coordinates.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: userData.coordinates.latitude,
              longitude: userData.coordinates.longitude,
            }}
            title={userData.name} 
            description={`Location: ${userData.coordinates.latitude}, ${userData.coordinates.longitude}`} 
          />
        </MapView>
      ) : (
        <View style={tw`flex-1 justify-center items-center`}>
          <Text style={tw`text-lg text-center`}>Please enter valid coordinates to view the map.</Text>
        </View>
      )}

      <View style={tw`flex-row justify-around items-center bg-white p-4 shadow-md`}>
        <TouchableOpacity style={tw`flex-1`} onPress={handleChatPress}>
          <Text style={tw`text-center text-lg text-orange-600`}>Găsește Dispozitive</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UserTab;
