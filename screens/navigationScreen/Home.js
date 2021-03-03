import React from 'react';
import { Ionicons, Entypo, FontAwesome } from '@expo/vector-icons';
import { AsyncStorage, StyleSheet, View, Text, ActivityIndicator, TextInput, Image, TouchableOpacity, Dimensions, ToastAndroid, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AppStyles from '../../utility/Styles'
import { checkUserSignedIn, getUserData, isSignedIn, storeUserData, USERDATA_KEY } from "../../screens/auth";
import { PROFILE_IMAGE_URL, PROFILE_IMAGE, API_URL, capitalize } from '../../utility/Constants';
import { LogoutScreen } from '../Index';
import App from '../../App';
import * as Font from 'expo-font';
import NetInfo from '@react-native-community/netinfo';
// import ActionButton from 'react-native-circular-action-menu'

export default class Home extends React.Component {

  // static navigationOptions = ({
  //   gesturesEnabled: false,
  //   drawerPosition: "right"
  // });

  constructor(props) {
    super();
    this.proileImage = 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80';
    const {
      navigation
    } = props;

    getUserData()
      .then(res => {
        let data = JSON.parse(res);
        //console.log(data);
        // console.log(data.id);
        this.setState({ firstname: data.first_name, lastname: data.last_name, proileImage: data.profile_image ? PROFILE_IMAGE_URL + data.profile_image : PROFILE_IMAGE });
      })
      .catch(err => alert("An error occurred"));

  }

  state = {
    userid: "",
    firstname: "",
    lastname: "",
    proileImage: "",
    signedIn: false,
    checkedSignIn: false,
    isLoading: false,
    fontLoaded: false,
  }

  componentDidMount = async () => {

    // const unsubscribe = NetInfo.addEventListener(state => {
    //   console.log('Connection type', state.type);
    //   console.log('Is connected?', state.isConnected);
    // });

    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      // The screen is focused

      this.setState({
        signedIn: false,
        checkedSignIn: false
      })

      isSignedIn()
        .then(res => this.setState({ signedIn: res, checkedSignIn: true }))
        .catch(err => alert("An error occurred"));

      getUserData()
        .then(res => {
          let data = JSON.parse(res);
          //console.log(data);
          //console.log(data.id);
          this.setState({ userid: data.id });
          this.setState({ firstname: data.first_name, lastname: data.last_name, proileImage: data.profile_image ? PROFILE_IMAGE_URL + data.profile_image : PROFILE_IMAGE });
          this.packageexpired()
          this.upadateProfileData()
        })
        .catch(err => alert("An error occurred"));

    });

    await Font.loadAsync({
      poppinsBold: require('../../assets/fonts/poppinsBold.ttf'),
      poppinsMedium: require('../../assets/fonts/poppinsMedium.ttf'),
      poppinsRegular: require('../../assets/fonts/poppinsRegular.ttf'),
    })
    try {
      this.setState({ fontLoaded: true });
    } catch (error) {
      console.log(error);
    }

  }

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }

  packageexpired() {

    this.setState({ isLoading: true });
    var data = {
      "member_id": this.state.userid
    }
    // console.log(data);

    fetch(API_URL + "packageexpired", {
      method: "POST",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        // console.log(data);
        if (data.status == "true") {
          {
            //ToastAndroid.show(data.message, ToastAndroid.SHORT);
            if (Platform.OS === 'android') {
              ToastAndroid.show(data.message, ToastAndroid.SHORT);
            } else {
              alert(data.message);
            }
            this.props.navigation.navigate('OurplanScreen');
          }
        } else {
          //ToastAndroid.show(data.message, ToastAndroid.SHORT);
          // this.props.navigation.navigate('StartDealScreen', { transact_id: '', modelType: '' })
          // this.getBuyerList();

        }

      })
      .catch((error) => console.error(error))
      .finally(() => this.setState({ isLoading: false }));

    // this.props.navigation.navigate('StartDealScreen',{ transact_id:'', modelType: '' })
  }
  
  async upadateProfileData() {
    var data = {
      "member_id": this.state.userid
    }
    fetch(API_URL + "fetchuserdata", {
      method: "POST",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        // console.log(data);
        if (data.status == "true") {
          storeUserData(data.data)
        }
      })
      .catch((error) => console.error(error))
      .finally(() => this.setState({ isLoading: false }));
  }

  openstartdeal() {

    this.setState({ isLoading: true });
    var data = {
      "member_id": this.state.userid
    }
    // console.log(data);

    fetch(API_URL + "packageexpired", {
      method: "POST",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        // console.log(data);
        if (data.status == "true") {
          {
            //ToastAndroid.show(data.message, ToastAndroid.SHORT);
            if (Platform.OS === 'android') {
              ToastAndroid.show(data.message, ToastAndroid.SHORT);
            } else {
              alert(data.message);
            }
            this.props.navigation.navigate('OurplanScreen');
          }
        } else {
          //ToastAndroid.show(data.message, ToastAndroid.SHORT);
          this.props.navigation.navigate('StartDealScreen', { transact_id: '', modelType: '' })

        }

      })
      .catch((error) => console.error(error))
      .finally(() => this.setState({ isLoading: false }));

    // this.props.navigation.navigate('StartDealScreen',{ transact_id:'', modelType: '' })
  }



  toggleDrawer = () => {
    //Props to open/close the drawer
    this.props.navigation.toggleDrawer();
  };

  //Screen1 Component
  render() {
    const { checkedSignIn, signedIn } = this.state;
    if (!checkedSignIn) {
      return (<View style={styles.container}>
        <View style={AppStyles.loader}>
          <ActivityIndicator size='large' color={AppStyles.colorOrange.color} />
        </View>
      </View>);
    }
    // if (signedIn)
    if (this.state.fontLoaded) {
      return (
        <View style={styles.container}>
          {/* <NavigationDrawer /> */}

          {/* menu header start */}
          <TouchableOpacity style={AppStyles.navigationButton} onPress={this.props.navigation.openDrawer}>
            {/*Donute Button Image */}
            <Image
              source={require('../../assets/menu/menu.png')}
              style={{ width: 30, height: 18, margin: 10, }}
            />
          </TouchableOpacity>
          <TouchableOpacity style={AppStyles.sideMenuProfileIcon} onPress={() => this.props.navigation.navigate("MyprofileScreen")} activeOpacity={0.7}>
            <Image
              source={{ uri: this.state.proileImage }}
              style={{ ...AppStyles.sideMenuProfileIcon, marginTop: 0, margin: 0, }}
            />
          </TouchableOpacity>
          {/* menu header end */}

          <Text style={styles.header_label}>Hello</Text>

          <Text style={styles.header_username}>{capitalize(this.state.firstname + " " + this.state.lastname)}</Text>

          <ScrollView showsVerticalScrollIndicator={false}>

            <View style={{ flexDirection: "column", paddingBottom: 100 }}>

              <View style={{ flexDirection: "row" }}>

                <TouchableOpacity activeOpacity={0.5} style={styles.mainCard} onPress={() => this.props.navigation.navigate("InventoryScreen")}>
                  <Image
                    source={require('../../assets/home/Inventory.png')}
                    style={styles.box_icon}
                  />
                  <Text style={styles.text}>Inventory</Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.5} style={styles.mainCard} onPress={() => this.props.navigation.navigate("TradeScreen")}>
                  <Image
                    source={require('../../assets/home/Trade.png')}
                    style={styles.box_icon}
                  />
                  <Text style={styles.text}>Trade In</Text>
                </TouchableOpacity>

              </View>

              <View style={{ flexDirection: "row" }}>

                <TouchableOpacity activeOpacity={0.5} style={styles.mainCard} onPress={() => this.props.navigation.navigate("BuyersScreen")}>
                  <Image
                    source={require('../../assets/home/Buyer.png')}
                    style={styles.box_icon}
                  />
                  <Text style={styles.text}>Buyer</Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.5} style={styles.mainCard} onPress={() => this.props.navigation.navigate("CoBuyersScreen")}>
                  <Image
                    source={require('../../assets/home/Co-Buyers.png')}
                    style={styles.box_icon}
                  />
                  <Text style={styles.text}>Co-Buyer</Text>
                </TouchableOpacity>

              </View>

              <View style={{ flexDirection: "row" }}>

                <TouchableOpacity activeOpacity={0.5} style={styles.mainCard} onPress={() => this.props.navigation.navigate("InsuranceScreen")}>
                  <Image
                    source={require('../../assets/home/Insurance.png')}
                    style={styles.box_icon}
                  />
                  <Text style={styles.text}>Insurance</Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.5} style={styles.mainCard} onPress={() => this.props.navigation.navigate("CalculatorScreen")}>
                  <Image
                    source={require('../../assets/home/Calculator.png')}
                    style={styles.box_icon}
                  />
                  <Text style={styles.text}>Calculator</Text>
                </TouchableOpacity>

              </View>

              <View style={{ flexDirection: "row" }}>

                <TouchableOpacity activeOpacity={0.5} style={styles.mainCard} onPress={() => this.props.navigation.navigate("YourdealScreen")}>
                  <Image
                    source={require('../../assets/home/Deal.png')}
                    style={styles.box_icon}
                  />
                  <Text style={styles.text}>Deals</Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.5} style={styles.mainCard} onPress={() => this.props.navigation.navigate("ReportsScreen")}>
                  <Image
                    source={require('../../assets/home/Report.png')}
                    style={styles.box_icon}
                  />
                  <Text style={styles.text}>Report</Text>
                </TouchableOpacity>

              </View>

            </View>

          </ScrollView>

          {this.state.isLoading ?
            <View style={AppStyles.loader}>
              <ActivityIndicator size='large' color={AppStyles.colorOrange.color} />
            </View>
            :
            <View></View>}

          {/* big orange button */}
          <TouchableOpacity style={AppStyles.buttonCard} activeOpacity={0.8} onPress={() => this.openstartdeal()}>
            <Text style={AppStyles.buttonCardText}>Start Deal</Text>
            <Image
              source={require('../../assets/home/buttonarrow.png')}
              style={{ width: 45, height: 45, marginLeft: 10 }}
            />
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View></View>
      );
    }
    // return (
    //   <App />
    // )

  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignContent: 'stretch',
    // alignItems: 'center',
    backgroundColor: AppStyles.backgroundColor.color
  },

  mainCard: {
    // height: 100,
    width: Dimensions.get('window').width / 2.25,
    // alignItems: "center",
    // justifyContent: "center",
    // position: "absolute", //Here is the trick
    // bottom: 0,
    // alignSelf: "center",
    flexDirection: 'column',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 5,
    backgroundColor: '#fff',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
  },

  header_label: {
    fontSize: 16,
    textAlign: 'left',
    marginLeft: 10,
    marginRight: 0,
    marginTop: 80,
    color: AppStyles.colorGreyDark.color,
    fontFamily: 'poppinsMedium',
  },
  header_username: {
    textAlign: 'left',
    marginRight: 0,
    marginTop: -5,
    marginLeft: 10,
    fontSize: 26,
    color: AppStyles.colorBlack.color,
    fontFamily: 'poppinsBold',
  },
  box_icon: {
    width: 50,
    height: 50,
  },
  text: {
    fontSize: 20,
    color: AppStyles.colorOrange.color,
    textAlign: 'left',
    fontFamily: 'poppinsMedium',
    marginTop: 5,
    marginLeft: 0,
    marginRight: 0,
  },
  text2: {
    fontSize: 12,
    color: '#01184e',
    textAlign: 'center',
    fontFamily: 'poppinsRegular',
    marginLeft: 0,
    marginRight: 0,
  },
  dotIcon: {
    marginLeft: 0,
    marginTop: 0,
    // alignSelf: 'center',
    textAlign: 'center',
  },

  button: {
    width: Dimensions.get('window').width / 1.15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: '#f16484',
    alignSelf: 'center',
    marginBottom: 10,
  },

  icon: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#01184e',
    borderRadius: 60 / 2,
    position: 'absolute',
    marginTop: 15
  },
  iconcar: {
    flex: 1,
    width: 50,
    height: 20,
    resizeMode: 'contain',
    alignSelf: 'center',
    // backgroundColor: '#fff',
  },
  iconViewActive: {
    marginTop: -6,
    alignSelf: 'center',
    position: 'absolute',
    width: 35,
    height: 35,
    justifyContent: 'center',
    backgroundColor: '#01184e',
    borderRadius: 60 / 2,
  },
  iconViewDeactive: {
    marginTop: -6,
    alignSelf: 'center',
    position: 'absolute',
    width: 35,
    height: 35,
    justifyContent: 'center',
    backgroundColor: '#636363',
    borderRadius: 60 / 2,
  },
  profileIcon: {
    resizeMode: 'center',
    width: 40,
    height: 40,
    marginVertical: 10,
    marginLeft: 20,
    borderRadius: 100,
  },


});  