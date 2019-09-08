import {
    GET_LIST,
    GET_ONE,
    GET_MANY,
    GET_MANY_REFERENCE,
    CREATE,
    UPDATE,
    UPDATE_MANY,
    DELETE,
    DELETE_MANY,
} from 'ra-core';

export type Init = {
    headers?: {};
    body?: {};
    response?: true; // OPTIONAL (return the entire Axios response object instead of only response.data)
    queryStringParameters?: {
        [key: string]: any;
    };
};

export enum HttpMethod {
    GET,
    POST,
    PUT,
    DELETE,
    PATCH,
    HEAD,
    TRACE,
    OPTIONS,
    CONNECT,
}

export type RequestType =
    | typeof GET_LIST
    | typeof GET_ONE
    | typeof GET_MANY
    | typeof GET_MANY_REFERENCE
    | typeof UPDATE
    | typeof UPDATE_MANY
    | typeof CREATE
    | typeof DELETE
    | typeof DELETE_MANY;

export type RequestParams = {
    pagination: {
        page: number;
        perPage: number;
    };
    sort: {
        field: string;
        order: 'ASC' | 'DSC';
    };
    filter: {
        [key: string]: any;
    };
    id: string;
    ids?: string[];
    target: string;
    data: {
        [key: string]: any;
    };
};

export type ApiCall = (
    apiName: string,
    path: string,
    init: Init,
) => Promise<any>;
