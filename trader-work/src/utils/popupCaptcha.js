import { getType } from './language'
const popupCaptcha = {
    init(id, finishCb, onLoad) { 
        if (!document.getElementById(id)) return false
        const sEle = document.createElement('script')
        const head = document.getElementsByTagName('head')[0]
        sEle.setAttribute('src', '//cstaticdun.126.net/load.min.js')
        const captchaId = '5f8526b3d6404a8a8a4283ec0a367f4d'
        let langType = ''
        if(getType()==='zh-CN'|| getType()==='zh-TW'){
            langType = getType()
        }else{
            langType = getType().split('-')[0]
        }
        sEle.addEventListener('load', () => {
            initNECaptcha({
                // config对象，参数配置
                captchaId: captchaId,
                element: `#${id}`,
                mode: 'float',
                width: 'auto',
                lang: langType,
                onVerify: function(err, data) {
                    finishCb(err, Object.assign({captchaId: captchaId}, data || {}))
                }
            }, (instance) => {
                // 初始化成功后得到验证实例instance，可以调用实例的方法
                onLoad(instance)
            }, (err) => {
                // 初始化失败后触发该函数，err对象描述当前错误信息
            })
        })
        head.appendChild(sEle)
    }
}

export default popupCaptcha