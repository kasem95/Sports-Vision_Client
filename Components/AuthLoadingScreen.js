import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  View,
} from 'react-native';
import { observer, inject } from 'mobx-react';
import User from '../Classes/User';

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const data = await AsyncStorage.getItem('user');
    const user = JSON.parse(data);
    this.props.rootStore.UserStore.user = user;
    if (await AsyncStorage.getItem('faceORG') === '1') {
      this.props.rootStore.UserStore.setFaceORGLogin(1);
    } else {
      this.props.rootStore.UserStore.setFaceORGLogin(-1);
    }
    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.

    this.props.navigation.navigate(user !== null ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

export default inject('rootStore')(observer(AuthLoadingScreen));