/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** Exercise */
export interface Exercise {
  /** Exercise Id */
  exercise_id: number;
  /** Title */
  title: string;
  /** Master Id */
  master_id: number;
}

/** ExerciseDescSimple */
export interface ExerciseDescSimple {
  /** Exercise Id */
  exercise_id: number;
  /** Exercise Desc Id */
  exercise_desc_id: number;
  /** Description */
  description: string;
  exercise: Exercise;
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** MastersGymer */
export interface MastersGymer {
  /** First Name */
  first_name?: string | null;
  /** Last Name */
  last_name?: string | null;
  /** Username */
  username: string;
  /** Gymer Id */
  gymer_id: number;
}

/** Task */
export interface Task {
  /** Task Group Id */
  task_group_id: number;
  /** Exercise Desc Id */
  exercise_desc_id: number;
  /** Properties */
  properties: object;
  /**
   * Status
   * @default "planned"
   */
  status?: string;
  /** Task Id */
  task_id: number;
  /**
   * Create Dttm
   * @format date-time
   */
  create_dttm: string;
  /** Update Dttm */
  update_dttm: string | null;
}

/** TaskCreate */
export interface TaskCreate {
  /** Task Group Id */
  task_group_id: number;
  /** Exercise Desc Id */
  exercise_desc_id: number;
  /** Properties */
  properties: object;
  /**
   * Status
   * @default "planned"
   */
  status?: string;
}

/** TaskGroup */
export interface TaskGroup {
  /** Master Id */
  master_id: number;
  /** Gymer Id */
  gymer_id: number;
  /** Properties */
  properties?: object;
  /** Task Group Id */
  task_group_id: number;
  /**
   * Create Dttm
   * @format date-time
   */
  create_dttm: string;
  /** Update Dttm */
  update_dttm: string | null;
  /** Start Dttm */
  start_dttm: string | null;
  /** Num */
  num: number | null;
  /** Status */
  status: string;
}

/** TaskGroupCreate */
export interface TaskGroupCreate {
  /** Gymer Id */
  gymer_id: number;
  /** Properties */
  properties?: object;
}

/** TaskGroupWithTasks */
export interface TaskGroupWithTasks {
  /** Task Group Id */
  task_group_id: number;
  /** Status */
  status: string;
  /**
   * Create Dttm
   * @format date-time
   */
  create_dttm: string;
  /** Update Dttm */
  update_dttm: string | null;
  /** Num */
  num: number | null;
  /** Start Dttm */
  start_dttm: string | null;
  /** Task */
  task: TaskWithExercise[];
}

/** TaskUpdate */
export interface TaskUpdate {
  /** Exercise Desc Id */
  exercise_desc_id: number | null;
  /** Properties */
  properties: object | null;
}

/** TaskWithExercise */
export interface TaskWithExercise {
  /** Task Id */
  task_id: number;
  /** Status */
  status: string;
  /**
   * Create Dttm
   * @format date-time
   */
  create_dttm: string;
  /** Update Dttm */
  update_dttm: string | null;
  exercise_desc: ExerciseDescSimple;
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<T> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance
      .request({
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type ? { "Content-Type": type } : {}),
        },
        params: query,
        responseType: responseFormat,
        data: body,
        url: path,
      })
      .then((response) => response.data);
  };
}

/**
 * @title Api gym
 * @version 0.0.1
 */
export class Endpoints<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  gym = {
    /**
     * No description
     *
     * @tags user
     * @name GetListOfMastersGymer
     * @summary Getting a list of master gymers
     * @request GET:/gym/user/{master_id}/gymers
     */
    getListOfMastersGymer: (masterId: number, params: RequestParams = {}) =>
      this.request<MastersGymer[], HTTPValidationError>({
        path: `/gym/user/${masterId}/gymers`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags task
     * @name CreateTask
     * @summary Creating a new task
     * @request POST:/gym/task
     */
    createTask: (data: TaskCreate, params: RequestParams = {}) =>
      this.request<Task, HTTPValidationError>({
        path: `/gym/task`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags task
     * @name UpdateTask
     * @summary Updating task by task_id
     * @request PUT:/gym/task/{task_id}
     */
    updateTask: (
      taskId: number,
      data: TaskUpdate,
      params: RequestParams = {},
    ) =>
      this.request<Task, HTTPValidationError>({
        path: `/gym/task/${taskId}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags task
     * @name GetMasterTaskGroupsWithTasks
     * @summary Getting training history by master_id and gymmer_id
     * @request GET:/gym/task/{gymer_id}/history
     */
    getMasterTaskGroupsWithTasks: (
      gymerId: number,
      query?: {
        /** Master Id */
        master_id?: number | null;
        /**
         * Page No
         * Номер страницы
         * @default 1
         */
        page_no?: number;
        /**
         * Page Size
         * Размер страницы
         * @default 100
         */
        page_size?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<TaskGroupWithTasks[], HTTPValidationError>({
        path: `/gym/task/${gymerId}/history`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags task_group
     * @name CreateTaskGroup
     * @summary Creating task group
     * @request POST:/gym/task_group
     */
    createTaskGroup: (
      query: {
        /**
         * Master Id
         * master id
         */
        master_id: number;
      },
      data: TaskGroupCreate,
      params: RequestParams = {},
    ) =>
      this.request<TaskGroup, HTTPValidationError>({
        path: `/gym/task_group`,
        method: "POST",
        query: query,
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags task_group
     * @name ListTaskGroup
     * @summary Getting a list of task group
     * @request GET:/gym/task_group
     */
    listTaskGroup: (
      query?: {
        /**
         * Master Id
         * master id
         */
        master_id?: number | null;
        /**
         * Gymer Id
         * gymmer id
         */
        gymer_id?: number | null;
        /**
         * Status
         * Статус task_group
         * @default "planned"
         */
        status?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<TaskGroup[], HTTPValidationError>({
        path: `/gym/task_group`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags exercise
     * @name GetTasksWithExerciseByGroup
     * @summary Getgin a list of task by task_group_id
     * @request GET:/gym/exercise/{task_group_id}/tasks
     */
    getTasksWithExerciseByGroup: (
      taskGroupId: number,
      params: RequestParams = {},
    ) =>
      this.request<Task[], HTTPValidationError>({
        path: `/gym/exercise/${taskGroupId}/tasks`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags exercise
     * @name GetListOfExercise
     * @summary Getting a list of exercise by master_id
     * @request GET:/gym/exercise/{master_id}/exercises
     */
    getListOfExercise: (
      masterId: number,
      query?: {
        /**
         * Search
         * Поиск по названию упражнения
         */
        search?: string | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<Exercise[], HTTPValidationError>({
        path: `/gym/exercise/${masterId}/exercises`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags exercise
     * @name GetListOfExerciseDescription
     * @summary Getting a list of exercise description by exercise_id
     * @request GET:/gym/exercise/{exercise_id}/descriptions
     */
    getListOfExerciseDescription: (
      exerciseId: number,
      params: RequestParams = {},
    ) =>
      this.request<ExerciseDescSimple[], HTTPValidationError>({
        path: `/gym/exercise/${exerciseId}/descriptions`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
}
