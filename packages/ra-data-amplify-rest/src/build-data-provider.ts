import API from '@aws-amplify/api';

import { buildDataRequest } from './build-data-request';
import { parseResponse } from './parse-response';
import { RequestType, RequestParams, ApiCall, HttpMethod } from './types';

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

        let response;

        switch (method) {
            case HttpMethod.GET: {
                response = await API.get(apiName, path, init);
                break;
            }
            case HttpMethod.PUT: {
                response = await API.put(apiName, path, init);
                break;
            }
            case HttpMethod.POST: {
                response = await API.post(apiName, path, init);
                break;
            }
            case HttpMethod.DELETE: {
                response = await API.del(apiName, path, init);
                break;
            }
            default:
                throw new Error(`Unsupported http method ${method}`);
        }

        return parseResponse(response, type, resource, params);
    };
};
