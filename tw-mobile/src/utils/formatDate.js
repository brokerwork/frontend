let addPrefixZero = (num) => {
	if (num < 10) {
		return `0${num}`
	}
	return num
}

export function formatDate(time) {
	//	time是秒级时间戳
	if(!time)return ''
	let newTime = new Date(time * 1000);
	let year = newTime.getFullYear();
	let month = newTime.getMonth() + 1;
	let date = newTime.getDate();
	return `${year}.${addPrefixZero(month)}.${addPrefixZero(date)}`
}