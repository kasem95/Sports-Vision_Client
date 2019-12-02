import React from 'react'
import { decorate, observable, action, configure, computed } from 'mobx';
configure({ enforceActions: 'observed' });

class FriendsStore extends React.Component {
    friendsList = []
    friendsTable = []
    FriendsRespondsList = []
    FriendsRequestsList = []

    TakeFriendsList = () => {
        return this.friendsList
    }

    getFriendsList = async (userID) => {
        await fetch(`http://ruppinmobile.tempdomain.co.il/site09/api/friends/${userID}/getFriendsList`, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json;',
            })
        })
            .then(res => {
                console.log("res=", res);
                return res.json();
            })
            .then(
                result => {
                    console.log("fetch GET= ", result);
                    if (Array.isArray(result)) {

                        this.friendsList = result;

                    }
                },
                error => {
                    console.log("=> err post=", error);
                }
            );

    }

    getFriendsRespondsList = async (userID) => {
        await fetch(`http://ruppinmobile.tempdomain.co.il/site09/api/friends/${userID}/getFriendsRespondsList`, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json;',
            })
        })
            .then(res => {
                console.log("res=", res);
                return res.json();
            })
            .then(
                result => {
                    console.log("fetch GET= ", result);
                    if (Array.isArray(result)) {

                        this.FriendsRespondsList = result;

                    }
                },
                error => {
                    console.log("=> err post=", error);
                }
            );

    }

    getFriendsRequestsList = async (userID) => {
        await fetch(`http://ruppinmobile.tempdomain.co.il/site09/api/friends/${userID}/getFriendsRequestsTable`, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json;',
            })
        })
            .then(res => {
                console.log("res=", res);
                return res.json();
            })
            .then(
                result => {
                    console.log("fetch GET= ", result);
                    if (Array.isArray(result)) {

                        this.FriendsRequestsList = result;

                    }
                },
                error => {
                    console.log("=> err post=", error);
                }
            );

    }

    getFriendsTable = async () => {
        await fetch(`http://ruppinmobile.tempdomain.co.il/site09/api/friends/getFriendsTable`, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json;',
            })
        })
            .then(res => {
                console.log("res=", res);
                return res.json();
            })
            .then(
                result => {
                    console.log("fetch GET= ", result);
                    if (Array.isArray(result)) {

                        this.friendsTable = result;

                    }
                },
                error => {
                    console.log("=> err post=", error);
                }
            );

    }
}

decorate(FriendsStore, {
    friendsList: observable,
    getFriendsList: action,
    TakeFriendsList: action,
    friendsTable: observable,
    getFriendsTable: action,
    FriendsRequestsList: observable,
    FriendsRespondsList: observable,
    getFriendsRequestsList: action,
    getFriendsRespondsList: action
});

export default new FriendsStore();