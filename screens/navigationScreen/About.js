import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, Modal, TouchableOpacity, Dimensions, TouchableWithoutFeedback, TouchableHighlight, Linking } from 'react-native';
import LinkText from '../../utility/LinkText';
import Styles from '../../utility/Styles';
import AppStyles from '../../utility/Styles'

export default class About extends React.Component {

  constructor() {
    super();
    // this.proileImage = require('../../assets/logo_main.png');
    this.proileImage = 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80';

  }

  state = {
    opacity: 1.0,
    isOnPressFire: false,
    isModalAboutVisible: false,

  }

  toggleModalAboutUs() {
    this.setState({ isModalAboutVisible: !this.state.isModalAboutVisible });
  };


  loadInBrowser(url) {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  //Screen1 Component
  render() {

    return (
      <View style={styles.container}>

        {/* menu header start */}
        <TouchableOpacity style={AppStyles.navigationButton} onPress={this.props.navigation.openDrawer}>
          {/*Donute Button Image */}
          <Image
            source={require('../../assets/menu/menu.png')}
            style={{ width: 30, height: 18, margin: 10, }}
          />
        </TouchableOpacity>
        {/* menu header end */}
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', marginVertical: 75 }}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.profileIcon}
          />
          {/* <Text style={{...styles.textlink,marginTop:20}}>Terms of Services</Text> */}
          {/* <LinkText style={styles.textlink}>Privacy Policy</LinkText> */}
          {/* <LinkText data={"About Us"} /> */}
          <Text
            style={{ ...styles.textlink, color: AppStyles.colorOrange.color, opacity: this.state.opacity }}
            suppressHighlighting={true}
            onResponderGrant={() => this.setState({ opacity: 0.5, isOnPressFire: true })}
            onResponderRelease={() => {
              setTimeout(() => {
                this.setState({ opacity: 1.0, isOnPressFire: false });
              }, 350);
            }}
            onResponderTerminate={() => this.setState({ opacity: 1.0, isOnPressFire: false })}
            onPress={() => {
              if (this.state.isOnPressFire) {
                this.toggleModalAboutUs()
              }
              this.setState({ opacity: 1.0, isOnPressFire: false });
            }}
          >
            About Us
            </Text>
          {/* <LinkText data={"Contact Us"} /> */}
          <Text
            style={{ ...styles.textlink, color: AppStyles.colorOrange.color, opacity: this.state.opacity }}
            suppressHighlighting={true}
            onResponderGrant={() => this.setState({ opacity: 0.5, isOnPressFire: true })}
            onResponderRelease={() => {
              setTimeout(() => {
                this.setState({ opacity: 1.0, isOnPressFire: false });
              }, 350);
            }}
            onResponderTerminate={() => this.setState({ opacity: 1.0, isOnPressFire: false })}
            onPress={() => {
              if (this.state.isOnPressFire) {
                this.loadInBrowser('https://bubbadms.com/contact')
              }
              this.setState({ opacity: 1.0, isOnPressFire: false });
            }}
          >
            Contact Us
            </Text>
          <Text
            style={{ ...styles.textlink, color: AppStyles.colorOrange.color, opacity: this.state.opacity }}
            suppressHighlighting={true}
            onResponderGrant={() => this.setState({ opacity: 0.5, isOnPressFire: true })}
            onResponderRelease={() => {
              setTimeout(() => {
                this.setState({ opacity: 1.0, isOnPressFire: false });
              }, 350);
            }}
            onResponderTerminate={() => this.setState({ opacity: 1.0, isOnPressFire: false })}
            onPress={() => {
              if (this.state.isOnPressFire) {
                this.loadInBrowser('https://bubbadms.com/privacy-policy')
              }
              this.setState({ opacity: 1.0, isOnPressFire: false });
            }}
          >
            Privacy Policy
            </Text>
          <Text
            style={{ ...styles.textlink, color: AppStyles.colorOrange.color, opacity: this.state.opacity }}
            suppressHighlighting={true}
            onResponderGrant={() => this.setState({ opacity: 0.5, isOnPressFire: true })}
            onResponderRelease={() => {
              setTimeout(() => {
                this.setState({ opacity: 1.0, isOnPressFire: false });
              }, 350);
            }}
            onResponderTerminate={() => this.setState({ opacity: 1.0, isOnPressFire: false })}
            onPress={() => {
              if (this.state.isOnPressFire) {
                this.loadInBrowser('https://bubbadms.com/terms-conditions')
              }
              this.setState({ opacity: 1.0, isOnPressFire: false });
            }}
          >
            Terms of Services
            </Text>
          <Text style={styles.text}>Version 1.0.4</Text>
        </View>

        <Modal closeOnClick={true}
          animationType="fade"
          transparent={true}
          visible={this.state.isModalAboutVisible}
        >
          <TouchableWithoutFeedback onPress={this.toggleModalAboutUs.bind(this)}>
            <View style={styles.centeredView}>
              <TouchableHighlight style={styles.modalView}>

                <View style={{ marginBottom: 10, paddingBottom: 20, }}>
                  {this.state.isLoading ?
                    <View style={AppStyles.loader}>
                      <ActivityIndicator size='large' color={AppStyles.colorOrange.color} />
                    </View>
                    :
                    <View></View>}
                  <TouchableOpacity style={{ position: 'absolute', alignSelf: 'center', top: -42 }} onPress={() => this.toggleModalAboutUs()}>
                    <Image
                      source={require('../../assets/images/close.png')}
                      style={{ width: 45, height: 45, alignSelf: 'center' }}
                    />
                  </TouchableOpacity>
                  <Text style={{ ...styles.modalText, marginBottom: 0, marginTop: 10 }}>About Us </Text>
                  <Text style={{ ...styles.modalText1, marginBottom: 0, marginTop: 10 }}>{
                    'Since 2010, Thoroughbred Dealer Services has been family-owned and operated. The company measures its success based on the success of its customers. Bubba Dealer Management Software was founded by TDS in 2017 a simple, fast, and affordable way for independent dealers and brokers to document sales and track their inventory with the flexibility to make a sale from anywhere on any device.\nBubba DMS is the future of car sales, the beginning of a new era in the car industry.'
                  }</Text>
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
    backgroundColor: '#fff',
  },
  textMenu: {
    alignSelf: 'center',
    marginBottom: 10,
    marginLeft: 10,
    fontFamily: 'poppinsRegular',
    fontSize: 18,
    color: '#01184e'
  },
  profileIcon: {
    resizeMode: 'contain',
    width: 220,
    height: 220,
    alignSelf: 'center',
    marginVertical: 20
  },
  text: {
    fontSize: 10,
    color: '#000',
    textAlign: 'center',
    fontFamily: 'poppinsRegular',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 15,
    marginBottom: 20,
  },
  textlink: {
    fontSize: 18,
    color: '#ea4b6a',
    textAlign: 'center',
    fontFamily: 'poppinsMedium',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    textDecorationLine: 'underline',
  },
  fabIcon: {
    width: 30,
    height: 30,
    marginVertical: 5,
    marginLeft: 20,
    alignSelf: 'flex-end',
    marginRight: 15,
    // backgroundColor:'red',
    transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }]

    // width: 20,
    // height: 20,
    // marginVertical: 5,
    // marginLeft: 20,
    // alignSelf: 'flex-end',
    // marginRight: 100,

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
}); 