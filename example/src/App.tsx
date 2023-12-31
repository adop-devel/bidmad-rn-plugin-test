import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, SafeAreaView, TextInput } from 'react-native';
import { BidmadPluginTestView, BidmadPluginCommon, BidmadPluginTestController, BidmadPluginInterstitial, BidmadPluginReward, BidmadTrackingAuthorizationStatus, BidmadBannerSize } from 'bidmad-rn-plugin-test';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
const ButtonStyle = { padding: 15 };

async function CommonInterfaceTest(): Promise<void> {
  const permission = await BidmadPluginCommon.reqAdTrackingAuthorization();

  switch (permission) {
    case BidmadTrackingAuthorizationStatus.NotDetermined:
      console.log("App Tracking Transparency: Not Determined");
      break;
    case BidmadTrackingAuthorizationStatus.Restricted:
      console.log("App Tracking Transparency: Restricted");
      break;
    case BidmadTrackingAuthorizationStatus.Denied:
      console.log("App Tracking Transparency: Denied");
      break;
    case BidmadTrackingAuthorizationStatus.Authorized:
      console.log("App Tracking Transparency: Authorized");
      break;
    case BidmadTrackingAuthorizationStatus.LessThaniOS14:
      console.log("App Tracking Transparency: Less Than iOS 14");
      break;
  }

  const initStatus: boolean = await BidmadPluginCommon.initializeSdk('ff8090d3-3e28-11ed-a117-026864a21938', 'ff8090d3-3e28-11ed-a117-026864a21938');

  if (initStatus) {
    console.log("BidmadSDK is initialized");
  } else {
    console.log("BidmadSDK is not initialized");
  }

  await BidmadPluginCommon.setChildDirectedAds(false);
  const childSetting: boolean | null = await BidmadPluginCommon.isChildDirectedTreatment();

  console.log("Child Directed Treatment is set to", childSetting);

  await BidmadPluginCommon.setDebug(true);
  const debugStatus = await BidmadPluginCommon.isDebug();

  console.log('Debug status is', debugStatus);

  await BidmadPluginCommon.setTestDeviceId('c0f7f3d439a3c06f26f602308cc1bfa9');
  const testDeviceId = await BidmadPluginCommon.getTestDeviceId();

  console.log('Test Device ID is', testDeviceId);

  await BidmadPluginCommon.setCuid('Test CUID');
  const cuid = await BidmadPluginCommon.getCuid();

  console.log('CUID is', cuid);

  await BidmadPluginCommon.setUseServerSideCallback(false);
  const useSsc = await BidmadPluginCommon.getUseServerSideCallback();

  console.log('Server Side Callback is', useSsc);
}

async function GDPRInterfaceTest(): Promise<void> {
  const gdprInterface = await BidmadPluginGDPR.create();

  gdprInterface?.setCallbacks({
    onConsentInfoUpdateSuccess: () => {
      console.log('GDPR: OnConsentInfoUpdateSuccess');
      gdprInterface?.loadForm();
    },
    onConsentInfoUpdateFailure: (error: string) => {
      console.log('GDPR: OnConsentInfoUpdateFailure', error);
    },
    onConsentFormLoadSuccess: () => {
      console.log('GDPR: OnConsentFormLoadSuccess');
      gdprInterface?.showForm();
    },
    onConsentFormLoadFailure: (error: string) => {
      console.log('GDPR: OnConsentFormLoadFailure', error);
    },
    onConsentFormDismissed: (error: string|null) => {
      console.log('GDPR: OnConsentFormDismissed', error);
    }
  });

  await gdprInterface?.setDebug('C71285C2-03C5-4EEA-9AB4-E4C717481BAF', true);
  await gdprInterface?.requestConsentInfoUpdate();
}

function HomeScreen({ navigation }: any) {
  CommonInterfaceTest().then(() => {
    console.log("Common Testing is DONE!");
  });

  GDPRInterfaceTest().then(() => {
    console.log('GDPR Testing is DONE!');
  });

  return (
    <View style={styles.container}>
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
            androidZoneId='f9d29451-6fc1-4527-b855-dd5b03052862'
            bannerSize={BidmadBannerSize.BANNER}
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
    let cnt = 0;
    BidmadPluginInterstitial.create('228b95a9-6f42-46d8-a40d-60f17f751eb1', 'e9acd7fc-a962-40e4-aaad-9feab1b4f821').then((interstitial) => {
    interstitial.load();
    interstitial.setCallbacks({
      onLoad: () => {
    console.log('callback onLoad' );
        if(cnt == 0){
          interstitial.show();
        }
        cnt++;
      }
    });
  });

  return (
    <View>
      <Text>Good!</Text>
    </View>
  );
}

function RewardAdSample({ navigation }: any) {
    let cnt = 0;
    BidmadPluginReward.create('29e1ef67-98d2-47b3-9fa2-9192327dd75d', '7d9a2c9e-5755-4022-85f1-6d4fc79e4418').then((reward) => {
    reward.load();
    reward.setCallbacks({
      onLoad: () => {
    console.log('callback onLoad' );
        if(cnt == 0){
          reward.show();
        }
        cnt++;
      }
    });
  });

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
