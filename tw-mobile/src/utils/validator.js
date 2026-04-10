export class Validator {
	static isEmail(str) {
		// let regexp = /^[0-9a-zA-Z][\!#\$%\&'\*\+\-\/=\?\^_`\{\|\}~0-9a-zA-Z]{0,}(\.[\!#\$%\&'\*\+\-\/=\?\^_`\{\|\}~0-9a-zA-Z]+){0,}@[a-z0-9\-]{0,}(\.[a-z0-9\-]{2,6})*$/;
		let regexp = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
		return regexp.test(str)
	}
}
export const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
export const numberRegex = /^\d+(?:\.\d{1,3})?$/
export const positiveRegex = /^[1-9]+$/
export const phoneRegex = /^[0-9\-\s]{5,20}$/
export const pswdRegex = /(?![0-9A-Z]+$)(?![0-9a-z]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/

export const isEmail = value => emailRegex.test(value)
export const isPhone = value => phoneRegex.test(value)
