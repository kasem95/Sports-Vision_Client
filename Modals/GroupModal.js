import React from 'react';
import { Dimensions, Platform } from 'react-native'
import { Text, Content, Button, Container, Item, Label, Thumbnail } from 'native-base'
import { observer, inject } from 'mobx-react';
import Modal from "react-native-modal";
import FriendsInviteGroupModal from '../Modals/FriendsInviteGroupModal'
import UsersInGroupComponent from '../Components/UserInGroupComponent';

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
/*const height = Platform.OS === "ios"
? Dimensions.get("window").height
: ExtraDimensions.getRealWindowHeight();*/

class GroupModal extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            usersRequestToJoin: [],
            usersInvitedToGroupNotAccepted: [],
            UsersInGroup: [],
            UsersInvitedToGroup: [],
            btn: this.props.btn,
            friendsInviteModalVisible: false
        }
    }

    async componentDidMount() {
        await this.updateState()
        await this.setState({ btn: this.props.btn })
        if(this.props.rootStore.GroupsStore.lastFriendsInviteModal === this.props.GroupDetails.Group_ID)
        {
            this.props.rootStore.GroupsStore.saveLastFriendsInviteModal(undefined)
            this.setState({friendsInviteModalVisible: true});
        }

    }

    updateState = async () => {
        if (this.props.GroupDetails.Admin_ID === this.props.rootStore.UserStore.user.userID) {
            this.setState({
                UsersInGroup: this.props.rootStore.GroupsStore.UsersInGroups !== undefined &&
                    this.props.rootStore.GroupsStore.UsersInGroups.length !== 0 ? this.props.rootStore.GroupsStore.UsersInGroups.map(user => {
                        if (user.Accepted && this.props.GroupDetails.Group_ID === user.Group_ID) {
                            let userDetails = this.props.rootStore.UserStore.users.filter(u => u.User_ID === user.User_ID)[0]
                            let picture = userDetails.ProfilePIC === null || userDetails.ProfilePIC === undefined ? ""
                                : (userDetails.ProfilePIC.slice(0, 8) !== "https://" ?
                                    `http://ruppinmobile.tempdomain.co.il/site09/uploadFiles/${userDetails.ProfilePIC}`
                                    : userDetails.ProfilePIC)

                            console.log("kkkkkkkkkkkkkkkkkkk  " + userDetails.User_ID)
                            return (
                                <UsersInGroupComponent key={user.UserInGroup_ID} GroupDetails={this.props.GroupDetails} userDetails={userDetails} GroupAdmin={this.props.GroupDetails.Admin_ID} userPIC={picture} userInGroup={0} refreshUsers={this.props.refreshGroups} />
                            )
                        }
                    }) : [],
                UsersInvitedToGroup: this.props.rootStore.GroupsStore.UsersInvitedToGroups !== undefined &&
                    this.props.rootStore.GroupsStore.UsersInvitedToGroups.length !== 0 ? this.props.rootStore.GroupsStore.UsersInvitedToGroups.map(user => {
                        if (user.Accepted && this.props.GroupDetails.Group_ID === user.Group_ID) {
                            let userDetails = this.props.rootStore.UserStore.users.filter(u => u.User_ID === user.User_ID)[0]
                            let picture = userDetails.ProfilePIC === null || userDetails.ProfilePIC === undefined ? ""
                                : (userDetails.ProfilePIC.slice(0, 8) !== "https://" ?
                                    `http://ruppinmobile.tempdomain.co.il/site09/uploadFiles/${userDetails.ProfilePIC}`
                                    : userDetails.ProfilePIC)

                            console.log("kkkkkkkkkkkkkkkkkkk  " + userDetails.User_ID)
                            return (
                                <UsersInGroupComponent key={user.UserInvitedToGroup_ID} GroupDetails={this.props.GroupDetails} userDetails={userDetails} GroupAdmin={this.props.GroupDetails.Admin_ID} userPIC={picture} userInGroup={1} refreshUsers={this.props.refreshGroups} />
                            )
                        }
                    }) : [],
                usersRequestToJoin: this.props.rootStore.GroupsStore.UsersInGroups !== undefined &&
                    this.props.rootStore.GroupsStore.UsersInGroups.length !== 0 ? this.props.rootStore.GroupsStore.UsersInGroups.map(user => {
                        if (!user.Accepted && this.props.GroupDetails.Group_ID === user.Group_ID) {
                            let userDetails = this.props.rootStore.UserStore.users.filter(u => u.User_ID === user.User_ID)[0]
                            let picture = userDetails.ProfilePIC === null || userDetails.ProfilePIC === undefined ? ""
                                : (userDetails.ProfilePIC.slice(0, 8) !== "https://" ?
                                    `http://ruppinmobile.tempdomain.co.il/site09/uploadFiles/${userDetails.ProfilePIC}`
                                    : userDetails.ProfilePIC)

                            console.log("kkkkkkkkkkkkkkkkkkk  " + userDetails.User_ID)
                            return (
                                <UsersInGroupComponent key={user.UserInGroup_ID} userDetails={userDetails} GroupDetails={this.props.GroupDetails} GroupAdmin={this.props.GroupDetails.Admin_ID} userPIC={picture} userInGroup={2} refreshUsers={this.props.refreshGroups} />
                            )
                        }
                    }) : [],
                usersInvitedToGroupNotAccepted: this.props.rootStore.GroupsStore.UsersInvitedToGroups !== undefined &&
                    this.props.rootStore.GroupsStore.UsersInvitedToGroups.length !== 0 ? this.props.rootStore.GroupsStore.UsersInvitedToGroups.map(user => {
                        if (!user.Accepted && this.props.GroupDetails.Group_ID === user.Group_ID) {
                            let userDetails = this.props.rootStore.UserStore.users.filter(u => u.User_ID === user.User_ID)[0]
                            let picture = userDetails.ProfilePIC === null || userDetails.ProfilePIC === undefined ? ""
                                : (userDetails.ProfilePIC.slice(0, 8) !== "https://" ?
                                    `http://ruppinmobile.tempdomain.co.il/site09/uploadFiles/${userDetails.ProfilePIC}`
                                    : userDetails.ProfilePIC)

                            console.log("kkkkkkkkkkkkkkkkkkk  " + userDetails.User_ID)
                            return (
                                <UsersInGroupComponent key={user.UserInvitedToGroup_ID} userDetails={userDetails} GroupDetails={this.props.GroupDetails} GroupAdmin={this.props.GroupDetails.Admin_ID} userPIC={picture} userInGroup={3} refreshUsers={this.props.refreshGroups} />
                            )
                        }
                    }) : []
            }, () => console.log())
        }
        else {
            this.setState({
                UsersInGroup: this.props.rootStore.GroupsStore.UsersInGroups !== undefined &&
                    this.props.rootStore.GroupsStore.UsersInGroups.length !== 0 ? this.props.rootStore.GroupsStore.UsersInGroups.map(user => {
                        if (user.Accepted && this.props.GroupDetails.Group_ID === user.Group_ID) {
                            let userDetails = this.props.rootStore.UserStore.users.filter(u => u.User_ID === user.User_ID)[0]
                            let picture = userDetails.ProfilePIC === null || userDetails.ProfilePIC === undefined ? ""
                                : (userDetails.ProfilePIC.slice(0, 8) !== "https://" ?
                                    `http://ruppinmobile.tempdomain.co.il/site09/uploadFiles/${userDetails.ProfilePIC}`
                                    : userDetails.ProfilePIC)

                            console.log("kkkkkkkkkkkkkkkkkkk  " + userDetails.User_ID)
                            return (
                                <UsersInGroupComponent key={user.UserInGroup_ID} GroupDetails={this.props.GroupDetails} userDetails={userDetails} GroupAdmin={this.props.GroupDetails.Admin_ID} userPIC={picture} userInGroup={0} refreshUsers={this.props.refreshGroups} />
                            )
                        }
                    }) : [],
                UsersInvitedToGroup: this.props.rootStore.GroupsStore.UsersInvitedToGroups !== undefined &&
                    this.props.rootStore.GroupsStore.UsersInvitedToGroups.length !== 0 ? this.props.rootStore.GroupsStore.UsersInvitedToGroups.map(user => {
                        if (user.Accepted && this.props.GroupDetails.Group_ID === user.Group_ID) {
                            let userDetails = this.props.rootStore.UserStore.users.filter(u => u.User_ID === user.User_ID)[0]
                            let picture = userDetails.ProfilePIC === null || userDetails.ProfilePIC === undefined ? ""
                                : (userDetails.ProfilePIC.slice(0, 8) !== "https://" ?
                                    `http://ruppinmobile.tempdomain.co.il/site09/uploadFiles/${userDetails.ProfilePIC}`
                                    : userDetails.ProfilePIC)

                            console.log("kkkkkkkkkkkkkkkkkkk  " + userDetails.User_ID)
                            return (
                                <UsersInGroupComponent key={user.UserInvitedToGroup_ID} GroupDetails={this.props.GroupDetails} userDetails={userDetails} GroupAdmin={this.props.GroupDetails.Admin_ID} userPIC={picture} userInGroup={1} refreshUsers={this.props.refreshGroups} />
                            )
                        }
                    }) : []
            })
        }

    }

    refreshUsers = async () => {
        console.log("groupModal - refreshing")
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
                                source={this.props.GroupDetails.Group_Picture === null ? require('../assets/Sports-Vision.png') : { uri: `http://ruppinmobile.tempdomain.co.il/site09/uploadFiles/${this.props.GroupDetails.Group_Picture}` }} />
                            <Text style={{ fontSize: 30, fontWeight: 'bold', textAlign: 'center', color: 'rgb(204,204,204)' }}>
                                {this.props.GroupDetails.Group_Name}
                            </Text>
                        </Item>
                        <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'rgb(186, 40, 0)' }}>PLAYERS</Text>
                        {this.props.rootStore.UserStore.user.userID === this.props.GroupDetails.Admin_ID && <Button
                            bordered
                            rounded
                            style={{ borderColor: 'rgb(186, 40, 0)', justifyContent: 'center' }}
                            onPress={this.setfriendsInviteModal}
                        >
                            <Text style={{ color: 'rgb(186, 40, 0)' }}>INVITE FRIENDS</Text>
                        </Button>}
                        <FriendsInviteGroupModal Group_ID={this.props.GroupDetails.Group_ID} modalVisible={this.state.friendsInviteModalVisible} hideModal={this.friendsInviteHideModal} GroupDetails={this.props.GroupDetails} refreshGroups={this.props.refreshGroups}/>
                        <Content padder>
                            {this.state.UsersInGroup}
                            {this.state.UsersInvitedToGroup}
                            {this.state.usersInvitedToGroupNotAccepted}
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

export default inject('rootStore')(observer(GroupModal))