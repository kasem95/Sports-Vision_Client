import React from 'react';
import { Container, Content, Form, Item, Input, Button, Text, Spinner, Icon, Toast } from 'native-base';
import { KeyboardAvoidingView, ScrollView, AsyncStorage, Image } from 'react-native'
import { observer, inject } from 'mobx-react';
import User from '../Classes/User'
import * as Facebook from 'expo-facebook';
import * as Google from 'expo-google-app-auth';

const AppID = '514084169415898';
const googleIOSClientID = "478192099665-t6ehj9l5jjsgnl6skpj0o7kie2t43anj.apps.googleusercontent.com"
const googleAndroidClientID = "478192099665-0rp515m0fkgqebev04qompgtc7ms25m9.apps.googleusercontent.com"

class Login extends React.Component {

  static navigationOptions = {
    title: 'LOGIN'
  }

  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      apiIsFetchingData: false,
      emailInvalid: false,
      passwordInvalid: false
    }
  }


  changeEmail = val => {
    this.setState({
      email: val,
      emailInvalid: false
    })
  }

  changePass = val => {
    this.setState({
      password: val,
      passwordInvalid: false
    })
  }


  login = async () => {
    this.state.email === "" && this.setState({ emailInvalid: true }, () => Toast.show({ text: 'Enter email!', buttonText: 'Okay', type: 'danger', duration: 10000 }))
    this.state.password === "" && this.setState({ passwordInvalid: true }, () => Toast.show({ text: 'Enter password!', buttonText: 'Okay', type: 'danger', duration: 10000 }))
    this.state.password !== "" && this.state.email !== "" && this.setState({
      apiIsFetchingData: true
    }, async () => {
      await fetch(`http://ruppinmobile.tempdomain.co.il/site09/api/Users/${this.state.email},${this.state.password}/login`, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json;',
        })
      })
        .then(res => {
          //console.log("res=", res);
          return res.json();
        })
        .then(
          result => {
            console.log("fetch GET= ", result);
            if (typeof result == "string") {
              this.setState({
                apiIsFetchingData: false
              })
              Toast.show({ text: result, buttonText: 'Okay', type: 'danger', duration: 10000 })
            } else {
              this.setState({
                apiIsFetchingData: false
              })
              console.log(result)
              let user = new User(result.UserID, result.Email, result.Password, result.Username, result.PhotoName);
              this.props.rootStore.UserStore.insertUser(user);
              AsyncStorage.setItem('user', JSON.stringify(user))
              if (result.PhotoName.slice(0, 8) !== "https://") {
                this.props.rootStore.UserStore.setFaceORGLogin(-1)
                AsyncStorage.setItem('faceORG', '-1')
              } else {
                this.props.rootStore.UserStore.setFaceORGLogin(1)
                AsyncStorage.setItem('faceORG', '1')
              }
              this.setState({
                apiIsFetchingData: false
              })
              this.props.navigation.navigate("App")
            }
          },
          error => {
            this.setState({
              apiIsFetchingData: false
            })
            console.log("=> err post=", error);
          }
        );
    })
  }

  btnLoginFB = async () => {
    this.setState({
      apiIsFetchingData: true
    })
    await Facebook.initializeAsync(AppID)
    const { type, token } = await Facebook.logInWithReadPermissionsAsync(AppID,
      { permissions: ['public_profile', 'email'], });
    if (type === 'success') {
      //after getting the token we can use a simple fetch against the facebook API
      // Get the user's name using Facebook's Graph API
      const response = await
        fetch(`https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${token}`);
      let res = await response.json();
      this.props.rootStore.UserStore.FBToken = token;
      /*alert('Logged in!' + `Hi NAME: ${res.name}!\nEMAIL: ${res.email}\nPICTURE:
    ${res.picture}\nRES:${JSON.stringify(res)} `);*/

      console.log(JSON.stringify(res))

      let user = {
        id: res.id,
        username: res.name,
        email: res.email,
        imageURL: res.picture.data.url
      }
      console.log("wlaaaaaaaaaaaaaaaw")
      await fetch(`http://ruppinmobile.tempdomain.co.il/site09/Users.asmx/GetLoginDetailsFB`, {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          //console.log("res=", res);
          return res.json();
        })
        .then(
          result => {
            this.setState({
              apiIsFetchingData: false
            })
            console.log("fetch GET= ", result);
            let u = JSON.parse(result.d);
            console.log(u)
            let u2 = new User(u.UserID, u.Email, u.Password, u.Username, u.PhotoName);
            this.props.rootStore.UserStore.user = u2;
            AsyncStorage.setItem('user', JSON.stringify(u2))
            if (u.PhotoName.slice(0, 8) === "https://") {
              this.props.rootStore.UserStore.setFaceORGLogin(1)
              AsyncStorage.setItem('faceORG', '1')
            } else {
              this.props.rootStore.UserStore.setFaceORGLogin(-1)
              AsyncStorage.setItem('faceORG', '-1')
            }
            this.props.navigation.navigate("App");
          },
          error => {
            this.setState({
              apiIsFetchingData: false
            })
            console.log("=> err post=", error);
          }
        );


    } else {
      // type === 'cancel'
      this.setState({
        apiIsFetchingData: false
      })
      console.log("cancelled")
    }
  };

  btnLoginG = async () => {
    // First- obtain access token from Expo's Google API
    this.setState({
      apiIsFetchingData: true
    })
    try {
      const res = await Google.logInAsync({
        androidClientId: googleAndroidClientID,
        iosClientId: googleIOSClientID,
        scopes: ['profile', 'email'],
      });

      if (res.type === 'success') {
        console.log(res.user);
        let userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
          headers: { Authorization: `Bearer ${res.accessToken}` },
        });
        console.log("user info response = " + JSON.stringify(userInfoResponse))
        console.log("user = " + JSON.stringify(res.user))
        let usertemp = {
          id: res.user.id,
          username: res.user.name,
          email: res.user.email,
          imageURL: res.user.photoUrl
        }
        let u = null;

        await fetch(`http://ruppinmobile.tempdomain.co.il/site09/Users.asmx/GetLoginDetailsGoogle`, {
          method: "POST",
          body: JSON.stringify(usertemp),
          headers: {
            "Content-Type": "application/json"
          }
        })
          .then(res => {
            //console.log("res=", res);
            return res.json();
          })
          .then(
            result => {
              this.setState({
                apiIsFetchingData: false
              })
              console.log("fetch GET= ", result);
              u = JSON.parse(result.d);
              let u2 = new User(u.UserID, u.Email, u.Password, u.Username, u.PhotoName);
              this.props.rootStore.UserStore.user = u2;
              AsyncStorage.setItem('user', JSON.stringify(u2))
              if (u.PhotoName.slice(0, 8) === "https://") {
                this.props.rootStore.UserStore.setFaceORGLogin(1)
                AsyncStorage.setItem('faceORG', '1')
              }else {
                this.props.rootStore.UserStore.setFaceORGLogin(-1)
                AsyncStorage.setItem('faceORG', '-1')
              }
              this.props.navigation.navigate("App");
            },
            error => {
              this.setState({
                apiIsFetchingData: false
              })
              console.log("=> err post=", error);
            }
          );
      } else {
        this.setState({
          apiIsFetchingData: false
        })
        console.log("cancelled")
      }
    } catch (e) {
      this.setState({
        apiIsFetchingData: false
      })
      console.log("error");
    }
  }
  render() {
    if (!this.state.apiIsFetchingData) {
      return (


        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <Container style={{ backgroundColor: 'rgb(48,48,48)' }}>

            <Content padder>
              <Image source={require('../assets/Sports-Vision.png')} style={{
                alignSelf: 'center',
                paddingVertical: 30,
                width: 160,
                height: 250,
                marginTop: 25
              }} />
              <ScrollView>
                <Form>
                  <Item fixedLabel error={this.state.emailInvalid}>
                    <Input placeholder="Email" onChangeText={val => this.changeEmail(val)} style={{ color: 'rgb(204,204,204)' }} />
                    <Icon name='close-circle' />
                  </Item>
                  <Item fixedLabel error={this.state.passwordInvalid}>
                    <Input secureTextEntry={true} placeholder="Password" onChangeText={val => this.changePass(val)} style={{ color: 'rgb(204,204,204)' }} />
                    <Icon name='close-circle' />
                  </Item>
                </Form>
                <Content >
                  <Button onPress={this.login} style={{ justifyContent: 'center', backgroundColor: 'rgb(186, 40, 0)', marginTop: 5 }}>
                    <Text>LOGIN</Text>
                  </Button>
                  <Button onPress={this.btnLoginFB} style={{ justifyContent: 'center', marginTop: 5 }} >
                    <Icon active name="logo-facebook" />
                    <Text>Facebook LOGIN</Text>
                  </Button>
                  <Button onPress={this.btnLoginG} style={{ justifyContent: 'center', backgroundColor: 'rgb(255,0,0)', marginTop: 5 }}>
                    <Icon active name="logo-googleplus" />
                    <Text>GOOGLE LOGIN</Text>
                  </Button>
                </Content>
              </ScrollView>
            </Content>
          </Container>
        </KeyboardAvoidingView>

      )
    }
    else {
      return (
        <Container>
          <Spinner color="red" style={{ alignSelf: 'center' }} />
        </Container>
      )
    }
  }
}


export default inject('rootStore')(observer(Login))
