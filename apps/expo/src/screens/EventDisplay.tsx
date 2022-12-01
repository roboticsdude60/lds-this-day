import React, { } from 'react';

import {
  ScrollView,
  Text,
  View,
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../_app';

export const EventDisplay: React.FC<NativeStackScreenProps<RootStackParamList, 'EventDisplay'>> = ({ navigation, route }) => {
  const event = route.params.event;
  const date = new Date(event.date);
  date.setDate(event.day);

  console.log(event);
  return (

    <ScrollView className="mb-2">
      <View className="p-4">
        <Text className="text-2xl font-bold text-center">
          {`${ new Date().getFullYear() - date.getFullYear() } years ago in ${ date.getFullYear() }`}
        </Text>
      </View>

      <View className="p-2 m-2 border ">
        <Text className="text-xl font-bold">{event.title}</Text>
        <Text className="text-gray-500">{date.toDateString()}</Text>
        <Text>{event.description}</Text>
      </View>
    </ScrollView>

  );
};
