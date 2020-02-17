import React, { Component } from 'react';
import { Dimensions, Platform, TouchableHighlightBase, TouchableNativeFeedbackBase } from 'react-native'
import { Text, Content, Button, Container, Item, Picker, Label, CheckBox, Toast, Left, Right } from 'native-base'
import { observer, inject } from 'mobx-react';
import Modal from "react-native-modal";
import DateTimePicker from '@react-native-community/datetimepicker';
//import ExtraDimensions from 'react-native-extra-dimensions-android';


const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
/*const height = Platform.OS === "ios"
? Dimensions.get("window").height
: ExtraDimensions.getRealWindowHeight();*/

class MatchesFilterModal extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);

        this.state = {
            cities: [],
            fields: [],
            date: new Date(),
            dateChosen: undefined,
            dateCheckBox: false,
            time: new Date(),
            timeChosen: undefined,
            timeCheckBox: false,
            city: 1,
            cityChosen: undefined,
            cityCheckBox: false,
            field: 1,
            fieldChosen: undefined,
            fieldCheckBox: false,
            isDateTimePickerVisible: false,
            isDateTimePickerVisibleForDate: false
        }
    }

    componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {
            let cities = this.props.rootStore.CitiesAndFieldsStore.Cities;
            let fields = this.props.rootStore.CitiesAndFieldsStore.Fields;
            console.log(this.props.rootStore.CitiesAndFieldsStore.Cities)
            this.setState({
                cities: cities.map((city, key) => {
                    return <Picker.Item key={key} label={city.City_Name} value={city.City_ID} />
                }),
                fields: fields.filter(f => this.state.city === f.City_ID).map((field, key) => {
                    return <Picker.Item key={key} label={field.Field_Name} value={field.Field_ID} />
                }),

            })
        }
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    dateChange = (event, val) => {
        this.setState({
            date: val,
            dateChosen: this.state.dateCheckBox ? val : undefined,
            isDateTimePickerVisibleForDate: false
        }, () => console.log("dateChosen while changing = " + this.state.dateChosen.toString()))
    }

    timeChange = (event, val) => {
        console.log("time type = " + val)
        if (val !== "" && val !== undefined) {
            let now = new Date()
            if ((val.getHours() < now.getHours() || (val.getHours() === now.getHours() && val.getMinutes() < now.getMinutes())) &&
                this.state.date.getFullYear() === now.getFullYear() && this.state.date.getMonth() === now.getMonth() &&
                this.state.date.getDate() === now.getDate()) {
                this.setState({ isDateTimePickerVisible: false }, () =>
                    Toast.show({ text: 'the time you chose has passed', buttonText: 'Okay', type: "danger" })
                )

            }
            else {
                this.setState({
                    time: val,
                    timeChosen: this.state.timeCheckBox ? ((val.getHours() < 10 && '0' + val.getHours()) || (val.getHours()))
                        + ':' + ((val.getMinutes() < 10 && '0' + val.getMinutes()) || (val.getMinutes())) : undefined,
                    isDateTimePickerVisible: false//`${(val.getHours() < 10 ? '0' + val.getHours() : val.getHours())}:${(val.getMinutes() < 10 ? '0' + val.getMinutes() : val.getMinutes())}`
                }, () => {
                    console.log(this.state.time)
                })
            }
        } else {
            this.setState({
                isDateTimePickerVisible: false
            })
        }
    }

    onCityChange = (val, pos) => {
        let fields = this.props.rootStore.CitiesAndFieldsStore.Fields;
        console.log("cityChosen = " + val)
        this.setState({
            city: val,
            fields: fields.filter(f => val === f.City_ID).map(field => {
                return <Picker.Item key={field.Field_ID} label={field.Field_Name} value={field.Field_ID} />
            }),
            cityChosen: this.state.cityCheckBox ? val : undefined,
            field: fields.filter(f => val === f.City_ID)[0].Field_ID,
            fieldChosen: this.state.fieldCheckBox ? fields.filter(f => val === f.City_ID)[0].Field_ID : undefined
        }, () => console.log("fieldchosen when change city = " + this.state.fieldChosen))
    }

    onFieldChange = (val, pos) => {
        this.setState({
            field: val,
            fieldChosen: this.state.fieldCheckBox ? val : undefined
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
        this.setState(prevState => ({
            dateCheckBox: !prevState.dateCheckBox,
            dateChosen: !prevState.dateCheckBox && this.state.date || undefined,
        })
            , () => console.log("dateCheckBox = " + this.state.dateCheckBox + " dateChosen = " + this.state.dateChosen))
    }

    onChangeTimeCheckBox = () => {
        this.setState(prevState => ({
            timeCheckBox: !prevState.timeCheckBox,
            timeChosen: !prevState.timeCheckBox ? ((this.state.time.getHours() < 10 && '0' + this.state.time.getHours()) || (this.state.time.getHours()))
                + ':' + ((this.state.time.getMinutes() < 10 && '0' + this.state.time.getMinutes()) || (this.state.time.getMinutes())) : undefined
        })
            , () => console.log("timeCheckBox = " + this.state.timeCheckBox + " timeChosen = " + this.state.timeChosen))
    }

    onChangeCityCheckBox = () => {
        this.setState(prevState => ({
            cityCheckBox: !prevState.cityCheckBox,
            cityChosen: !prevState.cityCheckBox ? this.state.city : undefined
        })
            , () => console.log("cityCheckBox = " + this.state.cityCheckBox + " cityChosen = " + this.state.cityChosen))
    }

    onChangeFieldCheckBox = () => {
        this.setState(prevState => ({
            fieldCheckBox: !prevState.fieldCheckBox,
            fieldChosen: !prevState.fieldCheckBox ? this.state.field : undefined
        })
            , () => console.log("fieldCheckBox = " + this.state.fieldCheckBox + " fieldChosen = " + this.state.fieldChosen))
    }

    render() {
        return (
            <Modal
                isVisible={this.props.modalVisible}
                deviceHeight={height}
                deviceWidth={width}
            >
                <Container style={{ backgroundColor: 'rgb(48,48,48)' }}>
                    <Content padder contentContainerStyle={{ flex: 1, justifyContent: 'space-evenly' }}>
                        <Item style={{ flex: 0.1, flexDirection: 'row', justifyContent: 'space-between', borderBottomColor: 'transparent' }}>
                            <Text style={{ fontSize: 30, fontWeight: 'bold', textAlign: 'center', color: 'rgb(204,204,204)' }}>
                                Filter
                            </Text>
                        </Item>

                        <Item style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <CheckBox checked={this.state.dateCheckBox} onPress={this.onChangeDateCheckBox} />
                            <Button bordered small style={{ justifyContent: 'center', borderColor: 'rgb(186, 40, 0)' }} onPress={() => this.setState({ isDateTimePickerVisibleForDate: true })}>
                                <Text style={{ color: 'rgb(186, 40, 0))' }}>CHOOSE DATE</Text>
                            </Button>
                            {this.state.isDateTimePickerVisibleForDate && <DateTimePicker
                                minimumDate={new Date(Date())}
                                onChange={this.dateChange}
                                value={this.state.date}
                            />}
                            <Text style={{ color: 'rgb(204,204,204)' }}>{this.state.date.getDate() + '-' + (this.state.date.getMonth() + 1) + '-' + this.state.date.getFullYear()}</Text>
                        </Item>
                        <Item style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <CheckBox checked={this.state.timeCheckBox} onPress={this.onChangeTimeCheckBox} />
                            <Button bordered small style={{ justifyContent: 'center', borderColor: 'rgb(186, 40, 0)' }} onPress={() => this.setState({ isDateTimePickerVisible: true })}>
                                <Text style={{ color: 'rgb(186, 40, 0))' }}>CHOOSE TIME</Text>
                            </Button>
                            {this.state.isDateTimePickerVisible && <DateTimePicker value={this.state.time} is24Hour={true} mode='time' onChange={this.timeChange} />}
                            <Text style={{ color: 'rgb(204,204,204)' }}>{((this.state.time.getHours() < 10 && '0' + this.state.time.getHours()) || (this.state.time.getHours()))
                                + ':' + ((this.state.time.getMinutes() < 10 && '0' + this.state.time.getMinutes()) || (this.state.time.getMinutes()))}</Text>
                        </Item>
                        <Item style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <CheckBox checked={this.state.cityCheckBox} onPress={this.onChangeCityCheckBox} />
                            <Label style={{ color: 'rgb(186, 40, 0)' }}>City</Label>
                            <Right style={{ flex: 0.8, flexDirection: 'row', justifyContent: 'center' }}>
                                <Picker
                                    mode='dropdown'
                                    placeholder="Select city"
                                    selectedValue={this.state.city}
                                    onValueChange={this.onCityChange}
                                    style={{ color: 'rgb(204,204,204)' }}
                                >
                                    {this.state.cities}
                                </Picker>
                            </Right>
                        </Item>
                        <Item style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <CheckBox checked={this.state.fieldCheckBox} onPress={this.onChangeFieldCheckBox} />
                            <Label style={{ color: 'rgb(186, 40, 0)' }}>Field</Label>
                            <Right style={{ flex: 0.8, flexDirection: 'row', justifyContent: 'center' }}>
                                <Picker
                                    mode='dropdown'
                                    placeholder="Select field"
                                    selectedValue={this.state.field}
                                    onValueChange={this.onFieldChange}
                                    style={{ color: 'rgb(204,204,204)' }}
                                >
                                    {this.state.fields}
                                </Picker>
                            </Right>
                        </Item>
                        <Item style={{ flex: 0.2, flexDirection: 'row', justifyContent: 'space-between', borderBottomColor: 'transparent' }}>
                            <Button
                                style={{ backgroundColor: 'rgb(186, 40, 0)' }}
                                onPress={() => this.props.hideModal()}
                            >
                                <Text style={{ color: 'rgb(48,48,48)' }}>CANCEL</Text>
                            </Button>
                            <Button
                                style={{ backgroundColor: 'rgb(186, 40, 0)' }}
                                onPress={this.onConfirm}
                            >
                                <Text style={{ color: 'rgb(48,48,48)' }}>CONFIRM</Text>
                            </Button>
                            <Button
                                style={{ backgroundColor: 'rgb(186, 40, 0)' }}
                                onPress={() => this.props.clearFilter()}
                            >
                                <Text style={{ color: 'rgb(48,48,48)' }}>CLEAR</Text>
                            </Button>
                        </Item>
                    </Content>
                </Container>

            </Modal>
        )
    }
}

export default inject('rootStore')(observer(MatchesFilterModal));