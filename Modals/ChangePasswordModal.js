import React from 'react';
import { Text, Content, Button, Container, Item, Icon, Input, Thumbnail, Title } from 'native-base'
import Modal from "react-native-modal";
import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

class ChangePasswordModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            realOldPass: this.props.realOldPass,
            oldPass: "",
            newPass: "",
            oldPassErr: false,
            newPassErr: false,
            error: ""
        }

    }

    componentDidMount() {
        console.log("real old pass = " + this.state.realOldPass)

        this.setState({
            realOldPass: this.props.realOldPass,
            oldPass: undefined,
            newPass: "",
            oldPassErr: false,
            newPassErr: false,
            error: ""
        })
    }

    confirmPass = async () => {
        if (this.state.newPass === "" || this.state.newPass === undefined) {
            this.setState({ newPassErr: true, error: "you have not entered a new password!" });
        }
        else if(this.state.newPass === this.state.oldPass){
            this.setState({ newPassErr: true, error: "this is your old password please enter a new one!" });
        }
        else {
            console.log("new pass = " + this.state.newPass + ", real old pass = " + this.props.realOldPass)
            if (this.state.oldPass === this.props.realOldPass) {
                console.log("new pass = " + this.state.newPass + ", old pass = " + this.state.oldPass)
                await fetch(`http://ruppinmobile.tempdomain.co.il/site09/api/Users/ChangePassword`, {
                    method: 'PUT',
                    body: JSON.stringify({ UserID: this.props.userID, Password: this.state.newPass }),
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
                                this.props.changePass(this.state.newPass)
                            }
                            else {
                                this.setState({ newPassErr: true })
                            }
                        },
                        error => {
                            console.log("=> err post=", error);
                            this.setState({ newPassErr: true })
                        }
                    )
            }
            else {
                this.setState({ oldPassErr: true })
            }
        }
    }

    render() {
        return (
            <Modal
                isVisible={this.props.passModalVisible}
                deviceHeight={height}
                deviceWidth={width}
            >
                <Container style={{ alignSelf: 'center', backgroundColor: 'rgb(48,48,48)' }}>
                    <Content padder contentContainerStyle={{ flex: 1, justifyContent: 'space-evenly' }}>
                        <Text note style={{color: 'red'}}>{this.state.error}</Text>
                        {this.props.realOldPass !== "" && this.props.realOldPass !== undefined && <Item fixedLabel error={this.state.oldPassErr}>
                            <Input on style={{ color: 'rgb(204,204,204)' }} placeholder="Old Password" secureTextEntry={true} onChangeText={val => this.setState({ oldPass: val })} />
                            <Icon name='close-circle' />
                        </Item>}
                        <Item fixedLabel style={{ flex: 0.2, flexDirection: 'column', justifyContent: 'space-between', borderBottomColor: 'transparent' }}>
                            <Item error={this.state.newPassErr}>
                                <Input style={{ color: 'rgb(204,204,204)' }} placeholder="New Password" secureTextEntry={true} onChangeText={val => this.setState({ newPass: val })} />
                                <Icon name='close-circle' />
                            </Item>
                            <Item style={{ borderBottomColor: 'transparent' }}>
                                <Text note style={{ color: 'gray' }}>*Password must be at 8-12 characters and at least 1 number, 1 small letter and 1 capital letter!</Text>
                            </Item>
                        </Item>
                        <Item fixedLabel style={{ flex: 0.8, flexDirection: 'row', justifyContent: 'space-between', borderBottomColor: 'transparent' }}>
                            <Button bordered rounded style={{
                                justifyContent: 'center',
                                borderColor: 'rgb(186, 40, 0)',
                            }} onPress={this.confirmPass}>
                                <Text style={{ color: 'rgb(186, 40, 0)' }}>CONFIRM</Text>
                            </Button>
                            <Button bordered rounded style={{
                                justifyContent: 'center',
                                borderColor: 'rgb(186, 40, 0)',
                            }} onPress={() => this.props.hidePassModal()}>
                                <Text style={{ color: 'rgb(186, 40, 0)' }}>CANCEL</Text>
                            </Button>
                        </Item>
                    </Content>
                </Container>
            </Modal>
        );
    }
}

export default ChangePasswordModal;