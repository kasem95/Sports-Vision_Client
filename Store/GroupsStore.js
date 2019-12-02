import React from 'react'
import { decorate, observable, action, configure, computed } from 'mobx';
configure({ enforceActions: 'observed' });

class GroupsStore extends React.Component{
    groupsList = []


    getGroupsList = async() =>{

    }
}