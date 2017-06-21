import React, { Component } from 'react';

import { View } from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';

import style from 'app/assets/scanner.page.style.js';

export default class ScannerPage extends Component {

  static navigationOptions = {
    title: 'Scan QR Code for Gist',
  }

  naviProps() {
    return this.props.navigation.state.params;
  }

  render() {
    return (
      <View style={style.body}>
        <QRCodeScanner onRead={this.naviProps().onScannerFinish}/>
      </View>
    );
  }
}
