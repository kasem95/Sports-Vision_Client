import React from 'react';
import { Container, Content, Button, Text } from 'native-base';
import { Image,Dimensions } from 'react-native';
import { observer, inject } from 'mobx-react';

const {height, width} = Dimensions.get('window');

class Home extends React.Component {

    static navigationOptions = {
        //To hide the ActionBar/NavigationBar
        header: null,
    };

    goToLoginPage = () => {
        this.props.navigation.navigate("LoginPage")
    }

    goToRegisterPage = () => {
        this.props.rootStore.CameraStore.changeRegisterPhotoURI("")
        this.props.navigation.navigate("SignUpPage")
    }

    render() {
        return (
            <Container>
                <Content contentContainerStyle={{alignSelf: 'center'}}>
                    <Image
                        style={{
                            paddingVertical: 30,
                            width: 160,
                            height: 250,
                            marginTop: 25
                        }}
                        source={require('../assets/Sports-Vision.png')} />
                </Content>

                <Content contentContainerStyle={{ alignSelf: 'center' }}>
                    <Button rounded
                        onPress={this.goToLoginPage}
                        style={{ justifyContent: 'center', width: height-300, backgroundColor: 'rgb(186, 40, 0)' }}
                    >
                        <Text style={{ color: 'rgb(0, 0, 32)', fontWeight: 'bold', fontSize: 18 }}>Existing account</Text>
                    </Button>

                    <Button rounded
                        style={{ justifyContent: 'center', width: height-300, backgroundColor: 'rgb(186, 40, 0)', marginTop: 20 }}
                        onPress={this.goToRegisterPage}
                    >
                        <Text style={{ color: 'rgb(0, 0, 32)', fontWeight: 'bold', fontSize: 18 }}>Create a new account</Text>
                    </Button>
                </Content>
            </Container>
        )
    }
}

export default inject('rootStore')(observer(Home));