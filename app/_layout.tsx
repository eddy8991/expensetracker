import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { AuthProvider } from '@/context/authContext'
import { ToastProvider } from '@/context/toastContext'
import { ConfirmDialogProvider } from '@/context/confirmDialogContext'

const StackLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='(modals)/profileModal' options={{ presentation: 'modal'}}/>
      <Stack.Screen name='(modals)/walletModal' options={{ presentation: 'modal'}}/>
      <Stack.Screen name='(modals)/transactionModal' options={{ presentation: 'modal'}}/>
      <Stack.Screen name='(modals/searchModal' options={{ presentation: 'modal'}}/>
    </Stack>
  )
}

export default function RootLayout(){
  return(
    <ToastProvider>
      <ConfirmDialogProvider>
        <AuthProvider>
          <StackLayout/>
        </AuthProvider>
      </ConfirmDialogProvider>
    </ToastProvider>
  )
}



const styles = StyleSheet.create({})