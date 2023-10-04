/**
 * @format
 */

 import {AppRegistry} from 'react-native';
 import App from './src/navigators/MainNavigator';
 import {name as appName} from './app.json';
 // import 'react-native-gesture-handler';
 
 AppRegistry.registerComponent(appName, () => App);
 