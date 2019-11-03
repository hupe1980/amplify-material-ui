import {
    UPDATE_MANY,
    DELETE_MANY,
    UPDATE,
    DELETE,
    LegacyDataProvider,
    convertLegacyDataProvider,
} from 'ra-core';

import { buildDataRequest } from './build-data-request';
import { parseResponse } from './parse-response';
import {
    buildDataProvider,
    BuildDataProviderOptions,
} from './build-data-provider';

import { Params } from './types';

const defaultOptions = {
    buildDataRequest,
    parseResponse,
};

export interface DataProviderOptions extends Partial<BuildDataProviderOptions> {
    apiName: string;
}

export default (options: DataProviderOptions): LegacyDataProvider => {
    const dataProvider = buildDataProvider({ ...defaultOptions, ...options });

    return convertLegacyDataProvider(
        async (
            type: string,
            resource: string,
            params: Params,
        ): Promise<any> => {
            if (type === UPDATE_MANY) {
                const { ids, data, ...otherParams } = params;

                if (!ids) return;

                const responses = await Promise.all(
                    ids.map(id =>
                        dataProvider(UPDATE, resource, {
                            data: {
                                id,
                                ...data,
                            },
                            ...otherParams,
                        }),
                    ),
                );

                return {
                    data: responses.map(response => response.data),
                };
            }

            if (type === DELETE_MANY) {
                const { ids, ...otherParams } = params;

                if (!ids) return;

                const responses = await Promise.all(
                    ids.map(id =>
                        dataProvider(DELETE, resource, {
                            id,
                            ...otherParams,
                        }),
                    ),
                );

                return {
                    data: responses.map(response => response.data),
                };
            }

            return dataProvider(type, resource, params);
        },
    );
};

export { buildDataRequest, parseResponse, buildDataProvider };

export * from './types';
