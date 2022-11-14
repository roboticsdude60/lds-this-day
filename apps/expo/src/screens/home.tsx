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
// import { Picker } from "@react-native-picker/picker";

type InterestingEvent = inferProcedureOutput<AppRouter["event"]["all"]>[number];

const MonthNames = ["January"];


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


export const HomeScreen = () => {
  // const postQuery = trpc.post.all.useQuery();
  const [showPost, setShowPost] = React.useState<string | null>(null);
  const today = new Date();
  const [date, setDate] = useState(today);
  const [pickingDate, setPickingDate] = useState(false);
  // const [month, setMonth] = useState(today.toLocaleDateString('en-us', { month: "" }));
  // const [day, setDay] = useState(today.getDate());

  const eventsQuery = trpc.event.filtered.useQuery({ month: date.getMonth(), day: date.getDate() });


  return (
    <SafeAreaView>
      <View className="h-full w-full p-4">
        <Text className="text-2xl font-bold mx-auto pb-2">
          This day in Church History
        </Text>

        <View className="mx-16 border-2 rounded-3xl text-blue-400">
          <Button onPress={() => setPickingDate(!pickingDate)} title={`${date.toLocaleDateString('en-us', { month: "long" })} ${date.getDate()}`} />
        </View>
        <Modal visible={pickingDate}>
          <SafeAreaView className="">
            <Button onPress={() => setPickingDate(false)} title="Dismiss" />
            {/* <Picker selectedValue={date.getMonth()}>
              {Array.from(Array(31).keys()).map(i => <Picker.Item label={`${i + 1}`} />)}

            </Picker> */}

            <View className="flex flex-row">
              <ScrollView>
                <Button title="HEy" />
              </ScrollView>
              <ScrollView className="border-r-4">
                {/* {Array.from(Array(31).keys()).map(i =>
                  <Button title={`${i + 1}`} onPress={() => {
                    let newDate = new Date(date);
                    newDate.setDate(i + 1);
                    setDate(newDate);
                    setPickingDate(false);
                  }} />
                )} */}
              </ScrollView>
            </View>

            {/* <RNDate */}
            {/* <RNDateTimePicker value={date} mode="date" /> */}

          </SafeAreaView>

        </Modal>

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
