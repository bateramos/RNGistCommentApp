import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Text,
  View,
  ScrollView,
  Modal,
  TextInput,
  Image,
  Button,
  Alert,
  ActivityIndicator
} from 'react-native';

import loginService from 'app/services/loginService';

import style from 'app/assets/login.modal.style.js';

export default class LoginModal extends Component {

  static propTypes = {
    onClose : PropTypes.func.isRequired,
    onLogin : PropTypes.func.isRequired,
    onLogout : PropTypes.func.isRequired,
    visible : PropTypes.bool,
    username : PropTypes.string
  };

  static defaultProps = {
    visible : false,
    username : ''
  }

  constructor(props) {
    super(props);

    this.handleProps(props);
  }

  handleProps(props) {
    const newState = {
      fetching : false,
      username : props.username
    };

    if (this.state) {
      this.setState(newState);
    } else {
      this.state = newState;
    }
  }

  componentWillReceiveProps(props) {
    this.handleProps(props);
  }

  onAuthenticationFailed(error) {
    console.log(error); // eslint-disable-line no-console
    Alert.alert('Atention', 'Authentication failed. Please check if your username and password are corrects.',
      [{
        text : 'OK',
        onPress : () => {
          this.setState({ fetching : false });
        }
      }]);
  }

  onLoginPressed() {
    this.setState({ fetching : true });

    loginService.login(this.state.username, this.state.password)
      .then(result => {
        this.props.onLogin(result);
        this.setState({ fetching : false });
      })
      .catch(this.onAuthenticationFailed.bind(this));
  }

  onLogoutPressed() {
    this.setState({ fetching : true });

    loginService.logout(this.state.username, this.state.password)
      .then(result => {
        this.props.onLogout(result);
        this.setState({ fetching : false });
      })
      .catch(this.onAuthenticationFailed.bind(this));
  }

  render() {
    const logged = !!this.props.username;
    const loading = this.state.fetching;
    return (
      <Modal
        animationType={'slide'}
        onRequestClose={this.props.onClose}
        visible={this.props.visible}>
        <ScrollView>
          <View style={style.body}>

            <Image style={style.gistImage} source={require('app/img/logogist.png')} />

            <View style={style.fieldContainer}>
              <Text>Github Username</Text>
              <TextInput onChangeText={(text) => this.setState({ username : text})} editable={!loading}
                defaultValue={this.props.username}/>
            </View>

            <View style={style.fieldContainer}>
              <Text>Password</Text>
              <TextInput secureTextEntry={true} editable={!loading}
                onChangeText={(text) => this.setState({ password : text})}/>
            </View>

            <View style={style.buttonContainer}>
              { !logged ? 
                <Button title={'Authorize'} disabled={loading} onPress={this.onLoginPressed.bind(this)}/> :
                <Button title={'Desauthorize'} disabled={loading} onPress={this.onLogoutPressed.bind(this)}/>
              }
              <View style={style.buttonDivider}/>
              <Button title={'Cancel'} onPress={this.props.onClose}/>
            </View>

            { loading ? <ActivityIndicator size='large'/> : null}
            
          </View>
        </ScrollView>
      </Modal>
    );
  }
}
