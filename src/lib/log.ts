export function log(...content: string[]) {
  console.log('\x1b[32m%s\x1b[0m', 'LiteLoader NoneBot:', ...content);
}