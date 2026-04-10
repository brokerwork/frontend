// var scrollEndCallbacks = [];
// var IScrollHelper = {
// 	register: function(type, fn){
// 		if (type == 'onScrollEnd'){
// 			scrollEndCallbacks.push(fn);
// 		}
// 	},
// 	unRegister: function(type, fn){
// 		if (type == 'onScrollEnd'){
// 			var idx = scrollEndCallbacks.indexOf(fn);
// 			scrollEndCallbacks.splice(idx, 1); //remove 1
// 		}
// 	}
// }
// var myScroll;

// // ref https://github.com/WICG/EventListenerOptions/pull/30
// function isPassive() {
//     var supportsPassiveOption = false;
//     try {
//         addEventListener("test", null, Object.defineProperty({}, 'passive', {
//             get: function () {
//                 supportsPassiveOption = true;
//             }
//         }));
//     } catch (e) { }
//     return supportsPassiveOption;
// }

// function injectIscroll() {
//     myScroll = new IScroll('#wrapper', {
//         probeType: 2,
//         scrollbars: true,
//         mouseWheel: true,
//         interactiveScrollbars: true,
//         shrinkScrollbars: 'scale',
//         fadeScrollbars: true,
//         preventDefault: false
//     });
//     myScroll.on("scroll", function () {
//         if ((this.y < this.maxScrollY) && (this.pointY < 1)) {
//             this.scrollTo(0, this.maxScrollY, 400);
//             return;
//         } else if (this.y > 0 && (this.pointY > window.innerHeight - 1)) {
//             this.scrollTo(0, 0, 400);
//             return;
//         }
//     });
// 		myScroll.on('scrollEnd', function(){
// 			console.log('y', this.y, 'maxScrollY',this.maxScrollY )
// 			if (this.y == this.maxScrollY){
// 				console.log('end')
// 			}
// 			scrollEndCallbacks.forEach(fn=>{
// 				fn.apply(this)
// 			})
// 		})
// }

// function loaded() {
//     setTimeout(function () {
//         injectIscroll();
//     }, 100);
// }

// document.addEventListener('touchstart', function (e) { 
// 	console.log('document touchstart')
// 	e.preventDefault(); 
// }, false);

// document.addEventListener('touchmove', function (e) { 
// 	e.preventDefault(); 
// }, false);

