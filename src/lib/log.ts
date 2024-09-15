export default function log(...content: string[]) {
  console.log(`%c[nonebot]%c`, ...content, 'color: green', '');
}