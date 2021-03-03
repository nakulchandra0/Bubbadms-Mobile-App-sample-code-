import React from 'react';
import { Ionicons, Entypo, FontAwesome } from '@expo/vector-icons';
import { StyleSheet, View, Text, Button, TextInput, Image, TouchableOpacity, Dimensions, Modal, TouchableHighlight, TouchableWithoutFeedback, ActivityIndicator, ToastAndroid, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AppStyles from '../../utility/Styles'
import { getUserData, storeUserData } from "../../screens/auth";
import { API_URL, commafy } from '../../utility/Constants'

export default class Insurance extends React.Component {
  //static navigationOptions = {headerShown: false,};
  constructor(props) {
    super();
    this.proileImage = 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80';
    const {
      navigation
    } = props;

  }

  state = {
    userid: "",
    isLoading: false,
    isModalDeleteVisible: false,
    items: [],
    itemsMirror: [],
    searchText: '',
    buyers_id_for_delete: ''
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      // The screen is focused
      // Call any action
      this.setState({ searchText: '' })
      getUserData()
        .then(res => {
          let data = JSON.parse(res);
          //console.log(data);
          // console.log(data.id);
          this.setState({ userid: data.id });
          this.packageexpired()
          // this.getBuyerList();
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

  toggleModalDelete(buyers_id) {
    this.setState({ isModalDeleteVisible: !this.state.isModalDeleteVisible, buyers_id_for_delete: buyers_id });
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
          // this.props.navigation.navigate('StartDealScreen', { transact_id: '', modelType: '' })
          this.getBuyerList();
        }

      })
      .catch((error) => console.error(error))
      .finally(() => this.setState({ isLoading: false }));

    // this.props.navigation.navigate('StartDealScreen',{ transact_id:'', modelType: '' })
  }

  deleteInsuranceFromList() {
    this.setState({ isModalDeleteVisible: !this.state.isModalDeleteVisible });
    if (this.state.items.some(e => e.buyers_id === this.state.buyers_id_for_delete)) {
      var array = this.state.items;
      var index = array.findIndex(x => x.buyers_id === this.state.buyers_id_for_delete)
      //remove data from live database
      this.deleteInsurance(this.state.buyers_id_for_delete)
      //remove data from local
      if (index > -1) array.splice(index, 1);
    }
  }

  async deleteInsurance(buyers_id) {

    this.setState({ isLoading: true });

    var data = {
      "buyers_id": buyers_id
    }

    fetch(API_URL + "deleteinsurance", {
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
          if (Platform.OS === 'android') {
            ToastAndroid.show(data.message, ToastAndroid.SHORT);
          } else {
            alert(data.message);
          }
        } else {
          if (Platform.OS === 'android') {
            ToastAndroid.show("Something went wrong! " + data.message, ToastAndroid.SHORT);
          } else {
            alert("Something went wrong! " + data.message);
          }
        }
      })
      .catch((error) => console.error(error))
      .finally(() => this.setState({ isLoading: false }));
  }

  async getBuyerList() {

    this.setState({ isLoading: true });
    this.setState({
      items: []
    })
    var data = {
      "member_id": this.state.userid
    }
    fetch(API_URL + "buyerlist", {
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
            data.data.map((item, key) => {
              (item.ins_company != "") ?

                this.state.items.push({
                  buyers_id: item.buyers_id,
                  buyers_first_name: item.buyers_first_name,
                  buyers_mid_name: item.buyers_mid_name,
                  buyers_last_name: item.buyers_last_name,
                  ins_pol_num: item.ins_pol_num,
                  ins_company: item.ins_company,
                  ins_agent: item.ins_agent
                })

                : null
            })

            this.setState({
              itemsMirror: this.state.items
            })
          }
        } else {
          if (Platform.OS === 'android') {
            ToastAndroid.show(data.message, ToastAndroid.SHORT);
          } else {
            alert(data.message);
          }
        }

      })
      .catch((error) => console.error(error))
      .finally(() => this.setState({ isLoading: false }));
  }

  SearchFilterFunction(text) {
    //passing the inserted text in textinput

    const newData = this.state.itemsMirror.filter(function (item) {
      //applying filter for the inserted text in search bar

      const textName = text.toUpperCase();
      const itemFirst_name = item.buyers_first_name ? item.buyers_first_name.toUpperCase() : ''.toUpperCase();
      const itemMid_name = item.buyers_mid_name ? item.buyers_mid_name.toUpperCase() : ''.toUpperCase();
      const itemLast_name = item.buyers_last_name ? item.buyers_last_name.toUpperCase() : ''.toUpperCase();
      const itemPol_num = item.ins_pol_num ? item.ins_pol_num.toUpperCase() : ''.toUpperCase();
      const itemAgent = item.ins_agent ? item.ins_agent.toUpperCase() : ''.toUpperCase();
      const itemCompany = item.ins_company ? item.ins_company.toUpperCase() : ''.toUpperCase();
      const itemFullname = itemFirst_name + ' ' + itemMid_name + ' ' + itemLast_name;

      return itemFullname.indexOf(textName) > -1 || itemFirst_name.indexOf(textName) > -1 || itemMid_name.indexOf(textName) > -1 || itemLast_name.indexOf(textName) > -1 || itemPol_num.indexOf(textName) > -1 || itemAgent.indexOf(textName) > -1 || itemCompany.indexOf(textName) > -1;
    });

    this.setState({
      //setting the filtered newData on datasource
      //After setting the data it will automatically re-render the view
      items: newData,
      searchText: text,
    });
  }

  //Screen1 Component
  render() {


    return (
      <View style={styles.container}>
        {/* <NavigationDrawer /> */}

        {this.state.isLoading ?
          <View style={AppStyles.loader}>
            <ActivityIndicator size='large' color={AppStyles.colorOrange.color} />
          </View>
          :
          <View></View>}

        {/* menu header start */}
        <TouchableOpacity style={AppStyles.navigationButton} onPress={this.props.navigation.openDrawer}>
          {/*Donute Button Image */}
          <Image
            source={require('../../assets/menu/menu.png')}
            style={{ width: 30, height: 18, margin: 10, }}
          />
        </TouchableOpacity>
        {/* menu header end */}

        <Text style={AppStyles.header_title_screen}>Insurance</Text>

        <View style={AppStyles.search_view}>
          <TextInput
            onChangeText={text => this.SearchFilterFunction(text)}
            value={this.state.searchText}
            placeholder="Search..."
            style={AppStyles.search_text} />
          <Image
            source={require('../../assets/images/search.png')}
            style={AppStyles.search__icon}
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ flexDirection: "column", paddingBottom: 100 }}>

            {/* one card */}
            {this.state.items.map((item, key) => (
              <View style={styles.mainCard} key={key}>

                <View style={{ flexDirection: "row", flex: 1 }}>

                  <View style={{ flexDirection: "row", flex: 1 }}>

                    <View style={{
                      flexDirection: "column", flex: 1,
                      alignItems: "flex-start",
                      alignSelf: "center",
                      marginHorizontal: 10
                    }}>
                      <Text style={styles.text}>Buyer Name</Text>
                      <Text style={styles.text1} numberOfLines={1}>{item.buyers_first_name} {item.buyers_mid_name} {item.buyers_last_name}</Text>
                      <View style={{ flexDirection: "row" }}>
                        <Text style={styles.text} numberOfLines={1}>Policy Number : </Text>
                        <Text style={styles.text2} numberOfLines={1}>{item.ins_pol_num}</Text>
                      </View>
                      <View style={{ flexDirection: "row" }}>
                        <Text style={styles.text}>Agent Name : </Text>
                        <Text style={styles.text2}>{item.ins_agent}</Text>
                      </View>
                    </View>

                    <View style={{
                      flexDirection: "column", flex: 1,
                      // alignSelf: "center",
                      alignItems: "flex-end",
                      marginHorizontal: 10,
                      marginTop: 15
                    }}>
                      <Text style={styles.text}>Insurance Company</Text>
                      <Text style={styles.text1} numberOfLines={1}>{item.ins_company}</Text>
                    </View>
                  </View>

                  <View style={{
                    flexDirection: "column",
                    backgroundColor: AppStyles.colorOrange.color,
                    paddingTop: 5,
                    paddingBottom: 5,
                    flex: 0,
                    borderTopRightRadius: 15,
                    borderBottomRightRadius: 15,
                  }}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("EditInsuranceInfoScreen", { buyers_id: item.buyers_id })}>
                      <Image source={require('../../assets/images/edit_blue.png')} style={styles.cardicon} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.props.navigation.navigate("ViewInsuranceInfoScreen", { buyers_id: item.buyers_id })}>
                      <Image source={require('../../assets/images/view_blue.png')} style={styles.cardicon} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.toggleModalDelete.bind(this, item.buyers_id)}>
                      <Image source={require('../../assets/images/delete_blue.png')} style={styles.cardicon} />
                    </TouchableOpacity>

                  </View>
                </View>

              </View>
            ))}

          </View>

        </ScrollView>

        {/* big orange button */}
        <TouchableOpacity style={AppStyles.buttonCard} activeOpacity={0.8} onPress={() => this.props.navigation.navigate("AddInsuranceInfoScreen")}>
          <Text style={AppStyles.buttonCardText}>Add Insurance</Text>
          <Image
            source={require('../../assets/home/buttonarrow.png')}
            style={{ width: 45, height: 45, marginLeft: 10 }}
          />
        </TouchableOpacity>

        <Modal closeOnClick={true}
          animationType="fade"
          transparent={true}
          visible={this.state.isModalDeleteVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <TouchableWithoutFeedback onPress={this.toggleModalDelete.bind(this)}>
            <View style={styles.centeredView}>
              <TouchableHighlight style={styles.modalView}>
                <View>
                  <Image
                    source={require('../../assets/images/close.png')}
                    style={{ width: 45, height: 45, position: 'absolute', alignSelf: 'center', top: -42 }}
                  />
                  <Text style={{ ...styles.modalText, marginBottom: 0, marginTop: 10 }}>Are you sure?</Text>

                  <Text style={{
                    fontSize: 14,
                    color: AppStyles.colorGrey.color,
                    textAlign: 'center',
                    fontFamily: 'poppinsRegular',
                    marginBottom: 10
                  }}>Remove Insurance!</Text>


                  <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                      style={{ ...styles.openButton, borderRadius: 50, backgroundColor: "white", borderWidth: 1, borderColor: AppStyles.colorBlue.color, flex: 1, marginRight: 5 }}
                      activeOpacity={.5}
                      onPress={() => this.deleteInsuranceFromList()}
                    >
                      <Text style={{
                        color: AppStyles.colorBlue.color,
                        textAlign: "center",
                        fontFamily: 'poppinsMedium',
                        fontSize: 14,
                      }}>Yes, Remove it!</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{ ...styles.openButton, borderRadius: 50, backgroundColor: AppStyles.colorBlue.color, borderWidth: 1, borderColor: AppStyles.colorBlue.color, flex: 1, marginLeft: 5 }}
                      activeOpacity={.5}
                      onPress={() => {
                        this.setState({
                          isModalDeleteVisible: !this.state.isModalDeleteVisible,
                        });
                      }}
                    >
                      <Text style={{
                        color: AppStyles.colorWhite.color,
                        textAlign: "center",
                        fontFamily: 'poppinsMedium',
                        fontSize: 14
                      }}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableHighlight>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

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
  text: {
    fontSize: 12,
    textAlign: 'left',
    color: AppStyles.colorGreyDark.color,
    fontFamily: 'poppinsRegular',
  },

  text1: {
    fontSize: 18,
    textAlign: 'left',
    color: AppStyles.colorBlue.color,
    fontFamily: 'poppinsMedium',
    marginTop: -5,
  },

  text2: {
    fontSize: 12,
    textAlign: 'left',
    color: AppStyles.colorBlue.color,
    fontFamily: 'poppinsMedium'
  },

  mainCard: {
    // height: 100,
    // width: Dimensions.get('window').width / 2.25,
    // alignItems: "center",
    // justifyContent: "center",
    // position: "absolute", //Here is the trick
    // bottom: 0,
    // alignSelf: "center",
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    marginBottom: 10,
    // paddingHorizontal: 15,
    // paddingTop: 15,
    // paddingBottom: 5,
    backgroundColor: '#fff',
    // borderColor: '#fff',
    // borderWidth: 1,
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
  cardicon: {
    width: 25,
    height: 25,
    marginHorizontal: 5,
    marginVertical: 5,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // paddingTop: 22,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },

  modalView: {
    width: '95%',
    margin: 10,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    // alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },

  openButton: {
    backgroundColor: '#fd7801',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginTop: 10
  },

  textStyle: {
    color: "white",
    textAlign: "center",
    fontFamily: 'poppinsMedium',
    fontSize: 18,
  },

  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontFamily: 'poppinsMedium',
    fontSize: 18,
  },
});  