import React from "react";
import { Layout, Header, Sider, Footer, Content } from "../components/Layout";
const class1 = {
	width:'800px',
	height:'400px',
	textAlign:'center',
}
export default {
  chapters: [
    {
      sections: [
        {
          title: "Layout、Header、Sider、Content、Footer",
          info: "",
          sectionFn: () => {
            return (
              <div>
                <h3>展开Sider（默认）</h3>
                  <div className="story-demo">
				  	<Layout style={class1}>
						<Header style={{background:'#b3c0d1',lineHeight:'56px'}}>Header</Header>
						<Layout direction="horizontal">
							<Sider style={{background:'#d3dce6',lineHeight:'300px'}} text="收缩侧边栏">Sider</Sider>
							<Layout>
								<Content style={{background:'#e9eef3',lineHeight:'300px'}}>Content<br/>Content<br/>Content</Content>
								<Footer style={{background:'#b3c0d1',lineHeight:'32px'}}>Footer</Footer>
							</Layout>
						</Layout>
					</Layout>
                </div>
                <h3>折叠Sider</h3>
                  <div className="story-demo">
				  	<Layout style={class1}>
						<Header style={{background:'#b3c0d1',lineHeight:'56px'}}>Header</Header>
						<Layout direction="horizontal">
							<Sider style={{background:'#d3dce6',lineHeight:'300px'}} collapse text="收缩侧边栏">Sider</Sider>
							<Layout>
								<Content style={{background:'#e9eef3',lineHeight:'300px'}}>Content<br/>Content<br/>Content</Content>
								<Footer style={{background:'#b3c0d1',lineHeight:'32px'}}>Footer</Footer>
							</Layout>
						</Layout>
					</Layout>
                </div>
                <h3>隐藏Sider（Sider无内容时自动隐藏）</h3>
                  <div className="story-demo">
				  	<Layout style={class1}>
						<Header style={{background:'#b3c0d1',lineHeight:'56px'}}>Header</Header>
						<Layout direction="horizontal">
							<Sider style={{background:'#d3dce6',lineHeight:'300px'}} text="收缩侧边栏"></Sider>
							<Layout>
								<Content style={{background:'#e9eef3',lineHeight:'300px'}}>Content<br/>Content<br/>Content</Content>
								<Footer style={{background:'#b3c0d1',lineHeight:'32px'}}>Footer</Footer>
							</Layout>
						</Layout>
					</Layout>
                </div>
              </div>
            )
          }
        }
      ]
    }
  ]
}
