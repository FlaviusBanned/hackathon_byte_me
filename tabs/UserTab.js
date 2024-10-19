import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, Alert, FlatList } from 'react-native';
import tw from 'twrnc';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Bluetooth from 'react-native-bluetooth-classic';
import ChatBlue from '../chat_component/ChatBlue'; 

const UserTab = () => {
  const [userData, setUserData] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [devices, setDevices] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

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
    const isEnabled = await Bluetooth.isEnabled();
    if (!isEnabled) {
      Alert.alert(
        'Bluetooth Disabled',
        'Please turn on Bluetooth to enable chat functionality.',
        [
          {
            text: 'OK',
            onPress: () => {
              Bluetooth.enable(); 
            },
          },
        ]
      );
    } else {
      setIsChatOpen(true);
      startBluetoothChat();
    }
  };

  const startBluetoothChat = async () => {
    try {
      setIsSearching(true); 
      const discoveredDevices = await Bluetooth.discover();
      setIsSearching(false); 

      if (discoveredDevices.length > 0) {
        const deviceNames = discoveredDevices.map(device => device.name).join(', ');
        setDevices(discoveredDevices); 
        Alert.alert('Nearby Devices', `Found devices: ${deviceNames}`);
      } else {
        Alert.alert('No devices found', 'No nearby Bluetooth devices were found.');
      }
    } catch (error) {
      console.error('Bluetooth error:', error);
      setIsSearching(false); 
      Alert.alert('Bluetooth error', 'An error occurred while discovering devices.');
    }
  };

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      {userData && userData.coordinates ? (
      <MapView
      style={tw`flex-1`}
      initialRegion={{
        latitude: usersData[0]?.coordinates.latitude || 0,
        longitude: usersData[0]?.coordinates.longitude || 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      {usersData.map((user, index) => (
        <Marker
          key={index}
          coordinate={{
            latitude: user.coordinates.latitude,
            longitude: user.coordinates.longitude,
          }}
          title={user.name}
          description={`Location: ${user.coordinates.latitude}, ${user.coordinates.longitude}`}
        />
      ))}
    </MapView>
      ) : (
        <View style={tw`flex-1 justify-center items-center`}>
          <Text style={tw`text-lg text-center`}>Please enter valid coordinates to view the map.</Text>
        </View>
      )}

      <View style={tw`flex-row justify-around items-center bg-white p-4 shadow-md`}>
        <TouchableOpacity style={tw`flex-1`} onPress={handleChatPress}>
          <Text style={tw`text-center text-lg text-orange-600`}>Chat</Text>
        </TouchableOpacity>
      </View>

      {userData && (
        <View style={tw`absolute bottom-10 left-0 right-0`}>
          <Text style={tw`text-center text-lg text-white`}>{`Welcome, ${userData.name}!`}</Text>
        </View>
      )}

      {isChatOpen && (
        <View style={tw`flex-1 bg-white p-4 rounded-lg`}>
          {isSearching ? (
            <Text style={tw`text-lg text-center`}>Searching for Bluetooth devices...</Text>
          ) : (
            <FlatList
              data={devices}
              keyExtractor={(item) => item.id.toString()} 
              renderItem={({ item }) => (
                <View style={tw`p-2 border-b border-gray-300`}>
                  <Text style={tw`text-lg`}>{item.name}</Text>
                </View>
              )}
            />

          )}
          <ChatBlue onClose={() => setIsChatOpen(false)} /> 
        </View>
      )}
    </View>
  );
};

export default UserTab;
