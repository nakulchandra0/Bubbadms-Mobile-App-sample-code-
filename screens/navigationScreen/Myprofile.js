import React from 'react';
import { Ionicons, Entypo, FontAwesome5 } from '@expo/vector-icons';
import { StyleSheet, View, Text, Button, TextInput, Image, TouchableOpacity, Dimensions, ToastAndroid } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AppStyles from '../../utility/Styles'
import { getUserData, storeUserData } from "../auth";
import { API_URL, capitalize, PROFILE_IMAGE, PROFILE_IMAGE_URL } from '../../utility/Constants';
// import ActionButton from 'react-native-circular-action-menu'

export default class Myprofile extends React.Component {
  //static navigationOptions = {headerShown: false,};
  constructor(props) {
    super();
    this.profileImage = 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80';
    const {
      navigation
    } = props;

    getUserData()
      .then(res => {
        let data = JSON.parse(res);
        this.setState({ userid: data.id, items: data })
        // setProfileImage(data.profile_image);
      })
      .catch(err => alert("An error occurred"));
  }

  state = {
    userid: '',
    items: []
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      // The screen is focused
      // Call any action
      
      getUserData()
      .then(res => {
        let data = JSON.parse(res);
        this.setState({ userid: data.id, items: data })
        // setProfileImage(data.profile_image);
        this.packageexpired()
      })
      .catch(err => alert("An error occurred"));

    });
  }

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }


  toggleDrawer = () => {
    //Props to open/close the drawer
    this.props.navigation.toggleDrawer();
  };

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
        }

      })
      .catch((error) => console.error(error))
      .finally(() => this.setState({ isLoading: false }));

    // this.props.navigation.navigate('StartDealScreen',{ transact_id:'', modelType: '' })
  }


  //Screen1 Component
  render() {


    return (
      <View style={styles.container}>
        {/* <NavigationDrawer /> */}

        <View style={{ flexDirection: "row" }}>

          {/* menu header start */}
          <TouchableOpacity style={AppStyles.navigationButton} onPress={this.props.navigation.openDrawer}>
            {/*Donute Button Image */}
            <Image
              source={require('../../assets/menu/menu.png')}
              style={{ width: 30, height: 18, margin: 10, }}
            />
          </TouchableOpacity>
          {/* menu header end */}
          <TouchableOpacity style={{ marginTop: 45, right: 10, position: "absolute" }} onPress={() => this.props.navigation.navigate("ProfileSettingsScreen")}>
            <Image
              style={{ width: 24, height: 20, resizeMode: "contain" }}
              source={require('../../assets/images/controls.png')}
            />
          </TouchableOpacity>

        </View>

        <Text style={AppStyles.header_title_screen}>Profile</Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ flexDirection: "column", marginTop: 10 }}>
            <View style={{ flexDirection: "column", alignItems: 'center', justifyContent: 'space-around' }}>
              <Image
                source={{ uri: this.state.items.profile_image ? PROFILE_IMAGE_URL + this.state.items.profile_image : PROFILE_IMAGE}}
                style={styles.profileIcon}
              />
              <Text style={{ ...styles.text1, marginTop: 5 }}>{capitalize(this.state.items.first_name+"")} {this.state.items.last_name}</Text>
            </View>
            <View style={{ flexDirection: "column", marginHorizontal: 10 }}>
              <Text style={styles.text}> Email </Text>
              <Text style={styles.text2} numberOfLines={1}> {this.state.items.email} </Text>

              <Text style={styles.text}> Phone </Text>
              <Text style={styles.text2} numberOfLines={1}> {this.state.items.phone} </Text>

              <Text style={styles.text}> Website </Text>
              <Text style={styles.text2} numberOfLines={1}> {this.state.items.website} </Text>

              <Text style={styles.text}> Address </Text>
              <Text style={styles.text2} numberOfLines={1}> {this.state.items.address} </Text>

              <Text style={styles.text}> City </Text>
              <Text style={styles.text2} numberOfLines={1}> {this.state.items.city} </Text>

              <Text style={styles.text}> State </Text>
              <Text style={styles.text2} numberOfLines={1}> {this.state.items.state} </Text>

              <Text style={styles.text}> Zip Code </Text>
              <Text style={styles.text2} numberOfLines={1}> {this.state.items.zip} </Text>

              <Text style={styles.text}> Company Name </Text>
              <Text style={styles.text2} numberOfLines={1}> {this.state.items.company_name} </Text>

              <TouchableOpacity style={styles.buttonCard} activeOpacity={0.8} onPress={() => this.props.navigation.navigate("EditProfileScreen")}>
                <Text style={styles.buttonCardText}>Edit Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.buttonCard} activeOpacity={0.8} onPress={() => this.props.navigation.navigate("ChangePasswordScreen")}>
                <Text style={styles.buttonCardText}>Change Password</Text>
              </TouchableOpacity>

            </View>

          </View>

        </ScrollView>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignContent: 'stretch',
    // alignItems: 'center',
    // backgroundColor:'red'
  },
  profileIcon: {
    resizeMode: 'cover',
    width: 100,
    height: 100,
    marginTop: 5,
    // marginLeft: 10,
    borderRadius: 50 / 2,
  },
  text: {
    fontSize: 16,
    textAlign: 'left',
    color: AppStyles.colorGreyDark.color,
    fontFamily: 'poppinsRegular',
  },
  text1: {
    fontSize: 18,
    textAlign: 'left',
    color: AppStyles.colorBlack.color,
    fontFamily: 'poppinsMedium',
    marginTop: -5
  },
  text2: {
    fontSize: 16,
    textAlign: 'left',
    color: AppStyles.colorBlack.color,
    fontFamily: 'poppinsMedium',
    marginTop: -5
  },
  buttonCard: {
    marginTop: 10,
    // marginBottom:20,
    paddingHorizontal: 10,
    paddingVertical: 2,
    backgroundColor: '#fd7801',
    borderColor: '#fd7801',
    borderWidth: 1,
    borderRadius: 10,
  },
  buttonCardText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'poppinsBold',
    marginVertical: 5,
    textAlign: "center",
  },
});  