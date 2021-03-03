import React from 'react';
import {
    StyleSheet, View, Text, Image, TouchableOpacity, TextInput, ActivityIndicator, ToastAndroid, Dimensions, Modal, TouchableHighlight, TouchableWithoutFeedback, PermissionsAndroid,
    Platform
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Entypo, AntDesign } from '@expo/vector-icons';
import { getUserData, storeUserData } from "../auth";
import AppStyles from '../../utility/Styles'
import { API_URL, loanLength, STATE } from '../../utility/Constants'
import { Checkbox } from 'react-native-paper';
import { Dropdown } from 'react-native-material-dropdown';
import DatePicker from 'react-native-datepicker';
import { th } from 'date-fns/locale';
import * as FileSystem from 'expo-file-system';
import * as WebBrowser from 'expo-web-browser';
import * as IntentLauncher from 'expo-intent-launcher';
import MultiSelect from 'react-native-multiple-select';


const { width } = Dimensions.get('window');

export default class StartDealViewScreen extends React.Component {

    constructor(props) {
        super(props)
        this.profileImage = 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80';
        getUserData()
            .then(res => {
                let data = JSON.parse(res);
                this.setState({
                    userid: data.id,
                });
            })
            .catch(err => alert("An error occurred"));
    }

    static navigationOptions = { headerShown: false };

    state = {
        userid: "",
        isLoading: false,

        buyerUp: true,
        inventoryUp: true,
        tradeUp: true,
        numbersUp: true,

        transact_id: '',

        //update main math
        sd_main_math_saleprice: '', sd_main_math_cashcredit: 0, sd_main_math_tradecredit: 0, sd_main_math_taxdue: '', sd_main_math_totaldue: '', sd_main_math_servicefee: 0, sd_main_math_tagregistration: 0,

        //update main buyer
        sd_main_buyers_first_name: '', sd_main_buyers_mid_name: '', sd_main_buyers_last_name: '', sd_main_buyers_address: '', sd_main_buyers_city: '', sd_main_buyers_state: '', sd_main_buyers_zip: '', sd_main_buyers_country: 'USA', sd_main_buyers_email: '', sd_main_buyers_work_phone: '', sd_main_buyers_home_phone: '', sd_main_buyers_mobile: '', sd_main_dl_number: '', sd_main_buyers_dl_state: '', sd_main_buyers_dl_expire: '', sd_main_buyers_dl_dob: '', sd_main_buyers_tag_number: '',

        //update main inventory
        sd_main_inv_vin: "", sd_main_inv_year: "", sd_main_inv_make: "", sd_main_inv_model: "", sd_main_inv_style: "", sd_main_inv_stockNumber: "", sd_main_inv_color: "", sd_main_inv_mileage: "", sd_main_inv_exempt: "unchecked", sd_main_inv_cost: 0, sd_main_inv_addedCost: 0, sd_main_inv_totalCost: 0, sd_main_inv_vehiclePrice: "",

        //update main trade
        sd_main_trade_inv_vin: "", sd_main_trade_inv_year: "", sd_main_trade_inv_make: "", sd_main_trade_inv_model: "", sd_main_trade_inv_style: "", sd_main_trade_inv_color: "", sd_main_trade_inv_mileage: "", sd_main_trade_inv_exempt: "unchecked", sd_main_trade_inv_price: 0,

        //bhph contract
        sd_main_bhphcontract_cash_price: "", sd_main_bhphcontract_dealer_fee: "", sd_main_bhphcontract_taxes: "", sd_main_bhphcontract_cashdown: "", sd_main_bhphcontract_deferred_down: "", sd_main_bhphcontract_trade_allowance: "", sd_main_bhphcontract_title_fee: "", sd_main_bhphcontract_payment_amount: "", sd_main_bhphcontract_number_payments: "", sd_main_bhphcontract_interest_rate: "", sd_main_bhphcontract_total_payments: "", sd_main_bhphcontract_finance_charge: "", sd_main_bhphcontract_tot_finance_amt: "", sd_main_bhphcontract_tot_price_paid: "",

        //to dropdown in review
        sd_main_review_inv_detail: false,
        sd_main_review_trade_inv_detail: false,

    }

