import React from 'react'
import { decorate, observable, action, configure } from 'mobx';
configure({ enforceActions: 'observed' });


class MatchStore extends React.Component {
    ActiveMatches = [];
    UsersInMatches = [];
    UsersInvitedToMatches = [];
    lastMatchModal = undefined;
    lastFriendsInviteModal = undefined
    createMatchWithGroup = false

    changeCreateMatchWithGroup = val => {
        this.createMatchWithGroup = val;
    }

    insertLastModal = val => {
        this.lastMatchModal = val;
    }

    saveLastFriendsInviteModal = val => {
        this.lastFriendsInviteModal = val;
    }

    getActiveMatches = async () => {
        await fetch(`http://ruppinmobile.tempdomain.co.il/site09/api/Matches/getActiveMatches`, {
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
                    console.log("fetch GET activeMtches= ", result);
                    console.log(this.ActiveMatches)
                    if (Array.isArray(result)) {
                        this.ActiveMatches = result;
                    }else{
                        this.ActiveMatches = []
                    }
                },
                error => {
                    console.log("=> err post=", error);
                }
            );
    }

    getUsersInMatches = () => {
        fetch(`http://ruppinmobile.tempdomain.co.il/site09/api/Matches/getUsersInMatchTable`, {
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
                    console.log("fetch GET usersInMatches= ", result);
                    if (Array.isArray(result)) {
                        this.UsersInMatches = result
                    }
                    else {
                        this.UsersInMatches = []
                    }
                },
                error => {
                    console.log("=> err post=", error);
                }
            );
    }

    getUsersInvitedToMatches = () => {
        fetch(`http://ruppinmobile.tempdomain.co.il/site09/api/Matches/getUsersInvitedToMatchTable`, {
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
                    console.log("fetch GET UsersInvitedToMatches= ", result);
                    if (Array.isArray(result)) {
                        this.UsersInvitedToMatches = result
                    }else{
                        this.UsersInvitedToMatches = []
                    }
                },
                error => {
                    console.log("=> err post=", error);
                }
            );
    }

}

decorate(MatchStore, {
    ActiveMatches: observable,
    getActiveMatches: action,
    UsersInMatches: observable,
    getUsersInMatches: action,
    UsersInvitedToMatches: observable,
    getUsersInvitedToMatches: action,
    insertLastModal: action,
    lastMatchModal: observable,
    saveLastFriendsInviteModal: action,
    lastFriendsInviteModal: observable,
    changeCreateMatchWithGroup: action,
    createMatchWithGroup: observable
});

export default new MatchStore();