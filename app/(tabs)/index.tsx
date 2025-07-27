import { images, offers } from "@/constants";
import cn from "clsx";
import { Fragment } from "react";
import { FlatList, Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* ScrollView makes the whole screen (content inside the ScrollView Component) scrollable. */}
      {/* <ScrollView> </ScrollView> */}

      {/* SafeAreaView is a component that renders content within the safe area boundaries of a device. It ensures that the content is not obscured by notches, status bars, or other UI elements. */}


      {/* ERROR: VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead. 
        We should use FlatList or SectionList instead of ScrollView when we have a list of items that can be long and dynamic. */}

      <FlatList
        // Using FlatList to render a list of items, when it is long and dynamic, is recommended for performance optimizations.
        data={offers} // we need to pass an array to FlatList
        // renderItem expects a callback function that returns a React element
        // renderItem is equivalent to the .map function in JavaScript. {[].map((item) => (<div />))}
        // It expects a function that returns a React element for each item in the data array
        renderItem={({ item, index }) => {
          const isEven = index % 2 === 0; // Check if the index is even
          return (
            <View>
              {/* Each item rendered in the list is interactive, clickable (in this case, it is pressable). We are having a component called Pressable */}
              <Pressable
                className={cn("offer-card", isEven ? 'flex-row-reverse' : 'flex-row')}
                style={{ backgroundColor: item.color }}>
                {/* Text component is like a <p> tag where we can display text in HTML */}
                {/* <Text>{item.title}</Text> */}
                {/* We can render what can be pressable. We also have access to pressed fn, so we can do some additional functionalities on pressing */}
                {({ pressed }) => (
                  // Fragment is a React component that allows you to group multiple elements without adding extra nodes to the DOM
                  <Fragment>
                    <View className={"h-fulll w-1/2"}>
                      <Image
                        source={item.image}
                        className={"size-full"}
                        resizeMode={"contain"}
                      />
                    </View>
                    <View className={cn("offer-card__info", isEven ? 'pl-10' : 'pr-10')}>
                      <Text className="h1-bold text-white leading-tight">
                        {item.title}
                      </Text>
                      <Image
                        source={images.arrowRight}
                        className="size-10"
                        resizeMode="contain"
                        tintColor={"#ffffff"}
                      />
                    </View>
                  </Fragment>
                )}
              </Pressable>

            </View>
          )
        }}
        // 
        contentContainerClassName="pb-28 px-5"
        ListHeaderComponent={() => (
          // View is like a <div> tag in HTML. It is a container that can hold other components and can be styled.
          <View className="flex-between flex-row w-full my-5">
            <View className="flex-start">
              <Text className="small-bold text-primary">DELIVER TO</Text>
              {/* Its a button in react-native since we are not clicking but touching */}
              <TouchableOpacity className="flex-center flex-row gap-x-1 mt-0.5">
                <Text className="paragraph-bold text-dark-100">Chennai</Text>
                <Image source={images.arrowDown} className="size-3" resizeMode="contain" />
              </TouchableOpacity>
            </View>
            <Text className="paragraph-bold text-dark-100">Cart</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}