import React from 'react';

import {
  AppRegistry,
  View,
  ToolbarAndroid
} from 'react-native';

import { StackNavigator } from 'react-navigation';

import HomePage from 'app/pages/HomePage';
import GistPage from 'app/pages/GistPage';
import ScannerPage from 'app/pages/ScannerPage';
import IndexPage from 'app/pages/IndexPage';
import LoginModal from 'app/components/LoginModal';

import style from 'app/assets/index.android.style.js';

export default class MainPage extends IndexPage {

  actions = [
    { title : 'Account', show : 'always' }
  ]

  render() {
    return (
      <View>
        <ToolbarAndroid
          style={style.toolbar}
          actions={this.actions}
          title="Gists Comment Demo"
          showWithText={true}
          onActionSelected={this.onActionSelected.bind(this)} />
        <HomePage
          onOpenGist={this.onOpenGist.bind(this)}
          onOpenScanner={this.onOpenScanner.bind(this)}
          username={this.state.username} />
        <LoginModal
          visible={this.state.showLoginModal}
          username={this.state.username}
          onClose={this.onLoginModalClose.bind(this)}
          onLogin={this.onLoginSuccessfull.bind(this)}
          onLogout={this.onLogout.bind(this)} />
      </View>
    );
  }
}

const App = StackNavigator({
  Home: {
    screen: MainPage,
    navigationOptions: {
      header: null,
    },
  },
  GistPage: {
    screen: GistPage
  },
  Scanner : {
    title : 'Scan QR Code',
    screen: ScannerPage
  }
});

AppRegistry.registerComponent('GistsComment', () => App);
