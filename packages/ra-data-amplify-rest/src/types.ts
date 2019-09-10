export interface Init {
    headers?: {};
    body?: {};
    response?: true; // OPTIONAL (return the entire Axios response object instead of only response.data)
    queryStringParameters?: {
        [key: string]: string;
    };
}

export enum Method {
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

export interface Params {
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
}
