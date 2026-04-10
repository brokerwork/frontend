import { pxToRem, fontSizeByDPR } from 'utils/styleUtils'

export const TextFieldStyle = {
    style: {
        width: "100%",
        color: '#6A6969',
        height: pxToRem(100),
        lineHeight: 'normal',
        boxSizing: 'border-box',
        fontSize: fontSizeByDPR(28),
        padding: `${pxToRem(45)} 0 ${pxToRem(15)}`,
    },
    style2: {
        width: "100%",
        height: 'auto',
        color: '#6A6969',
        lineHeight: 'normal',
        boxSizing: 'border-box',
        fontSize: fontSizeByDPR(28),
        padding: `${pxToRem(30)} 0 ${pxToRem(30)}`,
    },
    errorStyle: {
        right: 0,
        bottom: pxToRem(5),
        position: 'absolute'
    },
    inputStyle: {
        color: '#000',
        marginTop: 'none',
        height: pxToRem(40),
        fontSize: fontSizeByDPR(28),
    },
    inputStyle2: {
        zIndex: 9,
        color: '#000',
        marginTop: 'none',
        bottom: pxToRem(30),
        height: pxToRem(40),
        position: 'absolute',
        fontSize: fontSizeByDPR(28),
    },
    floatingLabelStyle: {
        top: '50%',
        width: '100%',
        color: '#6A6969',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        fontSize: fontSizeByDPR(28),
        transform: 'translate(0, -50%)',
    },
    floatingLabelStyle2: {
        top: 'none',
        width: '100%',
        color: '#6A6969',
        position: 'static',
        display: 'block',
        fontSize: fontSizeByDPR(28),
    },
    floatingLabelShrinkStyle: {
        color: '#00A3FE'
    },
    floatingLabelShrinkStyle2: {
        color: '#00A3FE',
        transform: 'scale(0.7)'
    },
    underlineStyle: {
        bottom: 0
    },
    hintStyle: {
        bottom: 'none',
        fontSize: fontSizeByDPR(28),
    },
    hintStyle2: {
        position: 'relative',
        bottom: 'none',
        fontSize: fontSizeByDPR(28),
    },
    underlineDisabledStyle: {
        borderBottom: '1px solid rgba(0,0,0,0.3)'
    }
}

export const CheckBoxStyle = {
    style: {
        width: 'auto',
        float: 'left',
        marginRight: pxToRem(30)
    },
    labelStyle: {
        width: 'auto'
    },
    iconStyle: {
        marginRight: pxToRem(10)
    }
}