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

/** TaskStatus */
export enum TaskStatus {
  Planned = "planned",
  Running = "running",
  Finished = "finished",
  Deleted = "deleted",
  Closed = "closed",
}

/** TaskGroupStatus */
export enum TaskGroupStatus {
  Planned = "planned",
  Running = "running",
  Finished = "finished",
  Deleted = "deleted",
  Closed = "closed",
}

/** ExerciseStatus */
export enum ExerciseStatus {
  Active = "active",
  Archive = "archive",
}

/** CreateExercise */
export interface CreateExercise {
  /** Master Id */
  master_id: number;
  /** Exercise Name */
  exercise_name: string | null;
  /** Description */
  description: string | null;
  /** @default "active" */
  status?: ExerciseStatus;
  /** Link Ids */
  link_ids: number[] | null;
}

/** CreateLink */
export interface CreateLink {
  /** Link */
  link: string;
  /** Title */
  title: string | null;
  /**
   * Master Id
   * @default 1
   */
  master_id?: number;
}

/** Exercise */
export interface Exercise {
  /** Exercise Id */
  exercise_id: number | null;
  /** Master Id */
  master_id: number;
  /** Exercise Name */
  exercise_name: string | null;
  /** Description */
  description: string | null;
  /** @default "active" */
  status?: ExerciseStatus;
}

/** ExerciseAggregate */
export interface ExerciseAggregate {
  /** Exercise Id */
  exercise_id: number | null;
  /** Master Id */
  master_id: number;
  /** Exercise Name */
  exercise_name: string | null;
  /** Description */
  description: string | null;
  /** @default "active" */
  status?: ExerciseStatus;
  /** Links */
  links?: Link[];
}

