import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import net from "node:net";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const results = [];

const file = (...parts) => path.join(root, ...parts);
const exists = (...parts) => existsSync(file(...parts));

function add(status, title, details = "") {
  results.push({ status, title, details });
}

function readJson(name) {
  try {
    return JSON.parse(readFileSync(file(name), "utf8"));
  } catch {
    return null;
  }
}

function parseVersion(version) {
  const match = String(version).replace(/^v/, "").match(/^(\d+)\.(\d+)\.(\d+)/);
  return match ? match.slice(1).map(Number) : null;
}

function compareVersions(a, b) {
  for (let i = 0; i < 3; i += 1) {
    if (a[i] > b[i]) return 1;
    if (a[i] < b[i]) return -1;
  }
  return 0;
}

function satisfiesNode(version, requirement) {
  const current = parseVersion(version);
  if (!current || !requirement) return null;

  const parts = requirement.trim().split(/\s+/);
  for (const part of parts) {
    const match = part.match(/^(>=|>|<=|<|=|~|\^)?v?(\d+\.\d+\.\d+)$/);
    if (!match) return null;

    const operator = match[1] || "=";
    const wanted = parseVersion(match[2]);
    const comparison = compareVersions(current, wanted);
    if (operator === ">=" && comparison < 0) return false;
    if (operator === ">" && comparison <= 0) return false;
    if (operator === "<=" && comparison > 0) return false;
    if (operator === "<" && comparison >= 0) return false;
    if ((operator === "=" || operator === "~" || operator === "^") && comparison < 0) return false;
  }

  return true;
}

function parseEnv(text) {
  const values = new Map();
  const meta = new Map();
  let previousComment = "";

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) {
      previousComment = "";
      continue;
    }
    if (line.startsWith("#")) {
      previousComment = line.toLowerCase();
      continue;
    }

    const match = rawLine.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match) {
      previousComment = "";
      continue;
    }

    const [, name, rawValue] = match;
    const inlineComment = rawValue.includes("#") ? rawValue.slice(rawValue.indexOf("#")).toLowerCase() : "";
    const value = rawValue.replace(/\s+#.*$/, "").trim().replace(/^['"]|['"]$/g, "");
    const optional = /\boptional\b/.test(previousComment) || /\boptional\b/.test(inlineComment);
    values.set(name, value);
    meta.set(name, { optional });
    previousComment = "";
  }

  return { values, meta };
}

function isExternalOptional(name) {
  return [
    "OPENAI",
    "ANTHROPIC",
    "GOOGLE_AI",
    "RESEND",
    "SMTP",
    "EMAIL",
    "MAIL",
    "OAUTH",
    "GOOGLE_CLIENT",
  ].some((prefix) => name.startsWith(prefix));
}

async function isPortInUse(port) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host: "127.0.0.1", port, timeout: 700 });
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("timeout", () => {
      socket.destroy();
      resolve(false);
    });
    socket.once("error", () => resolve(false));
  });
}

