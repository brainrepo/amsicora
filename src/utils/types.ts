export type ArrayItemType<Type> = Type extends Array<infer Item> ? Item : Type
export type Await<T> = T extends PromiseLike<infer U> ? U : T
