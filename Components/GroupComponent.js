import React from 'react';
import { Card, CardItem, Left, Body, Button, Right, Text, Thumbnail, Icon, Content, Toast, Item, View } from 'native-base';
import { inject, observer } from 'mobx-react';
import GroupModal from '../Modals/GroupModal';


class GroupComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            UsersInGroupList: [],
            userIsInGroup: false,
            userIsAccepted: false,
            userIsInvited: false,
            modalVisible: false,
            btn: (<Button rounded style={{ backgroundColor: 'rgb(186, 40, 0)' }}>
                <Text style={{ color: 'black' }}>Loading...</Text>
            </Button>),
        }
    }

    async componentDidMount() {
        await this.updateState()
        await this.Btn()
        if (this.props.rootStore.GroupsStore.lastGroupModal === this.props.GroupDetails.Group_ID) {
            this.props.rootStore.GroupsStore.insertLastModal(undefined)
            this.setState({ modalVisible: true })
        }
    }

    updateState = async () => {
        await this.props.rootStore.GroupsStore.getUsersInGroups()
        await this.props.rootStore.GroupsStore.getUsersInvitedToGroups()
        let usersInGroupList = this.props.rootStore.GroupsStore.UsersInGroups !== undefined &&
            this.props.rootStore.GroupsStore.UsersInGroups.length !== 0 && this.props.rootStore.GroupsStore.UsersInGroups.filter(user =>
                user.Accepted && this.props.GroupDetails.Group_ID === user.Group_ID)
        this.props.rootStore.GroupsStore.UsersInvitedToGroups !== undefined &&
            this.props.rootStore.GroupsStore.UsersInvitedToGroups.length !== 0 && this.props.rootStore.GroupsStore.UsersInvitedToGroups.filter(user =>
                user.Accepted && this.props.GroupDetails.Group_ID === user.Group_ID && usersInGroupList.push(user))
        this.setState({
            UsersInGroupList: usersInGroupList
        })
    }

    hideModal = async () => {
        this.setState({
            modalVisible: false
        })
    }

    setModalVisible = () => {
        this.setState({
            modalVisible: true
        })
    }


    Btn = () => {
        let userIsInGroup = this.props.rootStore.GroupsStore.UsersInGroups !== undefined &&
            this.props.rootStore.GroupsStore.UsersInGroups.length !== 0 ?
            this.props.rootStore.GroupsStore.UsersInGroups.filter(user => user.User_ID === this.props.rootStore.UserStore.user.userID && user.Group_ID === this.props.GroupDetails.Group_ID)[0] === undefined ? false : true : false
        let userIsInvited = this.props.rootStore.GroupsStore.UsersInvitedToGroups !== undefined &&
            this.props.rootStore.GroupsStore.UsersInvitedToGroups.length !== 0 ? this.props.rootStore.GroupsStore.UsersInvitedToGroups.filter(user => user.User_ID === this.props.rootStore.UserStore.user.userID && user.Group_ID === this.props.GroupDetails.Group_ID)[0] === undefined ? false : true : false
        let userIsAccepted = userIsInGroup ? this.props.rootStore.GroupsStore.UsersInGroups !== undefined &&
            this.props.rootStore.GroupsStore.UsersInGroups.length !== 0 ?
            (this.props.rootStore.GroupsStore.UsersInGroups.filter(user => user.User_ID === this.props.rootStore.UserStore.user.userID && user.Group_ID === this.props.GroupDetails.Group_ID && user.Accepted)[0] !== undefined ? true : false) : false
            : this.props.rootStore.GroupsStore.UsersInvitedToGroups !== undefined &&
                this.props.rootStore.GroupsStore.UsersInvitedToGroups.length !== 0 ?
                (this.props.rootStore.GroupsStore.UsersInvitedToGroups.filter(user => user.User_ID === this.props.rootStore.UserStore.user.userID && user.Group_ID === this.props.GroupDetails.Group_ID && user.Accepted)[0] !== undefined ? true : false) : false

        console.log(userIsInGroup + "---" + userIsInvited + "---" + userIsAccepted)
        this.setState({
            userIsInGroup: userIsInGroup,
            userIsInvited: userIsInvited,
            userIsAccepted: userIsAccepted

        }, () => {
            if (!this.state.userIsInGroup && !this.state.userIsInvited && !this.state.userIsAccepted) {
                this.setState({
                    btn: (
                        <Button bordered rounded style={{ borderColor: 'rgb(186, 40, 0)', justifyContent: 'center' }} onPress={(!this.props.GroupDetails.IsPrivate && this.requestToJoin) || (() => this.setState({ dialogVisible: true }))}>
                            <Text style={{ color: 'rgb(186, 40, 0)' }}>JOIN</Text>
                        </Button>
                    )
                })
            }
            else if (this.state.userIsInGroup && !this.state.userIsInvited) {
                if (this.state.userIsAccepted) {
                    if (this.props.rootStore.UserStore.user.userID !== this.props.GroupDetails.Admin_ID) {
                        this.setState({
                            btn: (
                                <Button bordered rounded onPress={this.exitGroup} style={{ borderColor: 'rgb(186, 40, 0)', justifyContent: 'center' }}>
                                    <Text style={{ color: 'rgb(186, 40, 0)' }}>EXIT Group</Text>
                                </Button>
                            )
                        })
                    }
                    else {
                        this.setState({
                            btn: (
                                <Item style={{ borderBottomColor: 'transparent', flexDirection: 'row', justifyContent: 'space-around' }}>
                                    <Button onPress={this.cancelGroup} bordered rounded style={{ borderColor: 'rgb(186, 40, 0)', justifyContent: 'center' }}><Text style={{ color: 'rgb(186, 40, 0)' }}>CANCEL Group</Text></Button>
                                    <Button onPress={this.exitGroup} bordered rounded style={{ borderColor: 'rgb(186, 40, 0)', justifyContent: 'center' }}><Text style={{ color: 'rgb(186, 40, 0)' }}>EXIT Group</Text></Button>
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
            else if (!this.state.userIsInGroup && this.state.userIsInvited) {
                if (this.state.userIsAccepted) {
                    if (this.props.rootStore.UserStore.user.userID !== this.props.GroupDetails.Admin_ID) {
                        this.setState({
                            btn: (
                                <Button onPress={this.exitGroup} bordered rounded style={{ borderColor: 'rgb(186, 40, 0)', justifyContent: 'center' }}>
                                    <Text style={{ color: 'rgb(186, 40, 0)' }}>EXIT Group</Text>
                                </Button>
                            )
                        })
                    } else {
                        this.setState({
                            btn: (
                                <Item style={{ borderBottomColor: 'transparent', flexDirection: 'row', justifyContent: 'space-around' }}>
                                    <Button onPress={this.cancelGroup} bordered rounded style={{ borderColor: 'rgb(186, 40, 0)', justifyContent: 'center' }}><Text style={{ color: 'rgb(186, 40, 0)' }}>CANCEL Group</Text></Button>
                                    <Button onPress={this.exitGroup} bordered rounded style={{ borderColor: 'rgb(186, 40, 0)', justifyContent: 'center' }}><Text style={{ color: 'rgb(186, 40, 0)' }}>EXIT Group</Text></Button>
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

    exitGroup = async () => {
        let details = {
            GroupID: this.props.GroupDetails.Group_ID,
            AdminID: this.props.GroupDetails.Admin_ID,
            UserID: this.props.rootStore.UserStore.user.userID,
            Users_Joined: this.props.GroupDetails.Users_Joined
        }
        await fetch(`http://ruppinmobile.tempdomain.co.il/site09/api/Groups/ExitGroup`, {
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
                        if (this.props.tab === 0) {
                            if (this.state.modalVisible) {
                                await this.props.rootStore.GroupsStore.insertLastModal(this.props.GroupDetails.Group_ID)
                            }
                        }
                        if (this.state.modalVisible) {
                            await this.props.rootStore.GroupsStore.insertLastModal(this.props.GroupDetails.Group_ID)
                        }
                        await this.props.refreshGroups()
                        Toast.show({ text: 'You have exited the group', buttonText: 'Okay', type: 'success' })
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

    cancelGroup = async () => {
        let details = {
            Group_ID: this.props.GroupDetails.Group_ID,
        }
        await fetch(`http://ruppinmobile.tempdomain.co.il/site09/api/Groups/CancelGroup`, {
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
                        await this.props.refreshGroups()
                        Toast.show({ text: 'You have canceled the group', buttonText: 'Okay', type: 'success' })
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
            Group_ID: this.props.GroupDetails.Group_ID,
            Admin_ID: this.props.rootStore.UserStore.user.userID,
        }
        await fetch(`http://ruppinmobile.tempdomain.co.il/site09/api/Groups/CancelGroupInvite`, {
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
                        if (this.props.tab === 0) {
                            if (this.state.modalVisible) {
                                await this.props.rootStore.GroupsStore.insertLastModal(this.props.GroupDetails.Group_ID)
                            }
                        }
                        if (this.state.modalVisible) {
                            await this.props.rootStore.GroupsStore.insertLastModal(this.props.GroupDetails.Group_ID)
                        }
                        await this.props.refreshGroups()
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
            Group_ID: this.props.GroupDetails.Group_ID,
            Admin_ID: this.props.rootStore.UserStore.user.userID,
        }
        await fetch(`http://ruppinmobile.tempdomain.co.il/site09/api/Groups/CancelGroupRequest`, {
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
                        if (this.props.tab === 0) {
                            if (this.state.modalVisible) {
                                await this.props.rootStore.GroupsStore.insertLastModal(this.props.GroupDetails.Group_ID)
                            }
                        }
                        if (this.state.modalVisible) {
                            await this.props.rootStore.GroupsStore.insertLastModal(this.props.GroupDetails.Group_ID)
                        }
                        await this.props.refreshGroups()
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
            groupID: this.props.GroupDetails.Group_ID,
            userID: this.props.rootStore.UserStore.user.userID,
            maxPlayer: this.props.GroupDetails.Max_Players,
            IsInvite: true
        }
        await fetch(`http://ruppinmobile.tempdomain.co.il/site09/api/Groups/acceptRequestJoinGroup`, {
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
                        if (this.props.tab === 0) {
                            if (this.state.modalVisible) {
                                await this.props.rootStore.GroupsStore.insertLastModal(this.props.GroupDetails.Group_ID)
                            }
                        }
                        if (this.state.modalVisible) {
                            await this.props.rootStore.GroupsStore.insertLastModal(this.props.GroupDetails.Group_ID)
                        }
                        await this.props.refreshGroups()
                        Toast.show({ text: 'You have accepted to join the group', buttonText: 'Okay', type: 'success' })

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
        let details = {
            groupID: this.props.GroupDetails.Group_ID,
            userID: this.props.rootStore.UserStore.user.userID,
            maxPlayer: this.props.GroupDetails.Max_Players,
        }
        await fetch(`http://ruppinmobile.tempdomain.co.il/site09/api/Groups/RequestJoinGroup`, {
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
                    if (result === "You have requested to join the group") {
                        if (this.state.modalVisible) {
                            await this.props.rootStore.GroupsStore.insertLastModal(this.props.GroupDetails.Group_ID)
                        }
                        await this.props.refreshGroups()
                        Toast.show({ text: 'You have requested to join the group', buttonText: 'Okay', type: 'success' })
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

    goToCreateMatch = async () => {
        await this.props.rootStore.GroupsStore.insertGroupDetailsForMatchCreating(this.props.GroupDetails)
        await this.props.rootStore.GroupsStore.insertUsersInGroup(this.state.UsersInGroupList)
        await this.props.rootStore.MatchStore.changeCreateMatchWithGroup(true);
        console.log("n3333m = " + JSON.stringify(this.state.UsersInGroupList))
        this.props.nav();
    }

    render() {


        return (
            <Card style={{ borderColor: 'rgb(186, 40, 0)', borderWidth: 0.5, backgroundColor: 'transparent' }}>
                <CardItem header style={{ backgroundColor: 'rgb(48,48,48)', borderBottomColor: 'rgb(186, 40, 0)' }}>
                    <Left>
                        <Thumbnail source={this.props.GroupDetails.Group_Picture === null ? require('../assets/Sports-Vision.png') : { uri: `http://ruppinmobile.tempdomain.co.il/site09/uploadFiles/${this.props.GroupDetails.Group_Picture}` }} />
                        <Body>
                            <Text style={{ fontWeight: 'bold', color: 'rgb(204,204,204)' }}>{this.props.GroupDetails.Group_Name}</Text>
                            <Text note>{this.props.adminName}</Text>
                        </Body>
                    </Left>
                    <Right>
                        <Icon active name="person" style={{ color: "rgb(186, 40, 0)" }} />
                        <Text style={{ color: 'rgb(204,204,204)' }}>{this.props.GroupDetails.Users_Joined + '/' + this.props.GroupDetails.Max_Players}</Text>
                    </Right>
                </CardItem >
                <CardItem style={{ backgroundColor: 'rgb(48,48,48)', borderBottomColor: 'rgb(186, 40, 0)' }}>
                    <Body style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                        {this.state.btn}
                        <Button bordered rounded style={{ borderColor: 'rgb(186, 40, 0)', justifyContent: 'center' }} onPress={this.setModalVisible}>
                            <Text style={{ color: 'rgb(186, 40, 0)' }}>Details</Text>
                        </Button>
                        <GroupModal modalVisible={this.state.modalVisible} hideModal={this.hideModal} GroupDetails={this.props.GroupDetails} btn={this.state.btn} refreshGroups={this.props.refreshGroups} />
                    </Body>
                </CardItem>
                {this.props.GroupDetails.Admin_ID === this.props.rootStore.UserStore.user.userID && <CardItem style={{ backgroundColor: 'rgb(48,48,48)', borderBottomColor: 'rgb(186, 40, 0)' }}>
                    <Body style={{ justifyContent: 'center' }}>
                        <Button bordered rounded style={{ borderColor: 'rgb(186, 40, 0)', justifyContent: 'center' }} onPress={this.goToCreateMatch}>
                            <Text style={{ color: 'rgb(186, 40, 0)' }}>CREATE MATCH WITH THIS GROUP</Text>
                        </Button>
                    </Body>
                </CardItem>}
            </Card>
        )
    }
}

export default inject("rootStore")(observer(GroupComponent));