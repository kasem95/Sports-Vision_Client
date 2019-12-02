import React from 'react'
import { decorate, observable, action, configure } from 'mobx';


configure({ enforceActions: "observed" });
const defaultPIC = '../assets/profilepicture.png';

class UserStore extends React.Component {

    user = ""
    FBToken = ""
    faceORGLogin = -1
    users = []



    insertUser = val => {
        this.user = val
        console.log(this.user)
    }

    setFaceORGLogin = () => {
        this.faceORGLogin = this.faceORGLogin * -1
    }

    getUsers = () => {
        fetch(`http://ruppinmobile.tempdomain.co.il/site09/api/Users/getUsers`, {
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
                        this.users = result
                    }
                },
                error => {
                    console.log("=> err post=", error);
                }
            );
    }

}
decorate(UserStore, {
    user: observable,
    insertUser: action,
    FBToken: observable,
    faceORGLogin: observable,
    setFaceORGLogin: action,
    users: observable,
    getUsers: action
});

export default new UserStore();