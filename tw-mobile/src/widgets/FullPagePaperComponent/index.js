import React from 'react';
import { FullPagePaper } from 'widgets/FullPagePaper';

export class FullPagePaperComponent extends React.Component{
  componentDidMount() {
    window.loaded && window.loaded();
  }
  render(){
    return <FullPagePaper {...this.props}>{this.props.children}</FullPagePaper>
  }
}