    buyerToggle() {
        if (this.state.buyerUp == true) {
            this.setState({ buyerUp: false })
        } else {
            this.setState({ buyerUp: true })
            this.setState({ inventoryUp: false })
            this.setState({ tradeUp: false })
            this.setState({ numbersUp: false })
        }
    }

    inventoryToggle() {
        if (this.state.inventoryUp == true) {
            this.setState({ inventoryUp: false })
        } else {
            this.setState({ inventoryUp: true })
            this.setState({ buyerUp: false })
            this.setState({ tradeUp: false })
            this.setState({ numbersUp: false })
        }
    }

    tradeToggle() {
        if (this.state.tradeUp == true) {
            this.setState({ tradeUp: false })
        } else {
            this.setState({ tradeUp: true })
            this.setState({ buyerUp: false })
            this.setState({ inventoryUp: false })
            this.setState({ numbersUp: false })
        }
    }

    numbersToggle() {
        if (this.state.numbersUp == true) {
            this.setState({ numbersUp: false })
        } else {
            this.setState({ numbersUp: true })
            this.setState({ buyerUp: false })
            this.setState({ inventoryUp: false })
            this.setState({ tradeUp: false })
        }
    }

    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('didFocus', () => {
            // The screen is focused
            // Call any action



            var transact_id = this.props.navigation.getParam('transact_id');

            getUserData()
                .then(res => {
                    let data = JSON.parse(res);
                    this.setState({
                        userid: data.id,
                        userState: data.state,
                        taxrate: data.tax,
                        servicefee: data.dealer_fee,
                        tagregistration: data.dmv
                    });
                })
                .catch(err => alert("An error occurred"));

            this.setState({
                isLoading: false,
                
                buyerUp: true,
                inventoryUp: true,
                tradeUp: true,
                numbersUp: true,

                transact_id: '',

                //update main math
                sd_main_math_saleprice: '', sd_main_math_cashcredit: 0, sd_main_math_tradecredit: 0, sd_main_math_taxdue: '', sd_main_math_totaldue: '', sd_main_math_servicefee: 0, sd_main_math_tagregistration: 0,

                //update main buyer
                sd_main_buyers_first_name: '', sd_main_buyers_mid_name: '', sd_main_buyers_last_name: '', sd_main_buyers_address: '', sd_main_buyers_city: '', sd_main_buyers_state: '', sd_main_buyers_zip: '', sd_main_buyers_country: 'USA', sd_main_buyers_email: '', sd_main_buyers_work_phone: '', sd_main_buyers_home_phone: '', sd_main_buyers_mobile: '', sd_main_dl_number: '', sd_main_buyers_dl_state: '', sd_main_buyers_dl_expire: '', sd_main_buyers_dl_dob: '', sd_main_buyers_tag_number: '',

                //update main inventory
                sd_main_inv_vin: "", sd_main_inv_year: "", sd_main_inv_make: "", sd_main_inv_model: "", sd_main_inv_style: "", sd_main_inv_stockNumber: "", sd_main_inv_color: "", sd_main_inv_mileage: "", sd_main_inv_cost: 0, sd_main_inv_addedCost: 0, sd_main_inv_totalCost: 0, sd_main_inv_vehiclePrice: "",

                //update main trade
                sd_main_trade_inv_vin: "", sd_main_trade_inv_year: "", sd_main_trade_inv_make: "", sd_main_trade_inv_model: "", sd_main_trade_inv_style: "", sd_main_trade_inv_color: "", sd_main_trade_inv_mileage: "", sd_main_trade_inv_price: 0,

                //bhph contract
                sd_main_bhphcontract_cash_price: "", sd_main_bhphcontract_dealer_fee: "", sd_main_bhphcontract_taxes: "", sd_main_bhphcontract_cashdown: "", sd_main_bhphcontract_deferred_down: "", sd_main_bhphcontract_trade_allowance: "", sd_main_bhphcontract_title_fee: "", sd_main_bhphcontract_payment_amount: "", sd_main_bhphcontract_number_payments: "", sd_main_bhphcontract_interest_rate: "", sd_main_bhphcontract_total_payments: "", sd_main_bhphcontract_finance_charge: "", sd_main_bhphcontract_tot_finance_amt: "", sd_main_bhphcontract_tot_price_paid: "",

                sd_main_review_inv_detail: false,
                sd_main_review_trade_inv_detail: false,

                transact_status: "",
            })


            if (transact_id != "") {
                this.setState({ transact_id: transact_id })
                this.getEditDealData(transact_id)
            } else {
                this.setState({ transact_id: "" })
            }
        });
    }

    componentWillUnmount() {
        // Remove the event listener
        this.focusListener.remove();
    }

    async getEditDealData(transact_id) {

        this.setState({ isLoading: true });

        var data = {
            "transact_id": transact_id
        }

        fetch(API_URL + "geteditdealdata", {
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
                console.log(data);
                if (data.status == "true") {
                    {
                        this.setState({
                            transact_status: data.data[0].status,
                        })

                        this.setState({
                            sd_main_buyers_first_name: data.data[0].buyers_first_name,
                            sd_main_buyers_mid_name: data.data[0].buyers_mid_name,
                            sd_main_buyers_last_name: data.data[0].buyers_last_name,
                            sd_main_buyers_address: data.data[0].buyers_address,
                            sd_main_buyers_city: data.data[0].buyers_city,
                            sd_main_buyers_state: data.data[0].buyers_state,
                            sd_main_buyers_zip: data.data[0].buyers_zip,
                            // sd_main_buyers_country: data.data[0].buyers_county,
                            sd_main_buyers_email: data.data[0].buyers_pri_email,
                            sd_main_buyers_work_phone: data.data[0].buyers_work_phone,
                            sd_main_buyers_home_phone: data.data[0].buyers_home_phone,
                            sd_main_buyers_mobile: data.data[0].buyers_pri_phone_cell,
                            sd_main_dl_number: data.data[0].buyers_DL_number,
                            sd_main_buyers_dl_state: data.data[0].buyers_DL_state,
                            sd_main_buyers_dl_expire: data.data[0].buyers_DL_expire,
                            sd_main_buyers_dl_dob: data.data[0].buyers_DL_dob,
                            sd_main_buyers_tag_number: data.data[0].buyers_temp_tag_number,

                        })

                        this.setState({
                            sd_main_math_saleprice: data.data[0].sale_price,
                            sd_main_math_cashcredit: data.data[0].cash_credit,
                            sd_main_math_tradecredit: data.data[0].trade_credit,
                            sd_main_math_taxdue: data.data[0].tax,
                            sd_main_math_totaldue: data.data[0].total_due,
                            sd_main_math_servicefee: data.data[0].dealer_fee,
                            sd_main_math_tagregistration: data.data[0].dmv,
                        })

                       


                        if (data.data[0].inv_vin != 0 && data.data[0].trade_inv_vin != 0) {

                            
                            this.setState({
                                sd_main_inv_vin: data.data[0].inv_vin,
                                sd_main_inv_year: data.data[0].inv_year,
                                sd_main_inv_make: data.data[0].inv_make,
                                sd_main_inv_model: data.data[0].inv_model,
                                sd_main_inv_style: data.data[0].inv_style,
                                sd_main_inv_stockNumber: data.data[0].inv_stock,
                                sd_main_inv_color: data.data[0].inv_color,
                                sd_main_inv_mileage: data.data[0].inv_mileage,
                                sd_main_inv_exempt: data.data[0].inv_exempt == 'yes' ? 'checked' : 'unchecked',
                                sd_main_inv_cost: data.data[0].inv_cost,
                                sd_main_inv_addedCost: data.data[0].inv_addedcost,
                                sd_main_inv_totalCost: data.data[0].inv_flrc,
                                sd_main_inv_vehiclePrice: data.data[0].inv_price,
                            })

                            this.setState({
                                sd_main_trade_inv_vin: data.data[0].trade_inv_vin,
                                sd_main_trade_inv_year: data.data[0].trade_inv_year,
                                sd_main_trade_inv_make: data.data[0].trade_inv_make,
                                sd_main_trade_inv_model: data.data[0].trade_inv_model,
                                sd_main_trade_inv_style: data.data[0].trade_inv_style,
                                sd_main_trade_inv_color: data.data[0].trade_inv_color,
                                sd_main_trade_inv_mileage: data.data[0].trade_inv_mileage,
                                sd_main_trade_inv_exempt: data.data[0].trade_inv_exempt == 'yes' ? 'checked' : 'unchecked',
                                sd_main_trade_inv_price: data.data[0].trade_inv_price,
                            })

                            this.setState({
                                sd_main_review_inv_detail: true,
                                sd_main_review_trade_inv_detail: true,
                            })

                        } else if (data.data[0].inv_vin != 0) {


                            this.setState({
                                sd_main_inv_vin: data.data[0].inv_vin,
                                sd_main_inv_year: data.data[0].inv_year,
                                sd_main_inv_make: data.data[0].inv_make,
                                sd_main_inv_model: data.data[0].inv_model,
                                sd_main_inv_style: data.data[0].inv_style,
                                sd_main_inv_stockNumber: data.data[0].inv_stock,
                                sd_main_inv_color: data.data[0].inv_color,
                                sd_main_inv_mileage: data.data[0].inv_mileage,
                                sd_main_inv_exempt: data.data[0].inv_exempt == 'yes' ? 'checked' : 'unchecked',
                                sd_main_inv_cost: data.data[0].inv_cost,
                                sd_main_inv_addedCost: data.data[0].inv_addedcost,
                                sd_main_inv_totalCost: data.data[0].inv_flrc,
                                sd_main_inv_vehiclePrice: data.data[0].inv_price,
                            })

                            this.setState({
                                sd_main_review_inv_detail: true,
                                sd_main_review_trade_inv_detail: false,
                            })

                        } else if (data.data[0].trade_inv_vin != 0) {

                            this.setState({
                                sd_main_trade_inv_vin: data.data[0].trade_inv_vin,
                                sd_main_trade_inv_year: data.data[0].trade_inv_year,
                                sd_main_trade_inv_make: data.data[0].trade_inv_make,
                                sd_main_trade_inv_model: data.data[0].trade_inv_model,
                                sd_main_trade_inv_style: data.data[0].trade_inv_style,
                                sd_main_trade_inv_color: data.data[0].trade_inv_color,
                                sd_main_trade_inv_mileage: data.data[0].trade_inv_mileage,
                                sd_main_trade_inv_exempt: data.data[0].trade_inv_exempt == 'yes' ? 'checked' : 'unchecked',
                                sd_main_trade_inv_price: data.data[0].trade_inv_price,
                            })

                            this.setState({
                                sd_main_review_inv_detail: false,
                                sd_main_review_trade_inv_detail: true,
                            })
                        }
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

    isuserexpied() {

        this.setState({ isLoading: true });
        var data = {
            "member_id": this.state.userid
        }
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
                        if (Platform.OS === 'android') {
                            ToastAndroid.show(data.message, ToastAndroid.SHORT);
                        } else {
                            alert(data.message);
                        }
                        this.props.navigation.navigate('OurplanScreen');
                    }
                }
            })
            .catch((error) => console.error(error))
            .finally(() => this.setState({ isLoading: false }));

        // this.props.navigation.navigate('StartDealScreen',{ transact_id:'', modelType: '' })
    }


    render() {
        const { selectedDDInv, selectedDDTrade } = this.state;
        return (
            <View style={styles.container}>

                {/* menu header start */}
                <TouchableOpacity style={AppStyles.navigationButton} onPress={() => this.props.navigation.navigate("YourdealScreen")}>
                    {/*Donute Button Image */}
                    <Image
                        style={{ width: 24, height: 20, margin: 10, resizeMode: "cover" }}
                        source={require('../../assets/images/arrow_left_black.png')}
                    />
                </TouchableOpacity>
                {/* menu header end */}

                <Text style={AppStyles.header_title_screen}>View Deal</Text>

                <View style={{ paddingBottom: 100 }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ paddingBottom: 20 }}>

                            <View style={{ backgroundColor: 'white', borderTopLeftRadius: 15, borderTopRightRadius: 15, marginHorizontal: 10 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ ...styles.text_title, flex: 1, marginTop: 0, alignSelf: "center" }}>Buyer Details</Text>
                                    <TouchableOpacity style={{ flex: 0 }} activeOpacity={0.5} onPress={this.buyerToggle.bind(this)}>
                                        <AntDesign name={this.state.buyerUp === false ? 'up' : 'down'} size={25} color={AppStyles.colorBlack.color} style={{ margin: 10 }} />
                                    </TouchableOpacity>
                                </View>

                                <View style={{
                                    marginBottom: 10,
                                    display: (this.state.buyerUp == false ? 'none' : 'flex')
                                }}>
                                    <Text style={styles.text}>Buyer First Name</Text>
                                    <Text style={styles.text2} numberOfLines={1}> {this.state.sd_main_buyers_first_name} </Text>

                                    <Text style={styles.text}>Buyer Middle Name</Text>
                                    <Text style={styles.text2} numberOfLines={1}> {this.state.sd_main_buyers_mid_name} </Text>

                                    <Text style={styles.text}>Buyer Last Name</Text>
                                    <Text style={styles.text2} numberOfLines={1}> {this.state.sd_main_buyers_last_name} </Text>

                                    <Text style={styles.text}>Buyer Address</Text>
                                    <Text style={styles.text2} numberOfLines={1}> {this.state.sd_main_buyers_address} </Text>

                                    <Text style={styles.text}>Buyer City</Text>
                                    <Text style={styles.text2} numberOfLines={1}> {this.state.sd_main_buyers_city} </Text>

                                    <Text style={styles.text}>Buyer State</Text>
                                    <Text style={styles.text2} numberOfLines={1}> {this.state.sd_main_buyers_state} </Text>

                                    <Text style={styles.text}>Buyer Zip</Text>
                                    <Text style={styles.text2} numberOfLines={1}> {this.state.sd_main_buyers_zip} </Text>

                                    <Text style={styles.text}>Buyer Country</Text>
                                    <Text style={styles.text2} numberOfLines={1}> {this.state.sd_main_buyers_country} </Text>

                                    <Text style={styles.text}>Buyer Email</Text>
                                    <Text style={styles.text2} numberOfLines={1}> {this.state.sd_main_buyers_email} </Text>

                                    <Text style={styles.text}>Buyer Work Phone</Text>
                                    <Text style={styles.text2} numberOfLines={1}> {this.state.sd_main_buyers_work_phone} </Text>

                                    <Text style={styles.text}>Buyer Home Phone</Text>
                                    <Text style={styles.text2} numberOfLines={1}> {this.state.sd_main_buyers_home_phone} </Text>

                                    <Text style={styles.text}>Buyer Mobile</Text>
                                    <Text style={styles.text2} numberOfLines={1}> {this.state.sd_main_buyers_mobile} </Text>

                                    <Text style={styles.text}>Buyer DL State</Text>
                                    <Text style={styles.text2} numberOfLines={1}> {this.state.sd_main_buyers_dl_state} </Text>

                                    <Text style={styles.text}>Drivers License Number</Text>
                                    <Text style={styles.text2} numberOfLines={1}> {this.state.sd_main_dl_number} </Text>

                                    <Text style={styles.text}>Buyer DL Expire</Text>
                                    <Text style={styles.text2} numberOfLines={1}> {this.state.sd_main_buyers_dl_expire} </Text>

                                    <Text style={styles.text}>Buyer DL Date of Birth</Text>
                                    <Text style={styles.text2} numberOfLines={1}> {this.state.sd_main_buyers_dl_dob} </Text>

                                    <Text style={styles.text}>Buyer Tag Number</Text>
                                    <Text style={styles.text2} numberOfLines={1}> {this.state.sd_main_buyers_tag_number} </Text>

                                </View>

                            </View>

                            <View style={styles.divider}></View>

                            <View style={{
                                backgroundColor: 'white',
                                marginHorizontal: 10,
                                display: (this.state.sd_main_review_inv_detail == false ? 'none' : 'flex')
                            }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ ...styles.text_title, flex: 1, marginTop: 0, alignSelf: "center" }}>Vehicle Details(Inventory)</Text>
                                    <TouchableOpacity style={{ flex: 0 }} activeOpacity={0.5} onPress={this.inventoryToggle.bind(this)}>
                                        <AntDesign name={this.state.inventoryUp === false ? 'up' : 'down'} size={25} color={AppStyles.colorBlack.color} style={{ margin: 10 }} />
                                    </TouchableOpacity>
                                </View>

                                <View style={{ marginBottom: 10, display: (this.state.inventoryUp == false ? 'none' : 'flex') }}>

                                    <Text style={styles.text}>VIN</Text>
                                    <Text style={styles.text2} numberOfLines={1}> {this.state.sd_main_inv_vin} </Text>

                                    <Text style={styles.text}>Year</Text>
                                    <Text style={styles.text2} numberOfLines={1}> {this.state.sd_main_inv_year} </Text>

                                    <Text style={styles.text}>Make</Text>
                                    <Text style={styles.text2} numberOfLines={1}> {this.state.sd_main_inv_make} </Text>

                                    <Text style={styles.text}>Model</Text>
                                    <Text style={styles.text2} numberOfLines={1}> {this.state.sd_main_inv_model} </Text>

                                    <Text style={styles.text}>Style</Text>
                                    <Text style={styles.text2} numberOfLines={1}> {this.state.sd_main_inv_style} </Text>

                                    <Text style={styles.text}>Stock Number</Text>
                                    <Text style={styles.text2} numberOfLines={1}> {this.state.sd_main_inv_stockNumber} </Text>

                                    <Text style={styles.text}>Color</Text>
                                    <Text style={styles.text2} numberOfLines={1}> {this.state.sd_main_inv_color} </Text>

                                    <Text style={styles.text}>Mileage</Text>
                                    <Text style={styles.text2} numberOfLines={1}> {this.state.sd_main_inv_mileage} </Text>

                                    <View style={{ flexDirection: 'row' }}>
                                        <Checkbox
                                            status={this.state.sd_main_inv_exempt}
                                            color={AppStyles.colorBlue.color}
                                            disabled={true}
                                        />
                                        <Text style={styles.checkboxtextexempt}>Exempt</Text>
                                    </View>

                                    <Text style={styles.text}>Cost</Text>
                                    <Text style={styles.text2} numberOfLines={1}> {this.state.sd_main_inv_cost} </Text>

                                    <Text style={styles.text}>Added Cost</Text>
                                    <Text style={styles.text2} numberOfLines={1}> {this.state.sd_main_inv_addedCost} </Text>

                                    <Text style={styles.text}>Total Cost</Text>
                                    <Text style={styles.text2} numberOfLines={1}> {this.state.sd_main_inv_totalCost} </Text>

                                    <Text style={styles.text}>Vehicle Price</Text>
                                    <Text style={styles.text2} numberOfLines={1}> {this.state.sd_main_inv_vehiclePrice} </Text>

                                </View>

                            </View>

                            <View style={{ ...styles.divider, display: (this.state.sd_main_review_inv_detail == false ? 'none' : 'flex') }}></View>

                            <View style={{
                                backgroundColor: 'white',
                                marginHorizontal: 10,
                                display: (this.state.sd_main_review_trade_inv_detail == false ? 'none' : 'flex')
                            }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ ...styles.text_title, flex: 1, marginTop: 0, alignSelf: "center" }}>Vehicle Details(Trade)</Text>
                                    <TouchableOpacity style={{ flex: 0 }} activeOpacity={0.5} onPress={this.tradeToggle.bind(this)}>
                                        <AntDesign name={this.state.tradeUp === false ? 'up' : 'down'} size={25} color={AppStyles.colorBlack.color} style={{ margin: 10 }} />
                                    </TouchableOpacity>
                                </View>

                                <View style={{ marginBottom: 10, display: (this.state.tradeUp == false ? 'none' : 'flex') }}>

                                    <Text style={styles.text}>VIN</Text>
                                    <Text style={styles.text2} numberOfLines={1}> {this.state.sd_main_trade_inv_vin} </Text>

                                    <Text style={styles.text}>Year</Text>
                                    <Text style={styles.text2} numberOfLines={1}> {this.state.sd_main_trade_inv_year} </Text>

                                    <Text style={styles.text}>Make</Text>
                                    <Text style={styles.text2} numberOfLines={1}> {this.state.sd_main_trade_inv_make} </Text>

                                    <Text style={styles.text}>Model</Text>
                                    <Text style={styles.text2} numberOfLines={1}> {this.state.sd_main_trade_inv_model} </Text>

                                    <Text style={styles.text}>Style</Text>
                                    <Text style={styles.text2} numberOfLines={1}> {this.state.sd_main_trade_inv_style} </Text>

                                    <Text style={styles.text}>Color</Text>
                                    <Text style={styles.text2} numberOfLines={1}> {this.state.sd_main_trade_inv_color} </Text>

                                    <Text style={styles.text}>Mileage</Text>
                                    <Text style={styles.text2} numberOfLines={1}> {this.state.sd_main_trade_inv_mileage} </Text>

                                    <View style={{ flexDirection: 'row' }}>
                                        <Checkbox
                                            status={this.state.sd_main_trade_inv_exempt}
                                            color={AppStyles.colorBlue.color}
                                            disabled={true}
                                        />
                                        <Text style={styles.checkboxtextexempt}>Exempt</Text>
                                    </View>

                                    <Text style={styles.text}>Trade Allowance</Text>
                                    <Text style={styles.text2} numberOfLines={1}> {this.state.sd_main_trade_inv_price} </Text>

                                </View>

                            </View>

                            <View style={{ ...styles.divider, display: (this.state.sd_main_review_trade_inv_detail == false ? 'none' : 'flex') }}></View>

                            <View style={{
                                backgroundColor: 'white',
                                borderBottomLeftRadius: 15,
                                borderBottomRightRadius: 15,
                                marginHorizontal: 10
                            }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ ...styles.text_title, flex: 1, marginTop: 0, alignSelf: "center" }}>The Numbers</Text>
                                    <TouchableOpacity style={{ flex: 0 }} activeOpacity={0.5} onPress={this.numbersToggle.bind(this)}>
                                        <AntDesign name={this.state.numbersUp === false ? 'up' : 'down'} size={25} color={AppStyles.colorBlack.color} style={{ margin: 10 }} />
                                    </TouchableOpacity>
                                </View>

                                <View style={{ marginBottom: 10, display: (this.state.numbersUp == false ? 'none' : 'flex') }}>

                                    <Text style={styles.text}>Sale Price</Text>
                                    <Text style={styles.text2} numberOfLines={1}> {this.state.sd_main_math_saleprice} </Text>

                                    <Text style={styles.text}>Cash Down</Text>
                                    <Text style={styles.text2} numberOfLines={1}> {this.state.sd_main_math_cashcredit} </Text>

                                    <Text style={styles.text}>Trade In Credit</Text>
                                    <Text style={styles.text2} numberOfLines={1}> {this.state.sd_main_math_tradecredit} </Text>

                                    <Text style={styles.text}>Service Fee</Text>
                                    <Text style={styles.text2} numberOfLines={1}> {this.state.sd_main_math_servicefee} </Text>

                                    <Text style={styles.text}>Tag/Registration</Text>
                                    <Text style={styles.text2} numberOfLines={1}> {this.state.sd_main_math_tagregistration} </Text>

                                    <Text style={styles.text}>Total Tax</Text>
                                    <Text style={styles.text2} numberOfLines={1}> {this.state.sd_main_math_taxdue} </Text>

                                    <Text style={styles.text}>Total Due</Text>
                                    <Text style={styles.text2} numberOfLines={1}> {this.state.sd_main_math_totaldue} </Text>

                                </View>
                            </View>
                        </View>
                    </ScrollView>
                    {/* {this.state.isLoading ?
                        <View style={AppStyles.loader}>
                            <ActivityIndicator size='large' color={AppStyles.colorOrange.color} />
                        </View>
                        :
                        <View></View>} */}
                </View>

                {this.state.isLoading &&
                    <View style={AppStyles.loader}>
                        <ActivityIndicator size='large' color={AppStyles.colorOrange.color} />
                    </View>
                }
            </View>
        )
    }

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        flexDirection: 'column',
        alignContent: 'stretch',
    },

    divider: {
        height: 1,
        backgroundColor: AppStyles.colorGrey.color,
        marginHorizontal: 10
    },

    text_title: {
        fontSize: 16,
        textAlign: 'left',
        marginLeft: 10,
        marginRight: 0,
        marginTop: 20,
        color: "#000",
        fontFamily: 'poppinsMedium',
    },

    text: {
        fontSize: 16,
        color: AppStyles.colorGrey.color,
        textAlign: 'left',
        fontFamily: 'poppinsRegular',
        marginHorizontal: 10,
        marginTop: 10,
    },

    text2: {
        fontSize: 16,
        textAlign: 'left',
        color: AppStyles.colorBlack.color,
        fontFamily: 'poppinsMedium',
        marginTop: -5,
        marginHorizontal: 10,
    },

    checkboxtextexempt: {
        fontSize: 16,
        // textAlign: 'left',
        fontFamily: 'poppinsRegular',
        marginRight: 10,
        alignSelf: "center",
    },

});