/** Gymer */
export interface Gymer {
  /** Gymer Id */
  gymer_id: number;
  /** User Id */
  user_id: number;
  /** Is Active */
  is_active: boolean;
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** Link */
export interface Link {
  /** Link Id */
  link_id: number;
  /** Link */
  link: string;
  /** Title */
  title: string | null;
  /** Master Id */
  master_id: number;
}

/** Master */
export interface Master {
  /** Master Id */
  master_id: number;
  /** User Id */
  user_id: number;
  /** Is Active */
  is_active: boolean;
}

/** MastersGymer */
export interface MastersGymer {
  /** First Name */
  first_name?: string | null;
  /** Last Name */
  last_name?: string | null;
  /** Username */
  username: string;
  /** Photo */
  photo?: string | null;
  /** Gymer Id */
  gymer_id: number;
}

/** Set */
export interface Set {
  /** Set Id */
  set_id: number;
  /** Task Properties Id */
  task_properties_id: number;
  /** Fact Value */
  fact_value: number | null;
  /** Fact Rep */
  fact_rep: number | null;
  /** Plan Value */
  plan_value: number | null;
  /** Plan Rep */
  plan_rep: number | null;
}

/** SetUpdate */
export interface SetUpdate {
  /** Set Id */
  set_id?: number | null;
  /** Fact Value */
  fact_value?: number | null;
  /** Fact Rep */
  fact_rep?: number | null;
  /** Plan Value */
  plan_value?: number | null;
  /** Plan Rep */
  plan_rep?: number | null;
}

/** TaskAggregate */
export interface TaskAggregate {
  /** Task Id */
  task_id: number;
  /** Task Group Id */
  task_group_id: number;
  /** Exercise Id */
  exercise_id: number | null;
  status: TaskStatus;
  /**
   * Create Dttm
   * @format date-time
   */
  create_dttm: string;
  /** Update Dttm */
  update_dttm: string | null;
  /** Order Idx */
  order_idx: number | null;
  exercise?: ExerciseAggregate | null;
  task_properties?: TaskPropertiesAggregate | null;
}

/** TaskGroup */
export interface TaskGroup {
  /** Task Group Id */
  task_group_id: number;
  /** Title */
  title: string | null;
  /** Master Id */
  master_id: number;
  /** Gymer Id */
  gymer_id: number;
  status: TaskGroupStatus;
  /**
   * Create Dttm
   * @format date-time
   */
  create_dttm: string;
  /** Update Dttm */
  update_dttm: string | null;
  /** Start Dttm */
  start_dttm: string | null;
  /** Order Idx */
  order_idx: number | null;
}

/** TaskGroupAggregate */
export interface TaskGroupAggregate {
  /** Task Group Id */
  task_group_id: number;
  /** Title */
  title: string | null;
  /** Master Id */
  master_id: number;
  /** Gymer Id */
  gymer_id: number;
  status: TaskGroupStatus;
  /**
   * Create Dttm
   * @format date-time
   */
  create_dttm: string;
  /** Update Dttm */
  update_dttm: string | null;
  /** Start Dttm */
  start_dttm: string | null;
  /** Order Idx */
  order_idx: number | null;
  /** Tasks */
  tasks?: TaskAggregate[];
}

/** TaskGroupOrderIndex */
export interface TaskGroupOrderIndex {
  /** Task Group Id */
  task_group_id: number;
  /** Order Idx */
  order_idx: number;
}

/** TaskOrderIndex */
export interface TaskOrderIndex {
  /** Task Id */
  task_id: number;
  /** Order Idx */
  order_idx: number;
}

/** TaskPropertiesAggregate */
export interface TaskPropertiesAggregate {
  /** Task Properties Id */
  task_properties_id: number;
  /** Task Id */
  task_id: number;
  /** Max Weight */
  max_weight: number | null;
  /** Min Weight */
  min_weight: number | null;
  /** Rest */
  rest: number | null;
  /** Sets */
  sets?: Set[];
}

/** TaskPropertiesAggregateUpdate */
export interface TaskPropertiesAggregateUpdate {
  /** Max Weight */
  max_weight: number | null;
  /** Min Weight */
  min_weight: number | null;
  /** Rest */
  rest: number | null;
  /** Sets */
  sets?: SetUpdate[];
}

/** UpdateTask */
export interface UpdateTask {
  /** Task Id */
  task_id: number;
  /** Exercise Id */
  exercise_id: number;
  status: TaskStatus | null;
  task_properties?: TaskPropertiesAggregateUpdate | null;
}

/** User */
export interface User {
  /** User Id */
  user_id: number;
  /** Username */
  username?: string | null;
  /** Phone */
  phone?: string | null;
  /** First Name */
  first_name?: string | null;
  /** Last Name */
  last_name?: string | null;
  /** Email */
  email?: string | null;
  /** Telegram Id */
  telegram_id: number;
  /** Photo */
  photo?: string | null;
  master?: Master | null;
  gymer?: Gymer | null;
}

/** UserIn */
export interface UserIn {
  /** Username */
  username?: string | null;
  /** Phone */
  phone?: string | null;
  /** First Name */
  first_name?: string | null;
  /** Last Name */
  last_name?: string | null;
  /** Email */
  email?: string | null;
  /** Telegram Id */
  telegram_id: number;
  /** Photo */
  photo?: string | null;
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
  user = {
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
     * @tags user
     * @name GetUserDataByTelegramId
     * @summary Getting user data by telegram_id
     * @request GET:/gym/user/{telegram_id}
     */
    getUserDataByTelegramId: (telegramId: number, params: RequestParams = {}) =>
      this.request<User, HTTPValidationError>({
        path: `/gym/user/${telegramId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name AddUser
     * @summary Adding user
     * @request POST:/gym/user
     */
    addUser: (data: UserIn, params: RequestParams = {}) =>
      this.request<User, HTTPValidationError>({
        path: `/gym/user`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name AddGymerForMaster
     * @summary Adding gymer for master
     * @request POST:/gym/user/{master_id}/gymer_id
     */
    addGymerForMaster: (
      masterId: number,
      query: {
        /**
         * Gymer Id
         * gymer id
         */
        gymer_id: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<MastersGymer[], HTTPValidationError>({
        path: `/gym/user/${masterId}/gymer_id`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),
  };
  task = {
    /**
     * No description
     *
     * @tags task
     * @name CreateTask
     * @summary Creating a new task
     * @request POST:/gym/task
     */
    createTask: (
      query: {
        /**
         * Task Group Id
         * task_group_id
         */
        task_group_id: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<TaskAggregate | null, HTTPValidationError>({
        path: `/gym/task`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags task
     * @name UpdateTask
     * @summary Update task
     * @request PUT:/gym/task
     */
    updateTask: (data: UpdateTask, params: RequestParams = {}) =>
      this.request<TaskAggregate, HTTPValidationError>({
        path: `/gym/task`,
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
     * @name GetTasksWithExerciseByGroup
     * @summary Getting a list of task by task_group_id
     * @request GET:/gym/task/tasks/{task_group_id}
     */
    getTasksWithExerciseByGroup: (
      taskGroupId: number,
      params: RequestParams = {},
    ) =>
      this.request<TaskAggregate[], HTTPValidationError>({
        path: `/gym/task/tasks/${taskGroupId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags task
     * @name ReorderTask
     * @summary Change order position task
     * @request PUT:/gym/task/reorder
     */
    reorderTask: (data: TaskOrderIndex[], params: RequestParams = {}) =>
      this.request<any, HTTPValidationError>({
        path: `/gym/task/reorder`,
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
     * @name DeleteTask
     * @summary Delete task
     * @request DELETE:/gym/task/{task_id}
     */
    deleteTask: (taskId: number, params: RequestParams = {}) =>
      this.request<any, HTTPValidationError>({
        path: `/gym/task/${taskId}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags task
     * @name GetTaskByTaskId
     * @summary Getting task by task_id
     * @request GET:/gym/task/{task_id}
     */
    getTaskByTaskId: (taskId: number, params: RequestParams = {}) =>
      this.request<TaskAggregate | null, HTTPValidationError>({
        path: `/gym/task/${taskId}`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  taskGroup = {
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
        /**
         * Gymer Id
         * gymer id
         */
        gymer_id: number;
        /**
         * Title
         * title
         */
        title?: string | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<TaskGroup, HTTPValidationError>({
        path: `/gym/task_group`,
        method: "POST",
        query: query,
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
      query: {
        /**
         * Master Id
         * master id
         */
        master_id?: number | null;
        /**
         * Gymer Id
         * gymmer id
         */
        gymer_id: number;
        /**
         * Status
         * Статус task_group
         */
        status?: TaskGroupStatus | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<TaskGroupAggregate[], HTTPValidationError>({
        path: `/gym/task_group`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags task_group
     * @name ReorderTaskGroup
     * @summary Change order position task_group
     * @request PUT:/gym/task_group/reorder
     */
    reorderTaskGroup: (
      data: TaskGroupOrderIndex[],
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/gym/task_group/reorder`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags task_group
     * @name DeleteTaskGroup
     * @summary Delete task_group
     * @request DELETE:/gym/task_group/{task_group_id}
     */
    deleteTaskGroup: (taskGroupId: number, params: RequestParams = {}) =>
      this.request<any, HTTPValidationError>({
        path: `/gym/task_group/${taskGroupId}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags task_group
     * @name TaskGroupById
     * @summary Getting task group by id
     * @request GET:/gym/task_group/{task_group_id}
     */
    taskGroupById: (taskGroupId: number, params: RequestParams = {}) =>
      this.request<TaskGroupAggregate | null, HTTPValidationError>({
        path: `/gym/task_group/${taskGroupId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags task_group
     * @name UpdateTaskGroupTitle
     * @summary update task_group title
     * @request PUT:/gym/task_group/{task_group_id}/title
     */
    updateTaskGroupTitle: (
      taskGroupId: number,
      query: {
        /**
         * Title
         * title task_group
         */
        title: string | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/gym/task_group/${taskGroupId}/title`,
        method: "PUT",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags task_group
     * @name UpdateTaskGroupStatus
     * @summary Update task_group status
     * @request PUT:/gym/task_group/{task_group_id}/status
     */
    updateTaskGroupStatus: (
      taskGroupId: number,
      query: {
        /** status task_group */
        status: TaskGroupStatus;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/gym/task_group/${taskGroupId}/status`,
        method: "PUT",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags task_group
     * @name CopyTaskGroup
     * @summary Creating task_group
     * @request POST:/gym/task_group/copy/{task_group_id}
     */
    copyTaskGroup: (taskGroupId: number, params: RequestParams = {}) =>
      this.request<TaskGroupAggregate, HTTPValidationError>({
        path: `/gym/task_group/copy/${taskGroupId}`,
        method: "POST",
        format: "json",
        ...params,
      }),
  };
  exercise = {
    /**
     * No description
     *
     * @tags exercise
     * @name GetListOfExercise
     * @summary Getting a list of exercise by master_id
     * @request GET:/gym/exercise/{master_id}
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
        path: `/gym/exercise/${masterId}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags exercise
     * @name GetExercise
     * @summary Get exercise by id
     * @request GET:/gym/exercise/id/{exercise_id}
     */
    getExercise: (exerciseId: number, params: RequestParams = {}) =>
      this.request<ExerciseAggregate, HTTPValidationError>({
        path: `/gym/exercise/id/${exerciseId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags exercise
     * @name UpdateExercise
     * @summary Update exercise
     * @request PUT:/gym/exercise
     */
    updateExercise: (data: ExerciseAggregate, params: RequestParams = {}) =>
      this.request<ExerciseAggregate, HTTPValidationError>({
        path: `/gym/exercise`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags exercise
     * @name CreateExercise
     * @summary Create exercise
     * @request POST:/gym/exercise
     */
    createExercise: (data: CreateExercise, params: RequestParams = {}) =>
      this.request<ExerciseAggregate, HTTPValidationError>({
        path: `/gym/exercise`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags exercise
     * @name CopyExercise
     * @summary Copy exercise
     * @request POST:/gym/exercise/copy/{exercise_id}
     */
    copyExercise: (exerciseId: number, params: RequestParams = {}) =>
      this.request<ExerciseAggregate, HTTPValidationError>({
        path: `/gym/exercise/copy/${exerciseId}`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags exercise
     * @name AddLinkToExercise
     * @summary Add link to exercise
     * @request POST:/gym/exercise/link
     */
    addLinkToExercise: (
      query: {
        /**
         * Exercise Id
         * exercise id
         */
        exercise_id: number;
        /**
         * Link Id
         * link id
         */
        link_id: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/gym/exercise/link`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags exercise
     * @name DeleteLinkFromExercise
     * @summary Delete link from exercise
     * @request DELETE:/gym/exercise/link
     */
    deleteLinkFromExercise: (
      query: {
        /**
         * Exercise Id
         * exercise id
         */
        exercise_id: number;
        /**
         * Link Id
         * link id
         */
        link_id: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, HTTPValidationError>({
        path: `/gym/exercise/link`,
        method: "DELETE",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags exercise
     * @name DeleteExercise
     * @summary Delete exercise by exercise_id
     * @request DELETE:/gym/exercise/{exercise_id}
     */
    deleteExercise: (exerciseId: number, params: RequestParams = {}) =>
      this.request<any, HTTPValidationError>({
        path: `/gym/exercise/${exerciseId}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),
  };
  link = {
    /**
     * No description
     *
     * @tags link
     * @name GetLinksById
     * @summary Getting a list of links by id
     * @request GET:/gym/link
     */
    getLinksById: (
      query: {
        /**
         * Link Ids
         * List link_ids
         */
        link_ids: number[];
      },
      params: RequestParams = {},
    ) =>
      this.request<Link[], HTTPValidationError>({
        path: `/gym/link`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags link
     * @name CreateLink
     * @summary Create Link
     * @request POST:/gym/link
     */
    createLink: (data: CreateLink, params: RequestParams = {}) =>
      this.request<Link, HTTPValidationError>({
        path: `/gym/link`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
