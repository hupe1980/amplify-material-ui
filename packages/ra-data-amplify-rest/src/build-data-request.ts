import {
    GET_LIST,
    GET_ONE,
    GET_MANY,
    GET_MANY_REFERENCE,
    CREATE,
    UPDATE,
    DELETE,
} from 'ra-core';

import { Params, Init, Method } from './types';

export const buildDataRequest = (
    type: string,
    resource: string,
    params: Params,
): { path: string; method: Method; init: Init } => {
    let path = '';
    let method: Method;
    const init: Init = {};

    switch (type) {
        case GET_LIST: {
            const { page, perPage } = params.pagination;
            const { field, order } = params.sort;
            init.queryStringParameters = {
                sort: JSON.stringify([field, order]),
                range: JSON.stringify([
                    (page - 1) * perPage,
                    page * perPage - 1,
                ]),
                filter: JSON.stringify(params.filter),
            };
            path = `/${resource}`;
            method = Method.GET;
            break;
        }

        case GET_ONE: {
            path = `/${resource}/${params.id}`;
            method = Method.GET;
            break;
        }

        case GET_MANY: {
            init.queryStringParameters = {
                filter: JSON.stringify({ id: params.ids }),
            };
            path = `/${resource}`;
            method = Method.GET;
            break;
        }

        case GET_MANY_REFERENCE: {
            const { page, perPage } = params.pagination;
            const { field, order } = params.sort;
            init.queryStringParameters = {
                sort: JSON.stringify([field, order]),
                range: JSON.stringify([
                    (page - 1) * perPage,
                    page * perPage - 1,
                ]),
                filter: JSON.stringify({
                    ...params.filter,
                    [params.target]: params.id,
                }),
            };
            path = `/${resource}`;
            method = Method.GET;
            break;
        }

        case UPDATE: {
            path = `/${resource}/${params.id}`;
            method = Method.PUT;
            init.body = params.data;
            break;
        }

        case CREATE: {
            path = `/${resource}`;
            method = Method.POST;
            init.body = params.data;
            break;
        }

        case DELETE: {
            path = `/${resource}/${params.id}`;
            method = Method.DELETE;
            break;
        }

        default:
            throw new Error(`Unsupported fetch action type ${type}`);
    }

    return { path, method, init };
};
