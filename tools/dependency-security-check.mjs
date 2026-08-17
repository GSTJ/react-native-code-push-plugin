import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
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

for (const version of ["3.15.1", "4.3.1"]) {
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
  "js-yaml@3.15.0",
  "js-yaml@4.3.0",
  "nanoid@3.3.16",
  "nanoid@3.3.17",
]) {
  assert.equal(
    installedPackages.some((entry) => entry.startsWith(vulnerablePackage)),
    false,
    `${vulnerablePackage} must not be installed`,
  );
}

console.log(
  "Dependency security checks passed for js-yaml, nanoid and image-size.",
);
