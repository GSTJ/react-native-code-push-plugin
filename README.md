# react-native-code-push-plugin

Config plugin to auto-configure [`react-native-code-push`][lib] when the native code is generated (`npx expo prebuild`).

### ⚠️ Remove Expo updates completely ⚠️

Before installing this package, you need completely remove Expo updates from your project:

- Expo updates configurations
- Expo updates execution code in your app
- Expo updates package `npm uninstall -s expo-updates` or `yarn remove expo-updates`
- Any other thing you have done with Expo updates

### Add the package to your npm dependencies

> Tested against Expo SDK 50

```
yarn add react-native-code-push react-native-code-push-plugin
```

After installing this npm package, add the [config plugin](https://docs.expo.io/guides/config-plugins/) to the [`plugins`](https://docs.expo.io/versions/latest/config/app/#plugins) array of your `app.json` or `app.config.js`:

```json
{
  "expo": {
    "plugins": [
      [
        "react-native-code-push-plugin",
        {
          "android": {
            "CodePushDeploymentKey": "YOUR_ANDROID_CODE_PUSH_KEY"
          },
          "ios": {
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
