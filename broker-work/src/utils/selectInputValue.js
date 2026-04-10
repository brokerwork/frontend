export default dom=>{
		// 只有带有value属性的才能被选中
		let end = dom.value.length;
		dom.setSelectionRange(0,end)
	}