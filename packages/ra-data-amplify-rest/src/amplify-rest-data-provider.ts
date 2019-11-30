import API from '@aws-amplify/api';
import {
  DataProvider,
  GetListResult,
  GetOneResult,
  GetManyResult,
  GetManyReferenceResult,
  UpdateResult,
  UpdateManyResult,
  CreateResult,
  DeleteResult,
  DeleteManyResult,
} from 'ra-core';

import { ResponseParser, defaultResponseParser } from './response-parser';
import { RequestBuilder, defaultRequestBuilder } from './request-builder';

export interface AmplifyRestDataProviderOptions {
  apiName: string;
  responseParser?: ResponseParser;
  requestBuilder?: RequestBuilder;
}

export const amplifyRestDataProvider = (
  options: AmplifyRestDataProviderOptions
): DataProvider => {
  const {
    apiName,
    responseParser = defaultResponseParser,
    requestBuilder = defaultRequestBuilder,
  } = options;

  return {
    async getList(resource, params): Promise<GetListResult> {
      const { path, init } = requestBuilder.getList(resource, params);
      const response = await API.get(apiName, path, init);
      return responseParser.getList(response, resource, params);
    },
    async getOne(resource, params): Promise<GetOneResult> {
      const { path, init } = requestBuilder.getOne(resource, params);
      const response = await API.get(apiName, path, init);
      return responseParser.getOne(response, resource, params);
    },
    async getMany(resource, params): Promise<GetManyResult> {
      const { path, init } = requestBuilder.getMany(resource, params);
      const response = await API.get(apiName, path, init);
      return responseParser.getMany(response, resource, params);
    },
    async getManyReference(resource, params): Promise<GetManyReferenceResult> {
      const { path, init } = requestBuilder.getManyReference(resource, params);
      const response = await API.get(apiName, path, init);
      return responseParser.getManyReference(response, resource, params);
    },
    async update(resource, params): Promise<UpdateResult> {
      const { path, init } = requestBuilder.update(resource, params);
      const response = await API.put(apiName, path, init);
      return responseParser.update(response, resource, params);
    },
    async updateMany(resource, params): Promise<UpdateManyResult> {
      //TODO
      const { path, init } = requestBuilder.updateMany(resource, params);
      const response = await API.put(apiName, path, init);
      return responseParser.updateMany(response, resource, params);
    },
    async create(resource, params): Promise<CreateResult> {
      const { path, init } = requestBuilder.create(resource, params);
      const response = await API.post(apiName, path, init);
      return responseParser.create(response, resource, params);
    },
    async delete(resource, params): Promise<DeleteResult> {
      const { path, init } = requestBuilder.delete(resource, params);
      const response = await API.del(apiName, path, init);
      return responseParser.delete(response, resource, params);
    },
    async deleteMany(resource, params): Promise<DeleteManyResult> {
      //TODO
      const { path, init } = requestBuilder.deleteMany(resource, params);
      const response = await API.del(apiName, path, init);
      return responseParser.deleteMany(response, resource, params);
    },
  };
};
