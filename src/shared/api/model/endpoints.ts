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

/** UrlPathType */
export enum UrlPathType {
  Image = "image",
  Video = "video",
}

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

/** NotificationType */
export enum NotificationType {
  JoinRequest = "join_request",
}

/** GymerMasterStatus */
export enum GymerMasterStatus {
  CurrentMaster = "current_master",
  RejectedRequest = "rejected_request",
  AwaitedRequest = "awaited_request",
  AcceptsRequests = "accepts_requests",
}

/** ExerciseStatus */
export enum ExerciseStatus {
  Active = "active",
  Archive = "archive",
}

/** Body_add_exercise_image_gym_exercise__exercise_id__image_post */
export interface BodyAddExerciseImageGymExerciseExerciseIdImagePost {
  /**
   * Image
   * image
   * @format binary
   */
  image: File;
}

/** Body_add_user_image_gym_user__user_id__image_post */
export interface BodyAddUserImageGymUserUserIdImagePost {
  /**
   * Image
   * image
   * @format binary
   */
  image: File;
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
  /**
   * Link Type
   * @default "video"
   */
  link_type?: string;
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
  /** Url Path List */
  url_path_list?: UrlPath[];
}

/** ExerciseAggregate */
export interface ExerciseAggregateInput {
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
  /** Url Path List */
  url_path_list?: UrlPath[];
  /** Links */
  links?: Link[];
}

/** ExerciseAggregate */
export interface ExerciseAggregateOutput {
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
  /** Url Path List */
  url_path_list?: UrlPath[];
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
  /**
   * Create Dttm
   * @format date-time
   */
  create_dttm: string;
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
  /** Link Type */
  link_type: string | null;
}

/** Master */
export interface Master {
  /** Master Id */
  master_id?: number | null;
  /** User Id */
  user_id?: number | null;
  /** Is Active */
  is_active?: boolean | null;
  /** Create Dttm */
  create_dttm?: string | null;
  /** Is Private */
  is_private?: boolean | null;
  /** Description */
  description?: string | null;
}

/** MasterProfile */
export interface MasterProfile {
  /** Username */
  username?: string | null;
  /** First Name */
  first_name?: string | null;
  /** Last Name */
  last_name?: string | null;
  /** Telegram Id */
  telegram_id?: number | null;
  /** Master Id */
  master_id?: number | null;
  /** User Id */
  user_id?: number | null;
  /** Create Dttm */
  create_dttm?: string | null;
  /** Description */
  description?: string | null;
  status?: GymerMasterStatus | null;
  /** Photos */
  photos?: string[];
  /** Photo */
  photo?: string | null;
}

/** MastersGymer */
export interface MastersGymer {
  /** First Name */
  first_name?: string | null;
  /** Last Name */
  last_name?: string | null;
  /** Username */
  username?: string | null;
  /** Photo */
  photo?: string | null;
  /** Gymer Id */
  gymer_id: number;
  /** User Id */
  user_id: number;
}

/** NotificationResponse */
export interface NotificationResponse {
  /** Notification Id */
  notification_id: number;
  /** Recipient */
  recipient: number;
  /** Sender */
  sender: number;
  /** Message */
  message?: string | null;
  /** Is Read */
  is_read: boolean;
  /**
   * Created Dttm
   * @format date-time
   */
  created_dttm: string;
  notification_type: NotificationType;
}

