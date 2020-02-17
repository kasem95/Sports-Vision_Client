import React from 'react';
import { Container, Content, Form, Item, Input, Button, Text, Spinner, Thumbnail, Icon } from 'native-base';
import { TouchableOpacity, KeyboardAvoidingView, ScrollView } from 'react-native'
import { observer, inject } from 'mobx-react';
import { Header } from 'react-navigation-stack'


class SignUpPage extends React.Component {

    static navigationOptions = {
        title: 'REGISTER'
    }

    constructor(props) {
        super(props)
        this.state = {
            Username: "",
            Email: "",
            Password: "",
            userID: -1,
            apiIsFetchingData: false,
            usernameErr: false,
            emailErr: false,
            passwordErr: false,
            err: ''
        }
    }

    changeUsername = (val) => {
        this.setState({
            Username: val
        })
    }

    changeEmail = (val) => {
        this.setState({
            Email: val
        })
    }

    changePassword = (val) => {
        this.setState({
            Password: val
        })
    }

    register = async () => {
        if (this.state.Username === "") {
            this.setState({ usernameErr: true, err: '*Please enter an username...' })
        }
        if (this.state.Email === "") {
            this.setState({ emailErr: true, err: '*Please enter an email...' })
        }
        if (this.state.Password === "") {
            this.setState({ passwordErr: true, err: '*Please enter an password...' })
        } 
        if(this.state.Password !== "" && this.state.Email !== "" && this.state.Username !== "") {
            let user = {
                Username: this.state.Username,
                Email: this.state.Email,
                Password: this.state.Password,
            }

            this.setState({ apiIsFetchingData: true })
            await fetch(`http://ruppinmobile.tempdomain.co.il/site09/api/User`, {
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
                        console.log("fetch GET= ", result);
                        this.setState({ apiIsFetchingData: false, apiCallFinished: true })
                        if (result > 0) {
                            this.setState({
                                userID: result
                            },()=>{
                                if (this.props.rootStore.CameraStore.RegisterPhotoURI !== "" && this.state.userID != -1) {
                                    console.log(this.props.rootStore.CameraStore.RegisterPhotoURI)
                                    this.imageUpload(this.props.rootStore.CameraStore.RegisterPhotoURI, user.Username + "_Picture.jpg", this.state.userID)
                                }
                                this.props.rootStore.CameraStore.changeRegisterPhotoURI("")
                                this.props.navigation.navigate("LoginPage")
                            })
                            
                        }
                        else if (result === -2) {
                            this.setState({ err: '*Invalid email and password!', emailErr: true, passwordErr: true })
                        }
                        else if (result === -3) {
                            this.setState({ err: '*Invalid email!' + result, emailErr: true })
                        }
                        else if (result === -4) {
                            this.setState({ err: '*Invalid password!' + result, passwordErr: true })
                        }
                        else if (result === -5) {
                            this.setState({ err: '*User is already exists!' + result })
                        }
                        else {
                            this.setState({ err: '*' + result.Message })
                        }
                    },
                    error => {
                        console.log("=> err post=", error);
                        this.setState({ err: '*' + error })
                    }
                );

            
        }

    }

    imageUpload = async (imgUri, picName, userID) => {
        let urlAPI = "http://ruppinmobile.tempdomain.co.il/site09/uploadpicture";
        let dataI = new FormData();
        dataI.append('picture', {
            uri: imgUri,
            name: picName,
            type: 'image/jpg',
        });
        dataI.append('userID', userID)
        console.log(dataI)
        const config = {
            method: 'POST',
            body: dataI,
        };

        console.log(config.body)

        await fetch(urlAPI, config)
            .then((responseData) => {
                //console.log(responseData)
                if (responseData.status !== 201) {
                    alert('error uploding ...');
                }
                this.props.rootStore.CameraStore.changeSignUpOrCreateMatch(undefined)
            })
            .catch(err => {
                alert('err upload= ' + err);
            });
    }

    camerapage = () => {
        this.props.rootStore.CameraStore.changeSignUpOrCreateMatch(0)
        this.props.navigation.navigate("CameraPage")
    }

    render() {
        if (!this.state.apiIsFetchingData) {
            return (
                <KeyboardAvoidingView keyboardVerticalOffset={Header.HEIGHT} behavior="padding" style={{ flex: 1 }}>
                    <Container style={{ backgroundColor: 'rgb(48,48,48)' }}>
                        <Content padder>
                            <ScrollView style={{ flex: 1, flexDirection: 'column' }}>

                                <TouchableOpacity onPress={this.camerapage}>
                                    <Thumbnail style={{
                                        paddingVertical: 30,
                                        width: 150,
                                        height: 150,
                                        borderRadius: 75,
                                        alignSelf: 'center'
                                    }}
                                        resizeMode='cover'
                                        source={this.props.rootStore.CameraStore.RegisterPhotoURI === "" ?
                                            require('../assets/profilepicture.png')
                                            : { uri: this.props.rootStore.CameraStore.RegisterPhotoURI }}
                                    />
                                </TouchableOpacity>
                                <Text style={{ alignSelf: 'center', color: 'rgb(186, 40, 0)' }}>Click on the picture to change it</Text>
                                <Item fixedLabel error={this.state.usernameErr} style={{ flex: 0.2 }}>
                                    <Input placeholder="Username" onChangeText={val => this.changeUsername(val)} style={{ color: 'rgb(204,204,204)' }} />
                                    <Icon name='close-circle' />
                                </Item>
                                <Item fixedLabel error={this.state.emailErr} style={{ flex: 0.2 }}>
                                    <Input placeholder="Email" onChangeText={val => this.changeEmail(val)} style={{ color: 'rgb(204,204,204)' }} />
                                    <Icon name='close-circle' />
                                </Item>
                                <Item fixedLabel style={{ flex: 1, flexDirection: 'column', borderBottomColor: 'transparent' }}>
                                    <Item error={this.state.passwordErr}>
                                        <Input placeholder="Password" secureTextEntry={true} onChangeText={val => this.changePassword(val)} style={{ color: 'rgb(204,204,204)' }} />
                                        <Icon name='close-circle' />
                                    </Item>
                                    <Item style={{ borderBottomColor: 'transparent' }}>
                                        <Text note style={{ color: 'gray' }}>*Password must be at 8-12 characters and at least 1 number, 1 small letter and 1 capital letter!</Text>
                                    </Item>
                                </Item>
                                <Item fixedLabel style={{ flex: 0.2, borderBottomColor: 'transparent' }}>
                                    {this.state.err !== '' && <Text note style={{ color: 'red' }}>{this.state.err}</Text>}
                                </Item>

                                <Button block
                                    onPress={this.register}
                                    style={{ backgroundColor: 'rgb(186, 40, 0)' }}>
                                    <Text style={{ color: 'black' }}>REGISTER</Text>
                                </Button>

                            </ScrollView>
                        </Content>
                    </Container>

                </KeyboardAvoidingView >
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

export default inject('rootStore')(observer(SignUpPage));