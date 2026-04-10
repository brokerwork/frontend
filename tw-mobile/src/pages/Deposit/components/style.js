import { pxToRem, fontSizeByDPR } from 'utils/styleUtils';

export const buttonStyle = {
	backgroundColor: "#00A3FE",
	height: pxToRem(88),
	lineHeight: pxToRem(88),
};

export const overlayStyle = {
	height: pxToRem(88),
	transition: 'none'
};

export const labelStyle = {
	fontSize: fontSizeByDPR(36)
}

export const style = {
	borderRadius: pxToRem(8),
	transition: 'none',
	boxShadow: "0 0 0.2rem rgba(0,0,0,0.4)",
	width: "100%"
}

export const underlineDisabledStyle = {
	color: 'red',
	borderBottomStyle: "solid",
	borderBottomWidth: "1px",
	borderBottomColor: "#E1E1E1"
}

export const contentStyle = {
	top: '50%',
	left: '50%',
	position: 'absolute',
	transform: 'translate(-50%, -50%)'
}