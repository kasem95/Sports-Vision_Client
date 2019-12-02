import React from 'react';
import { Card, CardItem, Left, Body, Button, Right, Text, Thumbnail, Item } from 'native-base';
import { observer, inject } from 'mobx-react';

class UserInMatchComponent extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            btn: undefined
        }
    }

    componentDidMount() {
        this.updateState()
    }

    updateState = () => {
        if (this.props.MatchAdmin === this.props.rootStore.UserStore.user.userID) {
            if (this.props.MatchAdmin === this.props.userDetails.User_ID) {
                this.setState({
                    btn: <Text style={{color: 'rgb(204,204,204)'}}>ADMIN</Text>
                })
            }
            else {
                if (this.props.userInMatch === 0) {
                    this.setState({
                        btn: <Button rounded success>
                            <Text>KICK</Text>
                        </Button>
                    })
                } else if (this.props.userInMatch === 1) {
                    this.setState({
                        btn: <Button rounded success>
                            <Text>KICK</Text>
                        </Button>
                    })
                } else if (this.props.userInMatch === 2) {
                    this.setState({
                        btn: <Button rounded success>
                            <Text>ACCEPT</Text>
                        </Button>
                    })
                }
                else if (this.props.userInMatch === 3) {
                    this.setState({
                        btn: <Text style={{color: 'rgb(204,204,204)'}}>PENDING...</Text>
                    })
                }
            }
        }
        else {
            if (this.props.MatchAdmin === this.props.userDetails.User_ID) {
                this.setState({
                    btn: <Text style={{color: 'rgb(204,204,204)'}}>ADMIN</Text>
                })
            }
        }
    }

    render() {
        return (
            <Card style={{backgroundColor: 'transparent', borderColor: 'rgb(186, 40, 0)'}}>
                <CardItem header style={{backgroundColor: 'rgb(48,48,48)'}}>
                    <Left>
                        <Thumbnail small source={this.props.userPIC === "" ? require('../assets/profilepicture.png') : { uri: this.props.userPIC }} />
                        <Body>
                            <Text style={{color: 'rgb(204,204,204)'}}>{this.props.userDetails.Username}</Text>
                        </Body>
                    </Left>
                    <Right>
                        {this.state.btn}
                    </Right>
                </CardItem>
            </Card>
        )
    }

}

export default inject('rootStore')(observer(UserInMatchComponent));