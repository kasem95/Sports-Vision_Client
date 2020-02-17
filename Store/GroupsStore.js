import React from 'react'
import { decorate, observable, action, configure, computed } from 'mobx';
configure({ enforceActions: 'observed' });

class GroupsStore extends React.Component{
    groups = []
    UsersInGroups = [];
    UsersInvitedToGroups = [];
    lastGroupModal = undefined;
    lastFriendsInviteModal = undefined
    groupDetailsForMatchCreating = undefined
    usersInGroupForMatchCreating = []

    insertGroupDetailsForMatchCreating = val => {
        this.groupDetailsForMatchCreating = val;
    }

    insertUsersInGroup = val => {
        this.usersInGroupForMatchCreating = val
    }

    insertLastModal = val => {
        this.lastGroupModal = val;
    }

    saveLastFriendsInviteModal = val => {
        this.lastFriendsInviteModal = val;
    }

    getGroups = async() =>{
        await fetch(`http://ruppinmobile.tempdomain.co.il/site09/api/Groups/getGroups`, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json;',
            })
        })
            .then(res => {
                //console.log("res=", res);
                return res.json();
            })
            .then(
                result => {
                    console.log("fetch GET Groups= ", result);
                    console.log(this.groups)
                    if (Array.isArray(result)) {
                        this.groups = result;
                    }else{
                        this.groups = []
                    }
                },
                error => {
                    console.log("=> err post=", error);
                }
            );
    }
    getUsersInGroups = () => {
        fetch(`http://ruppinmobile.tempdomain.co.il/site09/api/Groups/getUsersInGroupTable`, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json;',
            })
        })
            .then(res => {
                //console.log("res=", res);
                return res.json();
            })
            .then(
                result => {
                    console.log("fetch GET usersInGroups= ", result);
                    if (Array.isArray(result)) {
                        this.UsersInGroups = result
                    }
                    else {
                        this.UsersInGroups = []
                    }
                },
                error => {
                    console.log("=> err post=", error);
                }
            );
    }

    getUsersInvitedToGroups = () => {
        fetch(`http://ruppinmobile.tempdomain.co.il/site09/api/Groups/getUsersInvitedToGroupTable`, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json;',
            })
        })
            .then(res => {
                //console.log("res=", res);
                return res.json();
            })
            .then(
                result => {
                    console.log("fetch GET UsersInvitedToGroups= ", result);
                    if (Array.isArray(result)) {
                        this.UsersInvitedToGroups = result
                    }else{
                        this.UsersInvitedToGroups = []
                    }
                },
                error => {
                    console.log("=> err post=", error);
                }
            );
    }
}
decorate(GroupsStore, {
    groups: observable,
    getGroups: action,
    UsersInGroups: observable,
    getUsersInGroups: action,
    UsersInvitedToGroups: observable,
    getUsersInvitedToGroups: action,
    groupDetailsForMatchCreating: observable,
    lastFriendsInviteModal: observable,
    saveLastFriendsInviteModal: action,
    insertLastModal: action,
    usersInGroupForMatchCreating: observable,
    insertGroupDetailsForMatchCreating: action,
    insertUsersInGroup: action
});

export default new GroupsStore();