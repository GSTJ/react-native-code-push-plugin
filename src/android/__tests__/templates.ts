/**
 * Trimmed copies of what `npx expo prebuild` writes, kept verbatim around the
 * parts the mods touch. Regenerate by prebuilding a blank app on the SDK named.
 */

/** Expo SDK 50, react-native 0.73. Autolinking is applied from the app module. */
export const sdk50AppBuildGradle = `apply plugin: "com.android.application"
apply plugin: "org.jetbrains.kotlin.android"
apply plugin: "com.facebook.react"

react {
    entryFile = file(["node", "-e", "require('expo/scripts/resolveAppEntry')", projectRoot, "android", "absolute"].execute(null, rootDir).text.trim())
    bundleCommand = "export:embed"
}

android {
    namespace "com.anonymous.sdk50app"
}

dependencies {
    implementation("com.facebook.react:react-android")
}

apply from: new File(["node", "--print", "require.resolve('@react-native-community/cli-platform-android/package.json', { paths: [require.resolve('react-native/package.json')] })"].execute(null, rootDir).text.trim(), "../native_modules.gradle");
applyNativeModulesAppBuildGradle(project)
`;

/**
 * Expo SDK 57, react-native 0.86. Autolinking moved into
 * `autolinkLibrariesWithApp()`, so the file has no `apply from:` left.
 */
export const sdk57AppBuildGradle = `apply plugin: "com.android.application"
apply plugin: "org.jetbrains.kotlin.android"
apply plugin: "com.facebook.react"

react {
    entryFile = file(["node", "-e", "require('expo/scripts/resolveAppEntry')", projectRoot, "android", "absolute"].execute(null, rootDir).text.trim())
    bundleCommand = "export:embed"

    /* Autolinking */
    autolinkLibrariesWithApp()
}

android {
    namespace "com.anonymous.sdk57app"
}

dependencies {
    implementation("com.facebook.react:react-android")
}
`;

/** Expo SDK 50, Kotlin, `ReactNativeHost` wrapped by Expo. */
export const sdk50MainApplication = `package com.anonymous.sdk50app

import android.app.Application

import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.defaults.DefaultReactNativeHost

import expo.modules.ApplicationLifecycleDispatcher
import expo.modules.ReactNativeHostWrapper

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost = ReactNativeHostWrapper(
        this,
        object : DefaultReactNativeHost(this) {
          override fun getPackages(): List<ReactPackage> {
            return PackageList(this).packages
          }

          override fun getJSMainModuleName(): String = ".expo/.virtual-metro-entry"

          override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG
      }
  )
}
`;

/** Expo SDK 57, Kotlin. No `ReactNativeHost`, no method left to override. */
export const sdk57MainApplication = `package com.anonymous.sdk57app

import android.app.Application

import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.ReactHost

import expo.modules.ApplicationLifecycleDispatcher
import expo.modules.ExpoReactHostFactory

class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    ExpoReactHostFactory.getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // add(MyReactNativePackage())
        }
    )
  }

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)
    ApplicationLifecycleDispatcher.onApplicationCreate(this)
  }
}
`;

/** Expo SDK 49, Java. */
export const sdk49MainApplication = `package com.anonymous.sdk49app;

import android.app.Application;

import com.facebook.react.ReactNativeHost;
import com.facebook.react.defaults.DefaultReactNativeHost;

import expo.modules.ApplicationLifecycleDispatcher;
import expo.modules.ReactNativeHostWrapper;

public class MainApplication extends Application implements ReactApplication {
  private final ReactNativeHost mReactNativeHost = new ReactNativeHostWrapper(
    this,
    new DefaultReactNativeHost(this) {
      @Override
      public boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
      }
    }
  );
}
`;
