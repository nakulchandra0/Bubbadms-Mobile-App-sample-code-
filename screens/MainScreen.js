import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';
import { createAppContainer } from 'react-navigation'
import { createDrawerNavigator } from 'react-navigation-drawer';
import { Feather } from '@expo/vector-icons';
import * as Font from 'expo-font';
import { checkUserSignedIn, getUserData, isSignedIn } from "./auth";
import AppStyles from '../utility/Styles'
import { StackActions, NavigationActions } from 'react-navigation'

import {
  HomeScreen,
  InventoryScreen,
  TradeScreen,
  BuyersScreen,
  CoBuyersScreen,
  InsuranceScreen,
  CalculatorScreen,
  YourdealScreen,
  ReportsScreen,
  OurplanScreen,
  MyprofileScreen,
  AboutScreen,
  LogoutScreen
} from './Index';

import SideBar from "../utility/SideBar";
import EditProfileScreen from './subScreen/EditProfileScreen';
import ChangePasswordScreen from './subScreen/ChangePasswordScreen';
import ProfileSettingsScreen from './subScreen/ProfileSettingsScreen';
import AddInventoryInfoScreen from './subScreen/AddInventoryInfoScreen';
import EditInventoryInfoScreen from './subScreen/EditInventoryInfoScreen';
import ViewInventoryInfoScreen from './subScreen/ViewInventoryInfoScreen';
import EditTradeInfoScreen from './subScreen/EditTradeInfoScreen';
import ViewTradeInfoScreen from './subScreen/ViewTradeInfoScreen';
import AddTradeInfoScreen from './subScreen/AddTradeInfoScreen';
import AddBuyerInfoScreen from './subScreen/AddBuyerInfoScreen';
import EditBuyerInfoScreen from './subScreen/EditBuyerInfoScreen';
import ViewBuyerInfoScreen from './subScreen/ViewBuyerInfoScreen';
import AddCoBuyerInfoScreen from './subScreen/AddCoBuyerInfoScreen';
import EditCoBuyerInfoScreen from './subScreen/EditCoBuyerInfoScreen';
import ViewCoBuyerInfoScreen from './subScreen/ViewCoBuyerInfoScreen';
import AddInsuranceInfoScreen from './subScreen/AddInsuranceInfoScreen';
import EditInsuranceInfoScreen from './subScreen/EditInsuranceInfoScreen';
import ViewInsuranceInfoScreen from './subScreen/ViewInsuranceInfoScreen';
import StartDealScreen from './subScreen/StartDealScreen';
import StartDealViewScreen from './subScreen/StartDealViewScreen';
import BarcodeScannerScreen from './subScreen/BarcodeScannerScreen';
import OcrCameraScreen from './subScreen/OcrCameraScreen';
import { createStackNavigator } from 'react-navigation-stack';


