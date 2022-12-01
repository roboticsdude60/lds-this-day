import React, { useState } from 'react';

import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import type { inferProcedureOutput } from '@trpc/server';
import type { AppRouter } from '@acme/api';

import { trpc } from '../utils/trpc';
import { Picker } from '@react-native-picker/picker';

export type InterestingEvent = inferProcedureOutput<AppRouter['event']['all']>[number];

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../_app';
import { SafeAreaView } from 'react-native-safe-area-context';

const getDaysInMonth = (date: Date) => {
  const lastDayOfMonth = new Date();
  lastDayOfMonth.setFullYear(date.getFullYear(), date.getMonth() + 1, 0);
  lastDayOfMonth.setHours(0, 0, 0, 0);
  return lastDayOfMonth.getDate();
};

const MonthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const getMonthName = (month: number) => {
  return MonthNames[month - 1];
};

export const HomeScreen: React.FC<NativeStackScreenProps<RootStackParamList, 'Home'>> = ({ navigation }) => {
  const today = new Date();
  const [pickingDate, setPickingDate] = useState(false);
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [day, setDay] = useState(today.getDate());

  const changeDateButtonText = `${ getMonthName(month) } ${ day }`;
  const daysInSelectedMonth = getDaysInMonth(new Date(2020, month, 0));
  const eventsQuery = trpc.event.filtered.useQuery({ month, day });

  return (
    <View>
      <SafeAreaView >
        <View className="w-full h-full p-4">
          <Text className="mb-4 text-2xl font-bold text-center">
            This day in Church History
          </Text>
          <View className="p-2 mx-16 bg-blue-400 border-2 rounded-3xl">
            <TouchableOpacity onPress={() => setPickingDate(true)}>
              <Text className="text-lg text-center text-white">{changeDateButtonText}</Text>
            </TouchableOpacity>
          </View>

          <View>
            <Modal statusBarTranslucent={true} transparent={true} visible={pickingDate} >
              <View className="flex flex-col h-full">
                <TouchableOpacity className="flex-1 bg-black opacity-50" onPress={() => setPickingDate(false)} />
                <View className="bg-white shadow opacity-100 flex-0 shadow-black" style={{ shadowRadius: 50 }}>
                  <Picker
                    className="m-3 border "
                    selectedValue={month}
                    onValueChange={(val, index) => {
                      setMonth(val);
                    }}
                  >
                    {MonthNames.map((name, index) => <Picker.Item key={name} label={name} value={index + 1} />)}
                  </Picker>
                  <Picker
                    selectedValue={day}
                    onValueChange={(val, index) => {
                      setDay(val);
                    }}
                  >
                    {Array.from(Array(daysInSelectedMonth).keys()).map(i => <Picker.Item key={i + 1} label={`${ i + 1 }`} value={i + 1} />)}
                  </Picker>
                  <TouchableOpacity onPress={() => setPickingDate(false)}><Text className="p-4 text-lg font-bold text-center text-white bg-blue-400">set</Text></TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>

          <ScrollView className="my-3">
            {eventsQuery.data?.map(e =>
              <TouchableOpacity
                key={e.id}
                className="p-2 m-2 border"
                onPress={() => navigation.navigate('EventDisplay', { event: { ...e, date: e.date.toISOString() } })}
              >
                <Text className="text-lg font-bold text-center">{`${ e.date.getFullYear() } - ${ new Date().getFullYear() - e.date.getFullYear() } Years Ago`}</Text>
                <Text className="text-center ">{e.title}</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
          <View>
            <Text>{eventsQuery.error?.message}</Text>
          </View>
        </View>
      </SafeAreaView >
    </View>
  );
};
