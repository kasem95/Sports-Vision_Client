import React from 'react'
import {
    Container,
    Button,
    Text,
    Content,
    Thumbnail
} from "native-base";
import { Image, TouchableOpacity, AsyncStorage } from 'react-native'
import { observer, inject } from 'mobx-react'


class MainPage extends React.Component {

    constructor(props) {
        super(props);
    }

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            title: 'HOME',
            headerRight: <TouchableOpacity onPress={() => params.profilePage()}><Thumbnail small source={params.faceORG == 1 ? { uri: params.imageurl } : { uri: `http://ruppinmobile.tempdomain.co.il/site09/uploadFiles/${params.imageurl}` }} /*style={{ paddingVertical: 5, width: 40, height: 40, borderRadius: 75 }}*/ /></TouchableOpacity>
        };
    };

    async componentDidMount() {
        this.props.navigation.setParams({ profilePage: this.profilePage, imageurl: this.props.rootStore.UserStore.user.imageURL, faceORG: this.props.rootStore.UserStore.faceORGLogin })
        console.log(this.props.rootStore.UserStore.user.imageURL)
        await this.props.rootStore.UserStore.getUsers()
    }

    profilePage = () => {
        this.props.navigation.navigate("ProfilePage")
    }

    MatchesPage = async () => {
        await this.props.rootStore.MatchStore.getUsersInMatches()
        await this.props.rootStore.MatchStore.getUsersInvitedToMatches()
        await this.props.rootStore.CitiesAndFieldsStore.getCitiesAndFields()
        await this.props.rootStore.MatchStore.getActiveMatches()
        this.props.navigation.navigate("MatchesPage")
    }

    FriendsPage = async () => {
        await this.props.rootStore.FriendsStore.getFriendsRespondsList(this.props.rootStore.UserStore.user.userID)
        await this.props.rootStore.FriendsStore.getFriendsRequestsList(this.props.rootStore.UserStore.user.userID)
        await this.props.rootStore.FriendsStore.getFriendsList(this.props.rootStore.UserStore.user.userID)
        this.props.navigation.navigate("FriendsPage")
    }

    logout = async () => {
        await AsyncStorage.clear();
        if (this.props.rootStore.UserStore.faceORGLogin == 1) {
            this.props.rootStore.UserStore.setFaceORGLogin()
        }
        this.props.rootStore.FriendsStore.friendsList = []
        this.props.rootStore.FriendsStore.FriendsRespondsList = []
        this.props.rootStore.FriendsStore.FriendsRequestsList = []
        this.props.navigation.navigate('Auth');
    }

    render() {
        return (
            <Container style={{flex: 1, justifyContent: 'center', backgroundColor: 'rgb(48,48,48)'}}>
                <Image style={{height: 190, width: 120, alignSelf: 'center'}} source = {require('../assets/Sports-Vision.png')} />
                <Content padder contentContainerStyle={{ flex: 1, justifyContent: 'space-evenly', flexDirection: 'row' }}>
                    <Content contentContainerStyle={{ flex: 1, justifyContent: 'space-evenly' }}>
                        <Button bordered rounded style={{
                            justifyContent: 'center',
                            borderColor: 'rgb(186, 40, 0)',
                            paddingVertical: 30,
                            width: 120,
                            height: 120,
                            borderRadius: 75,
                        }}
                            onPress={this.profilePage}>
                            <Text style={{color: 'rgb(186, 40, 0)'}}>Profile</Text>
                        </Button>
                        <Button bordered rounded style={{
                            justifyContent: 'center',
                            borderColor: 'rgb(186, 40, 0)',
                            paddingVertical: 30,
                            width: 120,
                            height: 120,
                            borderRadius: 75,
                        }}
                            onPress={this.MatchesPage}>
                            <Text style={{color: 'rgb(186, 40, 0)'}}>Matches</Text>
                        </Button>
                    </Content>
                    <Content contentContainerStyle={{ flex: 1, justifyContent: 'space-evenly', alignSelf: 'flex-end' }}>
                        <Button bordered rounded style={{
                            justifyContent: 'center',
                            borderColor: 'rgb(186, 40, 0)',
                            paddingVertical: 30,
                            width: 120,
                            height: 120,
                            borderRadius: 75,
                        }}
                            onPress={this.FriendsPage}>
                            <Text style={{color: 'rgb(186, 40, 0)'}}>Friends</Text>
                        </Button>
                        <Button bordered rounded style={{
                            justifyContent: 'center',
                            borderColor: 'rgb(186, 40, 0)',
                            paddingVertical: 30,
                            width: 120,
                            height: 120,
                            borderRadius: 75,
                        }}
                            onPress={this.logout}>
                            <Text style={{color: 'rgb(186, 40, 0)'}}>LOGOUT</Text>
                        </Button>
                    </Content>
                </Content>
            </Container>
        );
    }

}

export default inject('rootStore')(observer(MainPage))