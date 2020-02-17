import React from 'react';
import { Container, Text, Item, Button, Toast } from 'native-base';
import { Image, TouchableOpacity, AsyncStorage } from 'react-native';
import { observer, inject } from 'mobx-react';
import ChangePasswordModal from '../Modals/ChangePasswordModal'
import ChangeUsernameModal from '../Modals/ChangeUsernameModal'
import User from '../Classes/User'



class ProfilePage extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            title: 'PROFILE',
            headerRight: <TouchableOpacity onPress={() => params.logout()}><Text style={{ fontSize: 15, fontWeight: 'bold', marginRight: 10 }}>logout</Text></TouchableOpacity>
        };
    };

    _isMounted = false;

    constructor(props) {
        super(props)

        const { user } = this.props.rootStore.UserStore

        this.state = {
            user: user,
            passModalIsVisible: false,
            usernameModalIsVisible: false,
            pass: user.password,
            username: user.username
        }
    }

    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {
            this.props.navigation.setParams({ logout: this.logout })
            console.log(this.props.rootStore.UserStore.user.username)
        }
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    logout = async () => {
        await AsyncStorage.clear();
        if (this.props.rootStore.UserStore.faceORGLogin == 1) {
            this.props.rootStore.UserStore.setFaceORGLogin()
        }

        this.props.navigation.navigate('Auth');
    }

    changePass = val => {
        this.setState({ pass: val },
            async() => {
                await this.props.rootStore.UserStore.getNewUserDetails();
                this.setState({ passModalIsVisible: false },
                    () => Toast.show({ text: "Password changed", buttonText: 'Okay', type: 'success' }))
            })
    }

    changeUsername = val => {
        this.setState({ username: val }, async() => {
            await this.props.rootStore.UserStore.getNewUserDetails('username')
            this.setState({ usernameModalIsVisible: false },
                () => Toast.show({ text: "Username changed", buttonText: 'Okay', type: 'success' }))
        })
    }

    changePicture = async() => {
        await this.props.rootStore.CameraStore.changeSignUpOrCreateMatch(2)
        this.props.navigation.navigate("CameraPage")
    }

    render() {
        return (

            <Container style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgb(48,48,48)' }}>
                <Item style={{ backgroundColor: 'rgb(186, 40, 0)', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={this.changePicture}>
                        <Image
                            style={{
                                paddingVertical: 30,
                                width: 150,
                                height: 150,
                                borderRadius: 75,
                                backgroundColor: 'rgb(204,204,204)'
                            }}
                            source={this.props.rootStore.UserStore.faceORGLogin == 1 ? { uri: this.state.user.imageURL } : { uri: `http://ruppinmobile.tempdomain.co.il/site09/uploadFiles/${this.state.user.imageURL}` }} />
                    </TouchableOpacity>
                </Item>
                <Item style={{ flex: 1, flexDirection: 'column', borderBottomColor: 'transparent' }}>
                    <Text style={{ color: 'rgb(204,204,204)', fontSize: 30, fontWeight: 'bold' }}>
                        {this.state.username}
                    </Text>
                    <Text note>{this.state.user.email}</Text>
                </Item>
                <Item style={{ flex: 2, flexDirection: 'column', borderBottomColor: 'transparent', justifyContent: 'space-around' }}>
                    <Button bordered rounded style={{
                        justifyContent: 'center',
                        borderColor: 'rgb(186, 40, 0)',
                    }} onPress={() => this.setState({ usernameModalIsVisible: true })}>
                        <Text style={{ color: 'rgb(186, 40, 0)' }}>Change Username</Text>
                    </Button>
                    <ChangeUsernameModal oldusername={this.props.rootStore.UserStore.user.username} userID={this.state.user.userID} usernameModalVisible={this.state.usernameModalIsVisible} changeUsername={this.changeUsername} hideUsernameModal={() => this.setState({ usernameModalIsVisible: false })} />

                    <Button bordered rounded style={{
                        justifyContent: 'center',
                        borderColor: 'rgb(186, 40, 0)',
                    }} onPress={() => this.setState({ passModalIsVisible: true })}>
                        <Text style={{ color: 'rgb(186, 40, 0)' }}>Change Password</Text>
                    </Button>
                    <ChangePasswordModal realOldPass={this.props.rootStore.UserStore.user.password} userID={this.state.user.userID} passModalVisible={this.state.passModalIsVisible} changePass={this.changePass} hidePassModal={() => this.setState({ passModalIsVisible: false })} />
                </Item>
            </Container>

        );
    }

}

export default inject("rootStore")(observer(ProfilePage))