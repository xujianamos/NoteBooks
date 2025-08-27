import { defineConfig } from "vitepress";
import fs from "node:fs";
import path from "node:path";

// https://vitepress.dev/reference/site-config
// 根据目录结构动态生成侧边栏
function isMarkdownFile(filename) {
  return filename.endsWith(".md") && !filename.startsWith(".");
}

function sortByFileNameAsc(a, b) {
  return a.localeCompare(b, "zh-Hans-CN");
}

function readSidebarGroupFromDir(absoluteDir, baseLinkPrefix) {
  if (!fs.existsSync(absoluteDir)) return [];
  const dirents = fs
    .readdirSync(absoluteDir, { withFileTypes: true })
    .filter((d) => !d.name.startsWith("."));

  const files = dirents
    .filter((d) => d.isFile() && isMarkdownFile(d.name))
    .map((d) => d.name)
    .sort(sortByFileNameAsc);

  const subdirs = dirents
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort(sortByFileNameAsc);

  const items = [];

  // files at current level
  for (const file of files) {
    const text = path.basename(file, ".md");
    const link = path.posix
      .join("/", baseLinkPrefix, text === "index" ? "" : text)
      .replace(/\\\\/g, "/");
    items.push({ text, link });
  }

  // nested directories as collapsible groups
  for (const dir of subdirs) {
    const groupText = path.basename(dir);
    const childAbs = path.join(absoluteDir, dir);
    const childPrefix = path.posix
      .join(baseLinkPrefix, dir)
      .replace(/\\\\/g, "/");
    const childItems = readSidebarGroupFromDir(childAbs, childPrefix);
    if (childItems.length > 0) {
      items.push({ text: groupText, collapsed: false, items: childItems });
    }
  }

  return items;
}

function generateSidebarFromTopDirs(topDirs) {
  const rootDir = path.resolve(process.cwd());
  const sidebar = [];

  for (const dir of topDirs) {
    const absoluteDir = path.join(rootDir, dir);
    if (
      !fs.existsSync(absoluteDir) ||
      !fs.statSync(absoluteDir).isDirectory()
    ) {
      continue;
    }

    const items = readSidebarGroupFromDir(absoluteDir, dir);
    if (items.length === 0) continue;

    sidebar.push({ text: path.basename(dir), items });
  }

  return sidebar;
}

function getFirstPageLinkForDir(dir) {
  const rootDir = path.resolve(process.cwd());
  const absoluteDir = path.join(rootDir, dir);
  if (!fs.existsSync(absoluteDir) || !fs.statSync(absoluteDir).isDirectory()) {
    return `/${dir}`;
  }
  const items = readMarkdownItemsFromDir(absoluteDir, dir);
  if (items.length === 0) return `/${dir}`;
  // 优先 index.md，其次第一个文件
  const indexItem = items.find(
    (i) => /\/index$/.test(i.link) || i.text === "index"
  );
  return (indexItem || items[0]).link;
}

// 想要自动出现在侧边栏的顶层目录（与仓库根同级）
const topLevelDocDirs = [
  "工具安装配置",
  "前端基础知识",
  "前端技术方案调研",
  "前端模块化",
  "前端设计模式",
  "前端运维",
  "Python",
];

const dynamicSidebar = [...generateSidebarFromTopDirs(topLevelDocDirs)];

export default defineConfig({
  title: "前端学习笔记",
  description: "前端学习笔记",
  vite: {
    plugins: [
      {
        name: "vp-restart-on-md-change",
        configureServer(server) {
          const rootDir = path.resolve(process.cwd());
          const watchDirs = topLevelDocDirs.map((d) => path.join(rootDir, d));
          for (const dir of watchDirs) server.watcher.add(dir);
          const isInWatchDirs = (file) =>
            watchDirs.some((dir) => file.startsWith(dir));
          server.watcher.on("add", (file) => {
            if (file.endsWith(".md") && isInWatchDirs(file)) {
              server.restart();
            }
          });
          server.watcher.on("unlink", (file) => {
            if (file.endsWith(".md") && isInWatchDirs(file)) {
              server.restart();
            }
          });
        },
      },
    ],
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [],

    sidebar: dynamicSidebar,

    socialLinks: [],
  },
});
