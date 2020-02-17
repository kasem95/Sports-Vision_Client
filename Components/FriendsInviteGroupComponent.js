import React from 'react';
import { Card, CardItem, Left, Body, Button, Right, Text, Thumbnail, Toast } from 'native-base';
import { observer, inject } from 'mobx-react';

class FriendsInviteGroupComponent extends React.Component {

    constructor(props) {
        super(props);

    }

    inviteFriendToGroup = async() => {
        let details = {
            groupID: this.props.GroupDetails.Group_ID,
            userID: this.props.userID,
            maxPlayer: this.props.GroupDetails.Max_Players,
        }
        await fetch(`http://ruppinmobile.tempdomain.co.il/site09/api/Groups/InviteFriendToGroup`, {
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
                    if (result === "You have invited him to join your group!") {
                        await this.props.rootStore.GroupsStore.saveLastFriendsInviteModal(this.props.GroupDetails.Group_ID);
                        await this.props.rootStore.GroupsStore.insertLastModal(this.props.GroupDetails.Group_ID)
                        await this.props.refreshGroups()
                        Toast.show({ text: 'You have ivnited a friend to join the group', buttonText: 'Okay', type: 'success' })
                    }
                    else {
                        alert(result);
                    }
                },
                error => {
                    console.log("=> err post=", error);
                }
            )
    }

    render() {
        return (
            <Card transparent>
                <CardItem header style={{ backgroundColor: 'rgb(48,48,48)' }}>
                    <Left>
                        <Thumbnail style={{ backgroundColor: 'rgb(204,204,204)' }} source={this.props.image === "" ? require('../assets/profilepicture.png') : { uri: this.props.image }} />
                        <Body>
                            <Text style={{ color: 'rgb(204,204,204)' }}>{this.props.username}</Text>
                            <Text note style={{ fontSize: 10 }}>{this.props.email}</Text>
                        </Body>
                    </Left>
                    <Right>
                        <Button onPress={this.inviteFriendToGroup} rounded bordered rounded style={{ borderColor: 'rgb(186, 40, 0)' }}>
                            <Text style={{ color: 'rgb(186, 40, 0)' }}>INVITE</Text>
                        </Button>
                    </Right>
                </CardItem>
            </Card>
        )
    }

}

export default inject('rootStore')(observer(FriendsInviteGroupComponent));