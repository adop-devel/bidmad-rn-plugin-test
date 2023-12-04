import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, Animated } from 'react-native';
import { BidmadPluginTestView, BidmadPluginCommon, BidmadTrackingAuthorizationStatus } from 'bidmad-rn-plugin-test';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  const [paddingAnim] = useState(new Animated.Value(100)); // Initial padding

  const togglePadding = () => {
    // Determine new padding value
    const newPadding = paddingAnim._value === 100 ? 0 : 100;

    // Animate to new padding value
    Animated.timing(paddingAnim, {
      toValue: newPadding,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const [bannerHeight1] = useState(new Animated.Value(0));
  const [bannerOpacity2] = useState(new Animated.Value(0));

  const onBannerLoad1 = () => {
    console.log('BANNER 1 LOADED!');
    Animated.timing(bannerHeight1, {
      toValue: 50,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const onBannerLoad2 = () => {
    console.log('BANNER 2 LOADED!');
    Animated.timing(bannerOpacity2, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  // console.log(require('react-native').NativeModules);
  console.log(BidmadPluginCommon);
  console.log("uh oh haha");

  BidmadPluginCommon.reqAdTrackingAuthorization().then((status: BidmadTrackingAuthorizationStatus) => {
    console.log('Ad Tracking Authorization Status:', status);
  });

  BidmadPluginCommon.initializeSdk('ff8090d3-3e28-11ed-a117-026864a21938', '').then((initStatus: boolean) => {
    console.log('Initialization Status is:', initStatus);
  });

  BidmadPluginCommon.setAdvertiserTracking(true);

  BidmadPluginCommon.advertiserTracking().then((enabled: boolean) => {
    console.log('Tracking is', enabled);
  });

  BidmadPluginCommon.setIsChildDirectedAds(false);

  BidmadPluginCommon.isChildDirectedTreatment().then((isChild: boolean) => {
    console.log('Is Child is', isChild);
  });

  BidmadPluginCommon.setUserConsentCCPA(true);
  
  BidmadPluginCommon.isUserConsentCCPA().then((ccpaStatus: boolean) => {
    console.log('ccpa status is', ccpaStatus);
  });

  BidmadPluginCommon.setIsDebug(true);

  BidmadPluginCommon.isDebug().then((isDebug: boolean) => {
    console.log('debug is', isDebug);
  });

  BidmadPluginCommon.setTestDeviceId('good bye bus');
  
  BidmadPluginCommon.testDeviceId().then((testDeviceId: string) => {
    console.log('test device is', testDeviceId);
  });

  BidmadPluginCommon.setCuid('cuid goodgood');

  BidmadPluginCommon.cuid().then((cuid: string) => {
    console.log('cuid is', cuid);
  });

  BidmadPluginCommon.setUseServerSideCallback(true);

  BidmadPluginCommon.useServerSideCallback().then((ssc: boolean) => {
    if (ssc) {
      console.log('using server side callback');
    } else {
      console.log('NOT using server side callback');
    }
  });

  BidmadPluginCommon.testDeviceId().then((id: string) => {
    console.log('test device id is', id, 'and type is', (typeof id));
  });

  BidmadPluginCommon.cuid().then((cuid: string) => {
    console.log('cuid is', cuid, 'and type is', (typeof cuid));
  })

  return (
    <View style={styles.container}>
      <Text>Hello there</Text>
      <Animated.View style={{ width: '100%', height: bannerHeight1, overflow: 'hidden' }}>
        <BidmadPluginTestView
          style={{ width: '100%', height: 50 }}
          iOSZoneId='1c3e3085-333f-45af-8427-2810c26a72fc'
          androidZoneId=''
          onClick={() => console.log('BANNER CLICKED!')}
          onLoad={onBannerLoad1}
          onLoadFail={() => console.log('BANNER LOAD FAILED!')}
        />
      </Animated.View>
      <Animated.View style={{ marginVertical: paddingAnim }}>
        <Text>This is Shrinking or Expading</Text>
      </Animated.View>
      <Animated.View style={{ width: '100%', height: 50, overflow: 'hidden', opacity: bannerOpacity2 }}>
        <BidmadPluginTestView
          style={{ width: '100%', height: 50 }}
          iOSZoneId='1c3e3085-333f-45af-8427-2810c26a72fc'
          androidZoneId=''
          onClick={() => console.log('BANNER CLICKED!')}
          onLoad={onBannerLoad2}
          onLoadFail={() => console.log('BANNER LOAD FAILED!')}
        />
      </Animated.View>
      <Button title="Toggle Padding" onPress={togglePadding} />
      <Button title="Go to Second" onPress={() => navigation.navigate('Second')} />
      <Button title="Go to Third" onPress={() => navigation.navigate('Third')} />
    </View>
  );
}

function SecondScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Second Page</Text>
      <BidmadPluginTestView
        style={{ width: 320, height: 50 }}
        iOSZoneId='1c3e3085-333f-45af-8427-2810c26a72fc'
        androidZoneId=''
        refreshInterval={90}
        onClick={() => console.log('BANNER CLICKED!')}
        onLoad={() => console.log('BANNER LOADED!')}
        onLoadFail={() => console.log('BANNER LOAD FAILED!')}
      />
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      <Button title="Go to Third" onPress={() => navigation.navigate('Third')} />
    </View>
  );
}

function ThirdScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Third Page</Text>
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      <Button title="Go to Second" onPress={() => navigation.navigate('Second')} />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Second" component={SecondScreen} />
        <Stack.Screen name="Third" component={ThirdScreen} />
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
