import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const requiredFiles = ['package.json', 'index.html', 'DESIGN.md', 'README.md', 'compositions/ai-history.html'];
for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) failures.push(`缺少文件：${file}`);
}
if (!fs.existsSync(path.join(root, 'renders')) || !fs.statSync(path.join(root, 'renders')).isDirectory()) {
  failures.push('缺少 renders 目录');
}
const read = (file) => fs.existsSync(path.join(root, file)) ? fs.readFileSync(path.join(root, file), 'utf8') : '';
const entry = read('index.html');
const comp = read('compositions/ai-history.html');
if (!/data-composition-src=["']compositions\/ai-history\.html["']/.test(entry)) failures.push('index.html 未包含有效 composition 引用');
const checks = [
  ['1080宽度', /data-width=["']1080["']/, comp],
  ['1920高度', /data-height=["']1920["']/, comp],
  ['72秒时长', /data-duration=["']72["']/, comp],
  ['30fps', /data-fps=["']30["']/, comp],
  ['composition id', /data-composition-id=["']ai-history["']/, comp],
];
for (const [label, re, text] of checks) if (!re.test(text)) failures.push(`子 composition 缺少：${label}`);
const keywords = ['1950','1956','1997','2012','2016','2022','2026','Turing','Dartmouth','Deep Blue','AlexNet','AlphaGo','ChatGPT','Agent'];
for (const word of keywords) if (!comp.includes(word)) failures.push(`子 composition 缺少关键词：${word}`);
const projectFiles = [];
const walk = (dir) => {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    const rel = path.relative(root, full);
    if (['.git', 'node_modules', 'renders'].some((skip) => rel === skip || rel.startsWith(`${skip}${path.sep}`))) continue;
    if (rel === 'package-lock.json') { projectFiles.push(rel); continue; }
    if (ent.isDirectory()) walk(full);
    else projectFiles.push(rel);
  }
};
walk(root);
for (const file of projectFiles) {
  const text = read(file);
  if (file !== 'package-lock.json' && /https?:\/\//i.test(text.replace(/http:\/\/localhost:\d+/g, ''))) failures.push(`${file} 包含远程 http/https 资源引用`);
}
const srcRegex = /<(?:img|audio|video|source|script)\b[^>]*\s(?:src|href)=["']([^"']+)["']/gi;
for (const file of ['index.html', 'compositions/ai-history.html']) {
  const html = read(file);
  let match;
  while ((match = srcRegex.exec(html))) {
    const ref = match[1];
    if (/^(?:https?:)?\/\//i.test(ref) || ref.startsWith('data:') || ref.startsWith('#')) continue;
    const resolved = ref.startsWith('node_modules/') ? path.resolve(root, ref) : path.resolve(root, path.dirname(file), ref);
    if (!fs.existsSync(resolved)) failures.push(`${file} 引用缺失文件：${ref}`);
  }
}
if (failures.length) {
  console.error('项目验证失败：');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('项目验证通过：结构、规格、关键词、本地资源引用均符合要求。');
