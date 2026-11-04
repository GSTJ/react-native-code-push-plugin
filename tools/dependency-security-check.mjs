import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { createRequire } from "node:module";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

const rootRequire = createRequire(import.meta.url);

const requireFrom = (packageJsonPath) => createRequire(packageJsonPath);

const packageFrom = (packageJsonPath, name) =>
  requireFrom(packageJsonPath).resolve(`${name}/package.json`);

const versionAt = (packageJsonPath) =>
  JSON.parse(readFileSync(packageJsonPath, "utf8")).version;

const expoPackage = rootRequire.resolve("expo/package.json");
const metroConfigPackage = packageFrom(expoPackage, "@expo/metro-config");
const metroPackage = packageFrom(metroConfigPackage, "metro");
const imageSizePackage = packageFrom(metroPackage, "image-size");
const imageSizeDirectory = dirname(imageSizePackage);

assert.equal(versionAt(imageSizePackage), "1.2.1");

const icnsSource = readFileSync(
  join(imageSizeDirectory, "dist/types/icns.js"),
  "utf8",
);
const boxSource = readFileSync(
  join(imageSizeDirectory, "dist/types/utils.js"),
  "utf8",
);

// Check the installed guards before the isolated parser probes run.
assert.match(icnsSource, /imageLength < SIZE_HEADER/);
assert.match(boxSource, /boxSize < 8/);
assert.match(
  boxSource,
  /declaredSize === 0 \? input\.length - offset : declaredSize/,
);

const imageSize = requireFrom(imageSizePackage)("image-size");
const { getAssetSize } = requireFrom(metroPackage)(
  join(dirname(metroPackage), "src/Assets.js"),
);

const malformedIcns = Buffer.alloc(16);
malformedIcns.write("icns", 0, "ascii");
malformedIcns.writeUInt32BE(16, 4);
malformedIcns.write("ic07", 8, "ascii");
malformedIcns.writeUInt32BE(0, 12);

const malformedJxl = Buffer.alloc(40);
malformedJxl.writeUInt32BE(12, 0);
malformedJxl.write("JXL ", 4, "ascii");
malformedJxl.writeUInt32BE(20, 12);
malformedJxl.write("ftyp", 16, "ascii");
malformedJxl.write("jxl ", 20, "ascii");
malformedJxl.writeUInt32BE(0, 32);
malformedJxl.write("jxlp", 36, "ascii");

const probes = {
  "direct-icns": () => imageSize(malformedIcns),
  "direct-jxl": () => imageSize(malformedJxl),
  "metro-icns": () => getAssetSize("png", malformedIcns, "malformed.png"),
  "metro-jxl": () => getAssetSize("png", malformedJxl, "malformed.png"),
};

const [probeName] = process.argv.slice(2);
if (probeName) {
  assert.ok(probeName in probes, `Unknown parser probe: ${probeName}`);
  assert.throws(probes[probeName]);
  process.exit(0);
}

for (const name of Object.keys(probes)) {
  const result = spawnSync(process.execPath, [import.meta.filename, name], {
    encoding: "utf8",
    killSignal: "SIGKILL",
    timeout: 3_000,
  });

  assert.equal(
    result.status,
    0,
    [
      `Parser probe failed: ${name}`,
      result.error?.message,
      result.stdout,
      result.stderr,
    ]
      .filter(Boolean)
      .join("\n"),
  );
}

const makeHeif = (metaSize) => {
  const input = Buffer.alloc(60);
  input.writeUInt32BE(12, 0);
  input.write("ftyp", 4, "ascii");
  input.write("heic", 8, "ascii");
  input.writeUInt32BE(metaSize, 12);
  input.write("meta", 16, "ascii");
  input.writeUInt32BE(36, 24);
  input.write("iprp", 28, "ascii");
  input.writeUInt32BE(28, 32);
  input.write("ipco", 36, "ascii");
  input.writeUInt32BE(20, 40);
  input.write("ispe", 44, "ascii");
  input.writeUInt32BE(1, 52);
  input.writeUInt32BE(1, 56);
  return input;
};

