import React, { Component } from 'react';
import { Dimensions, Platform } from 'react-native'
import { Text, Content, Button, Container } from 'native-base'
import { observer, inject } from 'mobx-react';
import Modal from "react-native-modal";
//import ExtraDimensions from 'react-native-extra-dimensions-android';


const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
/*const height = Platform.OS === "ios"
? Dimensions.get("window").height
: ExtraDimensions.getRealWindowHeight();*/

class MatchesFilterModal extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <Modal
                isVisible={this.props.modalVisible}
                deviceHeight={height-20}
                deviceWidth={width-10}
            >
                <Container style={{width: width - 50, alignSelf: 'center', backgroundColor: 'rgb(48,48,48)' }}>
                    <Content>
                        <Text>Hello</Text>
                        <Text>Hello</Text>
                        <Text>Hello</Text>
                        <Text>Hello</Text>
                        <Text>Hello</Text>
                        <Text>Hello</Text>
                        <Text>Hello</Text>
                        <Text>Hello</Text>
                        <Text>Hello</Text>
                    </Content>
                    <Content>
                        <Button
                            style={{ backgroundColor: 'rgb(186, 40, 0)' }}
                            onPress={() => this.props.hideModal()}
                        >
                            <Text>CANCEL</Text>
                        </Button>
                        <Button
                            style={{ backgroundColor: 'rgb(186, 40, 0)' }}
                            onPress={() => { }}
                        >
                            <Text>JOIN</Text>
                        </Button>
                    </Content>
                </Container>

            </Modal>
        )
    }
}

export default inject('rootStore')(observer(MatchesFilterModal));