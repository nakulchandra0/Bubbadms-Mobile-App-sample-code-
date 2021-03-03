import React, { Component } from 'react';
import { Ionicons, Entypo, FontAwesome } from '@expo/vector-icons';
import { StyleSheet, View, Text, Button, ImageBackground, Image, TouchableOpacity, Dimensions, ActivityIndicator, ToastAndroid, Platform, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AppStyles from '../../utility/Styles'
import { getUserData, storeUserData } from "../../screens/auth";
import Carousel from 'react-native-anchor-carousel';
import { API_URL, commafy, PAYPAL_URL_LIVE, PAYPAL_AUTH_LIVE, PAYPAL_URL_LIVE_PAYMENT } from '../../utility/Constants';
import axios from 'axios'
import qs from 'qs'
import { WebView } from 'react-native-webview';
import * as Device from 'expo-device';
import { format } from 'date-fns'

const { width, height } = Dimensions.get('window');

const datas = [
  {
    title: 'Field Testing',
    price: '0.00',
    content: 'Free 60 Day Trial\nField Testing\nCan Access All Functionality\nGives Us Yoru Feedback',
    content2: '60 Day Free Trial'
  }, {
    title: 'Primium',
    price: '10.00',
    content: 'Free 60 Day Trial\nField Testing\nCan Access All Functionality\nGives Us Yoru Feedback\nGives Us Yoru Feedback\nGives Us Yoru Feedback\nGives Us Yoru Feedback\nGives Us Yoru Feedback\nGives Us Yoru Feedback\nGives Us Yoru Feedback\nGives Us Yoru Feedback\nGives Us Yoru Feedback\nGives Us Yoru Feedback\nGives Us Yoru Feedback',
    content2: '260 Day Free'
  }, {
    title: 'Gold',
    price: '20.00',
    content: 'Free 60 Day Trial\nField Testing\nCan Access All Functionality\nGives Us Yoru Feedback',
    content2: '1 Year Free'
  }, {
    title: 'Advance',
    price: '50.00',
    content: 'Free 60 Day Trial\nField Testing\nCan Access All Functionality\nGives Us Yoru Feedback',
    content2: 'Unlimited'
  }
];

export default class Ourplan extends React.Component {
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
    items: [],
    planid: "",
    plantitle: "",

    myplantitle: "",
    myplanexpdate: new Date(),

    accessToken: null,
    approvalUrl: null,
    paymentId: null,
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      // The screen is focused
      // Call any action
      this.setState({ userid: '' })

      getUserData()
        .then(res => {
          let data = JSON.parse(res);
          this.setState({ userid: data.id });
          this.getPackageList();
          // console.log(datas);
          // console.log(this.state.items);

        })
        .catch(err => alert("An error occurred"));

    });
  }

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }

  async getPackageList() {

    this.setState({ isLoading: true });
    this.setState({
      items: []
    })
    var data = {
      "member_id": this.state.userid,
      "tokenid": "d864990fcc21b190b7e7beb82409471ce5b8a9fe"
    }
    fetch(API_URL + "getpackagedataforuser", {
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

          this.setState({
            myplantitle: data.myplantitle,
            myplanexpdate: data.myplanexpdate,
          })
          data.data.map((item, key) => (
            this.state.items.push({
              id: item.id,
              title: item.group_title,
              price: item.subscription_fee,
              content: item.subscription_info.join("\n"),
              content2: item.subscription_days
            })
          ))

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

  doPaypalPayment(planprice) {
    // console.log(planprice)
    // let currency = '100 USD'
    // currency.replace(" USD", "")
    this.setState({ isLoading: true });
    var dataDetail = {
      "intent": "sale",
      "payer": {
        "payment_method": "paypal"
      },
      "transactions": [{
        "amount": {
          "total": planprice,
          "currency": "USD",
          "details": {
            "subtotal": planprice,
            "tax": "0",
            "shipping": "0",
            "handling_fee": "0",
            "shipping_discount": "0",
            "insurance": "0"
          }
        }

      }],
      "redirect_urls": {
        "return_url": "https://example.com",
        "cancel_url": "https://example.com"
      }
    }

    axios.post(PAYPAL_URL_LIVE, qs.stringify({ grant_type: 'client_credentials' }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': PAYPAL_AUTH_LIVE // Your authorization value
        }
      }
    )
      .then(response => {
        this.setState({
          accessToken: response.data.access_token
        })

        axios.post(PAYPAL_URL_LIVE_PAYMENT, JSON.stringify(dataDetail),
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.state.accessToken}`
            }
          }
        )
          .then(response => {

            const { id, links } = response.data
            const approvalUrl = links.find(data => data.rel == "approval_url")

            this.setState({
              paymentId: id,
              approvalUrl: approvalUrl.href,
              isLoading: false
            })
          }).catch(err => {
            console.log({ ...err })
            this.setState({ isLoading: false });
          })
      }).catch(err => {
        console.log({ ...err })
        this.setState({ isLoading: false });
      })

  }



  _onNavigationStateChange = (webViewState) => {

    if (webViewState.url.includes('https://example.com/')) {

      this.setState({
        approvalUrl: null
      })
      // console.log("url: " + webViewState.url)
      // const { PayerID, paymentId } = webViewState.url
      var regex = /[?&]([^=#]+)=([^&#]*)/g, params = {}, match;
      while (match = regex.exec(webViewState.url)) {
        params[match[1]] = match[2];
      }

      axios.post(`${PAYPAL_URL_LIVE_PAYMENT}/${params['paymentId']}/execute`, JSON.stringify({ payer_id: params['PayerID'] }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.state.accessToken}`
          }
        }
      )
        .then(response => {
          // console.log(response)

          var state = response.data.state;
          var transactionId = response.data.transactions[0].related_resources[0].sale.id
          var payer_id = response.data.payer.payer_info.payer_id
          var payer_email = response.data.payer.payer_info.email
          // console.log("state " + state)
          // console.log("transactions " + transactionId)
          // console.log("payer_id " + payer_id)
          // console.log("payer_email " + payer_email)

          if (state == "approved")
            this.paypal_success(transactionId, payer_id, payer_email, JSON.stringify(response))
          else {

            if (Platform.OS === 'android') {
              ToastAndroid.show("transaction failed! try again.", ToastAndroid.SHORT);
            } else {
              alert("transaction failed! try again.");
            }
          }

        }).catch(err => {
          console.log({ ...err })
        })

    }
  }

  paypal_success(transactionId, payer_id, payer_email, detail) {

    var data = {
      "member_id": this.state.userid,
      "transactionId": transactionId,
      "plan_id": this.state.planid,
      "payer_id": payer_id,
      "payer_email": payer_email,
      "detail": detail
    }

    this.setState({ isLoading: true });

    fetch(API_URL + "dopaymentconfirmation", {
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
          if (data.data == "pay_per_deal") {
            this.props.navigation.navigate('StartDealScreen')
          } else {
            this.props.navigation.navigate('HomeScreen')
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

  onPaymentClick(planid, plantitle, planprice) {
    this.setState({ planid, plantitle });
    // this.doPaypalPayment(planprice)
    if (planprice == 0.00 || planprice == 0) {

      this.setState({ isLoading: true });
      this.setState({
        items: []
      })
      var data = {
        "member_id": this.state.userid,
        "plan_id": planid
      }
      fetch(API_URL + "checkfreeaccount", {
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
            this.paypal_success("NA", "NA", "NA", "NA")
          }

        })
        .catch((error) => console.error(error))
        .finally(() => this.setState({ isLoading: false }));
    } else {
      this.doPaypalPayment(planprice)

    }
  }

  toggleDrawer = () => {
    //Props to open/close the drawer
    this.props.navigation.toggleDrawer();
  };

  cancel_payment() {
    Alert.alert("Hold on!", "Are you sure you want to cancel payment?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel"
      },
      { text: "YES", onPress: () => this.setState({ approvalUrl: null }) }
    ]);
  }

  //Screen1 Component
  render() {
    const { approvalUrl } = this.state

    return (
      <View style={styles.container}>

        {
          approvalUrl ?
            <View style={{ flex: 1, position: 'relative' }}>

              <WebView
                style={{ height: 400, width: 300 }}
                source={{ uri: approvalUrl }}
                onNavigationStateChange={this._onNavigationStateChange}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={false}
                style={{ marginTop: 20 }}
              />
              {/* menu header start */}
              <TouchableOpacity style={{
                width: 68,
                height: 55,
                position: 'absolute',
                opacity: 1,
                marginTop: 35,
              }} onPress={() => this.cancel_payment()}>
                {/*Donute Button Image */}
                <Image
                  style={{ width: 24, height: 20, margin: 10, resizeMode: "cover" }}
                  source={require('../../assets/images/arrow_left_black.png')}
                />
              </TouchableOpacity>
              {/* menu header end */}
            </View>
            :
            <View style={{ flex: 1 }}>
              {/* menu header start */}
              <TouchableOpacity style={AppStyles.navigationButton} onPress={this.props.navigation.openDrawer}>
                {/*Donute Button Image */}
                <Image
                  source={require('../../assets/menu/menu.png')}
                  style={{ width: 30, height: 18, margin: 10, }}
                />
              </TouchableOpacity>
              {/* menu header end */}

              <Text style={AppStyles.header_title_screen}>Our Plan</Text>

              <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
                <View style={{ position: 'absolute', top: 10, left: 10, right: 10 }}>
                  {this.state.myplantitle == "" ? <View></View> :
                    this.state.myplantitle == "Pay Per Deal" ?
                      <Text numberOfLines={2} style={styles.text}>Your current plan is "Pay Per Deal".</Text>
                      :
                      <Text numberOfLines={2} style={styles.text}>Your current plan is "{this.state.myplantitle}" and valid till {format(new Date(this.state.myplanexpdate + ""), "d MMM y")}.</Text>
                  }
                  <Text numberOfLines={1} style={styles.text}>Choose a package to upgrade your plan</Text>
                </View>
                <View style={styles.carouselContainer}>
                  <ImageCarousel packageData={this.state.items} propsdata={this} />
                </View>
              </View>
            </View>
        }


        {this.state.isLoading ?
          <View style={AppStyles.loader}>
            <ActivityIndicator size='large' color={AppStyles.colorOrange.color} />
          </View>
          : <View></View>}

      </View>
    );
  }
}

