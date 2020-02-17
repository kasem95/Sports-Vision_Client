import React from 'react'
import { Container, Content, Button, Text, Tab, Tabs } from 'native-base'
import {
    ScrollView,
    RefreshControl,
    TouchableOpacity,
    Image
} from 'react-native';
import { observer, inject } from 'mobx-react';
import FriendComponent from '../Components/FriendComponent'

class FriendsRespondsTab extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            userList: [],
            refreshing: false
        }
    }

    componentDidMount() {
        this.setState({
            userList: this.props.rootStore.FriendsStore.FriendsRespondsList !== undefined &&
            this.props.rootStore.FriendsStore.FriendsRespondsList.length !== 0 &&
             this.props.rootStore.FriendsStore.FriendsRespondsList.map(friend => {
                let picture = friend.ProfilePIC === null || friend.ProfilePIC === undefined ? ""
                        : (friend.ProfilePIC.slice(0, 8) !== "https://" ?
                            `http://ruppinmobile.tempdomain.co.il/site09/uploadFiles/${friend.ProfilePIC}`
                            : friend.ProfilePIC)

                return (
                    <FriendComponent key={friend.User_ID}
                        IsFriends={1}
                        UserID={friend.User_ID}
                        Username={friend.Username}
                        Email={friend.Email}
                        ProfilePIC={picture}
                        RemoveComponent={() => this.remove(friend.User_ID)} />
                )
            })
        })
    }

    remove = (userID) => {
        let list = this.props.rootStore.FriendsStore.FriendsRespondsList !== undefined &&
        this.props.rootStore.FriendsStore.FriendsRespondsList.length !== 0 &&
         this.props.rootStore.FriendsStore.FriendsRespondsList.filter(user => userID !== user.User_ID)
        this.props.rootStore.FriendsStore.friendsList = list;
        this.setState({
            userList: list !== undefined && list.length !== 0 && list.map(friend => {
                let picture = friend.ProfilePIC === null || friend.ProfilePIC === undefined ? ""
                        : (friend.ProfilePIC.slice(0, 8) !== "https://" ?
                            `http://ruppinmobile.tempdomain.co.il/site09/uploadFiles/${friend.ProfilePIC}`
                            : friend.ProfilePIC)

                return (
                    <FriendComponent key={friend.User_ID}
                        IsFriends={1}
                        UserID={friend.User_ID}
                        Username={friend.Username}
                        Email={friend.Email}
                        ProfilePIC={picture}
                        RemoveComponent={() => this.remove(friend.User_ID)} />
                )
            })
        })
    }

    onRefresh = async () => {
        await this.setState(prevState => ({
            refreshing: !prevState.refreshing
        }))

        await this.props.rootStore.FriendsStore.getFriendsRespondsList(this.props.rootStore.UserStore.user.userID)

        this.setState( prevState => ({
            userList: this.props.rootStore.FriendsStore.FriendsRespondsList !== undefined &&
            this.props.rootStore.FriendsStore.FriendsRespondsList.length !== 0 &&
             this.props.rootStore.FriendsStore.FriendsRespondsList.map(friend => {
                let picture = friend.ProfilePIC === null || friend.ProfilePIC === undefined ? ""
                        : (friend.ProfilePIC.slice(0, 8) !== "https://" ?
                            `http://ruppinmobile.tempdomain.co.il/site09/uploadFiles/${friend.ProfilePIC}`
                            : friend.ProfilePIC)

                return (
                    <FriendComponent key={friend.User_ID}
                        IsFriends={1}
                        UserID={friend.User_ID}
                        Username={friend.Username}
                        Email={friend.Email}
                        ProfilePIC={picture}
                        RemoveComponent={() => this.remove(friend.User_ID)} />
                )
            }),
            refreshing: !prevState.refreshing
        }))
    }

    render() {
        return (
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} colors={['rgb(186, 40, 0)']} />
                }
            >
                <Content padder>
                    {this.state.userList}
                </Content>
            </ScrollView>
        )
    }
}

export default inject('rootStore')(observer(FriendsRespondsTab))