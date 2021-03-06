import React from 'react';
import { Card, CardItem, Left, Body, Button, Right, Text, Thumbnail, Toast } from 'native-base';
import { observer, inject } from 'mobx-react';

class FriendsInviteComponent extends React.Component {

    constructor(props) {
        super(props);

    }

    inviteFriendToMatch = async() => {
        let matchDate = new Date(this.props.MatchDetails.Match_Date)
        let details = {
            matchID: this.props.MatchDetails.Match_ID,
            userID: this.props.userID,
            matchDate: matchDate.getMonth() + 1
                + '-' + matchDate.getDate() + '-' +
                matchDate.getFullYear(),
            matchTime: this.props.MatchDetails.Match_Time.slice(0, 5),
            playTime: this.props.MatchDetails.Play_Time,
            cityID: this.props.MatchDetails.City_ID,
            fieldID: this.props.MatchDetails.Field_ID,
            maxPlayer: this.props.MatchDetails.Max_Players,
        }
        await fetch(`http://ruppinmobile.tempdomain.co.il/site09/api/Matches/InviteFriendToMatch`, {
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
                    if (result === "You have invited him to join your match!") {
                        await this.props.rootStore.MatchStore.saveLastFriendsInviteModal(this.props.MatchDetails.Match_ID);
                        await this.props.rootStore.MatchStore.insertLastModal(this.props.MatchDetails.Match_ID)
                        await this.props.refreshMatches()
                        Toast.show({ text: 'You have ivnited a friend to join the match', buttonText: 'Okay', type: 'success' })
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
                        <Button onPress={this.inviteFriendToMatch} rounded bordered rounded style={{ borderColor: 'rgb(186, 40, 0)' }}>
                            <Text style={{ color: 'rgb(186, 40, 0)' }}>INVITE</Text>
                        </Button>
                    </Right>
                </CardItem>
            </Card>
        )
    }

}

export default inject('rootStore')(observer(FriendsInviteComponent));