class ImageCarousel extends Component {
  renderItem = ({ item, index }) => {
    const propsdata = this.props.propsdata;
    const { id, title, price, content, content2 } = item;
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.item}
        onPress={() => {
          this.numberCarousel.scrollToIndex(index);
        }}
      >

        <Text style={{
          fontSize: 20,
          fontFamily: 'poppinsBold',
          textAlign: 'center',
        }}>{title}</Text>

        <Text style={{
          fontSize: 30,
          fontFamily: 'poppinsBold',
          textAlign: 'center',
          color: AppStyles.colorOrange.color,
        }}>${price}</Text>

        <Text style={{
          fontSize: 14,
          fontFamily: 'poppinsMedium',
          textAlign: 'center',
          marginHorizontal: 10
        }}>{content}</Text>

        {title == "Pay Per Deal" ?
          <Text style={{
            fontSize: 22,
            fontFamily: 'poppinsBold',
            textAlign: 'center',
          }}>Per Sale</Text>
          :
          <Text style={{
            fontSize: 22,
            fontFamily: 'poppinsBold',
            textAlign: 'center',
          }}>{content2} Day Free</Text>
        }

        <TouchableOpacity style={{ ...AppStyles.buttonCard, bottom: -50 }} activeOpacity={0.8} onPress={() => propsdata.onPaymentClick(id, title, price)}>
          <Text style={AppStyles.buttonCardText}> Upgrade </Text>
          <Image
            source={require('../../assets/home/buttonarrow.png')}
            style={{ width: 45, height: 45, marginLeft: 10 }}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  // state={
  //   items:[]
  // }

  render() {
    const packageData = this.props.packageData;
    return (
      <Carousel
        style={styles.carousel}
        data={packageData}
        // data={datas}
        renderItem={this.renderItem}
        itemWidth={0.7 * width}
        inActiveOpacity={1}
        containerWidth={width - 10}
        initialIndex={packageData.length > 1 ? 1 : 0}
        ref={(c) => {
          this.numberCarousel = c;
        }}
      />
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

  carouselContainer: {
    width: width,
    // height: height / 1.5,
    height: '78%',
    alignItems: 'center',
    marginBottom: 0,
    // backgroundColor: 'blue',
    // alignContent:'center'
  },

  carousel: {
    flex: 1,
    backgroundColor: AppStyles.backgroundColor.color,
    // backgroundColor: 'red',
    // marginVertical: -40
  },
  item: {
    paddingTop: 20,
    paddingBottom: 40,
    borderWidth: 0,
    backgroundColor: 'white',
    flex: 0,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 5,
    // marginHorizontal:10
  },

  text: {
    fontSize: 14,
    textAlign: 'left',
    color: AppStyles.colorBlack.color,
    fontFamily: 'poppinsRegular'
  },


});  