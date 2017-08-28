# Curbmap React Native App

(update for preferred npm since Xcode uses npm)

## iOS or Android
**Install the dependencies**:
```
npm i
```

**Start the packager**
```
npm start
```

or if node is misbehaving
```
npm start -- --reset-cache
```

## Xcode/iOS
1. Start Xcode
2. Build and run the project from the **ios** directory (you may have to sign the thing if you're running on your own device)


## AndroidStudio/Android
1. Start AndroidStudio
2. Build and run the project from the **android** directory (uses gradle)

## To build for production
```
npm i -g react-native-cli

react-native bundle --entry-file index.ios.js --platform ios --dev false --bundle-output ios/main.jsbundle --assets-dest ios

```
## Xcode/iOS
1. Switch which line is commented in AppDelegate.m
    1. 21 should be run
    2. 25 should be **commented out**

