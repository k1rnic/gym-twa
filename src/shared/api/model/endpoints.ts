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

/** TaskGroupBlockType */
export enum TaskGroupBlockType {
  Superset = "superset",
  Dropset = "dropset",
  GiantSet = "giant_set",
  Triset = "triset",
  Circuit = "circuit",
  CompoundSet = "compound_set",
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
  link_ids?: number[] | null;
}

/** CreateTaskGroupBlock */
export interface CreateTaskGroupBlock {
  /**
   * Task Ids
   * @minItems 1
   */
  task_ids: number[];
  /** @default "superset" */
  group_type?: TaskGroupBlockType;
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
  /** Fact Value */
  fact_value?: number | "max" | null;
  /** Fact Rep */
  fact_rep?: number | "max" | null;
  /** Plan Value */
  plan_value?: number | "max" | null;
  /** Plan Rep */
  plan_rep?: number | "max" | null;
  /** Owner Id */
  owner_id?: number | null;
  /** Set Id */
  set_id: number;
  /** Task Properties Id */
  task_properties_id: number;
  owner?: UserBase | null;
}

/** SetUpdate */
export interface SetUpdate {
  /** Fact Value */
  fact_value?: number | "max" | null;
  /** Fact Rep */
  fact_rep?: number | "max" | null;
  /** Plan Value */
  plan_value?: number | "max" | null;
  /** Plan Rep */
  plan_rep?: number | "max" | null;
  /** Owner Id */
  owner_id?: number | null;
  /** Set Id */
  set_id?: number | null;
}

/** TaskAggregate */
export interface TaskAggregate {
  /** Task Id */
  task_id: number;
  /** Task Group Id */
  task_group_id: number;
  /** Task Group Block Id */
  task_group_block_id?: number | null;
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
  /** Owner Id */
  owner_id: number | null;
  exercise?: ExerciseAggregateOutput | null;
  task_properties?: TaskPropertiesAggregate | null;
  owner?: UserBase | null;
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
  /** Owner Id */
  owner_id: number | null;
  /** Tasks */
  tasks?: TaskAggregate[];
  /** Groups */
  groups?: TaskGroupBlock[];
  owner?: UserBase | null;
}

