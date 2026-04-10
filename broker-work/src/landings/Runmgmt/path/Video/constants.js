import i18n from 'utils/i18n';
export const LIVE_STATE = [
  { label: i18n['video.action_bar.conditions_not_end'], value: 'NOTFINISHED' },
  { label: i18n['video.action_bar.conditions_end'], value: 'FINISHED' }
];
export const LIST_STATE = [
  {
    label: i18n['video.video_list.source_type.not_started'],
    value: 'NOTSTART'
  },
  {
    label: i18n['video.video_list.source_type.live'],
    value: 'STARTED'
  },
  { label: i18n['video.action_bar.conditions_end'], value: 'FINISHED' }
];
export const UPLOAD_TYPE = [
  {
    label: i18n['video.video_root.chose_video'],
    value: 'LIVE'
  },
  { label: i18n['video.video_root.upload_button'], value: 'UPLOAD' }
];

export const PUB_TYPE = [
  { label: i18n['video.video_root.pub_state_pubed'], value: 'PUBBED' },
  { label: i18n['video.video_root.pub_state_pub_will'], value: 'NOTPUB' }
];

export const LIST_TYPE = [
  { label: i18n['video.video_root.video_list'], value: 'LIVE' },
  { label: i18n['video.video_root.lecturer_list'], value: 'LECTURER' }
];

export const VIDEO_LIST_HEADER = [
  { label: i18n['video.live.cover'], value: 'cover' },
  { label: i18n['video.live.theme'], value: 'subject' },
  { label: i18n['video.live.lecturer'], value: 'lecturerName' },
  { label: i18n['video.live.create_time'], value: 'createTime' },
  { label: i18n['video.live.live_time'], value: 'startTime' },
  { label: i18n['video.live.live_end_time'], value: 'endTime' },
  { label: i18n['video.live.last_update'], value: 'modifyTime' },
  { label: i18n['video.live.live_status'], value: 'liveStatus' },
  { label: i18n['video.live.action'], value: 'action' }
];

export const LECTURER_LIST_HEADER = [
  { label: i18n['video.create_lecturer.name'], value: 'name' },
  { label: i18n['video.create_lecturer.header'], value: 'header' },
  { label: i18n['video.create_lecturer.desc'], value: 'description' }
];

export const RECORDS_LIST_HEADER = [
  { label: i18n['video.live.cover'], value: 'cover' },
  { label: i18n['video.live.theme'], value: 'subject' },
  { label: i18n['video.live.lecturer'], value: 'lecturer' },
  { label: i18n['video.video_list.amount'], value: 'replayList' },
  { label: i18n['video.video_list.source'], value: 'sourceType' },
  { label: i18n['video.live.create_time'], value: 'createTime' },
  { label: i18n['video.live.last_update'], value: 'modifyTime' }
];

export const SEARCH_TYPES = [
  { label: i18n['tausermgmt.table_header.email'], value: 'Email' },
  { label: i18n['tausermgmt.table_header.phone'], value: 'Phone' }
];

export const COMMENT_STATE = [
  {
    label: i18n['video.video_list.comment_type.notsave'],
    value: 'NOTSAVE'
  },
  {
    label: i18n['video.video_list.comment_type.notsave'],
    value: 'SAVING_CREATED'
  },
  {
    label: i18n['video.video_list.comment_type.notsave'],
    value: 'SAVING_GZIPED'
  },
  {
    label: i18n['video.video_list.comment_type.expried'],
    value: 'EXPIRED'
  },
  {
    label: i18n['video.video_list.comment_type.no_file'],
    value: ''
  }
];

export const ADMIN_LIST_HEADER = [
  { label: i18n['tausermgmt.table_header.registered_name'], value: 'realName' },
  { label: i18n['tausermgmt.table_header.phone'], value: 'phone' },
  { label: i18n['tausermgmt.table_header.email'], value: 'email' },
  { label: i18n['settings.level_setting.action'], value: 'actions' }
];
