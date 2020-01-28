import React, { Component } from 'react';
import { Dimensions, Platform, TouchableHighlightBase, TouchableNativeFeedbackBase } from 'react-native'
import { Text, Content, Button, Container, Item, DatePicker, Picker, Label, CheckBox } from 'native-base'
import { observer, inject } from 'mobx-react';
import Modal from "react-native-modal";
import DateTimePicker from "react-native-modal-datetime-picker";
//import ExtraDimensions from 'react-native-extra-dimensions-android';


const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
/*const height = Platform.OS === "ios"
? Dimensions.get("window").height
: ExtraDimensions.getRealWindowHeight();*/

class MatchesFilterModal extends Component {
    constructor(props) {
        super(props);
        let now = new Date()

        this.state = {
            cities: [],
            fields: [],
            date: new Date(),
            dateChosen: '',
            dateCheckBox: false,
            time: `${(now.getHours() < 10 ? '0' + now.getHours() : now.getHours())}:${(now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes())}`,
            timeChosen: '',
            timeCheckBox: false,
            city: 1,
            cityChosen: undefined,
            cityCheckBox: false,
            field: 1,
            fieldChosen: undefined,
            fieldCheckBox: false,
            isDateTimePickerVisible: false
        }
    }

    componentDidMount() {
        let cities = this.props.rootStore.CitiesAndFieldsStore.Cities;
        let fields = this.props.rootStore.CitiesAndFieldsStore.Fields;
        console.log(this.props.rootStore.CitiesAndFieldsStore.Cities)
        this.setState({
            cities: cities.map(city => {
                return <Picker.Item key={city.City_ID} label={city.City_Name} value={city.City_ID} />
            }),
            fields: fields.filter(f => this.state.citySelected === f.City_ID).map(field => {
                return <Picker.Item key={field.Field_ID} label={field.Field_Name} value={field.Field_ID} />
            }),
            dateCheckBox: false,

        })
    }

    dateChange = (val) => {
        this.setState({
            date: val,
            dateChosen: this.state.dateCheckBox ? val : ''
        }, () => console.log("dateChosen while changing = " + this.state.dateChosen.toString()))
    }

    timeChange = val => {
        this.setState({
            time: `${(val.getHours() < 10 ? '0' + val.getHours() : val.getHours())}:${(val.getMinutes() < 10 ? '0' + val.getMinutes() : val.getMinutes())}`
        }, this.hideDateTimePicker())
    }

    showDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: true });
    };

    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };

    onCityChange = (val, pos) => {
        let fields = this.props.rootStore.CitiesAndFieldsStore.Fields;
        console.log(val)
        this.setState({
            city: val,
            fields: fields.filter(f => val === f.City_ID).map(field => {
                return <Picker.Item key={field.Field_ID} label={field.Field_Name} value={field.Field_ID} />
            })
        })
    }

    onFieldChange = (val, pos) => {
        this.setState({
            field: val
        }, console.log(val))
    }

    onConfirm = () => {
        let filterResult = {
            date: this.state.dateChosen,
            time: this.state.timeChosen,
            city: this.state.cityChosen,
            field: this.state.fieldChosen
        }

        this.props.sendResults(filterResult);
    }

    onChangeDateCheckBox = () => {
        console.log("dateCheckBox = " + this.state.dateCheckBox)
        this.setState({
            dateChosen: this.state.dateCheckBox && this.state.date || '',
            dateCheckBox: !this.state.dateCheckBox
        }
        , console.log("dateCheckBox = " + this.state.dateCheckBox + " dateChosen = " + this.state.dateChosen))
    }

    onChangeTimeCheckBox = () => {
        this.setState(prevState => ({
            timeCheckBox: !prevState.timeCheckBox,
            timeChosen: this.state.timeCheckBox ? this.state.time : ''
        }))
    }

    onChangeCityCheckBox = () => {
        this.setState(prevState => ({
            cityCheckBox: !prevState.cityCheckBox,
            cityChosen: prevState.cityCheckBox ? this.state.city : undefined
        }))
    }

    onChangeFieldCheckBox = () => {
        this.setState(prevState => ({
            fieldCheckBox: !prevState.fieldCheckBox,
            fieldChosen: prevState.fieldCheckBox ? this.state.field : undefined
        }))
    }

    render() {
        return (
            <Modal
                isVisible={this.props.modalVisible}
                deviceHeight={height}
                deviceWidth={width}
            >
                <Container style={{ /*width: width - 50,*/ alignSelf: 'center', backgroundColor: 'rgb(48,48,48)' }}>
                    <Content padder contentContainerStyle={{ flex: 1, justifyContent: 'space-evenly' }}>
                        <Item style={{ flex: 0.1, flexDirection: 'row', justifyContent: 'space-between', borderBottomColor: 'transparent' }}>
                            <Text style={{ fontSize: 30, fontWeight: 'bold', textAlign: 'center', color: 'rgb(204,204,204)' }}>
                                Filter
                            </Text>
                        </Item>

                        <Item style={{ borderBottomColor: 'transparent' }}>
                            <CheckBox checked={this.state.dateCheckBox} onPress={this.onChangeDateCheckBox} />
                            <Label style={{ color: 'rgb(186, 40, 0)' }}>Match date</Label>
                            <DatePicker
                                minimumDate={new Date(Date())}
                                onDateChange={this.dateChange}
                                textStyle={{ color: 'rgb(204,204,204)' }}
                                placeHolderTextStyle={{ color: 'rgb(204,204,204)' }}
                            />
                        </Item>
                        <Item style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                            <CheckBox checked={this.state.timeCheckBox} onPress={this.onChangeTimeCheckBox} />
                            <Label style={{ color: 'rgb(186, 40, 0)' }}>Match time</Label>
                            <Button bordered small style={{ justifyContent: 'center', borderColor: 'rgb(186, 40, 0)' }} onPress={this.showDateTimePicker}>
                                <Text style={{ color: 'rgb(186, 40, 0))' }}>CHOOSE TIME</Text>
                            </Button>
                            <DateTimePicker mode='time' isVisible={this.state.isDateTimePickerVisible} onCancel={this.hideDateTimePicker} onConfirm={this.timeChange} />
                            <Text style={{ color: 'rgb(204,204,204)' }}>{this.state.timePicked}</Text>
                        </Item>
                        <Item>
                            <CheckBox checked={this.state.cityCheckBox} onPress={this.onChangeCityCheckBox} />
                            <Label style={{ color: 'rgb(186, 40, 0)' }}>City</Label>
                            <Picker
                                mode='dropdown'
                                placeholder="Select city"
                                selectedValue={this.state.city}
                                onValueChange={this.onCityChange}
                                style={{ color: 'rgb(204,204,204)' }}
                            >
                                {this.state.cities}
                            </Picker>
                        </Item>
                        <Item>
                            <CheckBox checked={this.state.fieldCheckBox} onPress={this.onChangeFieldCheckBox} />
                            <Label style={{ color: 'rgb(186, 40, 0)' }}>Field</Label>
                            <Picker
                                mode='dropdown'
                                placeholder="Select city"
                                selectedValue={this.state.field}
                                onValueChange={this.onFieldChange}
                                style={{ color: 'rgb(204,204,204)' }}
                            >
                                {this.state.fields}
                            </Picker>
                        </Item>
                        <Item style={{ flex: 0.2, flexDirection: 'row', justifyContent: 'space-between', borderBottomColor: 'transparent' }}>
                            <Button
                                style={{ backgroundColor: 'rgb(186, 40, 0)' }}
                                onPress={() => this.props.hideModal()}
                            >
                                <Text>CANCEL</Text>
                            </Button>
                            <Button
                                style={{ backgroundColor: 'rgb(186, 40, 0)' }}
                                onPress={this.onConfirm}
                            >
                                <Text>CONFIRM</Text>
                            </Button>
                            <Button
                                style={{ backgroundColor: 'rgb(186, 40, 0)' }}
                                onPress={() => this.props.clearFilter()}
                            >
                                <Text>CLEAR</Text>
                            </Button>
                        </Item>
                    </Content>
                </Container>

            </Modal>
        )
    }
}

export default inject('rootStore')(observer(MatchesFilterModal));