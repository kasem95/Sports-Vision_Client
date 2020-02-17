import React from 'react'
import { Container, Content, Header, Item, Icon, Input } from 'native-base'
import {
    TouchableOpacity,
    Image,
    TouchableHighlight,
    ScrollView,
    RefreshControl
} from 'react-native';
import GroupComponent from '../Components/GroupComponent'
import { inject, observer } from 'mobx-react'

class GroupsTab extends React.Component {
    _isMounted = false
    constructor(props) {
        super(props)

        this.state = {
            Groups: [],
            GroupsList: [],
            searchInput: "",
        }
    }

    async componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {
            await this.setState({
                Groups: this.props.Groups,
                GroupsList: this.props.GroupsList
            })
        }
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    search = () => {
        let list = []
        list = this.state.GroupsList.length !== 0 ?
            this.state.GroupsList.filter(group => this.state.searchInput === "" ? true : group.Group_Name.toLowerCase().indexOf(this.state.searchInput.toLowerCase()) !== -1) : []
        this.setState({
            Groups: list.length !== 0 && list.map(group => {
                let adminName = this.props.rootStore.UserStore.users.filter(user => user.User_ID === group.Admin_ID)[0].Username
                return (
                    < GroupComponent
                        key={group.Group_ID}
                        GroupDetails={group}
                        adminName={adminName}
                        refreshGroups={() => this.refresh()}
                        tab={this.props.GroupTab}
                        nav={this.props.nav}
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
        console.log("GroupsTab - Refreshing")
        await this.props.refreshGroups()
        await this.setState({
            Groups: this.props.Groups,
            searchInput: ""
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
                    </Item>
                </Header>
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={this.props.refreshing} onRefresh={() => this.refresh()} colors={['rgb(186, 40, 0)']} />
                    }
                >
                    <Content padder>
                        {this.state.Groups === undefined || this.state.Groups.length === 0 ? this.props.Groups : this.state.Groups}
                    </Content>
                </ScrollView>
            </Container>
        )
    }
}

export default inject('rootStore')(observer(GroupsTab));