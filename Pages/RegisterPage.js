import React from 'react';
import { Container, Content, Form, Item, Input, Button, Text, Spinner, Thumbnail } from 'native-base';
import { TouchableOpacity, KeyboardAvoidingView, ScrollView } from 'react-native'
import { observer, inject } from 'mobx-react';
import { Header } from 'react-navigation-stack'


class SignUpPage extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            Username: "",
            Email: "",
            Password: "",
            userID: -1,
            apiIsFetchingData: false,
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
                console.log("res=", res);
                return res.json();
            })
            .then(
                result => {
                    this.setState({ apiIsFetchingData: false, apiCallFinished: true })
                    console.log("fetch GET= ", result);
                    this.setState({
                        userID: result
                    })
                    this.props.navigation.navigate("LoginPage")
                },
                error => {
                    console.log("=> err post=", error);
                }
            );

        if (this.props.rootStore.CameraStore.RegisterPhotoURI !== "" && this.state.userID != -1) {
            console.log(this.props.rootStore.CameraStore.RegisterPhotoURI)
            this.imageUpload(this.props.rootStore.CameraStore.RegisterPhotoURI, user.Username + "_Picture.jpg", this.state.userID)
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
                console.log(responseData)
                if (responseData.status === 201) {
                    alert('uploaded successfully!')
                }
                else {
                    alert('error uploding ...');
                }
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
                    <Container contentContainerStyle={{ backgroundColor: 'gray' }}>
                        <Content padder>
                            <ScrollView>
                                <Form>
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
                                    <Text style={{ alignSelf: 'center' }}>Click here to change picture</Text>
                                    <Item fixedLabel>
                                        <Input placeholder="Username" onChangeText={val => this.changeUsername(val)} />
                                    </Item>
                                    <Item fixedLabel>
                                        <Input placeholder="Email" onChangeText={val => this.changeEmail(val)} />
                                    </Item>
                                    <Item fixedLabel>
                                        <Input placeholder="Password" secureTextEntry={true} onChangeText={val => this.changePassword(val)} />
                                    </Item>
                                    <Button
                                        onPress={this.register}
                                        style={{ justifyContent: 'center', marginTop: 10, backgroundColor: 'rgb(186, 40, 0)' }}>
                                        <Text style={{ color: 'black' }}>REGISTER</Text>
                                    </Button>

                                </Form>
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