import { pxToRem } from 'utils/styleUtils';

export const textStyle = {
	width: "100%",
	height: pxToRem(100)
};

export const underlineStyle = {
	bottom: 0
};

export const buttonStyle = {
	backgroundColor: "#00A3FE",
	height: pxToRem(88),
	width: pxToRem(630),
	lineHeight: pxToRem(88),
	fontSize: 20
};

export const overlayStyle = {
	height: pxToRem(88),
	transition: 'none'
};

export const style = {
	borderRadius: pxToRem(8),
	transition: 'none',
	boxShadow: "0 0 0.2rem rgba(0,0,0,0.4)"
}