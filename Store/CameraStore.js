import { decorate, observable, action, configure, computed } from 'mobx';
configure({ enforceActions: 'observed' });

class CameraStore {
    RegisterPhotoURI = ""
    CreateMatchPhotoURI = ""
    signUpOrCreateMatch = 0

    changeSignUpOrCreateMatch = (val) => {
        this.signUpOrCreateMatch = val
    }

    changeRegisterPhotoURI = val => {
        this.RegisterPhotoURI = val
    }

    changeCreateMatchPhotoURI = val => {
        this.CreateMatchPhotoURI = val
    }
}

decorate(CameraStore, {
    RegisterPhotoURI: observable,
    CreateMatchPhotoURI: observable,
    changeRegisterPhotoURI: action,
    changeCreateMatchPhotoURI: action,
    signUpOrCreateMatch: observable,
    changeSignUpOrCreateMatch: action
})

export default new CameraStore()