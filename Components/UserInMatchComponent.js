import React from 'react';
import { Card, CardItem, Left, Body, Button, Right, Text, Thumbnail, Item, Content, Toast } from 'native-base';
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
                    btn: <Text style={{ color: 'rgb(204,204,204)' }}>ADMIN</Text>
                })
            }
            else {
                if (this.props.userInMatch === 0) {
                    this.setState({
                        btn: <Button rounded success onPress={this.kickPlayer}>
                            <Text>KICK</Text>
                        </Button>
                    })
                } else if (this.props.userInMatch === 1) {
                    this.setState({
                        btn: <Button rounded success onPress={this.kickPlayer}>
                            <Text>KICK</Text>
                        </Button>
                    })
                } else if (this.props.userInMatch === 2) {
                    this.setState({
                        btn: <Content>
                            <Button rounded success onPress={this.accept}>
                                <Text>ACCEPT</Text>
                            </Button>
                            <Button rounded success onPress={this.cancelRequest}>
                                <Text>CANCEL</Text>
                            </Button>
                        </Content>
                    })
                }
                else if (this.props.userInMatch === 3) {
                    this.setState({
                        btn: <Content>
                            <Text style={{ color: 'rgb(204,204,204)' }}>PENDING...</Text>
                            <Button rounded success onPress={this.cancelInvite}>
                                <Text>CANCEL</Text>
                            </Button>
                        </Content>
                    })
                }
            }
        }
        else {
            if (this.props.MatchAdmin === this.props.userDetails.User_ID) {
                this.setState({
                    btn: <Text style={{ color: 'rgb(204,204,204)' }}>ADMIN</Text>
                })
            }
        }
    }

    cancelInvite = async () => {
        let details = {
            MatchID: this.props.MatchDetails.Match_ID,
            UserID: this.props.userDetails.User_ID,
        }
        await fetch(`http://ruppinmobile.tempdomain.co.il/site09/api/Matches/CancelInvite`, {
            method: 'DELETE',
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
                    if (result === "Done!") {
                        console.log("im in done if!!")
                        await this.props.rootStore.MatchStore.insertLastModal(details.MatchID)
                        await this.props.refreshUsers()
                    }
                    else {
                        Toast.show({ text: result, buttonText: 'Okay', type: 'danger' })
                    }
                },
                error => {
                    console.log("=> err post=", error);
                    Toast.show({ text: error, buttonText: 'Okay', type: "danger" })
                }
            )
    }

    cancelRequest = async () => {
        let details = {
            MatchID: this.props.MatchDetails.Match_ID,
            UserID: this.props.userDetails.User_ID,
        }
        await fetch(`http://ruppinmobile.tempdomain.co.il/site09/api/Matches/CancelRequest`, {
            method: 'DELETE',
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
                    if (result === "Done!") {
                        console.log("im in done if!!")
                        await this.props.rootStore.MatchStore.insertLastModal(details.MatchID)
                        await this.props.refreshUsers()
                    }
                    else {
                        Toast.show({ text: result, buttonText: 'Okay', type: 'danger' })
                    }
                },
                error => {
                    console.log("=> err post=", error);
                    Toast.show({ text: error, buttonText: 'Okay', type: "danger" })
                }
            )
    }

    accept = async () => {
        let date = new Date(this.props.MatchDetails.Match_Date)
        let details = {
            matchID: this.props.MatchDetails.Match_ID,
            userID: this.props.userDetails.User_ID,
            matchDate: date.getMonth() + 1
                + '-' + date.getDate() + '-' +
                date.getFullYear(),
            matchTime: this.props.MatchDetails.Match_Time.slice(0, 5),
            playTime: this.props.MatchDetails.Play_Time,
            cityID: this.props.MatchDetails.City_ID,
            fieldID: this.props.MatchDetails.Field_ID,
            maxPlayer: this.props.MatchDetails.Max_Players,
            IsInvite: false
        }
        await fetch(`http://ruppinmobile.tempdomain.co.il/site09/api/Matches/acceptRequestJoinMatch`, {
            method: 'PUT',
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
                    if (result === "Done!") {
                        console.log("im in Done if!!")
                        await this.props.rootStore.MatchStore.insertLastModal(details.matchID)
                        await this.props.refreshUsers()
                    }
                    else {
                        Toast.show({ text: result, buttonText: 'Okay', type: 'danger' })
                    }
                },
                error => {
                    console.log("=> err post=", error);
                    Toast.show({ text: error, buttonText: 'Okay', type: "danger" })
                }
            )
    }

    kickPlayer = async () => {
        let date = new Date(this.props.MatchDetails.Match_Date)
        let details = {
            MatchID: this.props.MatchDetails.Match_ID,
            MatchDate: date.getMonth() + 1
                + '-' + date.getDate() + '-' +
                date.getFullYear(),
            AdminID: this.props.MatchDetails.Admin_ID,
            UserID: this.props.userDetails.User_ID,
            PlayersJoined: this.props.MatchDetails.Players_Joined
        }
        console.log('details' + JSON.stringify(details))
        await fetch(`http://ruppinmobile.tempdomain.co.il/site09/api/Matches/ExitMatch`, {
            method: 'PUT',
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
                    if (result === "Done!") {
                        console.log("im in done if!!")
                        await this.props.rootStore.MatchStore.insertLastModal(details.MatchID)
                        await this.props.refreshUsers()
                    }
                    else {
                        Toast.show({ text: result, buttonText: 'Okay', type: 'danger' })
                    }
                },
                error => {
                    console.log("=> err post=", error);
                    Toast.show({ text: error, buttonText: 'Okay', type: "danger" })
                }
            )
    }

    render() {
        return (
            <Card style={{ backgroundColor: 'transparent', borderColor: 'rgb(186, 40, 0)' }}>
                <CardItem header style={{ backgroundColor: 'rgb(48,48,48)' }}>
                    <Left>
                        <Thumbnail small source={this.props.userPIC === "" ? require('../assets/profilepicture.png') : { uri: this.props.userPIC }} />
                        <Body>
                            <Text style={{ color: 'rgb(204,204,204)' }}>{this.props.userDetails.Username}</Text>
                            <Text note style={{ fontSize: 9 }}>{this, this.props.userDetails.Email}</Text>
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