declare type LocalUpperCase<T extends string> = T extends `${infer L}${infer R}`
  ? `${Uppercase<L>}${Lowercase<R>}`
  : T;
declare type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};
