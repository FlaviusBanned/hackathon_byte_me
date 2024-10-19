import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, Alert } from 'react-native';
import Bluetooth from 'react-native-bluetooth-classic';
import { PermissionsAndroid, Platform } from 'react-native';

const ChatRedirect = () => {
  const [devices, setDevices] = useState([]);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const checkPermissionsAndInit = async () => {
      if (Platform.OS === 'android') {
        const granted = await requestLocationPermission();
        if (granted) {
          scanForDevices();
        } else {
          Alert.alert('Permission Denied', 'Location permission is required for Bluetooth scanning.');
        }
      } else {
        scanForDevices();
      }
    };

    checkPermissionsAndInit();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location to scan for Bluetooth devices.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const scanForDevices = async () => {
    setIsScanning(true);
    try {
      const unpairedDevices = await Bluetooth.startDiscovery();
      setDevices(unpairedDevices);
      setIsScanning(false);
    } catch (error) {
      console.error('Error scanning for Bluetooth devices:', error);
      setIsScanning(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ marginBottom: 20 }}>Robert</Text>
      <Button title={isScanning ? 'Scanning...' : 'Scan for Devices'} onPress={scanForDevices} disabled={isScanning} />

      <FlatList
        data={devices}
        keyExtractor={(item) => item.address}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}>
            <Text>Device Name: {item.name || 'Unknown'}</Text>
            <Text>Device Address: {item.address}</Text>
          </View>
        )}
        ListEmptyComponent={() => <Text>No devices found yet</Text>}
      />
    </View>
  );
};

export default ChatRedirect;
