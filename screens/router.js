import React, { Component } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View, Image, ImageBackground } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import InfoScreen from '../screens/InfoScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ForgetPassScreen from '../screens/ForgetPassScreen';
import OtpScreen from '../screens/OtpScreen';
import ChangePassScreen from '../screens/ChangePassScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import MainScreen from '../screens/MainScreen';
import { AsyncStorage } from 'react-native';

import { createDrawerNavigator } from 'react-navigation-drawer';

// // componentDidMount = () => AsyncStorage.getItem('user').then((value) => this.setState({ 'islogin': value }))
// export const AuthStack = createStackNavigator({
//   //Constant which holds all the screens like index of any book 
//   //First entry by default be our first screen if we do not define initialRouteName
//   InfoScreen: { screen: InfoScreen },
//   LoginScreen: { screen: LoginScreen },
//   SignupScreen: { screen: SignupScreen },
//   ForgetPassScreen: { screen: ForgetPassScreen },
//   OtpScreen: { screen: OtpScreen },
//   ChangePassScreen: { screen: ChangePassScreen },
//   RegistrationScreen: { screen: RegistrationScreen },
//   MainScreen: { screen: MainScreen },

// }
//   // ,
//   // {
//   //   initialRouteName: "InfoScreen",
//   // }
// );

// export const AppStack = createStackNavigator({
//   //Constant which holds all the screens like index of any book 
//   //First entry by default be our first screen if we do not define initialRouteName
//   // InfoScreen: { screen: InfoScreen }, 
//   // LoginScreen: { screen: LoginScreen }, 
//   // SignupScreen: { screen: SignupScreen }, 
//   // ForgetPassScreen: { screen: ForgetPassScreen }, 
//   // OtpScreen: { screen: OtpScreen }, 
//   // ChangePassScreen: { screen: ChangePassScreen }, 
//   // RegistrationScreen: { screen: RegistrationScreen }, 
//   MainScreen: { screen: MainScreen },

// }
//   // ,
//   // {
//   //   initialRouteName: "MainScreen",
//   // }
// );

// export default createAppContainer(App);


// export const createRootNavigator = (signedIn = false) => {
//   return signedIn ? createAppContainer(AppStack) : createAppContainer(AuthStack);
// };

const AppStack = createStackNavigator({
  InfoScreen: { screen: InfoScreen },
  LoginScreen: { screen: LoginScreen },
  SignupScreen: { screen: SignupScreen },
  ForgetPassScreen: { screen: ForgetPassScreen },
  OtpScreen: { screen: OtpScreen },
  ChangePassScreen: { screen: ChangePassScreen },
  RegistrationScreen: { screen: RegistrationScreen },
  MainScreen: { screen: MainScreen, navigationOptions: { header: null } },
},
  {
    initialRouteName: "MainScreen",
  }
);

const AuthStack = createStackNavigator({
  InfoScreen: { screen: InfoScreen },
  LoginScreen: { screen: LoginScreen },
  SignupScreen: { screen: SignupScreen },
  ForgetPassScreen: { screen: ForgetPassScreen },
  OtpScreen: { screen: OtpScreen },
  ChangePassScreen: { screen: ChangePassScreen },
  RegistrationScreen: { screen: RegistrationScreen },
  MainScreen: { screen: MainScreen, navigationOptions: { header: null } },
},
  {
    initialRouteName: "InfoScreen",
  }
);

const AuthStack2 = createStackNavigator({
  LoginScreen: { screen: LoginScreen },
  SignupScreen: { screen: SignupScreen },
  ForgetPassScreen: { screen: ForgetPassScreen },
  OtpScreen: { screen: OtpScreen },
  ChangePassScreen: { screen: ChangePassScreen },
  RegistrationScreen: { screen: RegistrationScreen },
  MainScreen: { screen: MainScreen, navigationOptions: { header: null } },
},
  {
    initialRouteName: "LoginScreen",
  }
);

export const createRootNavigator = (signedIn = false, firsttimeSignIn = false) => {
  // return signedIn ? createAppContainer(AppStack) : createAppContainer(AuthStack);

return firsttimeSignIn ? signedIn ? createAppContainer(AppStack) : createAppContainer(AuthStack2) : signedIn ? createAppContainer(AppStack) : createAppContainer(AuthStack);
  // return createAppContainer(DrawerNavigatorExample)
};


