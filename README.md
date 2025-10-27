# TonChan - A mobile, native TurtleCoin wallet

![Screenshot](https://i.imgur.com/F5LMYKl.png)

### Initial Setup

* `cd TonChan`
* `yarn install`

### Running

* `node --max-old-space-size=8192 node_modules/react-native/local-cli/cli.js start` (Just need to run this once to start the server, leave it running)
* `react-native run-android`

### Logging

`react-native log-android`

### Creating a release

You need to bump the version number in:

* `src/Config.js` - `appVersion`
* `android/app/build.gradle` - `versionCode` and `versionName`
* `package.json` - `version` - Not strictly required
* Update user agent in `android/app/src/main/java/com/tonchan/MainApplication.java` and `android/app/src/main/java/com/tonchan/TurtleCoinModule.java`

Then either run `yarn deploy-android`, or:

`cd android`

#### Create an AAB
`./gradlew bundleRelease`

#### Create an APK
`./gradlew assembleRelease`

#### Deploy to device
`./gradlew installRelease`



NDK richiesto per questo fork: 17.2.4988734
nel caso di link symlink interrotti: 
find /root/mobile/node_modules -type l ! -exec test -e {} \; -exec rm {} \;


sudo apt update
sudo apt install libtinfo5
Se il pacchetto libtinfo5 non esiste (su versioni più recenti di Ubuntu) puoi creare un link simbolico da libtinfo.so.6:

bash
Copia codice
sudo apt install libncurses5
sudo ln -s /lib/x86_64-linux-gnu/libtinfo.so.6 /lib/x86_64-linux-gnu/libtinfo.so.5

per la compilazione meglio se fai: export NODE_OPTIONS=--openssl-legacy-provider


