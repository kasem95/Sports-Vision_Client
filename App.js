import React from 'react';
import { createAppContainer, createSwitchNavigator } from
  'react-navigation';
import { I18nManager } from 'react-native'
import { createStackNavigator } from 'react-navigation-stack'
import Home from './Pages/Home';
import LoginPage from './Pages/LoginPage';
import SignUpPage from './Pages/RegisterPage';
import MainPage from './Pages/MainPage'
import CameraPage from './Pages/CameraPage'
import ProfilePage from './Pages/ProfilePage'
import MatchesPage from './Pages/MatchesPage'
import FriendsPage from './Pages/FriendsPage'
import UsersToAddFriendPage from './Pages/UsersToAddFriendPage'
import CreateMatchPage from './Pages/CreateMatchPage'
import { Provider } from 'mobx-react';
import Store from './Store/Store'
import { AppLoading } from 'expo';
import { Container, StyleProvider, Root } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import AuthLoadingScreen from './Components/AuthLoadingScreen'
import getTheme from './native-base-theme/components';
import material from './native-base-theme/variables/material'

I18nManager.allowRTL(false)
I18nManager.forceRTL(false)

class App extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      isReady: false,
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    });
    this.setState({ isReady: true });
  }

  render() {

    if (!this.state.isReady) {
      return <AppLoading />;
    }

    return (
      <Root>
        <Provider rootStore={Store}>
          <Container>
            <AppContainer />
          </Container>
        </Provider>
      </Root>

    )
  }
}

const AppNavigator = createStackNavigator(
  {
    MainPage,
    ProfilePage,
    MatchesPage,
    FriendsPage,
    UsersToAddFriendPage,
    CreateMatchPage,
    CameraPage,
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: 'rgb(186, 40, 0)',
      },
      headerTitleStyle: {
        color: 'rgb(48,48,48)'
      }

    }
  }
);
const AuthStack = createStackNavigator(
  {
    Home,
    LoginPage,
    SignUpPage,
    CameraPage,
  }
);

const AppContainer = createAppContainer(createSwitchNavigator({
  AuthLoading: AuthLoadingScreen,
  App: AppNavigator,
  Auth: AuthStack,
}, {
  initialRouteName: 'AuthLoading'
}))
export default App;