/** TaskGroupBlock */
export interface TaskGroupBlock {
  /** Task Group Block Id */
  task_group_block_id: number;
  /** Task Group Id */
  task_group_id: number;
  group_type: TaskGroupBlockType;
  /** Create Dttm */
  create_dttm?: string | null;
  /** Task Ids */
  task_ids?: number[];
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

/** ThemeIn */
export interface ThemeIn {
  /**
   * Algorithm
   * @minLength 1
   * @maxLength 60
   */
  algorithm: string;
  /** Token */
  token?: object;
  /** Components */
  components?: object;
}

/** ThemeItem */
export interface ThemeItem {
  /** Code */
  code: string;
}

/** ThemeOut */
export interface ThemeOut {
  /** Theme Cd */
  theme_cd: string;
  /** Theme Data */
  theme_data: object;
}

/** ThemesResponse */
export interface ThemesResponse {
  /**
   * Defaulttheme
   * @default "dark"
   */
  defaultTheme?: string;
  /** Themes */
  themes?: ThemeItem[];
}

/** Token */
export interface Token {
  /** Access Token */
  access_token: string;
  /** Token Type */
  token_type: string;
}

/** UpdateTask */
export interface UpdateTask {
  /** Task Id */
  task_id: number;
  /** Exercise Id */
  exercise_id: number;
  status: TaskStatus | null;
  /** Task Group Block Id */
  task_group_block_id?: number | null;
  task_properties?: TaskPropertiesAggregateUpdate | null;
}

/** UpdateTaskGroupBlock */
export interface UpdateTaskGroupBlock {
  group_type: TaskGroupBlockType;
  /** Task Ids */
  task_ids?: number[] | null;
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
  /**
   * Language Code
   * @default "en"
   */
  language_code?: string | null;
  /**
   * Theme Cd
   * @default "dark"
   */
  theme_cd?: string | null;
  master?: Master | null;
  gymer?: Gymer | null;
}

/** UserBase */
export interface UserBase {
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
  /**
   * Language Code
   * @default "en"
   */
  language_code?: string | null;
  /**
   * Theme Cd
   * @default "dark"
   */
  theme_cd?: string | null;
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
  /**
   * Language Code
   * @default "en"
   */
  language_code?: string | null;
  /**
   * Theme Cd
   * @default "dark"
   */
  theme_cd?: string | null;
}

/** UserOut */
export interface UserOut {
  user: User;
  token: Token;
}

/** UserProfile */
export interface UserProfile {
  /**
   * Language Code
   * language code
   */
  language_code?: UserProfileLanguageCodeEnum | null;
  /** Theme Cd */
  theme_cd?: string | null;
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

export enum UserProfileLanguageCodeEnum {
  Ru = "ru",
  En = "en",
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
 * @version 2.18.0
 */
export class Endpoints<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  user = {
    /**
     * No description
     *
     * @tags user
     * @name InitUser
     * @summary Initialize active user data snapshot
     * @request POST:/gym/user/init/{user_id}
     * @secure
     */
    initUser: (userId: number, params: RequestParams = {}) =>
      this.request<any, HTTPValidationError>({
        path: `/gym/user/init/${userId}`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

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
     * @name GetUserDataByUserId
     * @summary Getting user data by user_id
     * @request GET:/gym/user/user_by_id/{user_id}
     * @secure
     */
    getUserDataByUserId: (userId: number, params: RequestParams = {}) =>
      this.request<User, HTTPValidationError>({
        path: `/gym/user/user_by_id/${userId}`,
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
     * @name MasterGymerBreak
     * @summary break master gymer
     * @request GET:/gym/user/master_gymer_break/
     * @secure
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
        secure: true,
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
     * @secure
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
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UpdateUserProfile
     * @summary update user profile
     * @request PUT:/gym/user/profile/{user_id}
     * @secure
     */
    updateUserProfile: (
      userId: number,
      data: UserProfile,
      params: RequestParams = {},
    ) =>
      this.request<User, HTTPValidationError>({
        path: `/gym/user/profile/${userId}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
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
        /**
         * Owner Id
         * user_id создающего упражнение
         */
        owner_id?: number | null;
        /**
         * Task Group Block Id
         * task_group_block_id
         */
        task_group_block_id?: number | null;
        /**
         * Exercise Id
         * exercise id
         */
        exercise_id?: number | null;
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
         * title, max 30 characters
         */
        title?: string | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<TaskGroupAggregate, HTTPValidationError>({
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
     * @secure
     */
    taskGroupById: (taskGroupId: number, params: RequestParams = {}) =>
      this.request<TaskGroupAggregate | null, HTTPValidationError>({
        path: `/gym/task_group/${taskGroupId}`,
        method: "GET",
        secure: true,
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
         * title task_group, max 30 characters
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
  taskGroupBlock = {
    /**
     * No description
     *
     * @tags task_group_block
     * @name CreateTaskGroupBlock
     * @summary Create task group block
     * @request POST:/gym/task_group_block
     * @secure
     */
    createTaskGroupBlock: (
      data: CreateTaskGroupBlock,
      params: RequestParams = {},
    ) =>
      this.request<TaskGroupBlock, HTTPValidationError>({
        path: `/gym/task_group_block`,
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
     * @tags task_group_block
     * @name UpdateTaskGroupBlock
     * @summary Update task group block
     * @request PUT:/gym/task_group_block/{task_group_block_id}
     * @secure
     */
    updateTaskGroupBlock: (
      taskGroupBlockId: number,
      data: UpdateTaskGroupBlock,
      params: RequestParams = {},
    ) =>
      this.request<TaskGroupBlock, HTTPValidationError>({
        path: `/gym/task_group_block/${taskGroupBlockId}`,
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
     * @tags task_group_block
     * @name DeleteTaskGroupBlock
     * @summary Delete task group block
     * @request DELETE:/gym/task_group_block/{task_group_block_id}
     * @secure
     */
    deleteTaskGroupBlock: (
      taskGroupBlockId: number,
      params: RequestParams = {},
    ) =>
      this.request<any, HTTPValidationError>({
        path: `/gym/task_group_block/${taskGroupBlockId}`,
        method: "DELETE",
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
        /**
         * Page
         * Page number
         * @min 1
         * @default 1
         */
        page?: number;
        /**
         * Limit
         * Items per page
         * @min 1
         * @max 300
         * @default 300
         */
        limit?: number;
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
  auth = {
    /**
     * No description
     *
     * @tags auth
     * @name GetUserToken
     * @summary Getting token
     * @request POST:/auth/signin
     */
    getUserToken: (
      query: {
        /**
         * Init Data
         * telegram init_data
         */
        init_data: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<UserOut, HTTPValidationError>({
        path: `/auth/signin`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name CreateUserByInitData
     * @summary Creating user and getting token
     * @request POST:/auth/signup
     */
    createUserByInitData: (
      query: {
        /**
         * Init Data
         * telegram init_data
         */
        init_data: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<UserOut, HTTPValidationError>({
        path: `/auth/signup`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name GetDevUserTokenAuthDevSigninPost
     * @summary Getting token by telegram_id for local development
     * @request POST:/auth/dev-signin
     */
    getDevUserTokenAuthDevSigninPost: (
      query: {
        /**
         * Telegram Id
         * telegram id
         */
        telegram_id: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<UserOut, HTTPValidationError>({
        path: `/auth/dev-signin`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name CreateDevUserTokenAuthDevSignupPost
     * @summary Creating user and getting token for local development
     * @request POST:/auth/dev-signup
     */
    createDevUserTokenAuthDevSignupPost: (
      data: UserIn,
      params: RequestParams = {},
    ) =>
      this.request<UserOut, HTTPValidationError>({
        path: `/auth/dev-signup`,
        method: "POST",
        body: data,
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
  theme = {
    /**
     * No description
     *
     * @tags theme
     * @name GetThemes
     * @summary Getting available theme list
     * @request GET:/gym/theme
     * @secure
     */
    getThemes: (params: RequestParams = {}) =>
      this.request<ThemesResponse, any>({
        path: `/gym/theme`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags theme
     * @name AddTheme
     * @summary Adding a theme
     * @request POST:/gym/theme
     * @secure
     */
    addTheme: (data: ThemeIn, params: RequestParams = {}) =>
      this.request<ThemeOut, HTTPValidationError>({
        path: `/gym/theme`,
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
     * @tags theme
     * @name GetTheme
     * @summary Getting theme data by theme_cd
     * @request GET:/gym/theme/{theme_cd}
     * @secure
     */
    getTheme: (themeCd: string, params: RequestParams = {}) =>
      this.request<ThemeOut, HTTPValidationError>({
        path: `/gym/theme/${themeCd}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  healthz = {
    /**
     * No description
     *
     * @name Healthz
     * @summary Healthz
     * @request GET:/healthz
     */
    healthz: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/healthz`,
        method: "GET",
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

    /**
     * No description
     *
     * @name DebugRedis
     * @summary Debug Redis
     * @request GET:/debug/redis
     */
    debugRedis: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/debug/redis`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name DebugDb
     * @summary Debug Db
     * @request GET:/debug/db
     */
    debugDb: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/debug/db`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
}
