import React from 'react'
import { inject, observer } from 'mobx-react'
import { Content, Thumbnail, Form, Input, Item, Container, Label, Picker, CheckBox, Text, Button, Toast, Right, Left } from 'native-base'
import { KeyboardAvoidingView, TouchableOpacity, ScrollView, Image } from 'react-native'
import { Header } from 'react-navigation-stack'

class CreateMatchPage extends React.Component {
    _isMounted = false;
    constructor(props) {
        super(props);

        this.state = {
            groupID: -1,
            groupTitle: undefined,
            groupTitleInvalid: false,
            maxPlayers: 4,
        }
    }

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            title: 'CREATE GROUP',
            headerRight: <TouchableOpacity onPress={() => params.profilePage()}><Image source={params.faceORG == 1 ? { uri: params.imageurl } : { uri: `http://ruppinmobile.tempdomain.co.il/site09/uploadFiles/${params.imageurl}` }} style={{ paddingVertical: 5, width: 40, height: 40, borderRadius: 75 }} /></TouchableOpacity>
        };
    };

    componentDidMount() {
        this._isMounted = true
        this.props.navigation.setParams({ profilePage: this.profilePage, imageurl: this.props.rootStore.UserStore.user.imageURL, faceORG: this.props.rootStore.UserStore.faceORGLogin })
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    profilePage = () => {
        this.props.navigation.navigate("ProfilePage")
    }

    groupTitleChange = val => {
        this.setState({
            groupTitle: val
        })
    }

    onMaxPlayersChange = (val) => {
        this.setState({
            maxPlayers: val
        }, () => console.log(this.state.maxPlayers))
    }

    Submit = async () => {
        this.state.groupTitle === undefined ? this.setState({ groupTitleInvalid: true }, () => Toast.show({ text: 'Enter group title!', buttonText: 'Okay', type: "danger" })) : this.setState({ groupTitleInvalid: false })

        let group = {
            Admin_ID: this.props.rootStore.UserStore.user.userID,
            Group_Name: this.state.groupTitle,
            Max_Players: this.state.maxPlayers,
        }

        console.log(JSON.stringify(group))

        this.state.groupTitle !== undefined ?
            await fetch(`http://ruppinmobile.tempdomain.co.il/site09/api/Groups/Group`, {
                method: "POST",
                body: JSON.stringify(group),
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(res => {
                    //console.log("res=", res);
                    return res.json();
                })
                .then(
                    async result => {
                        console.log("fetch GET= ", result);
                        (typeof result === 'string') ? Toast.show({ text: result, buttonText: 'Okay', type: "danger" }) :
                            this.setState({
                                groupID: result
                            },async()=>{
                                if (this.props.rootStore.CameraStore.CreateGroupPhotoURI !== "" && this.state.groupID !== -1) {
                                    console.log(this.props.rootStore.CameraStore.CreateMatchPhotoURI)
                                    this.imageUpload(this.props.rootStore.CameraStore.CreateGroupPhotoURI, this.state.groupTitle + "_GroupPicture.jpg", this.state.groupID)
                                    this.props.rootStore.CameraStore.changeCreateGroupPhotoURI("")
                                }
                                await this.props.rootStore.GroupsStore.getUsersInGroups()
                                await this.props.rootStore.GroupsStore.getGroups()
                                Toast.show({ text: result.message, buttonText: 'Okay', type: "success" })
                                this.props.navigation.navigate("GroupsPage")
                            })

                    },
                    error => {
                        console.log("=> err post=", error);
                        Toast.show({ text: error, buttonText: 'Okay', type: "danger" })
                    }
                ) : null

    }

    imageUpload = async (imgUri, picName, groupID) => {
        let urlAPI = "http://ruppinmobile.tempdomain.co.il/site09/api/Groups/uploadGrouppicture";
        let dataI = new FormData();
        dataI.append('picture', {
            uri: imgUri,
            name: picName,
            type: 'image/jpg',
        });
        dataI.append('groupID', groupID)
        //console.log(dataI)
        const config = {
            method: 'POST',
            body: dataI,
        };

        //console.log(config.body)

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
        this.props.rootStore.CameraStore.changeSignUpOrCreateMatch(3)
        this.props.navigation.navigate("CameraPage")
    }

    render() {
        return (
            <KeyboardAvoidingView keyboardVerticalOffset={Header.HEIGHT} behavior="padding" style={{ flex: 1 }}>
                <Container style={{ backgroundColor: 'rgb(48,48,48)' }}>
                    <Content padder>
                        <ScrollView>

                            <Form style={{ flex: 1, justifyContent: 'space-evenly' }}>
                                <TouchableOpacity style={{ alignSelf: 'center' }} onPress={this.camerapage}>
                                    <Thumbnail large source={this.props.rootStore.CameraStore.CreateGroupPhotoURI === "" ? require('../assets/Sports-Vision.png') : { uri: this.props.rootStore.CameraStore.CreateGroupPhotoURI }} />
                                </TouchableOpacity>
                                <Text style={{ alignSelf: 'center', color: 'rgb(186, 40, 0)' }}>click on picture to change it</Text>
                                <Item error={this.state.groupTitleInvalid}>
                                    <Input placeholder="Group title" placeholderTextColor='rgb(186, 40, 0)' onChangeText={this.groupTitleChange} style={{ color: 'rgb(204,204,204)' }} />
                                </Item>
                                <Item style={{ borderBottomColor: 'transparent' }}>
                                    <Label style={{ color: 'rgb(186, 40, 0)' }}>Max players</Label>
                                    <Picker mode="dropdown"
                                        placeholder="Max Players"
                                        selectedValue={this.state.maxPlayers}
                                        onValueChange={this.onMaxPlayersChange}
                                        style={{ color: 'rgb(204,204,204)' }}
                                    >
                                        <Picker.Item label="4" value={4} />
                                        <Picker.Item label="5" value={5} />
                                        <Picker.Item label="6" value={6} />
                                        <Picker.Item label="7" value={7} />
                                        <Picker.Item label="8" value={8} />
                                        <Picker.Item label="9" value={9} />
                                        <Picker.Item label="10" value={10} />
                                    </Picker>
                                </Item>
                                <Button style={{ justifyContent: 'center', backgroundColor: 'rgb(186, 40, 0)' }} onPress={this.Submit}>
                                    <Text style={{ color: 'rgb(48,48,48)' }}>SUBMIT</Text>
                                </Button>
                            </Form>
                        </ScrollView>
                    </Content>

                </Container >
            </KeyboardAvoidingView>

        );
    }
}

export default inject('rootStore')(observer(CreateMatchPage));