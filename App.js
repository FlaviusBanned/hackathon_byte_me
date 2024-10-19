import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LandingTab from "./landing_tab/LandingTab";
import UserTab from "./tabs/UserTab";
import InputRetrieve from "./tabs/InputRetrieve";
import ChatRedirect from "./chat_redirect/ChatRedirect";
const Stack = createNativeStackNavigator();

export default function MainApp() {
  return (
    <NavigationContainer>
     <Stack.Navigator initialRouteName="Home">
  <Stack.Screen
    name="Home"
    component={LandingTab}
    options={{
      headerStyle: { backgroundColor: 'transparent' }, 
      headerTintColor: 'black',
      headerTitleStyle: { fontWeight: 'bold' },
      headerShown: false,
    }}
  />
  <Stack.Screen
    name="InputRetrieve"
    component={InputRetrieve}
   
  />
  <Stack.Screen
    name="Escape"
    component={UserTab}
  />
  <Stack.Screen name="ChatRedirect"
   component={ChatRedirect} />

</Stack.Navigator>

    </NavigationContainer>
  );
}
