let data:any;

class SharedData {
    setData = (param:any)=> {
        data = param;
    }
    getData = ():any=> {
        return data;
    }
}

export default new SharedData();