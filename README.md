# react-native-code-push-plugin

Config plugin to auto-configure [`react-native-code-push`][lib] when the native code is generated (`npx expo prebuild`).

> ### App Center is retired
>
> Microsoft retired App Center and its hosted CodePush service on March 31, 2025, and archived both [`react-native-code-push`][lib-repo] and [`code-push-server`][server-repo] on May 20, 2025. `appcenter codepush release-react` no longer has a service to talk to.
>
> This plugin only writes native config at prebuild. It has to point at a CodePush server you host yourself, from the archived [`code-push-server`][server-repo] source. `CodePushServerURL` is required now: leave it out and the SDK falls back to `https://codepush.appcenter.ms/`. If running your own server isn't worth it, [`expo-updates`][expo-updates] replaces both CodePush and this plugin.

### Add the package to your npm dependencies

> Prebuild is tested against Expo SDK 50 and SDK 57. Android and iOS are both
> covered on both: on iOS the plugin writes `Info.plist` and, on SDK 53's
> Swift `AppDelegate`, redirects `ReactNativeDelegate.bundleURL()` to
> `CodePush.bundleURL()` (SDK 50-52's Objective-C `AppDelegate.mm` gets the
> same redirect).

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

## More from the author

Made by [Gabriel Taveira](https://www.gabrieltaveira.dev), who also built:

<table>
  <tr>
    <td width="64"><a href="https://curvinha.app/?utm_source=react-native-code-push-plugin&utm_medium=readme"><img src="https://curvinha.app/assets/apple-touch-icon.png" width="48" height="48" alt="Curvinha icon"></a></td>
    <td><a href="https://curvinha.app/?utm_source=react-native-code-push-plugin&utm_medium=readme"><b>Curvinha</b></a>: interior design for iPhone. Show your room and get a 3D proposal with real furniture from Brazilian stores. <a href="https://apps.apple.com/br/app/id6816957870?pt=126480814&ct=react-native-code-push-plugin-readme">App Store</a></td>
  </tr>
  <tr>
    <td width="64"><a href="https://pegada.app/?utm_source=react-native-code-push-plugin&utm_medium=readme"><img src="https://pegada.app/apple-touch-icon.png" width="48" height="48" alt="Pegada icon"></a></td>
    <td><a href="https://pegada.app/?utm_source=react-native-code-push-plugin&utm_medium=readme"><b>Pegada</b></a>: a new friend for your dog, nearby. <a href="https://apps.apple.com/br/app/id6450865592?pt=126480814&ct=react-native-code-push-plugin-readme">App Store</a></td>
  </tr>
</table>
