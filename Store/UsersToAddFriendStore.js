import React from 'react'
import { decorate, observable, action, configure } from 'mobx';
configure({ enforceActions: 'observed' });

class UsersToAddFriendStore extends React.Component {
    constructor(props) {
        super(props);
    }
    usersList = []

    TakeUsersList = () => {
        return this.usersList;
    }

    getUsersList = async (userID, friends) => {
        console.log("s7aaaaaaabbbbbbbbbbb" + friends)
        await fetch(`http://ruppinmobile.tempdomain.co.il/site09/api/friends/${userID}/getUsersList`, {
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
                    //console.log("fetch GET= ", result);
                    if (Array.isArray(result)) {
                        let list = result.map(user => {
                            let isFriend = false;
                            let i = 0;
                            for (i = 0; i < friends.length; i++) {
                                if ((friends[i].User_ID === user.User_ID || friends[i].Friend_ID === user.User_ID) &&
                                    (friends[i].User_ID === userID || friends[i].Friend_ID === userID)) {
                                    isFriend = true;
                                }
                            }
                            if (isFriend === false) {
                                return user;
                            }

                        });

                        let cleanList = list.filter(user => user != null)

                        console.log(cleanList)
                        this.usersList = cleanList;
                    }
                },
                error => {
                    console.log("=> err post=", error);
                }
            );
    }
}

decorate(UsersToAddFriendStore, {
    usersList: observable,
    getUsersList: action,
    TakeUsersList: action
});

export default new UsersToAddFriendStore();