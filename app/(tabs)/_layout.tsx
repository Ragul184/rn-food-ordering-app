import { images } from '@/constants';
import useAuthStore from '@/store/auth.store';
import { TabBarIconProps } from '@/type';
import cn from "clsx";
import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { Image, Text, View } from 'react-native';

const TabBarIcon = ({ focused, icon, title }: TabBarIconProps) => (
    <View className="tab-icon">
        <Image source={icon} className="size-7" resizeMode="contain" tintColor={focused ? '#FE8C00' : '#5D5F6D'} />
        <Text className={cn('text-sm font-bold', focused ? "text-primary" : "text-gray-200")}>{title}</Text>
    </View>
)

export default function TabLayout() {
    const { isAuthenticated } = useAuthStore();

    // If the user is not authenticated, redirect to the sign-in page
    if (!isAuthenticated) return <Redirect href="/sign-in" />

    return (
        // Tabs Layout will define the tabs and its routes
        <Tabs
            screenOptions={{
                headerShown: false, // Hide the header for all tabs
                tabBarShowLabel: false, // Hide the label for the tab bar
                tabBarStyle: {
                    borderTopLeftRadius: 50, // Rounded corners for the tab bar
                    borderTopRightRadius: 50, // Rounded corners for the tab bar
                    borderBottomLeftRadius: 50, // Rounded corners for the tab bar
                    borderBottomRightRadius: 50, // Rounded corners for the tab bar
                    height: 80, // Height of the tab bar
                    marginHorizontal: 20, // Margin for the tab bar
                    position: 'absolute', // Positioning the tab bar
                    bottom: 40, // Positioning the tab bar at the bottom
                    backgroundColor: "white", // Background color of the tab bar
                    shadowColor: "#1a1a1a", // Shadow color for the tab bar
                    shadowOffset: { width: 0, height: 2 }, // Shadow offset for the tab bar
                    shadowOpacity: 0.1, // Shadow opacity for the tab bar
                    shadowRadius: 4, // Shadow radius for the tab bar
                    elevation: 5, // Elevation for the tab bar
                },
            }}
        >
            {/* Tabs.Screen will define the individual tab and the options includes the title and headerShown */}
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ focused }) => <TabBarIcon title="Home" icon={images.home} focused={focused} />
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Search',
                    tabBarIcon: ({ focused }) => <TabBarIcon title="Search" icon={images.search} focused={focused} />
                }}
            />
            <Tabs.Screen
                name="cart"
                options={{
                    title: 'Cart',
                    tabBarIcon: ({ focused }) => <TabBarIcon title="Cart" icon={images.bag} focused={focused} />
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ focused }) => <TabBarIcon title="Profile" icon={images.person} focused={focused} />
                }}
            />
        </Tabs>
    )
}