for (const metaSize of [48, 0]) {
  assert.deepEqual(imageSize(makeHeif(metaSize)), {
    height: 1,
    type: "heic",
    width: 1,
  });
}

const onePixelPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
  "base64",
);
assert.deepEqual(getAssetSize("png", onePixelPng, "pixel.png"), {
  height: 1,
  width: 1,
});

const postcssPackage = packageFrom(metroConfigPackage, "postcss");
const nanoidPackage = packageFrom(postcssPackage, "nanoid");
const nanoid = requireFrom(nanoidPackage)("nanoid");

assert.equal(versionAt(nanoidPackage), "3.3.18");
assert.equal(nanoid.customAlphabet("abc", 0)(), "");

let randomCalls = 0;
const customRandom = nanoid.customRandom("abc", 3, (size) => {
  randomCalls += 1;
  return new Uint8Array(size);
});
assert.equal(customRandom(0), "");
assert.equal(randomCalls, 0);

const pnpmStore = join(process.cwd(), "node_modules/.pnpm");
const installedPackages = readdirSync(pnpmStore);

const packageInStore = (name, version) => {
  const directory = installedPackages.find((entry) =>
    entry.startsWith(`${name.replace("/", "+")}@${version}`),
  );

  assert.ok(directory, `${name} ${version} is installed`);

  return join(pnpmStore, directory, "node_modules", name, "package.json");
};

for (const version of ["0.8.15", "0.9.12"]) {
  const packageJson = packageInStore("@xmldom/xmldom", version);
  const { DOMImplementation, XMLSerializer } =
    requireFrom(packageJson)("@xmldom/xmldom");
  const document = new DOMImplementation().createDocument(null, "root", null);

  assert.throws(
    () => document.createEntityReference("safe; <injected/> &x"),
    /not a valid xml name/,
  );

  const reference = document.createEntityReference("safe");
  reference.nodeName = "safe; <injected/> &x";
  const serializer = new XMLSerializer();
  const serialize =
    version === "0.8.15"
      ? () =>
          serializer.serializeToString(reference, false, undefined, {
            requireWellFormed: true,
          })
      : () =>
          serializer.serializeToString(reference, {
            requireWellFormed: true,
          });

  assert.throws(serialize, /not a valid XML Name/);
}

for (const version of ["3.15.2", "4.3.2"]) {
  const directory = installedPackages.find((entry) =>
    entry.startsWith(`js-yaml@${version}`),
  );

  assert.ok(directory, `js-yaml ${version} is installed`);

  const packageJson = join(
    pnpmStore,
    directory,
    "node_modules/js-yaml/package.json",
  );
  const omapPath = join(
    dirname(packageJson),
    version.startsWith("3.") ? "lib/js-yaml/type/omap.js" : "lib/type/omap.js",
  );

  assert.equal(versionAt(packageJson), version);
  assert.doesNotMatch(readFileSync(omapPath, "utf8"), /objectKeys\.indexOf/);

  const yaml = requireFrom(packageJson)("js-yaml");
  const document = `!!omap\n${Array.from(
    { length: 1_000 },
    (_, index) => `- k${index}: ${index}`,
  ).join("\n")}`;

  assert.equal(yaml.load(document).length, 1_000);
}

for (const vulnerablePackage of [
  "@xmldom+xmldom@0.8.13",
  "@xmldom+xmldom@0.8.14",
  "@xmldom+xmldom@0.9.10",
  "@xmldom+xmldom@0.9.11",
  "js-yaml@3.15.0",
  "js-yaml@3.15.1",
  "js-yaml@4.3.0",
  "js-yaml@4.3.1",
  "nanoid@3.3.16",
  "nanoid@3.3.17",
]) {
  assert.equal(
    installedPackages.some((entry) => entry.startsWith(vulnerablePackage)),
    false,
    `${vulnerablePackage} must not be installed`,
  );
}

