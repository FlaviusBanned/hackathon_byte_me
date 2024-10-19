import React, { useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import tw from 'twrnc'; 

const ChatRedirect = () => {
  const [devices, setDevices] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [customMessage, setCustomMessage] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    scanForDevices();
  }, []);

  const scanForDevices = () => {
    setIsScanning(true);
    
    setTimeout(() => {
      const simulatedDevices = [
        { name: 'Michael', address: '00:11:22:33:44:55' },
        { name: 'Rachel', address: '66:77:88:99:AA:BB' },
        { name: 'Denisse', address: 'CC:DD:EE:FF:00:11' },
      ];
      setDevices(simulatedDevices);
      setIsScanning(false);
    }, 2000); 
  };

  const handleDevicePress = (device) => {
    setSelectedDevice(device);
    setModalVisible(true);
  };

  const handleAlert = () => {
    navigation.navigate('Escape', { device: selectedDevice, alertMessage: customMessage });
    setModalVisible(false); 
    setCustomMessage(''); 
  };

  return (
    <View style={tw`flex-1 justify-center items-center p-5`}>
      <Text style={tw`mb-5 text-lg`}>Search Survivors</Text>
      
      <TouchableOpacity
        style={tw`bg-orange-500 py-2 px-4 rounded-lg mb-4`}
        onPress={scanForDevices}
        disabled={isScanning}
      >
        <Text style={tw`text-white text-center`}>
          {isScanning ? 'Scanning...' : 'Scan for Devices'}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={devices}
        keyExtractor={(item) => item.address}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleDevicePress(item)}>
            <View style={tw`p-4 border-b border-gray-300`}>
              <Text>Device Name: {item.name}</Text>
              <Text>Device Address: {item.address}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => <Text>No devices found yet</Text>}
      />

      <Modal isVisible={isModalVisible}>
        <View style={tw`bg-white p-5`}>
          <Text style={tw`mb-3`}>Alert the others if the ghosts didn' t first</Text>
          <TextInput
            style={tw`h-10 border border-gray-400 mb-4 px-2`}
            placeholder="Type your alert message here"
            value={customMessage}
            onChangeText={setCustomMessage}
          />
          <TouchableOpacity
            style={tw`bg-orange-500 py-2 px-4 rounded-lg mb-2`}
            onPress={handleAlert}
          >
            <Text style={tw`text-white text-center`}>Send Alert</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`bg-red-500 py-2 px-4 rounded-lg`}
            onPress={() => setModalVisible(false)}
          >
            <Text style={tw`text-white text-center`}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default ChatRedirect;
