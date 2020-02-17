import React from 'react'
import { inject, observer } from 'mobx-react'
import { Content, Thumbnail, Form, Input, Item, Container, Label, Picker, CheckBox, Text, Button, Toast, Right, Left } from 'native-base'
import { KeyboardAvoidingView, TouchableOpacity, ScrollView, Image } from 'react-native'
import { Header } from 'react-navigation-stack'
import DateTimePicker from '@react-native-community/datetimepicker';

class CreateMatchPage extends React.Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        let now = new Date()

        this.state = {
            matchID: -1,
            matchTitle: undefined,
            matchTitleInvalid: false,
            citySelected: 1,
            citySelectedInvalid: false,
            fieldSelected: 1,
            fieldSelectedInvalid: false,
            datePicked: new Date(),
            datePickedInvalid: false,
            timePicked: new Date(), //`${(now.getHours() < 10 ? '0' + now.getHours() : now.getHours())}:${(now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes())}`,
            timePickedInvalid: false,
            playTime: 1,
            playTimeInvalid: false,
            keyCheckBox: false,
            key: null,
            maxPlayers: this.props.rootStore.MatchStore.createMatchWithGroup ?
                this.props.rootStore.GroupsStore.groupDetailsForMatchCreating.Max_Players : 4,
            cities: [],
            fields: [],
            isDateTimePickerVisible: false,
            isDateTimePickerVisibleForDate: false,
            numOfPlayers: []
        }
    }

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            title: 'CREATE MATCH',
            headerRight: <TouchableOpacity onPress={() => params.profilePage()}><Image source={params.faceORG == 1 ? { uri: params.imageurl } : { uri: `http://ruppinmobile.tempdomain.co.il/site09/uploadFiles/${params.imageurl}` }} style={{ paddingVertical: 5, width: 40, height: 40, borderRadius: 75 }} /></TouchableOpacity>
        };
    };

    async componentDidMount() {
        this._isMounted = true
        this.props.navigation.setParams({ profilePage: this.profilePage, imageurl: this.props.rootStore.UserStore.user.imageURL, faceORG: this.props.rootStore.UserStore.faceORGLogin })
        let cities = this.props.rootStore.CitiesAndFieldsStore.Cities;
        let fields = this.props.rootStore.CitiesAndFieldsStore.Fields;
        let numOfPlayers = []
        for (let i = this.props.rootStore.GroupsStore.groupDetailsForMatchCreating.Max_Players; i <= 10; i++) {
            numOfPlayers.push(<Picker.Item key={i} label={i.toString()} value={i} />)
        }
        console.log(this.props.rootStore.CitiesAndFieldsStore.Cities)
        if (this._isMounted) {
            this.setState({
                cities: cities.map(city => {
                    return <Picker.Item key={city.City_ID} label={city.City_Name} value={city.City_ID} />
                }),
                fields: fields.filter(f => this.state.citySelected === f.City_ID).map(field => {
                    return <Picker.Item key={field.Field_ID} label={field.Field_Name} value={field.Field_ID} />
                }),
                numOfPlayers: numOfPlayers
            })
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    profilePage = () => {
        this.props.navigation.navigate("ProfilePage")
    }

    matchTitleChange = val => {
        this.setState({
            matchTitle: val
        })
    }

    onCityChange = (val, pos) => {
        let fields = this.props.rootStore.CitiesAndFieldsStore.Fields;
        console.log(val)
        this.setState({
            citySelected: val,
            fields: fields.filter(f => val === f.City_ID).map(field => {
                return <Picker.Item key={field.Field_ID} label={field.Field_Name} value={field.Field_ID} />
            })
        })
    }

    onFieldChange = (val, pos) => {
        this.setState({
            fieldSelected: val
        }, console.log(val))
    }

    dateChange = (event, val) => {
        this.setState({
            datePicked: val,
            isDateTimePickerVisibleForDate: false
        }, () => console.log(this.state.datePicked.toString()))
    }

    timeChange = (event, val) => {
        if (val !== "" && val !== undefined) {
            let now = new Date()
            if ((val.getHours() < now.getHours() || (val.getHours() === now.getHours() && val.getMinutes() < now.getMinutes())) &&
                this.state.datePicked.getFullYear() === now.getFullYear() && this.state.datePicked.getMonth() === now.getMonth() &&
                this.state.datePicked.getDate() === now.getDate()) {
                this.setState({ isDateTimePickerVisible: false }, () =>
                    Toast.show({ text: 'the time you chose has passed', buttonText: 'Okay', type: "danger" })
                )

            }
            else {
                this.setState({
                    timePicked: val,
                    isDateTimePickerVisible: false//`${(val.getHours() < 10 ? '0' + val.getHours() : val.getHours())}:${(val.getMinutes() < 10 ? '0' + val.getMinutes() : val.getMinutes())}`
                }, () => {
                    console.log(this.state.timePicked)
                })
            }
        } else {
            this.setState({
                isDateTimePickerVisible: false
            })
        }
    }

    onChangeKeyCheckBox = () => {
        this.setState(prevState => ({
            keyCheckBox: !prevState.keyCheckBox
        }), console.log("keycheckbox = " + this.state.keyCheckBox))
    }

    onMaxPlayersChange = (val) => {
        this.setState({
            maxPlayers: val
        }, () => console.log(this.state.maxPlayers))
    }

    changeKey = val => {
        this.setState({
            key: val
        })
    }

    Submit = async () => {
        this.state.matchTitle === undefined ? this.setState({ matchTitleInvalid: true }, () => Toast.show({ text: 'Enter match title!', buttonText: 'Okay', type: "danger" })) : this.setState({ matchTitleInvalid: false })
        this.state.citySelected === undefined ? this.setState({ citySelectedInvalid: true }, () => Toast.show({ text: 'Select city!', buttonText: 'Okay', type: "danger" })) : this.setState({ citySelectedInvalid: false })
        this.state.fieldSelected === undefined ? this.setState({ fieldSelectedInvalid: true }, () => Toast.show({ text: 'Select field!', buttonText: 'Okay', type: "danger" })) : this.setState({ fieldSelectedInvalid: false })
        this.state.datePicked === undefined ? this.setState({ datePickedInvalid: true }, () => Toast.show({ text: 'Select date!', buttonText: 'Okay', type: "danger" })) : this.setState({ datePickedInvalid: false })
        this.state.timePicked === undefined ? this.setState({ timePickedInvalid: true }, () => Toast.show({ text: 'Enter match time!', buttonText: 'Okay', type: "danger" })) : this.setState({ timePickedInvalid: false })
        this.state.playTime === undefined ? this.setState({ playTimeInvalid: true }, () => Toast.show({ text: 'Enter match duration!', buttonText: 'Okay', type: "danger" })) : this.setState({ playTimeInvalid: false })

        console.log(this.state.playTime)
        if (!this.props.rootStore.MatchStore.createMatchWithGroup) {
            let match = {
                UserID: this.props.rootStore.UserStore.user.userID,
                MatchName: this.state.matchTitle,
                CityID: this.state.citySelected,
                FieldID: this.state.fieldSelected,
                MatchDate: this.state.datePicked.getMonth() + 1
                    + '-' + this.state.datePicked.getDate() + '-' +
                    this.state.datePicked.getFullYear(),
                MatchTime: this.state.timePicked.getHours() + ':' + this.state.timePicked.getMinutes(),
                IsPrivate: this.state.keyCheckBox,
                MatchKey: this.state.key,
                MaxPlayers: this.state.maxPlayers,
                PlayTime: this.state.playTime
            }

            console.log(JSON.stringify(match))

            this.state.matchTitle !== undefined && this.state.citySelected !== undefined && this.state.fieldSelected !== undefined
                && this.state.datePicked !== undefined && this.state.timePicked !== undefined && this.state.timePicked !== undefined ?
                await fetch(`http://ruppinmobile.tempdomain.co.il/site09/api/Matches/Matchs`, {
                    method: "POST",
                    body: JSON.stringify(match),
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
                                    matchID: result
                                }, async () => {
                                    if (this.props.rootStore.CameraStore.CreateMatchPhotoURI !== "" && this.state.matchID !== -1) {
                                        console.log(this.props.rootStore.CameraStore.CreateMatchPhotoURI)
                                        this.imageUpload(this.props.rootStore.CameraStore.CreateMatchPhotoURI, this.state.matchTitle + "_MatchPicture.jpg", this.state.matchID)
                                        this.props.rootStore.CameraStore.changeCreateMatchPhotoURI("")
                                    }
                                    await this.props.rootStore.MatchStore.getUsersInMatches()
                                    await this.props.rootStore.MatchStore.getActiveMatches()
                                    Toast.show({ text: result.message, buttonText: 'Okay', type: "success" })
                                    this.props.navigation.navigate("MatchesPage")
                                })

                        },
                        error => {
                            console.log("=> err post=", error);
                            Toast.show({ text: error, buttonText: 'Okay', type: "danger" })
                        }
                    ) : null
        } else {
            console.log("usersInGroup = " + JSON.stringify(this.props.rootStore.GroupsStore.usersInGroupForMatchCreating))
            let usersUnGroupIDs = this.props.rootStore.GroupsStore.usersInGroupForMatchCreating.map(user=>{return user.User_ID})
            let match = {
                UserID: this.props.rootStore.UserStore.user.userID,
                MatchName: this.state.matchTitle,
                CityID: this.state.citySelected,
                FieldID: this.state.fieldSelected,
                MatchDate: this.state.datePicked.getMonth() + 1
                    + '-' + this.state.datePicked.getDate() + '-' +
                    this.state.datePicked.getFullYear(),
                MatchTime: this.state.timePicked.getHours() + ':' + this.state.timePicked.getMinutes(),
                IsPrivate: this.state.keyCheckBox,
                MatchKey: this.state.key,
                MaxPlayers: this.state.maxPlayers,
                PlayTime: this.state.playTime,
                UsersInGroup: usersUnGroupIDs
            }

            console.log(JSON.stringify(match))

            this.state.matchTitle !== undefined && this.state.citySelected !== undefined && this.state.fieldSelected !== undefined
                && this.state.datePicked !== undefined && this.state.timePicked !== undefined && this.state.timePicked !== undefined ?
                await fetch(`http://ruppinmobile.tempdomain.co.il/site09/api/Matches/CreateMatchWithGroup`, {
                    method: "POST",
                    body: JSON.stringify(match),
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
                                    matchID: result
                                }, async () => {
                                    if (this.props.rootStore.CameraStore.CreateMatchPhotoURI !== "" && this.state.matchID !== -1) {
                                        console.log(this.props.rootStore.CameraStore.CreateMatchPhotoURI)
                                        this.imageUpload(this.props.rootStore.CameraStore.CreateMatchPhotoURI, this.state.matchTitle + "_MatchPicture.jpg", this.state.matchID)
                                        this.props.rootStore.CameraStore.changeCreateMatchPhotoURI("")
                                    }
                                    await this.props.rootStore.MatchStore.getUsersInMatches()
                                    await this.props.rootStore.MatchStore.getActiveMatches()
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
    }

    imageUpload = async (imgUri, picName, matchID) => {
        let urlAPI = "http://ruppinmobile.tempdomain.co.il/site09/api/Matches/uploadMatchpicture";
        let dataI = new FormData();
        dataI.append('picture', {
            uri: imgUri,
            name: picName,
            type: 'image/jpg',
        });
        dataI.append('matchID', matchID)
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
        this.props.rootStore.CameraStore.changeSignUpOrCreateMatch(1)
        this.props.navigation.navigate("CameraPage")
    }

    palyTimeChange = (val, pos) => {
        this.setState({
            playTime: val
        }, () => console.log(this.state.playTime))
    }

    render() {
        return (
            <KeyboardAvoidingView keyboardVerticalOffset={Header.HEIGHT} behavior="padding" style={{ flex: 1 }}>
                <Container style={{ backgroundColor: 'rgb(48,48,48)' }}>
                    <Content padder>
                        <ScrollView>

                            <Form style={{ flex: 1, justifyContent: 'space-evenly' }}>
                                <TouchableOpacity style={{ alignSelf: 'center' }} onPress={this.camerapage}>
                                    <Thumbnail large source={this.props.rootStore.CameraStore.CreateMatchPhotoURI === "" ? require('../assets/Sports-Vision.png') : { uri: this.props.rootStore.CameraStore.CreateMatchPhotoURI }} />
                                </TouchableOpacity>
                                <Text style={{ alignSelf: 'center', color: 'rgb(186, 40, 0)' }}>click on picture to change it</Text>
                                <Item error={this.state.matchTitleInvalid}>
                                    <Input placeholder="Match title" placeholderTextColor='rgb(186, 40, 0)' onChangeText={this.matchTitleChange} style={{ color: 'rgb(204,204,204)' }} />
                                </Item>
                                <Item error={this.state.citySelectedInvalid}>
                                    <Label style={{ color: 'rgb(186, 40, 0)' }}>City</Label>
                                    <Picker
                                        mode='dropdown'
                                        placeholder="Select city"
                                        selectedValue={this.state.citySelected}
                                        onValueChange={this.onCityChange}
                                        style={{ color: 'rgb(204,204,204)' }}
                                    >
                                        {this.state.cities}
                                    </Picker>
                                </Item>
                                <Item error={this.state.fieldSelectedInvalid}>
                                    <Label style={{ color: 'rgb(186, 40, 0)' }}>Field</Label>
                                    <Picker
                                        mode='dropdown'
                                        placeholder="Select city"
                                        selectedValue={this.state.fieldSelected}
                                        onValueChange={this.onFieldChange}
                                        style={{ color: 'rgb(204,204,204)' }}
                                    >
                                        {this.state.fields}
                                    </Picker>
                                </Item>
                                <Item error={this.state.datePickedInvalid} style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Label style={{ color: 'rgb(186, 40, 0)' }}>Match date</Label>
                                    <Button bordered small style={{ justifyContent: 'center', borderColor: 'rgb(186, 40, 0)' }} onPress={() => this.setState({ isDateTimePickerVisibleForDate: true })}>
                                        <Text style={{ color: 'rgb(186, 40, 0))' }}>CHOOSE DATE</Text>
                                    </Button>
                                    {this.state.isDateTimePickerVisibleForDate && <DateTimePicker
                                        minimumDate={new Date(Date())}
                                        onChange={this.dateChange}
                                        value={this.state.datePicked}
                                    />}
                                    <Text style={{ color: 'rgb(204,204,204)' }}>{this.state.datePicked.getDate() + '-' + (this.state.datePicked.getMonth() + 1) + '-' + this.state.datePicked.getFullYear()}</Text>
                                </Item>
                                <Item error={this.state.timePickedInvalid} style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Label style={{ color: 'rgb(186, 40, 0)' }}>Match time</Label>
                                    <Button bordered small style={{ justifyContent: 'center', borderColor: 'rgb(186, 40, 0)' }} onPress={() => this.setState({ isDateTimePickerVisible: true })}>
                                        <Text style={{ color: 'rgb(186, 40, 0))' }}>CHOOSE TIME</Text>
                                    </Button>
                                    {this.state.isDateTimePickerVisible && <DateTimePicker value={this.state.timePicked} is24Hour={true} mode='time' onChange={this.timeChange} />}
                                    <Text style={{ color: 'rgb(204,204,204)' }}>{((this.state.timePicked.getHours() < 10 && '0' + this.state.timePicked.getHours()) || (this.state.timePicked.getHours()))
                                        + ':' + ((this.state.timePicked.getMinutes() < 10 && '0' + this.state.timePicked.getMinutes()) || (this.state.timePicked.getMinutes()))}</Text>
                                </Item>
                                <Item error={this.state.playTimeInvalid}>
                                    <Label style={{ color: 'rgb(186, 40, 0)' }}>Duration</Label>
                                    <Picker
                                        mode='dropdown'
                                        placeholder="Duration"
                                        selectedValue={this.state.playTime}
                                        onValueChange={this.palyTimeChange}
                                        style={{ color: 'rgb(204,204,204)' }}
                                    >
                                        <Picker.Item label="1" value={1} />
                                        <Picker.Item label="2" value={2} />
                                        <Picker.Item label="3" value={3} />
                                        <Picker.Item label="4" value={4} />
                                        <Picker.Item label="5" value={5} />
                                    </Picker>
                                </Item>
                                <Item style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Label style={{ color: 'rgb(186, 40, 0)' }}>Private ?</Label>
                                    <CheckBox checked={this.state.keyCheckBox} onPress={this.onChangeKeyCheckBox} />
                                    <Right>
                                        {this.state.keyCheckBox &&
                                            <Input
                                                disabled={!this.state.keyCheckBox}
                                                placeholder="Enter Key here"
                                                placeholderTextColor='rgb(186, 40, 0)'
                                                onChangeText={this.changeKey}
                                                style={{ color: 'rgb(204,204,204)' }}
                                            />}
                                    </Right>
                                </Item>
                                <Item style={{ borderBottomColor: 'transparent' }}>
                                    <Label style={{ color: 'rgb(186, 40, 0)' }}>Max players</Label>
                                    {!this.props.rootStore.MatchStore.createMatchWithGroup ? <Picker mode="dropdown"
                                        placeholder="Maximum Players"
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
                                    </Picker> :
                                        <Picker mode="dropdown"
                                            placeholder="Maximum Players"
                                            selectedValue={this.state.maxPlayers}
                                            onValueChange={this.onMaxPlayersChange}
                                            style={{ color: 'rgb(204,204,204)' }}
                                        >
                                            {this.state.numOfPlayers}
                                        </Picker>}
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