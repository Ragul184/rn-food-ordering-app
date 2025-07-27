import { Slot } from 'expo-router'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const _Layout = () => {
    return (
        // Using SafeAreaView to ensure content is rendered within the safe area boundaries
        // This is especially useful for devices with notches or status bars that might obscure content.
        <SafeAreaView>
            {/* Slot is a placeholder for the content of the current route. It allows you to render the component associated with the current route. */}
            <Slot />
        </SafeAreaView>
    )
}

export default _Layout