for (const [name, version] of [
  ["node-forge", "1.4.1"],
  ["ip-address", "10.7.4"],
]) {
  assert.equal(versionAt(packageInStore(name, version)), version);
}

// Exercise the same undici instance release-it resolves. An early socket close
// after excessive content codings must reject fetch without crashing Node.
const undiciPackage = packageInStore("undici", "7.30.1");
const { fetch } = requireFrom(undiciPackage)("undici");
assert.equal(versionAt(undiciPackage), "7.30.1");
const server = createServer((socket) => {
  socket.once("data", () => {
    socket.end(
      "HTTP/1.1 200 OK\r\nContent-Encoding: gzip, gzip, gzip, gzip, gzip, gzip\r\nContent-Length: 100\r\nConnection: close\r\n\r\n",
    );
  });
});
await new Promise((resolve) => {
  server.listen(0, "127.0.0.1", resolve);
});
try {
  await assert.rejects(
    fetch(`http://127.0.0.1:${server.address().port}`, {
      signal: AbortSignal.timeout(3_000),
    }),
    (error) => /too many content-encodings/.test(error.cause?.message),
  );
  // Give an orphaned stream error time to surface after fetch rejects.
  await new Promise((resolve) => {
    setTimeout(resolve, 100);
  });
} finally {
  await new Promise((resolve) => {
    server.close(resolve);
  });
}
console.log(
  "undici 7.30.1 rejected excessive content encodings without crashing.",
);

console.log(
  "Dependency security checks passed for @xmldom/xmldom, js-yaml, nanoid and image-size.",
);

