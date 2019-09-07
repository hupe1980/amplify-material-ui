import {
    GET_LIST,
    GET_ONE,
    GET_MANY,
    GET_MANY_REFERENCE,
    CREATE,
    UPDATE,
    DELETE,
} from 'ra-core';

import { RequestType, RequestParams, Init, HttpMethod } from './types';

export const buildDataRequest = (
    type: RequestType,
    resource: string,
    params: RequestParams,
) => {
    let path = '';
    let method: HttpMethod;
    const init: Init = {};

    switch (type) {
        case GET_LIST: {
            const { page, perPage } = params.pagination;
            const { field, order } = params.sort;
            init.queryStringParameters = {
                sort: [field, order],
                range: [(page - 1) * perPage, page * perPage - 1],
                filter: params.filter,
            };
            path = `/${resource}`;
            method = HttpMethod.GET;
            break;
        }

        case GET_ONE: {
            path = `/${resource}/${params.id}`;
            method = HttpMethod.GET;
            break;
        }

        case GET_MANY: {
            init.queryStringParameters = {
                filter: { id: params.ids },
            };
            path = `/${resource}`;
            method = HttpMethod.GET;
            break;
        }

        case GET_MANY_REFERENCE: {
            const { page, perPage } = params.pagination;
            const { field, order } = params.sort;
            init.queryStringParameters = {
                sort: [field, order],
                range: [(page - 1) * perPage, page * perPage - 1],
                filter: {
                    ...params.filter,
                    [params.target]: params.id,
                },
            };
            path = `/${resource}`;
            method = HttpMethod.GET;
            break;
        }

        case UPDATE: {
            path = `/${resource}/${params.id}`;
            method = HttpMethod.PUT;
            init.body = params.data;
            break;
        }

        case CREATE: {
            path = `/${resource}`;
            method = HttpMethod.POST;
            init.body = params.data;
            break;
        }

        case DELETE: {
            path = `/${resource}/${params.id}`;
            method = HttpMethod.DELETE;
            break;
        }

        default:
            throw new Error(`Unsupported fetch action type ${type}`);
    }

    return { path, method, init };
};
