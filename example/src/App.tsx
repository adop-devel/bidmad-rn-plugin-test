import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import { BidmadPluginTestView } from 'bidmad-rn-plugin-test';

export default function App() {
  return (
    <View style={styles.container}>
      <BidmadPluginTestView
        color="#32a852"
        style={styles.box}
        onClick={() => console.log('BANNER CLICKED!')}
        onLoad={() => console.log('BANNER LOADED!')}
        onLoadFail={() => console.log('BANNER LOAD FAILED!')}
      />
    </View>
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