/** NotificationUserResponse */
export interface NotificationUserResponse {
  /** Notification Id */
  notification_id: number;
  /** Recipient */
  recipient: number;
  /** Sender */
  sender: number;
  /** Message */
  message?: string | null;
  /** Is Read */
  is_read: boolean;
  /**
   * Created Dttm
   * @format date-time
   */
  created_dttm: string;
  notification_type: NotificationType;
  sender_user?: User | null;
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
  exercise?: ExerciseAggregateOutput | null;
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

/** UrlPath */
export interface UrlPath {
  /** Url Path Id */
  url_path_id: number;
  /** Exercise Id */
  exercise_id: number;
  /** Url Path */
  url_path: string;
  /**
   * Moderation Flg
   * @default false
   */
  moderation_flg?: boolean;
  /**
   * Available Flg
   * @default false
   */
  available_flg?: boolean;
  url_path_type?: UrlPathType | null;
  /** Create Dttm */
  create_dttm?: string | null;
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
  telegram_id?: number | null;
  /** Photo */
  photo?: string | null;
  /** Photos */
  photos?: string[] | null;
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
 * @version 2.4.0
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
     * @secure
     */
    getListOfMastersGymer: (masterId: number, params: RequestParams = {}) =>
      this.request<MastersGymer[], HTTPValidationError>({
        path: `/gym/user/${masterId}/gymers`,
        method: "GET",
        secure: true,
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
     * @secure
     */
    getUserDataByTelegramId: (telegramId: number, params: RequestParams = {}) =>
      this.request<User, HTTPValidationError>({
        path: `/gym/user/${telegramId}`,
        method: "GET",
        secure: true,
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
     * @secure
     */
    addUser: (data: UserIn, params: RequestParams = {}) =>
      this.request<User, HTTPValidationError>({
        path: `/gym/user`,
        method: "POST",
        body: data,
        secure: true,
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
     * @secure
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
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name AddUserImage
     * @summary Adding user image
     * @request POST:/gym/user/{user_id}/image
     * @secure
     */
    addUserImage: (
      userId: number,
      data: BodyAddUserImageGymUserUserIdImagePost,
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/gym/user/${userId}/image`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name DeleteUserImage
     * @summary Delete user image
     * @request DELETE:/gym/user/{user_id}/image
     * @secure
     */
    deleteUserImage: (
      userId: number,
      query: {
        /**
         * Image Url
         * image url
         */
        image_url: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, HTTPValidationError>({
        path: `/gym/user/${userId}/image`,
        method: "DELETE",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name GetMastersProfiles
     * @summary Master's list
     * @request GET:/gym/user/all/masters
     * @secure
     */
    getMastersProfiles: (
      query: {
        /**
         * Gymer Id
         * gymer id
         */
        gymer_id: number;
        /**
         * Page
         * Page number
         */
        page?: number | null;
        /**
         * Size
         * Page size
         */
        size?: number | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<MasterProfile[], HTTPValidationError>({
        path: `/gym/user/all/masters`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name GetMasters
     * @summary master_id if exists
     * @request GET:/gym/user/master/{gymer_id}
     * @secure
     */
    getMasters: (gymerId: number, params: RequestParams = {}) =>
      this.request<number | null, HTTPValidationError>({
        path: `/gym/user/master/${gymerId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MasterGymerBreak
     * @summary break master gymer
     * @request GET:/gym/user/master_gymer_break/
     */
    masterGymerBreak: (
      query: {
        /**
         * Gymer Id
         * gymer_id
         */
        gymer_id: number;
        /**
         * Master Id
         * master_id
         */
        master_id: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/gym/user/master_gymer_break/`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UpdateMasterProfile
     * @summary update master profile
     * @request PUT:/gym/user/master/{master_id}
     */
    updateMasterProfile: (
      masterId: number,
      query?: {
        /**
         * Description
         * profile description
         */
        description?: string | null;
        /**
         * Is Private
         * private profile flag
         */
        is_private?: boolean | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<Master, HTTPValidationError>({
        path: `/gym/user/master/${masterId}`,
        method: "PUT",
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
     * @secure
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
        secure: true,
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
     * @secure
     */
    updateTask: (data: UpdateTask, params: RequestParams = {}) =>
      this.request<TaskAggregate, HTTPValidationError>({
        path: `/gym/task`,
        method: "PUT",
        body: data,
        secure: true,
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
     * @secure
     */
    getTasksWithExerciseByGroup: (
      taskGroupId: number,
      params: RequestParams = {},
    ) =>
      this.request<TaskAggregate[], HTTPValidationError>({
        path: `/gym/task/tasks/${taskGroupId}`,
        method: "GET",
        secure: true,
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
     * @secure
     */
    reorderTask: (data: TaskOrderIndex[], params: RequestParams = {}) =>
      this.request<any, HTTPValidationError>({
        path: `/gym/task/reorder`,
        method: "PUT",
        body: data,
        secure: true,
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
     * @secure
     */
    deleteTask: (taskId: number, params: RequestParams = {}) =>
      this.request<any, HTTPValidationError>({
        path: `/gym/task/${taskId}`,
        method: "DELETE",
        secure: true,
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
     * @secure
     */
    getTaskByTaskId: (taskId: number, params: RequestParams = {}) =>
      this.request<TaskAggregate | null, HTTPValidationError>({
        path: `/gym/task/${taskId}`,
        method: "GET",
        secure: true,
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
     * @secure
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
        secure: true,
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
     * @secure
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
        secure: true,
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
     * @secure
     */
    reorderTaskGroup: (
      data: TaskGroupOrderIndex[],
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/gym/task_group/reorder`,
        method: "PUT",
        body: data,
        secure: true,
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
     * @secure
     */
    deleteTaskGroup: (taskGroupId: number, params: RequestParams = {}) =>
      this.request<any, HTTPValidationError>({
        path: `/gym/task_group/${taskGroupId}`,
        method: "DELETE",
        secure: true,
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
     * @secure
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
        secure: true,
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
     * @secure
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
        secure: true,
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
     * @secure
     */
    copyTaskGroup: (taskGroupId: number, params: RequestParams = {}) =>
      this.request<TaskGroupAggregate, HTTPValidationError>({
        path: `/gym/task_group/copy/${taskGroupId}`,
        method: "POST",
        secure: true,
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
     * @secure
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
        secure: true,
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
     * @secure
     */
    getExercise: (exerciseId: number, params: RequestParams = {}) =>
      this.request<ExerciseAggregateOutput, HTTPValidationError>({
        path: `/gym/exercise/id/${exerciseId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags exercise
     * @name DeleteExerciseImage
     * @summary Delete url_path
     * @request DELETE:/gym/exercise/url_path/{url_path_id}
     * @secure
     */
    deleteExerciseImage: (urlPathId: number, params: RequestParams = {}) =>
      this.request<void, HTTPValidationError>({
        path: `/gym/exercise/url_path/${urlPathId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags exercise
     * @name UpdateExercise
     * @summary Update exercise
     * @request PUT:/gym/exercise
     * @secure
     */
    updateExercise: (
      data: ExerciseAggregateInput,
      params: RequestParams = {},
    ) =>
      this.request<ExerciseAggregateOutput, HTTPValidationError>({
        path: `/gym/exercise`,
        method: "PUT",
        body: data,
        secure: true,
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
     * @secure
     */
    createExercise: (data: CreateExercise, params: RequestParams = {}) =>
      this.request<ExerciseAggregateOutput, HTTPValidationError>({
        path: `/gym/exercise`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags exercise
     * @name AddExerciseImage
     * @summary Adding exercise image
     * @request POST:/gym/exercise/{exercise_id}/image
     * @secure
     */
    addExerciseImage: (
      exerciseId: number,
      data: BodyAddExerciseImageGymExerciseExerciseIdImagePost,
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/gym/exercise/${exerciseId}/image`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags exercise
     * @name AddExerciseLink
     * @summary Adding link to exercise
     * @request POST:/gym/exercise/{exercise_id}/link
     * @secure
     */
    addExerciseLink: (
      exerciseId: number,
      query: {
        /**
         * Link
         * link
         */
        link: string;
        /**
         * link type
         * @default "video"
         */
        type_link?: UrlPathType;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/gym/exercise/${exerciseId}/link`,
        method: "POST",
        query: query,
        secure: true,
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
     * @secure
     */
    copyExercise: (exerciseId: number, params: RequestParams = {}) =>
      this.request<ExerciseAggregateOutput, HTTPValidationError>({
        path: `/gym/exercise/copy/${exerciseId}`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags exercise
     * @name DeleteExercise
     * @summary Delete exercise by exercise_id
     * @request DELETE:/gym/exercise/{exercise_id}
     * @secure
     */
    deleteExercise: (exerciseId: number, params: RequestParams = {}) =>
      this.request<void, HTTPValidationError>({
        path: `/gym/exercise/${exerciseId}`,
        method: "DELETE",
        secure: true,
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
     * @secure
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
        secure: true,
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
     * @secure
     */
    createLink: (data: CreateLink, params: RequestParams = {}) =>
      this.request<Link, HTTPValidationError>({
        path: `/gym/link`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  notification = {
    /**
     * No description
     *
     * @tags notification
     * @name JoinMasterRequest
     * @summary Join Master Request
     * @request POST:/gym/notification/join_master
     * @secure
     */
    joinMasterRequest: (
      query: {
        /**
         * Sender
         * gymer's user_id
         */
        sender: number;
        /**
         * Recipient
         * master's user_id
         */
        recipient: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<NotificationResponse, HTTPValidationError>({
        path: `/gym/notification/join_master`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags notification
     * @name RecipientNotification
     * @summary Recipient Notification
     * @request GET:/gym/notification/recipient/{user_id}
     * @secure
     */
    recipientNotification: (
      userId: number,
      query?: {
        /**
         * Is Read
         * is read flag
         * @default false
         */
        is_read?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<NotificationUserResponse[], HTTPValidationError>({
        path: `/gym/notification/recipient/${userId}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags notification
     * @name RecipientSender
     * @summary Recipient Sender
     * @request GET:/gym/notification/sender/{user_id}
     * @secure
     */
    recipientSender: (
      userId: number,
      query?: {
        /**
         * Is Read
         * is read flag
         * @default false
         */
        is_read?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<NotificationResponse[], HTTPValidationError>({
        path: `/gym/notification/sender/${userId}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags notification
     * @name CloseJoinRequest
     * @summary Close Join Request
     * @request POST:/gym/notification/close_join_request/{notification_id}
     * @secure
     */
    closeJoinRequest: (
      notificationId: number,
      query: {
        /**
         * Accept Flg
         * accept flag
         */
        accept_flg: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/gym/notification/close_join_request/${notificationId}`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  debug = {
    /**
     * No description
     *
     * @name DebugHeaders
     * @summary Debug Headers
     * @request GET:/debug/headers
     */
    debugHeaders: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/debug/headers`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
}
