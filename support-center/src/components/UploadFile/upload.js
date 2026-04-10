import { get } from 'utils/ajax';
import uuid from 'uuid';
import math from 'utils/math';
import { getTenantInfo } from 'utils/tenantInfo';

const randomName = fileName => {
  const randomstr = uuid.v1();
  const newFileName = fileName.replace(/.*(\.\w+)$/, (m, ext) => randomstr + ext);

  return newFileName;
};

const upload = ({ keepOriginalName, fileName, file, onSuccess, onFail, onProgress }) => {
  let xhr = new XMLHttpRequest();
  const { tenantId, env } = getTenantInfo() || {};
  const formData = new FormData();
  const newFileName = keepOriginalName ? fileName : randomName(fileName);
  let host = '';
  switch (env) {
    case 'prod':
      host = 'https://prod-uploadpic.lwork.com';
      break;
    case 'qa':
      host = 'https://qa-uploadpic.lwork.com';
      break;
    default:
      host = '//dev.uploadpic.lwork.com';
      break;
  }
  const uploadUrl = `${host}/v1/aliyun/oss/bw/upload`;
  formData.append('name', newFileName);
  formData.append('tenantId', tenantId);
  formData.append('file', file);

  xhr.open('POST', uploadUrl, true);
  xhr.upload.onprogress = function(evt) {
    const progress = `${math.div(evt.loaded, evt.total) * 100}%`;

    if (onProgress) onProgress(progress);
  };
  xhr.onload = () => {
    if (xhr.status === 200) {
      const resData = JSON.parse(xhr.responseText);
      let fileSrc = resData.data;
      const reg = /^\/\/.*?/gi;
      if (onSuccess) {
        if (!reg.test(fileSrc)) {
          fileSrc = `//${fileSrc}`;
        }
        onSuccess(fileSrc);
      }
    } else if (onFail) {
      onFail();
    }
  };
  xhr.send(formData);

  return xhr;
};

export default upload;
