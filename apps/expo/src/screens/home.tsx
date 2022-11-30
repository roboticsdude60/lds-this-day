import React, { useState } from "react";

import {
  Alert,
  Button,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "@acme/api";

import { trpc } from "../utils/trpc";
import { Picker } from "@react-native-picker/picker";

import DateTimePickerModal from 'react-native-modal-datetime-picker';

type InterestingEvent = inferProcedureOutput<AppRouter["event"]["all"]>[number];

const getDaysInMonth = (date: Date) => {
  const lastDayOfMonth = new Date();
  lastDayOfMonth.setFullYear(date.getFullYear(), date.getMonth() + 1, 0);
  lastDayOfMonth.setHours(0, 0, 0, 0);
  return lastDayOfMonth.getDate();
}

const getMonthName = (month: number) => {
  const names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  return names[month - 1];
}

export const HomeScreen = () => {
  const today = new Date();
  const [pickingDate, setPickingDate] = useState(false);
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [day, setDay] = useState(today.getDate());

  const changeDateButtonText = `${getMonthName(month)} ${day}`;
  // const eventsQuery = trpc.event.all.useQuery();
  const eventsQuery = trpc.event.filtered.useQuery({ month, day });


  return (
    <SafeAreaView >
      <View className="h-full w-full p-4 mt-6">
        <Text className="text-2xl font-bold mx-auto pb-2">
          This day in Church History
        </Text>
        <View className="mx-16 border-2 rounded-3xl bg-blue-400">
          <TouchableOpacity onPress={() => setPickingDate(true)}>
            <Text className="text-center text-lg text-white">{changeDateButtonText}</Text>
          </TouchableOpacity>
        </View>

        <View>
          <DateTimePickerModal
            isVisible={pickingDate}
            mode="date"
            date={new Date(new Date().getFullYear(), month - 1, day)}
            onConfirm={(date: Date) => {
              setPickingDate(false);
              setMonth(date.getMonth() + 1);
              setDay(date.getDate());
            }}
            onHide={() => setPickingDate(false)}
            onCancel={() => { setPickingDate(false) }}
          />
        </View>

        <ScrollView className="my-3">
          {eventsQuery.data?.map(e =>
            <View className="p-2 m-2 border">
              <Text className="font-bold">{e.title}</Text>
              <Text>{e.date.setDate(e.day) && `${e.date.toDateString()}`}</Text>
              <Text>{e.description}</Text>
            </View>
          )}
        </ScrollView>
        <View>
          <Text>{eventsQuery.error?.message}</Text>
        </View>
      </View>
    </SafeAreaView >
  );
};
