import * from 'es6-promise';
import * as $ from 'jquery';
import {HttpClient} from '../../http/httpclient';
import {I18nLoader} from '../../i18n/loader';

function linkValue(str) {
		if (location.href.indexOf('localhost') != -1) {
				return str.replace(/(#.*$)/, function (match) {
						return '?$Path=/dev' + match;
				})
		}
		return str;
}

function getTodoCount() {
	return HttpClient.doGet('/v1/job/setting/countTodo')
		.then((res) => {
			if (!res.result) return;
			return Number(res.data);
		});
}

export function userLoginOut() {
		var url = '/v1/user/logout';
		return function (dispatch) {
				return HttpClient
						.doPost(url)
						.then(res => {
								if (res.result) {
										window.location.href = linkValue("/login#");
								}
						}});
}
