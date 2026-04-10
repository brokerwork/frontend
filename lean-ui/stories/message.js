import React from 'react';
import Message from '../components/Message';
import { action } from '@storybook/addon-actions';
import Button from '../components/Button';

const notLastOptions = {
  showSource: false,
  allowSourceToggling: true,
  showPropTables: false,
  allowPropTablesToggling: false
};

class Demo extends React.Component {
  showMessage = (type, longConent) => {
    Message[type](`This is a ${type} message`);
  };

  showLongContent = () => {
    Message[type](
      'Long ContentLong ContentLong ContentLong ContentLong ContentLong ContentLong ContentLong ContentLong ContentLong ContentLong ContentLong ContentLong ContentLong ContentLong ContentLong ContentLong ContentLong ContentLong ContentLong ContentLong ContentLong ContentLong ContentLong ContentLong Content',
      3
    );
  };

  show10Message = () => {
    Message[type](`十秒钟后隐藏`, 10);
  };

  render() {
    return (
      <div>
        <Button type="success" onClick={this.showMessage.bind(this, 'success')}>
          Display Success
        </Button>
        <br />
        <Button type="primary" onClick={this.showMessage.bind(this, 'info')}>
          Display Info
        </Button>
        <br />
        <Button onClick={this.showMessage.bind(this, 'warning')}>
          Display Warning
        </Button>
        <br />
        <Button type="danger" onClick={this.showMessage.bind(this, 'error')}>
          Display Error
        </Button>
        <Button onClick={this.LongContent}>长文本</Button>
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
          info:
            'Message.success, Message.info, Message.error, Message.warning。Message.success(content, duration) 内容， 停留时间',
          options: notLastOptions,
          sectionFn: () => {
            return (
              <div className="story-demo slert-demo">
                <Demo />
              </div>
            );
          }
        },
        {
          title: '可关闭消息',
          info: "Message.info('content', true)",
          options: notLastOptions,
          sectionFn: () => {
            return (
              <div className="story-demo slert-demo">
                <Button
                  type="danger"
                  onClick={() => {
                    Message.info('content', true);
                  }}
                >
                  可关闭按钮
                </Button>
              </div>
            );
          }
        },
        {
          title: '宽屏模式',
          options: notLastOptions,
          info: "Message.info('content', {closable: true,full: true})",
          sectionFn: () => {
            return (
              <div className="story-demo slert-demo">
                <Button
                  type="danger"
                  onClick={() => {
                    Message.info('content', {
                      closable: true,
                      full: true
                    });
                  }}
                >
                  宽按钮
                </Button>
              </div>
            );
          }
        },
        {
          title: '自定义配置高度',
          options: notLastOptions,
          info: "Message.config( {top: 300})。 把全局高度配置300",
          sectionFn: () => {
            return (
              <div className="story-demo slert-demo">
                <Button
                  type="danger"
                  onClick={() => {
                    Message.config({
                      top: 300
                    });
                  }}
                >
                  全局配置高度
                </Button>
                <Button
                  type="success"
                  onClick={() => {
                    Message.config({
                      top: null
                    });
                  }}
                >
                  恢复配置
                </Button>
                <br />
                <Button
                  type="default"
                  onClick={() => {
                    Message.success('content');
                  }}
                >
                  展示消息
                </Button>
              </div>
            );
          }
        }
      ]
    }
  ]
};
