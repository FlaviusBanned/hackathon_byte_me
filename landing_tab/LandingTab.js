import { StatusBar } from 'expo-status-bar';
import { Text, View, TouchableOpacity, Animated, ImageBackground } from 'react-native';
import tw from 'twrnc';
import { useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';

export default function LandingTab() {
  const fadeAnim1 = useRef(new Animated.Value(0)).current; 
  const fadeAnim2 = useRef(new Animated.Value(0)).current; 
  const fadeAnim3 = useRef(new Animated.Value(0)).current; 
  const scaleAnim = useRef(new Animated.Value(1)).current; 

  const navigation = useNavigation(); 

  const handleEscape = () => {
    navigation.navigate("InputRetrieve");
  };

  const animateTexts = () => {
    Animated.timing(fadeAnim3, {
      toValue: 1, 
      duration: 1500, 
      useNativeDriver: true,
    }).start(() => {
      
      Animated.timing(fadeAnim1, {
        toValue: 1, 
        duration: 1500, 
        useNativeDriver: true,
      }).start(() => {
        Animated.timing(fadeAnim2, {
          toValue: 1, 
          duration: 1500, 
          useNativeDriver: true,
        }).start(() => {
          startButtonScaling();
        });
      });
    });
  };

  const startButtonScaling = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.3, 
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1, 
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    animateTexts(); 
  }, []); 

  return (
    <ImageBackground
      source={require('../landing_tab/back_app.jpg')} 
      style={tw`flex-1 justify-center items-center p-4`} 
    >
    
      <View style={tw`absolute top-10 w-full items-center`}>
        <Animated.View style={{ opacity: fadeAnim1 }}>
          <Text style={tw`text-2xl text-white text-center mb-2`}>
            Hi there!
          </Text>
        </Animated.View>
        <Animated.View style={{ opacity: fadeAnim2 }}>
          <Text style={tw`text-lg text-white text-center mb-6`}>
            I guess you’re  ...  LOST . Let me help you out.
          </Text>
        </Animated.View>
      </View>

      <View
        style={[
          tw`absolute bottom-4 w-4/5 p-6 items-center justify-center rounded-lg`,
          {
            backgroundColor: 'rgba(255, 255, 255, 0.1)', 
            borderColor: 'rgba(255, 255, 255, 1)', 
            borderWidth: 2, 
            shadowColor: '#fff', 
            shadowOffset: { width: 2, height: 2 }, 
            shadowOpacity: 0.9, 
            shadowRadius: 1,
          },
        ]}
      >
        <Animated.View style={{ opacity: fadeAnim3 }}>
          <Text style={tw`text-sm text-white text-center`}>
            All rights reserved | ByteMe ® 
          </Text>
        </Animated.View>
      </View>

     
      <Animated.View style={{ transform: [{ scale: scaleAnim }], marginBottom: 20 }}>
        <TouchableOpacity
          onPress={handleEscape}
          style={tw`bg-[#FF6347] py-3 px-6 rounded-full shadow-lg`}
        >
          <Text style={tw`text-white text-lg text-center`}>Escape</Text>
        </TouchableOpacity>
      </Animated.View>

      <StatusBar style="auto" />
    </ImageBackground>
  );
}