const DrawerNavigator = createDrawerNavigator({
  HomeScreen: {
    screen: HomeScreen,
    navigationOptions: {
      drawerLabel: ({ tintColor }) => (<Text>Home</Text>),
      devider: () => (<View style={styles.devider} />),
      drawerIcon: ({ tintColor }) => <Image source={require('../assets/menu/browser.png')} style={{...styles.icon, tintColor:tintColor}} tintColor={tintColor} />
    }
  },
  InventoryScreen: {
    screen: InventoryScreen,
    navigationOptions: {
      // drawerLabel: () => (<Text style={styles.textMenu}>Inventory</Text>),
      drawerLabel: () => (<Text>Inventory</Text>),
      drawerIcon: ({ tintColor }) => <Image source={require('../assets/menu/Inventory.png')} style={{...styles.icon, tintColor:tintColor}} tintColor={tintColor} />
    }
  },
  TradeScreen: {
    screen: TradeScreen,
    navigationOptions: {
      drawerLabel: () => (<Text>Trade</Text>),
      drawerIcon: ({ tintColor }) => <Image source={require('../assets/menu/Trade.png')} style={{...styles.icon, tintColor:tintColor}} tintColor={tintColor} />
    }
  },
  BuyersScreen: {
    screen: BuyersScreen,
    navigationOptions: {
      drawerLabel: () => (<Text>Buyers</Text>),
      drawerIcon: ({ tintColor }) => <Image source={require('../assets/menu/Buyer.png')} style={{...styles.icon, tintColor:tintColor}} tintColor={tintColor} />
    }
  },
  CoBuyersScreen: {
    screen: CoBuyersScreen,
    navigationOptions: {
      drawerLabel: () => (<Text>Co-Buyers</Text>),
      drawerIcon: ({ tintColor }) => <Image source={require('../assets/menu/Co-Buyers.png')} style={{...styles.icon, tintColor:tintColor}} tintColor={tintColor} />
    }
  },
  InsuranceScreen: {
    screen: InsuranceScreen,
    navigationOptions: {
      drawerLabel: () => (<Text>Insurance</Text>),
      drawerIcon: ({ tintColor }) => <Image source={require('../assets/menu/Insurance.png')} style={{...styles.icon, tintColor:tintColor}} tintColor={tintColor} />
    }
  },
  CalculatorScreen: {
    screen: CalculatorScreen,
    navigationOptions: {
      drawerLabel: () => (<Text>Calculator</Text>),
      drawerIcon: ({ tintColor }) => <Image source={require('../assets/menu/Calculator.png')} style={{...styles.icon, tintColor:tintColor}} tintColor={tintColor} />
    }
  },
  YourdealScreen: {
    screen: YourdealScreen,
    navigationOptions: {
      drawerLabel: () => (<Text>Your Deals</Text>),
      drawerIcon: ({ tintColor }) => <Image source={require('../assets/menu/Yourdeal.png')} style={{...styles.icon, tintColor:tintColor}} tintColor={tintColor} />
    }
  },
  ReportsScreen: {
    screen: ReportsScreen,
    navigationOptions: {
      drawerLabel: () => (<Text>Reports</Text>),
      drawerIcon: ({ tintColor }) => <Image source={require('../assets/menu/Reports.png')} style={{...styles.icon, tintColor:tintColor}} tintColor={tintColor} />
    }
  },
  OurplanScreen: {
    screen: OurplanScreen,
    navigationOptions: {
      drawerLabel: () => (<Text>Our Plan</Text>),
      drawerIcon: ({ tintColor }) => <Image source={require('../assets/menu/OurPlan.png')} style={{...styles.icon, tintColor:tintColor}} tintColor={tintColor} />
    }
  },
  MyprofileScreen: {
    screen: MyprofileScreen,
    navigationOptions: {
      drawerLabel: () => (<Text>Myprofile</Text>),
      drawerIcon: ({ tintColor }) => <Image source={require('../assets/menu/Buyer.png')} style={{...styles.icon, tintColor:tintColor}} tintColor={tintColor} />
    }
  },
  AboutScreen: {
    screen: AboutScreen,
    navigationOptions: {
      drawerLabel: () => (<Text>About</Text>),
      drawerIcon: ({ tintColor }) => <Image source={require('../assets/menu/info.png')} style={{...styles.icon, tintColor:tintColor}} tintColor={tintColor} />
    }
  },
  LogoutScreen: {
    screen: LogoutScreen,
    navigationOptions: {
      drawerLabel: () => (<Hidden />),
    },
  },
  EditProfileScreen: {
    screen: EditProfileScreen,
    navigationOptions: {
      //Return Custom label with null in return.
      //It will hide the label from Navigation Drawer
      drawerLabel: () => (
        <Hidden />
      ),
    },
  },
  ChangePasswordScreen: {
    screen: ChangePasswordScreen,
    navigationOptions: {
      //Return Custom label with null in return.
      //It will hide the label from Navigation Drawer
      drawerLabel: () => (
        <Hidden />
      ),

    },
  },
  ProfileSettingsScreen: {
    screen: ProfileSettingsScreen,
    navigationOptions: {
      //Return Custom label with null in return.
      //It will hide the label from Navigation Drawer
      drawerLabel: () => (
        <Hidden />
      ),
    },
  },
  AddInventoryInfoScreen: {
    screen: AddInventoryInfoScreen,
    navigationOptions: {
      //Return Custom label with null in return.
      //It will hide the label from Navigation Drawer
      drawerLabel: () => (
        <Hidden />
      ),
    },
  },
  EditInventoryInfoScreen: {
    screen: EditInventoryInfoScreen,
    navigationOptions: {
      //Return Custom label with null in return.
      //It will hide the label from Navigation Drawer
      drawerLabel: () => (
        <Hidden />
      ),
    },
  },
  ViewInventoryInfoScreen: {
    screen: ViewInventoryInfoScreen,
    navigationOptions: {
      //Return Custom label with null in return.
      //It will hide the label from Navigation Drawer
      drawerLabel: () => (
        <Hidden />
      ),
    },
  },
  EditTradeInfoScreen: {
    screen: EditTradeInfoScreen,
    navigationOptions: {
      //Return Custom label with null in return.
      //It will hide the label from Navigation Drawer
      drawerLabel: () => (
        <Hidden />
      ),
    },
  },
  ViewTradeInfoScreen: {
    screen: ViewTradeInfoScreen,
    navigationOptions: {
      //Return Custom label with null in return.
      //It will hide the label from Navigation Drawer
      drawerLabel: () => (
        <Hidden />
      ),
    },
  },

  AddTradeInfoScreen: {
    screen: AddTradeInfoScreen,
    navigationOptions: {
      //Return Custom label with null in return.
      //It will hide the label from Navigation Drawer
      drawerLabel: () => (
        <Hidden />
      ),
    },
  },

  AddBuyerInfoScreen: {
    screen: AddBuyerInfoScreen,
    navigationOptions: {
      //Return Custom label with null in return.
      //It will hide the label from Navigation Drawer
      drawerLabel: () => (
        <Hidden />
      ),
    },
  },

  EditBuyerInfoScreen: {
    screen: EditBuyerInfoScreen,
    navigationOptions: {
      //Return Custom label with null in return.
      //It will hide the label from Navigation Drawer
      drawerLabel: () => (
        <Hidden />
      ),
    },
  },

  ViewBuyerInfoScreen: {
    screen: ViewBuyerInfoScreen,
    navigationOptions: {
      //Return Custom label with null in return.
      //It will hide the label from Navigation Drawer
      drawerLabel: () => (
        <Hidden />
      ),
    },
  },

  AddCoBuyerInfoScreen: {
    screen: AddCoBuyerInfoScreen,
    navigationOptions: {
      //Return Custom label with null in return.
      //It will hide the label from Navigation Drawer
      drawerLabel: () => (
        <Hidden />
      ),
    },
  },

  EditCoBuyerInfoScreen: {
    screen: EditCoBuyerInfoScreen,
    navigationOptions: {
      //Return Custom label with null in return.
      //It will hide the label from Navigation Drawer
      drawerLabel: () => (
        <Hidden />
      ),
    },
  },

  ViewCoBuyerInfoScreen: {
    screen: ViewCoBuyerInfoScreen,
    navigationOptions: {
      //Return Custom label with null in return.
      //It will hide the label from Navigation Drawer
      drawerLabel: () => (
        <Hidden />
      ),
    },
  },

  AddInsuranceInfoScreen: {
    screen: AddInsuranceInfoScreen,
    navigationOptions: {
      //Return Custom label with null in return.
      //It will hide the label from Navigation Drawer
      drawerLabel: () => (
        <Hidden />
      ),
    },
  },

  EditInsuranceInfoScreen: {
    screen: EditInsuranceInfoScreen,
    navigationOptions: {
      //Return Custom label with null in return.
      //It will hide the label from Navigation Drawer
      drawerLabel: () => (
        <Hidden />
      ),
    },
  },

  ViewInsuranceInfoScreen: {
    screen: ViewInsuranceInfoScreen,
    navigationOptions: {
      //Return Custom label with null in return.
      //It will hide the label from Navigation Drawer
      drawerLabel: () => (
        <Hidden />
      ),
    },
  },

  StartDealScreen: {
    screen: StartDealScreen,
    navigationOptions: {
      //Return Custom label with null in return.
      //It will hide the label from Navigation Drawer
      drawerLabel: () => (
        <Hidden />
      ),
    },
  },

  StartDealViewScreen: {
    screen: StartDealViewScreen,
    navigationOptions: {
      //Return Custom label with null in return.
      //It will hide the label from Navigation Drawer
      drawerLabel: () => (
        <Hidden />
      ),
    },
  },

  BarcodeScannerScreen: {
    screen: BarcodeScannerScreen,
    navigationOptions: {
      //Return Custom label with null in return.
      //It will hide the label from Navigation Drawer
      drawerLabel: () => (
        <Hidden />
      ),
    },
  },

  OcrCameraScreen: {
    screen: OcrCameraScreen,
    navigationOptions: {
      header: null,
      //Return Custom label with null in return.
      //It will hide the label from Navigation Drawer
      drawerLabel: () => (
        <Hidden />
      ),
    },
  },

},
  {
    contentComponent: props => <SideBar {...props} />,
    drawerWidth: Dimensions.get('window').width - 80,
    // edgeWidth: 0,
    // drawerwid,
    // hideStatusBar:true,
    contentOptions: {
      activeBackgroundColor: AppStyles.colorOrange.color,
      // activeBackgroundColor: '#fd78011f',
      activeTintColor: '#fff',
    }
  }
);

