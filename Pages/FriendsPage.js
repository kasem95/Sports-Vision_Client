import React from 'react'
import { Container, Button, Text, Tab, Tabs } from 'native-base'
import {
    TouchableOpacity,
    Image
} from 'react-native';
import { observer, inject } from 'mobx-react';
import FriendsTab from '../Tabs/FriendsTab'
import FriendsRespondsTab from '../Tabs/FriendsRespondsTab'
import FriendsRequestsTab from '../Tabs/FriendsRequestsTab'


class FriendPage extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            title: 'FRIENDS',
            headerRight: <TouchableOpacity onPress={() => params.profilePage()}><Image source={params.faceORG == 1 ? { uri: params.imageurl } : { uri: `http://ruppinmobile.tempdomain.co.il/site09/uploadFiles/${params.imageurl}` }} style={{ paddingVertical: 5, width: 40, height: 40, borderRadius: 75 }} /></TouchableOpacity>
        };
    };

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.navigation.setParams({ profilePage: this.profilePage, imageurl: this.props.rootStore.UserStore.user.imageURL, faceORG: this.props.rootStore.UserStore.faceORGLogin })

    }

    profilePage = () => {
        this.props.navigation.navigate("ProfilePage")
    }

    UsersPage = async () => {
        await this.props.rootStore.FriendsStore.getFriendsTable()
        await this.props.rootStore.UsersToAddFriendStore.getUsersList(this.props.rootStore.UserStore.user.userID, this.props.rootStore.FriendsStore.friendsTable)
        this.props.navigation.navigate("UsersToAddFriendPage")
    }

    render() {
        return (
            <Container style={{backgroundColor: 'rgb(48,48,48)'}}>
                <Tabs tabBarUnderlineStyle={{backgroundColor: 'rgb(204,204,204)'}}>
                    <Tab
                        
                        textStyle={{ color: 'rgb(186, 40, 0)' }}
                        activeTextStyle={{ color: 'rgb(48,48,48)' }}
                        tabStyle={{ backgroundColor: 'rgb(48,48,48)' }}
                        activeTabStyle={{ backgroundColor: 'rgb(186, 40, 0)', borderRightColor: 'rgb(186, 40, 0)' }} style={{ backgroundColor: 'rgb(48,48,48)' }}
                        heading='FRIENDS'
                    >
                        <FriendsTab />
                    </Tab>
                    <Tab
                        textStyle={{ color: 'rgb(186, 40, 0)',textAlign: 'center' }}
                        activeTextStyle={{ color: 'rgb(48,48,48)',textAlign: 'center' }}
                        tabStyle={{ backgroundColor: 'rgb(48,48,48)' }}
                        activeTabStyle={{ backgroundColor: 'rgb(186, 40, 0)' }}
                        style={{ backgroundColor: 'rgb(48,48,48)' }}
                        heading="INCOMING REQUESTS"
                    >
                        <FriendsRespondsTab />
                    </Tab>
                    <Tab
                        textStyle={{ color: 'rgb(186, 40, 0)',textAlign: 'center' }}
                        activeTextStyle={{ color: 'rgb(48,48,48)',textAlign: 'center' }}
                        tabStyle={{ backgroundColor: 'rgb(48,48,48)' }}
                        activeTabStyle={{ backgroundColor: 'rgb(186, 40, 0)' }}
                        style={{ backgroundColor: 'rgb(48,48,48)' }}
                        heading="REQUESTS SENT"
                    >
                        <FriendsRequestsTab />
                    </Tab>
                </Tabs>
                <Button style={{ justifyContent: 'center', backgroundColor: 'rgb(186, 40, 0)' }} onPress={this.UsersPage}>
                    <Text style={{ color: 'rgb(48,48,48)' }}>DISCOVER NEW FRIENDS</Text>
                </Button>
            </Container>
        )
    }
}


export default inject('rootStore')(observer(FriendPage));