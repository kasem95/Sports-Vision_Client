import { decorate, observable, action, configure } from 'mobx';
configure({ enforceActions: 'observed' });

class CitiesAndFieldsStore {
    Cities = []
    Fields = []

    getCitiesAndFields = async () => {
        await fetch(`http://ruppinmobile.tempdomain.co.il/site09/api/Matches/getCitiesAndFields`, {
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
                    this.Cities = result.cities
                    this.Fields = result.fields
                    console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
                },
                error => {
                    console.log("=> err post=", error);
                }
            );
    }
}

decorate(CitiesAndFieldsStore, {
    Cities: observable,
    Fields: observable,
    getCitiesAndFields: action
})

export default new CitiesAndFieldsStore();