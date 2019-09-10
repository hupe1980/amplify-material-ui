import { GET_LIST, GET_MANY_REFERENCE, CREATE, DELETE_MANY } from 'ra-core';

import { Params } from './types';

export const parseResponse = (
    response: any,
    type: string,
    resource: string,
    params: Params,
): any => {
    const { headers, data } = response;

    switch (type) {
        case GET_LIST:
        case GET_MANY_REFERENCE: {
            if (!headers.has('x-total-count')) {
                throw new Error(
                    'The x-total-count header is missing in the HTTP Response. The amplify REST data provider expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare X-Total-Count in the Access-Control-Expose-Headers header?',
                );
            }
            return {
                data,
                total: parseInt(
                    headers
                        .get('x-total-count')
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
