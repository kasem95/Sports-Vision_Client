import React from 'react';
import { Dimensions, Platform, Image } from 'react-native'
import { Text, Content, Button, Container, Item, Label, Title } from 'native-base'
import { observer, inject } from 'mobx-react';
import Modal from "react-native-modal";
import FriendsInviteGroupComponent from '../Components/FriendsInviteGroupComponent'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
/*const height = Platform.OS === "ios"
? Dimensions.get("window").height
: ExtraDimensions.getRealWindowHeight();*/

class FriendsInviteGroupModal extends React.Component {
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

    updateState = async () => {
        let friends = this.props.rootStore.FriendsStore.friendsTable;
        this.setState({
            friends: this.props.rootStore.UserStore.users.filter(user => {
                for (let i = 0; i < friends.length; i++) {
                    if (((user.User_ID === friends[i].User_ID && this.props.rootStore.UserStore.user.userID === friends[i].Friend_ID)
                        || (user.User_ID === friends[i].Friend_ID && this.props.rootStore.UserStore.user.userID === friends[i].User_ID))
                        && user.User_ID !== this.props.rootStore.UserStore.user.userID) {
                        return true
                    }
                }
                return false
            })
        }, () => {
            this.setState({
                friendsList: this.state.friends.map(user => {

                    let picture = user.ProfilePIC === null || user.ProfilePIC === undefined ? ""
                        : (user.ProfilePIC.slice(0, 8) !== "https://" ?
                            `http://ruppinmobile.tempdomain.co.il/site09/uploadFiles/${user.ProfilePIC}`
                            : user.ProfilePIC)

                    return (
                        <FriendsInviteGroupComponent key={user.User_ID} userID={user.User_ID} image={picture} username={user.Username} email={user.Email} GroupDetails={this.props.GroupDetails} refreshGroups={this.props.refreshGroups} />
                    )
                })
            }, () => console.log("friends list = " + JSON.stringify(this.state.friendsList)))
        })
    }

    render() {
        return (
            <Modal
                isVisible={this.props.modalVisible}
                deviceHeight={height - 50}
                deviceWidth={width - 20}
                onBackButtonPress={() => this.props.hideModal()}
            >
                <Container style={{ backgroundColor: 'rgb(48,48,48)' }}>
                    <Text style={{ fontSize: 25, fontWeight: 'bold', textAlign: 'center', color: 'rgb(204,204,204)' }}>
                        INVITE FRIENDS
                    </Text>
                    <Content padder>
                        {this.state.friendsList === [] || this.state.friendsList === undefined ? <Text>NO FRIENDS</Text> : this.state.friendsList}
                    </Content>
                    <Button
                        bordered
                        rounded
                        style={{ borderColor: 'rgb(186, 40, 0)', justifyContent: 'center'/*, width: 120*/ }}
                        onPress={() => this.props.hideModal()}
                    >
                        <Text style={{ color: 'rgb(186, 40, 0)' }}>BACK</Text>
                    </Button>
                </Container>
            </Modal>
        )
    }
}

export default inject('rootStore')(observer(FriendsInviteGroupModal));