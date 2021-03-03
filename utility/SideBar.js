import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ImageBackground, Image, Platform, AsyncStorage } from 'react-native'
import { DrawerNavigatorItems } from 'react-navigation-drawer';
import { Ionicons } from '@expo/vector-icons'
import { getUserData, onSignOut } from "../screens/auth";
import Constants from 'expo-constants';
import AppStyles from './Styles'
import { App } from '../App';
import { LogoutScreen } from '../screens/Index';
import { PROFILE_IMAGE_URL, PROFILE_IMAGE, capitalize } from './Constants';
import { StackActions, NavigationActions } from 'react-navigation'
import { createRootNavigator } from '../screens/router';
// import * as Font from 'expo-font';
import { useFonts } from 'expo-font';
// const profileImage = 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80';

const MyUserData = () => {

  const [name, setName] = useState("NA");
  const [phone_number, setPhone_number] = useState("NA");
  const [profileImage, setProfileImage] = useState("NA");
  getUserData()
    .then(res => {
      let data = JSON.parse(res);
      //console.log(data);
      setName(data.first_name + " " + data.last_name);
      setPhone_number(data.phone);
      setProfileImage(data.profile_image ? PROFILE_IMAGE_URL + data.profile_image : PROFILE_IMAGE);
    })
    .catch(err => alert("An error occurred"));
  return (

    <View style={styles.sideMenuHeader}>
      <Image
        source={{ uri: profileImage }}
        style={styles.sideMenuProfileIcon}
      />
      <View style={{ flexDirection: 'column', flex: 0 }}>
        <Text style={styles.text2}> {capitalize(name)} </Text>
        <Text style={styles.text3}> {phone_number} </Text>
      </View>

    </View>

  )
}

// class Mydata extends React.Component {

//   state = {
//     name: "",
//     phone_number: ""
//   }
//   componentDidMount() {
//     getUserData()
//       .then(res => {
//         let data = JSON.parse(res);
//         console.log("data");
//         //name = data.fname+" "+data.lname;
//         this.setState({
//           name: data.fname + " " + data.lname,
//           phone_number: data.phone_number
//         })
//         ///phone_number = data.phone_number;
//         //console.log(phone_number);
//         // phone_number1 = data.phone_number;
//       })
//       .catch(err => alert("An error occurred"));
//   }
//   render() {

//     return (
//       <View style={{ flexDirection: 'column', flex: 1 }}>
//         <Text style={styles.text2}> {this.state.name}</Text>
//         <Text style={styles.text3}> {this.state.phone_number} </Text>
//       </View>
//     )
//   }
// }

export default SideBar = props => {

  let [fontsLoaded] = useFonts({
    'poppinsBold': require('../assets/fonts/poppinsBold.ttf'),
    'poppinsMedium': require('../assets/fonts/poppinsMedium.ttf'),
    'poppinsRegular': require('../assets/fonts/poppinsRegular.ttf'),
  });

  if (fontsLoaded) {
    return (
      <View style={styles.sideMenuContainer}>
        {/*Top Large Image */}
        {/* <View style={styles.sideMenuHeader}>
        <Image
          source={{ uri: profileImage }}
          style={styles.sideMenuProfileIcon}
        />
        <View style={{ flexDirection: 'column', flex: 1 }}>
          <Text style={styles.text2}> Gautam Prajapati</Text>
          <Text style={styles.text3}> +91 (123)458 789 </Text>
        </View>
      </View> */}
        <MyUserData />
        {/*Divider between Top Image and Sidebar Option*/}
        {/* <View style={styles.devider} /> */}
        {/*Setting up Navigation Options from option array using loop*/}
        <ScrollView showsVerticalScrollIndicator={false}>

          <View style={{ width: '100%' }}>
            <DrawerNavigatorItems {...props}

              getLabel={(scene) => {

                if (scene.index > 11) {

                  return null;

                } else {
                  return (
                    <View>
                      <Text style={[scene.focused == true ? styles.textMenuActive : styles.textMenu]}>{props.getLabel(scene)}</Text>
                      {/* <View style={styles.devider} /> */}
                    </View>)
                }
              }}
            />

            <TouchableOpacity
              activeOpacity={.5}
              onPress={() => {
                onSignOut();
                // AsyncStorage.clear();
                props.navigation.replace('LoginScreen', { replaceRoute: true })
              }
              }>
              <Image source={require('../assets/menu/logout.png')}
                style={styles.imageIconStyle} />
            </TouchableOpacity>

          </View>
        </ScrollView>


        {/* <View style={{ flex: 1 }}>
        <Text style={{
          marginHorizontal: 80,
          position: 'absolute',
          bottom: 10,
          fontFamily: 'poppinsRegular',
        }}>v1.0.0</Text>
      </View> */}


      </View>
    )
  } else {
    return (
      <View></View>
    );
  }
};

const styles = StyleSheet.create({
  sideMenuContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    // alignItems: 'center',
    paddingTop: 0,
  },
  sideMenuHeader: {
    backgroundColor: AppStyles.colorOrange.color,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'column',
    paddingTop: 40,
    paddingBottom: 20,
  },
  sideMenuProfileIcon: {
    resizeMode: 'cover',
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 50 / 2,
  },
  text2: {
    fontSize: 18,
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'poppinsMedium',
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
  },
  text3: {
    fontSize: 12,
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'poppinsRegular',
    marginLeft: 5,
    marginRight: 5,
  },
  devider: {
    width: '100%',
    height: 1,
    backgroundColor: AppStyles.colorGrey.color,
    marginTop: 0,
  },
  imageIconStyle: {
    alignSelf: "center",
    width: 60,
    height: 60,
    marginTop: 10,
    marginBottom: 20,
  },
  textMenu: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    fontFamily: 'poppinsRegular',
    fontSize: 16,
    color: AppStyles.colorBlack.color,
  },
  textMenuActive: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    fontFamily: 'poppinsRegular',
    fontSize: 16,
    color: AppStyles.colorWhite.color,
  },
});

