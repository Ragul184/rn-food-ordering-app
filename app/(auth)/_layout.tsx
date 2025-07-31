import { images } from '@/constants'
import useAuthStore from '@/store/auth.store'
import { Redirect, Slot } from 'expo-router'
import React from 'react'
import { Dimensions, Image, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native'

const AuthLayout = () => {
    const { isAuthenticated } = useAuthStore();

    // If the user is authenticated, redirect to the home page
    if (isAuthenticated) return <Redirect href="/" />

    return (
        // KeyboardAvoidingView is used to adjust the view when the keyboard is open, preventing it from covering the input fields.
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            {/* ScrollView is used to make the content scrollable when it exceeds the screen height. */}
            {/* keyboardShouldPersistTaps="handled" ensures that taps on the content inside the ScrollView are handled correctly, even when the keyboard is open. */}
            {/* Also, the keyboard will be dismissed entirely when the user taps outside the input fields. So, user can focus on submit button */}
            <ScrollView className="bg-white h-full" keyboardShouldPersistTaps="handled">
                <View className="w-full relative" style={{ height: Dimensions.get('screen').height / 2.25 }}>
                    <ImageBackground
                        source={images.loginGraphic}
                        className="size-full rounded-b-lg" resizeMode="stretch" />
                    <Image
                        source={images.logo}
                        className="self-center size-48 absolute -bottom-16 z-10"
                    />
                </View>
                {/* Slot is a placeholder for the content of the current route. It allows you to render the component associated with the current route. */}
                <Slot />
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default AuthLayout