# react-native-code-push-plugin

Config plugin to auto-configure [`react-native-code-push`][lib] when the native code is generated (`npx expo prebuild`).

### Add the package to your npm dependencies

> Tested against Expo SDK 49

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

### Disclaimer

This was published interim while this PR isn't merged and the plugin isn't published under @config-plugins:
https://github.com/expo/config-plugins/pull/204
