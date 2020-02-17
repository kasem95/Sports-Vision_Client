import React from 'react'
import { AsyncStorage } from 'react-native'
import { decorate, observable, action, configure } from 'mobx';
import User from '../Classes/User';


configure({ enforceActions: "observed" });
const defaultPIC = '../assets/profilepicture.png';

class UserStore extends React.Component {

    user = ""
    FBToken = ""
    faceORGLogin = -1
    users = []

    changeUserPass = val => {
        this.user.password = val;
    }

    insertUser = val => {
        this.user = val
        console.log(this.user)
    }

    setFaceORGLogin = (val) => {
        this.faceORGLogin = val;
    }

    getUsers = () => {
        fetch(`http://ruppinmobile.tempdomain.co.il/site09/api/Users/getUsers`, {
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

    getNewUserDetails = async () => {
        await fetch(`http://ruppinmobile.tempdomain.co.il/site09/api/Users/${this.user.userID}/getUser`, {
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
                    console.log("fetch GET= ", result);
                    if (typeof result == "string") {
                        alert(result);
                    } else {
                        let user = new User(result.UserID, result.Email, result.Password, result.Username, result.PhotoName);
                        this.insertUser(user);
                        AsyncStorage.setItem('user', JSON.stringify(user))
                        if (result.PhotoName.slice(0, 8) !== "https://") {
                            AsyncStorage.setItem('faceORG', '-1')
                        } else {
                            this.props.rootStore.UserStore.setFaceORGLogin()
                            AsyncStorage.setItem('faceORG', '1')
                        }
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
    getUsers: action,
    changeUserPass: action,
    getNewUserDetails: action
});

export default new UserStore();