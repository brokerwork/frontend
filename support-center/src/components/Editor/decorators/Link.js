import React from 'react';
import findLinkEntities from '../utils/findLinkEntities';
class Link extends Component {
  render() {
    const { url } = this.props.contentState
      .getEntity(this.props.entityKey)
      .getData();
    return <a href={url}>{this.props.children}</a>;
  }
}

export default {
  component: Link,
  strategy: findLinkEntities.bind(null, 'LINK')
};
