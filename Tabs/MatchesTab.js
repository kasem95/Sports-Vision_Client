import React from 'react'
import { Container, Content, Header, Item, Icon, Input } from 'native-base'
import {
    TouchableOpacity,
    Image,
    TouchableHighlight,
    ScrollView,
    RefreshControl
} from 'react-native';
import MatchesFilterModal from '../Modals/MatchesFilterModal';
import MatchComponent from '../Components/MatchComponent'
import { inject, observer } from 'mobx-react'

class MatchesTab extends React.Component {
    _isMounted = false
    constructor(props) {
        super(props)

        this.state = {
            Matches: [],
            FilterdMatchesList: [],
            modalVisible: false,
            searchInput: "",
            cityToFilter: "",
            fieldToFilter: "",
            dateToFilter: undefined,
            timeToFilter: undefined
        }
    }

    async componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {
            await this.setState({
                Matches: this.props.Matches,
                FilterdMatchesList: this.props.MatchesList
            })
        }
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    setModalVisible = () => {
        this.setState({
            modalVisible: true
        })
    }

    hideModal = () => {
        this.setState({
            modalVisible: false
        })
    }

    search = () => {
        console.log("search matches = " + JSON.stringify(this.state.FilterdMatchesList))
        let list = []
        list = this.state.FilterdMatchesList.length !== 0 ?
            this.state.FilterdMatchesList.filter(match => this.state.searchInput === "" ? true : match.Match_Name.toLowerCase().indexOf(this.state.searchInput.toLowerCase()) !== -1) : []
        this.setState({
            Matches: list.length !== 0 && list.map(match => {
                let adminName = this.props.rootStore.UserStore.users.filter(user => user.User_ID === match.Admin_ID)[0].Username
                let matchDate = new Date(match.Match_Date)
                console.log('anaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' + matchDate)
                return (
                    < MatchComponent
                        key={match.Match_ID}
                        MatchDetails={match}
                        adminName={adminName}
                        MatchDate={matchDate}
                        refreshMatches={() => this.refresh()}
                    />
                )
            })
        })
    }

    searchInputChange = val => {
        this.setState({
            searchInput: val
        })
    }

    refresh = async () => {
        console.log("MatchesTab - Refreshing")
        await this.props.refreshMatches()
        await this.setState({
            Matches: this.props.Matches,
            searchInput: ""
        })
    }

    filterMatches = (results) => {

        console.log("filter result = " + results.time)
        console.log("field selected = " + this.props.MatchesList[0].Match_Time.slice(0, 5))
        this.hideModal()
        let list = []
        let filteredDate = results.date !== undefined && results.date !== "" ? results.date.getFullYear() + " " + results.date.getMonth() + " " + results.date.getDate() : []
        list = this.props.MatchesList !== 0 ?
            this.props.MatchesList.filter(match => ((results.date !== undefined && filteredDate === new Date(match.Match_Date).getFullYear() + " " + new Date(match.Match_Date).getMonth() + " " + new Date(match.Match_Date).getDate())
                || (results.date === undefined && true)) && ((results.time !== undefined && results.time === match.Match_Time.slice(0, 5)) || (results.time === undefined && true))
                && ((results.city !== undefined && results.city === match.City_ID) || (results.city === undefined && true))
                && ((results.field !== undefined && results.field === match.Field_ID) || (results.field === undefined && true))) : []


        let listWithSearch = list.length !== 0 ?
            this.searchInput !== "" ? list.filter(match => this.state.searchInput === "" ? true : match.Match_Name.toLowerCase().indexOf(this.state.searchInput.toLowerCase()) !== -1) : list : []

        //console.log("list = " + listWithSearch[0].City_ID)
        this.setState({
            Matches: listWithSearch.length !== 0 && listWithSearch.map(match => {
                let adminName = this.props.rootStore.UserStore.users.filter(user => user.User_ID === match.Admin_ID)[0].Username
                let matchDate = new Date(match.Match_Date)
                console.log('anaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' + matchDate)
                return (
                    < MatchComponent
                        key={match.Match_ID}
                        MatchDetails={match}
                        adminName={adminName}
                        MatchDate={matchDate}
                        refreshMatches={() => this.refresh()}
                    />
                )
            }),
            FilterdMatchesList: list
        })
    }

    clearFilter = () => {
        let list = this.state.searchInput !== "" ? this.props.MatchesList.filter(match => this.state.searchInput === "" ? true : match.Match_Name.toLowerCase().indexOf(this.state.searchInput.toLowerCase()) !== -1) : this.props.MatchesList

        this.setState({
            Matches: list.length !== 0 && list.map(match => {
                let adminName = this.props.rootStore.UserStore.users.filter(user => user.User_ID === match.Admin_ID)[0].Username
                let matchDate = new Date(match.Match_Date)
                console.log('anaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' + matchDate)
                return (
                    < MatchComponent
                        key={match.Match_ID}
                        MatchDetails={match}
                        adminName={adminName}
                        MatchDate={matchDate}
                        refreshMatches={() => this.refresh()}
                    />
                )
            }),
            FilterdMatchesList: list
        })
    }

    render() {
        return (
            <Container style={{ backgroundColor: 'rgb(48,48,48)' }}>
                <Header searchBar rounded style={{ backgroundColor: 'rgb(186, 40, 0)' }}>
                    <Item style={{ backgroundColor: 'rgb(48,48,48)' }}>
                        <TouchableOpacity onPress={this.search} >
                            <Icon name="ios-search" style={{ color: 'rgb(186, 40, 0)' }} />
                        </TouchableOpacity>
                        <Input style={{ color: 'rgb(204,204,204)' }} placeholder="Search" onChangeText={this.searchInputChange} returnKeyType='search' onSubmitEditing={this.search} />
                        <MatchesFilterModal modalVisible={this.state.modalVisible} hideModal={this.hideModal} sendResults={this.filterMatches} clearFilter={this.clearFilter} />
                        <TouchableHighlight onPress={this.setModalVisible} style={{ backgroundColor: 'rgb(48,48,48)' }}>
                            <Image style={{ height: 30, width: 30 }} source={require('../assets/filter.png')} />
                        </TouchableHighlight>
                    </Item>
                </Header>
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={this.props.refreshing} onRefresh={() => this.refresh()} colors={['rgb(186, 40, 0)']} />
                    }
                >
                    <Content padder>
                        {this.state.Matches === undefined || this.state.Matches.length === 0 ? this.props.Matches : this.state.Matches}
                    </Content>
                </ScrollView>
            </Container>
        )
    }
}

export default inject('rootStore')(observer(MatchesTab));