const DrawerNavigatorExample = createStackNavigator({
  DrawerNavigator: { screen: DrawerNavigator, navigationOptions: { header: null } },
});

export default createAppContainer(DrawerNavigator);
// const MyApp = createAppContainer(DrawerNavigatorExample);
// const MyApp = createAppContainer(createDrawerNavigator({}));


// class MainScreen extends React.Component {

//   state = {
//     fontLoaded: false,
//     signedIn: false,
//     checkedSignIn: false
//   }

//   componentDidMount = async () => {
//     const { navigation } = this.props;
//     this.focusListener = navigation.addListener('didFocus', () => {
//       this.setState({
//         signedIn: false,
//         checkedSignIn: false
//       })
//       isSignedIn()
//         .then(res => this.setState({ signedIn: res, checkedSignIn: true }))
//         .catch(err => alert("An error occurred"));
//     });

//     await Font.loadAsync({
//       poppinsBold: require('../assets/fonts/poppinsBold.ttf'),
//       poppinsMedium: require('../assets/fonts/poppinsMedium.ttf'),
//       poppinsRegular: require('../assets/fonts/poppinsRegular.ttf'),
//     })
//     try {
//       this.setState({ fontLoaded: true });
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   componentWillUnmount() { this.focusListener.remove(); }

//   static navigationOptions = {
//     headerShown: false,
//   };

//   render() {
//     const { checkedSignIn, signedIn } = this.state;

//     if (this.state.fontLoaded) {
//       return (
//         <MyApp />
//       );

//     } else {
//       return (
//         <View></View>
//       );
//     }
//   }
// }

class Hidden extends React.Component {
  render() {
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    resizeMode: "contain",
    width: 25,
    height: 25,
    marginLeft: 30,
  },
  // textMenu: {
  //   paddingTop: 10,
  //   paddingBottom: 10,
  //   paddingLeft: 20,
  //   fontFamily: 'poppinsRegular',
  //   fontSize: 16,
  //   color: AppStyles.colorBlack.color,
  // },
  devider: {
    width: '100%',
    height: 1,
    backgroundColor: AppStyles.colorGrey.color,
    marginTop: 0,
  },
});
