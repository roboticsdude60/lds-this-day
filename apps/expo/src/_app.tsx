import React from "react";
import { TRPCProvider } from "./utils/trpc";
import { HomeScreen, InterestingEvent } from "./screens/home";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EventDisplay } from "./screens/EventDisplay";

export type RootStackParamList = {
  Home: undefined;
  EventDisplay: { event: Omit<InterestingEvent, 'date'> & { date: string } };
};
const Stack = createNativeStackNavigator<RootStackParamList>();


export const App = () => {
  return (
    <TRPCProvider>
      <NavigationContainer >
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'LDS This Day', headerShown: false }} />
          <Stack.Screen name="EventDisplay" component={EventDisplay} options={{ title: 'LDS This Day' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </TRPCProvider >
  );
};
