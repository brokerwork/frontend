import {Component} from 'react'
import {Link} from 'react-router-dom'
import { TcPlayer } from '@/utils/TcPlayer'
const mystyle = {
	border:"1px solid #00a8a6",
	minHeight:'40px',
	minWidth:'40px',
	margin:'10px',
	float:'left',
}
export default class Test1 extends Component{
	constructor(props){
		super(props)
		console.log(this.props)
		console.log(this.props.match.params.cnt)
		this.state = {
			cnt:parseInt(this.props.match.params.cnt)||10,
			url:"http://9757.liveplay.myqcloud.com/live/9757_T001117_5a44a5598e7886380e5a55f8.m3u8",
		}
	}
	componentDidMount(){
		this.setPlayerConfig()
	}
    setPlayerConfig = () => {
        let options = {
            "m3u8": this.state.url,
            "flv": this.state.url.replace('m3u8', 'flv'),
            "coverpic": {style: 'cover', src: "http://broker-upload-dev.oss-cn-hangzhou.aliyuncs.com/Live/Cover.jpeg"},
            "live": true,
            "autoplay": true,
            "width": 590,
            "height": 325,
        }
		for(let i=1;i<this.state.cnt+1;i++){
			new TcPlayer('webcast-'+i, options)
		}
    }
	renderDom = () => {
		const domList = []
		for(let i=1;i<this.state.cnt+1;i++){
			domList.push(<div id={"webcast-"+i} style={mystyle}></div>)
		}
		return domList
	}
	cntChange = e => {
		this.setState({cnt:e.target.value},this.setPlayerConfig)
		
	}
	render(){
		return(
			<div>
				<h1>测试直播</h1>
				{/* <span>数量：</span><input type="text" onChange={this.cntChange} value={this.state.cnt}/> */}
				<br/>
				{/* <Link to="/personal/overview">overview page</Link> */}
				{this.renderDom()}
			</div>
		)
	}
}