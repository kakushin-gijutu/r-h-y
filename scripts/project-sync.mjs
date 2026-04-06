#!/usr/bin/env node

/**
 * Project sync script (cross-platform: Mac / Windows / Linux)
 *
 * Runs automatically via predev/prestart in package.json.
 * On every "npm run dev" / "yarn dev" / "expo start":
 *   1. Syncs CLAUDE.md from kakushin_claude_rule (auto-clones if missing)
 *   2. git pull --rebase
 *   3. vercel env pull (if Vercel project)
 *   4. eas env:pull (if Expo/EAS project)
 *
 * Missing CLIs (vercel, eas) are auto-installed on first run.
 *
 * For monorepos, create sync.config.json:
 *   {
 *     "subprojects": [
 *       { "path": "apps/web", "vercel": true },
 *       { "path": "apps/mobile", "eas": true }
 *     ]
 *   }
 */

import { execSync } from "node:child_process";
import { copyFileSync, existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const RULE_REPO = "https://github.com/kakushin-gijutu/kakushin_claude_rule.git";
const RULE_DIR_NAME = "kakushin_claude_rule";

const noColor = process.env.NO_COLOR || (process.platform === "win32" && !process.env.WT_SESSION);
const green = (s) => (noColor ? s : `\x1b[32m${s}\x1b[0m`);
const yellow = (s) => (noColor ? s : `\x1b[33m${s}\x1b[0m`);
const blue = (s) => (noColor ? s : `\x1b[34m${s}\x1b[0m`);
const red = (s) => (noColor ? s : `\x1b[31m${s}\x1b[0m`);

const log = {
  success: (msg) => console.log(`  ${green("✓")} ${msg}`),
  warn: (msg) => console.log(`  ${yellow("⚠")} ${msg}`),
  error: (msg) => console.log(`  ${red("✗")} ${msg}`),
  info: (msg) => console.log(`  ${blue("→")} ${msg}`),
  header: (msg) => console.log(blue(`[${msg}]`)),
};

/** Run a shell command, log success/failure */
function run(cmd, label, cwd = process.cwd()) {
  try {
    execSync(cmd, { cwd, stdio: "pipe", timeout: 30000 });
    log.success(label);
    return true;
  } catch {
    log.warn(`${label} failed`);
    return false;
  }
}

/** Check if a CLI command is available */
function commandExists(cmd) {
  try {
    const check = process.platform === "win32" ? `where ${cmd}` : `which ${cmd}`;
    execSync(check, { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

/** Install a CLI globally if not present, return true if available after */
function ensureCLI(cmd, pkg) {
  if (commandExists(cmd)) return true;
  log.info(`Installing ${cmd}...`);
  try {
    execSync(`npm i -g ${pkg}`, { stdio: "pipe", timeout: 120000 });
    log.success(`${cmd} installed`);
    return true;
  } catch {
    log.warn(`${cmd} install failed (run manually: npm i -g ${pkg})`);
    return false;
  }
}

/**
 * Sync CLAUDE.md from kakushin_claude_rule repo.
 * Looks for the repo as a sibling directory, auto-clones if missing.
 */
function syncCLAUDEmd(projectRoot) {
  // Find parent directory (e.g. ~/dev)
  const parentDir = resolve(projectRoot, "..");
  const ruleRepoPath = join(parentDir, RULE_DIR_NAME);

  // Clone if missing
  if (!existsSync(ruleRepoPath)) {
    log.info(`Cloning ${RULE_DIR_NAME}...`);
    try {
      execSync(`git clone ${RULE_REPO}`, { cwd: parentDir, stdio: "pipe", timeout: 30000 });
      log.success(`${RULE_DIR_NAME} cloned`);
    } catch {
      log.warn(`${RULE_DIR_NAME} clone failed - skipping CLAUDE.md sync`);
      return;
    }
  }

  // Pull latest
  if (existsSync(join(ruleRepoPath, ".git"))) {
    try {
      execSync("git pull --rebase", { cwd: ruleRepoPath, stdio: "pipe", timeout: 15000 });
    } catch {
      // Ignore pull failure (offline, etc.)
    }
  }

  // Copy CLAUDE.md to parent directory (shared across all projects)
  const src = join(ruleRepoPath, "CLAUDE.md");
  const dest = join(parentDir, "CLAUDE.md");
  if (existsSync(src)) {
    copyFileSync(src, dest);
    log.success("CLAUDE.md synced");
  }
}

/** Sync environment variables for a directory based on project type */
function syncDirectory(dir, options = {}) {
  const abs = resolve(dir);

  // Vercel
  if (options.vercel !== false) {
    const hasVercel = existsSync(join(abs, ".vercel")) || existsSync(join(abs, "vercel.json"));
    if (hasVercel || options.vercel === true) {
      if (ensureCLI("vercel", "vercel")) {
        run("vercel env pull .env.local --yes", "vercel env pull", abs);
      }
    }
  }

  // EAS
  if (options.eas !== false) {
    const hasEas = existsSync(join(abs, "eas.json"));
    if (hasEas || options.eas === true) {
      if (ensureCLI("eas", "eas-cli")) {
        run("eas env:pull --environment preview --path .env.local --non-interactive", "eas env:pull", abs);
      }
    }
  }
}

function main() {
  const projectRoot = process.cwd();
  const projectName = projectRoot.split(/[/\\]/).pop();

  console.log("");
  log.header(projectName);

  // 1. Sync CLAUDE.md from kakushin_claude_rule
  syncCLAUDEmd(projectRoot);

  // 2. git pull
  if (existsSync(join(projectRoot, ".git"))) {
    run("git pull --rebase", "git pull");
  } else {
    log.info("Not a git repository - skipping git pull");
  }

  // 3. If sync.config.json exists, handle as monorepo
  const configPath = join(projectRoot, "sync.config.json");
  if (existsSync(configPath)) {
    try {
      const config = JSON.parse(readFileSync(configPath, "utf-8"));
      if (config.subprojects && Array.isArray(config.subprojects)) {
        for (const sub of config.subprojects) {
          const subPath = join(projectRoot, sub.path);
          if (existsSync(subPath)) {
            log.info(`Subproject: ${sub.path}`);
            syncDirectory(subPath, sub);
          } else {
            log.warn(`Subproject ${sub.path} not found`);
          }
        }
        console.log("");
        return;
      }
    } catch {
      log.warn("Failed to read sync.config.json");
    }
  }

  // 4. Auto-detect project type
  syncDirectory(projectRoot);

  console.log("");
}

main();
