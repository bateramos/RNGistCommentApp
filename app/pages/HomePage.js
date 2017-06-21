import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Text,
  View,
  Button
} from 'react-native';

import style from 'app/assets/home.page.style.js';

export default class HomePage extends Component {

  static propTypes = {
    username : PropTypes.string,
    onOpenScanner : PropTypes.func.isRequired,
    onOpenGist : PropTypes.func.isRequired
  }

  static defaultProps = {
    username : 'You'
  }

  render() {
    return (
      <View style={style.body}>
        <Text style={style.helloTitle}>Hello, {this.props.username}.</Text> 
        <Text style={style.explanation}>Scan QRCode to comment on Gists from Github!</Text>
        <View style={style.divider}/>
        <Button style={style.button} title='Scan QRCode!' onPress={this.props.onOpenScanner}/>
      </View>
    );
  }
}
