import React from 'react';
import { Dimensions, Platform, Image } from 'react-native'
import { Text, Content, Button, Container, Item, Label, Title } from 'native-base'
import { observer, inject } from 'mobx-react';
import Modal from "react-native-modal";
import FriendsInviteComponent from '../Components/FriendsInviteComponent'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
/*const height = Platform.OS === "ios"
? Dimensions.get("window").height
: ExtraDimensions.getRealWindowHeight();*/

class FriendsInviteModal extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            friends: [],
            friendsList: []
        }
    }

    async componentDidMount() {
        await this.updateState()
        console.log("wb3dennn " + this.state.friendsList)
    }

    updateState = () => {
        this.setState({
            friends: this.props.rootStore.UserStore.users.filter(user => {
                this.props.rootStore.FriendsStore.friendsTable.filter(u => {
                    u.Friend_ID === user.User_ID && u.User_ID === this.props.rootStore.UserStore.user.userID && u.IsFriends
                })[0] !== null &&
                    this.props.rootStore.MatchStore.UsersInvitedToMatches.filter(u => u.User_ID === user.User_ID && u.Match_ID === this.props.match_ID)[0] === null &&
                    this.props.rootStore.MatchStore.UsersInMatches.filter(u => u.User_ID === user.User_ID && u.Match_ID === this.props.match_ID)[0] === null
            }),
            friendsList: this.state.friends.map(user => {
                
                let picture = user.ProfilePIC === null ? ""
                    : (user.Google_ID === null && user.Facebook_ID === null ?
                        `http://ruppinmobile.tempdomain.co.il/site09/uploadFiles/${user.ProfilePIC}`
                        : user.ProfilePIC)

                return (
                    <FriendsInviteComponent key={user.User_ID} image={picture} username={user.Username} />
                )
            })
        },console.log('wb3deeeen  ' + this.state.friends))
    }

    render() {
        return (
            <Modal
                isVisible={this.props.modalVisible}
                deviceHeight={height - 50}
                deviceWidth={width - 20}
                onBackButtonPress={() => this.props.hideModal()}
            >
                <Container style={{ flex: 1 }}>
                    <Content padder>
                        {this.state.friendsList === null ? <Text>NO FRIENDS</Text> : this.state.friendsList}
                    </Content>
                    <Button
                        rounded
                        style={{ backgroundColor: 'rgb(186, 40, 0)', justifyContent: 'center' }}
                        onPress={() => this.props.hideModal()}
                    >
                        <Text style={{ color: 'black' }}>BACK</Text>
                    </Button>
                </Container>
            </Modal>
        )
    }
}

export default inject('rootStore')(observer(FriendsInviteModal));