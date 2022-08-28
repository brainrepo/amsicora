export type ArrayItemType<Type> = Type extends Array<infer Item> ? Item : Type
