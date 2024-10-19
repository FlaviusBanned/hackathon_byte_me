// ChatBlue.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import Bluetooth from 'react-native-bluetooth-classic';

const ChatBlue = ({ onClose }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    setMessages(prev => [...prev, { text: message, fromUser: true }]);
    setMessage('');
  };

  return (
    <View>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <Text style={{ color: item.fromUser ? 'blue' : 'black' }}>
            {item.text}
          </Text>
        )}
      />
      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Type a message"
      />
      <Button title="Send" onPress={sendMessage} />
      <Button title="Close" onPress={onClose} />
    </View>
  );
};

export default ChatBlue;
