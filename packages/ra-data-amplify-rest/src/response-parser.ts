import {
  GetListResult,
  GetOneResult,
  GetManyResult,
  GetManyReferenceResult,
  UpdateResult,
  UpdateManyResult,
  CreateResult,
  DeleteResult,
  DeleteManyResult,
  GetListParams,
  GetManyReferenceParams,
  GetOneParams,
  GetManyParams,
  UpdateParams,
  UpdateManyParams,
  CreateParams,
  DeleteParams,
  DeleteManyParams,
} from 'ra-core';

export type ResponseParserMethod<P, T> = (
  response: any,
  resource: string,
  params: P
) => T;

export interface ResponseParser {
  getList: ResponseParserMethod<GetListParams, GetListResult>;
  getOne: ResponseParserMethod<GetOneParams, GetOneResult>;
  getMany: ResponseParserMethod<GetManyParams, GetManyResult>;
  getManyReference: ResponseParserMethod<
    GetManyReferenceParams,
    GetManyReferenceResult
  >;
  update: ResponseParserMethod<UpdateParams, UpdateResult>;
  updateMany: ResponseParserMethod<UpdateManyParams, UpdateManyResult>;
  create: ResponseParserMethod<CreateParams, CreateResult>;
  delete: ResponseParserMethod<DeleteParams, DeleteResult>;
  deleteMany: ResponseParserMethod<DeleteManyParams, DeleteManyResult>;
}

export const defaultResponseParser: ResponseParser = {
  getList: (response, _resource, _params): GetListResult => {
    const { headers, data } = response;

    if (!headers || !headers.has('x-total-count')) {
      throw new Error(
        'The x-total-count header is missing in the HTTP Response. The amplify REST data provider expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare X-Total-Count in the Access-Control-Expose-Headers header?'
      );
    }

    return {
      data,
      total: parseInt(headers.get('x-total-count').split('/').pop(), 10),
    };
  },

  getOne: (response, _resource, _params): GetOneResult => {
    return {
      data: response?.data,
    };
  },

  getMany: (response, _resource, _params): GetManyResult => {
    return {
      data: response?.data,
    };
  },

  getManyReference: (response, _resource, _params): GetManyReferenceResult => {
    const { headers } = response;

    if (!headers || !headers.has('x-total-count')) {
      throw new Error(
        'The x-total-count header is missing in the HTTP Response. The amplify REST data provider expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare X-Total-Count in the Access-Control-Expose-Headers header?'
      );
    }

    return {
      data: response?.data,
      total: parseInt(headers.get('x-total-count').split('/').pop(), 10),
    };
  },

  update: (response, _resource, _params): UpdateResult => {
    return {
      data: response?.data,
    };
  },

  updateMany: (response, _resource, _params): UpdateManyResult => {
    return {
      data: response?.data,
    };
  },

  create: (response, _resource, params): CreateResult => {
    const { data } = response;
    return { data: { ...params.data, id: data.id } };
  },

  delete: (response, _resource, _params): DeleteResult => {
    return {
      data: response?.data,
    };
  },

  deleteMany: (response, _resource, _params): DeleteManyResult => {
    return { data: response?.data || [] };
  },
};
