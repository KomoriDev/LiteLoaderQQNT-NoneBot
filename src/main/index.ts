import fs from 'fs';
import path from 'path';
import { log } from '@/lib/log';

import './on';
import './uv';

const dataPath = LiteLoader.plugins.liteloader_nonebot.path.data;
const botsPath = path.join(dataPath, 'bots.json');

if (!fs.existsSync(dataPath)) {
  log('Plugin data path not found, creating a new plugin data path');
  fs.mkdirSync(dataPath, { recursive: true });
}
if (!fs.existsSync(botsPath)) {
  log('bots.json file not found, creating a new file');
  fs.writeFileSync(botsPath, JSON.stringify([], null, 2));
}
