import { Component } from 'react';

import { AsyncStorage } from 'react-native';

import { NavigationActions } from 'react-navigation';

export default class IndexPage extends Component {

  state = {
    showLoginModal : false,
    logged : false,
    accessToken : null,
    username : undefined
  }

  componentWillMount() {
    AsyncStorage.multiGet(['accessToken', 'username'])
      .then(result => {
        const token = result[0][1];
        const username = result[1][1];
        this.setState({
          accessToken : token,
          logged : !!token,
          username : username || undefined
        });
      });
  }

  onActionSelected() {
    this.setState({ showLoginModal : true });
  }

  onLoginModalClose() {
    this.setState({ showLoginModal : false });
  }

  onLoginSuccessfull(result) {
    AsyncStorage.multiSet([
      ['accessToken', result.token],
      ['username', result.username]
    ])
    .then(() => {
      this.setState({
        showLoginModal : false,
        logged : true,
        accessToken : result.token,
        username : result.username
      });
    });
  }

  onLogout() {
    AsyncStorage.clear()
    .then(() => {
      this.setState({
        showLoginModal : false,
        logged : false,
        accessToken : null,
        username : undefined
      });
    }); 
  }

  onOpenGist(qrcode) {
    const resetAction = NavigationActions.reset({
      index: 1,
      actions: [
        NavigationActions.navigate({ routeName: 'Home'}),
        NavigationActions.navigate({
          routeName: 'GistPage',
          token : this.state.accessToken,
          gistId : qrcode.data
        })
      ]
    });
    this.props.navigation.dispatch(resetAction);
  }

  onOpenScanner() {
    const { navigate } = this.props.navigation;

    navigate('Scanner', {
      onScannerFinish : this.onOpenGist.bind(this),
    });
  }
}
