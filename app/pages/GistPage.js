import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Text,
  View,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert
} from 'react-native';

import { NavigationActions } from 'react-navigation';

import style from 'app/assets/gist.page.style.js';

import gistService from 'app/services/gistService';

export default class GistPage extends Component {

  static navigationOptions = {
    title: 'Gist',
  }

  static propTypes = {
    token : PropTypes.string,
    gistId : PropTypes.string
  }

  constructor(props) {
    super(props);
    this.state = {
      loading : true,
      loadingComments : true,
      pushingComment : false
    };

    this.handleProps(this.naviProps());
  }

  naviProps() {
    return this.props.navigation.state;
  }

  handleProps(props) {
    this.loadCode(props);
    this.loadComments(props);
  }

  onLoadFailed(error) {
    console.log(error); // eslint-disable-line no-console
    Alert.alert('Atention', `Gist couldn't be loaded.
      Verify if the QR Code is correct or your internet connection is working.`,
      [{
        text : 'OK',
        onPress : () => {
          this.props.navigation.dispatch(NavigationActions.back());
        }
      }]);
  }

  onCommentSubmitFailed(error) {
    console.log(error); // eslint-disable-line no-console
    Alert.alert('Atention', `Comment couldn't be submitted.
      Verify if your user is authenticated or your internet connection is working.`,
      [{ text : 'OK' }]);
  }

  loadCode({ token, gistId }) {
    return gistService.fetchGist(token, gistId)
      .then(gistText => {
        this.setState({ gistText, loading : false });
      })
      .catch(this.onLoadFailed.bind(this));
  }

  loadComments({ token, gistId }) {
    if (!this.state.loadingComments) {
      this.setState({ loadingComments : true });
    }

    return gistService.loadComments(token, gistId)
      .then(comments => {
        this.setState({ loadingComments : false, comments });
      })
      .catch(this.onLoadFailed.bind(this));
  }

  componentWillReceiveProps(props) {
    this.handleProps(props);
  }

  submitComment() {
    const { token, gistId } = this.naviProps();

    this.setState({ pushingComment : true });

    return gistService.pushComment(token, gistId, this.state.comment)
      .then(() => this.loadComments({ token, gistId }))
      .then(() => this.setState({ pushingComment : false, comment : '' }))
      .then(() => this.commentInput.setNativeProps({text: ''}))
      .catch(this.onCommentSubmitFailed.bind(this));
  }

  renderLoading(loading) {
    return loading ? (<View>
        <ActivityIndicator size='large' />
      </View>) : null;
  }

  renderCode() {
    return this.renderLoading(this.state.loading) || (
      <ScrollView>
        {this.state.gistText.map(gist => (
          <View key={gist.fileName}>
            <View style={style.divider} />
            <Text style={style.fileName}>{gist.fileName}</Text>
            <Text style={style.codeField}>{gist.text}</Text>
          </View>)
        )}
      </ScrollView>
    );
  }

  renderComments() {
    return this.renderLoading(this.state.loadingComments) || (
      <View>
        <ScrollView>
          {!this.state.comments.length ? (<Text> No comments Yet! </Text>) :
            this.state.comments.map(comment => (
              <View style={style.row} key={comment.id}>
                <Text style={style.rowMessage}>{comment.body}</Text>
                <Text style={style.rowUserName}>{comment.user.login}</Text>
              </View>
            ))
          }
        </ScrollView>
      </View>
    );
  }

  render() {
    const logged = !!this.naviProps().token;
    return (
      <KeyboardAvoidingView style={style.body}>
        <View style={style.codeContainer}>
          {this.renderCode()}
        </View>
        <View style={style.commentContainer}>
          <View style={style.sectionDivider}/>
          <Text style={style.commentsTitle}>Comments</Text>
          {this.renderComments()}
        </View>
        <TextInput ref={ref => this.commentInput = ref} returnKeyType='send'
          editable={logged && !this.state.pushingComment}
          defaultValue={logged ? '' : 'To Comment you need to authorize this app'}
          onChangeText={(text) => this.setState({ comment : text })}
          onSubmitEditing={this.submitComment.bind(this)}/>
      </KeyboardAvoidingView>
    );
  }
}
