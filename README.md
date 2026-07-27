# react-native-code-push-plugin

Config plugin to auto-configure [`react-native-code-push`][lib] when the native code is generated (`npx expo prebuild`).

> ### App Center is retired
>
> Microsoft retired App Center and its hosted CodePush service on March 31, 2025, and archived both [`react-native-code-push`][lib-repo] and [`code-push-server`][server-repo] on May 20, 2025. `appcenter codepush release-react` no longer has a service to talk to.
>
> This plugin only writes native config at prebuild. It has to point at a CodePush server you host yourself, from the archived [`code-push-server`][server-repo] source. `CodePushServerURL` is required now: leave it out and the SDK falls back to `https://codepush.appcenter.ms/`. If running your own server isn't worth it, [`expo-updates`][expo-updates] replaces both CodePush and this plugin.

### Add the package to your npm dependencies

> Tested against Expo SDK 50

```
yarn add react-native-code-push react-native-code-push-plugin
```

### ⚠️ Remove Expo updates completely ⚠️

Before installing this package, you need completely remove Expo updates from your project:

- Expo updates configurations
- Expo updates execution code in your app
- Expo updates package `npm uninstall -s expo-updates` or `yarn remove expo-updates`
- Any other thing you have done with Expo updates

After installing this npm package, add the [config plugin](https://docs.expo.io/guides/config-plugins/) to the [`plugins`](https://docs.expo.io/versions/latest/config/app/#plugins) array of your `app.json` or `app.config.js`:

```json
{
  "expo": {
    "plugins": [
      [
        "react-native-code-push-plugin",
        {
          "android": {
            "CodePushServerURL": "YOUR_CODE_PUSH_SERVER_URL",
            "CodePushDeploymentKey": "YOUR_ANDROID_CODE_PUSH_KEY"
          },
          "ios": {
            "CodePushServerURL": "YOUR_CODE_PUSH_SERVER_URL",
            "CodePushDeploymentKey": "YOUR_IOS_CODE_PUSH_KEY"
          }
        }
      ]
    ]
  }
}
```

Next, rebuild your app as described in the ["Adding custom native code"](https://docs.expo.io/workflow/customizing/) guide.

[lib]: https://www.npmjs.com/package/react-native-code-push
[lib-repo]: https://github.com/microsoft/react-native-code-push
[server-repo]: https://github.com/microsoft/code-push-server
[expo-updates]: https://docs.expo.dev/versions/latest/sdk/updates/
