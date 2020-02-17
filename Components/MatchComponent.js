import React from 'react';
import { Card, CardItem, Left, Body, Button, Right, Text, Thumbnail, Icon, Content, Toast, Item, View } from 'native-base';
import { Alert } from 'react-native'
import { inject, observer } from 'mobx-react';
import MatchModal from '../Modals/MatchModal';
import { Dialog } from 'react-native-simple-dialogs';
import { TextInput } from 'react-native-gesture-handler';

class MatchComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            userIsInMatch: false,
            userIsAccepted: false,
            userIsInvited: false,
            modalVisible: false,
            btn: (<Button rounded style={{ backgroundColor: 'rgb(186, 40, 0)' }}>
                <Text style={{ color: 'black' }}>Loading...</Text>
            </Button>),
            keyEntered: null,
            dialogVisible: false
        }
    }

    componentDidMount() {
        this.Btn()
        if(this.props.rootStore.MatchStore.lastMatchModal === this.props.MatchDetails.Match_ID) {
            this.props.rootStore.MatchStore.insertLastModal(undefined)
            this.setState({ modalVisible: true })
        }
    }

    hideModal = async() => {
        this.setState({
            modalVisible: false
        })
    }

    setModalVisible = () => {
        this.setState({
            modalVisible: true
        })
    }

    changeKeyText = val => {
        this.setState({ keyEntered: val });
    }

    Btn = () => {
        let userIsInMatch = this.props.rootStore.MatchStore.UsersInMatches !== undefined &&
            this.props.rootStore.MatchStore.UsersInMatches.length !== 0 ?
            this.props.rootStore.MatchStore.UsersInMatches.filter(user => user.User_ID === this.props.rootStore.UserStore.user.userID && user.Match_ID === this.props.MatchDetails.Match_ID)[0] === undefined ? false : true : false
        let userIsInvited = this.props.rootStore.MatchStore.UsersInvitedToMatches !== undefined &&
            this.props.rootStore.MatchStore.UsersInvitedToMatches.length !== 0 ? this.props.rootStore.MatchStore.UsersInvitedToMatches.filter(user => user.User_ID === this.props.rootStore.UserStore.user.userID && user.Match_ID === this.props.MatchDetails.Match_ID)[0] === undefined ? false : true : false
        let userIsAccepted = userIsInMatch ? this.props.rootStore.MatchStore.UsersInMatches !== undefined &&
            this.props.rootStore.MatchStore.UsersInMatches.length !== 0 ?
            (this.props.rootStore.MatchStore.UsersInMatches.filter(user => user.User_ID === this.props.rootStore.UserStore.user.userID && user.Match_ID === this.props.MatchDetails.Match_ID && user.Accepted)[0] !== undefined ? true : false) : false
            : this.props.rootStore.MatchStore.UsersInvitedToMatches !== undefined &&
                this.props.rootStore.MatchStore.UsersInvitedToMatches.length !== 0 ?
                (this.props.rootStore.MatchStore.UsersInvitedToMatches.filter(user => user.User_ID === this.props.rootStore.UserStore.user.userID && user.Match_ID === this.props.MatchDetails.Match_ID && user.Accepted)[0] !== undefined ? true : false) : false

        console.log(userIsInMatch + "---" + userIsInvited + "---" + userIsAccepted)
        this.setState({
            userIsInMatch: userIsInMatch,
            userIsInvited: userIsInvited,
            userIsAccepted: userIsAccepted

        }, () => {
            if (!this.state.userIsInMatch && !this.state.userIsInvited && !this.state.userIsAccepted) {
                this.setState({
                    btn: (
                        <Button bordered rounded style={{ borderColor: 'rgb(186, 40, 0)', justifyContent: 'center' }} onPress={(!this.props.MatchDetails.IsPrivate && this.requestToJoin) || (() => this.setState({ dialogVisible: true }))}>
                            <Text style={{ color: 'rgb(186, 40, 0)' }}>JOIN</Text>
                        </Button>
                    )
                })
            }
            else if (this.state.userIsInMatch && !this.state.userIsInvited) {
                if (this.state.userIsAccepted) {
                    if (this.props.rootStore.UserStore.user.userID !== this.props.MatchDetails.Admin_ID) {
                        this.setState({
                            btn: (
                                <Button bordered rounded onPress={this.exitMatch} style={{ borderColor: 'rgb(186, 40, 0)', justifyContent: 'center' }}>
                                    <Text style={{ color: 'rgb(186, 40, 0)' }}>EXIT MATCH</Text>
                                </Button>
                            )
                        })
                    }
                    else {
                        this.setState({
                            btn: (
                                <Item style={{ borderBottomColor: 'transparent', flexDirection: 'row', justifyContent: 'space-around' }}>
                                    <Button onPress={this.cancelMatch} bordered rounded style={{ borderColor: 'rgb(186, 40, 0)', justifyContent: 'center' }}><Text style={{ color: 'rgb(186, 40, 0)' }}>CANCEL MATCH</Text></Button>
                                    <Button onPress={this.exitMatch} bordered rounded style={{ borderColor: 'rgb(186, 40, 0)', justifyContent: 'center' }}><Text style={{ color: 'rgb(186, 40, 0)' }}>EXIT MATCH</Text></Button>
                                </Item>
                            )
                        })
                    }

                }
                else {
                    this.setState({
                        btn: (
                            <Button bordered rounded style={{ borderColor: 'rgb(186, 40, 0)', justifyContent: 'center' }} onPress={this.cancelRequest}><Text style={{ color: 'rgb(186, 40, 0)' }}>CANCEL REQUEST</Text></Button>
                        )
                    })
                }
            }
            else if (!this.state.userIsInMatch && this.state.userIsInvited) {
                if (this.state.userIsAccepted) {
                    if (this.props.rootStore.UserStore.user.userID !== this.props.MatchDetails.Admin_ID) {
                        this.setState({
                            btn: (
                                <Button onPress={this.exitMatch} bordered rounded style={{ borderColor: 'rgb(186, 40, 0)', justifyContent: 'center' }}>
                                    <Text style={{ color: 'rgb(186, 40, 0)' }}>EXIT MATCH</Text>
                                </Button>
                            )
                        })
                    } else {
                        this.setState({
                            btn: (
                                <Item style={{ borderBottomColor: 'transparent', flexDirection: 'row', justifyContent: 'space-around' }}>
                                    <Button onPress={this.cancelMatch} bordered rounded style={{ borderColor: 'rgb(186, 40, 0)', justifyContent: 'center' }}><Text style={{ color: 'rgb(186, 40, 0)' }}>CANCEL MATCH</Text></Button>
                                    <Button onPress={this.exitMatch} bordered rounded style={{ borderColor: 'rgb(186, 40, 0)', justifyContent: 'center' }}><Text style={{ color: 'rgb(186, 40, 0)' }}>EXIT MATCH</Text></Button>
                                </Item>
                            )
                        })
                    }
                }
                else {
                    this.setState({
                        btn: (
                            <Item style={{ borderBottomColor: 'transparent', flexDirection: 'row', justifyContent: 'space-around' }}>
                                <Button bordered rounded style={{ borderColor: 'rgb(186, 40, 0)', justifyContent: 'center' }} onPress={this.cancelInvite}><Text style={{ color: 'rgb(186, 40, 0)' }}>CANCEL INVITE</Text></Button>
                                <Button bordered rounded style={{ borderColor: 'rgb(186, 40, 0)', justifyContent: 'center' }} onPress={this.acceptInvite}><Text style={{ color: 'rgb(186, 40, 0)' }}>ACCEPT INVITE</Text></Button>
                            </Item>
                        )
                    })
                }
            }
            else {
                this.setState({
                    btn: (
                        <Button bordered rounded style={{ borderColor: 'rgb(186, 40, 0)', justifyContent: 'center' }}>
                            <Text style={{ color: 'rgb(186, 40, 0)' }}>Loading...</Text>
                        </Button>
                    )
                })
            }
        })

    }

    exitMatch = async () => {
        let details = {
            MatchID: this.props.MatchDetails.Match_ID,
            MatchDate: this.props.MatchDate.getMonth() + 1
                + '-' + this.props.MatchDate.getDate() + '-' +
                this.props.MatchDate.getFullYear(),
            AdminID: this.props.MatchDetails.Admin_ID,
            UserID: this.props.rootStore.UserStore.user.userID,
            PlayersJoined: this.props.MatchDetails.Players_Joined
        }
        console.log('detailsssssssssssssssssssssssssssssssssss' + details.MatchDate)
        await fetch(`http://ruppinmobile.tempdomain.co.il/site09/api/Matches/ExitMatch`, {
            method: 'PUT',
            body: JSON.stringify(details),
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            }
        })
            .then(res => {
                //console.log("res=", res);

                return res.json()
            })
            .then(
                async result => {
                    console.log("fetch GET= ", result);
                    if (result === "Done!") {
                        await this.props.refreshMatches()
                        Toast.show({ text: 'You have exited the match', buttonText: 'Okay', type: 'success' })
                    }
                    else {
                        Toast.show({ text: result, buttonText: 'Okay', type: 'danger' })
                    }
                },
                error => {
                    console.log("=> err post=", error);
                    Toast.show({ text: error, buttonText: 'Okay', type: "danger" })
                }
            )
    }

    cancelMatch = async () => {
        let details = {
            MatchID: this.props.MatchDetails.Match_ID,
            MatchDate: this.props.MatchDate.getMonth() + 1
                + '-' + this.props.MatchDate.getDate() + '-' +
                this.props.MatchDate.getFullYear(),
        }
        await fetch(`http://ruppinmobile.tempdomain.co.il/site09/api/Matches/CancelMatch`, {
            method: 'DELETE',
            body: JSON.stringify(details),
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            }
        })
            .then(res => {
                //console.log("res=", res);

                return res.json()
            })
            .then(
                async result => {
                    console.log("fetch GET= ", result);
                    if (result === "Done!") {
                        await this.props.refreshMatches()
                        Toast.show({ text: 'You have canceled the match', buttonText: 'Okay', type: 'success' })
                    }
                    else {
                        Toast.show({ text: result, buttonText: 'Okay', type: 'danger' })
                    }
                },
                error => {
                    console.log("=> err post=", error);
                    Toast.show({ text: error, buttonText: 'Okay', type: "danger" })
                }
            )
    }

    cancelInvite = async () => {
        let details = {
            MatchID: this.props.MatchDetails.Match_ID,
            UserID: this.props.rootStore.UserStore.user.userID,
        }
        await fetch(`http://ruppinmobile.tempdomain.co.il/site09/api/Matches/CancelInvite`, {
            method: 'DELETE',
            body: JSON.stringify(details),
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            }
        })
            .then(res => {
                //console.log("res=", res);

                return res.json()
            })
            .then(
                async result => {
                    console.log("fetch GET= ", result);
                    if (result === "Done!") {
                        await this.props.refreshMatches()
                        Toast.show({ text: 'You have canceled the invitation', buttonText: 'Okay', type: 'success' })
                    }
                    else {
                        Toast.show({ text: result, buttonText: 'Okay', type: 'danger' })
                    }
                },
                error => {
                    console.log("=> err post=", error);
                    Toast.show({ text: error, buttonText: 'Okay', type: "danger" })
                }
            )
    }

    cancelRequest = async () => {
        let details = {
            MatchID: this.props.MatchDetails.Match_ID,
            UserID: this.props.rootStore.UserStore.user.userID,
        }
        await fetch(`http://ruppinmobile.tempdomain.co.il/site09/api/Matches/CancelRequest`, {
            method: 'DELETE',
            body: JSON.stringify(details),
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            }
        })
            .then(res => {
                //console.log("res=", res);

                return res.json()
            })
            .then(
                async result => {
                    console.log("fetch GET= ", result);
                    if (result === "Done!") {
                        await this.props.refreshMatches()
                        Toast.show({ text: 'You have canceled your request', buttonText: 'Okay', type: 'success' })
                    }
                    else {
                        Toast.show({ text: result, buttonText: 'Okay', type: 'danger' })
                    }
                },
                error => {
                    console.log("=> err post=", error);
                    Toast.show({ text: error, buttonText: 'Okay', type: "danger" })
                }
            )
    }

    acceptInvite = async () => {
        let details = {
            matchID: this.props.MatchDetails.Match_ID,
            userID: this.props.rootStore.UserStore.user.userID,
            matchDate: this.props.MatchDate.getMonth() + 1
                + '-' + this.props.MatchDate.getDate() + '-' +
                this.props.MatchDate.getFullYear(),
            matchTime: this.props.MatchDetails.Match_Time.slice(0, 5),
            playTime: this.props.MatchDetails.Play_Time,
            cityID: this.props.MatchDetails.City_ID,
            fieldID: this.props.MatchDetails.Field_ID,
            maxPlayer: this.props.MatchDetails.Max_Players,
            IsInvite: true
        }
        await fetch(`http://ruppinmobile.tempdomain.co.il/site09/api/Matches/acceptRequestJoinMatch`, {
            method: 'PUT',
            body: JSON.stringify(details),
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            }
        })
            .then(res => {
                //console.log("res=", res);

                return res.json()
            })
            .then(
                async result => {
                    console.log("fetch GET= ", result);
                    if (result === "Done!") {
                        await this.props.refreshMatches()
                        Toast.show({ text: 'You have accepted to join the match', buttonText: 'Okay', type: 'success' })
                    }
                    else {
                        Toast.show({ text: result, buttonText: 'Okay', type: 'danger' })
                    }
                },
                error => {
                    console.log("=> err post=", error);
                    Toast.show({ text: error, buttonText: 'Okay', type: "danger" })
                }
            )
    }

    requestToJoin = async () => {
        console.log("key entered =" + this.props.MatchDetails.Match_Key)
        if (this.state.keyEntered === this.props.MatchDetails.Match_Key) {
            let details = {
                matchID: this.props.MatchDetails.Match_ID,
                userID: this.props.rootStore.UserStore.user.userID,
                matchDate: this.props.MatchDate.getMonth() + 1
                    + '-' + this.props.MatchDate.getDate() + '-' +
                    this.props.MatchDate.getFullYear(),
                matchTime: this.props.MatchDetails.Match_Time.slice(0, 5),
                playTime: this.props.MatchDetails.Play_Time,
                cityID: this.props.MatchDetails.City_ID,
                fieldID: this.props.MatchDetails.Field_ID,
                maxPlayer: this.props.MatchDetails.Max_Players,
            }
            await fetch(`http://ruppinmobile.tempdomain.co.il/site09/api/Matches/RequestJoinMatch`, {
                method: 'POST',
                body: JSON.stringify(details),
                headers: {
                    "Content-Type": "application/json;charset=utf-8"
                }
            })
                .then(res => {
                    //console.log("res=", res);

                    return res.json()
                })
                .then(
                    async result => {
                        console.log("fetch GET= ", result);
                        if (result === "You have requested to join the match") {
                            await this.props.refreshMatches()
                            Toast.show({ text: 'You have requested to join the match', buttonText: 'Okay', type: 'success' })
                        }
                        else {
                            Toast.show({ text: result, buttonText: 'Okay', type: 'danger' })
                        }
                    },
                    error => {
                        console.log("=> err post=", error);
                        Toast.show({ text: error, buttonText: 'Okay', type: "danger" })
                    }
                )
        }
    }

    render() {


        return (
            <Card style={{ borderColor: 'rgb(186, 40, 0)', borderWidth: 0.5, backgroundColor: 'transparent' }}>
                <CardItem header bordered style={{ backgroundColor: 'rgb(48,48,48)', borderBottomColor: 'rgb(186, 40, 0)' }}>
                    <Left>
                        <Thumbnail source={this.props.MatchDetails.Match_Picture === null ? require('../assets/Sports-Vision.png') : { uri: `http://ruppinmobile.tempdomain.co.il/site09/uploadFiles/${this.props.MatchDetails.Match_Picture}` }} />
                        <Body>
                            <Text style={{ fontWeight: 'bold', color: 'rgb(204,204,204)' }}>{this.props.MatchDetails.Match_Name}</Text>
                            <Text note>{this.props.adminName}</Text>
                        </Body>
                    </Left>
                    <Right>
                        {this.props.MatchDetails.IsPrivate && <Icon active name='md-lock' style={{ color: "rgb(186, 40, 0)" }} />}
                    </Right>
                </CardItem >
                <CardItem bordered style={{ backgroundColor: 'rgb(48,48,48)', flex: 1, flexDirection: 'row', justifyContent: 'space-around', borderBottomColor: 'rgb(186, 40, 0)' }}>
                    <Body style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Icon active name="md-time" style={{ color: "rgb(186, 40, 0)" }} />
                        <Text style={{ color: 'rgb(204,204,204)' }}>{this.props.MatchDate.toISOString().slice(0, 10) + ' - ' + this.props.MatchDetails.Match_Time.slice(0, 5)}</Text>
                    </Body>
                </CardItem>
                <CardItem bordered style={{ backgroundColor: 'rgb(48,48,48)', borderBottomColor: 'rgb(186, 40, 0)' }}>
                    <Body style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Icon active name="md-home" style={{ color: "rgb(186, 40, 0)" }} />
                        <Text style={{ color: 'rgb(204,204,204)' }}>{this.props.rootStore.CitiesAndFieldsStore.Cities.filter(city => city.City_ID === this.props.MatchDetails.City_ID)[0].City_Name}</Text>
                    </Body>
                </CardItem>
                <CardItem bordered style={{ backgroundColor: 'rgb(48,48,48)', borderBottomColor: 'rgb(186, 40, 0)' }}>
                    <Body style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Icon active name="md-pin" style={{ color: "rgb(186, 40, 0)" }} />
                        <Text style={{ color: 'rgb(204,204,204)' }}>{this.props.rootStore.CitiesAndFieldsStore.Fields.filter(field => field.Field_ID === this.props.MatchDetails.Field_ID)[0].Field_Name}</Text>
                    </Body>
                </CardItem>
                <CardItem style={{ backgroundColor: 'rgb(48,48,48)', borderBottomColor: 'rgb(186, 40, 0)' }}>
                    <Left>
                        <Icon active name="person" style={{ color: "rgb(186, 40, 0)" }} />
                        <Text style={{ color: 'rgb(204,204,204)' }}>{this.props.MatchDetails.Players_Joined + '/' + this.props.MatchDetails.Max_Players}</Text>
                    </Left>
                    <Right>
                        <Icon active name="md-timer" style={{ color: "rgb(186, 40, 0)" }} />
                        <Text style={{ color: 'rgb(204,204,204)' }}>{this.props.MatchDetails.Play_Time + 'h'}</Text>
                    </Right>
                </CardItem>
                <CardItem style={{ backgroundColor: 'rgb(48,48,48)', borderBottomColor: 'rgb(186, 40, 0)' }}>
                    <Body style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                        {this.state.btn}
                        <Button bordered rounded style={{ borderColor: 'rgb(186, 40, 0)', justifyContent: 'center' }} onPress={this.setModalVisible}>
                            <Text style={{ color: 'rgb(186, 40, 0)' }}>Details</Text>
                        </Button>
                        <MatchModal modalVisible={this.state.modalVisible} hideModal={this.hideModal} MatchDetails={this.props.MatchDetails} Match_Date={this.props.MatchDate} btn={this.state.btn} refreshMatches={this.props.refreshMatches} />
                        <Dialog
                            titleStyle={{ color: 'rgb(186, 40, 0)' }}
                            dialogStyle={{ backgroundColor: 'rgb(48,48,48)' }}
                            visible={this.state.dialogVisible}
                            title="Request join"
                            onTouchOutside={() => this.setState({ dialogVisible: false })}
                        >
                            <View>
                                <TextInput placeholder="Enter key" style={{ color: 'rgb(204,204,204)' }} onChangeText={val => this.changeKeyText(val)} />
                                <Button bordered rounded style={{ borderColor: 'rgb(186, 40, 0)', justifyContent: 'center' }} onPress={this.requestToJoin}><Text style={{ color: 'rgb(186, 40, 0)' }}>JOIN</Text></Button>
                            </View>
                        </Dialog>
                    </Body>
                </CardItem>
            </Card>
        )
    }
}

export default inject("rootStore")(observer(MatchComponent));