declare type LocalUpperCase<T extends string> = T extends `${infer L}${infer R}`
  ? `${Uppercase<L>}${Lowercase<R>}`
  : T;
