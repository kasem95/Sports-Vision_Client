import { decorate, observable, action, configure, computed } from 'mobx';
configure({ enforceActions: 'observed' });

class CameraStore {
    RegisterPhotoURI = ""
    CreateMatchPhotoURI = ""
    UserNewPicture = ""
    signUpOrCreateMatch = undefined
    CreateGroupPhotoURI = ""

    changeSignUpOrCreateMatch = (val) => {
        this.signUpOrCreateMatch = val
    }

    changeRegisterPhotoURI = val => {
        this.RegisterPhotoURI = val
    }

    changeUserPhotoURI = val => {
        this.UserNewPicture = val
    }

    changeCreateMatchPhotoURI = val => {
        this.CreateMatchPhotoURI = val
    }

    changeCreateGroupPhotoURI = val => {
        this.CreateGroupPhotoURI = val
    }
}

decorate(CameraStore, {
    RegisterPhotoURI: observable,
    CreateMatchPhotoURI: observable,
    changeRegisterPhotoURI: action,
    changeCreateMatchPhotoURI: action,
    signUpOrCreateMatch: observable,
    changeSignUpOrCreateMatch: action,
    UserNewPicture: observable,
    changeUserPhotoURI: action,
    CreateGroupPhotoURI: observable,
    changeCreateGroupPhotoURI: action
})

export default new CameraStore()