import { CustomInputProps } from '@/type';
import cn from "clsx";
import React from 'react';
import { Text, TextInput, View } from 'react-native';

const CustomInput = ({
  placeholder = 'Enter text',
  value,
  onChangeText,
  label,
  secureTextEntry = false,
  keyboardType = 'default'
}: CustomInputProps) => {
  const [isFocused, setIsFocused] = React.useState(false)

  return (
    <View className='w-full'>
      <Text className='label'>{label}</Text>

      <TextInput
        autoCapitalize='none'
        autoCorrect={false}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn('input', isFocused ? 'border-primary' : 'border-gray-300')}
      />
    </View>
  )
}

export default CustomInput