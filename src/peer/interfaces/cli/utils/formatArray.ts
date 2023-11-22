export default function formatArray<T>(arr: T[], indent: number = 3): string {
  if (arr.length === 0) {
    return 'Empty array';
  }

  return arr.map((e, index) => `${' '.repeat(indent)}${index}) ${e}`).join('\n');
}
