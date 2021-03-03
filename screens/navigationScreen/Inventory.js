import React from 'react';
import { Ionicons, Entypo, FontAwesome } from '@expo/vector-icons';
import { StyleSheet, View, Text, Button, TextInput, Image, TouchableOpacity, ActivityIndicator, Modal, ToastAndroid, TouchableWithoutFeedback, TouchableHighlight, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AppStyles from '../../utility/Styles'
import Styles from '../../utility/Styles';
import { getUserData, storeUserData } from "../../screens/auth";
import { API_URL, commafy } from '../../utility/Constants';

export default class Inventory extends React.Component {

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
    isModalVisible: false,
    isModalDeleteVisible: false,
    items: [],
    itemsMirror: [],
    vinText: '',
    errorVINModel: false,
    searchText: '',
    inv_id_for_delete: ''
  }

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  toggleModalDelete(inv_id) {
    // console.log("inv_id " + inv_id)
    this.setState({ isModalDeleteVisible: !this.state.isModalDeleteVisible, inv_id_for_delete: inv_id });
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
          this.getInventoryList();
        }

      })
      .catch((error) => console.error(error))
      .finally(() => this.setState({ isLoading: false }));

    // this.props.navigation.navigate('StartDealScreen',{ transact_id:'', modelType: '' })
  }

  deleteInventoryFromList() {
    this.setState({ isModalDeleteVisible: !this.state.isModalDeleteVisible });
    if (this.state.items.some(e => e.inv_id === this.state.inv_id_for_delete)) {
      var array = this.state.items;
      var index = array.findIndex(x => x.inv_id === this.state.inv_id_for_delete)
      //remove data from live database
      // console.log(array[index].id)
      this.deleteInventory(this.state.inv_id_for_delete)
      //remove data from local
      if (index > -1) array.splice(index, 1);
    }
  }

  async deleteInventory(inv_id) {

    this.setState({ isLoading: true });

    var data = {
      "inv_id": inv_id
    }

    fetch(API_URL + "deleteinventory", {
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

  async getInventoryList() {

    this.setState({ isLoading: true });
    this.setState({
      items: []
    })
    var data = {
      "member_id": this.state.userid
    }
    fetch(API_URL + "inventorylist", {
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
            data.data.map((item, key) => (
              this.state.items.push({
                inv_id: item.inv_id,
                inv_vin: item.inv_vin,
                inv_stock: item.inv_stock,
                inv_year: item.inv_year,
                inv_make: item.inv_make,
                inv_model: item.inv_model,
                total_cost: item.inv_flrc,
                vehicle_price: item.inv_price
              })
            ))

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

  componentDidMount = async () => {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {

      this.setState({ searchText: '' })

      getUserData()
        .then(res => {
          let data = JSON.parse(res);
          //console.log(data);
          // console.log(data.id);
          this.setState({ userid: data.id });
          // this.getInventoryList();
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

  addInventoryInfo() {
    // console.log(this.state.vinText)
    if (this.state.vinText == "") {
      this.setState({ errorVINModel: true });

    } else {
      this.props.navigation.navigate('AddInventoryInfoScreen', { vin: this.state.vinText })
      this.setState({ isModalVisible: !this.state.isModalVisible, vinText: "", errorVINModel: false });
    }
  }

  changeVINtext(text) {
    if (text.trim() != 0) {
      this.setState({ vinText: text, errorVINModel: false });
    } else {
      this.setState({ vinText: text, errorVINModel: true });
    }
    // this.setState({ vinText: text });
  }

  SearchFilterFunction(text) {
    //passing the inserted text in textinput

    const newData = this.state.itemsMirror.filter(function (item) {
      //applying filter for the inserted text in search bar
      const itemData = item.inv_vin ? item.inv_vin.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();

      const itemStock = item.inv_stock ? item.inv_stock.toUpperCase() : ''.toUpperCase();
      const textStock = text.toUpperCase();

      const itemYear = item.inv_year ? item.inv_year.toUpperCase() : ''.toUpperCase();
      const textYear = text.toUpperCase();

      return itemData.indexOf(textData) > -1 || itemStock.indexOf(textStock) > -1 || itemYear.indexOf(textYear) > -1;
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

        <Text style={AppStyles.header_title_screen}>Inventory</Text>

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
                      flexDirection: "column", flex: 2,
                      alignItems: "flex-start",
                      alignSelf: "center",
                      marginHorizontal: 10,
                      marginVertical: 10
                    }}>
                      <View style={{ flexDirection: "row", flex: 1 }}>
                        <View style={{ flex: 1, flexDirection: "column" }}>
                          <Text style={styles.text}>Year</Text>
                          <Text numberOfLines={1} style={{ ...styles.text, color: AppStyles.colorBlue.color, fontFamily: 'poppinsMedium' }}>{item.inv_year}</Text>
                        </View>
                        {/* <View style={{ flexDirection: "row", flex: 1 , marginLeft:10}}> */}
                          <View style={{ flex: 1, flexDirection: "column" }}>
                            <Text style={styles.text}>Make</Text>
                            <Text numberOfLines={1} style={{ ...styles.text, color: AppStyles.colorBlue.color, fontFamily: 'poppinsMedium' }}>{item.inv_make}</Text>
                          </View>
                          <View style={{ flex: 1, flexDirection: "column" }}>
                            <Text style={styles.text}>Model</Text>
                            <Text numberOfLines={1} style={{ ...styles.text, color: AppStyles.colorBlue.color, fontFamily: 'poppinsMedium' }}>{item.inv_model}</Text>
                          </View>
                        {/* </View> */}
                      </View>
                      <View style={{
                        flexDirection: "column", flex: 1, marginTop: 10
                      }}>
                        <View style={{ flexDirection: "row" }}>
                          <Text style={styles.text} numberOfLines={1}>Stock Number : </Text>
                          <Text style={{ ...styles.text, color: AppStyles.colorBlue.color, fontFamily: 'poppinsMedium' }}>{item.inv_stock}</Text>
                        </View>
                        <Text style={styles.text}>VIN</Text>
                        <Text style={styles.text1} numberOfLines={1}>{item.inv_vin}</Text>
                      </View>
                    </View>

                    <View style={{
                      flexDirection: "column", flex: 1,
                      alignSelf: "center",
                      alignItems: "flex-end",
                      marginHorizontal: 10,
                    }}>
                      <Text style={styles.text}>Total Cost</Text>
                      <Text style={styles.text1} numberOfLines={1}>${commafy(item.total_cost)}</Text>
                      <Text style={styles.text}>Vehicle Price</Text>
                      <Text style={styles.text1} numberOfLines={1}>${commafy(item.vehicle_price)}</Text>
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
                    justifyContent:'center'
                  }}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("EditInventoryInfoScreen", { inv_id: item.inv_id })}>
                      <Image source={require('../../assets/images/edit_blue.png')} style={styles.cardicon} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.props.navigation.navigate("ViewInventoryInfoScreen", { inv_id: item.inv_id })}>
                      <Image source={require('../../assets/images/view_blue.png')} style={styles.cardicon} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.toggleModalDelete.bind(this, item.inv_id)}>
                      <Image source={require('../../assets/images/delete_blue.png')} style={styles.cardicon} />
                    </TouchableOpacity>

                  </View>
                </View>

              </View>
            ))}
          </View>

        </ScrollView>

        {/* big orange button */}
        <TouchableOpacity style={AppStyles.buttonCard} activeOpacity={0.8} onPress={this.toggleModal} >
          <Text style={AppStyles.buttonCardText}>Add Inventory</Text>
          <Image
            source={require('../../assets/home/buttonarrow.png')}
            style={{ width: 45, height: 45, marginLeft: 10 }}
          />
        </TouchableOpacity>

        <Modal closeOnClick={true}
          animationType="fade"
          transparent={true}
          visible={this.state.isModalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <TouchableWithoutFeedback onPress={this.toggleModal}>
            <View style={styles.centeredView}>
              <TouchableHighlight style={styles.modalView}>
                <View>
                  <Text style={styles.modalText}>Add Inventory Info</Text>

                  <Text style={{
                    fontSize: 16,
                    color: AppStyles.colorGrey.color,
                    textAlign: 'left',
                    fontFamily: 'poppinsRegular',
                    marginTop: 10
                  }}>Enter VIN Here</Text>
                  <View style={{ flexDirection: "row" }}>
                    <TextInput
                      style={{ ...styles.textInput, flex: 1, paddingEnd: 40 }}
                      editable
                      keyboardType="default"
                      onChangeText={(text) => this.changeVINtext(text)}
                    />
                    <TouchableOpacity style={{ position: "absolute", right: 0, bottom: 0 }} onPress={() => {
                      this.props.navigation.navigate("BarcodeScannerScreen", { screen: "AddInventoryInfoScreen" })
                      this.setState({ isModalVisible: !this.state.isModalVisible, vinText: "", errorVINModel: false })
                    }}>
                      {/*Donute Button Image */}
                      <Image
                        style={{ width: 24, height: 24, margin: 10, resizeMode: "cover" }}
                        source={require('../../assets/images/qr-code.png')}
                      />
                    </TouchableOpacity>
                  </View>
                  {this.state.errorVINModel ? (
                    <Text style={AppStyles.errortext}>
                      * Please enter VIN number to proceed.
                    </Text>
                  ) : null}

                  <TouchableOpacity
                    style={styles.openButton}
                    activeOpacity={.5}
                    onPress={() => {
                      this.addInventoryInfo()
                    }}
                  >
                    <Text style={styles.textStyle}>Add Inventory Info</Text>
                  </TouchableOpacity>
                </View>
              </TouchableHighlight>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

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
                  }}>Remove vehicle from inventory!</Text>


                  <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                      style={{ ...styles.openButton, borderRadius: 50, backgroundColor: "white", borderWidth: 1, borderColor: AppStyles.colorBlue.color, flex: 1, marginRight: 5 }}
                      activeOpacity={.5}
                      onPress={() => this.deleteInventoryFromList()}
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

      </View >
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
    marginTop: -5
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
  textInput: {
    fontSize: 18,
    color: AppStyles.colorBlue.color,
    textAlign: 'left',
    fontFamily: 'poppinsRegular',
    // marginHorizontal: 10,
    marginTop: 0,
    paddingBottom: 0,
    borderBottomColor: AppStyles.colorBlue.color, // Add this to specify bottom border color
    borderBottomWidth: 1,
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