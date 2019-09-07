import API from '@aws-amplify/api';

import { buildDataRequest } from './build-data-request';
import { parseResponse } from './parse-response';
import { RequestType, RequestParams, ApiCall, HttpMethod } from './types';

const apiCallMap = new Map<HttpMethod, ApiCall>([
    [HttpMethod.GET, API.get],
    [HttpMethod.PUT, API.put],
    [HttpMethod.POST, API.post],
    [HttpMethod.DELETE, API.del],
]);

export interface BuildDataProviderOptions {
    apiName: string;
    buildDataRequest: typeof buildDataRequest;
    parseResponse: typeof parseResponse;
}

export const buildDataProvider = (options: BuildDataProviderOptions) => {
    const { apiName, parseResponse, buildDataRequest } = options;

    return async (
        type: RequestType,
        resource: string,
        params: RequestParams,
    ) => {
        const { path, method, init } = buildDataRequest(type, resource, params);

        const apiCall = apiCallMap.get(method);

        if (!apiCall) throw new Error(`Unsupported http method ${method}`);

        const response = await apiCall(apiName, path, init);

        return parseResponse(response, type, resource, params);
    };
};
