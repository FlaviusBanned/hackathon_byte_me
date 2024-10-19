import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, Alert, PermissionsAndroid, Platform } from 'react-native';
import BleManager from 'react-native-ble-manager';

const ChatRedirect = () => {
  const [devices, setDevices] = useState([]);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    // Initialize BLE Manager
    BleManager.start({ showAlert: false })
      .then(() => {
        console.log('BLE Manager Initialized');
      })
      .catch(err => {
        console.error('BLE Manager Error:', err);
      });

    // Check for permissions and start scanning
    checkPermissionsAndInit();

    // Cleanup on unmount
    return () => {
      BleManager.stopScan();
    };
  }, []);

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
      await BleManager.scan([], 5, true); // Scan for 5 seconds
      console.log('Scanning for devices...');

      // Timeout to get discovered devices
      setTimeout(async () => {
        const discoveredDevices = await BleManager.getDiscoveredPeripherals();
        console.log('Discovered devices:', discoveredDevices);
        setDevices(discoveredDevices);
        setIsScanning(false);
      }, 5000);
    } catch (error) {
      console.error('Error scanning for Bluetooth devices:', error);
      setIsScanning(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ marginBottom: 20 }}>Scan for Bluetooth Devices</Text>
      <Button
        title={isScanning ? 'Scanning...' : 'Scan for Devices'}
        onPress={scanForDevices}
        disabled={isScanning}
      />

      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}>
            <Text>Device Name: {item.name || 'Unknown'}</Text>
            <Text>Device ID: {item.id}</Text>
          </View>
        )}
        ListEmptyComponent={() => <Text>No devices found yet</Text>}
      />
    </View>
  );
};

export default ChatRedirect;
