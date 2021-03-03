import React from 'react';
import { Ionicons, Entypo, FontAwesome, Octicons } from '@expo/vector-icons';
import { StyleSheet, View, Text, Button, TextInput, Image, TouchableOpacity, Dimensions, Modal, TouchableHighlight, TouchableWithoutFeedback, ActivityIndicator, ToastAndroid, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AppStyles from '../../utility/Styles'
import { getUserData, storeUserData } from "../../screens/auth";
import { API_URL, commafy } from '../../utility/Constants'
import { format } from 'date-fns'
import { th } from 'date-fns/locale';
import DatePicker from 'react-native-datepicker';
// import ActionButton from 'react-native-circular-action-menu'

export default class Reports extends React.Component {
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
    transact_id_for_view: 0,
    isModalCustomSalesVisible: false,
    startDate: format(new Date(), "MM/dd/yyyy"),
    endDate: format(new Date(), "MM/dd/yyyy"),
    total_sold: '$0',
    total_cost: '$0',
    total_profit: '$0',
    no_car_sold: '$0',
    gross_profit: '$0',
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      // The screen is focused
      // Call any action
      this.setState({
        searchText: '',
        isLoading: false,
        isModalDeleteVisible: false,
        transact_id_for_view: 0,
        isModalCustomSalesVisible: false,
        startDate: format(new Date(), "MM/dd/yyyy"),
        endDate: format(new Date(), "MM/dd/yyyy"),
        total_sold: '$0',
        total_cost: '$0',
        total_profit: '$0',
        no_car_sold: '$0',
        gross_profit: '$0',
      })

      getUserData()
        .then(res => {
          let data = JSON.parse(res);
          //console.log(data);
          // console.log(data.id);
          this.setState({ userid: data.id });
          // this.getDealList();
          this.packageexpired()
        })
        .catch(err => alert("An error occurred"));

    });
  }

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }

  toggleModalSalesView(key) {
    this.setState({ isModalDeleteVisible: !this.state.isModalDeleteVisible, transact_id_for_view: key });
  };

  toggleModalCustomSalesView() {
    this.setState({ isModalCustomSalesVisible: !this.state.isModalCustomSalesVisible });
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
          this.getDealList();
        }

      })
      .catch((error) => console.error(error))
      .finally(() => this.setState({ isLoading: false }));

    // this.props.navigation.navigate('StartDealScreen',{ transact_id:'', modelType: '' })
  }

  async getDealList() {

    this.setState({ isLoading: true });
    this.setState({
      items: []
    })
    var data = {
      "member_id": this.state.userid
    }
    fetch(API_URL + "reportlist", {
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
                transact_id: item.transact_id,
                buyers_first_name: item.buyers_first_name,
                buyers_mid_name: item.buyers_mid_name,
                buyers_last_name: item.buyers_last_name,
                inv_stock: item.inv_stock,
                inv_make: item.inv_make,
                inv_model: item.inv_model,
                sale_date: item.sale_date,
                sale_price: item.sale_price,
                inv_flrc: item.inv_flrc
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

  SearchFilterFunction(text) {
    //passing the inserted text in textinput

    const newData = this.state.itemsMirror.filter(function (item) {
      //applying filter for the inserted text in search bar
      var profit = item.sale_price - item.inv_flrc
      const textName = text.toUpperCase();
      const itemFirst_name = item.buyers_first_name ? item.buyers_first_name.toUpperCase() : ''.toUpperCase();
      const itemMid_name = item.buyers_mid_name ? item.buyers_mid_name.toUpperCase() : ''.toUpperCase();
      const itemLast_name = item.buyers_last_name ? item.buyers_last_name.toUpperCase() : ''.toUpperCase();
      const itemProfit = profit + "" ? profit + "".toUpperCase() : ''.toUpperCase();
      const itemInv_flrc = item.inv_flrc ? item.inv_flrc.toUpperCase() : ''.toUpperCase();
      const itemFullname = itemFirst_name + ' ' + itemMid_name + ' ' + itemLast_name;

      return itemFullname.indexOf(textName) > -1 || itemFirst_name.indexOf(textName) > -1 || itemMid_name.indexOf(textName) > -1 || itemLast_name.indexOf(textName) > -1 || itemProfit.indexOf(textName) > -1 || itemInv_flrc.indexOf(textName) > -1;
    });

    this.setState({
      //setting the filtered newData on datasource
      //After setting the data it will automatically re-render the view
      items: newData,
      searchText: text,
    });
  }

  getcustomreport() {
    this.setState({ isLoading: true });

    var data = {
      "member_id": this.state.userid,
      "startdate": this.state.startDate,
      "enddate": this.state.endDate
    }
    // console.log(data)
    fetch(API_URL + "getcustomreport", {
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
            this.setState({
              total_sold: data.data.total_sold,
              total_cost: data.data.total_cost,
              total_profit: data.data.total_profit,
              no_car_sold: data.data.no_car_sold,
              gross_profit: data.data.gross_profit
            })
          }
        } else {
          if (Platform.OS === 'android') {
            ToastAndroid.show(data.message, ToastAndroid.SHORT);
          } else {
            alert(data.message);
          }
          this.setState({
            total_sold: '$0',
            total_cost: '$0',
            total_profit: '$0',
            no_car_sold: '$0',
            gross_profit: '$0',
          })
        }

      })
      .catch((error) => console.error(error))
      .finally(() => this.setState({ isLoading: false }));
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

        <View style={{ flexDirection: 'row', marginTop:75,}}>
          <Text style={{...AppStyles.header_title_screen,marginTop:0,flex:1}}>Reports</Text>

          <TouchableOpacity style={{ flex: 1, flexDirection: 'row'}} onPress={this.toggleModalCustomSalesView.bind(this)}>
            <Octicons style={{ flex: 1, textAlign: 'right' }} name="settings" size={24} color={AppStyles.colorOrange.color} />
            <Text style={{...styles.custom_button, marginTop:0}}>Custom Sales</Text>
          </TouchableOpacity>

        </View>
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
                      marginHorizontal: 10,
                      marginVertical: 10
                    }}>
                      <Text style={styles.text}>Buyer Name</Text>
                      <Text style={styles.text1} numberOfLines={1}>{item.buyers_first_name} {item.buyers_mid_name} {item.buyers_last_name}</Text>
                      <View style={{ flexDirection: "row" }}>
                        <Text style={styles.text} numberOfLines={1}>Sale Date : </Text>
                        <Text style={styles.text2} numberOfLines={1}>{format(new Date(item.sale_date), "d MMM y")}</Text>
                      </View>
                    </View>

                    <View style={{
                      flexDirection: "column", flex: 1,
                      // alignSelf: "center",
                      alignItems: "flex-end",
                      marginHorizontal: 10,
                      marginVertical: 10
                    }}>
                      <Text style={styles.text}>Profit</Text>
                      <Text style={styles.text1} numberOfLines={1}>${commafy(item.sale_price - item.inv_flrc)}</Text>
                    </View>
                  </View>

                  <View style={{
                    flexDirection: "column",
                    backgroundColor: AppStyles.colorOrange.color,
                    // paddingTop: 5,
                    // paddingBottom: 5,
                    justifyContent: "center",
                    flex: 0,
                    borderTopRightRadius: 15,
                    borderBottomRightRadius: 15,
                  }}>

                    <TouchableOpacity onPress={this.toggleModalSalesView.bind(this, key)}>
                      <Image source={require('../../assets/images/view_blue.png')} style={styles.cardicon} />
                    </TouchableOpacity>

                  </View>
                </View>

              </View>
            ))}
          </View>

        </ScrollView>

        <Modal closeOnClick={true}
          animationType="fade"
          transparent={true}
          visible={this.state.isModalDeleteVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <TouchableWithoutFeedback onPress={this.toggleModalSalesView.bind(this, 0)}>
            <View style={styles.centeredView}>

              <View style={styles.modalView}>

                <Image
                  source={require('../../assets/images/close.png')}
                  style={{ width: 45, height: 45, position: 'absolute', alignSelf: 'center', top: -22 }}
                />

                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.modalTextLeft}>Stock No.</Text>
                  <Text style={styles.modalTextRight}>{this.state.items.length > 0 ? this.state.items[this.state.transact_id_for_view].inv_stock : 'NA'}</Text>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.modalTextLeft}>Buyer Name</Text>
                  <Text style={styles.modalTextRight}>{
                    this.state.items.length > 0 ?
                      this.state.items[this.state.transact_id_for_view].buyers_first_name + " " + this.state.items[this.state.transact_id_for_view].buyers_mid_name + " " + this.state.items[this.state.transact_id_for_view].buyers_last_name
                      : 'NA'}</Text>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.modalTextLeft}>Make & Model</Text>
                  <Text style={styles.modalTextRight}>{this.state.items.length > 0 ? this.state.items[this.state.transact_id_for_view].inv_make + " " + this.state.items[this.state.transact_id_for_view].inv_model : 'NA'}</Text>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.modalTextLeft}>Sale Date</Text>
                  <Text style={styles.modalTextRight}>{this.state.items.length > 0 ? format(new Date(this.state.items[this.state.transact_id_for_view].sale_date), "d MMM y") : 'NA'}</Text>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.modalTextLeft}>Sale Price</Text>
                  <Text style={styles.modalTextRight}>{this.state.items.length > 0 ? this.state.items[this.state.transact_id_for_view].sale_price : 'NA'}</Text>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.modalTextLeft}>Total Cost</Text>
                  <Text style={styles.modalTextRight}>{this.state.items.length > 0 ? this.state.items[this.state.transact_id_for_view].inv_flrc : 'NA'}</Text>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.modalTextLeft}>Profit</Text>
                  <Text style={styles.modalTextRight}>{this.state.items.length > 0 ? this.state.items[this.state.transact_id_for_view].sale_price - this.state.items[this.state.transact_id_for_view].inv_flrc : 'NA'}</Text>
                </View>

              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <Modal closeOnClick={true}
          animationType="fade"
          transparent={true}
          visible={this.state.isModalCustomSalesVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <TouchableWithoutFeedback onPress={this.toggleModalCustomSalesView.bind(this, 0)}>

            <View style={styles.centeredView}>

              <TouchableHighlight style={styles.modalView}>

                {/* <Image
                  source={require('../../assets/images/close.png')}
                  style={{ width: 45, height: 45, position: 'absolute', alignSelf: 'center', top: -22 }}
                /> */}

                <View style={{ marginBottom: 10, paddingBottom: 20, }}>
                  {this.state.isLoading ?
                    <View style={AppStyles.loader}>
                      <ActivityIndicator size='large' color={AppStyles.colorOrange.color} />
                    </View>
                    :
                    <View></View>}
                  <TouchableOpacity style={{ position: 'absolute', alignSelf: 'center', top: -42 }} onPress={() => this.toggleModalCustomSalesView()}>
                    <Image
                      source={require('../../assets/images/close.png')}
                      style={{ width: 45, height: 45, alignSelf: 'center' }}
                    />
                  </TouchableOpacity>
                  <Text style={{ ...styles.modalText, marginBottom: 0, marginTop: 10 }}>Your Sales Report</Text>

                  <Text style={styles.modalText1}>Choose Start Date</Text>
                  <DatePicker
                    style={{ alignItems: 'flex-start', width: Dimensions.get("window").width / 1.06 }}
                    date={this.state.startDate} //initial date from state
                    mode="date" //The enum of date, datetime and time
                    // placeholder="dob"
                    format="MM/DD/YYYY"
                    minDate="01/01/2000"
                    maxDate={format(new Date(), "MM/dd/yyyy")}
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                      dateIcon: { display: 'none', },
                      dateInput: AppStyles.dateInput,
                      dateText: AppStyles.dateText,
                    }}
                    onDateChange={(date) => { this.setState({ startDate: date }); }}
                  />
                  <View style={{ backgroundColor: AppStyles.colorBlue.color, height: 1 }}></View>

                  <Text style={styles.modalText1}>Choose End Date</Text>
                  <DatePicker
                    style={{ alignItems: 'flex-start', width: Dimensions.get("window").width / 1.06 }}
                    date={this.state.endDate} //initial date from state
                    mode="date" //The enum of date, datetime and time
                    // placeholder="dob"
                    format="MM/DD/YYYY"
                    minDate="01/01/2000"
                    maxDate={format(new Date(), "MM/dd/yyyy")}
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                      dateIcon: { display: 'none', },
                      dateInput: AppStyles.dateInput,
                      dateText: AppStyles.dateText,
                    }}
                    onDateChange={(date) => { this.setState({ endDate: date }); }}
                  />
                  <View style={{ backgroundColor: AppStyles.colorBlue.color, height: 1 }}></View>
                  <TouchableOpacity
                    style={styles.openButton}
                    activeOpacity={.5}
                    onPress={() => this.getcustomreport()}
                  >
                    <Text style={styles.textStyle}>Use These Dates</Text>
                  </TouchableOpacity>

                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.modalTextLeft}>Sales Report</Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={{
                       flex: 1,
                       fontSize: 16,
                       color: AppStyles.colorBlue.color,
                       textAlign: 'left',
                       fontFamily: 'poppinsMedium',
                    }}>{this.state.total_sold != '' ?  this.state.startDate + ' to ' + this.state.endDate : 'NA'}</Text>
                  </View>

                  <View style={{ backgroundColor: AppStyles.colorGreyLight.color, height: 1 }}></View>

                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.modalTextLeft}>Total Sold</Text>
                    <Text style={styles.modalTextRight}>{this.state.total_sold}</Text>
                  </View>
                  <View style={{ backgroundColor: AppStyles.colorGreyLight.color, height: 1 }}></View>

                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.modalTextLeft}>Total Cost</Text>
                    <Text style={styles.modalTextRight}>{this.state.total_cost}</Text>
                  </View>
                  <View style={{ backgroundColor: AppStyles.colorGreyLight.color, height: 1 }}></View>

                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.modalTextLeft}>Total Profit</Text>
                    <Text style={styles.modalTextRight}>{this.state.total_profit}</Text>
                  </View>
                  <View style={{ backgroundColor: AppStyles.colorGreyLight.color, height: 1 }}></View>

                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.modalTextLeft}>Number Of Cars Sold</Text>
                    <Text style={styles.modalTextRight}>{this.state.no_car_sold}</Text>
                  </View>
                  <View style={{ backgroundColor: AppStyles.colorGreyLight.color, height: 1 }}></View>

                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.modalTextLeft}>Average Gross Profit	</Text>
                    <Text style={styles.modalTextRight}>{this.state.gross_profit}</Text>
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

  text2: {
    fontSize: 12,
    textAlign: 'left',
    color: AppStyles.colorBlue.color,
    fontFamily: 'poppinsMedium'
  },

  mainCard: {
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    marginBottom: 10,
    backgroundColor: '#fff',
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

  modalTextLeft: {
    flex: 1,
    fontSize: 14,
    color: AppStyles.colorGrey.color,
    textAlign: 'left',
    fontFamily: 'poppinsMedium',
    marginTop: 10
  },

  modalTextRight: {
    flex: 1,
    fontSize: 16,
    color: AppStyles.colorBlue.color,
    textAlign: 'right',
    fontFamily: 'poppinsMedium',
    marginTop: 10
  },

  custom_button: {
    // flex: 1,
    fontSize: 16,
    textAlign: 'right',
    marginRight: 10,
    marginLeft: 5,
    marginTop: 75,
    color: AppStyles.colorOrange.color,
    fontFamily: 'poppinsMedium',
  },

  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontFamily: 'poppinsMedium',
    fontSize: 18,
  },
  modalText1: {
    fontSize: 16,
    color: AppStyles.colorGrey.color,
    textAlign: 'left',
    fontFamily: 'poppinsRegular',
    marginTop: 10
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
});  