function gitTracked(paths) {
  try {
    const output = execFileSync("git", ["ls-files", "--", ...paths], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    return output.split(/\r?\n/).filter(Boolean);
  } catch {
    return null;
  }
}

const packageJson = readJson("package.json");

if (!packageJson) {
  add("FAIL", "package.json is readable", "package.json is missing or invalid.");
} else {
  add("PASS", "package.json is readable");

  const nodeRequirement = packageJson.engines?.node;
  if (!nodeRequirement) {
    add("INFO", "Node.js engine requirement", "No package.json engines.node requirement is defined.");
  } else {
    const ok = satisfiesNode(process.version, nodeRequirement);
    if (ok === true) {
      add("PASS", "Node.js version", `${process.version} satisfies ${nodeRequirement}.`);
    } else if (ok === false) {
      add("FAIL", "Node.js version", `${process.version} does not satisfy ${nodeRequirement}.`);
    } else {
      add("WARNING", "Node.js version", `Could not fully evaluate ${nodeRequirement}; installed version is ${process.version}.`);
    }
  }

  if (packageJson.packageManager?.startsWith("pnpm@")) {
    add("PASS", "Package manager", `packageManager is ${packageJson.packageManager.split("+")[0]}.`);
  } else {
    add("FAIL", "Package manager", "package.json packageManager must use pnpm.");
  }
}

const requiredFiles = [
  "package.json",
  "pnpm-lock.yaml",
  "next.config.ts",
  "tsconfig.json",
  "prisma/schema.prisma",
  ".env.example",
];

for (const requiredFile of requiredFiles) {
  add(exists(requiredFile) ? "PASS" : "FAIL", `Required file: ${requiredFile}`);
}

add(exists("pnpm-lock.yaml") ? "PASS" : "FAIL", "pnpm-lock.yaml exists");
add(!exists("package-lock.json") ? "PASS" : "FAIL", "package-lock.json is absent");
add(!exists("yarn.lock") ? "PASS" : "FAIL", "yarn.lock is absent");

add(exists("node_modules") ? "PASS" : "FAIL", "node_modules exists", exists("node_modules") ? "" : "Run pnpm install.");

const nextBinaryCandidates = process.platform === "win32"
  ? [file("node_modules", ".bin", "next.cmd"), file("node_modules", ".bin", "next.ps1")]
  : [file("node_modules", ".bin", "next")];
const nextInstalled = nextBinaryCandidates.some(existsSync) || exists("node_modules", "next", "package.json");
add(nextInstalled ? "PASS" : "FAIL", "Local Next.js binary exists", nextInstalled ? "" : "Expected next under node_modules.");

const prismaInstalled = exists("node_modules", ".bin", process.platform === "win32" ? "prisma.cmd" : "prisma")
  || exists("node_modules", "prisma", "package.json")
  || exists("node_modules", "@prisma", "client", "package.json");
add(prismaInstalled ? "PASS" : "FAIL", "Prisma is installed locally", prismaInstalled ? "" : "Expected prisma under node_modules.");

const duplicateConfigs = ["next.config.mjs", "next.config.js"].filter((name) => exists(name));
if (exists("next.config.ts") && duplicateConfigs.length === 0) {
  add("PASS", "No duplicate Next.js config files");
} else if (exists("next.config.ts")) {
  add("FAIL", "No duplicate Next.js config files", `Unexpected duplicate config file(s): ${duplicateConfigs.join(", ")}.`);
}

const envExample = exists(".env.example") ? parseEnv(readFileSync(file(".env.example"), "utf8")) : null;
const env = exists(".env") ? parseEnv(readFileSync(file(".env"), "utf8")) : null;
add(env ? "PASS" : "FAIL", ".env exists", env ? "" : "Copy .env.example to .env and fill required values.");

if (envExample && env) {
  const missingRequired = [];
  const emptyRequired = [];
  const missingOptional = [];
  const emptyOptional = [];
  const missingExternal = [];
  const emptyExternal = [];

  for (const [name, exampleMeta] of envExample.meta.entries()) {
    const value = env.values.get(name);
    const missing = !env.values.has(name);
    const empty = !missing && value.length === 0;
    const external = isExternalOptional(name);

    if (exampleMeta.optional) {
      if (missing) missingOptional.push(name);
      if (empty) emptyOptional.push(name);
    } else if (external) {
      if (missing) missingExternal.push(name);
      if (empty) emptyExternal.push(name);
    } else {
      if (missing) missingRequired.push(name);
      if (empty) emptyRequired.push(name);
    }
  }

  if (missingRequired.length || emptyRequired.length) {
    const details = [
      missingRequired.length ? `Missing: ${missingRequired.join(", ")}` : "",
      emptyRequired.length ? `Empty: ${emptyRequired.join(", ")}` : "",
    ].filter(Boolean).join(" ");
    add("FAIL", "Required environment variables", details);
  } else {
    add("PASS", "Required environment variables", "All required names from .env.example are present and non-empty.");
  }

  if (missingOptional.length || emptyOptional.length) {
    const details = [
      missingOptional.length ? `Missing optional: ${missingOptional.join(", ")}` : "",
      emptyOptional.length ? `Empty optional: ${emptyOptional.join(", ")}` : "",
    ].filter(Boolean).join(" ");
    add("INFO", "Optional environment variables", details);
  } else {
    add("INFO", "Optional environment variables", "No marked optional variables are missing or empty.");
  }

  if (missingExternal.length || emptyExternal.length) {
    const details = [
      missingExternal.length ? `Missing external service values: ${missingExternal.join(", ")}` : "",
      emptyExternal.length ? `Empty external service values: ${emptyExternal.join(", ")}` : "",
    ].filter(Boolean).join(" ");
    add("WARNING", "External provider environment variables", details);
  } else {
    add("PASS", "External provider environment variables", "Configured names are present; values were not printed.");
  }

  if (env.values.has("DATABASE_URL") && env.values.get("DATABASE_URL").length > 0) {
    add("PASS", "DATABASE_URL is configured", "No database connection was attempted.");
  } else {
    add("FAIL", "DATABASE_URL is configured", "DATABASE_URL is missing or empty. No database connection was attempted.");
  }
}

const tracked = gitTracked([".env", "node_modules", ".next", "tsconfig.tsbuildinfo", "prisma/dev.db"]);
if (tracked === null) {
  add("INFO", "Git tracked local artifacts", "Git is unavailable or this folder is not inside a Git repository.");
} else if (tracked.length) {
  add("FAIL", "Git tracked local artifacts", `These local/generated paths are tracked: ${tracked.join(", ")}.`);
} else {
  add("PASS", "Git tracked local artifacts", "No checked local/generated artifacts are tracked.");
}

if (await isPortInUse(3000)) {
  add("WARNING", "Frontend port 3000", "Port 3000 is already in use. Stop the existing process or choose another port before running pnpm dev.");
} else {
  add("PASS", "Frontend port 3000", "Port 3000 appears available.");
}

for (const [name, port] of [["backend", 3001], ["PostgreSQL", 5432], ["MongoDB", 27017]]) {
  add("INFO", `${name} port ${port}`, (await isPortInUse(port)) ? "Port is in use." : "Port is not in use.");
}

for (const result of results) {
  const detail = result.details ? ` - ${result.details}` : "";
  console.log(`[${result.status}] ${result.title}${detail}`);
}

const counts = results.reduce((acc, result) => {
  acc[result.status] = (acc[result.status] || 0) + 1;
  return acc;
}, {});
const failures = counts.FAIL || 0;
const warnings = counts.WARNING || 0;
const passed = counts.PASS || 0;

console.log("");
console.log("Summary");
console.log(`Passed checks: ${passed}`);
console.log(`Warnings: ${warnings}`);
console.log(`Failed checks: ${failures}`);
console.log(`Suggested next command: ${failures ? "Fix the failed checks, then run pnpm check:setup again." : "pnpm prisma:generate"}`);

process.exitCode = failures ? 1 : 0;
