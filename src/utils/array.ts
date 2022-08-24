export function sum(array: Array<Record<string, any>>, property: string) {
  return array.map((e) => Number(e[property])).reduce((a, e) => a + e, 0)
}
