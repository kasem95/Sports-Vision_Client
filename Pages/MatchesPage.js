import React, { Component } from 'react'
import { observer, inject } from 'mobx-react';
import { Container, Button, Text, Tab, Tabs } from 'native-base';
import MatchComponent from '../Components/MatchComponent'
import { TouchableOpacity, Image } from 'react-native'
import MatchesTab from '../Tabs/MatchesTab';


class MatchesPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            allMatches: [],
            allMatchesList: [],
            refreshing: false,
            joinedMatches: [],
            joinedMatchesList: [],
            matchesInvitations: [],
            matchesInvitationsList: [],
            matchesRequestedToJoin: [],
            matchesRequestedToJoinList: []
        }
    }

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            title: 'MATCHES',
            headerRight: <TouchableOpacity onPress={() => params.profilePage()}><Image source={params.faceORG == 1 ? { uri: params.imageurl } : { uri: `http://ruppinmobile.tempdomain.co.il/site09/uploadFiles/${params.imageurl}` }} style={{ paddingVertical: 5, width: 40, height: 40, borderRadius: 75 }} /></TouchableOpacity>
        };
    };

    async componentDidMount() {
        console.log("kasssememeamsemasemase   " + this.props.rootStore.MatchStore.UsersInvitedToMatches)
        this.props.navigation.setParams({ profilePage: this.profilePage, imageurl: this.props.rootStore.UserStore.user.imageURL, faceORG: this.props.rootStore.UserStore.faceORGLogin })
        this.refreshMatches();
    }

    clearMatches = () => {
        this.setState({
            allMatches: [],
            allMatchesList: [],
            joinedMatches: [],
            joinedMatchesList: [],
            matchesInvitations: [],
            matchesInvitationsList: [],
            matchesRequestedToJoin: [],
            matchesRequestedToJoinList: []
        })
    }

    refreshMatches = async () => {
        console.log("matchesPage - refreshing")
        await this.setState(prevState => ({
            refreshing: !prevState.refreshing
        }))
        await this.clearMatches()
        await this.props.rootStore.MatchStore.getUsersInMatches()
        await this.props.rootStore.MatchStore.getUsersInvitedToMatches()
        await this.props.rootStore.MatchStore.getActiveMatches()
        await this.props.rootStore.FriendsStore.getFriendsTable()
        let usersInvited = this.props.rootStore.MatchStore.UsersInvitedToMatches
        let usersInMatches = this.props.rootStore.MatchStore.UsersInMatches
        let matches = this.props.rootStore.MatchStore.ActiveMatches
        let JoinedMatches = []
        let MatchesInvitations = []
        let MatchesRequestedToJoin = []
        if (matches !== undefined &&
            matches.length !== 0) {
            await matches.forEach(match => {
                let userIsInMatch = false;
                let userIsInvited = false;
                let userRequested = false;
                if (usersInMatches !== undefined &&
                    usersInMatches.length !== 0) {
                    usersInMatches.forEach(user => {
                        if (user.User_ID === this.props.rootStore.UserStore.user.userID
                            && user.Match_ID === match.Match_ID && user.Accepted) {
                            userIsInMatch = true
                        } else if (user.User_ID === this.props.rootStore.UserStore.user.userID
                            && user.Match_ID === match.Match_ID && !user.Accepted) {
                            userRequested = true
                        }
                    })
                }
                if (!userIsInMatch && !userRequested) {
                    if (usersInvited !== undefined &&
                        usersInvited.length !== 0) {
                            usersInvited.forEach(user => {
                            if (user.User_ID === this.props.rootStore.UserStore.user.userID
                                && user.Match_ID === match.Match_ID && user.Accepted) {
                                userIsInMatch = true
                            } else if (user.User_ID === this.props.rootStore.UserStore.user.userID
                                && user.Match_ID === match.Match_ID && !user.Accepted) {
                                userIsInvited = true
                            }
                        })
                    }
                }
                if (userIsInMatch) {
                    JoinedMatches.push(match)
                }
                else if (userRequested) {
                    MatchesRequestedToJoin.push(match)
                }
                else if (userIsInvited) {
                    MatchesInvitations.push(match)
                }
            })
        }
        await this.setState( prevState => ({
            allMatches: matches !== undefined &&
                matches.length !== 0 &&
                matches.map(match => {
                    let adminName = this.props.rootStore.UserStore.users.filter(user => user.User_ID === match.Admin_ID)[0].Username
                    let matchDate = new Date(match.Match_Date)
                    console.log('anaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' + adminName)
                    return (
                        < MatchComponent
                            key={match.Match_ID}
                            MatchDetails={match}
                            adminName={adminName}
                            MatchDate={matchDate}
                            refreshMatches={this.refreshMatches}
                        />
                    )
                }),
            allMatchesList: matches,
            joinedMatches: JoinedMatches !== undefined &&
                JoinedMatches.length !== 0 && JoinedMatches.map(match => {
                    let adminName = this.props.rootStore.UserStore.users.filter(user => user.User_ID === match.Admin_ID)[0].Username
                    let matchDate = new Date(match.Match_Date)
                    console.log('anaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' + adminName)
                    return (
                        < MatchComponent
                            key={match.Match_ID}
                            MatchDetails={match}
                            adminName={adminName}
                            MatchDate={matchDate}
                            refreshMatches={this.refreshMatches}
                        />
                    )
                }),
            joinedMatchesList: JoinedMatches,
            matchesInvitations: MatchesInvitations.length !== 0 &&
                MatchesInvitations.map(match => {
                    let adminName = this.props.rootStore.UserStore.users.filter(user => user.User_ID === match.Admin_ID)[0].Username
                    let matchDate = new Date(match.Match_Date)
                    console.log('anaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' + adminName)
                    return (
                        < MatchComponent
                            key={match.Match_ID}
                            MatchDetails={match}
                            adminName={adminName}
                            MatchDate={matchDate}
                            refreshMatches={this.refreshMatches}
                        />
                    )
                }),
            matchesInvitationsList: MatchesInvitations,
            matchesRequestedToJoin: MatchesRequestedToJoin.length !== 0 &&
                MatchesRequestedToJoin.map(match => {
                    let adminName = this.props.rootStore.UserStore.users.filter(user => user.User_ID === match.Admin_ID)[0].Username
                    let matchDate = new Date(match.Match_Date)
                    console.log('anaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' + adminName)
                    return (
                        < MatchComponent
                            key={match.Match_ID}
                            MatchDetails={match}
                            adminName={adminName}
                            MatchDate={matchDate}
                            refreshMatches={this.refreshMatches}
                        />
                    )
                }),
            matchesRequestedToJoinList: MatchesRequestedToJoin,
            refreshing: !prevState.refreshing
        }))

    }

    profilePage = () => {
        this.props.navigation.navigate("ProfilePage")
    }

    goToCreateMatchPage = () => {
        this.props.rootStore.MatchStore.changeCreateMatchWithGroup(false);
        this.props.rootStore.CameraStore.changeCreateMatchPhotoURI("")
        this.props.navigation.navigate("CreateMatchPage")
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
                        <MatchesTab Matches={this.state.allMatches} MatchesList={this.state.allMatchesList} refreshing={this.state.refreshing} refreshMatches={this.refreshMatches} />
                    </Tab>
                    <Tab
                        textStyle={{ color: 'rgb(186, 40, 0)' }}
                        activeTextStyle={{ color: 'rgb(48,48,48)' }}
                        tabStyle={{ backgroundColor: 'rgb(48,48,48)' }}
                        activeTabStyle={{ backgroundColor: 'rgb(186, 40, 0)' }}
                        style={{ backgroundColor: 'rgb(48,48,48)' }}
                        heading="JOINED"
                    >
                        <MatchesTab Matches={this.state.joinedMatches} MatchesList={this.state.joinedMatchesList} refreshing={this.state.refreshing} refreshMatches={this.refreshMatches} />
                    </Tab>
                    <Tab
                        textStyle={{ color: 'rgb(186, 40, 0)' }}
                        activeTextStyle={{ color: 'rgb(48,48,48)' }}
                        tabStyle={{ backgroundColor: 'rgb(48,48,48)' }}
                        activeTabStyle={{ backgroundColor: 'rgb(186, 40, 0)' }}
                        style={{ backgroundColor: 'rgb(48,48,48)' }}
                        heading="REQUESTS"
                    >
                        <MatchesTab Matches={this.state.matchesRequestedToJoin} MatchesList={this.state.matchesRequestedToJoinList} refreshing={this.state.refreshing} refreshMatches={this.refreshMatches} />
                    </Tab>
                    <Tab
                        textStyle={{ color: 'rgb(186, 40, 0)' }}
                        activeTextStyle={{ color: 'rgb(48,48,48)' }}
                        tabStyle={{ backgroundColor: 'rgb(48,48,48)' }}
                        activeTabStyle={{ backgroundColor: 'rgb(186, 40, 0)' }}
                        style={{ backgroundColor: 'rgb(48,48,48)' }}
                        heading="INVITES"
                    >
                        <MatchesTab Matches={this.state.matchesInvitations} MatchesList={this.state.matchesInvitationsList} refreshing={this.state.refreshing} refreshMatches={this.refreshMatches} />
                    </Tab>
                </Tabs>
                <Button style={{ justifyContent: 'center', backgroundColor: 'rgb(186, 40, 0)' }} onPress={this.goToCreateMatchPage}>
                    <Text style={{ color: 'rgb(48,48,48)' }}>CREATE A MATCH</Text>
                </Button>
            </Container>
        )
    }
}

export default inject('rootStore')(observer(MatchesPage));
