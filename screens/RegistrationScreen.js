import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TextInput, ActivityIndicator, ToastAndroid, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { getUserData, storeUserData } from "../screens/auth";
import AppStyles from '../utility/Styles'
import { API_URL, isPasswordValid, PAYPAL_AUTH, PAYPAL_AUTH_LIVE, PAYPAL_URL_LIVE, PAYPAL_URL_LIVE_PAYMENT, STATE } from '../utility/Constants'
import { Dropdown } from 'react-native-material-dropdown';
// import * as PayPal from 'rn-expo-paypal-integration/paypal';
import axios from 'axios'
// import * as WebBrowser from 'expo-web-browser';
import { WebView } from 'react-native-webview';
// var querystring = require('querystring');
import qs from 'qs'
import { Entypo, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import * as Device from 'expo-device';


export default class RegistrationScreen extends React.Component {

    static navigationOptions = { headerShown: false };

    state = {
        userid: "",
        planid: "",
        insertid: "",
        plantitle: "",
        planprice: "",
        firstname: "", lastname: "", email: "", phone: "", website: "", address: "", city: "", state: "", zip: "", companyname: "", proileImage: "",
        errorfirstname: "", errorlastname: "", erroremail: "", errorphone: "", errorwebsite: "", erroraddress: "", errorcity: "", errorstate: "", errorzip: "", errorcompanyname: "",
        isLoading: false,

        accessToken: null,
        approvalUrl: null,
        paymentId: null,

        hidePassword1: true,
        hidePassword2: true,
        newpass: '', confirmpass: '',
        errornewpass: false, errorconfirmpass: false, errormatchpass_false: false, errormatchpass_true: false
    }

    setPasswordVisibility1 = () => {
        this.setState({ hidePassword1: !this.state.hidePassword1 });
    }
    setPasswordVisibility2 = () => {
        this.setState({ hidePassword2: !this.state.hidePassword2 });
    }

    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('didFocus', () => {
            // The screen is focused
            // Call any action
            getUserData()
                .then(res => {
                    let data = JSON.parse(res);
                    this.setState({ userid: data.id });
                })
                .catch(err => alert("An error occurred"));

            var planid = this.props.navigation.getParam('planid');
            var plantitle = this.props.navigation.getParam('plantitle');
            // console.log("planid " + planid);
            this.setState({ planid, plantitle });
            this.setState({
                planprice: "",
                insertid: "",
                firstname: "", lastname: "", email: "", phone: "", website: "", address: "", city: "", state: "", zip: "", companyname: "", proileImage: "",
                errorfirstname: "", errorlastname: "", erroremail: "", errorphone: "", errorwebsite: "", erroraddress: "", errorcity: "", errorstate: "", errorzip: "", errorcompanyname: "",
                isLoading: false,

                accessToken: null,
                approvalUrl: null,
                paymentId: null,

                hidePassword1: true,
                hidePassword2: true,
                newpass: '', confirmpass: '',
                errornewpass: false, errorconfirmpass: false, errormatchpass_false: false, errormatchpass_true: false
            })
        });
    }

    componentWillUnmount() {
        // Remove the event listener
        this.focusListener.remove();
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
                        this.doRegistraion(transactionId, payer_id, payer_email, JSON.stringify(response))
                    else{
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

    doRegistraion(transactionId, payer_id, payer_email, detail) {

        // console.log("manufacturer " + Device.manufacturer);
        // console.log("modelName " + Device.modelName);
        // console.log("os " + Platform.OS);
        var data = {
            "member_id": this.state.insertid,
            "transactionId": transactionId,
            "plan_id": this.state.planid,
            "payer_id": payer_id,
            "payer_email": payer_email,
            "detail" : detail
        }
        // console.log("doRegistraion");
        // console.log(data);
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
                    this.props.navigation.replace('LoginScreen')
                } else {
                    if (Platform.OS === 'android') {
                        ToastAndroid.show("Something went wrong!", ToastAndroid.SHORT);
                    } else {
                        alert("Something went wrong!");
                    }
                }

            })
            .catch((error) => console.error(error))
            .finally(() => this.setState({ isLoading: false }));

    }


    onChangeText(text, type) {
        if (type == "zip") {
            var regex = new RegExp(/^[0-9-\b]+$/)
            if (text != "" && !regex.test(text)) return false;
            try {
                var count = text.match(/\-/g).length;
                if (count > 1) return false;
            } catch (error) { }
        }

        const re = /^[0-9\b]+$/;
        if (type == "phone") {
            if (text != "" && !re.test(text)) return false;
        }

        if (text.trim() != 0) {
            this.setState({ [type]: text, ['error' + type]: false });
        } else {
            this.setState({ [type]: text, ['error' + type]: true });
        }

        if (this.state.newpass != "" && this.state.confirmpass != "")
            if (this.state.newpass != "")
                if (type == "newpass")
                    if (text == this.state.confirmpass)
                        this.setState({ errormatchpass_false: false, errormatchpass_true: true });
                    else
                        this.setState({ errormatchpass_false: true, errormatchpass_true: false });
                else if (type == "confirmpass")
                    if (this.state.newpass == text)
                        this.setState({ errormatchpass_false: false, errormatchpass_true: true });
                    else
                        this.setState({ errormatchpass_false: true, errormatchpass_true: false });
                else
                    null
            else
                this.setState({ errormatchpass_false: false, errormatchpass_true: false });

    }

    onStatePress(text, type) {
        this.setState({ [type]: text, ['error' + type]: false });
        // this.getModelList(this.makeData[key].id)
    }


    async validateRegistrationData() {

        // var RandomNumber = Math.floor(Math.random() * 1000000000) + 1;

        //this.doPaypalPayment()

        if (this.state.firstname == "") {
            this.setState({ errorfirstname: true, });
            this.firstnameTextInput.focus();
        } else if (this.state.lastname == "") {
            this.lastnameTextInput.focus();
            this.setState({ error_lastname: true, });
        } else if (this.state.email == "") {
            this.setState({ error_email: true, });
            this.emailTextInput.focus();
        } else if (this.state.newpass == "") {
            this.setState({ errornewpass: true, });
        } else if (this.state.confirmpass == "") {
            this.setState({ errorconfirmpass: true, });
        } else if (this.state.newpass != this.state.confirmpass) {
            this.setState({ errormatchpass_false: true, errormatchpass_true: false });
        } else if (!isPasswordValid(this.state.confirmpass)) {
            // ToastAndroid.show("you've entered invalid password! make sure formate is correct", ToastAndroid.SHORT);
            if (Platform.OS === 'android') {
                ToastAndroid.show("Password criteria not match", ToastAndroid.SHORT);
            } else {
                alert("Password criteria not match");
            }
        } else if (this.state.phone == "") {
            this.setState({ error_phone: true, });
            this.phoneTextInput.focus();
        } else if (this.state.website == "") {
            this.setState({ error_website: true, });
            this.websiteTextInput.focus();
        } else if (this.state.address == "") {
            this.setState({ error_address: true, });
            this.addressTextInput.focus();
        } else if (this.state.city == "") {
            this.setState({ error_city: true, });
            this.cityTextInput.focus();
        } else if (this.state.state == "") {
            this.setState({ error_state: true, });
            this.stateTextInput.focus();
        } else if (this.state.zip == "") {
            this.setState({ error_zip: true, });
            this.zipTextInput.focus();
        } else if (this.state.companyname == "") {
            this.setState({ error_companyname: true, });
            this.companynameTextInput.focus();
        } else {
            // ToastAndroid.show("Proceed ahead", ToastAndroid.SHORT);

            var deviceinfo = {
                "os": Platform.OS,
                "manufacturer": Device.manufacturer,
                "modelName": Device.modelName
            }
            var data = {
                "firstname": this.state.firstname,
                "lastname": this.state.lastname,
                "email": this.state.email,
                "password": this.state.newpass,
                "phone": this.state.phone,
                "website": this.state.website,
                "address": this.state.address,
                "city": this.state.city,
                "state": this.state.state,
                "zip": this.state.zip,
                "company_name": this.state.companyname,
                "device_info": JSON.stringify(deviceinfo)
            }

            this.setState({ isLoading: true });

            fetch(API_URL + "doregistration", {
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
                        this.setState({ insertid: data.data })

                        this.setState({ isLoading: true });
                        fetch(API_URL + "getpackagedata", {
                            method: "POST",
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ "tokenid": 'd864990fcc21b190b7e7beb82409471ce5b8a9fe', "planid": this.state.planid })
                        })
                            .then((response) => {
                                return response.json();
                            })
                            .then((data) => {
                                // console.log(data);
                                if (data.status == "true") {
                                    var planprice = data.data.subscription_fee
                                    var plantitle = data.data.group_title
                                    this.setState({ planprice })
                                    if (planprice == "0.00" || planprice == "0" || plantitle == "Pay Per Deal")
                                        this.doRegistraion("NA", "NA", "NA", "NA")
                                    else
                                        this.doPaypalPayment(data.data.subscription_fee)
                                } else {
                                    if (Platform.OS === 'android') {
                                        ToastAndroid.show("Something went wrong! "+ data.message , ToastAndroid.SHORT);
                                    } else {
                                        alert("Something went wrong! "+ data.message);
                                    }
                                }

                            })
                            .catch((error) => console.error(error))
                            .finally(() => this.setState({ isLoading: false }));

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

            // this.doPaypalPayment()

        }
    }

    render() {
        const { approvalUrl } = this.state
        return (
            <View style={styles.container}>

                {this.state.isLoading ?
                    <View style={AppStyles.loader}>
                        <ActivityIndicator size='large' color={AppStyles.colorOrange.color} />
                    </View>
                    :
                    <View></View>}

                {
                    approvalUrl ? <WebView
                        style={{ height: 400, width: 300 }}
                        source={{ uri: approvalUrl }}
                        onNavigationStateChange={this._onNavigationStateChange}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        startInLoadingState={false}
                        style={{ marginTop: 20 }}
                    /> :


                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', paddingTop: 40, paddingHorizontal: 10 }}>
                                <TouchableOpacity
                                    activeOpacity={.5}
                                    onPress={() => this.props.navigation.replace('SignupScreen')}
                                >
                                    <Image
                                        style={AppStyles.backIcon}
                                        source={require('../assets/images/arrow_left_black.png')}
                                    />
                                </TouchableOpacity>
                            </View>
                            <Text style={{ ...AppStyles.header_title_screen, marginTop: 10 }}>Signup</Text>
                            <Text style={{ ...styles.textHeader, marginTop: 0 }}>You have selected "{this.state.plantitle}" package</Text>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={{ paddingBottom: 70, marginHorizontal: 15 }}>
                                    <Text style={styles.text}>First Name</Text>
                                    <TextInput
                                        ref={(input) => { this.firstnameTextInput = input; }}
                                        style={styles.textInput}
                                        onChangeText={text => this.onChangeText(text, 'firstname')}
                                        value={this.state.firstname}
                                        editable
                                    />
                                    {this.state.errorfirstname ? (
                                        <Text style={AppStyles.errortext}>
                                            * Please enter first name to proceed.
                                        </Text>
                                    ) : null}

                                    <Text style={styles.text}>Last Name</Text>
                                    <TextInput
                                        ref={(input) => { this.lastnameTextInput = input; }}
                                        style={styles.textInput}
                                        onChangeText={text => this.onChangeText(text, 'lastname')}
                                        value={this.state.lastname}
                                        editable
                                    />
                                    {this.state.errorlastname ? (
                                        <Text style={AppStyles.errortext}>
                                            * Please enter last name to proceed.
                                        </Text>
                                    ) : null}

                                    <Text style={styles.text}>Email</Text>
                                    <TextInput
                                        ref={(input) => { this.emailTextInput = input; }}
                                        style={styles.textInput}
                                        editable
                                        keyboardType="email-address"
                                        onChangeText={text => this.onChangeText(text, 'email')}
                                        value={this.state.email}
                                    />
                                    {this.state.erroremail ? (
                                        <Text style={AppStyles.errortext}>
                                            * Please enter email to proceed.
                                        </Text>
                                    ) : null}

                                    <Text style={styles.text}>New Password</Text>
                                    <View style={styles.textBoxContainer}>
                                        <TextInput secureTextEntry={this.state.hidePassword1} style={styles.textInput} onChangeText={(text) => this.onChangeText(text, 'newpass')} />
                                        <TouchableOpacity activeOpacity={0.8} style={styles.touachableButton} onPress={this.setPasswordVisibility1}>
                                            <Ionicons name={(this.state.hidePassword1) ? 'md-eye-off' : 'md-eye'} color="#000" size={24} />
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={{...styles.text,marginTop:5}}>No Requirements</Text>
                                    {this.state.errornewpass ? (
                                        <Text style={AppStyles.errortext}>
                                            * Please enter new password to proceed.
                                        </Text>
                                    ) : null}

                                    <Text style={styles.text}>Confirm Password</Text>
                                    <View style={styles.textBoxContainer}>
                                        <TextInput secureTextEntry={this.state.hidePassword2} style={styles.textInput} onChangeText={(text) => this.onChangeText(text, 'confirmpass')} />
                                        <TouchableOpacity activeOpacity={0.8} style={styles.touachableButton} onPress={this.setPasswordVisibility2}>
                                            <Ionicons name={(this.state.hidePassword2) ? 'md-eye-off' : 'md-eye'} color="#000" size={24} />
                                        </TouchableOpacity>
                                    </View>
                                    {this.state.errorconfirmpass ? (
                                        <Text style={AppStyles.errortext}>
                                            * Please enter confirm password to proceed.
                                        </Text>
                                    ) : null}
                                    {this.state.errormatchpass_false ? (
                                        <Text style={AppStyles.errortext}>
                                            * Password does not match.
                                        </Text>
                                    ) : null}
                                    {this.state.errormatchpass_true ? (
                                        <Text style={{ ...AppStyles.errortext, color: AppStyles.colorGreen.color }}>
                                            * Password matched.
                                        </Text>
                                    ) : null}

                                    <Text style={styles.text}>Phone</Text>
                                    <TextInput
                                        ref={(input) => { this.phoneTextInput = input; }}
                                        style={styles.textInput}
                                        editable
                                        keyboardType="phone-pad"
                                        onChangeText={text => this.onChangeText(text, 'phone')}
                                        value={this.state.phone}
                                        maxLength={10}
                                    />
                                    {this.state.errorphone ? (
                                        <Text style={AppStyles.errortext}>
                                            * Please enter phone to proceed.
                                        </Text>
                                    ) : null}

                                    <Text style={styles.text}>Website</Text>
                                    <TextInput
                                        ref={(input) => { this.websiteTextInput = input; }}
                                        style={styles.textInput}
                                        editable
                                        keyboardType="url"
                                        onChangeText={text => this.onChangeText(text, 'website')}
                                        value={this.state.website}
                                    />
                                    {this.state.errorwebsite ? (
                                        <Text style={AppStyles.errortext}>
                                            * Please enter website to proceed.
                                        </Text>
                                    ) : null}

                                    <Text style={styles.text}>Address</Text>
                                    <TextInput
                                        ref={(input) => { this.addressTextInput = input; }}
                                        style={styles.textInput}
                                        editable
                                        keyboardType="default"
                                        onChangeText={text => this.onChangeText(text, 'address')}
                                        value={this.state.address}
                                    />
                                    {this.state.erroraddress ? (
                                        <Text style={AppStyles.errortext}>
                                            * Please enter address to proceed.
                                        </Text>
                                    ) : null}

                                    <Text style={styles.text}>City</Text>
                                    <TextInput
                                        ref={(input) => { this.cityTextInput = input; }}
                                        style={styles.textInput}
                                        editable
                                        keyboardType="default"
                                        onChangeText={text => this.onChangeText(text, 'city')}
                                        value={this.state.city}
                                    />
                                    {this.state.errorcity ? (
                                        <Text style={AppStyles.errortext}>
                                            * Please enter city to proceed.
                                        </Text>
                                    ) : null}

                                    <Text style={styles.text}>State</Text>
                                    <Dropdown
                                        ref={(input) => { this.stateTextInput = input; }}
                                        style={{ fontSize: 16, fontFamily: 'poppinsRegular', color: AppStyles.colorBlue.color }}
                                        data={STATE}
                                        animationDuration={100}
                                        itemTextStyle={{ fontFamily: 'poppinsRegular' }}
                                        containerStyle={{ marginTop: -25 }}
                                        inputContainerStyle={{ borderBottomColor: AppStyles.colorBlue.color, borderBottomWidth: 1 }}
                                        value={this.state.state}
                                        onChangeText={(value, key) => this.onStatePress(value, 'state')}
                                    />
                                    {this.state.errorstate ? (
                                        <Text style={AppStyles.errortext}>
                                            * Please select state to proceed.
                                        </Text>
                                    ) : null}

                                    <Text style={styles.text}>Zipcode</Text>
                                    <TextInput
                                        ref={(input) => { this.zipTextInput = input; }}
                                        style={styles.textInput}
                                        editable
                                        keyboardType="number-pad"
                                        onChangeText={text => this.onChangeText(text, 'zip')}
                                        value={this.state.zip}
                                    />
                                    {this.state.errorzip ? (
                                        <Text style={AppStyles.errortext}>
                                            * Please enter zipcode to proceed.
                                        </Text>
                                    ) : null}

                                    <Text style={styles.text}>Company Name</Text>
                                    <TextInput
                                        ref={(input) => { this.companynameTextInput = input; }}
                                        style={styles.textInput}
                                        editable
                                        keyboardType="default"
                                        onChangeText={text => this.onChangeText(text, 'companyname')}
                                        value={this.state.companyname}
                                    />
                                    {this.state.errorcompanyname ? (
                                        <Text style={AppStyles.errortext}>
                                            * Please enter company name to proceed.
                                        </Text>
                                    ) : null}

                                    <Text style={{ ...AppStyles.errortext, color: AppStyles.colorBlack.color }}>
                                        Note: Password should be of 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character.
                                    </Text>

                                </View>
                            </ScrollView>

                            <TouchableOpacity style={AppStyles.button} activeOpacity={.5}
                                onPress={() => this.validateRegistrationData()}>
                                <Text style={AppStyles.buttonText}> Save Changes </Text>
                            </TouchableOpacity>
                        </View>

                }

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
    textHeader: {
        fontSize: 16,
        color: '#636363',
        textAlign: 'left',
        fontFamily: 'poppinsRegular',
        marginHorizontal: 10,
        alignSelf: 'flex-start',
        marginBottom: 5,
    },

    text: {
        fontSize: 12,
        color: '#636363',
        textAlign: 'left',
        fontFamily: 'poppinsRegular',
        marginTop: 15,
    },
    textInput: {
        fontSize: 18,
        color: AppStyles.colorBlue.color,
        textAlign: 'left',
        fontFamily: 'poppinsRegular',
        paddingBottom: 5,
        borderBottomColor: AppStyles.colorBlue.color, // Add this to specify bottom border color
        borderBottomWidth: 1,
    },

    textBoxContainer: {
        position: 'relative',
        alignSelf: 'stretch',
        justifyContent: 'center'
    },

    touachableButton: {
        position: 'absolute',
        right: 5,
        height: 40,
        width: 40,
        padding: 2,
    },

});