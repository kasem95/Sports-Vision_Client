import React from 'react'
import { Container, Content } from 'native-base'
import {
    ScrollView,
    RefreshControl,
    TouchableOpacity,
    Image
} from 'react-native';
import { observer, inject } from 'mobx-react';
import UserToAddFriend from '../Components/UserToAddFriendsComponent'

class UsersToAddFriendPage extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            title: 'DISCOVER FRIENDS',
            headerRight: <TouchableOpacity onPress={() => params.profilePage()}><Image source={params.faceORG == 1 ? { uri: params.imageurl } : { uri: `http://ruppinmobile.tempdomain.co.il/site09/uploadFiles/${params.imageurl}` }} style={{ paddingVertical: 5, width: 40, height: 40, borderRadius: 75 }} /></TouchableOpacity>
        };
    };

    constructor(props) {
        super(props)
        this.state = {
            userList: [],
            refreshing: false
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({ profilePage: this.profilePage, imageurl: this.props.rootStore.UserStore.user.imageURL, faceORG: this.props.rootStore.UserStore.faceORGLogin })

        this.setState({
            userList: this.props.rootStore.UsersToAddFriendStore.usersList.map(user => {

                let picture = user.ProfilePIC === null || user.ProfilePIC === undefined ? ""
                    : (user.ProfilePIC.slice(0, 8) !== "https://" ?
                        `http://ruppinmobile.tempdomain.co.il/site09/uploadFiles/${user.ProfilePIC}`
                        : user.ProfilePIC)

                console.log(picture)
                return (
                    <UserToAddFriend key={user.User_ID}
                        UserID={user.User_ID}
                        Username={user.Username}
                        Email={user.Email}
                        ProfilePIC={picture}
                        RemoveComponent={() => this.removeComp(user.User_ID)} />
                )

            })
        })
    }

    profilePage = () => {
        this.props.navigation.navigate("ProfilePage")
    }

    removeComp = (userID) => {
        let list = this.props.rootStore.UsersToAddFriendStore.usersList.filter(user => userID !== user.User_ID)
        this.props.rootStore.UsersToAddFriendStore.usersList = list;
        this.props.rootStore.FriendsStore.getFriendsList(this.props.rootStore.UserStore.user.userID)
        this.setState({
            userList: list.map(user => {
                let picture = user.ProfilePIC === null || user.ProfilePIC === undefined ? ""
                    : (user.ProfilePIC.slice(0, 8) !== "https://" ?
                        `http://ruppinmobile.tempdomain.co.il/site09/uploadFiles/${user.ProfilePIC}`
                        : user.ProfilePIC)

                return (
                    <UserToAddFriend key={user.User_ID}
                        UserID={user.User_ID}
                        Username={user.Username}
                        Email={user.Email}
                        ProfilePIC={picture}
                        RemoveComponent={() => this.removeComp(user.User_ID)} />
                )
            })
        })
    }

    onRefresh = async () => {
        await this.setState(prevState => ({
            refreshing: !prevState.refreshing
        }))

        this.props.rootStore.UsersToAddFriendStore.getUsersList(this.props.rootStore.UserStore.user.userID, this.props.rootStore.FriendsStore.friendsList)

        this.setState(prevState => ({
            userList: this.props.rootStore.UsersToAddFriendStore.usersList.map(user => {
                let picture = user.ProfilePIC === null || user.ProfilePIC === undefined ? ""
                    : (user.ProfilePIC.slice(0, 8) !== "https://" ?
                        `http://ruppinmobile.tempdomain.co.il/site09/uploadFiles/${user.ProfilePIC}`
                        : user.ProfilePIC)

                return (
                    <UserToAddFriend key={user.User_ID}
                        UserID={user.User_ID}
                        Username={user.Username}
                        Email={user.Email}
                        ProfilePIC={picture}
                        RemoveComponent={() => this.removeComp(user.User_ID)} />
                )
            }),
            refreshing: !prevState.refreshing
        }))
    }

    render() {
        return (
            <Container style={{ backgroundColor: 'rgb(48,48,48)' }}>
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
                    }>
                    <Content padder>
                        {this.state.userList}
                    </Content>
                </ScrollView>
            </Container>
        )
    }
}

export default inject('rootStore')(observer(UsersToAddFriendPage));