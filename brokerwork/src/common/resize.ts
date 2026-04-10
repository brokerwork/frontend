class MainPanelResizeUtil{
    private resizePanelClass:string = '.main-panel';
    private element:any;
    private minWindowHeight:number = 793;
    constructor(){
        this.element = document.querySelector(this.resizePanelClass)
    }
    register(reactComponent){
        var self = this;
        var fn = this.handleResize.bind(this);
        fn.apply(this);
        window.addEventListener('resize', fn);

        reactComponent.componentWillUnmount = ()=>{
            window.removeEventListener('resize', fn);
            this.element = null;
        }
    }
    handleResize(){

        var w = document.body.offsetWidth;
        var h = document.body.offsetHeight;
        if (h > this.minWindowHeight){
            var headerH = document.querySelector('.header.fixed-top').offsetHeight;
            var footerH = document.querySelector('.footer-section').offsetHeight;
            var padding = 15;
            this.element.style.minHeight = h - headerH - footerH - padding*2  + 'px'
        }
    }
}

export {MainPanelResizeUtil}