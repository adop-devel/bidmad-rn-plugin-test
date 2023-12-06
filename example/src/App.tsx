import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, SafeAreaView, TextInput } from 'react-native';
import { BidmadPluginTestView, BidmadPluginCommon, BidmadTrackingAuthorizationStatus, BidmadPluginTestController, BidmadPluginInterstitial, BidmadPluginReward } from 'bidmad-rn-plugin-test';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
const ButtonStyle = { padding: 15 };

function HomeScreen({ navigation }: any) {
  BidmadPluginCommon.initializeSdk('ff8090d3-3e28-11ed-a117-026864a21938', '').then((initStatus: boolean) => {
    console.log('Initialize SDK status is', initStatus);
  })

  return (
    <View>
      <View style={ButtonStyle}>
        <Button title='Banner Ad' onPress={() => navigation.navigate('BannerAdSample')} />
      </View>
      <View style={ButtonStyle}>
        <Button title='Interstitial Ad' onPress={() => navigation.navigate('InterstitialAdSample')} />
      </View>
      <View style={ButtonStyle}>
        <Button title='Reward Ad' onPress={() => navigation.navigate('RewardAdSample')} />
      </View>
    </View>
  );
}

function BannerAdSample({ navigation }: any) {
  const [loadCounter, setLoadCounter] = useState(0);
  const [loadFailCounter, setLoadFailCounter] = useState(0);
  const [clickCounter, setClickCounter] = useState(0);

  return (
    <SafeAreaView style={{
      flex: 1
    }}>
      <View style={{
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
      }}>
        <View style={{
          flex: 1,
          justifyContent: 'center'
        }}>
          <Text>Load: {loadCounter}</Text>
          <Text>Fail: {loadFailCounter}</Text>
          <Text>Click: {clickCounter}</Text>
        </View>

        <View style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: 320,
          height: 50,
          backgroundColor: 'lightblue',
        }}> 
          <BidmadPluginTestView
            iOSZoneId='1c3e3085-333f-45af-8427-2810c26a72fc'
            onLoad={() => {
              setLoadCounter(loadCounter + 1);
            }}
            onLoadFail={() => {
              setLoadFailCounter(loadFailCounter + 1);
            }}
            onClick={() => {
              setClickCounter(clickCounter + 1);
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

function InterstitialAdSample({ navigation }: any) {
  return (
    <View>
      <Text>Good!</Text>
    </View>
  );
}

function RewardAdSample({ navigation }: any) {
  return (
    <View>
      <Text>Good!</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Home"
          component={HomeScreen}
          options={{ title: 'Ad Samples' }} 
        />
        <Stack.Screen
          name='BannerAdSample'
          component={BannerAdSample}
          options={{ title: 'Banner Ad' }}
        />
        <Stack.Screen
          name='InterstitialAdSample'
          component={InterstitialAdSample}
          options={{ title: 'Interstitial Ad' }}
        />
        <Stack.Screen
          name='RewardAdSample'
          component={RewardAdSample}
          options={{ title: 'Reward Ad' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
