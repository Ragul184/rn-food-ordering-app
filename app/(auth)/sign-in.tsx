import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import { signIn } from '@/lib/appwrite'
import * as Sentry from '@sentry/react-native'
import { Link, router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Text, View } from 'react-native'

const SignIn = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [form, setForm] = useState({
        email: '',
        password: ''
    })

    const submit: () => Promise<void> = async () => {
        const { email, password } = form;

        if (!email || !password) return Alert.alert('Error', 'Please enter valid email address and password.')
        setIsSubmitting(true)

        try {
            // Call AppWrite Sign In Function
            await signIn({ email, password });

            router.replace('/')
        } catch (error: any) {
            console.error(error)
            Alert.alert('Error', error.message || 'An error occurred while signing in.')
            Sentry.captureEvent(error);
        } finally {
            // Reset the submitting state
            setIsSubmitting(false)
        }
    }

    return (
        <View className="gap-10 bg-white rounded-lg p-5 mt-5">
            <CustomInput
                placeholder='Enter your email'
                value={form.email}
                onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
                label='Email'
                keyboardType='email-address'
            />
            <CustomInput
                placeholder='Enter your password'
                value={form.password}
                onChangeText={(text) => setForm((prev) => ({ ...prev, password: text }))}
                label='Password'
                secureTextEntry={true}
            />
            <CustomButton
                title='Sign In'
                isLoading={isSubmitting}
                onPress={submit}
            />

            <View className='flex-row justify-center gap-2 mt-5'>
                <Text className="base-regular text-gray-100">
                    Don&apos;t have an account?
                </Text>
                <Link href="/sign-up" className="text-primary base-bold">
                    Sign Up
                </Link>
            </View>
        </View>
    )
}

export default SignIn