export function parseUrlParams() {
	var result = {};
	var url = window.location.href;
	var i = url.indexOf('?');
	if (i != -1) {
		var query = url.substr(i + 1);
		var pairs = query.split('&');
		pairs.forEach(pair => {
			var kv = pair.split('=');
			if (kv.length > 0) {
				var key = kv[0];
				var value = decodeURIComponent(kv[1]);
				result[key] = value
			}
		})
	}
	return result
}

export function isFullUrl(url){
	return !url || url.indexOf('http') == 0 || url.indexOf('//') == 0
}