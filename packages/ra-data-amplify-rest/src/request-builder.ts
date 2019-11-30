import {
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

export interface Init {
  headers?: {};
  body?: {};
  response?: boolean; // OPTIONAL (return the entire Axios response object instead of only response.data)
  queryStringParameters?: {
    [key: string]: string;
  };
}

export interface RequestBuilderMethodResult {
  path: string;
  init: Init;
}

export type RequestBuilderMethod<P> = (
  resource: string,
  parmas: P
) => RequestBuilderMethodResult;

export interface RequestBuilder {
  getList: RequestBuilderMethod<GetListParams>;
  getOne: RequestBuilderMethod<GetOneParams>;
  getMany: RequestBuilderMethod<GetManyParams>;
  getManyReference: RequestBuilderMethod<GetManyReferenceParams>;
  update: RequestBuilderMethod<UpdateParams>;
  updateMany: RequestBuilderMethod<UpdateManyParams>;
  create: RequestBuilderMethod<CreateParams>;
  delete: RequestBuilderMethod<DeleteParams>;
  deleteMany: RequestBuilderMethod<DeleteManyParams>;
}

export const defaultRequestBuilder: RequestBuilder = {
  getList: (resource, params): RequestBuilderMethodResult => {
    const { page, perPage } = params.pagination;

    const { field, order } = params.sort;

    const init = {
      queryStringParameters: {
        sort: JSON.stringify([field, order]),
        range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
        filter: JSON.stringify(params.filter),
      },
    };

    const path = `/${resource}`;

    return {
      path,
      init,
    };
  },
  getOne: (resource, params): RequestBuilderMethodResult => {
    const init = {};

    const path = `/${resource}/${params.id}`;

    return {
      path,
      init,
    };
  },
  getMany: (resource, params): RequestBuilderMethodResult => {
    const init = {
      queryStringParameters: {
        filter: JSON.stringify({ id: params.ids }),
      },
    };

    const path = `/${resource}`;

    return {
      path,
      init,
    };
  },
  getManyReference: (resource, params): RequestBuilderMethodResult => {
    const { page, perPage } = params.pagination;

    const { field, order } = params.sort;

    const init = {
      queryStringParameters: {
        sort: JSON.stringify([field, order]),
        range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
        filter: JSON.stringify({
          ...params.filter,
          [params.target]: params.id,
        }),
      },
    };

    const path = `/${resource}`;

    return {
      path,
      init,
    };
  },
  update: (resource, params): RequestBuilderMethodResult => {
    const init = {
      body: params.data,
    };

    const path = `/${resource}/${params.id}`;

    return {
      path,
      init,
    };
  },
  updateMany: (_resource, _params): RequestBuilderMethodResult => {
    //TODO
    const init = {};
    const path = '';

    return {
      path,
      init,
    };
  },
  create: (resource, params): RequestBuilderMethodResult => {
    const init = {
      body: params.data,
    };

    const path = `/${resource}`;

    return {
      path,
      init,
    };
  },
  delete: (resource, params): RequestBuilderMethodResult => {
    const init = {};

    const path = `/${resource}/${params.id}`;

    return {
      path,
      init,
    };
  },
  deleteMany: (_resource, _params): RequestBuilderMethodResult => {
    //TODO
    const init = {};
    const path = '';

    return {
      path,
      init,
    };
  },
};
