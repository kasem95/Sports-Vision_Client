import React from 'react';
import { Card, CardItem, Left, Body, Button, Right, Text, Thumbnail, Item } from 'native-base';
import { observer, inject } from 'mobx-react';

class UserToAddFriendsComponent extends React.Component {


    constructor(props) {
        super(props);

    }


    AddFriend = async () => {
        const data = {
            userID: this.props.rootStore.UserStore.user.userID,
            friendID: this.props.UserID
        };
        console.log(data)
        await fetch(`http://10.0.0.19:3000/addFriend`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            }
        })
            .then(res => {
                //console.log("res=", res);
                return res.text();
            })
            .then(
                result => {
                    console.log("fetch GET= ", result);
                    console.log(result)
                    this.props.RemoveComponent()
                },
                error => {
                    console.log("=> err post=", error);
                }
            );
    }

    render() {
        return (
            <Card transparent>
                <CardItem header style={{backgroundColor: 'rgb(48,48,48)'}}>
                    <Left>
                        <Thumbnail style={{backgroundColor: 'rgb(204,204,204)'}} source={this.props.ProfilePIC === "" ? require('../assets/profilepicture.png') : { uri: this.props.ProfilePIC }} />
                        <Body>
                            <Text style={{color: 'rgb(204,204,204)'}}>{this.props.Username}</Text>
                            <Text note style={{fontSize: 10}}>{this.props.Email}</Text>
                        </Body>
                    </Left>
                    <Right>
                        <Button bordered rounded onPress={() => this.AddFriend()} style={{ borderColor: 'rgb(186, 40, 0)' }}>
                            <Text style={{color: 'rgb(186, 40, 0)'}}>ADD FRIEND</Text>
                        </Button>
                    </Right>
                </CardItem>
            </Card>
        )
    }

}

export default inject('rootStore')(observer(UserToAddFriendsComponent));