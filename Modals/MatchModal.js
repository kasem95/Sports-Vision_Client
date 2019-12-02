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
            userIsInMatch: false,
            userIsAccepted: false,
            userIsInvited: false,
            btn: (<Button rounded style={{ backgroundColor: 'rgb(186, 40, 0)' }}>
                <Text style={{ color: 'black' }}>Loading...</Text>
            </Button>),
            friendsInviteModalVisible: false
        }
    }

    componentDidMount() {
        this.updateState()
        this.Btn()
    }

    updateState = () => {
        if (this.props.MatchDetails.Admin_ID === this.props.rootStore.UserStore.user.userID) {
            this.setState({
                UsersInMatch: this.props.rootStore.MatchStore.UsersInMatches !== undefined &&
                    this.props.rootStore.MatchStore.UsersInMatches.length !== 0 ? this.props.rootStore.MatchStore.UsersInMatches.filter(user => user.Accepted && this.props.MatchDetails.Match_ID === user.Match_ID).map(user => {
                        let userDetails = this.props.rootStore.UserStore.users.filter(u => u.User_ID === user.User_ID)[0]
                        let picture = userDetails.ProfilePIC === null ? ""
                            : (userDetails.Google_ID === null && userDetails.Facebook_ID === null ?
                                `http://ruppinmobile.tempdomain.co.il/site09/uploadFiles/${userDetails.ProfilePIC}`
                                : userDetails.ProfilePIC)

                        console.log("kkkkkkkkkkkkkkkkkkk  " + userDetails.User_ID)
                        return (
                            <UsersInMatchComponent key={user.UserInMatch_ID} userDetails={userDetails} MatchAdmin={this.props.MatchDetails.Admin_ID} userPIC={picture} userInMatch={0} />
                        )
                    }) : [],
                UsersInvitedToMatch: this.props.rootStore.MatchStore.UsersInvitedToMatches !== undefined &&
                    this.props.rootStore.MatchStore.UsersInvitedToMatches.length !== 0 ? this.props.rootStore.MatchStore.UsersInvitedToMatches.filter(user => user.Accepted && this.props.MatchDetails.Match_ID === user.Match_ID).map(user => {
                        let userDetails = this.props.rootStore.UserStore.users.filter(u => u.User_ID === user.User_ID)[0]
                        let picture = userDetails.ProfilePIC === null ? ""
                            : (userDetails.Google_ID === null && userDetails.Facebook_ID === null ?
                                `http://ruppinmobile.tempdomain.co.il/site09/uploadFiles/${userDetails.ProfilePIC}`
                                : userDetails.ProfilePIC)

                        console.log("kkkkkkkkkkkkkkkkkkk  " + userDetails.User_ID)
                        return (
                            <UsersInMatchComponent key={user.UserInvitedToMatch_ID} userDetails={userDetails} MatchAdmin={this.props.MatchDetails.Admin_ID} userPIC={picture} userInMatch={1} />
                        )
                    }) : [],
                usersRequestToJoin: this.props.rootStore.MatchStore.UsersInMatches !== undefined &&
                    this.props.rootStore.MatchStore.UsersInMatches.length !== 0 ? this.props.rootStore.MatchStore.UsersInMatches.filter(user => !user.Accepted && this.props.MatchDetails.Match_ID === user.Match_ID).map(user => {
                        let userDetails = this.props.rootStore.UserStore.users.filter(u => u.User_ID === user.User_ID)[0]
                        let picture = userDetails.ProfilePIC === null ? ""
                            : (userDetails.Google_ID === null && userDetails.Facebook_ID === null ?
                                `http://ruppinmobile.tempdomain.co.il/site09/uploadFiles/${userDetails.ProfilePIC}`
                                : userDetails.ProfilePIC)

                        console.log("kkkkkkkkkkkkkkkkkkk  " + userDetails.User_ID)
                        return (
                            <UsersInMatchComponent key={user.UserInMatch_ID} userDetails={userDetails} MatchAdmin={this.props.MatchDetails.Admin_ID} userPIC={picture} userInMatch={2} />
                        )
                    }) : [],
                usersInvitedToMatchNotAccepted: this.props.rootStore.MatchStore.UsersInvitedToMatches !== undefined &&
                    this.props.rootStore.MatchStore.UsersInvitedToMatches.length !== 0 ? this.props.rootStore.MatchStore.UsersInvitedToMatches.filter(user => !user.Accepted && this.props.MatchDetails.Match_ID === user.Match_ID).map(user => {
                        let userDetails = this.props.rootStore.UserStore.users.filter(u => u.User_ID === user.User_ID)[0]
                        let picture = userDetails.ProfilePIC === null ? ""
                            : (userDetails.Google_ID === null && userDetails.Facebook_ID === null ?
                                `http://ruppinmobile.tempdomain.co.il/site09/uploadFiles/${userDetails.ProfilePIC}`
                                : userDetails.ProfilePIC)

                        console.log("kkkkkkkkkkkkkkkkkkk  " + userDetails.User_ID)
                        return (
                            <UsersInMatchComponent key={user.UserInvitedToMatch_ID} userDetails={userDetails} MatchAdmin={this.props.MatchDetails.Admin_ID} userPIC={picture} userInMatch={3} />
                        )
                    }) : []
            })
        }
        else {
            this.setState({
                UsersInMatch: this.props.rootStore.MatchStore.UsersInMatches !== undefined &&
                    this.props.rootStore.MatchStore.UsersInMatches.length !== 0 ? this.props.rootStore.MatchStore.UsersInMatches.filter(user => user.Accepted && this.props.MatchDetails.Match_ID === user.Match_ID).map(user => {
                        let userDetails = this.props.rootStore.UserStore.users.filter(u => u.User_ID === user.User_ID)[0]
                        let picture = userDetails.ProfilePIC === null ? ""
                            : (userDetails.Google_ID === null && userDetails.Facebook_ID === null ?
                                `http://ruppinmobile.tempdomain.co.il/site09/uploadFiles/${userDetails.ProfilePIC}`
                                : userDetails.ProfilePIC)

                        console.log("kkkkkkkkkkkkkkkkkkk  " + userDetails.User_ID)
                        return (
                            <UsersInMatchComponent key={user.UserInMatch_ID} userDetails={userDetails} MatchAdmin={this.props.MatchDetails.Admin_ID} userPIC={picture} userInMatch={0} />
                        )
                    }) : [],
                UsersInvitedToMatch: this.props.rootStore.MatchStore.UsersInvitedToMatches !== undefined &&
                    this.props.rootStore.MatchStore.UsersInvitedToMatches.length !== 0 ? this.props.rootStore.MatchStore.UsersInvitedToMatches.filter(user => user.Accepted && this.props.MatchDetails.Match_ID === user.Match_ID).map(user => {
                        let userDetails = this.props.rootStore.UserStore.users.filter(u => u.User_ID === user.User_ID)[0]
                        let picture = userDetails.ProfilePIC === null ? ""
                            : (userDetails.Google_ID === null && userDetails.Facebook_ID === null ?
                                `http://ruppinmobile.tempdomain.co.il/site09/uploadFiles/${userDetails.ProfilePIC}`
                                : userDetails.ProfilePIC)

                        console.log("kkkkkkkkkkkkkkkkkkk  " + userDetails.User_ID)
                        return (
                            <UsersInMatchComponent key={user.UserInvitedToMatch_ID} userDetails={userDetails} MatchAdmin={this.props.MatchDetails.Admin_ID} userPIC={picture} userInMatch={1} />
                        )
                    }) : []
            })
        }

    }

    Btn = () => {
        let userIsInMatch = this.props.rootStore.MatchStore.UsersInMatches !== undefined &&
            this.props.rootStore.MatchStore.UsersInMatches.length !== 0 ?
            this.props.rootStore.MatchStore.UsersInMatches.filter(user => user.User_ID === this.props.rootStore.UserStore.user.userID && user.Match_ID === this.props.MatchDetails.Match_ID)[0] === undefined ? false : true :
            false
        let userIsInvited = this.props.rootStore.MatchStore.UsersInvitedToMatches !== undefined &&
            this.props.rootStore.MatchStore.UsersInvitedToMatches.length !== 0 ? this.props.rootStore.MatchStore.UsersInvitedToMatches.filter(user => user.User_ID === this.props.rootStore.UserStore.user.userID && user.Match_ID === this.props.MatchDetails.Match_ID)[0] === undefined ? false : true :
            false
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
                        <Button rounded bordered style={{ borderColor: 'rgb(186, 40, 0)', justifyContent: 'center', width: 120 }}>
                            <Text style={{ color: 'rgb(186, 40, 0)' }}>JOIN</Text>
                        </Button>
                    )
                })
            }
            else if (this.state.userIsInMatch && !this.state.userIsInvited) {
                if (this.state.userIsAccepted) {
                    this.setState({
                        btn: (
                            <Button bordered rounded style={{ borderColor: 'rgb(186, 40, 0)', justifyContent: 'center', width: 120 }}>
                                <Text style={{ color: 'rgb(186, 40, 0)' }}>EXIT</Text>
                            </Button>
                        )
                    })

                }
                else {
                    this.setState({
                        btn: (
                            <Button bordered rounded style={{ borderColor: 'rgb(186, 40, 0)', justifyContent: 'center', width: 120 }}><Text style={{ color: 'rgb(186, 40, 0)' }}>CANCEL REQUEST</Text></Button>
                        )
                    })
                }
            }
            else if (!this.state.userIsInMatch && this.state.userIsInvited) {
                if (this.state.userIsAccepted) {
                    this.setState({
                        btn: (
                            <Button bordered rounded style={{ borderColor: 'rgb(186, 40, 0)', justifyContent: 'center', width: 120 }}>
                                <Text style={{ color: 'rgb(186, 40, 0)' }}>EXIT</Text>
                            </Button>
                        )
                    })
                }
                else {
                    this.setState({
                        btn: (
                            <Item>
                                <Button bordered rounded style={{ borderColor: 'rgb(186, 40, 0)', justifyContent: 'center', width: 120 }}><Text style={{ color: 'rgb(186, 40, 0)' }}>CANCEL INVITE</Text></Button>
                                <Button bordered rounded style={{ borderColor: 'rgb(186, 40, 0)', justifyContent: 'center', width: 120 }}><Text style={{ color: 'rgb(186, 40, 0)' }}>ACCEPT INVITE</Text></Button>
                            </Item>
                        )
                    })
                }
            }
            else {
                this.setState({
                    btn: (
                        <Button bordered rounded style={{ borderColor: 'rgb(186, 40, 0)', justifyContent: 'center', width: 120 }}>
                            <Text style={{ color: 'rgb(186, 40, 0)' }}>Loading...</Text>
                        </Button>
                    )
                })
            }
        })

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
                <Container style={{ /*width: width - 50,*/ alignSelf: 'center', backgroundColor: 'rgb(48,48,48)' }}>
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
                        {this.props.rootStore.UserStore.user.userID === this.props.Admin_ID && <Button
                            bordered
                            rounded
                            style={{ borderColor: 'rgb(186, 40, 0)', justifyContent: 'center' }}
                            onPress={this.setfriendsInviteModal}
                        >
                            <Text style={{ color: 'rgb(186, 40, 0)' }}>INVITE FRIENDS</Text>
                        </Button>}
                        <FriendsInviteModal match_ID={this.props.MatchDetails.Match_ID} modalVisible={this.state.friendsInviteModalVisible} hideModal={this.friendsInviteHideModal} />
                        <Content padder>
                            {this.state.UsersInMatch}
                            {this.state.UsersInvitedToMatch}
                            {this.state.usersInvitedToMatchNotAccepted}
                            {this.state.usersRequestToJoin}
                        </Content>
                        <Item style={{ flex: 0.2, flexDirection: 'row', justifyContent: 'space-between', borderBottomColor: 'transparent' }}>
                            <Button
                                bordered
                                rounded
                                style={{ borderColor: 'rgb(186, 40, 0)', justifyContent: 'center', width: 120 }}
                                onPress={() => this.props.hideModal()}
                            >
                                <Text style={{ color: 'rgb(186, 40, 0)' }}>BACK</Text>
                            </Button>
                            {this.state.btn}
                        </Item>
                    </Content>
                </Container>
            </Modal>
        )
    }
}

export default inject('rootStore')(observer(MatchModal))