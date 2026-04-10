import { createAction } from 'redux-actions';
import { get } from '../../../utils/api';
import { getCachedToken } from 'utils/userinfo';

export const FETCH_ALBUM_DETAIL = 'FETCH_ALBUM_DETAIL';
export const FETCH_VIDEO_LIST = 'FETCH_VIDEO_LIST';

export const fetchAlbumDetail = createAction(
	FETCH_ALBUM_DETAIL,
	(id,page,size) => {
		return get(`/api/v1/video/replay/video_list?id=${id}&page=${page}&size=${size}`,{
			headers: {
				'x-api-token': getCachedToken()
			}
		})
	}
)


