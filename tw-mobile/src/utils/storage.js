function getStorageImpl() {
	return localStorage;
}
export class Storage {
	static putObject(key, value) {
		getStorageImpl().setItem(key, JSON.stringify(value))
	}
	static getObject(key) {
		const s = Storage.getString(key);
		return JSON.parse(s);
	}

	static putString(key, value){
		getStorageImpl().setItem(key, value);
	}
	static getString(key) {
		const s = getStorageImpl().getItem(key)
		return s
	}
	static clear() {
		getStorageImpl().clear();
	}
}

Storage.Keys = {};
Storage.Keys.ACCOUNT_TOKEN = 'ACCOUNT_TOKEN_1';//需要发版本清空以前ACCOUNT_TOKEN全部缓存，故改一下key;原ACCOUNT_TOKEN
Storage.Keys.ACCOUNT_DATA = localStorage.getItem('ACCOUNT_DATA_MOBILE_1') ? 'ACCOUNT_DATA_MOBILE_1' : 'ACCOUNT_DATA_1';//原SELECT_ACCOUNT
Storage.Keys.USER_INFO = 'USER_INFO';
Storage.Keys.APPLICATION_NAV_INDEX = 'APPLICATION_NAV_INDEX';