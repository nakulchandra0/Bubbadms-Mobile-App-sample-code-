import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View, Image, TouchableOpacity, BackHandler, Alert } from 'react-native';
import * as Font from 'expo-font';

export default class InfoScreen extends React.Component {

  static navigationOptions = navigation => ({
    headerShown: false,
    gesturesEnabled: false,
    drawerLockMode: 'locked-closed',
  });

  state = {
    showRealApp: false,
    fontLoaded: false
  }

  componentDidMount = async () => {
    const backAction = () => {
      Alert.alert("Hold on!", "Are you sure you want to exit?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        { text: "YES", onPress: () => BackHandler.exitApp() }
      ]);
      return true;
    };

    this.backHandler  = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    

    await Font.loadAsync({
      poppinsBold: require('../assets/fonts/poppinsBold.ttf'),
      poppinsMedium: require('../assets/fonts/poppinsMedium.ttf'),
      poppinsRegular: require('../assets/fonts/poppinsRegular.ttf'),
    })
    try {
      this.setState({ fontLoaded: true });
    } catch (error) {

    }
  }

  componentWillUnmount() {
    // Remove the event listener
    this.backHandler.remove();
}



  render() {
    if (this.state.showRealApp) {
      return (
        <InfoScreen />
      );
    } else {

      if (this.state.fontLoaded) {
        return (
          <View style={styles.container}>
            <Image source={require('../assets/images/car_with_man.png')} style={styles.image} />
            <Text style={styles.title}>Now it's easy to manage your car deal</Text>
            <Text style={styles.text}>{'Bubba DMS is the future of car sales, the beginning of a new era in the car industry.'}</Text>
            <TouchableOpacity
              activeOpacity={.5}
              onPress={() => this.props.navigation.replace('LoginScreen')}>
              <Image source={require('../assets/images/arrow_right_orange.png')}
              style={styles.imageIconStyle}/>
            </TouchableOpacity>
          </View>
        );
      }
      else {
        return (
          <View></View>
        );
      }
    }
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: "column"
  },
  image: {
    flex: 0,
    resizeMode: "center",
    justifyContent: "flex-end",
    height:300,
    width:'85%'
  },
  text: {
    fontSize: 14,
    color: 'black',
    textAlign: 'left',
    marginBottom: 65,
    fontFamily: 'poppinsRegular',
    marginHorizontal:30,
    alignSelf:'flex-start'
  },
  title: {
    fontSize: 26,
    color: '#000',
    textAlign:"left",
    marginBottom: 16,
    fontFamily: 'poppinsMedium',
    marginHorizontal:30,
    alignSelf:'flex-start'

  },
  imageIconStyle: {
    alignSelf:"center",
    width:60,
    height:60,
  },
});
