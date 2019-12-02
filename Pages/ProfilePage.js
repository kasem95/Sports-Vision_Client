import React from 'react';
import { Container, Text, Header, Body, Title, Item, StyleProvider } from 'native-base';
import { Image, TouchableOpacity, AsyncStorage } from 'react-native';
import { observer, inject } from 'mobx-react';
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';




class ProfilePage extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            title: 'PROFILE',
            headerRight: <TouchableOpacity onPress={() => params.logout()}><Text style={{ fontSize: 15, fontWeight: 'bold', marginRight: 10 }}>logout</Text></TouchableOpacity>
        };
    };

    constructor(props) {
        super(props)

        const { user } = this.props.rootStore.UserStore

        this.state = {
            user: user,
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({ logout: this.logout })
        console.log(this.props.rootStore.UserStore.user.imageURL)
    }

    logout = async () => {
        await AsyncStorage.clear();
        if(this.props.rootStore.UserStore.faceORGLogin == 1)
        {
            this.props.rootStore.UserStore.setFaceORGLogin()
        }
        
        this.props.navigation.navigate('Auth');
    }


    render() {
        return (
            <StyleProvider style={getTheme(material)}>
                <Container>
                    <Item style={{ backgroundColor: 'rgb(186, 40, 0)', justifyContent: 'center' }}>
                        <Image
                            style={{
                                paddingVertical: 30,
                                width: 150,
                                height: 150,
                                borderRadius: 75,
                            }}
                            source={this.props.rootStore.UserStore.faceORGLogin == 1 ? {uri: this.state.user.imageURL} : {uri: `http://ruppinmobile.tempdomain.co.il/site09/uploadFiles/${this.state.user.imageURL}`}} />
                    </Item>
                    <Item style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={{fontSize: 30, fontWeight: 'bold'}}>
                            {this.state.user.username}
                        </Text>
                    </Item>
                </Container>
            </StyleProvider>
        );
    }

}

export default inject("rootStore")(observer(ProfilePage))