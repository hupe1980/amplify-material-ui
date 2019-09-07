import { GET_LIST, GET_MANY_REFERENCE, CREATE, DELETE_MANY } from 'ra-core';

import { RequestType, RequestParams } from './types';

export const parseResponse = (
    response: any,
    type: RequestType,
    resource: string,
    params: RequestParams,
) => {
    const { headers, data } = response;

    switch (type) {
        case GET_LIST:
        case GET_MANY_REFERENCE: {
            if (!headers.has('content-range')) {
                throw new Error(
                    'The Content-Range header is missing in the HTTP Response. The simple REST data provider expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare Content-Range in the Access-Control-Expose-Headers header?',
                );
            }
            return {
                data,
                total: parseInt(
                    headers
                        .get('content-range')
                        .split('/')
                        .pop(),
                    10,
                ),
            };
        }

        case CREATE: {
            return { data: { ...params.data, id: data.id } };
        }

        case DELETE_MANY: {
            return { data: data || [] };
        }

        default:
            return { data };
    }
};
