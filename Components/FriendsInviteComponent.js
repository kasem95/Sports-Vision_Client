import React from 'react';
import { Card, CardItem, Left, Body, Button, Right, Text, Thumbnail, Item } from 'native-base';
import { observer, inject } from 'mobx-react';

class FriendsInviteComponent extends React.Component {

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <Card transparent>
                <CardItem header>
                    <Left>
                        <Thumbnail source={this.props.ProfilePIC === "" ? require('../assets/profilepicture.png') : { uri: this.props.ProfilePIC }} />
                        <Body>
                            <Text>{this.props.username}</Text>
                        </Body>
                    </Left>
                    <Right>
                        <Button rounded style={{ backgroundColor: 'rgb(186, 40, 0)' }}>
                            <Text style={{color: 'black'}}>INVITE</Text>
                        </Button>
                    </Right>
                </CardItem>
            </Card>
        )
    }

}

export default inject('rootStore')(observer(FriendsInviteComponent));