import { Redirect, Slot } from 'expo-router';
import React from 'react';

export default function _Layout() {
    const isAuthenticated = false; // Replace with actual authentication logic

    // If the user is not authenticated, redirect to the sign-in page
    if (!isAuthenticated) return <Redirect href="/sign-in" />

    return <Slot />
}