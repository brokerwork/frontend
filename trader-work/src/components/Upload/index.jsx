import React from 'react';
import { render as domRender } from 'react-dom';
import { Upload,Button,Icon } from 'antd'
import api from '@/api'

const uploadUrl = 'http://leanwork-fs.oss-cn-hangzhou.aliyuncs.com/';

class UploadFile extends React.Component{
    state = {
      info: {}
    }
    
    render() {
      
      // const fileList = [{
      //   uid: -1,
      //   name: 'xxx.png',
      //   status: 'done',
      //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      //   thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      // }];
      let uploadProps = {
        action: uploadUrl,
        listType: 'picture',
        data: {
          OSSAccessKeyId: this.props.uploadInfo.accessKey,
          policy: this.props.uploadInfo.policy,
          Signature: this.props.uploadInfo.signature,
          success_action_status: '200',
          key: this.props.uploadInfo.key
        }
        // defaultFileList: [...fileList],
      };
      return  <Upload {...uploadProps} onChange={this.props.onChange}>
                <Button>
                  <Icon type="upload" /> upload
                </Button>
              </Upload>
              
    }
}
export default UploadFile