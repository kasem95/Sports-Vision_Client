import React from 'react';
import { Card, CardItem, Left, Body, Button, Right, Text, Thumbnail, Item, Icon } from 'native-base';
import { observer, inject } from 'mobx-react';

class FriendComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            btn: <Text style={{ color: 'rgb(204,204,204)' }}>Loading...</Text>
        }
    }

    componentDidMount() {
        this.updateBtn()
    }

    updateBtn = () => {
        if (this.props.IsFriends === 1) {
            this.setState({
                btn: <Button onPress={this.accept} bordered rounded style={{ borderColor: 'rgb(186, 40, 0)' }}>
                    <Text style={{ color: 'rgb(186, 40, 0)' }}>ACCEPT</Text>
                </Button>
            })
        }
        else if (this.props.IsFriends === 2) {
            this.setState({
                btn: <Text style={{ color: 'rgb(186, 40, 0)', alignSelf: 'center' }}>PENDING</Text>
            })
        }
    }

    unfriend = async () => {
        const data = {
            userID: this.props.rootStore.UserStore.user.userID,
            friendID: this.props.UserID
        };
        console.log(data)
        await fetch(`http://10.0.0.6:3000/deleteFriend`, {
            method: "delete",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            }
        })
            .then(res => {
                console.log("res=", res);
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

    accept = async () => {
        const data = {
            friendID: this.props.rootStore.UserStore.user.userID,
            userID: this.props.UserID
        };
        console.log(data)
        await fetch(`http://10.0.0.6:3000/acceptAddFriend`, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            }
        })
            .then(res => {
                console.log("res=", res);
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
                <CardItem header style={{ backgroundColor: 'rgb(48,48,48)' }}>
                    <Left>
                        <Thumbnail style={{backgroundColor: 'rgb(204,204,204)'}} source={this.props.ProfilePIC === "" ? require('../assets/profilepicture.png') : { uri: this.props.ProfilePIC }} />
                        <Body>
                            <Text style={{ color: 'rgb(204,204,204)' }}>{this.props.Username}</Text>
                        </Body>
                    </Left>
                    {this.props.IsFriends !== 0 && <Right style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly' }}>
                        <Button bordered rounded onPress={this.unfriend} style={{ borderColor: 'rgb(186, 40, 0)' }}>
                            <Icon name='trash' style={{ color: 'rgb(186, 40, 0)' }} />
                        </Button>
                        {this.state.btn}
                    </Right>}
                    {this.props.IsFriends === 0 && <Right>
                        <Button bordered rounded onPress={this.unfriend} style={{ borderColor: 'rgb(186, 40, 0)' }}>
                            <Icon name='trash' style={{ color: 'rgb(186, 40, 0)' }} />
                        </Button>
                    </Right>}
                </CardItem>
            </Card>
        )
    }

}

export default inject('rootStore')(observer(FriendComponent));