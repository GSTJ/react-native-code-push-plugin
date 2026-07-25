/**
 * Builds a Gradle expression that points to a file inside the
 * `react-native-code-push` package, resolved by Node at build time.
 *
 * Hardcoding `../../node_modules/react-native-code-push` only works when the
 * package sits right next to the android project. On monorepos (Expo + yarn
 * workspaces, pnpm, bun) it gets hoisted somewhere else and Gradle fails with
 * "Could not read script (...) as it does not exist". Letting Node resolve it
 * is the same trick react-native itself uses for `native_modules.gradle`.
 *
 * @param relativePath Path inside the package, e.g. `android/codepush.gradle`.
 */
export declare function codePushGradlePath(relativePath: string): string;
