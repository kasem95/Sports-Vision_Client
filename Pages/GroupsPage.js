import React from 'react'
import { Container, Content } from 'native-base'


class GroupsPage extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            GroupsList = []
        }
    }

    componentDidMount(){

    }

    render(){
        return(
            <Container>
                <Content padder>
                    {this.state.GroupsList}
                </Content>
            </Container>
        )
    }
}