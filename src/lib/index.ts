export * from './fs';
export * from './log';

export function localFetch(path: string, plugin = 'liteloader_nonebot') {
  return fetch(`local:///${LiteLoader.plugins[plugin].path.plugin.replace(':\\', '://').replaceAll('\\', '/')}/${path.startsWith('/') ? path.slice(1) : path}`);
}