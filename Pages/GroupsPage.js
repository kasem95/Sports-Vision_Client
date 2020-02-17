import React from 'react'
import { observer, inject } from 'mobx-react';
import { Container, Button, Text, Tab, Tabs } from 'native-base';
import GroupComponent from '../Components/GroupComponent'
import { TouchableOpacity, Image } from 'react-native'
import GroupsTab from '../Tabs/GroupsTab';


class GroupsPage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            allGroups: [],
            allGroupsList: [],
            refreshing: false,
            joinedGroups: [],
            joinedGroupsList: [],
            groupsInvitations: [],
            groupsInvitationsList: [],
            groupsRequestedToJoin: [],
            groupsRequestedToJoinList: []
        }
    }

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            title: 'GROUPS',
            headerRight: <TouchableOpacity onPress={() => params.profilePage()}><Image source={params.faceORG == 1 ? { uri: params.imageurl } : { uri: `http://ruppinmobile.tempdomain.co.il/site09/uploadFiles/${params.imageurl}` }} style={{ paddingVertical: 5, width: 40, height: 40, borderRadius: 75 }} /></TouchableOpacity>
        };
    };

    async componentDidMount() {
        this.props.navigation.setParams({ profilePage: this.profilePage, imageurl: this.props.rootStore.UserStore.user.imageURL, faceORG: this.props.rootStore.UserStore.faceORGLogin })
        this.refreshGroups();
    }

    clearGroups = () => {
        this.setState({
            allGroups: [],
            allGroupsList: [],
            joinedGroups: [],
            joinedGroupsList: [],
            groupsInvitations: [],
            groupsInvitationsList: [],
            groupsRequestedToJoin: [],
            groupsRequestedToJoinList: []
        })
    }

    refreshGroups = async () => {
        console.log("groupsPage - refreshing")
        await this.setState(prevState => ({
            refreshing: !prevState.refreshing
        }))
        await this.clearGroups()
        await this.props.rootStore.GroupsStore.getUsersInGroups()
        await this.props.rootStore.GroupsStore.getUsersInvitedToGroups()
        await this.props.rootStore.GroupsStore.getGroups()
        await this.props.rootStore.FriendsStore.getFriendsTable()
        let usersInvited = this.props.rootStore.GroupsStore.UsersInvitedToGroups
        let usersInGroups = this.props.rootStore.GroupsStore.UsersInGroups
        let groups = this.props.rootStore.GroupsStore.groups
        let JoinedGroups = []
        let GroupsInvitations = []
        let GroupsRequestedToJoin = []
        if (groups !== undefined &&
            groups.length !== 0) {
            await groups.forEach(group => {
                let userIsInGroup = false;
                let userIsInvited = false;
                let userRequested = false;
                if (usersInGroups !== undefined &&
                    usersInGroups.length !== 0) {
                    usersInGroups.forEach(user => {
                        if (user.User_ID === this.props.rootStore.UserStore.user.userID
                            && user.Group_ID === group.Group_ID && user.Accepted) {
                            userIsInGroup = true
                        } else if (user.User_ID === this.props.rootStore.UserStore.user.userID
                            && user.Group_ID === group.Group_ID && !user.Accepted) {
                            userRequested = true
                        }
                    })
                }
                if (!userIsInGroup && !userRequested) {
                    if (usersInvited !== undefined &&
                        usersInvited.length !== 0) {
                            usersInvited.forEach(user => {
                            if (user.User_ID === this.props.rootStore.UserStore.user.userID
                                && user.Group_ID === group.Group_ID && user.Accepted) {
                                userIsInGroup = true
                            } else if (user.User_ID === this.props.rootStore.UserStore.user.userID
                                && user.Group_ID === group.Group_ID && !user.Accepted) {
                                userIsInvited = true
                            }
                        })
                    }
                }
                if (userIsInGroup) {
                    JoinedGroups.push(group)
                }
                else if (userRequested) {
                    GroupsRequestedToJoin.push(group)
                }
                else if (userIsInvited) {
                    GroupsInvitations.push(group)
                }
            })
        }
        await this.setState( prevState => ({
            allGroups: groups !== undefined &&
                groups.length !== 0 &&
                groups.map(group => {
                    let adminName = this.props.rootStore.UserStore.users.filter(user => user.User_ID === group.Admin_ID)[0].Username
                    console.log('anaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' + adminName)
                    return (
                        < GroupComponent
                            key={group.Group_ID}
                            GroupDetails={group}
                            adminName={adminName}
                            refreshGroups={this.refreshGroups}
                            tab={0}
                            nav={this.nav}
                        />
                    )
                }),
            allGroupsList: groups,
            JoinedGroups: JoinedGroups !== undefined &&
                JoinedGroups.length !== 0 && JoinedGroups.map(group => {
                    let adminName = this.props.rootStore.UserStore.users.filter(user => user.User_ID === group.Admin_ID)[0].Username
                    console.log('anaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' + adminName)
                    return (
                        < GroupComponent
                            key={group.Group_ID}
                            GroupDetails={group}
                            adminName={adminName}
                            refreshGroups={this.refreshGroups}
                            tab={1}
                            nav={this.nav}
                        />
                    )
                }),
            joinedGroupsList: JoinedGroups,
            GroupsInvitations: GroupsInvitations.length !== 0 &&
                GroupsInvitations.map(group => {
                    let adminName = this.props.rootStore.UserStore.users.filter(user => user.User_ID === group.Admin_ID)[0].Username
                    console.log('anaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' + adminName)
                    return (
                        < GroupComponent
                            key={group.Group_ID}
                            GroupDetails={group}
                            adminName={adminName}
                            refreshGroups={this.refreshGroups}
                            tab={3}
                            nav={this.nav}
                        />
                    )
                }),
            groupssInvitationsList: GroupsInvitations,
            GroupsRequestedToJoin: GroupsRequestedToJoin.length !== 0 &&
                GroupsRequestedToJoin.map(group => {
                    let adminName = this.props.rootStore.UserStore.users.filter(user => user.User_ID === group.Admin_ID)[0].Username
                    console.log('anaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' + adminName)
                    return (
                        < GroupComponent
                            key={group.Group_ID}
                            GroupDetails={group}
                            adminName={adminName}
                            refreshGroups={this.refreshGroups}
                            tab={2}
                            nav={this.nav}
                        />
                    )
                }),
            groupsRequestedToJoinList: GroupsRequestedToJoin,
            refreshing: !prevState.refreshing
        }))

    }
    nav = () => {
        this.props.navigation.navigate("CreateMatchPage")
    }

    profilePage = () => {
        this.props.navigation.navigate("ProfilePage")
    }

    goToCreateGroupPage = () => {
        this.props.navigation.navigate("CreateGroupPage")
    }

    render() {
        return (
            <Container style={{ backgroundColor: 'rgb(48,48,48)' }}>
                <Tabs tabBarUnderlineStyle={{ backgroundColor: 'rgb(204,204,204)' }}>
                    <Tab

                        textStyle={{ color: 'rgb(186, 40, 0)' }}
                        activeTextStyle={{ color: 'rgb(48,48,48)' }}
                        tabStyle={{ backgroundColor: 'rgb(48,48,48)' }}
                        activeTabStyle={{ backgroundColor: 'rgb(186, 40, 0)', borderRightColor: 'rgb(186, 40, 0)' }} style={{ backgroundColor: 'rgb(48,48,48)' }}
                        heading='ALL'
                    >
                        <GroupsTab Groups={this.state.allGroups} GroupsList={this.state.allGroupsList} refreshing={this.state.refreshing} refreshGroups={this.refreshGroups} GroupTab={0} nav={this.nav} />
                    </Tab>
                    <Tab
                        textStyle={{ color: 'rgb(186, 40, 0)' }}
                        activeTextStyle={{ color: 'rgb(48,48,48)' }}
                        tabStyle={{ backgroundColor: 'rgb(48,48,48)' }}
                        activeTabStyle={{ backgroundColor: 'rgb(186, 40, 0)' }}
                        style={{ backgroundColor: 'rgb(48,48,48)' }}
                        heading="JOINED"
                    >
                        <GroupsTab Groups={this.state.JoinedGroups} GroupsList={this.state.joinedGroupsList} refreshing={this.state.refreshing} refreshGroups={this.refreshGroups} GroupTab={1} nav={this.nav} />
                    </Tab>
                    <Tab
                        textStyle={{ color: 'rgb(186, 40, 0)' }}
                        activeTextStyle={{ color: 'rgb(48,48,48)' }}
                        tabStyle={{ backgroundColor: 'rgb(48,48,48)' }}
                        activeTabStyle={{ backgroundColor: 'rgb(186, 40, 0)' }}
                        style={{ backgroundColor: 'rgb(48,48,48)' }}
                        heading="REQUESTS"
                    >
                        <GroupsTab Groups={this.state.GroupsRequestedToJoin} GroupsList={this.state.groupsRequestedToJoinList} refreshing={this.state.refreshing} refreshGroups={this.refreshGroups} GroupTab={2} nav={this.nav} />
                    </Tab>
                    <Tab
                        textStyle={{ color: 'rgb(186, 40, 0)' }}
                        activeTextStyle={{ color: 'rgb(48,48,48)' }}
                        tabStyle={{ backgroundColor: 'rgb(48,48,48)' }}
                        activeTabStyle={{ backgroundColor: 'rgb(186, 40, 0)' }}
                        style={{ backgroundColor: 'rgb(48,48,48)' }}
                        heading="INVITES"
                    >
                        <GroupsTab Groups={this.state.GroupsInvitations} GroupsList={this.state.groupsInvitationsList} refreshing={this.state.refreshing} refreshGroups={this.refreshGroups} GroupTab={3} nav={this.nav} />
                    </Tab>
                </Tabs>
                <Button style={{ justifyContent: 'center', backgroundColor: 'rgb(186, 40, 0)' }} onPress={this.goToCreateGroupPage}>
                    <Text style={{ color: 'rgb(48,48,48)' }}>CREATE A GROUP</Text>
                </Button>
            </Container>
        )
    }
}

export default inject('rootStore')(observer(GroupsPage));