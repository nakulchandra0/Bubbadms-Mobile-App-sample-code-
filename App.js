import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
// import Camera from 'react-native-camera';
import { createRootNavigator } from "./screens/router";
import { isFirsttimelogin, isSignedIn } from "./screens/auth";

export default class App extends React.Component {

  state = {
    signedIn: false,
    firsttimeSignIn: false,
    checkedSignIn: false
  };

  async componentDidMount() {

    isSignedIn()
      .then(res => this.setState({ signedIn: res}))
      .catch(err => alert("An error occurred"));

    isFirsttimelogin()
      .then(res => this.setState({ firsttimeSignIn: res, checkedSignIn: true }))
      .catch(err => alert("An error occurred"));
  }

  render() {

    const { checkedSignIn, signedIn, firsttimeSignIn} = this.state;

    // If we haven't checked AsyncStorage yet, don't render anything (better ways to do this)
    if (!checkedSignIn) {
      return null;
    }

    const Layout = createRootNavigator(signedIn, firsttimeSignIn);
    return <Layout />;
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  cameraIcon: {
    margin: 5,
    height: 40,
    width: 40
  },
  bottomOverlay: {
    position: "absolute",
    width: "100%",
    flex: 20,
    flexDirection: "row",
    justifyContent: "space-between"
  },
});
