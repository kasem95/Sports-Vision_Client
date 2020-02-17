import React from 'react';
import { Text, Content, Button, Container, Item, Icon, Input, Thumbnail, Title } from 'native-base'
import Modal from "react-native-modal";
import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

class ChangeUsernameModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            oldUsername: this.props.oldUsername,
            newUsername: "",
            newUsernameErr: false,
            error: ""
        }

    }

    componentDidMount() {
        console.log("old username = " + this.state.oldUsername)

        this.setState({
            oldUsername: this.props.oldUsername,
            newUsername: "",
            newUsernameErr: false,
            error: ""
        })
    }

    confirmUsername = async () => {
        if (this.state.newUsername === "" || this.state.newUsername === undefined) {
            this.setState({ newUsernameErr: true, error: "you have not entered a new username!" });
        }
        else if (this.state.newUsername === this.props.oldUsername) {
            this.setState({ newPassErr: true, error: "this is your old username please enter a new name!" });
        }
        else {
            await fetch(`http://ruppinmobile.tempdomain.co.il/site09/api/Users/ChangeUsername`, {
                method: 'PUT',
                body: JSON.stringify({ UserID: this.props.userID, Username: this.state.newUsername }),
                headers: {
                    "Content-Type": "application/json;charset=utf-8"
                }
            })
                .then(res => {
                    //console.log("res=", res);
                    return res.json()
                })
                .then(
                    result => {
                        console.log("fetch GET= ", result);
                        if (result === "ok") {
                            this.props.changeUsername(this.state.newUsername)
                        }
                        else {
                            this.setState({ newUsernameErr: true })
                        }
                    },
                    error => {
                        console.log("=> err post=", error);
                        this.setState({ newUsernameErr: true })
                    }
                )
        }
    }

    render() {
        return (
            <Modal
                isVisible={this.props.usernameModalVisible}
                deviceHeight={height}
                deviceWidth={width}
            >
                <Container style={{ alignSelf: 'center', backgroundColor: 'rgb(48,48,48)' }}>
                    <Content padder contentContainerStyle={{ flex: 1, justifyContent: 'space-evenly' }}>
                        <Text note style={{ color: 'red' }}>{this.state.error}</Text>
                        <Item error={this.state.newUsernameErr} fixedLabel>
                            <Input style={{ color: 'rgb(204,204,204)' }} placeholder="New Username" onChangeText={val => this.setState({ newUsername: val })} />
                            <Icon name='close-circle' />
                        </Item>
                        <Item fixedLabel style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', borderBottomColor: 'transparent' }}>
                            <Button bordered rounded style={{
                                justifyContent: 'center',
                                borderColor: 'rgb(186, 40, 0)',
                            }} onPress={this.confirmUsername}>
                                <Text style={{ color: 'rgb(186, 40, 0)' }}>CONFIRM</Text>
                            </Button>
                            <Button bordered rounded style={{
                                justifyContent: 'center',
                                borderColor: 'rgb(186, 40, 0)',
                            }} onPress={() => this.props.hideUsernameModal()}>
                                <Text style={{ color: 'rgb(186, 40, 0)' }}>CANCEL</Text>
                            </Button>
                        </Item>
                    </Content>
                </Container>
            </Modal>
        );
    }
}

export default ChangeUsernameModal;