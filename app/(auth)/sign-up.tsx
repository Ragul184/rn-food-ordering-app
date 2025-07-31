import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import { createUser } from '@/lib/appwrite'
import { Link, router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Text, View } from 'react-native'

const SignUp = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: ''
    })

    const submit: () => Promise<void> = async () => {
        const { name, email, password } = form;

        if (!name || !email || !password) return Alert.alert('Error', 'Please enter valid name, email address and password.')
        setIsSubmitting(true)

        try {
            // Call AppWrite Sign Up Function
            await createUser({ name, email, password });

            router.replace('/')
        } catch (error: any) {
            console.error(error)
            Alert.alert('Error', error.message || 'An error occurred while signing in.')
        } finally {
            // Reset the submitting state
            setIsSubmitting(false)
        }
    }

    return (
        <View className="gap-10 bg-white rounded-lg p-5 mt-5">
            <CustomInput
                placeholder='Enter your full name'
                value={form.name}
                onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
                label='Full Name'
            />
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
                title='Sign Up'
                isLoading={isSubmitting}
                onPress={submit}
            />

            <View className='flex-row justify-center gap-2 mt-5'>
                <Text className="base-regular text-gray-100">
                    Already have an account?
                </Text>
                <Link href="/sign-in" className="text-primary base-bold">
                    Sign In
                </Link>
            </View>
        </View>
    )
}

export default SignUp