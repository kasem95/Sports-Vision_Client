import React from 'react';
import { Dimensions, Platform, Image } from 'react-native'
import { Text, Content, Button, Container, Item, Label, Title, Thumbnail, Right } from 'native-base'
import { observer, inject } from 'mobx-react';
import Modal from "react-native-modal";
import UsersInMatchComponent from '../Components/UserInMatchComponent';
import FriendsInviteModal from '../Modals/FriendsInviteModal'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
/*const height = Platform.OS === "ios"
? Dimensions.get("window").height
: ExtraDimensions.getRealWindowHeight();*/

class MatchModal extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            usersRequestToJoin: [],
            usersInvitedToMatchNotAccepted: [],
            UsersInMatch: [],
            UsersInvitedToMatch: [],
            btn: this.props.btn,
            friendsInviteModalVisible: false
        }
    }

    async componentDidMount() {
        await this.updateState()
        //this.Btn()
        await this.setState({ btn: this.props.btn })
        if(this.props.rootStore.MatchStore.lastFriendsInviteModal === this.props.MatchDetails.Match_ID)
        {
            this.props.rootStore.MatchStore.saveLastFriendsInviteModal(undefined)
            this.setState({friendsInviteModalVisible: true});
        }

    }

    clearUsers = () => {
        this.setState({
            usersRequestToJoin: [],
            usersInvitedToMatchNotAccepted: [],
            UsersInMatch: [],
            UsersInvitedToMatch: [],
        }, () => this.updateState())
    }

    updateState = async () => {
        await this.props.rootStore.MatchStore.getUsersInMatches()
        await this.props.rootStore.MatchStore.getUsersInvitedToMatches()
        if (this.props.MatchDetails.Admin_ID === this.props.rootStore.UserStore.user.userID) {
            this.setState({
                UsersInMatch: this.props.rootStore.MatchStore.UsersInMatches !== undefined &&
                    this.props.rootStore.MatchStore.UsersInMatches.length !== 0 ? this.props.rootStore.MatchStore.UsersInMatches.map(user => {
                        if (user.Accepted && this.props.MatchDetails.Match_ID === user.Match_ID) {
                            let userDetails = this.props.rootStore.UserStore.users.filter(u => u.User_ID === user.User_ID)[0]
                            let picture = userDetails.ProfilePIC === null || userDetails.ProfilePIC === undefined ? ""
                                : (userDetails.ProfilePIC.slice(0, 8) !== "https://" ?
                                    `http://ruppinmobile.tempdomain.co.il/site09/uploadFiles/${userDetails.ProfilePIC}`
                                    : userDetails.ProfilePIC)

                            console.log("kkkkkkkkkkkkkkkkkkk  " + userDetails.User_ID)
                            return (
                                <UsersInMatchComponent key={user.UserInMatch_ID} MatchDetails={this.props.MatchDetails} userDetails={userDetails} MatchAdmin={this.props.MatchDetails.Admin_ID} userPIC={picture} userInMatch={0} refreshUsers={this.props.refreshMatches} />
                            )
                        }
                    }) : [],
                UsersInvitedToMatch: this.props.rootStore.MatchStore.UsersInvitedToMatches !== undefined &&
                    this.props.rootStore.MatchStore.UsersInvitedToMatches.length !== 0 ? this.props.rootStore.MatchStore.UsersInvitedToMatches.map(user => {
                        if (user.Accepted && this.props.MatchDetails.Match_ID === user.Match_ID) {
                            let userDetails = this.props.rootStore.UserStore.users.filter(u => u.User_ID === user.User_ID)[0]
                            let picture = userDetails.ProfilePIC === null || userDetails.ProfilePIC === undefined ? ""
                                : (userDetails.ProfilePIC.slice(0, 8) !== "https://" ?
                                    `http://ruppinmobile.tempdomain.co.il/site09/uploadFiles/${userDetails.ProfilePIC}`
                                    : userDetails.ProfilePIC)

                            console.log("kkkkkkkkkkkkkkkkkkk  " + userDetails.User_ID)
                            return (
                                <UsersInMatchComponent key={user.UserInvitedToMatch_ID} MatchDetails={this.props.MatchDetails} userDetails={userDetails} MatchAdmin={this.props.MatchDetails.Admin_ID} userPIC={picture} userInMatch={1} refreshUsers={this.props.refreshMatches} />
                            )
                        }
                    }) : [],
                usersRequestToJoin: this.props.rootStore.MatchStore.UsersInMatches !== undefined &&
                    this.props.rootStore.MatchStore.UsersInMatches.length !== 0 ? this.props.rootStore.MatchStore.UsersInMatches.map(user => {
                        if (!user.Accepted && this.props.MatchDetails.Match_ID === user.Match_ID) {
                            let userDetails = this.props.rootStore.UserStore.users.filter(u => u.User_ID === user.User_ID)[0]
                            let picture = userDetails.ProfilePIC === null || userDetails.ProfilePIC === undefined ? ""
                                : (userDetails.ProfilePIC.slice(0, 8) !== "https://" ?
                                    `http://ruppinmobile.tempdomain.co.il/site09/uploadFiles/${userDetails.ProfilePIC}`
                                    : userDetails.ProfilePIC)

                            console.log("kkkkkkkkkkkkkkkkkkk  " + userDetails.User_ID)
                            return (
                                <UsersInMatchComponent key={user.UserInMatch_ID} userDetails={userDetails} MatchDetails={this.props.MatchDetails} MatchAdmin={this.props.MatchDetails.Admin_ID} userPIC={picture} userInMatch={2} refreshUsers={this.props.refreshMatches} />
                            )
                        }
                    }) : [],
                usersInvitedToMatchNotAccepted: this.props.rootStore.MatchStore.UsersInvitedToMatches !== undefined &&
                    this.props.rootStore.MatchStore.UsersInvitedToMatches.length !== 0 ? this.props.rootStore.MatchStore.UsersInvitedToMatches.map(user => {
                        if (!user.Accepted && this.props.MatchDetails.Match_ID === user.Match_ID) {
                            let userDetails = this.props.rootStore.UserStore.users.filter(u => u.User_ID === user.User_ID)[0]
                            let picture = userDetails.ProfilePIC === null || userDetails.ProfilePIC === undefined ? ""
                                : (userDetails.ProfilePIC.slice(0, 8) !== "https://" ?
                                    `http://ruppinmobile.tempdomain.co.il/site09/uploadFiles/${userDetails.ProfilePIC}`
                                    : userDetails.ProfilePIC)

                            console.log("kkkkkkkkkkkkkkkkkkk  " + userDetails.User_ID)
                            return (
                                <UsersInMatchComponent key={user.UserInvitedToMatch_ID} userDetails={userDetails} MatchDetails={this.props.MatchDetails} MatchAdmin={this.props.MatchDetails.Admin_ID} userPIC={picture} userInMatch={3} refreshUsers={this.props.refreshMatches} />
                            )
                        }
                    }) : []
            }, () => console.log())
        }
        else {
            this.setState({
                UsersInMatch: this.props.rootStore.MatchStore.UsersInMatches !== undefined &&
                    this.props.rootStore.MatchStore.UsersInMatches.length !== 0 ? this.props.rootStore.MatchStore.UsersInMatches.map(user => {
                        if (user.Accepted && this.props.MatchDetails.Match_ID === user.Match_ID) {
                            let userDetails = this.props.rootStore.UserStore.users.filter(u => u.User_ID === user.User_ID)[0]
                            let picture = userDetails.ProfilePIC === null || userDetails.ProfilePIC === undefined ? ""
                                : (userDetails.ProfilePIC.slice(0, 8) !== "https://" ?
                                    `http://ruppinmobile.tempdomain.co.il/site09/uploadFiles/${userDetails.ProfilePIC}`
                                    : userDetails.ProfilePIC)

                            console.log("kkkkkkkkkkkkkkkkkkk  " + userDetails.User_ID)
                            return (
                                <UsersInMatchComponent key={user.UserInMatch_ID} MatchDetails={this.props.MatchDetails} userDetails={userDetails} MatchAdmin={this.props.MatchDetails.Admin_ID} userPIC={picture} userInMatch={0} refreshUsers={this.props.refreshMatches} />
                            )
                        }
                    }) : [],
                UsersInvitedToMatch: this.props.rootStore.MatchStore.UsersInvitedToMatches !== undefined &&
                    this.props.rootStore.MatchStore.UsersInvitedToMatches.length !== 0 ? this.props.rootStore.MatchStore.UsersInvitedToMatches.map(user => {
                        if (user.Accepted && this.props.MatchDetails.Match_ID === user.Match_ID) {
                            let userDetails = this.props.rootStore.UserStore.users.filter(u => u.User_ID === user.User_ID)[0]
                            let picture = userDetails.ProfilePIC === null || userDetails.ProfilePIC === undefined ? ""
                                : (userDetails.ProfilePIC.slice(0, 8) !== "https://" ?
                                    `http://ruppinmobile.tempdomain.co.il/site09/uploadFiles/${userDetails.ProfilePIC}`
                                    : userDetails.ProfilePIC)

                            console.log("kkkkkkkkkkkkkkkkkkk  " + userDetails.User_ID)
                            return (
                                <UsersInMatchComponent key={user.UserInvitedToMatch_ID} MatchDetails={this.props.MatchDetails} userDetails={userDetails} MatchAdmin={this.props.MatchDetails.Admin_ID} userPIC={picture} userInMatch={1} refreshUsers={this.props.refreshMatches} />
                            )
                        }
                    }) : []
            })
        }

    }

    refreshUsers = async () => {
        console.log("matchModal - refreshing")
        await this.clearUsers()
    }

    friendsInviteHideModal = () => {
        this.setState({
            friendsInviteModalVisible: false
        })
    }

    setfriendsInviteModal = async () => {
        await this.props.rootStore.FriendsStore.getFriendsTable()
        this.setState({
            friendsInviteModalVisible: true
        })
    }

    render() {
        return (
            <Modal
                isVisible={this.props.modalVisible}
                deviceHeight={height - 20}
                deviceWidth={width - 10}
                onBackButtonPress={() => this.props.hideModal()}
            >
                <Container style={{ /*width: width - 50, alignSelf: 'center',*/ backgroundColor: 'rgb(48,48,48)' }}>
                    <Content padder contentContainerStyle={{ flex: 1, justifyContent: 'space-evenly' }}>
                        <Item style={{ flex: 0.2, flexDirection: 'row', justifyContent: 'space-evenly', borderBottomColor: 'transparent' }}>
                            <Thumbnail
                                source={this.props.MatchDetails.Match_Picture === null ? require('../assets/Sports-Vision.png') : { uri: `http://ruppinmobile.tempdomain.co.il/site09/uploadFiles/${this.props.MatchDetails.Match_Picture}` }} />
                            <Text style={{ fontSize: 30, fontWeight: 'bold', textAlign: 'center', color: 'rgb(204,204,204)' }}>
                                {this.props.MatchDetails.Match_Name}
                            </Text>
                        </Item>
                        <Item style={{ flex: 0.1, flexDirection: 'row', justifyContent: 'space-between', borderBottomColor: 'transparent' }}>
                            <Label style={{ color: 'rgb(186, 40, 0)' }}>DATE</Label>
                            <Text style={{ color: 'rgb(204,204,204)' }}>{this.props.Match_Date.toISOString().slice(0, 10)}</Text>
                        </Item>
                        <Item style={{ flex: 0.1, flexDirection: 'row', justifyContent: 'space-between', borderBottomColor: 'transparent' }}>
                            <Label style={{ color: 'rgb(186, 40, 0)' }}>TIME</Label>
                            <Text style={{ color: 'rgb(204,204,204)' }}>{this.props.MatchDetails.Match_Time.slice(0, 5)}</Text>
                        </Item>
                        <Item style={{ flex: 0.1, flexDirection: 'row', justifyContent: 'space-between', borderBottomColor: 'transparent' }}>
                            <Label style={{ color: 'rgb(186, 40, 0)' }}>LOCATION</Label>
                            <Text style={{ color: 'rgb(204,204,204)' }}>{this.props.rootStore.CitiesAndFieldsStore.Cities.filter(city => city.City_ID === this.props.MatchDetails.City_ID)[0].City_Name} - {this.props.rootStore.CitiesAndFieldsStore.Fields.filter(field => field.Field_ID === this.props.MatchDetails.Field_ID)[0].Field_Name}</Text>
                        </Item>
                        <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'rgb(186, 40, 0)' }}>PLAYERS</Text>
                        {this.props.rootStore.UserStore.user.userID === this.props.MatchDetails.Admin_ID && <Button
                            bordered
                            rounded
                            style={{ borderColor: 'rgb(186, 40, 0)', justifyContent: 'center' }}
                            onPress={this.setfriendsInviteModal}
                        >
                            <Text style={{ color: 'rgb(186, 40, 0)' }}>INVITE FRIENDS</Text>
                        </Button>}
                        <FriendsInviteModal match_ID={this.props.MatchDetails.Match_ID} modalVisible={this.state.friendsInviteModalVisible} hideModal={this.friendsInviteHideModal} MatchDetails={this.props.MatchDetails} refreshMatches={this.props.refreshMatches}/>
                        <Content padder>
                            {this.state.UsersInMatch}
                            {this.state.UsersInvitedToMatch}
                            {this.state.usersInvitedToMatchNotAccepted}
                            {this.state.usersRequestToJoin}
                        </Content>
                        {this.props.btn}
                        <Button
                            bordered
                            rounded
                            style={{ borderColor: 'rgb(186, 40, 0)', justifyContent: 'center'/*, width: 120*/ }}
                            onPress={() => this.props.hideModal()}
                        >
                            <Text style={{ color: 'rgb(186, 40, 0)' }}>BACK</Text>
                        </Button>
                    </Content>
                </Container>
            </Modal>
        )
    }
}

export default inject('rootStore')(observer(MatchModal))