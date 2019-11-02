import API from '@aws-amplify/api';

import { buildDataRequest } from './build-data-request';
import { parseResponse } from './parse-response';
import { Params, Method } from './types';
import { LegacyDataProvider } from 'ra-core';

export interface BuildDataProviderOptions {
    apiName: string;
    buildDataRequest: typeof buildDataRequest;
    parseResponse: typeof parseResponse;
}

export const buildDataProvider = (
    options: BuildDataProviderOptions,
): LegacyDataProvider => {
    const { apiName, parseResponse, buildDataRequest } = options;

    return async (
        type: string,
        resource: string,
        params: Params,
    ): Promise<any> => {
        const { path, method, init } = buildDataRequest(type, resource, params);

        let response;

        switch (method) {
            case Method.GET: {
                response = await API.get(apiName, path, init);
                break;
            }
            case Method.PUT: {
                response = await API.put(apiName, path, init);
                break;
            }
            case Method.POST: {
                response = await API.post(apiName, path, init);
                break;
            }
            case Method.DELETE: {
                response = await API.del(apiName, path, init);
                break;
            }
            default:
                throw new Error(`Unsupported http method ${method}`);
        }

        return parseResponse(response, type, resource, params);
    };
};
