import React from 'react';
import Loading from '../components/Loading';
import Alert from '../components/Alert';
import Switch from '../components/Switch';
import Icon from '../components/Icon';
import { action } from '@storybook/addon-actions';

const notLastOptions = {
  showSource: false,
  allowSourceToggling: true,
  showPropTables: false,
  allowPropTablesToggling: false
};

class Demo extends React.Component {
  state = { loading: false };
  toggle = value => {
    this.setState({ loading: value });
  };
  render() {
    return (
      <div>
        <Loading loading={this.state.loading}>
          <Alert message="Alert message title" type="info" closable={false} />
        </Loading>
        <div style={{ marginTop: 16 }}>
          Loading state：<Switch
            checked={this.state.loading}
            onChange={this.toggle}
          />
        </div>
      </div>
    );
  }
}

export default {
  chapters: [
    {
      sections: [
        {
          title: '基本使用',
          options: notLastOptions,
          sectionFn: () => {
            return (
              <div className="story-demo loading-demo">
                <Loading />
              </div>
            );
          }
        },
        {
          title: '不同大小',
          options: notLastOptions,
          sectionFn: () => {
            return (
              <div className="story-demo loading-demo">
                <Loading size="small" /> <Loading /> <Loading size="large" />
              </div>
            );
          }
        },
        {
          title: '嵌入模式',
          options: notLastOptions,
          sectionFn: () => {
            return (
              <div className="story-demo loading-demo">
                <Demo />
              </div>
            );
          }
        },
        {
          title: '在容器内',
          sectionFn: () => {
            return (
              <div className="story-demo loading-demo">
                <div
                  style={{
                    textAlign: 'center',
                    background: 'rgba(0,0,0,0.05)',
                    borderRadius: '4px',
                    marginBottom: '20px',
                    padding: '30px 50px',
                    margin: '20px 0'
                  }}
                >
                  <Loading />
                </div>
              </div>
            );
          }
        }
      ]
    }
  ]
};
