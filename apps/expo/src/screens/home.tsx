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

// import { FlashList } from "@shopify/flash-list";
import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "@acme/api";

import { trpc } from "../utils/trpc";
import { Picker } from "@react-native-picker/picker";

import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { FlashList } from "@shopify/flash-list";

// import 'intl';
// import { DateTimeFormat } from 'intl';
// import { getDaysInMonth } from "date-fns";
// import '@formatjs/intl-datetimeformat/polyfill'
// import '@formatjs/intl-datetimeformat/locale-data/en' // locale-data for en
// import '@formatjs/intl-datetimeformat/add-all-tz' // Add ALL tz data
// import { Picker } from "@react-native-picker/picker";

type InterestingEvent = inferProcedureOutput<AppRouter["event"]["all"]>[number];

// const MonthNames = ["January"];

// const PostCard: React.FC<{
//   post: inferProcedureOutput<AppRouter["post"]["all"]>[number];
// }> = ({ post }) => {
//   return (
//     <View className="p-4 border-2 border-gray-500 rounded-lg">
//       <Text className="text-xl font-semibold text-gray-800">{post.title}</Text>
//       <Text className="text-gray-600">{post.content}</Text>
//     </View>
//   );
// };

// const CreatePost: React.FC = () => {
//   const utils = trpc.useContext();
//   const { mutate } = trpc.post.create.useMutation({
//     async onSuccess() {
//       await utils.post.all.invalidate();
//     },
//   });

//   const [title, onChangeTitle] = React.useState("");
//   const [content, onChangeContent] = React.useState("");

//   return (
//     <View className="p-4 border-t-2 border-gray-500 flex flex-col">
//       <TextInput
//         className="border-2 border-gray-500 rounded p-2 mb-2"
//         onChangeText={onChangeTitle}
//         placeholder="Title"
//       />
//       <TextInput
//         className="border-2 border-gray-500 rounded p-2 mb-2"
//         onChangeText={onChangeContent}
//         placeholder="Content"
//       />
//       <TouchableOpacity
//         className="bg-indigo-500 rounded p-2"
//         onPress={() => {
//           mutate({
//             title,
//             content,
//           });
//         }}
//       >
//         <Text className="text-white font-semibold">Publish post</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

const getDaysInMonth = (date: Date) => {
  var lastDayOfMonth = new Date(0);
  lastDayOfMonth.setFullYear(date.getFullYear(), date.getMonth() + 1, 0);
  lastDayOfMonth.setHours(0, 0, 0, 0);
  return lastDayOfMonth.getDate();
}

const getMonthName = (month: number) => {
  const names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  return names[month];
}

export const HomeScreen = () => {
  // const postQuery = trpc.post.all.useQuery();
  const [showPost, setShowPost] = React.useState<string | null>(null);
  const today = new Date();
  const [pickingDate, setPickingDate] = useState(false);
  const [month, setMonth] = useState(today.getMonth());
  const [day, setDay] = useState(today.getDate());

  const eventsQuery = trpc.event.filtered.useQuery({ month, day });
  // const eventsQuery = trpc.event.filtered.useQuery({ month: filterMonth, day: filterDay });


  return (
    <SafeAreaView >
      <View className="h-full w-full p-4 mt-6">
        <Text className="text-2xl font-bold mx-auto pb-2">
          This day in Church History
        </Text>

        <View className="mx-16 border-2 rounded-3xl text-blue-400">
          <Button onPress={() => setPickingDate(!pickingDate)} title={`${getMonthName(month)} ${day}`} />
        </View>

        <View>
          <DateTimePickerModal
            isVisible={pickingDate}
            mode="date"
            onConfirm={(date: Date) => {
              setMonth(date.getMonth());
              setDay(date.getDate());
              setPickingDate(false);
            }}
            onCancel={() => { setPickingDate(false) }}
          />
        </View>

        {/* <Modal visible={false}>
          <SafeAreaView className="">
            <Button onPress={() => setPickingDate(false)} title="Dismiss" />
            <Text className="text-center text-sm">Month</Text>
            <Picker
              selectedValue={month}
              onValueChange={(val, index) => {
                setMonth(val);
              }}
            >
              {Array.from(Array(12).keys()).map(i => <Picker.Item key={i + 1} label={`${getMonthName(i)}`} value={`${i}`} />)}
            </Picker>

            <Text className="text-center text-sm">Day</Text>
            <Picker
              selectedValue={day}
              onValueChange={(val, index) => {
                setDay(val);
              }}
            >
              {Array.from(Array(getDaysInMonth(new Date(today.getFullYear(), month))).keys()).map(i => <Picker.Item key={i + 1} label={`${i + 1}`} value={`${i + 1}`} />)}
              // {/* {Array.from(Array(31).keys()).map(i => <Picker.Item key={i + 1} label={`${i + 1}`} value={`${i + 1}`} />)} }
            </Picker>

          </SafeAreaView>

        </Modal> */}

        <ScrollView>

        </ScrollView>
        <View className="py-2">
          {showPost ? (
            <Text>
              <Text className="font-semibold">Selected post:</Text>
              {showPost}
            </Text>
          ) : (
            <Text className="italic font-semibold">Press on a post</Text>
          )}
        </View>
        <View>
          <Text>{eventsQuery.error?.message}</Text>
        </View>
        <FlashList
          data={eventsQuery.data}
          estimatedItemSize={5}
          renderItem={(interestingEvent) => (<TouchableOpacity><Text>{interestingEvent.item.description}</Text></TouchableOpacity>)}
        />

        {/* <FlashList
          data={postQuery.data}
          estimatedItemSize={20}
          ItemSeparatorComponent={() => <View className="h-2" />}
          renderItem={(p) => (
            <TouchableOpacity onPress={() => setShowPost(p.item.id)}>
              <PostCard post={p.item} />
            </TouchableOpacity>
          )}
        /> */}

        {/* <CreatePost /> */}
      </View>
    </SafeAreaView >
  );
};