// The exact patch guards and exploit controls run before audit exemptions apply.
const deepmergePackage = packageFrom(
  packageFrom(expoPackage, "@expo/config"),
  "deepmerge",
);
for (const entry of ["index.js", "dist/cjs.js", "dist/umd.js"]) {
  const file = join(dirname(deepmergePackage), entry);
  assert.match(readFileSync(file, "utf8"), /key === "__proto__"/);
  // The source entry is unbundled; npm consumers load the bundled builds.
  const runtimeEntry =
    entry === "index.js"
      ? join(dirname(deepmergePackage), "dist/cjs.js")
      : file;
  const merge = rootRequire(runtimeEntry);
  for (const poison of [
    JSON.parse('{"__proto__":{"polluted":true}}'),
    Object.assign(
      Object.create(null),
      JSON.parse('{"__proto__":{"polluted":true}}'),
    ),
  ]) {
    for (const result of [
      merge(poison, {}),
      merge({}, poison),
      merge(Object.create(null), poison),
    ]) {
      assert.equal(Object.getPrototypeOf(result), Object.prototype);
      assert.equal(result.polluted, undefined);
    }
  }
  assert.deepEqual(
    merge({ a: [1], nested: { x: 1 } }, { a: [2], nested: { y: 2 } }),
    { a: [1, 2], nested: { x: 1, y: 2 } },
  );
}
// Exercise Expo's config merge, where this development dependency is used.
const { modifyConfigAsync } = requireFrom(expoPackage)("@expo/config");
const configProject = mkdtempSync(join(tmpdir(), "code-push-config-security-"));
try {
  writeFileSync(
    join(configProject, "package.json"),
    '{"name":"security-probe"}',
  );
  writeFileSync(
    join(configProject, "app.json"),
    '{"expo":{"name":"probe","slug":"probe","extra":{"safe":true,"__proto__":{"polluted":true}}}}',
  );
  const result = await modifyConfigAsync(
    configProject,
    { extra: { added: true } },
    { skipSDKVersionRequirement: true },
    { dryRun: true },
  );
  assert.equal(result.type, "success");
  assert.equal(Object.getPrototypeOf(result.config.extra), Object.prototype);
  assert.equal(result.config.extra.polluted, undefined);
  assert.deepEqual(result.config.extra, { safe: true, added: true });
  console.log(
    "Expo config merge rejected prototype poisoning and preserved safe values.",
  );
} finally {
  rmSync(configProject, { recursive: true, force: true });
}
const mmPackage = packageFrom(packageInStore("glob", "14.0.3"), "minimatch");
const mm = requireFrom(mmPackage)("minimatch");
assert.equal(typeof mm, "function");
assert.equal(mm("src/index.ts", "**/*.ts"), true);
assert.equal(mm.minimatch("src/index.ts", "**/*.ts"), true);
assert.equal(new mm.Minimatch("**/*.ts").match("src/index.ts"), true);
assert.equal(mm.defaults({ dot: true })(".hidden", "*"), true);
// Exercise the amplified pattern in a child so a regression cannot hang CI.
const probe = spawnSync(
  process.execPath,
  [
    "-e",
    `const mm = require(${JSON.stringify(dirname(mmPackage))}); new mm.Minimatch("a/" + "**/../".repeat(40) + "z", { optimizationLevel: 2 });`,
  ],
  { timeout: 3000 },
);
assert.equal(probe.status, 0, probe.stderr?.toString());
const globPackage = packageInStore("glob", "14.0.3");
const glob = requireFrom(globPackage)("glob");
assert.ok(glob.globSync("src/**/*.ts").includes("src/index.ts"));
const controller = new AbortController();
controller.abort(new Error("security probe cancelled"));
await assert.rejects(
  glob.glob("**/*", { signal: controller.signal }),
  /security probe cancelled/,
);
const cliPackage = packageFrom(expoPackage, "@expo/cli");
const cliRequire = requireFrom(cliPackage);
const { z } = cliRequire("zod");
let parsedElements = 0;
const element = z.string().refine(() => {
  parsedElements++;
  return true;
});
const boundedSchemas = [z.array(element).max(1), z.array(element).length(1)];
for (const schema of boundedSchemas) {
  assert.equal(schema.safeParse(["a", "b"]).success, false);
}
const asyncResults = await Promise.all(
  boundedSchemas.map((schema) => schema.safeParseAsync(["a", "b"])),
);
for (const result of asyncResults) assert.equal(result.success, false);
assert.equal(parsedElements, 0);
const { PluginSchema, DevToolsPluginOutputSchema } = cliRequire(
  join(dirname(cliPackage), "build/src/start/server/DevToolsPlugin.schema.js"),
);
assert.equal(
  PluginSchema.safeParse({ packageName: "probe", packageRoot: "/tmp/probe" })
    .success,
  true,
);
assert.equal(PluginSchema.safeParse({ packageName: 12 }).success, false);
assert.equal(
  DevToolsPluginOutputSchema.safeParse([
    { type: "text", text: "hello", level: "info" },
  ]).success,
  true,
);
const ftpPackage = packageInStore("basic-ftp", "6.2.5");
const ftp = requireFrom(ftpPackage)("basic-ftp");
const client = new ftp.Client();
for (const method of ["access", "lastMod", "downloadTo", "close"])
  assert.equal(typeof client[method], "function");
client.close();
const ftpParserPath = join(dirname(ftpPackage), "dist/parseListUnix.js");
const ftpProbe = spawnSync(
  process.execPath,
  [
    "-e",
    `const {parseLine} = require(${JSON.stringify(ftpParserPath)}); parseLine("-rw-r--r-- 1 " + "x ".repeat(100000));`,
  ],
  { timeout: 3000 },
);
assert.equal(ftpProbe.status, 0, ftpProbe.stderr?.toString());
console.log(
  "Security migrations passed: deepmerge prototype controls, callable/named minimatch, bounded patterns, glob cancellation, Zod size gates and Expo schemas, FTP parser.",
);
