import React from 'react';
import {
    StyleSheet, View, Text, Image, TouchableOpacity, TextInput, ActivityIndicator, ToastAndroid, Dimensions, Modal, TouchableHighlight, TouchableWithoutFeedback, PermissionsAndroid,
    Platform, Share
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

export default class StartDealScreen extends React.Component {

    constructor(props) {
        super(props)
        this.profileImage = 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80';
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
    }

    static navigationOptions = { headerShown: false };

    state = {
        userid: "",
        userState: "",
        isLoading: false,
        isModalPrintVisible: false,
        isModalContractVisible: false,
        isModalInventoryScanVisible: false,
        isModalInventoryInfoVisible: false,
        isModalTradeScanVisible: false,
        isModalTradeInfoVisible: false,
        isModalBuyerVisible: false,
        isModalCoBuyerVisible: false,
        isModalInsuranceVisible: false,
        // inventory_screen: true,
        // trade_screen: false,
        // buyers_screen: false,
        // cobuyers_screen: false,
        // insurance_screen: false,
        // calculator_screen: false,
        // review_screen: false,
        // screen1: true,
        screen1: true,
        screen2: false,
        screen3: false,
        screen4: false,
        screen5: false,
        screen6: false,
        screen7: false,
        buyerUp: false,
        inventoryUp: false,
        tradeUp: false,
        numbersUp: false,

        selectedDDInv: "",
        selectedDDTrade: "",
        itemsInv: [],
        itemsTrade: [],
        itemsBuyers: [],

        transact_id: '',
        inv_id: '0', trade_inv_id: '0', buyers_id: '0', cobuyers_id: '0', insurance_buyers_id: '0',
        inv_id_value: 'Pick vehicle', trade_inv_id_value: 'Pick vehicle', buyers_id_value: '', cobuyers_id_value: '', insurance_buyers_id_value: '',
        error_inv_id: false, error_trade_inv_id: false, error_buyers_id: false, error_cobuyers_id: false, error_insurance_buyers_id: false,

        //add inventory
        inv_vin_model: '', errorinv_vin_model: false,
        inv_vin: "", inv_year: "", inv_make: "", inv_model: "", inv_style: "", inv_stockNumber: "", inv_color: "", inv_mileage: "", inv_exempt: "unchecked", inv_cost: 0, inv_addedCost: 0, inv_totalCost: 0, inv_vehiclePrice: "",
        errorinv_vin: false, errorinv_year: false, errorinv_make: false, errorinv_model: false, errorinv_style: false, errorinv_stockNumber: false, errorinv_color: false, errorinv_mileage: false, errorinv_cost: false, errorinv_addedCost: false, errorinv_vehiclePrice: false,

        //add trade
        trade_inv_vin_model: '', errortrade_inv_vin_model: false,
        trade_inv_vin: "", trade_inv_year: "", trade_inv_make: "", trade_inv_model: "", trade_inv_style: "", trade_inv_color: "", trade_inv_mileage: "", trade_inv_exempt: "unchecked", trade_inv_price: 0,
        errortrade_inv_vin: false, errortrade_inv_year: false, errortrade_inv_make: false, errortrade_inv_model: false, errortrade_inv_style: false, errortrade_inv_color: false, errortrade_inv_mileage: false, errortrade_inv_price: false,

        //add buyer
        buyers_first_name: '', buyers_mid_name: '', buyers_last_name: '', buyers_address: '', buyers_city: '', buyers_state: '', buyers_zip: '', buyers_country: 'USA', buyers_email: '', buyers_work_phone: '', buyers_home_phone: '', buyers_mobile: '', dl_number: '', buyers_dl_state: '', buyers_dl_expire: '', buyers_dl_dob: '', buyers_tag_number: '',
        errorbuyers_first_name: false, errorbuyers_mid_name: false, errorbuyers_last_name: false, errorbuyers_address: false, errorbuyers_city: false, errorbuyers_state: false, errorbuyers_zip: false, errorbuyers_country: false, errorbuyers_email: false, errorbuyers_work_phone: false, errorbuyers_home_phone: false, errorbuyers_mobile: false, errordl_number: false, errorbuyers_dl_state: false, errorbuyers_dl_expire: false, errorbuyers_dl_dob: false, errorbuyers_tag_number: false,

        //add cobuyer
        co_buyers_first_name: '', co_buyers_mid_name: '', co_buyers_last_name: '', co_buyers_address: '', co_buyers_city: '', co_buyers_state: '', co_buyers_zip: '', co_buyers_country: 'USA', co_buyers_email: '', co_buyers_work_phone: '', co_buyers_home_phone: '', co_buyers_mobile: '', co_buyers_dl_number: '', co_buyers_dl_state: '', co_buyers_dl_expire: '', co_buyers_dl_dob: '',
        errorco_buyers_first_name: false, errorco_buyers_mid_name: false, errorco_buyers_last_name: false, errorco_buyers_address: false, errorco_buyers_city: false, errorco_buyers_state: false, errorco_buyers_zip: false, errorco_buyers_country: false, errorco_buyers_email: false, errorco_buyers_work_phone: false, errorco_buyers_home_phone: false, errorco_buyers_mobile: false, errorco_buyers_dl_number: false, errorco_buyers_dl_state: false, errorco_buyers_dl_expire: false, errorco_buyers_dl_dob: false,

        //add insurance
        ins_company: '', ins_pol_num: '', ins_phone: '', ins_address: '', ins_city: '', ins_state: '', ins_zip: '', ins_agent: '',
        errorins_company: false, errorins_pol_num: false, errorins_phone: false, errorins_address: false, errorins_city: false, errorins_state: false, errorins_zip: false, errorins_agent: false,

        math_saleprice: '',
        math_cashcredit: '',
        math_tradecredit: '',
        math_tavtprice: '',
        math_taxdue: '',
        math_totaldue: '',
        taxrate: '',
        servicefee: '',
        tagregistration: '',

        tax: 0, sub_due: 0, sub_due1: 0, sub_due2: 0,

        errormath_saleprice: false,
        errormath_cashcredit: false,
        errormath_tradecredit: false,
        errormath_tavtprice: false,
        errortaxrate: false,
        errorservicefee: false,
        errortagregistration: false,

        calc_amountToFinance: "", calc_downpayment: "", calc_loanLength: "", calc_interestRate: "",
        error_calc_amountToFinance: false, error_calc_downpayment: false, error_calc_loanLength: false, error_calc_interestRate: false,
        calc_monthlyPay: 0,
        calc_biweeklyPay: 0,
        calc_monthlytotalPayment: 0,
        calc_biweeklytotalPayment: 0,
        calc_totalInterest: 0,
        calc_biweekly_interest: 0,
        calc_cb_monthly: "checked",
        calc_cb_biweekly: "unchecked",

        //update main math
        sd_main_math_saleprice: '', sd_main_math_cashcredit: 0, sd_main_math_tradecredit: 0, sd_main_math_taxdue: '', sd_main_math_totaldue: '', sd_main_math_servicefee: 0, sd_main_math_tagregistration: 0,
        errorsd_main_math_saleprice: false, errorsd_main_math_cashcredit: false, errorsd_main_math_tradecredit: false, errorsd_main_math_taxdue: false, errorsd_main_math_totaldue: false, errorsd_main_math_servicefee: false, errorsd_main_math_tagregistration: false,

        //update main buyer
        sd_main_buyers_first_name: '', sd_main_buyers_mid_name: '', sd_main_buyers_last_name: '', sd_main_buyers_address: '', sd_main_buyers_city: '', sd_main_buyers_state: '', sd_main_buyers_zip: '', sd_main_buyers_country: 'USA', sd_main_buyers_email: '', sd_main_buyers_work_phone: '', sd_main_buyers_home_phone: '', sd_main_buyers_mobile: '', sd_main_dl_number: '', sd_main_buyers_dl_state: '', sd_main_buyers_dl_expire: '', sd_main_buyers_dl_dob: '', sd_main_buyers_tag_number: '',
        errorsd_main_buyers_first_name: false, errorsd_main_buyers_mid_name: false, errorsd_main_buyers_last_name: false, errorsd_main_buyers_address: false, errorsd_main_buyers_city: false, errorsd_main_buyers_state: false, errorsd_main_buyers_zip: false, errorsd_main_buyers_country: false, errorsd_main_buyers_email: false, errorsd_main_buyers_work_phone: false, errorsd_main_buyers_home_phone: false, errorsd_main_buyers_mobile: false, errorsd_main_dl_number: false, errorsd_main_buyers_dl_state: false, errorsd_main_buyers_dl_expire: false, errorsd_main_buyers_dl_dob: false, errorsd_main_buyers_tag_number: false,

        //update main inventory
        sd_main_inv_vin: "", sd_main_inv_year: "", sd_main_inv_make: "", sd_main_inv_model: "", sd_main_inv_style: "", sd_main_inv_stockNumber: "", sd_main_inv_color: "", sd_main_inv_mileage: "", sd_main_inv_exempt: "unchecked", sd_main_inv_cost: 0, sd_main_inv_addedCost: 0, sd_main_inv_totalCost: 0, sd_main_inv_vehiclePrice: "",
        errorsd_main_inv_vin: false, errorsd_main_inv_year: false, errorsd_main_inv_make: false, errorsd_main_inv_model: false, errorsd_main_inv_style: false, errorsd_main_inv_stockNumber: false, errorsd_main_inv_color: false, errorsd_main_inv_mileage: false, errorsd_main_inv_cost: false, errorsd_main_inv_addedCost: false, errorsd_main_inv_vehiclePrice: false,

        //update main trade
        sd_main_trade_inv_vin: "", sd_main_trade_inv_year: "", sd_main_trade_inv_make: "", sd_main_trade_inv_model: "", sd_main_trade_inv_style: "", sd_main_trade_inv_color: "", sd_main_trade_inv_mileage: "", sd_main_trade_inv_exempt: "unchecked", sd_main_trade_inv_price: 0,
        errorsd_main_trade_inv_vin: false, errorsd_main_trade_inv_year: false, errorsd_main_trade_inv_make: false, errorsd_main_trade_inv_model: false, errorsd_main_trade_inv_style: false, errorsd_main_trade_inv_color: false, errorsd_main_trade_inv_mileage: false, errorsd_main_trade_inv_price: false,

        //bhph contract
        sd_main_bhphcontract_cash_price: "", sd_main_bhphcontract_dealer_fee: "", sd_main_bhphcontract_taxes: "", sd_main_bhphcontract_cashdown: "", sd_main_bhphcontract_deferred_down: "", sd_main_bhphcontract_trade_allowance: "", sd_main_bhphcontract_title_fee: "", sd_main_bhphcontract_payment_amount: "", sd_main_bhphcontract_number_payments: "", sd_main_bhphcontract_interest_rate: "", sd_main_bhphcontract_total_payments: "", sd_main_bhphcontract_finance_charge: "", sd_main_bhphcontract_tot_finance_amt: "", sd_main_bhphcontract_tot_price_paid: "",
        errorsd_main_bhphcontract_cash_price: false, errorsd_main_bhphcontract_dealer_fee: false, errorsd_main_bhphcontract_taxes: false, errorsd_main_bhphcontract_cashdown: false, errorsd_main_bhphcontract_deferred_down: false, errorsd_main_bhphcontract_trade_allowance: false, errorsd_main_bhphcontract_title_fee: false, errorsd_main_bhphcontract_payment_amount: false, errorsd_main_bhphcontract_number_payments: false, errorsd_main_bhphcontract_interest_rate: false, errorsd_main_bhphcontract_total_payments: false, errorsd_main_bhphcontract_finance_charge: false, errorsd_main_bhphcontract_tot_finance_amt: false, errorsd_main_bhphcontract_tot_price_paid: false,

        //to dropdown in review
        sd_main_review_inv_detail: false,
        sd_main_review_trade_inv_detail: false,

        //print document
        sd_main_readyprint_date: "",
        sd_main_readyprint_chooseall: "unchecked",
        sd_main_readyprint_billofsale: "unchecked",
        sd_main_readyprint_title_application: "unchecked",
        sd_main_readyprint_odometer_statement: "unchecked",
        sd_main_readyprint_as_is: "unchecked",
        sd_main_readyprint_proof_of_insurance: "unchecked",
        sd_main_readyprint_power_of_attorney: "unchecked",
        sd_main_readyprint_arbitration_agreement: "unchecked",
        sd_main_readyprint_right_repossession: "unchecked",
        sd_main_readyprint_ofac_statement: "unchecked",
        sd_main_readyprint_privacy_information: "unchecked",
        sd_main_readyprint_certificate_exemption: "unchecked",

        //FLORIDA
        sd_main_readyprint_customer_consent: "unchecked",
        sd_main_readyprint_apc: "unchecked",
        sd_main_readyprint_hope_scholarship_program: "unchecked",
        sd_main_readyprint_federal_risk: "unchecked",
        sd_main_readyprint_buyers_agreement: "unchecked",
        sd_main_readyprint_sep_odometer_statement: "unchecked",
        sd_main_readyprint_buyers_guide: "unchecked",
        sd_main_readyprint_facts: "unchecked",
        sd_main_readyprint_insurance_affidavit: "unchecked",
        sd_main_readyprint_insurance_agreement: "unchecked",
        sd_main_readyprint_installment_contract: "unchecked",
        sd_main_readyprint_buyers_order: "unchecked",

        //TEXAS
        sd_main_readyprint_app_title_registration: "unchecked",
        sd_main_readyprint_loan_payment_schedule: "unchecked",
        sd_main_readyprint_credit_reporting_disclosure: "unchecked",
        sd_main_readyprint_airbags: "unchecked",
        sd_main_readyprint_release_agreement: "unchecked",
        sd_main_readyprint_api: "unchecked",
        sd_main_readyprint_country_title_issurance: "unchecked",
        sd_main_readyprint_authorization_letter: "unchecked",
        sd_main_readyprint_electronic_payment_authorization: "unchecked",
        sd_main_readyprint_do_not_sign: "unchecked",
        sd_main_readyprint_receipt_downpayment: "unchecked",
        sd_main_readyprint_buyer_information: "unchecked",

        //print BHPH Contract
        sd_main_bhphcontract_date: "",
        sd_main_bhphcontract_cb: "unchecked",
        sd_main_bhphcontract_cash_price: "",
        sd_main_bhphcontract_dealer_fee: "",
        sd_main_bhphcontract_taxes: "",
        sd_main_bhphcontract_cashdown: "",
        sd_main_bhphcontract_deferred_down: "",
        sd_main_bhphcontract_trade_allowance: "",
        sd_main_bhphcontract_title_fee: "",
        sd_main_bhphcontract_payment_amount: "",
        sd_main_bhphcontract_number_payments: "",
        sd_main_bhphcontract_interest_rate: "",
        sd_main_bhphcontract_total_payments: "",
        sd_main_bhphcontract_finance_charge: "",
        sd_main_bhphcontract_tot_finance_amt: "",
        sd_main_bhphcontract_tot_price_paid: "",
        sd_main_bhphcontract_payment_scheduleFrom: "",
        sd_main_bhphcontract_payment_scheduleTo: "",

        errorsd_main_bhphcontract_cash_price: "",
        errorsd_main_bhphcontract_dealer_fee: "",
        errorsd_main_bhphcontract_taxes: "",
        errorsd_main_bhphcontract_cashdown: "",
        errorsd_main_bhphcontract_deferred_down: "",
        errorsd_main_bhphcontract_trade_allowance: "",
        errorsd_main_bhphcontract_title_fee: "",
        errorsd_main_bhphcontract_payment_amount: "",
        errorsd_main_bhphcontract_number_payments: "",
        errorsd_main_bhphcontract_interest_rate: "",
        errorsd_main_bhphcontract_total_payments: "",
        errorsd_main_bhphcontract_finance_charge: "",
        errorsd_main_bhphcontract_tot_finance_amt: "",
        errorsd_main_bhphcontract_tot_price_paid: "",

        transact_status: "",

        btn_disable_dealprint: false,
        btn_disable_dealcontract: false,
        btn_disable_dealsave: false,
        btn_disable_dealnotsave: false,
    }

    toggleModalInventoryScan = () => {
        this.setState({ isModalInventoryScanVisible: !this.state.isModalInventoryScanVisible });
    };

    toggleModalInventoryInfo = () => {
        this.setState({ isModalInventoryInfoVisible: !this.state.isModalInventoryInfoVisible });
    };

    toggleModalTradeScan = () => {
        this.setState({ isModalTradeScanVisible: !this.state.isModalTradeScanVisible });
    };

    toggleModalTradeInfo = () => {
        this.setState({ isModalTradeInfoVisible: !this.state.isModalTradeInfoVisible });
    };

    toggleModalBuyer = () => {
        this.setState({ isModalBuyerVisible: !this.state.isModalBuyerVisible });
    };

    toggleModalCoBuyer = () => {
        this.setState({ isModalCoBuyerVisible: !this.state.isModalCoBuyerVisible });
    };

    toggleModalInsurance = () => {
        this.setState({ isModalInsuranceVisible: !this.state.isModalInsuranceVisible });
    };


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

    toggleModalPrint = () => {
        this.setState({ isModalPrintVisible: !this.state.isModalPrintVisible });
    };

    toggleModalContract = () => {
        this.setState({ isModalContractVisible: !this.state.isModalContractVisible });
    };

    step_previous() {
        if (this.state.screen2) {
            this.setState({ screen1: true, screen2: false, screen3: false, screen4: false, screen5: false, screen6: false, screen7: false })
        } else if (this.state.screen3) {
            this.setState({ screen1: false, screen2: true, screen3: false, screen4: false, screen5: false, screen6: false, screen7: false })
        } else if (this.state.screen4) {
            this.setState({ screen1: false, screen2: false, screen3: true, screen4: false, screen5: false, screen6: false, screen7: false })
        } else if (this.state.screen5) {
            this.setState({ screen1: false, screen2: false, screen3: false, screen4: true, screen5: false, screen6: false, screen7: false })
        } else if (this.state.screen6) {
            this.setState({ screen1: false, screen2: false, screen3: false, screen4: false, screen5: true, screen6: false, screen7: false })
        } else if (this.state.screen7) {
            this.setState({ screen1: false, screen2: false, screen3: false, screen4: false, screen5: false, screen6: true, screen7: false })
        }
    }

    step_next() {
        if (this.state.screen1) {
            if (this.state.inv_id == 0) {
                // this.setState({ error_inv_id: true });
                // return;
            } else this.setState({ error_inv_id: false, error_trade_inv_id: false });

            this.setState({ screen1: false, screen2: true, screen3: false, screen4: false, screen5: false, screen6: false, screen7: false })
        } else if (this.state.screen2) {
            if (this.state.inv_id == 0)
                if (this.state.trade_inv_id == 0) {
                    this.setState({ error_trade_inv_id: true });
                    return;
                } else this.setState({ error_trade_inv_id: false });

            this.setState({ screen1: false, screen2: false, screen3: true, screen4: false, screen5: false, screen6: false, screen7: false })
        } else if (this.state.screen3) {
            if (this.state.buyers_id == 0) {
                this.setState({ error_buyers_id: true });
                return;
            } else this.setState({ error_buyers_id: false });

            //save deal as processing
            this.insertdeal_processing()
            this.setState({ screen1: false, screen2: false, screen3: false, screen4: true, screen5: false, screen6: false, screen7: false })
        } else if (this.state.screen4) {
            this.setState({ screen1: false, screen2: false, screen3: false, screen4: false, screen5: true, screen6: false, screen7: false })
        } else if (this.state.screen5) {
            this.setState({ screen1: false, screen2: false, screen3: false, screen4: false, screen5: false, screen6: true, screen7: false })
        } else if (this.state.screen6) {
            this.getbuyerinvdata()
            // this.setState({ screen1: false, screen2: false, screen3: false, screen4: false, screen5: false, screen6: false, screen7: true })
        }
    }


    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('didFocus', () => {
            // The screen is focused
            // Call any action


            var vin = this.props.navigation.getParam('vin');
            var modelType = this.props.navigation.getParam('modelType');
            var transact_id = this.props.navigation.getParam('transact_id');

            if (modelType == 'SDModelInv') {
                this.setState({
                    isModalInventoryInfoVisible: true
                })
                this.getInventoryDataFromVIN(vin, 'inventory')
            } else if (modelType == 'SDModelTrade') {
                this.setState({
                    isModalTradeInfoVisible: true
                })
                this.getInventoryDataFromVIN(vin, 'trade')
            } else if (modelType == 'sdbuyer') {

                var imageurl = this.props.navigation.getParam('imageurl');
                this.setState({ isModalBuyerVisible: true })
                if (imageurl != "")
                    this.openocr(imageurl, 'sdbuyer')

            } else if (modelType == 'sdcobuyer') {

                var imageurl = this.props.navigation.getParam('imageurl');
                this.setState({ isModalCoBuyerVisible: true })
                if (imageurl != "")
                    this.openocr(imageurl, 'sdcobuyer')

            } else {
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
                        this.getInventoryList();
                        this.getTradeList();
                        this.getBuyerList();
                    })
                    .catch(err => alert("An error occurred"));

                this.setState({
                    isLoading: false,
                    isModalPrintVisible: false,
                    isModalContractVisible: false,
                    isModalInventoryScanVisible: false,
                    isModalInventoryInfoVisible: false,
                    isModalTradeScanVisible: false,
                    isModalTradeInfoVisible: false,
                    isModalBuyerVisible: false,
                    isModalCoBuyerVisible: false,
                    isModalInsuranceVisible: false,

                    screen1: true,
                    screen2: false,
                    screen3: false,
                    screen4: false,
                    screen5: false,
                    screen6: false,
                    screen7: false,
                    buyerUp: false,
                    inventoryUp: false,
                    tradeUp: false,
                    numbersUp: false,

                    selectedDDInv: "",
                    selectedDDTrade: "",
                    itemsInv: [],
                    itemsTrade: [],
                    itemsBuyers: [],

                    transact_id: '',
                    inv_id: '0', trade_inv_id: '0', buyers_id: '0', cobuyers_id: '0', insurance_buyers_id: '0',
                    inv_id_value: 'Pick vehicle', trade_inv_id_value: 'Pick vehicle', buyers_id_value: '', cobuyers_id_value: '', insurance_buyers_id_value: '',
                    error_inv_id: false, error_trade_inv_id: false, error_buyers_id: false, error_cobuyers_id: false, error_insurance_buyers_id: false,

                    //add inventory
                    inv_vin_model: '', errorinv_vin_model: false,
                    inv_vin: "", inv_year: "", inv_make: "", inv_model: "", inv_style: "", inv_stockNumber: "", inv_color: "", inv_mileage: "", inv_exempt: "unchecked", inv_cost: 0, inv_addedCost: 0, inv_totalCost: 0, inv_vehiclePrice: "",
                    errorinv_vin: false, errorinv_year: false, errorinv_make: false, errorinv_model: false, errorinv_style: false, errorinv_stockNumber: false, errorinv_color: false, errorinv_mileage: false, errorinv_cost: false, errorinv_addedCost: false, errorinv_vehiclePrice: false,

                    trade_inv_vin_model: '', errortrade_inv_vin_model: false,
                    trade_inv_vin: "", trade_inv_year: "", trade_inv_make: "", trade_inv_model: "", trade_inv_style: "", trade_inv_color: "", trade_inv_mileage: "", trade_inv_exempt: "unchecked", trade_inv_price: 0,
                    errortrade_inv_vin: false, errortrade_inv_year: false, errortrade_inv_make: false, errortrade_inv_model: false, errortrade_inv_style: false, errortrade_inv_color: false, errortrade_inv_mileage: false, errortrade_inv_price: false,

                    buyers_first_name: '', buyers_mid_name: '', buyers_last_name: '', buyers_address: '', buyers_city: '', buyers_state: '', buyers_zip: '', buyers_country: 'USA', buyers_email: '', buyers_work_phone: '', buyers_home_phone: '', buyers_mobile: '', dl_number: '', buyers_dl_state: '', buyers_dl_expire: '', buyers_dl_dob: '', buyers_tag_number: '',
                    errorbuyers_first_name: false, errorbuyers_mid_name: false, errorbuyers_last_name: false, errorbuyers_address: false, errorbuyers_city: false, errorbuyers_state: false, errorbuyers_zip: false, errorbuyers_country: false, errorbuyers_email: false, errorbuyers_work_phone: false, errorbuyers_home_phone: false, errorbuyers_mobile: false, errordl_number: false, errorbuyers_dl_state: false, errorbuyers_dl_expire: false, errorbuyers_dl_dob: false, errorbuyers_tag_number: false,

                    //add cobuyer
                    co_buyers_first_name: '', co_buyers_mid_name: '', co_buyers_last_name: '', co_buyers_address: '', co_buyers_city: '', co_buyers_state: '', co_buyers_zip: '', co_buyers_country: 'USA', co_buyers_email: '', co_buyers_work_phone: '', co_buyers_home_phone: '', co_buyers_mobile: '', dl_number: '', co_buyers_dl_state: '', co_buyers_dl_expire: '', co_buyers_dl_dob: '',
                    errorco_buyers_first_name: false, errorco_buyers_mid_name: false, errorco_buyers_last_name: false, errorco_buyers_address: false, errorco_buyers_city: false, errorco_buyers_state: false, errorco_buyers_zip: false, errorco_buyers_country: false, errorco_buyers_email: false, errorco_buyers_work_phone: false, errorco_buyers_home_phone: false, errorco_buyers_mobile: false, errordl_number: false, errorco_buyers_dl_state: false, errorco_buyers_dl_expire: false, errorco_buyers_dl_dob: false,

                    //add insurance
                    ins_company: '', ins_pol_num: '', ins_phone: '', ins_address: '', ins_city: '', ins_state: '', ins_zip: '', ins_agent: '',
                    errorins_company: false, errorins_pol_num: false, errorins_phone: false, errorins_address: false, errorins_city: false, errorins_state: false, errorins_zip: false, errorins_agent: false,

                    math_saleprice: '',
                    math_cashcredit: '',
                    math_tradecredit: '',
                    math_tavtprice: '',
                    math_taxdue: '',
                    math_totaldue: '',
                    taxrate: '',
                    servicefee: '',
                    tagregistration: '',

                    tax: 0, sub_due: 0, sub_due1: 0, sub_due2: 0,

                    errormath_saleprice: false,
                    errormath_cashcredit: false,
                    errormath_tradecredit: false,
                    errormath_tavtprice: false,
                    errortaxrate: false,
                    errorservicefee: false,
                    errortagregistration: false,

                    calc_amountToFinance: 0, calc_downpayment: 0, calc_loanLength: 0, calc_interestRate: 0,
                    error_calc_amountToFinance: false, error_calc_downpayment: false, error_calc_loanLength: false, error_calc_interestRate: false,
                    calc_monthlyPay: 0,
                    calc_biweeklyPay: 0,
                    calc_monthlytotalPayment: 0,
                    calc_biweeklytotalPayment: 0,
                    calc_totalInterest: 0,
                    calc_biweekly_interest: 0,
                    calc_cb_monthly: "checked",
                    calc_cb_biweekly: "unchecked",

                    //update main math
                    sd_main_math_saleprice: '', sd_main_math_cashcredit: 0, sd_main_math_tradecredit: 0, sd_main_math_taxdue: '', sd_main_math_totaldue: '', sd_main_math_servicefee: 0, sd_main_math_tagregistration: 0,
                    errorsd_main_math_saleprice: false, errorsd_main_math_cashcredit: false, errorsd_main_math_tradecredit: false, errorsd_main_math_taxdue: false, errorsd_main_math_totaldue: false, errorsd_main_math_servicefee: false, errorsd_main_math_tagregistration: false,

                    //update main buyer
                    sd_main_buyers_first_name: '', sd_main_buyers_mid_name: '', sd_main_buyers_last_name: '', sd_main_buyers_address: '', sd_main_buyers_city: '', sd_main_buyers_state: '', sd_main_buyers_zip: '', sd_main_buyers_country: 'USA', sd_main_buyers_email: '', sd_main_buyers_work_phone: '', sd_main_buyers_home_phone: '', sd_main_buyers_mobile: '', sd_main_dl_number: '', sd_main_buyers_dl_state: '', sd_main_buyers_dl_expire: '', sd_main_buyers_dl_dob: '', sd_main_buyers_tag_number: '',
                    errorsd_main_buyers_first_name: false, errorsd_main_buyers_mid_name: false, errorsd_main_buyers_last_name: false, errorsd_main_buyers_address: false, errorsd_main_buyers_city: false, errorsd_main_buyers_state: false, errorsd_main_buyers_zip: false, errorsd_main_buyers_country: false, errorsd_main_buyers_email: false, errorsd_main_buyers_work_phone: false, errorsd_main_buyers_home_phone: false, errorsd_main_buyers_mobile: false, errorsd_main_dl_number: false, errorsd_main_buyers_dl_state: false, errorsd_main_buyers_dl_expire: false, errorsd_main_buyers_dl_dob: false, errorsd_main_buyers_tag_number: false,

                    //update main inventory
                    sd_main_inv_vin: "", sd_main_inv_year: "", sd_main_inv_make: "", sd_main_inv_model: "", sd_main_inv_style: "", sd_main_inv_stockNumber: "", sd_main_inv_color: "", sd_main_inv_mileage: "", sd_main_inv_cost: 0, sd_main_inv_addedCost: 0, sd_main_inv_totalCost: 0, sd_main_inv_vehiclePrice: "",
                    errorsd_main_inv_vin: false, errorsd_main_inv_year: false, errorsd_main_inv_make: false, errorsd_main_inv_model: false, errorsd_main_inv_style: false, errorsd_main_inv_stockNumber: false, errorsd_main_inv_color: false, errorsd_main_inv_mileage: false, errorsd_main_inv_cost: false, errorsd_main_inv_addedCost: false, errorsd_main_inv_vehiclePrice: false,

                    //update main trade
                    sd_main_trade_inv_vin: "", sd_main_trade_inv_year: "", sd_main_trade_inv_make: "", sd_main_trade_inv_model: "", sd_main_trade_inv_style: "", sd_main_trade_inv_color: "", sd_main_trade_inv_mileage: "", sd_main_trade_inv_price: 0,
                    errorsd_main_trade_inv_vin: false, errorsd_main_trade_inv_year: false, errorsd_main_trade_inv_make: false, errorsd_main_trade_inv_model: false, errorsd_main_trade_inv_style: false, errorsd_main_trade_inv_color: false, errorsd_main_trade_inv_mileage: false, errorsd_main_trade_inv_price: false,

                    //bhph contract
                    sd_main_bhphcontract_cash_price: "", sd_main_bhphcontract_dealer_fee: "", sd_main_bhphcontract_taxes: "", sd_main_bhphcontract_cashdown: "", sd_main_bhphcontract_deferred_down: "", sd_main_bhphcontract_trade_allowance: "", sd_main_bhphcontract_title_fee: "", sd_main_bhphcontract_payment_amount: "", sd_main_bhphcontract_number_payments: "", sd_main_bhphcontract_interest_rate: "", sd_main_bhphcontract_total_payments: "", sd_main_bhphcontract_finance_charge: "", sd_main_bhphcontract_tot_finance_amt: "", sd_main_bhphcontract_tot_price_paid: "",
                    errorsd_main_bhphcontract_cash_price: false, errorsd_main_bhphcontract_dealer_fee: false, errorsd_main_bhphcontract_taxes: false, errorsd_main_bhphcontract_cashdown: false, errorsd_main_bhphcontract_deferred_down: false, errorsd_main_bhphcontract_trade_allowance: false, errorsd_main_bhphcontract_title_fee: false, errorsd_main_bhphcontract_payment_amount: false, errorsd_main_bhphcontract_number_payments: false, errorsd_main_bhphcontract_interest_rate: false, errorsd_main_bhphcontract_total_payments: false, errorsd_main_bhphcontract_finance_charge: false, errorsd_main_bhphcontract_tot_finance_amt: false, errorsd_main_bhphcontract_tot_price_paid: false,

                    sd_main_review_inv_detail: false,
                    sd_main_review_trade_inv_detail: false,

                    //print document
                    sd_main_readyprint_date: "",
                    sd_main_readyprint_chooseall: "unchecked",
                    sd_main_readyprint_billofsale: "unchecked",
                    sd_main_readyprint_title_application: "unchecked",
                    sd_main_readyprint_odometer_statement: "unchecked",
                    sd_main_readyprint_as_is: "unchecked",
                    sd_main_readyprint_proof_of_insurance: "unchecked",
                    sd_main_readyprint_power_of_attorney: "unchecked",
                    sd_main_readyprint_arbitration_agreement: "unchecked",
                    sd_main_readyprint_right_repossession: "unchecked",
                    sd_main_readyprint_ofac_statement: "unchecked",
                    sd_main_readyprint_privacy_information: "unchecked",
                    sd_main_readyprint_certificate_exemption: "unchecked",

                    //FLORIDA
                    sd_main_readyprint_customer_consent: "unchecked",
                    sd_main_readyprint_apc: "unchecked",
                    sd_main_readyprint_hope_scholarship_program: "unchecked",
                    sd_main_readyprint_federal_risk: "unchecked",
                    sd_main_readyprint_buyers_agreement: "unchecked",
                    sd_main_readyprint_sep_odometer_statement: "unchecked",
                    sd_main_readyprint_buyers_guide: "unchecked",
                    sd_main_readyprint_facts: "unchecked",
                    sd_main_readyprint_insurance_affidavit: "unchecked",
                    sd_main_readyprint_insurance_agreement: "unchecked",
                    sd_main_readyprint_installment_contract: "unchecked",
                    sd_main_readyprint_buyers_order: "unchecked",

                    //print BHPH Contract
                    sd_main_bhphcontract_date: "",
                    sd_main_bhphcontract_cb: "unchecked",
                    sd_main_bhphcontract_cash_price: "",
                    sd_main_bhphcontract_dealer_fee: "",
                    sd_main_bhphcontract_taxes: "",
                    sd_main_bhphcontract_cashdown: "",
                    sd_main_bhphcontract_deferred_down: "",
                    sd_main_bhphcontract_trade_allowance: "",
                    sd_main_bhphcontract_title_fee: "",
                    sd_main_bhphcontract_payment_amount: "",
                    sd_main_bhphcontract_number_payments: "",
                    sd_main_bhphcontract_interest_rate: "",
                    sd_main_bhphcontract_total_payments: "",
                    sd_main_bhphcontract_finance_charge: "",
                    sd_main_bhphcontract_tot_finance_amt: "",
                    sd_main_bhphcontract_tot_price_paid: "",
                    sd_main_bhphcontract_payment_scheduleFrom: "",
                    sd_main_bhphcontract_payment_scheduleTo: "",

                    errorsd_main_bhphcontract_cash_price: "",
                    errorsd_main_bhphcontract_dealer_fee: "",
                    errorsd_main_bhphcontract_taxes: "",
                    errorsd_main_bhphcontract_cashdown: "",
                    errorsd_main_bhphcontract_deferred_down: "",
                    errorsd_main_bhphcontract_trade_allowance: "",
                    errorsd_main_bhphcontract_title_fee: "",
                    errorsd_main_bhphcontract_payment_amount: "",
                    errorsd_main_bhphcontract_number_payments: "",
                    errorsd_main_bhphcontract_interest_rate: "",
                    errorsd_main_bhphcontract_total_payments: "",
                    errorsd_main_bhphcontract_finance_charge: "",
                    errorsd_main_bhphcontract_tot_finance_amt: "",
                    errorsd_main_bhphcontract_tot_price_paid: "",

                    transact_status: "",
                    btn_disable_dealprint: false,
                    btn_disable_dealcontract: false,
                    btn_disable_dealsave: false,
                    btn_disable_dealnotsave: false,

                })
            }

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

    onDropdownPress(array, key, type) {
        // console.log("hello " + this.state[array][key][type] + " " + type);
        this.setState({
            [type]: this.state[array][key][type],//ids
            ['error_' + type]: false,
            [type + '_value']: this.state[array][key].value
        });

        if (type == 'inv_id') {
            this.setState({ math_saleprice: this.state[array][key].vehicle_price })
            this.autocalculatersd(this.state[array][key].vehicle_price, 'math_saleprice')
        }
        if (type == 'trade_inv_id') {
            this.setState({ math_tradecredit: this.state[array][key].trade_inv_price })
            this.autocalculatersd(this.state[array][key].trade_inv_price, 'math_tradecredit')
        }

        if (type == "buyers_id") {
            if (this.state[array][key].co_buyers_first_name != "") {
                this.setState({
                    cobuyers_id: this.state[array][key][type],
                    cobuyers_id_value: this.state[array][key].co_buyers_first_name + " " + this.state[array][key].co_buyers_mid_name + " " + this.state[array][key].co_buyers_last_name
                })
            } else {
                this.setState({ cobuyers_id: "", cobuyers_id_value: "" })
            }
            if (this.state[array][key].ins_pol_num != "") {
                this.setState({
                    insurance_buyers_id: this.state[array][key][type],
                    insurance_buyers_id_value: this.state[array][key].ins_pol_num
                })
            } else {
                this.setState({ insurance_buyers_id: "", insurance_buyers_id_value: "" })
            }
        }
    }

    onStatePress(text, type) {
        this.setState({ [type]: text, ['error' + type]: false });
    }

    changeVINtext(text, type) {
        if (text.trim() != 0) {
            this.setState({ [type]: text, ["error" + type]: false });
        } else {
            this.setState({ [type]: text, ["error" + type]: true });
        }
    }

    onModelChangeText(text, type) {
        const re = /^[0-9\b]+$/;
        if (type == "inv_year" || type == "inv_cost" || type == "inv_addedCost" || type == "inv_mileage" || type == "inv_vehiclePrice" || type == "trade_inv_year" || type == "trade_inv_price" || type == "trade_inv_mileage" ||
            type == "sd_main_inv_year" || type == "sd_main_inv_cost" || type == "sd_main_inv_addedCost" || type == "sd_main_inv_mileage" || type == "sd_main_inv_vehiclePrice" || type == "sd_main_trade_inv_year" || type == "sd_main_trade_inv_price" || type == "sd_main_trade_inv_mileage") {
            if (text != "" && !re.test(text)) return false;
        }

        if (type == "buyers_zip" || type == "buyers_work_phone" || type == "buyers_home_phone" || type == "buyers_mobile" ||
            type == "sd_main_buyers_zip" || type == "sd_main_buyers_work_phone" || type == "sd_main_buyers_home_phone" || type == "sd_main_buyers_mobile") {
            if (text != "" && !re.test(text)) return false;
        }

        if (type == "co_buyers_zip" || type == "co_buyers_work_phone" || type == "co_buyers_home_phone" || type == "co_buyers_mobile") {
            if (text != "" && !re.test(text)) return false;
        }

        if (type == "sd_main_math_saleprice" || type == "sd_main_math_cashcredit" || type == "sd_main_math_tradecredit" || type == "sd_main_math_taxdue" ||
            type == "sd_main_math_totaldue" || type == "sd_main_math_servicefee" || type == "sd_main_math_tagregistration" ||
            type == "sd_main_bhphcontract_cash_price" || type == "sd_main_bhphcontract_dealer_fee" || type == "sd_main_bhphcontract_taxes" ||
            type == "sd_main_bhphcontract_cashdown" || type == "sd_main_bhphcontract_deferred_down" || type == "sd_main_bhphcontract_trade_allowance" ||
            type == "sd_main_bhphcontract_title_fee" || type == "sd_main_bhphcontract_payment_amount" || type == "sd_main_bhphcontract_number_payments" ||
            type == "sd_main_bhphcontract_interest_rate" || type == "sd_main_bhphcontract_total_payments" || type == "sd_main_bhphcontract_finance_charge" ||
            type == "sd_main_bhphcontract_tot_finance_amt" || type == "sd_main_bhphcontract_tot_price_paid") {



            var regex = new RegExp(/^[0-9-.\b]+$/)
            if (text != "" && !regex.test(text)) return false;

            try {
                var count = text.match(/\./g).length;
                if (count > 1) return false;
            } catch (error) {
                // console.log('Error ' + error)
            }
        }

        if (type == "buyers_work_phone" || type == "buyers_home_phone" || type == "buyers_mobile" ||
            type == "sd_main_buyers_work_phone" || type == "sd_main_buyers_home_phone" || type == "sd_main_buyers_mobile") {
            if (text.trim() != 0)
                this.setState({ [type]: text, errorbuyers_work_phone: false });
            else
                this.setState({ [type]: text, errorbuyers_work_phone: true });

        } else if (type == "co_buyers_work_phone" || type == "co_buyers_home_phone" || type == "co_buyers_mobile") {
            if (text.trim() != 0)
                this.setState({ [type]: text, errorco_buyers_work_phone: false });
            else
                this.setState({ [type]: text, errorco_buyers_work_phone: true });

        } else {
            if (text.trim() != 0 && type != "inv_addedCost" && type != "sd_main_inv_addedCost") {
                this.setState({ [type]: text, ['error' + type]: false });
            } else {
                this.setState({ [type]: text, ['error' + type]: true });
            }
        }

        // if (text.trim() != 0) {
        //     this.setState({ [type]: text, ["error" + type]: false });
        // } else {
        //     this.setState({ [type]: text, ["error" + type]: true });
        // }

        if (type == "inv_cost" || type == "sd_main_inv_cost") {
            const totalcost = (parseInt(text) + parseInt(this.state.inv_addedCost))
            this.setState({ inv_totalCost: totalcost + "" })
        }
        if (type == "inv_addedCost" || type == "sd_main_inv_addedCost") {

            if (text.trim() != "") {
                this.setState({ [type]: text, ['error' + type]: false });
            } else {
                this.setState({ [type]: text, ['error' + type]: true });
            }

            const totalcost = (parseInt(this.state.inv_cost) + parseInt(text))
            this.setState({ inv_totalCost: totalcost + "" })
        }

        if (type == "inv_vin") if (text.length >= 13) this.getInventoryDataFromVIN(text, 'inventory');
        if (type == "trade_inv_vin") if (text.length >= 13) this.getInventoryDataFromVIN(text, 'trade');
    }

    changeCheckBoxForExempt(statename, errorstatename) {
        if (this.state[statename] == 'unchecked')
            this.setState({
                [statename]: 'checked', [errorstatename]: false
            });
        else
            this.setState({
                [statename]: 'unchecked'
            })
    }

    changeCheckBox(statename, type) {

        if (type == "all") {

            if (this.state.userState == "FLORIDA") {

                if (this.state[statename] == 'unchecked')
                    this.setState({
                        [statename]: 'checked',
                        sd_main_readyprint_ofac_statement: "checked",
                        sd_main_readyprint_billofsale: "checked",
                        sd_main_readyprint_as_is: "checked",
                        sd_main_readyprint_customer_consent: "checked",
                        sd_main_readyprint_odometer_statement: "checked",
                        sd_main_readyprint_power_of_attorney: "checked",
                        sd_main_readyprint_apc: "checked",
                        sd_main_readyprint_hope_scholarship_program: "checked",
                        sd_main_readyprint_federal_risk: "checked",
                        sd_main_readyprint_right_repossession: "checked",
                        sd_main_readyprint_buyers_agreement: "checked",
                        sd_main_readyprint_arbitration_agreement: "checked",
                        sd_main_readyprint_sep_odometer_statement: "checked",
                        sd_main_readyprint_buyers_guide: "checked",
                        sd_main_readyprint_facts: "checked",
                        sd_main_readyprint_insurance_affidavit: "checked",
                        sd_main_readyprint_insurance_agreement: "checked",
                        sd_main_readyprint_installment_contract: "checked",
                        sd_main_readyprint_buyers_order: "checked"
                    })
                else
                    this.setState({
                        [statename]: 'unchecked',
                        sd_main_readyprint_ofac_statement: "unchecked",
                        sd_main_readyprint_billofsale: "unchecked",
                        sd_main_readyprint_as_is: "unchecked",
                        sd_main_readyprint_customer_consent: "unchecked",
                        sd_main_readyprint_odometer_statement: "unchecked",
                        sd_main_readyprint_power_of_attorney: "unchecked",
                        sd_main_readyprint_apc: "unchecked",
                        sd_main_readyprint_hope_scholarship_program: "unchecked",
                        sd_main_readyprint_federal_risk: "unchecked",
                        sd_main_readyprint_right_repossession: "unchecked",
                        sd_main_readyprint_buyers_agreement: "unchecked",
                        sd_main_readyprint_arbitration_agreement: "unchecked",
                        sd_main_readyprint_sep_odometer_statement: "unchecked",
                        sd_main_readyprint_buyers_guide: "unchecked",
                        sd_main_readyprint_facts: "unchecked",
                        sd_main_readyprint_insurance_affidavit: "unchecked",
                        sd_main_readyprint_insurance_agreement: "unchecked",
                        sd_main_readyprint_installment_contract: "unchecked",
                        sd_main_readyprint_buyers_order: "unchecked"
                    })

            } else if (this.state.userState == "TEXAS") {
                if (this.state[statename] == 'unchecked')

                    this.setState({
                        [statename]: 'checked',
                        sd_main_readyprint_app_title_registration: "checked",
                        sd_main_readyprint_billofsale: "checked",
                        sd_main_readyprint_installment_contract: "checked",
                        sd_main_readyprint_power_of_attorney: "checked",
                        sd_main_readyprint_buyers_guide: "checked",
                        sd_main_readyprint_loan_payment_schedule: "checked",
                        sd_main_readyprint_arbitration_agreement: "checked",
                        sd_main_readyprint_credit_reporting_disclosure: "checked",
                        sd_main_readyprint_facts: "checked",
                        sd_main_readyprint_airbags: "checked",
                        sd_main_readyprint_release_agreement: "checked",
                        sd_main_readyprint_odometer_statement: "checked",
                        sd_main_readyprint_api: "checked",
                        sd_main_readyprint_country_title_issurance: "checked",
                        sd_main_readyprint_authorization_letter: "checked",
                        sd_main_readyprint_electronic_payment_authorization: "checked",
                        sd_main_readyprint_do_not_sign: "checked",
                        sd_main_readyprint_receipt_downpayment: "checked",
                        sd_main_readyprint_buyer_information: "checked"
                    })
                else
                    this.setState({
                        [statename]: 'unchecked',
                        sd_main_readyprint_app_title_registration: "unchecked",
                        sd_main_readyprint_billofsale: "unchecked",
                        sd_main_readyprint_installment_contract: "unchecked",
                        sd_main_readyprint_power_of_attorney: "unchecked",
                        sd_main_readyprint_buyers_guide: "unchecked",
                        sd_main_readyprint_loan_payment_schedule: "unchecked",
                        sd_main_readyprint_arbitration_agreement: "unchecked",
                        sd_main_readyprint_credit_reporting_disclosure: "unchecked",
                        sd_main_readyprint_facts: "unchecked",
                        sd_main_readyprint_airbags: "unchecked",
                        sd_main_readyprint_release_agreement: "unchecked",
                        sd_main_readyprint_odometer_statement: "unchecked",
                        sd_main_readyprint_api: "unchecked",
                        sd_main_readyprint_country_title_issurance: "unchecked",
                        sd_main_readyprint_authorization_letter: "unchecked",
                        sd_main_readyprint_electronic_payment_authorization: "unchecked",
                        sd_main_readyprint_do_not_sign: "unchecked",
                        sd_main_readyprint_receipt_downpayment: "unchecked",
                        sd_main_readyprint_buyer_information: "unchecked"
                    })
            } else {

                if (this.state[statename] == 'unchecked')
                    this.setState({
                        [statename]: 'checked',
                        sd_main_readyprint_billofsale: "checked",
                        sd_main_readyprint_title_application: "checked",
                        sd_main_readyprint_odometer_statement: "checked",
                        sd_main_readyprint_as_is: "checked",
                        sd_main_readyprint_proof_of_insurance: "checked",
                        sd_main_readyprint_power_of_attorney: "checked",
                        sd_main_readyprint_arbitration_agreement: "checked",
                        sd_main_readyprint_right_repossession: "checked",
                        sd_main_readyprint_ofac_statement: "checked",
                        sd_main_readyprint_privacy_information: "checked",
                        sd_main_readyprint_certificate_exemption: "checked",
                    })
                else
                    this.setState({
                        [statename]: 'unchecked',
                        sd_main_readyprint_billofsale: "unchecked",
                        sd_main_readyprint_title_application: "unchecked",
                        sd_main_readyprint_odometer_statement: "unchecked",
                        sd_main_readyprint_as_is: "unchecked",
                        sd_main_readyprint_proof_of_insurance: "unchecked",
                        sd_main_readyprint_power_of_attorney: "unchecked",
                        sd_main_readyprint_arbitration_agreement: "unchecked",
                        sd_main_readyprint_right_repossession: "unchecked",
                        sd_main_readyprint_ofac_statement: "unchecked",
                        sd_main_readyprint_privacy_information: "unchecked",
                        sd_main_readyprint_certificate_exemption: "unchecked",
                    })

            }
        } else
            if (this.state[statename] == 'unchecked')
                this.setState({ [statename]: 'checked' })
            else
                this.setState({ [statename]: 'unchecked', sd_main_readyprint_chooseall: 'checked' ? 'unchecked' : 'checked' })


        if (statename == "calc_cb_monthly") {
            if (this.state[statename] == 'unchecked')
                this.setState({ [statename]: 'checked', calc_cb_biweekly: 'unchecked' })
        } else {
            if (this.state[statename] == 'unchecked')
                this.setState({ [statename]: 'checked', calc_cb_monthly: 'unchecked' })
        }
    }

    onChangeTextForCalc(text, type) {

        var regex = new RegExp(/^[0-9.\b]+$/)
        if (text != "" && !regex.test(text)) return false;

        try {
            var count = text.match(/\./g).length;
            if (count > 1) {
                return false;
            }
        } catch (error) {
            // console.log('Error ' + error)
        }
        if (text.trim() != 0) {
            this.setState({ [type]: text, ['error_' + type]: false });

        } else {
            this.setState({ [type]: text, ['error_' + type]: true });
        }
        try {
            if (type == 'calc_amountToFinance')
                if (text != '' && this.state.calc_loanLength != '' && this.state.calc_interestRate != '')
                    this.doCalculation(text, type)

            if (type == 'calc_loanLength')
                if (text != '' && this.state.calc_amountToFinance != '' && this.state.calc_interestRate != '')
                    this.doCalculation(text, type)

            if (type == 'calc_interestRate')
                if (text != '' && this.state.calc_amountToFinance != '' && this.state.calc_loanLength != '')
                    this.doCalculation(text, type)

            if (type == 'calc_downpayment')
                if (text != '' && this.state.calc_amountToFinance != '' && this.state.calc_loanLength != '')
                    this.doCalculation(text, type)
        } catch (error) {
            console.log('Error ' + error)
        }
    }

    onSelectLoanLenthPress(key, type) {
        this.setState({ [type]: loanLength[key].totalmonth, ['error_' + type]: false });
        try {
            this.doCalculation(loanLength[key].totalmonth, 'loanLength')
        } catch (error) {
            console.log('onSelectLoanLenthPress ' + error)
        }
    }

    doCalculation(text, type) {

        // if (this.state.calc_amountToFinance == "") {
        //     this.setState({ error_calc_amountToFinance: true, });
        // } else if (this.state.calc_loanLength == "") {
        //     this.setState({ error_calc_loanLength: true, });
        // } else 

        var prin1 = type == 'calc_amountToFinance' ? text : this.state.calc_amountToFinance;
        var Vpayextra = type == 'calc_downpayment' ? text : this.state.calc_downpayment;
        var numPmts1 = type == 'calc_loanLength' ? text : this.state.calc_loanLength;
        var rate = type == 'calc_interestRate' ? text == "" ? 0 : text : this.state.calc_interestRate;
        if (this.state.calc_amountToFinance == "") {
            this.setState({ error_calc_amountToFinance: true, });
        } else if (this.state.calc_loanLength == "") {
            this.setState({ error_calc_loanLength: true, });
        } else if (rate == "") {
            this.setState({ error_calc_interestRate: true, });
        } else {

            // console.log(prin1 + " " + Vpayextra + " " + numPmts1 + " " + rate)
            // var prin2 = type == 'amountToFinance' ? text : this.state.amountToFinance;

            var i = rate / 100.0;

            var i1 = i / 12;
            var i2 = i / 26;

            if (Vpayextra != "") {
                prin1 = prin1 - Vpayextra;
            }

            var pmt1 = this.computeMonthlyPayment(prin1, numPmts1, rate);
            this.setState({
                calc_monthlyPay: this.fns(pmt1, 2, 1, 1, 1),
                calc_monthlytotalPayment: this.fns(pmt1 * numPmts1, 2, 1, 1, 1),
            })
            // var pmt2 = (pmt1 / 2) + Number(Vpayextra);
            var pmt2 = (pmt1 / 2);
            var VbiwkPmt0 = pmt1 * 12 / 26;
            // $('#calc_result_biweekly_payment').text("$"+fns(VbiwkPmt0,2,1,1,1));

            this.setState({
                calc_biweeklyPay: this.fns(VbiwkPmt0, 2, 1, 1, 1),
            })

            var count = 0;
            var prin = prin1;
            var intPort = 0;
            var prinPort = 0;
            var accumInt = 0;

            while (prin > 0) {

                if ((parseInt(prin) + (parseInt(prin) * i)) > pmt2) {
                    intPort = prin * i2;
                    prinPort = pmt2 - intPort;
                    prin = prin - prinPort;
                    accumInt = accumInt + intPort;
                } else {
                    intPort = prin * i2;
                    prinPort = prin;
                    prin = prin - prinPort;
                    accumInt = accumInt + intPort;
                }

                count = count + 1;

            }

            var numPmts2 = count;

            var numPmts3 = Math.ceil(numPmts1 - (12 * numPmts2 / 26));

            var VmoInt = this.computeFixedInterestCost(prin1, rate, pmt1);
            // $('#calc_result_monthly_interest').text("$"+fns(VmoInt,2,1,1,1));

            var VbiwkInt = accumInt;
            // $('#calc_result_biweekly_interest').text("$"+fns(VbiwkInt,2,1,1,1));
            this.setState({
                calc_totalInterest: this.fns(VmoInt, 2, 1, 1, 1),
                calc_biweekly_interest: this.fns(VbiwkInt, 2, 1, 1, 1),
                calc_biweeklytotalPayment: this.fns(parseInt(prin1) + parseInt(VbiwkInt), 2, 1, 1, 1)
            })
        }
    }

    computeMonthlyPayment(prin, numPmts, intRate) {

        var pmtAmt = 0;

        if (intRate == 0) {
            pmtAmt = prin / numPmts;
        } else {
            intRate = intRate / 100.0 / 12;

            var pow = 1;
            for (var j = 0; j < numPmts; j++)
                pow = pow * (1 + intRate);

            pmtAmt = (prin * pow * intRate) / (pow - 1);

        }

        return pmtAmt;

    }

    fns(num, places, comma, type, show) {

        var sym_1 = "";
        var sym_2 = "";

        var isNeg = 0;

        if (num < 0) {
            num = num * -1;
            isNeg = 1;
        }

        var myDecFact = 1;
        var myPlaces = 0;
        var myZeros = "";
        while (myPlaces < places) {
            myDecFact = myDecFact * 10;
            myPlaces = Number(myPlaces) + Number(1);
            myZeros = myZeros + "0";
        }

        var onum = Math.round(num * myDecFact) / myDecFact;

        var integer = Math.floor(onum);
        var decimal = "";

        if (Math.ceil(onum) == integer) {
            decimal = myZeros;
        } else {
            decimal = Math.round((onum - integer) * myDecFact)
        }
        decimal = decimal.toString();
        if (decimal.length < places) {
            var fillZeroes = places - decimal.length;
            for (var z = 0; z < fillZeroes; z++) {
                decimal = "0" + decimal;
            }
        }

        if (places > 0) {
            decimal = "." + decimal;
        }

        var finNum = ""
        if (comma == 1) {
            integer = integer.toString();
            var tmpnum = "";
            var tmpinteger = "";
            var y = 0;

            for (var x = integer.length; x > 0; x--) {
                tmpnum = tmpnum + integer.charAt(x - 1);
                y = y + 1;
                if (y == 3 & x > 1) {
                    tmpnum = tmpnum + ",";
                    y = 0;
                }
            }

            for (var x = tmpnum.length; x > 0; x--) {
                tmpinteger = tmpinteger + tmpnum.charAt(x - 1);
            }


            finNum = tmpinteger + "" + decimal;
        } else {
            finNum = integer + "" + decimal;
        }

        if (isNeg == 1) {
            if (type == 1 && show == 1) {
                finNum = "-" + sym_1 + "" + finNum + "" + sym_2;
            } else {
                finNum = "-" + finNum;
            }

        } else {
            if (show == 1) {
                if (type == 1) {
                    finNum = sym_1 + "" + finNum + "" + sym_2;
                } else
                    if (type == 2) {
                        finNum = finNum + "%";
                    }

            }

        }

        return finNum;
    }

    computeFixedInterestCost(principal, intRate, pmtAmt) {

        var i = eval(intRate);
        i /= 100;
        i /= 12;

        var prin = eval(principal);
        var intPort = 0;
        var accumInt = 0;
        var prinPort = 0;
        var pmtCount = 0;
        var testForLast = 0;

        //CYCLES THROUGH EACH PAYMENT OF GIVEN DEBT
        while (prin > 0) {

            testForLast = (prin * (1 + i));

            if (pmtAmt < testForLast) {
                intPort = prin * i;
                accumInt = eval(accumInt) + eval(intPort);
                prinPort = eval(pmtAmt) - eval(intPort);
                prin = eval(prin) - eval(prinPort);
            } else {
                //DETERMINE FINAL PAYMENT AMOUNT
                intPort = prin * i;
                accumInt = eval(accumInt) + eval(intPort);
                prinPort = prin;
                prin = 0;
            }

            pmtCount = eval(pmtCount) + eval(1);

            if (pmtCount > 1000 || accumInt > 1000000000) {
                prin = 0;
            }

        }

        return accumInt;

    }

    addInventoryInfoScan() {
        if (this.state.inv_vin_model == "") {
            this.setState({ errorinv_vin_model: true });

        } else {
            // this.props.navigation.navigate('AddInventoryInfoScreen', { vin: this.state.vinText })
            this.setState({
                isModalInventoryScanVisible: !this.state.isModalInventoryScanVisible,
                isModalInventoryInfoVisible: true,
                inv_vin_model: "",
                errorinv_vin_model: false
            });
            this.getInventoryDataFromVIN(this.state.inv_vin_model, 'inventory')
        }
    }

    addTradeInfoScan() {
        if (this.state.trade_inv_vin_model == "") {
            this.setState({ errortrade_inv_vin_model: true });

        } else {
            // this.props.navigation.navigate('AddInventoryInfoScreen', { vin: this.state.vinText })
            this.setState({
                isModalTradeScanVisible: !this.state.isModalTradeScanVisible,
                isModalTradeInfoVisible: true,
                trade_inv_vin_model: "",
                errortrade_inv_vin_model: false
            });
            this.getInventoryDataFromVIN(this.state.trade_inv_vin_model, 'trade')
        }
    }

    autocalculatersd(text, type) {

        var regex = new RegExp(/^[0-9-.\b]+$/)
        if (text != "" && !regex.test(text)) return false;

        try {
            var count = text.match(/\./g).length;
            if (count > 1) return false;
        } catch (error) {
            // console.log('Error ' + error)
        }

        if (text.trim() != '') this.setState({ [type]: text, ['error' + type]: false });
        else this.setState({ [type]: text, ['error' + type]: true });

        var saleprice = type == 'math_saleprice' ? text : this.state.math_saleprice //sale_price
        var cashcredit = type == 'math_cashcredit' ? text : this.state.math_cashcredit//cash_credit
        var tradecredit = type == 'math_tradecredit' ? text : this.state.math_tradecredit//trade_credit
        // var tradebalance  = $("#sd_math_tradebalance").val();//trade_balance
        var taxrate = type == 'taxrate' ? text : this.state.taxrate
        var servicefee = type == 'servicefee' ? text : this.state.servicefee//dealer_fee
        var tagregistration = type == 'tagregistration' ? text : this.state.tagregistration//dmv
        var tavtprice = type == 'math_tavtprice' ? text : this.state.math_tavtprice

        var no1 = parseFloat(saleprice == '' ? 0 : saleprice);
        var no2 = parseFloat(cashcredit == '' ? 0 : cashcredit);
        var no3 = parseFloat(tradecredit == '' ? 0 : tradecredit);
        // var no4=parseFloat(tradebalance);
        var no5 = parseFloat(taxrate == '' ? 0 : taxrate);
        var no6 = parseFloat(servicefee == '' ? 0 : servicefee);
        var no7 = parseFloat(tagregistration == '' ? 0 : tagregistration);

        var tavtprice = no1 * 6.6 / 100;
        // $("#sd_math_tavtprice").val(tavtprice.toFixed(2));
        this.setState({ math_tavtprice: tavtprice.toFixed(2) })

        var no8 = parseFloat(tavtprice);

        var taxableAmount = no1 - no2 - no3
        var tax = tavtprice * no5 / 100
        // var tax = taxableAmount*no5/100
        var tax2 = tax.toFixed(2)
        // var totaldue = taxableAmount + tax + no6 + no7 + no8
        var totaldue = taxableAmount + tax + no6 + no7
        var no82 = totaldue.toFixed(2)

        var st1 = no1 - no3
        var st2 = st1 + no6
        var st3 = st2 + no7 + tax

        // $("#total_due").val(no82);//total_due
        // this.setState({ totaldue: no82 })

        // $("#tax").val(tax2);//tax
        this.setState({ tax: tax2 })

        this.setState({ sub_due: st1 })//sub_due
        this.setState({ sub_due1: st2 })//sub_due1
        this.setState({ sub_due2: st3 })//sub_due2

        this.setState({ math_taxdue: tax2 })
        this.setState({ math_totaldue: no82 })
        this.setState({ calc_amountToFinance: no82 })

        // $("#sd_calc_saleprice").val(no82);

    }

    openocr = async (profile_image, buyer_type) => {

        let localUri = profile_image;
        let filename = localUri.split('/').pop();

        // Infer the type of the image
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        const postData = new FormData();
        // postData.append('profile_image', Platform.OS === "android" ? profile_image : profile_image.replace("file://", ""));
        postData.append('file', { uri: localUri, name: filename, type });

        this.setState({ isLoading: true })

        fetch("https://app.nanonets.com/api/v2/OCR/Model/9c7bfa66-a059-4466-87eb-d8f562295879/LabelFile/", {
            method: "POST",
            headers: {
                Accept: 'multipart/form-data',
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Basic Z2tnb0FSb2oxcTJsUU45T0VkbkQxdkJZdjdLaWpsTnE6'
            },
            body: postData
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                // console.log(data);

                var buyername = "", buyers_address = "", buyers_state = "", buyers_city = "", buyers_zip = "", dl_number = "", buyers_dl_expire = "", buyers_dl_dob = "";
                var datas = data.result[0].prediction;
                for (let i = 0; i < datas.length; i++) {
                    // console.log(datas[i]);
                    if (datas[i].label == "Name") buyername = datas[i].ocr_text.replace(/[^A-Za-z]+/g, ' ').split(" ");
                    if (datas[i].label == "Address") {
                        try {
                            buyers_address = datas[i].ocr_text.split("\n")[0];
                            if (datas[i].ocr_text.split("\n").length > 1) buyers_city = datas[i].ocr_text.split("\n")[1].split(",")[0]
                            if (datas[i].ocr_text.split("\n").length > 1)
                                if (datas[i].ocr_text.split("\n")[1].split(",").length > 1)
                                    if (datas[i].ocr_text.split("\n")[1].split(",")[1].trim().split(" ").length > 1)
                                        buyers_zip = datas[i].ocr_text.split("\n")[1].split(",")[1].trim().split(" ")[1];
                        } catch (e) { }
                    }
                    if (datas[i].label == "State") buyers_state = datas[i].ocr_text;
                    if (datas[i].label == "License_No") dl_number = datas[i].ocr_text;
                    if (datas[i].label == "Expiry_Date") buyers_dl_expire = datas[i].ocr_text;
                    if (datas[i].label == "DOB") buyers_dl_dob = datas[i].ocr_text;
                }

                if (buyer_type == "sdbuyer") {
                    this.setState({
                        buyers_first_name: buyername[0],
                        buyers_mid_name: buyername[1],
                        buyers_last_name: buyername.length > 2 ? buyername[2] : '',
                        buyers_address: buyers_address,
                        buyers_city: buyers_city,
                        buyers_state: buyers_state.toUpperCase(),
                        buyers_zip: buyers_zip,
                        buyers_country: 'USA',
                        dl_number: dl_number,
                        buyers_dl_state: buyers_state.toUpperCase(),
                        buyers_dl_expire: buyers_dl_expire,
                        buyers_dl_dob: buyers_dl_dob,
                    })
                } else if (buyer_type == "sdcobuyer") {
                    this.setState({
                        co_buyers_first_name: buyername[0],
                        co_buyers_mid_name: buyername[1],
                        co_buyers_last_name: buyername.length > 2 ? buyername[2] : '',
                        co_buyers_address: buyers_address,
                        co_buyers_city: buyers_city,
                        co_buyers_state: buyers_state.toUpperCase(),
                        co_buyers_zip: buyers_zip,
                        co_buyers_country: 'USA',
                        co_buyers_dl_number: dl_number,
                        co_buyers_dl_state: buyers_state.toUpperCase(),
                        co_buyers_dl_expire: buyers_dl_expire,
                        co_buyers_dl_dob: buyers_dl_dob,
                    })
                }
                if (Platform.OS === 'android') {
                    ToastAndroid.show(data.message, ToastAndroid.SHORT);
                } else {
                    alert(data.message);
                }
            })
            .catch((error) => console.error(error))
            .finally(() => this.setState({ isLoading: false }));

    }

    async getInventoryDataFromVIN(vin, type) {
        this.setState({ isLoading: true });

        var data = {
            "format": 'json',
            "data": vin
        }

        var formBody = [];
        for (var property in data) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(data[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");

        // console.log(formBody);

        fetch("https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVINValuesBatch", {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: formBody
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                // console.log(data['Results']);
                if (data['Count'] == 0) {
                    //ToastAndroid.show(data['Message'], ToastAndroid.SHORT);
                }
                if (type == "inventory") {
                    this.setState({
                        inv_vin: vin,
                        inv_year: data['Results'][0]['ModelYear'] ? data['Results'][0]['ModelYear'] : '',
                        inv_make: data['Results'][0]['Make'] ? data['Results'][0]['Make'] : '',
                        inv_model: data['Results'][0]['Model'] ? data['Results'][0]['Model'] : '',
                        inv_style: data['Results'][0]['BodyClass'] ? data['Results'][0]['BodyClass'] : '',
                        inv_stockNumber: "", inv_color: "", inv_mileage: "", inv_cost: 0, inv_addedCost: 0, inv_totalCost: 0, inv_vehiclePrice: "",
                    })
                } else if (type == "trade") {
                    this.setState({
                        trade_inv_vin: vin,
                        trade_inv_year: data['Results'][0]['ModelYear'] ? data['Results'][0]['ModelYear'] : '',
                        trade_inv_make: data['Results'][0]['Make'] ? data['Results'][0]['Make'] : '',
                        trade_inv_model: data['Results'][0]['Model'] ? data['Results'][0]['Model'] : '',
                        trade_inv_style: data['Results'][0]['BodyClass'] ? data['Results'][0]['BodyClass'] : '',
                        trade_inv_color: "", trade_inv_mileage: "", trade_inv_price: "",
                    })
                }


            })
            .catch((error) => console.error(error))
            .finally(() => this.setState({ isLoading: false }));
    }

    async getInventoryList() {

        this.setState({ isLoading: true });
        this.setState({
            itemsInv: []
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
                            this.state.itemsInv.push({
                                inv_id: item.inv_id,
                                inv_vin: item.inv_vin,
                                inv_stock: item.inv_stock,
                                inv_year: item.inv_year,
                                total_cost: item.inv_flrc,
                                vehicle_price: item.inv_price,
                                value: item.inv_stock + " " + item.inv_year + " " + item.inv_make + " (" + item.inv_model + ") VIN " + item.inv_vin

                            })
                        ))
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

    async getTradeList() {

        // this.setState({ isLoading: true });
        this.setState({
            itemsTrade: []
        })
        var data = {
            "member_id": this.state.userid
        }
        fetch(API_URL + "tradelist", {
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
                            this.state.itemsTrade.push({
                                trade_inv_id: item.trade_inv_id,
                                trade_inv_vin: item.trade_inv_vin,
                                trade_inv_make: item.trade_inv_make,
                                trade_inv_model: item.trade_inv_model,
                                trade_inv_year: item.trade_inv_year,
                                trade_inv_price: item.trade_inv_price,
                                value: item.trade_inv_year + " " + item.trade_inv_make + " (" + item.trade_inv_model + ") VIN " + item.trade_inv_vin
                            })
                        ))
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
            .finally(() => null);
    }

    async getBuyerList() {

        this.setState({ isLoading: true });
        this.setState({
            itemsBuyers: []
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
                        data.data.map((item, key) => (
                            item.active == 0 &&
                            this.state.itemsBuyers.push({
                                buyers_id: item.buyers_id,
                                buyers_first_name: item.buyers_first_name,
                                buyers_mid_name: item.buyers_mid_name,
                                buyers_last_name: item.buyers_last_name,
                                value: item.buyers_first_name + " " + item.buyers_mid_name + " " + item.buyers_last_name,
                                co_buyers_first_name: item.co_buyers_first_name,
                                co_buyers_mid_name: item.co_buyers_mid_name,
                                co_buyers_last_name: item.co_buyers_last_name,
                                ins_pol_num: item.ins_pol_num,
                            })
                        ))
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

    async addInventoryInfo() {
        if (this.state.inv_vin == "") {
            this.setState({ errorinv_vin: true, });
            this.inv_vinTextInput.focus();
        } else if (this.state.inv_year == "") {
            this.setState({ errorinv_year: true, });
            this.inv_yearTextInput.focus();
        } else if (this.state.inv_make == "") {
            this.setState({ errorinv_make: true, });
            this.inv_makeTextInput.focus();
        } else if (this.state.inv_model == "") {
            this.setState({ errorinv_model: true, });
            this.inv_modelTextInput.focus();
        } else if (this.state.inv_style == "") {
            this.setState({ errorinv_style: true, });
            this.inv_styleTextInput.focus();
        } else if (this.state.inv_stockNumber == "") {
            this.setState({ errorinv_stockNumber: true, });
            this.inv_stockNumberTextInput.focus();
        } else if (this.state.inv_color == "") {
            this.setState({ errorinv_color: true, });
            this.inv_colorTextInput.focus();
        } else if (this.state.inv_exempt == "unchecked" && this.state.inv_mileage == "") {
            this.setState({ errorinv_mileage: true, });
            this.inv_mileageTextInput.focus();
        } else if (this.state.inv_cost == "") {
            this.setState({ errorinv_cost: true, });
            this.inv_costTextInput.focus();
        } else if (this.state.inv_addedCost == "") {
            this.setState({ errorinv_addedCost: true, });
            this.inv_addedCostTextInput.focus();
        } else if (this.state.inv_vehiclePrice == "") {
            this.setState({ errorinv_vehiclePrice: true, });
            this.inv_vehiclePriceTextInput.focus();
        } else {
            this.setState({ isLoading: true });
            var data = {
                "member_id": this.state.userid,
                "vin": this.state.inv_vin,
                "stocknumber": this.state.inv_stockNumber,
                "year": this.state.inv_year,
                "make": this.state.inv_make,
                "model": this.state.inv_model,
                "style": this.state.inv_style,
                "color": this.state.inv_color,
                "mileage": this.state.inv_mileage,
                "exempt": this.state.inv_exempt == "checked" ? 'yes' : 'no',
                "cost": this.state.inv_cost,
                "addedcost": this.state.inv_addedCost,
                "stickerprice": this.state.inv_vehiclePrice,
                "totalcost": this.state.inv_totalCost
            }
            fetch(API_URL + "addinventory", {
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
                        this.setState({ itemsInv: [] })
                        if (Platform.OS === 'android') {
                            ToastAndroid.show(data.message, ToastAndroid.SHORT);
                        } else {
                            alert(data.message);
                        }
                        data.data.map((item, key) => (
                            this.state.itemsInv.push({
                                inv_id: item.inv_id,
                                inv_vin: item.inv_vin,
                                inv_stock: item.inv_stock,
                                inv_year: item.inv_year,
                                total_cost: item.inv_flrc,
                                vehicle_price: item.inv_price,
                                value: item.inv_stock + " " + item.inv_year + " " + item.inv_make + " (" + item.inv_model + ") VIN " + item.inv_vin
                            })
                        ))
                        this.setState({
                            isModalInventoryInfoVisible: !this.state.isModalInventoryInfoVisible,
                            inv_id: this.state.itemsInv[0].inv_id,
                            inv_id_value: this.state.itemsInv[0].value,
                            error_inv_id: false,
                            inv_vin_model: '', errorinv_vin_model: false,
                            inv_vin: "", inv_year: "", inv_make: "", inv_model: "", inv_style: "", inv_stockNumber: "", inv_color: "", inv_mileage: "", inv_exempt: "unchecked", inv_cost: 0, inv_addedCost: 0, inv_totalCost: 0, inv_vehiclePrice: "",
                            errorinv_vin: false, errorinv_year: false, errorinv_make: false, errorinv_model: false, errorinv_style: false, errorinv_stockNumber: false, errorinv_color: false, errorinv_mileage: false, errorinv_cost: false, errorinv_addedCost: false, errorinv_vehiclePrice: false,
                            math_saleprice: this.state.itemsInv[0].inv_price,
                        });
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
    }

    async addTradeInfo() {
        if (this.state.trade_inv_vin == "") {
            this.setState({ errortrade_inv_vin: true, });
            this.trade_inv_vinTextInput.focus();
        } else if (this.state.trade_inv_year == "") {
            this.setState({ errortrade_inv_year: true, });
            this.trade_inv_yearTextInput.focus();
        } else if (this.state.trade_inv_make == "") {
            this.setState({ errortrade_inv_make: true, });
            this.trade_inv_makeTextInput.focus();
        } else if (this.state.trade_inv_model == "") {
            this.setState({ errortrade_inv_model: true, });
            this.trade_inv_modelTextInput.focus();
        } else if (this.state.trade_inv_style == "") {
            this.setState({ errortrade_inv_style: true, });
            this.trade_inv_styleTextInput.focus();
        } else if (this.state.trade_inv_color == "") {
            this.setState({ errortrade_inv_color: true, });
            this.trade_inv_colorTextInput.focus();
        } else if (this.state.trade_inv_exempt == "unchecked" && this.state.trade_inv_mileage == "") {
            this.setState({ errortrade_inv_mileage: true, });
            this.trade_inv_mileageTextInput.focus();
        } else if (this.state.trade_inv_price == "") {
            this.setState({ errortrade_inv_price: true, });
            this.trade_inv_priceTextInput.focus();
        } else {
            this.setState({ isLoading: true });
            var data = {
                "member_id": this.state.userid,
                "vin": this.state.trade_inv_vin,
                "year": this.state.trade_inv_year,
                "make": this.state.trade_inv_make,
                "model": this.state.trade_inv_model,
                "style": this.state.trade_inv_style,
                "color": this.state.trade_inv_color,
                "mileage": this.state.trade_inv_mileage,
                "exempt": this.state.trade_inv_exempt == "checked" ? 'yes' : 'no',
                "allowance": this.state.trade_inv_price,
            }
            fetch(API_URL + "addtrade", {
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
                        this.setState({ itemsTrade: [] })
                        if (Platform.OS === 'android') {
                            ToastAndroid.show(data.message, ToastAndroid.SHORT);
                        } else {
                            alert(data.message);
                        }
                        data.data.map((item, key) => (
                            this.state.itemsTrade.push({
                                trade_inv_id: item.trade_inv_id,
                                trade_inv_vin: item.trade_inv_vin,
                                trade_inv_year: item.trade_inv_year,
                                trade_inv_make: item.trade_inv_make,
                                trade_inv_model: item.trade_inv_model,
                                trade_inv_price: item.trade_inv_price,
                                value: item.trade_inv_year + " " + item.trade_inv_make + " (" + item.trade_inv_model + ") VIN " + item.trade_inv_vin
                            })
                        ))
                        this.setState({
                            isModalTradeInfoVisible: !this.state.isModalTradeInfoVisible,
                            trade_inv_id: this.state.itemsTrade[0].trade_inv_id,
                            trade_inv_id_value: this.state.itemsTrade[0].value,
                            trade_inv_vin_model: '', errortrade_inv_vin_model: false,
                            error_trade_inv_id: false,
                            trade_inv_vin: "", trade_inv_year: "", trade_inv_make: "", trade_inv_model: "", trade_inv_style: "", trade_inv_color: "", trade_inv_mileage: "", trade_inv_exempt: "unchecked", trade_inv_price: 0,
                            errortrade_inv_vin: false, errortrade_inv_year: false, errortrade_inv_make: false, errortrade_inv_model: false, errortrade_inv_style: false, errortrade_inv_color: false, errortrade_inv_mileage: false, errortrade_inv_price: false,
                            math_tradecredit: this.state.itemsTrade[0].trade_inv_price,
                        });

                        // console.log(this.state.itemsTrade[0].trade_inv_year + " " + this.state.itemsTrade[0].trade_inv_make + " (" + this.state.itemsTrade[0].trade_inv_model + ") VIN " + this.state.itemsTrade[0].trade_inv_vin)
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
    }

    async addBuyersInfo() {
        if (this.state.buyers_first_name == "") {
            this.setState({ errorbuyers_first_name: true, });
            this.buyers_first_nameTextInput.focus();
        } else if (this.state.buyers_last_name == "") {
            this.setState({ errorbuyers_last_name: true, });
            this.buyers_last_nameTextInput.focus();
        } else if (this.state.buyers_address == "") {
            this.setState({ errorbuyers_address: true, });
            this.buyers_addressTextInput.focus();
        } else if (this.state.buyers_city == "") {
            this.setState({ errorbuyers_city: true, });
            this.buyers_cityTextInput.focus();
        } else if (this.state.buyers_state == "") {
            this.setState({ errorbuyers_state: true, });
            this.buyers_stateTextInput.focus();
        } else if (this.state.buyers_zip == "") {
            this.setState({ errorbuyers_zip: true, });
            this.buyers_zipTextInput.focus();
        } else if (this.state.buyers_country == "") {
            this.setState({ errorbuyers_country: true, });
            this.buyers_countryTextInput.focus();
        } else if (this.state.buyers_email == "") {
            this.setState({ errorbuyers_email: true, });
            this.buyers_emailTextInput.focus();

        } else if (this.state.buyers_work_phone == "" && this.state.buyers_home_phone == "" && this.state.buyers_mobile == "") {
            this.setState({ errorbuyers_work_phone: true, });
            this.buyers_work_phoneTextInput.focus();

        } else if (this.state.dl_number == "") {
            this.setState({ errordl_number: true, });
            this.dl_numberTextInput.focus();
        } else if (this.state.buyers_dl_state == "") {
            this.setState({ errorbuyers_dl_state: true, });
            this.buyers_dl_stateTextInput.focus();
        } else {
            this.setState({ isLoading: true });
            var data = {
                "member_id": this.state.userid,
                "buyer_firstname": this.state.buyers_first_name,
                "buyer_middlename": this.state.buyers_mid_name,
                "buyer_lastname": this.state.buyers_last_name,
                "buyer_email": this.state.buyers_email,
                "buyer_address": this.state.buyers_address,
                "buyer_city": this.state.buyers_city,
                "buyer_country": this.state.buyers_country,
                "buyer_state": this.state.buyers_state,
                "buyer_zip": this.state.buyers_zip,
                "buyer_workphone": this.state.buyers_work_phone,
                "buyer_homephone": this.state.buyers_home_phone,
                "buyer_mobile": this.state.buyers_mobile,
                "buyer_dlnumber": this.state.dl_number,
                "buyer_dlstate": this.state.buyers_dl_state,
                "buyer_dlexpire": this.state.buyers_dl_expire,
                "buyer_dldob": this.state.buyers_dl_dob,
                "buyer_temp_tag_number": this.state.buyers_tag_number
            }

            fetch(API_URL + "addbuyer", {
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

                        this.setState({ itemsBuyers: [] })
                        if (Platform.OS === 'android') {
                            ToastAndroid.show(data.message, ToastAndroid.SHORT);
                        } else {
                            alert(data.message);
                        }

                        data.data.map((item, key) => (
                            this.state.itemsBuyers.push({
                                buyers_id: item.buyers_id,
                                buyers_first_name: item.buyers_first_name,
                                buyers_mid_name: item.buyers_mid_name,
                                buyers_last_name: item.buyers_last_name,
                                value: item.buyers_first_name + " " + item.buyers_mid_name + " " + item.buyers_last_name,
                                co_buyers_first_name: item.co_buyers_first_name,
                                co_buyers_mid_name: item.co_buyers_mid_name,
                                co_buyers_last_name: item.co_buyers_last_name,
                                ins_pol_num: item.ins_pol_num,
                            })
                        ))

                        this.setState({
                            isModalBuyerVisible: !this.state.isModalBuyerVisible,
                            buyers_id: this.state.itemsBuyers[0].buyers_id,
                            buyers_id_value: this.state.itemsBuyers[0].buyers_first_name + " " + this.state.itemsBuyers[0].buyers_mid_name + " " + this.state.itemsBuyers[0].buyers_last_name,
                            error_buyers_id: false,
                            buyers_first_name: '', buyers_mid_name: '', buyers_last_name: '', buyers_address: '', buyers_city: '', buyers_state: '', buyers_zip: '', buyers_country: 'USA', buyers_email: '', buyers_work_phone: '', buyers_home_phone: '', buyers_mobile: '', dl_number: '', buyers_dl_state: '', buyers_dl_expire: '', buyers_dl_dob: '', buyers_tag_number: '',
                            errorbuyers_first_name: false, errorbuyers_mid_name: false, errorbuyers_last_name: false, errorbuyers_address: false, errorbuyers_city: false, errorbuyers_state: false, errorbuyers_zip: false, errorbuyers_country: false, errorbuyers_email: false, errorbuyers_work_phone: false, errorbuyers_home_phone: false, errorbuyers_mobile: false, errordl_number: false, errorbuyers_dl_state: false, errorbuyers_dl_expire: false, errorbuyers_dl_dob: false, errorbuyers_tag_number: false,
                            cobuyers_id: this.state.itemsBuyers[0].buyers_id,
                            cobuyers_id_value: this.state.itemsBuyers[0].co_buyers_first_name + " " + this.state.itemsBuyers[0].co_buyers_mid_name + " " + this.state.itemsBuyers[0].co_buyers_last_name,
                            insurance_buyers_id: this.state.itemsBuyers[0].buyers_id,
                            insurance_buyers_id_value: this.state.itemsBuyers[0].ins_pol_num,
                        });

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
    }

    async addCoBuyersInfo() {
        if (this.state.co_buyers_first_name == "") {
            this.setState({ errorco_buyers_first_name: true, });
            this.co_buyers_first_nameTextInput.focus();
        } else if (this.state.co_buyers_last_name == "") {
            this.setState({ errorco_buyers_last_name: true, });
            this.co_buyers_last_nameTextInput.focus();
        } else if (this.state.co_buyers_address == "") {
            this.setState({ errorco_buyers_address: true, });
            this.co_buyers_addressTextInput.focus();
        } else if (this.state.co_buyers_city == "") {
            this.setState({ errorco_buyers_city: true, });
            this.co_buyers_cityTextInput.focus();
        } else if (this.state.co_buyers_state == "") {
            this.setState({ errorco_buyers_state: true, });
            this.co_buyers_stateTextInput.focus();
        } else if (this.state.co_buyers_zip == "") {
            this.setState({ errorco_buyers_zip: true, });
            this.co_buyers_zipTextInput.focus();
        } else if (this.state.co_buyers_country == "") {
            this.setState({ errorco_buyers_country: true, });
            this.co_buyers_countryTextInput.focus();
        } else if (this.state.co_buyers_email == "") {
            this.setState({ errorco_buyers_email: true, });
            this.co_buyers_emailTextInput.focus();


        } else if (this.state.co_buyers_work_phone == "" && this.state.co_buyers_home_phone == "" && this.state.co_buyers_mobile == "") {
            this.setState({ errorco_buyers_work_phone: true, });
            this.co_buyers_work_phoneTextInput.focus();

        } else if (this.state.co_buyers_dl_number == "") {
            this.setState({ errorco_buyers_dl_number: true, });
            this.co_buyers_dl_numberTextInput.focus();
        } else if (this.state.co_buyers_dl_state == "") {
            this.setState({ errorco_buyers_dl_state: true, });
            this.co_buyers_dl_stateTextInput.focus();

        } else {
            this.setState({ isLoading: true });
            var data = {
                "member_id": this.state.userid,
                "buyers_id": this.state.buyers_id,
                "cobuyer_firstname": this.state.co_buyers_first_name,
                "cobuyer_middlename": this.state.co_buyers_mid_name,
                "cobuyer_lastname": this.state.co_buyers_last_name,
                "cobuyer_email": this.state.co_buyers_email,
                "cobuyer_address": this.state.co_buyers_address,
                "cobuyer_city": this.state.co_buyers_city,
                "cobuyer_country": this.state.co_buyers_country,
                "cobuyer_state": this.state.co_buyers_state,
                "cobuyer_zip": this.state.co_buyers_zip,
                "cobuyer_workphone": this.state.co_buyers_work_phone,
                "cobuyer_homephone": this.state.co_buyers_home_phone,
                "cobuyer_mobile": this.state.co_buyers_mobile,
                "cobuyer_dlnumber": this.state.co_buyers_dl_number,
                "cobuyer_dlstate": this.state.co_buyers_dl_state,
                "cobuyer_dlexpire": this.state.co_buyers_dl_expire,
                "cobuyer_dldob": this.state.co_buyers_dl_dob
            }

            // console.log(data)
            fetch(API_URL + "addcobuyer", {
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
                        this.setState({ itemsBuyers: [] })
                        if (Platform.OS === 'android') {
                            ToastAndroid.show(data.message, ToastAndroid.SHORT);
                        } else {
                            alert(data.message);
                        }

                        data.data.map((item, key) => (
                            this.state.itemsBuyers.push({
                                buyers_id: item.buyers_id,
                                buyers_first_name: item.buyers_first_name,
                                buyers_mid_name: item.buyers_mid_name,
                                buyers_last_name: item.buyers_last_name,
                                value: item.buyers_first_name + " " + item.buyers_mid_name + " " + item.buyers_last_name,
                                co_buyers_first_name: item.co_buyers_first_name,
                                co_buyers_mid_name: item.co_buyers_mid_name,
                                co_buyers_last_name: item.co_buyers_last_name,
                                ins_pol_num: item.ins_pol_num,
                            })
                        ))

                        this.setState({
                            isModalCoBuyerVisible: !this.state.isModalCoBuyerVisible,
                            cobuyers_id: this.state.buyers_id,
                            cobuyers_id_value: this.state.co_buyers_first_name + " " + this.state.co_buyers_mid_name + " " + this.state.co_buyers_last_name,

                            co_buyers_first_name: '', co_buyers_mid_name: '', co_buyers_last_name: '', co_buyers_address: '', co_buyers_city: '', co_buyers_state: '', co_buyers_zip: '', co_buyers_country: 'USA', co_buyers_email: '', co_buyers_work_phone: '', co_buyers_home_phone: '', co_buyers_mobile: '', dl_number: '', co_buyers_dl_state: '', co_buyers_dl_expire: '', co_buyers_dl_dob: '',
                            errorco_buyers_first_name: false, errorco_buyers_mid_name: false, errorco_buyers_last_name: false, errorco_buyers_address: false, errorco_buyers_city: false, errorco_buyers_state: false, errorco_buyers_zip: false, errorco_buyers_country: false, errorco_buyers_email: false, errorco_buyers_work_phone: false, errorco_buyers_home_phone: false, errorco_buyers_mobile: false, errordl_number: false, errorco_buyers_dl_state: false, errorco_buyers_dl_expire: false, errorco_buyers_dl_dob: false,

                        });

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
    }

    async addInsuranceInfo() {
        if (this.state.ins_company == "") {
            this.setState({ error_ins_company: true, });
            this.ins_companyTextInput.focus();
        } else if (this.state.ins_pol_num == "") {
            this.ins_pol_numTextInput.focus();
            this.setState({ error_ins_pol_num: true, });
        } else if (this.state.ins_agent == "") {
            this.setState({ error_ins_agent: true, });
            this.ins_agentTextInput.focus();
        } else if (this.state.ins_phone == "") {
            this.setState({ error_ins_phone: true, });
            this.ins_phoneTextInput.focus();
        } else if (this.state.ins_address == "") {
            this.setState({ error_ins_address: true, });
            this.ins_addressTextInput.focus();
        } else if (this.state.ins_city == "") {
            this.setState({ error_ins_city: true, });
            this.ins_cityTextInput.focus();
        } else if (this.state.ins_state == "") {
            this.setState({ error_ins_state: true, });
            this.ins_stateTextInput.focus();
        } else if (this.state.ins_zip == "") {
            this.setState({ error_ins_zip: true, });
            this.ins_zipTextInput.focus();

        } else {
            this.setState({ isLoading: true });
            var data = {
                "member_id": this.state.userid,
                "buyers_id": this.state.buyers_id,
                "insurance_companyname": this.state.ins_company,
                "insurance_policynumber": this.state.ins_pol_num,
                "insurance_agentphone": this.state.ins_phone,
                "insurance_address": this.state.ins_address,
                "insurance_city": this.state.ins_city,
                "insurance_state": this.state.ins_state,
                "insurance_zip": this.state.ins_zip,
                "insurance_agentname": this.state.ins_agent
            }

            // console.log(data)
            fetch(API_URL + "addinsurance", {
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
                        this.setState({ itemsBuyers: [] })
                        if (Platform.OS === 'android') {
                            ToastAndroid.show(data.message, ToastAndroid.SHORT);
                        } else {
                            alert(data.message);
                        }

                        data.data.map((item, key) => (
                            this.state.itemsBuyers.push({
                                buyers_id: item.buyers_id,
                                buyers_first_name: item.buyers_first_name,
                                buyers_mid_name: item.buyers_mid_name,
                                buyers_last_name: item.buyers_last_name,
                                value: item.buyers_first_name + " " + item.buyers_mid_name + " " + item.buyers_last_name,
                                co_buyers_first_name: item.co_buyers_first_name,
                                co_buyers_mid_name: item.co_buyers_mid_name,
                                co_buyers_last_name: item.co_buyers_last_name,
                                ins_pol_num: item.ins_pol_num,
                            })
                        ))
                        this.setState({
                            isModalInsuranceVisible: !this.state.isModalInsuranceVisible,
                            insurance_buyers_id: this.state.buyers_id,
                            insurance_buyers_id_value: this.state.ins_pol_num,
                        });
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
    }

    async updatemathinfo() {

        if (this.state.math_saleprice == "") {
            this.setState({ errormath_saleprice: true, });
            this.math_salepriceTextInput.focus();
        } else if (this.state.math_tradecredit == "") {
            this.math_tradecreditTextInput.focus();
            this.setState({ errormath_tradecredit: true, });
        } else if (this.state.math_cashcredit == "") {
            this.setState({ errormath_cashcredit: true, });
            this.math_cashcreditTextInput.focus();
        } else if (this.state.servicefee == "") {
            this.setState({ errorservicefee: true, });
            this.servicefeeTextInput.focus();
        } else if (this.state.tagregistration == "") {
            this.setState({ errortagregistration: true, });
            this.tagregistrationTextInput.focus();
        } else if (this.state.taxrate == "") {
            this.setState({ errortaxrate: true, });
            this.taxrateTextInput.focus();
        } else {
            this.setState({ isLoading: true });
            var data = {
                buyers_id: this.state.buyers_id,
                sale_price: this.state.math_saleprice,
                trade_credit: this.state.math_tradecredit,
                cash_credit: this.state.math_cashcredit,
                tax: this.state.math_taxdue,
                dealer_fee: this.state.servicefee,
                dmv: this.state.tagregistration,
                total_due: this.state.math_totaldue,
                sub_due: this.state.sub_due,
                sub_due1: this.state.sub_due1,
                sub_due2: this.state.sub_due2,
            }

            fetch(API_URL + "updatemathinfo", {
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
                    if (data.status == "true") {
                        if (Platform.OS === 'android') {
                            ToastAndroid.show(data.message, ToastAndroid.SHORT);
                        } else {
                            alert(data.message);
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
    }

    async getbuyerinvdata() {

        this.setState({ isLoading: true });
        // this.setState({
        //     itemsBuyers: []
        // })
        var data = {
            "buyers_id": this.state.buyers_id,
            "inv_id": this.state.inv_id,
            "trade_inv_id": this.state.trade_inv_id,
            "cal_amount_finance": this.state.calc_amountToFinance,
            "cal_down_payment": this.state.calc_downpayment,
            "cal_monthly_payment": this.state.calc_monthlyPay,
            "cal_total_interest": this.state.calc_totalInterest,
            "bhph_months": this.state.calc_loanLength,
            "bhph_rate": this.state.calc_interestRate,
            "bhph_tpmts": this.state.calc_totalInterest,
        }
        // "cal_amount_finance":'',
        // "cal_down_payment":'',
        // "cal_monthly_payment":'',
        // "cal_total_interest":'',
        // "bhph_months":'',
        // "bhph_rate":'',
        // "bhph_tpmts":'',

        fetch(API_URL + "getbuyerinvdata", {
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
                        this.setState({ screen1: false, screen2: false, screen3: false, screen4: false, screen5: false, screen6: false, screen7: true })

                        this.setState({
                            //update main math
                            sd_main_math_saleprice: '', sd_main_math_cashcredit: 0, sd_main_math_tradecredit: 0, sd_main_math_taxdue: '', sd_main_math_totaldue: '', sd_main_math_servicefee: 0, sd_main_math_tagregistration: 0,
                            errorsd_main_math_saleprice: false, errorsd_main_math_cashcredit: false, errorsd_main_math_tradecredit: false, errorsd_main_math_taxdue: false, errorsd_main_math_totaldue: false, errorsd_main_math_servicefee: false, errorsd_main_math_tagregistration: false,
                            //update main buyer
                            sd_main_buyers_first_name: '', sd_main_buyers_mid_name: '', sd_main_buyers_last_name: '', sd_main_buyers_address: '', sd_main_buyers_city: '', sd_main_buyers_state: '', sd_main_buyers_zip: '', sd_main_buyers_country: 'USA', sd_main_buyers_email: '', sd_main_buyers_work_phone: '', sd_main_buyers_home_phone: '', sd_main_buyers_mobile: '', sd_main_dl_number: '', sd_main_buyers_dl_state: '', sd_main_buyers_dl_expire: '', sd_main_buyers_dl_dob: '', sd_main_buyers_tag_number: '',
                            errorsd_main_buyers_first_name: false, errorsd_main_buyers_mid_name: false, errorsd_main_buyers_last_name: false, errorsd_main_buyers_address: false, errorsd_main_buyers_city: false, errorsd_main_buyers_state: false, errorsd_main_buyers_zip: false, errorsd_main_buyers_country: false, errorsd_main_buyers_email: false, errorsd_main_buyers_work_phone: false, errorsd_main_buyers_home_phone: false, errorsd_main_buyers_mobile: false, errorsd_main_dl_number: false, errorsd_main_buyers_dl_state: false, errorsd_main_buyers_dl_expire: false, errorsd_main_buyers_dl_dob: false, errorsd_main_buyers_tag_number: false,
                            //update main inventory
                            sd_main_inv_vin: "", sd_main_inv_year: "", sd_main_inv_make: "", sd_main_inv_model: "", sd_main_inv_style: "", sd_main_inv_stockNumber: "", sd_main_inv_color: "", sd_main_inv_mileage: "", sd_main_inv_cost: 0, sd_main_inv_addedCost: 0, sd_main_inv_totalCost: 0, sd_main_inv_vehiclePrice: "",
                            errorsd_main_inv_vin: false, errorsd_main_inv_year: false, errorsd_main_inv_make: false, errorsd_main_inv_model: false, errorsd_main_inv_style: false, errorsd_main_inv_stockNumber: false, errorsd_main_inv_color: false, errorsd_main_inv_mileage: false, errorsd_main_inv_cost: false, errorsd_main_inv_addedCost: false, errorsd_main_inv_vehiclePrice: false,
                            //update main trade
                            sd_main_trade_inv_vin: "", sd_main_trade_inv_year: "", sd_main_trade_inv_make: "", sd_main_trade_inv_model: "", sd_main_trade_inv_style: "", sd_main_trade_inv_color: "", sd_main_trade_inv_mileage: "", sd_main_trade_inv_price: 0,
                            errorsd_main_trade_inv_vin: false, errorsd_main_trade_inv_year: false, errorsd_main_trade_inv_make: false, errorsd_main_trade_inv_model: false, errorsd_main_trade_inv_style: false, errorsd_main_trade_inv_color: false, errorsd_main_trade_inv_mileage: false, errorsd_main_trade_inv_price: false,
                            //bhph contract
                            sd_main_bhphcontract_cash_price: "", sd_main_bhphcontract_dealer_fee: "", sd_main_bhphcontract_taxes: "", sd_main_bhphcontract_cashdown: "", sd_main_bhphcontract_deferred_down: "", sd_main_bhphcontract_trade_allowance: "", sd_main_bhphcontract_title_fee: "", sd_main_bhphcontract_payment_amount: "", sd_main_bhphcontract_number_payments: "", sd_main_bhphcontract_interest_rate: "", sd_main_bhphcontract_total_payments: "", sd_main_bhphcontract_finance_charge: "", sd_main_bhphcontract_tot_finance_amt: "", sd_main_bhphcontract_tot_price_paid: "",
                            errorsd_main_bhphcontract_cash_price: false, errorsd_main_bhphcontract_dealer_fee: false, errorsd_main_bhphcontract_taxes: false, errorsd_main_bhphcontract_cashdown: false, errorsd_main_bhphcontract_deferred_down: false, errorsd_main_bhphcontract_trade_allowance: false, errorsd_main_bhphcontract_title_fee: false, errorsd_main_bhphcontract_payment_amount: false, errorsd_main_bhphcontract_number_payments: false, errorsd_main_bhphcontract_interest_rate: false, errorsd_main_bhphcontract_total_payments: false, errorsd_main_bhphcontract_finance_charge: false, errorsd_main_bhphcontract_tot_finance_amt: false, errorsd_main_bhphcontract_tot_price_paid: false,
                        })

                        this.setState({
                            sd_main_buyers_first_name: data.data[1].buyers_first_name,
                            sd_main_buyers_mid_name: data.data[1].buyers_mid_name,
                            sd_main_buyers_last_name: data.data[1].buyers_last_name,
                            sd_main_buyers_address: data.data[1].buyers_address,
                            sd_main_buyers_city: data.data[1].buyers_city,
                            sd_main_buyers_state: data.data[1].buyers_state,
                            sd_main_buyers_zip: data.data[1].buyers_zip,
                            sd_main_buyers_country: data.data[1].buyers_county,
                            sd_main_buyers_email: data.data[1].buyers_pri_email,
                            sd_main_buyers_work_phone: data.data[1].buyers_work_phone,
                            sd_main_buyers_home_phone: data.data[1].buyers_home_phone,
                            sd_main_buyers_mobile: data.data[1].buyers_pri_phone_cell,
                            sd_main_dl_number: data.data[1].buyers_DL_number,
                            sd_main_buyers_dl_state: data.data[1].buyers_DL_state,
                            sd_main_buyers_dl_expire: data.data[1].buyers_DL_expire,
                            sd_main_buyers_dl_dob: data.data[1].buyers_DL_dob,
                            sd_main_buyers_tag_number: data.data[1].buyers_temp_tag_number,

                        })

                        this.setState({
                            sd_main_math_saleprice: data.data[1].sale_price,
                            sd_main_math_cashcredit: data.data[1].cash_credit,
                            sd_main_math_tradecredit: data.data[1].trade_credit,
                            sd_main_math_taxdue: data.data[1].tax,
                            sd_main_math_totaldue: data.data[1].total_due,
                            sd_main_math_servicefee: data.data[1].dealer_fee,
                            sd_main_math_tagregistration: data.data[1].dmv,
                            tax: data.data[1].tax,
                            sub_due: data.data[1].sub_due,
                            sub_due1: data.data[1].sub_due1,
                            sub_due2: data.data[1].sub_due2,
                        })

                        this.setState({
                            //bhph contract
                            sd_main_bhphcontract_cash_price: data.data[1].sale_price,
                            sd_main_bhphcontract_dealer_fee: data.data[1].dealer_fee,
                            sd_main_bhphcontract_taxes: data.data[1].tax,
                            sd_main_bhphcontract_cashdown: data.data[1].cash_credit,
                            sd_main_bhphcontract_deferred_down: data.data[1].cal_down_payment,
                            sd_main_bhphcontract_trade_allowance: data.data[1].trade_credit,
                            sd_main_bhphcontract_title_fee: data.data[1].dmv,
                            sd_main_bhphcontract_payment_amount: data.data[1].cal_monthly_payment,
                            sd_main_bhphcontract_number_payments: data.data[1].bhph_months,
                            sd_main_bhphcontract_interest_rate: data.data[1].bhph_rate,
                            sd_main_bhphcontract_total_payments: data.data[1].bhph_tpmts,
                            sd_main_bhphcontract_finance_charge: data.data[1].cal_total_interest,
                            sd_main_bhphcontract_tot_finance_amt: data.data[1].cal_amount_finance,
                            sd_main_bhphcontract_tot_price_paid: parseFloat(data.data[1].cash_credit) + parseFloat(data.data[1].bhph_tpmts),
                        })



                        if (data.data[0].status == 'both') {

                            this.setState({
                                sd_main_inv_vin: data.data[2].inv_vin,
                                sd_main_inv_year: data.data[2].inv_year,
                                sd_main_inv_make: data.data[2].inv_make,
                                sd_main_inv_model: data.data[2].inv_model,
                                sd_main_inv_style: data.data[2].inv_style,
                                sd_main_inv_stockNumber: data.data[2].inv_stock,
                                sd_main_inv_color: data.data[2].inv_color,
                                sd_main_inv_mileage: data.data[2].inv_mileage,
                                sd_main_inv_cost: data.data[2].inv_cost,
                                sd_main_inv_addedCost: data.data[2].inv_addedcost,
                                sd_main_inv_totalCost: data.data[2].inv_flrc,
                                sd_main_inv_vehiclePrice: data.data[2].inv_price,
                            })

                            this.setState({
                                sd_main_trade_inv_vin: data.data[3].trade_inv_vin,
                                sd_main_trade_inv_year: data.data[3].trade_inv_year,
                                sd_main_trade_inv_make: data.data[3].trade_inv_make,
                                sd_main_trade_inv_model: data.data[3].trade_inv_model,
                                sd_main_trade_inv_style: data.data[3].trade_inv_style,
                                sd_main_trade_inv_color: data.data[3].trade_inv_color,
                                sd_main_trade_inv_mileage: data.data[3].trade_inv_mileage,
                                sd_main_trade_inv_price: data.data[3].trade_inv_price,
                            })

                            this.setState({
                                sd_main_review_inv_detail: true,
                                sd_main_review_trade_inv_detail: true,
                            })

                        } else if (data.data[0].status == 'inventory') {
                            this.setState({
                                sd_main_inv_vin: data.data[2].inv_vin,
                                sd_main_inv_year: data.data[2].inv_year,
                                sd_main_inv_make: data.data[2].inv_make,
                                sd_main_inv_model: data.data[2].inv_model,
                                sd_main_inv_style: data.data[2].inv_style,
                                sd_main_inv_stockNumber: data.data[2].inv_stock,
                                sd_main_inv_color: data.data[2].inv_color,
                                sd_main_inv_mileage: data.data[2].inv_mileage,
                                sd_main_inv_cost: data.data[2].inv_cost,
                                sd_main_inv_addedCost: data.data[2].inv_addedcost,
                                sd_main_inv_totalCost: data.data[2].inv_flrc,
                                sd_main_inv_vehiclePrice: data.data[2].inv_price,
                            })

                            this.setState({
                                sd_main_review_inv_detail: true,
                                sd_main_review_trade_inv_detail: false,
                            })
                        } else if (data.data[0].status == 'trade') {
                            this.setState({
                                sd_main_trade_inv_vin: data.data[2].trade_inv_vin,
                                sd_main_trade_inv_year: data.data[2].trade_inv_year,
                                sd_main_trade_inv_make: data.data[2].trade_inv_make,
                                sd_main_trade_inv_model: data.data[2].trade_inv_model,
                                sd_main_trade_inv_style: data.data[2].trade_inv_style,
                                sd_main_trade_inv_color: data.data[2].trade_inv_color,
                                sd_main_trade_inv_mileage: data.data[2].trade_inv_mileage,
                                sd_main_trade_inv_price: data.data[2].trade_inv_price,
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

    async updatebuyers_sd_main() {
        if (this.state.sd_main_buyers_first_name == "") {
            this.setState({ errorsd_main_buyers_first_name: true, });
            this.sd_main_buyers_first_nameTextInput.focus();
        } else if (this.state.sd_main_buyers_last_name == "") {
            this.setState({ errorsd_main_buyers_last_name: true, });
            this.sd_main_buyers_last_nameTextInput.focus();
        } else if (this.state.sd_main_buyers_address == "") {
            this.setState({ errorsd_main_buyers_address: true, });
            this.sd_main_buyers_addressTextInput.focus();
        } else if (this.state.sd_main_buyers_city == "") {
            this.setState({ errorsd_main_buyers_city: true, });
            this.sd_main_buyers_cityTextInput.focus();
        } else if (this.state.sd_main_buyers_state == "") {
            this.setState({ errorsd_main_buyers_state: true, });
            this.sd_main_buyers_stateTextInput.focus();
        } else if (this.state.sd_main_buyers_zip == "") {
            this.setState({ errorsd_main_buyers_zip: true, });
            this.sd_main_buyers_zipTextInput.focus();
        } else if (this.state.sd_main_buyers_country == "") {
            this.setState({ errorsd_main_buyers_country: true, });
            this.sd_main_buyers_countryTextInput.focus();
        } else if (this.state.sd_main_buyers_email == "") {
            this.setState({ errorsd_main_buyers_email: true, });
            this.sd_main_buyers_emailTextInput.focus();


        } else if (this.state.sd_main_buyers_work_phone == "" && this.state.sd_main_buyers_home_phone == "" && this.state.sd_main_buyers_mobile == "") {
            this.setState({ errorsd_main_buyers_work_phone: true, });
            this.sd_main_buyers_work_phoneTextInput.focus();
            // } else if (this.state.buyers_home_phone == "") {
            //     this.setState({ errorbuyers_home_phone: true, });
            //     this.buyers_home_phoneTextInput.focus();
            // } else if (this.state.buyers_mobile == "") {
            //     this.setState({ errorbuyers_mobile: true, });
            //     this.buyers_mobileTextInput.focus();



        } else if (this.state.sd_main_dl_number == "") {
            this.setState({ errorsd_main_dl_number: true, });
            this.sd_main_dl_numberTextInput.focus();
        } else if (this.state.sd_main_buyers_dl_state == "") {
            this.setState({ errorsd_main_buyers_dl_state: true, });
            this.sd_main_buyers_dl_stateTextInput.focus();
            // } else if (this.state.buyers_dl_expire == "") {
            //     this.setState({ errorbuyers_dl_expire: true, });
            // } else if (this.state.buyers_dl_dob == "") {
            //     this.setState({ errorbuyers_dl_dob: true, });
            // } else if (this.state.buyers_tag_number == "") {
            //     this.setState({ errorbuyers_tag_number: true, });
            //     this.buyers_tag_numberTextInput.focus();
        } else {
            this.setState({ isLoading: true });
            var data = {
                "buyers_id": this.state.buyers_id,
                "buyer_firstname": this.state.sd_main_buyers_first_name,
                "buyer_middlename": this.state.sd_main_buyers_mid_name,
                "buyer_lastname": this.state.sd_main_buyers_last_name,
                "buyer_email": this.state.sd_main_buyers_email,
                "buyer_address": this.state.sd_main_buyers_address,
                "buyer_city": this.state.sd_main_buyers_city,
                "buyer_country": this.state.sd_main_buyers_country,
                "buyer_state": this.state.sd_main_buyers_state,
                "buyer_zip": this.state.sd_main_buyers_zip,
                "buyer_workphone": this.state.sd_main_buyers_work_phone,
                "buyer_homephone": this.state.sd_main_buyers_home_phone,
                "buyer_mobile": this.state.sd_main_buyers_mobile,
                "buyer_dlnumber": this.state.sd_main_dl_number,
                "buyer_dlstate": this.state.sd_main_buyers_dl_state,
                "buyer_dlexpire": this.state.sd_main_buyers_dl_expire,
                "buyer_dldob": this.state.sd_main_buyers_dl_dob,
                "buyer_temp_tag_number": this.state.sd_main_buyers_tag_number
            }

            // console.log(data)
            fetch(API_URL + "editbuyer", {
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
                            ToastAndroid.show(data.message, ToastAndroid.SHORT);
                        } else {
                            alert(data.message);
                        }
                    }
                })
                .catch((error) => console.error(error))
                .finally(() => this.setState({ isLoading: false }));
        }
    }

    async updateinventory_sd_main() {

        if (this.state.sd_main_inv_vin == "") {
            this.setState({ errorsd_main_inv_vin: true, });
            this.sd_main_inv_vinTextInput.focus();
        } else if (this.state.sd_main_inv_year == "") {
            this.setState({ errorsd_main_inv_year: true, });
            this.sd_main_inv_yearTextInput.focus();
        } else if (this.state.sd_main_inv_make == "") {
            this.setState({ errorsd_main_inv_make: true, });
            this.sd_main_inv_makeTextInput.focus();
        } else if (this.state.sd_main_inv_model == "") {
            this.setState({ errorsd_main_inv_model: true, });
            this.sd_main_inv_modelTextInput.focus();
        } else if (this.state.sd_main_inv_style == "") {
            this.setState({ errorsd_main_inv_style: true, });
            this.sd_main_inv_styleTextInput.focus();
        } else if (this.state.sd_main_inv_stockNumber == "") {
            this.setState({ errorsd_main_inv_stockNumber: true, });
            this.sd_main_inv_stockNumberTextInput.focus();
        } else if (this.state.sd_main_inv_color == "") {
            this.setState({ errorsd_main_inv_color: true, });
            this.sd_main_inv_colorTextInput.focus();
        } else if (this.state.sd_main_inv_exempt == "unchecked" && this.state.sd_main_inv_mileage == "") {
            this.setState({ errorsd_main_inv_mileage: true, });
            this.sd_main_inv_mileageTextInput.focus();
        } else if (this.state.sd_main_inv_cost == "") {
            this.setState({ errorsd_main_inv_cost: true, });
            this.sd_main_inv_costTextInput.focus();
        } else if (this.state.sd_main_inv_addedCost == "") {
            this.setState({ errorsd_main_inv_addedCost: true, });
            this.sd_main_inv_addedCostTextInput.focus();
        } else if (this.state.sd_main_inv_vehiclePrice == "") {
            this.setState({ errorsd_main_inv_vehiclePrice: true, });
            this.sd_main_inv_vehiclePriceTextInput.focus();
        } else {
            this.setState({ isLoading: true });
            var data = {
                "inv_id": this.state.inv_id,
                "vin": this.state.sd_main_inv_vin,
                "stocknumber": this.state.sd_main_inv_stockNumber,
                "year": this.state.sd_main_inv_year,
                "make": this.state.sd_main_inv_make,
                "model": this.state.sd_main_inv_model,
                "style": this.state.sd_main_inv_style,
                "color": this.state.sd_main_inv_color,
                "mileage": this.state.sd_main_inv_mileage,
                "exempt": this.state.sd_main_inv_exempt == "checked" ? 'yes' : 'no',
                "cost": this.state.sd_main_inv_cost,
                "addedcost": this.state.sd_main_inv_addedCost,
                "stickerprice": this.state.sd_main_inv_vehiclePrice,
                "totalcost": this.state.sd_main_inv_totalCost
            }
            fetch(API_URL + "editinventory", {
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
                            ToastAndroid.show(data.message, ToastAndroid.SHORT);
                        } else {
                            alert(data.message);
                        }
                    }
                })
                .catch((error) => console.error(error))
                .finally(() => this.setState({ isLoading: false }));
        }
    }

    async updatetrade_sd_main() {
        if (this.state.sd_main_trade_inv_vin == "") {
            this.setState({ errorsd_main_trade_inv_vin: true, });
            this.sd_main_trade_inv_vinTextInput.focus();
        } else if (this.state.sd_main_trade_inv_year == "") {
            this.setState({ errorsd_main_trade_inv_year: true, });
            this.sd_main_trade_inv_yearTextInput.focus();
        } else if (this.state.sd_main_trade_inv_make == "") {
            this.setState({ errorsd_main_trade_inv_make: true, });
            this.sd_main_trade_inv_makeTextInput.focus();
        } else if (this.state.sd_main_trade_inv_model == "") {
            this.setState({ errorsd_main_trade_inv_model: true, });
            this.sd_main_trade_inv_modelTextInput.focus();
        } else if (this.state.sd_main_trade_inv_style == "") {
            this.setState({ errorsd_main_trade_inv_style: true, });
            this.sd_main_trade_inv_styleTextInput.focus();
        } else if (this.state.sd_main_trade_inv_color == "") {
            this.setState({ errorsd_main_trade_inv_color: true, });
            this.sd_main_trade_inv_colorTextInput.focus();
        } else if (this.state.sd_main_trade_inv_exempt == "unchecked" && this.state.sd_main_trade_inv_mileage == "") {
            this.setState({ errorsd_main_trade_inv_mileage: true, });
            this.sd_main_trade_inv_mileageTextInput.focus();
        } else if (this.state.sd_main_trade_inv_price == "") {
            this.setState({ errorsd_main_trade_inv_price: true, });
            this.sd_main_trade_inv_priceTextInput.focus();
        } else {
            this.setState({ isLoading: true });
            var data = {
                "trade_inv_id": this.state.trade_inv_id,
                "vin": this.state.sd_main_trade_inv_vin,
                "year": this.state.sd_main_trade_inv_year,
                "make": this.state.sd_main_trade_inv_make,
                "model": this.state.sd_main_trade_inv_model,
                "style": this.state.sd_main_trade_inv_style,
                "color": this.state.sd_main_trade_inv_color,
                "mileage": this.state.sd_main_trade_inv_mileage,
                "exempt": this.state.sd_main_trade_inv_exempt == "checked" ? 'yes' : 'no',
                "allowance": this.state.sd_main_trade_inv_price
            }
            fetch(API_URL + "edittrade", {
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
                            ToastAndroid.show(data.message, ToastAndroid.SHORT);
                        } else {
                            alert(data.message);
                        }
                    }
                })
                .catch((error) => console.error(error))
                .finally(() => this.setState({ isLoading: false }));
        }
    }

    async insertdeal_processing() {

        this.setState({ isLoading: true });

        var data = {
            "member_id": this.state.userid,
            "transact_id": this.state.transact_id,

            "inv_id": this.state.inv_id,
            "trade_inv_id": this.state.trade_inv_id,
            "buyers_id": this.state.buyers_id
        }

        fetch(API_URL + "insertdealprocessing", {
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
                    // ToastAndroid.show(data.message, ToastAndroid.SHORT);
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

    async insertdeal_save() {
        if (this.state.sd_main_buyers_first_name == "") {
            if (this.state.buyerUp == false) this.buyerToggle()
            this.setState({ errorsd_main_buyers_first_name: true, });
            this.sd_main_buyers_first_nameTextInput.focus();
        } else if (this.state.sd_main_buyers_last_name == "") {
            if (this.state.buyerUp == false) this.buyerToggle()
            this.setState({ errorsd_main_buyers_last_name: true, });
            this.sd_main_buyers_last_nameTextInput.focus();
        } else if (this.state.sd_main_buyers_address == "") {
            if (this.state.buyerUp == false) this.buyerToggle()
            this.setState({ errorsd_main_buyers_address: true, });
            this.sd_main_buyers_addressTextInput.focus();
        } else if (this.state.sd_main_buyers_city == "") {
            if (this.state.buyerUp == false) this.buyerToggle()
            this.setState({ errorsd_main_buyers_city: true, });
            this.sd_main_buyers_cityTextInput.focus();
        } else if (this.state.sd_main_buyers_state == "") {
            if (this.state.buyerUp == false) this.buyerToggle()
            this.setState({ errorsd_main_buyers_state: true, });
            this.sd_main_buyers_stateTextInput.focus();
        } else if (this.state.sd_main_buyers_zip == "") {
            if (this.state.buyerUp == false) this.buyerToggle()
            this.setState({ errorsd_main_buyers_zip: true, });
            this.sd_main_buyers_zipTextInput.focus();
        } else if (this.state.sd_main_buyers_country == "") {
            if (this.state.buyerUp == false) this.buyerToggle()
            this.setState({ errorsd_main_buyers_country: true, });
            this.sd_main_buyers_countryTextInput.focus();
        } else if (this.state.sd_main_buyers_email == "") {
            if (this.state.buyerUp == false) this.buyerToggle()
            this.setState({ errorsd_main_buyers_email: true, });
            this.sd_main_buyers_emailTextInput.focus();
        } else if (this.state.sd_main_buyers_work_phone == "" && this.state.sd_main_buyers_home_phone == "" && this.state.sd_main_buyers_mobile == "") {
            if (this.state.buyerUp == false) this.buyerToggle()
            this.setState({ errorsd_main_buyers_work_phone: true, });
            this.sd_main_buyers_work_phoneTextInput.focus();
        } else if (this.state.sd_main_dl_number == "") {
            if (this.state.buyerUp == false) this.buyerToggle()
            this.setState({ errorsd_main_dl_number: true, });
            this.sd_main_dl_numberTextInput.focus();
        } else if (this.state.sd_main_buyers_dl_state == "") {
            if (this.state.buyerUp == false) this.buyerToggle()
            this.setState({ errorsd_main_buyers_dl_state: true, });
            this.sd_main_buyers_dl_stateTextInput.focus();

        } else if (this.state.sd_main_inv_vin == "" && this.state.inv_id != 0) {
            if (this.state.inventoryUp == false) this.inventoryToggle()
            this.setState({ errorsd_main_inv_vin: true, });
            this.sd_main_inv_vinTextInput.focus();
        } else if (this.state.sd_main_inv_year == "" && this.state.inv_id != 0) {
            if (this.state.inventoryUp == false) this.inventoryToggle()
            this.setState({ errorsd_main_inv_year: true, });
            this.sd_main_inv_yearTextInput.focus();
        } else if (this.state.sd_main_inv_make == "" && this.state.inv_id != 0) {
            if (this.state.inventoryUp == false) this.inventoryToggle()
            this.setState({ errorsd_main_inv_make: true, });
            this.sd_main_inv_makeTextInput.focus();
        } else if (this.state.sd_main_inv_model == "" && this.state.inv_id != 0) {
            if (this.state.inventoryUp == false) this.inventoryToggle()
            this.setState({ errorsd_main_inv_model: true, });
            this.sd_main_inv_modelTextInput.focus();
        } else if (this.state.sd_main_inv_style == "" && this.state.inv_id != 0) {
            if (this.state.inventoryUp == false) this.inventoryToggle()
            this.setState({ errorsd_main_inv_style: true, });
            this.sd_main_inv_styleTextInput.focus();
        } else if (this.state.sd_main_inv_stockNumber == "" && this.state.inv_id != 0) {
            if (this.state.inventoryUp == false) this.inventoryToggle()
            this.setState({ errorsd_main_inv_stockNumber: true, });
            this.sd_main_inv_stockNumberTextInput.focus();
        } else if (this.state.sd_main_inv_color == "" && this.state.inv_id != 0) {
            if (this.state.inventoryUp == false) this.inventoryToggle()
            this.setState({ errorsd_main_inv_color: true, });
            this.sd_main_inv_colorTextInput.focus();
        } else if (this.state.sd_main_inv_exempt == "unchecked" && this.state.sd_main_inv_mileage == "" && this.state.inv_id != 0) {
            if (this.state.inventoryUp == false) this.inventoryToggle()
            this.setState({ errorsd_main_inv_mileage: true, });
            this.sd_main_inv_mileageTextInput.focus();
        } else if (this.state.sd_main_inv_cost == "" && this.state.inv_id != 0) {
            if (this.state.inventoryUp == false) this.inventoryToggle()
            this.setState({ errorsd_main_inv_cost: true, });
            this.sd_main_inv_costTextInput.focus();
        } else if (this.state.sd_main_inv_addedCost == "" && this.state.inv_id != 0) {
            if (this.state.inventoryUp == false) this.inventoryToggle()
            this.setState({ errorsd_main_inv_addedCost: true, });
            this.sd_main_inv_addedCostTextInput.focus();
        } else if (this.state.sd_main_inv_vehiclePrice == "" && this.state.inv_id != 0) {
            if (this.state.inventoryUp == false) this.inventoryToggle()
            this.setState({ errorsd_main_inv_vehiclePrice: true, });
            this.sd_main_inv_vehiclePriceTextInput.focus();

        } else if (this.state.sd_main_trade_inv_vin == "" && this.state.trade_inv_id != 0) {
            if (this.state.tradeUp == false) this.tradeToggle()
            this.setState({ errorsd_main_trade_inv_vin: true, });
            this.sd_main_trade_inv_vinTextInput.focus();
        } else if (this.state.sd_main_trade_inv_year == "" && this.state.trade_inv_id != 0) {
            if (this.state.tradeUp == false) this.tradeToggle()
            this.setState({ errorsd_main_trade_inv_year: true, });
            this.sd_main_trade_inv_yearTextInput.focus();
        } else if (this.state.sd_main_trade_inv_make == "" && this.state.trade_inv_id != 0) {
            if (this.state.tradeUp == false) this.tradeToggle()
            this.setState({ errorsd_main_trade_inv_make: true, });
            this.sd_main_trade_inv_makeTextInput.focus();
        } else if (this.state.sd_main_trade_inv_model == "" && this.state.trade_inv_id != 0) {
            if (this.state.tradeUp == false) this.tradeToggle()
            this.setState({ errorsd_main_trade_inv_model: true, });
            this.sd_main_trade_inv_modelTextInput.focus();
        } else if (this.state.sd_main_trade_inv_style == "" && this.state.trade_inv_id != 0) {
            if (this.state.tradeUp == false) this.tradeToggle()
            this.setState({ errorsd_main_trade_inv_style: true, });
            this.sd_main_trade_inv_styleTextInput.focus();
        } else if (this.state.sd_main_trade_inv_color == "" && this.state.trade_inv_id != 0) {
            if (this.state.tradeUp == false) this.tradeToggle()
            this.setState({ errorsd_main_trade_inv_color: true, });
            this.sd_main_trade_inv_colorTextInput.focus();
        } else if (this.state.sd_main_trade_inv_exempt == "unchecked" && this.state.sd_main_trade_inv_mileage == "" && this.state.trade_inv_id != 0) {
            if (this.state.tradeUp == false) this.tradeToggle()
            this.setState({ errorsd_main_trade_inv_mileage: true, });
            this.sd_main_trade_inv_mileageTextInput.focus();
        } else if (this.state.sd_main_trade_inv_price == "" && this.state.trade_inv_id != 0) {
            if (this.state.tradeUp == false) this.tradeToggle()
            this.setState({ errorsd_main_trade_inv_price: true, });
            this.sd_main_trade_inv_priceTextInput.focus();

        } else if (this.state.sd_main_math_saleprice == "") {
            if (this.state.numbersUp == false) this.numbersToggle()
            this.setState({ errorsd_main_math_saleprice: true, });
            this.sd_main_math_salepriceTextInput.focus();
        } else if (this.state.sd_main_math_cashcredit == "") {
            if (this.state.numbersUp == false) this.numbersToggle()
            this.setState({ errorsd_main_math_cashcredit: true, });
            this.sd_main_math_cashcreditTextInput.focus();
        } else if (this.state.sd_main_math_tradecredit == "") {
            if (this.state.numbersUp == false) this.numbersToggle()
            this.setState({ errorsd_main_math_tradecredit: true, });
            this.sd_main_math_tradecreditTextInput.focus();
        } else if (this.state.sd_main_math_servicefee == "") {
            if (this.state.numbersUp == false) this.numbersToggle()
            this.setState({ errorsd_main_math_servicefee: true, });
            this.sd_main_math_servicefeeTextInput.focus();
        } else if (this.state.sd_main_math_tagregistration == "") {
            if (this.state.numbersUp == false) this.numbersToggle()
            this.setState({ errorsd_main_math_tagregistration: true, });
            this.sd_main_math_tagregistrationTextInput.focus();
        } else if (this.state.sd_main_math_taxdue == "") {
            if (this.state.numbersUp == false) this.numbersToggle()
            this.setState({ errorsd_main_math_taxdue: true, });
            this.sd_main_math_taxdueTextInput.focus();
        } else if (this.state.sd_main_math_totaldue == "") {
            if (this.state.numbersUp == false) this.numbersToggle()
            this.setState({ errorsd_main_math_totaldue: true, });
            this.sd_main_math_totaldueTextInput.focus();
        } else {
            if (this.state.transact_id == "")
                this.isuserexpied()

            this.setState({ isLoading: true, btn_disable_dealsave: true });

            var data = {
                "member_id": this.state.userid,
                "transact_id": this.state.transact_id,

                "inv_id": this.state.inv_id,
                "trade_inv_id": this.state.trade_inv_id,
                "buyers_id": this.state.buyers_id,
                "cobuyers_id": this.state.cobuyers_id,
                "insurance_buyers_id": this.state.insurance_buyers_id,

                //update main buyer
                "buyers_firstname": this.state.sd_main_buyers_first_name,
                "buyers_middlename": this.state.sd_main_buyers_mid_name,
                "buyers_lastname": this.state.sd_main_buyers_last_name,
                "buyers_address": this.state.sd_main_buyers_address,
                "buyers_city": this.state.sd_main_buyers_city,
                "buyers_state": this.state.sd_main_buyers_state,
                "buyers_zip": this.state.sd_main_buyers_zip,
                // "sd_main_buyers_country": this.state.sd_main_buyers_country,
                "buyers_email": this.state.sd_main_buyers_email,
                "buyers_workphone": this.state.sd_main_buyers_work_phone,
                "buyers_homephone": this.state.sd_main_buyers_home_phone,
                "buyers_mobile": this.state.sd_main_buyers_mobile,
                "buyers_dlnumber": this.state.sd_main_dl_number,
                "buyers_dlstate": this.state.sd_main_buyers_dl_state,
                "buyers_dlexpire": this.state.sd_main_buyers_dl_expire,
                "buyers_dldob": this.state.sd_main_buyers_dl_dob,
                "buyers_temp_tag_number": this.state.sd_main_buyers_tag_number,

                //update main inventory
                "inventory_vin": this.state.sd_main_inv_vin,
                "inventory_year": this.state.sd_main_inv_year,
                "inventory_make": this.state.sd_main_inv_make,
                "inventory_model": this.state.sd_main_inv_model,
                "inventory_style": this.state.sd_main_inv_style,
                "inventory_stocknumber": this.state.sd_main_inv_stockNumber,
                "inventory_color": this.state.sd_main_inv_color,
                "inventory_mileage": this.state.sd_main_inv_mileage,
                "inventory_exempt": this.state.sd_main_inv_exempt == "checked" ? 'yes' : 'no',
                "inventory_cost": this.state.sd_main_inv_cost,
                "inventory_addedcost": this.state.sd_main_inv_addedCost,
                "inventory_totalcost": this.state.sd_main_inv_totalCost,
                "inventory_price": this.state.sd_main_inv_vehiclePrice,

                //update main trade
                "trade_vin": this.state.sd_main_trade_inv_vin,
                "trade_year": this.state.sd_main_trade_inv_year,
                "trade_make": this.state.sd_main_trade_inv_make,
                "trade_model": this.state.sd_main_trade_inv_model,
                "trade_style": this.state.sd_main_trade_inv_style,
                "trade_color": this.state.sd_main_trade_inv_color,
                "trade_mileage": this.state.sd_main_trade_inv_mileage,
                "trade_exempt": this.state.sd_main_trade_inv_exempt == "checked" ? 'yes' : 'no',
                "trade_allowance": this.state.sd_main_trade_inv_price,

                //update main math
                "saleprice": this.state.sd_main_math_saleprice,
                "cashcredit": this.state.sd_main_math_cashcredit,
                "tradecredit": this.state.sd_main_math_tradecredit,
                "tax": this.state.sd_main_math_taxdue,
                "servicefee": this.state.sd_main_math_servicefee,
                "tagregistration": this.state.sd_main_math_tagregistration,
                "total_due": this.state.sd_main_math_totaldue,
                "sub_due": this.state.sub_due,
                "sub_due1": this.state.sub_due1,
                "sub_due2": this.state.sub_due2
            }

            fetch(API_URL + "insertdealsave", {
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
                        this.props.navigation.navigate('YourdealScreen')
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

    }

    async insertdeal_print() {

        if (this.state.sd_main_buyers_first_name == "") {
            if (this.state.buyerUp == false) this.buyerToggle()
            this.setState({ errorsd_main_buyers_first_name: true, isModalPrintVisible: !this.state.isModalPrintVisible });
            this.sd_main_buyers_first_nameTextInput.focus();
        } else if (this.state.sd_main_buyers_last_name == "") {
            if (this.state.buyerUp == false) this.buyerToggle()
            this.setState({ errorsd_main_buyers_last_name: true, isModalPrintVisible: !this.state.isModalPrintVisible });
            this.sd_main_buyers_last_nameTextInput.focus();
        } else if (this.state.sd_main_buyers_address == "") {
            if (this.state.buyerUp == false) this.buyerToggle()
            this.setState({ errorsd_main_buyers_address: true, isModalPrintVisible: !this.state.isModalPrintVisible });
            this.sd_main_buyers_addressTextInput.focus();
        } else if (this.state.sd_main_buyers_city == "") {
            if (this.state.buyerUp == false) this.buyerToggle()
            this.setState({ errorsd_main_buyers_city: true, isModalPrintVisible: !this.state.isModalPrintVisible });
            this.sd_main_buyers_cityTextInput.focus();
        } else if (this.state.sd_main_buyers_state == "") {
            if (this.state.buyerUp == false) this.buyerToggle()
            this.setState({ errorsd_main_buyers_state: true, isModalPrintVisible: !this.state.isModalPrintVisible });
            this.sd_main_buyers_stateTextInput.focus();
        } else if (this.state.sd_main_buyers_zip == "") {
            if (this.state.buyerUp == false) this.buyerToggle()
            this.setState({ errorsd_main_buyers_zip: true, isModalPrintVisible: !this.state.isModalPrintVisible });
            this.sd_main_buyers_zipTextInput.focus();
        } else if (this.state.sd_main_buyers_country == "") {
            if (this.state.buyerUp == false) this.buyerToggle()
            this.setState({ errorsd_main_buyers_country: true, isModalPrintVisible: !this.state.isModalPrintVisible });
            this.sd_main_buyers_countryTextInput.focus();
        } else if (this.state.sd_main_buyers_email == "") {
            if (this.state.buyerUp == false) this.buyerToggle()
            this.setState({ errorsd_main_buyers_email: true, isModalPrintVisible: !this.state.isModalPrintVisible });
            this.sd_main_buyers_emailTextInput.focus();
        } else if (this.state.sd_main_buyers_work_phone == "" && this.state.sd_main_buyers_home_phone == "" && this.state.sd_main_buyers_mobile == "") {
            if (this.state.buyerUp == false) this.buyerToggle()
            this.setState({ errorsd_main_buyers_work_phone: true, isModalPrintVisible: !this.state.isModalPrintVisible });
            this.sd_main_buyers_work_phoneTextInput.focus();
        } else if (this.state.sd_main_dl_number == "") {
            if (this.state.buyerUp == false) this.buyerToggle()
            this.setState({ errorsd_main_dl_number: true, isModalPrintVisible: !this.state.isModalPrintVisible });
            this.sd_main_dl_numberTextInput.focus();
        } else if (this.state.sd_main_buyers_dl_state == "") {
            if (this.state.buyerUp == false) this.buyerToggle()
            this.setState({ errorsd_main_buyers_dl_state: true, isModalPrintVisible: !this.state.isModalPrintVisible });
            this.sd_main_buyers_dl_stateTextInput.focus();

        } else if (this.state.sd_main_inv_vin == "" && this.state.inv_id != 0) {
            if (this.state.inventoryUp == false) this.inventoryToggle()
            this.setState({ errorsd_main_inv_vin: true, isModalPrintVisible: !this.state.isModalPrintVisible });
            this.sd_main_inv_vinTextInput.focus();
        } else if (this.state.sd_main_inv_year == "" && this.state.inv_id != 0) {
            if (this.state.inventoryUp == false) this.inventoryToggle()
            this.setState({ errorsd_main_inv_year: true, isModalPrintVisible: !this.state.isModalPrintVisible });
            this.sd_main_inv_yearTextInput.focus();
        } else if (this.state.sd_main_inv_make == "" && this.state.inv_id != 0) {
            if (this.state.inventoryUp == false) this.inventoryToggle()
            this.setState({ errorsd_main_inv_make: true, isModalPrintVisible: !this.state.isModalPrintVisible });
            this.sd_main_inv_makeTextInput.focus();
        } else if (this.state.sd_main_inv_model == "" && this.state.inv_id != 0) {
            if (this.state.inventoryUp == false) this.inventoryToggle()
            this.setState({ errorsd_main_inv_model: true, isModalPrintVisible: !this.state.isModalPrintVisible });
            this.sd_main_inv_modelTextInput.focus();
        } else if (this.state.sd_main_inv_style == "" && this.state.inv_id != 0) {
            if (this.state.inventoryUp == false) this.inventoryToggle()
            this.setState({ errorsd_main_inv_style: true, isModalPrintVisible: !this.state.isModalPrintVisible });
            this.sd_main_inv_styleTextInput.focus();
        } else if (this.state.sd_main_inv_stockNumber == "" && this.state.inv_id != 0) {
            if (this.state.inventoryUp == false) this.inventoryToggle()
            this.setState({ errorsd_main_inv_stockNumber: true, isModalPrintVisible: !this.state.isModalPrintVisible });
            this.sd_main_inv_stockNumberTextInput.focus();
        } else if (this.state.sd_main_inv_color == "" && this.state.inv_id != 0) {
            if (this.state.inventoryUp == false) this.inventoryToggle()
            this.setState({ errorsd_main_inv_color: true, isModalPrintVisible: !this.state.isModalPrintVisible });
            this.sd_main_inv_colorTextInput.focus();
        } else if (this.state.sd_main_inv_exempt == "unchecked" && this.state.sd_main_inv_mileage == "" && this.state.inv_id != 0) {
            if (this.state.inventoryUp == false) this.inventoryToggle()
            this.setState({ errorsd_main_inv_mileage: true, isModalPrintVisible: !this.state.isModalPrintVisible });
            this.sd_main_inv_mileageTextInput.focus();
        } else if (this.state.sd_main_inv_cost == "" && this.state.inv_id != 0) {
            if (this.state.inventoryUp == false) this.inventoryToggle()
            this.setState({ errorsd_main_inv_cost: true, isModalPrintVisible: !this.state.isModalPrintVisible });
            this.sd_main_inv_costTextInput.focus();
        } else if (this.state.sd_main_inv_addedCost == "" && this.state.inv_id != 0) {
            if (this.state.inventoryUp == false) this.inventoryToggle()
            this.setState({ errorsd_main_inv_addedCost: true, isModalPrintVisible: !this.state.isModalPrintVisible });
            this.sd_main_inv_addedCostTextInput.focus();
        } else if (this.state.sd_main_inv_vehiclePrice == "" && this.state.inv_id != 0) {
            if (this.state.inventoryUp == false) this.inventoryToggle()
            this.setState({ errorsd_main_inv_vehiclePrice: true, isModalPrintVisible: !this.state.isModalPrintVisible });
            this.sd_main_inv_vehiclePriceTextInput.focus();

        } else if (this.state.sd_main_trade_inv_vin == "" && this.state.trade_inv_id != 0) {
            if (this.state.tradeUp == false) this.tradeToggle()
            this.setState({ errorsd_main_trade_inv_vin: true, isModalPrintVisible: !this.state.isModalPrintVisible });
            this.sd_main_trade_inv_vinTextInput.focus();
        } else if (this.state.sd_main_trade_inv_year == "" && this.state.trade_inv_id != 0) {
            if (this.state.tradeUp == false) this.tradeToggle()
            this.setState({ errorsd_main_trade_inv_year: true, isModalPrintVisible: !this.state.isModalPrintVisible });
            this.sd_main_trade_inv_yearTextInput.focus();
        } else if (this.state.sd_main_trade_inv_make == "" && this.state.trade_inv_id != 0) {
            if (this.state.tradeUp == false) this.tradeToggle()
            this.setState({ errorsd_main_trade_inv_make: true, isModalPrintVisible: !this.state.isModalPrintVisible });
            this.sd_main_trade_inv_makeTextInput.focus();
        } else if (this.state.sd_main_trade_inv_model == "" && this.state.trade_inv_id != 0) {
            if (this.state.tradeUp == false) this.tradeToggle()
            this.setState({ errorsd_main_trade_inv_model: true, isModalPrintVisible: !this.state.isModalPrintVisible });
            this.sd_main_trade_inv_modelTextInput.focus();
        } else if (this.state.sd_main_trade_inv_style == "" && this.state.trade_inv_id != 0) {
            if (this.state.tradeUp == false) this.tradeToggle()
            this.setState({ errorsd_main_trade_inv_style: true, isModalPrintVisible: !this.state.isModalPrintVisible });
            this.sd_main_trade_inv_styleTextInput.focus();
        } else if (this.state.sd_main_trade_inv_color == "" && this.state.trade_inv_id != 0) {
            if (this.state.tradeUp == false) this.tradeToggle()
            this.setState({ errorsd_main_trade_inv_color: true, isModalPrintVisible: !this.state.isModalPrintVisible });
            this.sd_main_trade_inv_colorTextInput.focus();
        } else if (this.state.sd_main_trade_inv_exempt == "unchecked" && this.state.sd_main_trade_inv_mileage == "" && this.state.trade_inv_id != 0) {
            if (this.state.tradeUp == false) this.tradeToggle()
            this.setState({ errorsd_main_trade_inv_mileage: true, isModalPrintVisible: !this.state.isModalPrintVisible });
            this.sd_main_trade_inv_mileageTextInput.focus();
        } else if (this.state.sd_main_trade_inv_price == "" && this.state.trade_inv_id != 0) {
            if (this.state.tradeUp == false) this.tradeToggle()
            this.setState({ errorsd_main_trade_inv_price: true, isModalPrintVisible: !this.state.isModalPrintVisible });
            this.sd_main_trade_inv_priceTextInput.focus();

        } else if (this.state.sd_main_math_saleprice == "") {
            if (this.state.numbersUp == false) this.numbersToggle()
            this.setState({ errorsd_main_math_saleprice: true, isModalPrintVisible: !this.state.isModalPrintVisible });
            this.sd_main_math_salepriceTextInput.focus();
        } else if (this.state.sd_main_math_cashcredit == "") {
            if (this.state.numbersUp == false) this.numbersToggle()
            this.setState({ errorsd_main_math_cashcredit: true, isModalPrintVisible: !this.state.isModalPrintVisible });
            this.sd_main_math_cashcreditTextInput.focus();
        } else if (this.state.sd_main_math_tradecredit == "") {
            if (this.state.numbersUp == false) this.numbersToggle()
            this.setState({ errorsd_main_math_tradecredit: true, isModalPrintVisible: !this.state.isModalPrintVisible });
            this.sd_main_math_tradecreditTextInput.focus();
        } else if (this.state.sd_main_math_servicefee == "") {
            if (this.state.numbersUp == false) this.numbersToggle()
            this.setState({ errorsd_main_math_servicefee: true, isModalPrintVisible: !this.state.isModalPrintVisible });
            this.sd_main_math_servicefeeTextInput.focus();
        } else if (this.state.sd_main_math_tagregistration == "") {
            if (this.state.numbersUp == false) this.numbersToggle()
            this.setState({ errorsd_main_math_tagregistration: true, isModalPrintVisible: !this.state.isModalPrintVisible });
            this.sd_main_math_tagregistrationTextInput.focus();
        } else if (this.state.sd_main_math_taxdue == "") {
            if (this.state.numbersUp == false) this.numbersToggle()
            this.setState({ errorsd_main_math_taxdue: true, isModalPrintVisible: !this.state.isModalPrintVisible });
            this.sd_main_math_taxdueTextInput.focus();
        } else if (this.state.sd_main_math_totaldue == "") {
            if (this.state.numbersUp == false) this.numbersToggle()
            this.setState({ errorsd_main_math_totaldue: true, isModalPrintVisible: !this.state.isModalPrintVisible });
            this.sd_main_math_totaldueTextInput.focus();
        } else {
            var data = {
                "member_id": this.state.userid,
                "transact_id": this.state.transact_id,

                "inv_id": this.state.inv_id,
                "trade_inv_id": this.state.trade_inv_id,
                "buyers_id": this.state.buyers_id,
                "cobuyers_id": this.state.cobuyers_id,
                "insurance_buyers_id": this.state.insurance_buyers_id,

                //update main buyer
                "buyers_firstname": this.state.sd_main_buyers_first_name,
                "buyers_middlename": this.state.sd_main_buyers_mid_name,
                "buyers_lastname": this.state.sd_main_buyers_last_name,
                "buyers_address": this.state.sd_main_buyers_address,
                "buyers_city": this.state.sd_main_buyers_city,
                "buyers_state": this.state.sd_main_buyers_state,
                "buyers_zip": this.state.sd_main_buyers_zip,
                // "sd_main_buyers_country": this.state.sd_main_buyers_country,
                "buyers_email": this.state.sd_main_buyers_email,
                "buyers_workphone": this.state.sd_main_buyers_work_phone,
                "buyers_homephone": this.state.sd_main_buyers_home_phone,
                "buyers_mobile": this.state.sd_main_buyers_mobile,
                "buyers_dlnumber": this.state.sd_main_dl_number,
                "buyers_dlstate": this.state.sd_main_buyers_dl_state,
                "buyers_dlexpire": this.state.sd_main_buyers_dl_expire,
                "buyers_dldob": this.state.sd_main_buyers_dl_dob,
                "buyers_temp_tag_number": this.state.sd_main_buyers_tag_number,

                //update main inventory
                "inventory_vin": this.state.sd_main_inv_vin,
                "inventory_year": this.state.sd_main_inv_year,
                "inventory_make": this.state.sd_main_inv_make,
                "inventory_model": this.state.sd_main_inv_model,
                "inventory_style": this.state.sd_main_inv_style,
                "inventory_stocknumber": this.state.sd_main_inv_stockNumber,
                "inventory_color": this.state.sd_main_inv_color,
                "inventory_mileage": this.state.sd_main_inv_mileage,
                "inventory_exempt": this.state.sd_main_inv_exempt == "checked" ? 'yes' : 'no',
                "inventory_cost": this.state.sd_main_inv_cost,
                "inventory_addedcost": this.state.sd_main_inv_addedCost,
                "inventory_totalcost": this.state.sd_main_inv_totalCost,
                "inventory_price": this.state.sd_main_inv_vehiclePrice,

                //update main trade
                "trade_vin": this.state.sd_main_trade_inv_vin,
                "trade_year": this.state.sd_main_trade_inv_year,
                "trade_make": this.state.sd_main_trade_inv_make,
                "trade_model": this.state.sd_main_trade_inv_model,
                "trade_style": this.state.sd_main_trade_inv_style,
                "trade_color": this.state.sd_main_trade_inv_color,
                "trade_mileage": this.state.sd_main_trade_inv_mileage,
                "trade_exempt": this.state.sd_main_trade_inv_exempt == "checked" ? 'yes' : 'no',
                "trade_allowance": this.state.sd_main_trade_inv_price,

                //update main math
                "saleprice": this.state.sd_main_math_saleprice,
                "cashcredit": this.state.sd_main_math_cashcredit,
                "tradecredit": this.state.sd_main_math_tradecredit,
                "tax": this.state.sd_main_math_taxdue,
                "servicefee": this.state.sd_main_math_servicefee,
                "tagregistration": this.state.sd_main_math_tagregistration,
                "total_due": this.state.sd_main_math_totaldue,
                "sub_due": this.state.sub_due,
                "sub_due1": this.state.sub_due1,
                "sub_due2": this.state.sub_due2,

                //deal print
                "sd_main_readyprint_date": this.state.sd_main_readyprint_date,
                "chooseall": this.state.sd_main_readyprint_chooseall == "checked" ? "yes" : "",

                "sd_main_readyprint_billofsale": this.state.sd_main_readyprint_billofsale == "checked" ? "yes" : "",
                "sd_main_readyprint_title_application": this.state.sd_main_readyprint_title_application == "checked" ? "yes" : "",
                "sd_main_readyprint_odometer_statement": this.state.sd_main_readyprint_odometer_statement == "checked" ? "yes" : "",
                "sd_main_readyprint_as_is": this.state.sd_main_readyprint_as_is == "checked" ? "yes" : "",
                "sd_main_readyprint_proof_of_insurance": this.state.sd_main_readyprint_proof_of_insurance == "checked" ? "yes" : "",
                "sd_main_readyprint_power_of_attorney": this.state.sd_main_readyprint_power_of_attorney == "checked" ? "yes" : "",
                "sd_main_readyprint_arbitration_agreement": this.state.sd_main_readyprint_arbitration_agreement == "checked" ? "yes" : "",
                "sd_main_readyprint_right_repossession": this.state.sd_main_readyprint_right_repossession == "checked" ? "yes" : "",
                "sd_main_readyprint_ofac_statement": this.state.sd_main_readyprint_ofac_statement == "checked" ? "yes" : "",
                "sd_main_readyprint_privacy_information": this.state.sd_main_readyprint_privacy_information == "checked" ? "yes" : "",
                "sd_main_readyprint_certificate_exemption": this.state.sd_main_readyprint_certificate_exemption == "checked" ? "yes" : "",

                "document_type": "print"

            }
            var dataFlorida = {
                "member_id": this.state.userid,
                "transact_id": this.state.transact_id,

                "inv_id": this.state.inv_id,
                "trade_inv_id": this.state.trade_inv_id,
                "buyers_id": this.state.buyers_id,
                "cobuyers_id": this.state.cobuyers_id,
                "insurance_buyers_id": this.state.insurance_buyers_id,

                //update main buyer
                "buyers_firstname": this.state.sd_main_buyers_first_name,
                "buyers_middlename": this.state.sd_main_buyers_mid_name,
                "buyers_lastname": this.state.sd_main_buyers_last_name,
                "buyers_address": this.state.sd_main_buyers_address,
                "buyers_city": this.state.sd_main_buyers_city,
                "buyers_state": this.state.sd_main_buyers_state,
                "buyers_zip": this.state.sd_main_buyers_zip,
                // "sd_main_buyers_country": this.state.sd_main_buyers_country,
                "buyers_email": this.state.sd_main_buyers_email,
                "buyers_workphone": this.state.sd_main_buyers_work_phone,
                "buyers_homephone": this.state.sd_main_buyers_home_phone,
                "buyers_mobile": this.state.sd_main_buyers_mobile,
                "buyers_dlnumber": this.state.sd_main_dl_number,
                "buyers_dlstate": this.state.sd_main_buyers_dl_state,
                "buyers_dlexpire": this.state.sd_main_buyers_dl_expire,
                "buyers_dldob": this.state.sd_main_buyers_dl_dob,
                "buyers_temp_tag_number": this.state.sd_main_buyers_tag_number,

                //update main inventory
                "inventory_vin": this.state.sd_main_inv_vin,
                "inventory_year": this.state.sd_main_inv_year,
                "inventory_make": this.state.sd_main_inv_make,
                "inventory_model": this.state.sd_main_inv_model,
                "inventory_style": this.state.sd_main_inv_style,
                "inventory_stocknumber": this.state.sd_main_inv_stockNumber,
                "inventory_color": this.state.sd_main_inv_color,
                "inventory_mileage": this.state.sd_main_inv_mileage,
                "inventory_exempt": this.state.sd_main_inv_exempt == "checked" ? 'yes' : 'no',
                "inventory_cost": this.state.sd_main_inv_cost,
                "inventory_addedcost": this.state.sd_main_inv_addedCost,
                "inventory_totalcost": this.state.sd_main_inv_totalCost,
                "inventory_price": this.state.sd_main_inv_vehiclePrice,

                //update main trade
                "trade_vin": this.state.sd_main_trade_inv_vin,
                "trade_year": this.state.sd_main_trade_inv_year,
                "trade_make": this.state.sd_main_trade_inv_make,
                "trade_model": this.state.sd_main_trade_inv_model,
                "trade_style": this.state.sd_main_trade_inv_style,
                "trade_color": this.state.sd_main_trade_inv_color,
                "trade_mileage": this.state.sd_main_trade_inv_mileage,
                "trade_exempt": this.state.sd_main_trade_inv_exempt == "checked" ? 'yes' : 'no',
                "trade_allowance": this.state.sd_main_trade_inv_price,

                //update main math
                "saleprice": this.state.sd_main_math_saleprice,
                "cashcredit": this.state.sd_main_math_cashcredit,
                "tradecredit": this.state.sd_main_math_tradecredit,
                "tax": this.state.sd_main_math_taxdue,
                "servicefee": this.state.sd_main_math_servicefee,
                "tagregistration": this.state.sd_main_math_tagregistration,
                "total_due": this.state.sd_main_math_totaldue,
                "sub_due": this.state.sub_due,
                "sub_due1": this.state.sub_due1,
                "sub_due2": this.state.sub_due2,

                //deal print
                "sd_main_readyprint_date": this.state.sd_main_readyprint_date,
                "chooseall": this.state.sd_main_readyprint_chooseall == "checked" ? "yes" : "",

                "sd_main_readyprint_ofac_statement": this.state.sd_main_readyprint_ofac_statement == "checked" ? "yes" : "",
                "sd_main_readyprint_billofsale": this.state.sd_main_readyprint_billofsale == "checked" ? "yes" : "",
                "sd_main_readyprint_as_is": this.state.sd_main_readyprint_as_is == "checked" ? "yes" : "",
                "sd_main_readyprint_customer_consent": this.state.sd_main_readyprint_customer_consent == "checked" ? "yes" : "",
                "sd_main_readyprint_odometer_statement": this.state.sd_main_readyprint_odometer_statement == "checked" ? "yes" : "",
                "sd_main_readyprint_power_of_attorney": this.state.sd_main_readyprint_power_of_attorney == "checked" ? "yes" : "",
                "sd_main_readyprint_apc": this.state.sd_main_readyprint_apc == "checked" ? "yes" : "",
                "sd_main_readyprint_hope_scholarship_program": this.state.sd_main_readyprint_hope_scholarship_program == "checked" ? "yes" : "",
                "sd_main_readyprint_federal_risk": this.state.sd_main_readyprint_federal_risk == "checked" ? "yes" : "",
                "sd_main_readyprint_repossession": this.state.sd_main_readyprint_right_repossession == "checked" ? "yes" : "",
                "sd_main_readyprint_buyers_agreement": this.state.sd_main_readyprint_buyers_agreement == "checked" ? "yes" : "",
                "sd_main_readyprint_arbitration_agreement": this.state.sd_main_readyprint_arbitration_agreement == "checked" ? "yes" : "",
                "sd_main_readyprint_sep_odometer_statement": this.state.sd_main_readyprint_sep_odometer_statement == "checked" ? "yes" : "",
                "sd_main_readyprint_buyers_guide": this.state.sd_main_readyprint_buyers_guide == "checked" ? "yes" : "",
                "sd_main_readyprint_facts": this.state.sd_main_readyprint_facts == "checked" ? "yes" : "",
                "sd_main_readyprint_insurance_affidavit": this.state.sd_main_readyprint_insurance_affidavit == "checked" ? "yes" : "",
                "sd_main_readyprint_insurance_agreement": this.state.sd_main_readyprint_insurance_agreement == "checked" ? "yes" : "",
                "sd_main_readyprint_installment_contract": this.state.sd_main_readyprint_installment_contract == "checked" ? "yes" : "",
                "sd_main_readyprint_buyers_order": this.state.sd_main_readyprint_buyers_order == "checked" ? "yes" : "",

                "document_type": "print"

            }

            var dataTexas = {
                "member_id": this.state.userid,
                "transact_id": this.state.transact_id,

                "inv_id": this.state.inv_id,
                "trade_inv_id": this.state.trade_inv_id,
                "buyers_id": this.state.buyers_id,
                "cobuyers_id": this.state.cobuyers_id,
                "insurance_buyers_id": this.state.insurance_buyers_id,

                //update main buyer
                "buyers_firstname": this.state.sd_main_buyers_first_name,
                "buyers_middlename": this.state.sd_main_buyers_mid_name,
                "buyers_lastname": this.state.sd_main_buyers_last_name,
                "buyers_address": this.state.sd_main_buyers_address,
                "buyers_city": this.state.sd_main_buyers_city,
                "buyers_state": this.state.sd_main_buyers_state,
                "buyers_zip": this.state.sd_main_buyers_zip,
                // "sd_main_buyers_country": this.state.sd_main_buyers_country,
                "buyers_email": this.state.sd_main_buyers_email,
                "buyers_workphone": this.state.sd_main_buyers_work_phone,
                "buyers_homephone": this.state.sd_main_buyers_home_phone,
                "buyers_mobile": this.state.sd_main_buyers_mobile,
                "buyers_dlnumber": this.state.sd_main_dl_number,
                "buyers_dlstate": this.state.sd_main_buyers_dl_state,
                "buyers_dlexpire": this.state.sd_main_buyers_dl_expire,
                "buyers_dldob": this.state.sd_main_buyers_dl_dob,
                "buyers_temp_tag_number": this.state.sd_main_buyers_tag_number,

                //update main inventory
                "inventory_vin": this.state.sd_main_inv_vin,
                "inventory_year": this.state.sd_main_inv_year,
                "inventory_make": this.state.sd_main_inv_make,
                "inventory_model": this.state.sd_main_inv_model,
                "inventory_style": this.state.sd_main_inv_style,
                "inventory_stocknumber": this.state.sd_main_inv_stockNumber,
                "inventory_color": this.state.sd_main_inv_color,
                "inventory_mileage": this.state.sd_main_inv_mileage,
                "inventory_exempt": this.state.sd_main_inv_exempt == "checked" ? 'yes' : 'no',
                "inventory_cost": this.state.sd_main_inv_cost,
                "inventory_addedcost": this.state.sd_main_inv_addedCost,
                "inventory_totalcost": this.state.sd_main_inv_totalCost,
                "inventory_price": this.state.sd_main_inv_vehiclePrice,

                //update main trade
                "trade_vin": this.state.sd_main_trade_inv_vin,
                "trade_year": this.state.sd_main_trade_inv_year,
                "trade_make": this.state.sd_main_trade_inv_make,
                "trade_model": this.state.sd_main_trade_inv_model,
                "trade_style": this.state.sd_main_trade_inv_style,
                "trade_color": this.state.sd_main_trade_inv_color,
                "trade_mileage": this.state.sd_main_trade_inv_mileage,
                "trade_exempt": this.state.sd_main_trade_inv_exempt == "checked" ? 'yes' : 'no',
                "trade_allowance": this.state.sd_main_trade_inv_price,

                //update main math
                "saleprice": this.state.sd_main_math_saleprice,
                "cashcredit": this.state.sd_main_math_cashcredit,
                "tradecredit": this.state.sd_main_math_tradecredit,
                "tax": this.state.sd_main_math_taxdue,
                "servicefee": this.state.sd_main_math_servicefee,
                "tagregistration": this.state.sd_main_math_tagregistration,
                "total_due": this.state.sd_main_math_totaldue,
                "sub_due": this.state.sub_due,
                "sub_due1": this.state.sub_due1,
                "sub_due2": this.state.sub_due2,

                //deal print
                "sd_main_readyprint_date": this.state.sd_main_readyprint_date,
                "chooseall": this.state.sd_main_readyprint_chooseall == "checked" ? "yes" : "",

                "sd_main_readyprint_app_title_registration": this.state.sd_main_readyprint_app_title_registration == "checked" ? "yes" : "",
                "sd_main_readyprint_billofsale": this.state.sd_main_readyprint_billofsale == "checked" ? "yes" : "",
                "sd_main_readyprint_installment_contract": this.state.sd_main_readyprint_installment_contract == "checked" ? "yes" : "",
                "sd_main_readyprint_power_of_attorney": this.state.sd_main_readyprint_power_of_attorney == "checked" ? "yes" : "",
                "sd_main_readyprint_buyers_guide": this.state.sd_main_readyprint_buyers_guide == "checked" ? "yes" : "",
                "sd_main_readyprint_loan_payment_schedule": this.state.sd_main_readyprint_loan_payment_schedule == "checked" ? "yes" : "",
                "sd_main_readyprint_arbitration_agreement": this.state.sd_main_readyprint_arbitration_agreement == "checked" ? "yes" : "",
                "sd_main_readyprint_credit_reporting_disclosure": this.state.sd_main_readyprint_credit_reporting_disclosure == "checked" ? "yes" : "",
                "sd_main_readyprint_facts": this.state.sd_main_readyprint_facts == "checked" ? "yes" : "",
                "sd_main_readyprint_airbags": this.state.sd_main_readyprint_airbags == "checked" ? "yes" : "",
                "sd_main_readyprint_release_agreement": this.state.sd_main_readyprint_release_agreement == "checked" ? "yes" : "",
                "sd_main_readyprint_odometer_statement": this.state.sd_main_readyprint_odometer_statement == "checked" ? "yes" : "",
                "sd_main_readyprint_api": this.state.sd_main_readyprint_api == "checked" ? "yes" : "",
                "sd_main_readyprint_country_title_issurance": this.state.sd_main_readyprint_country_title_issurance == "checked" ? "yes" : "",
                "sd_main_readyprint_authorization_letter": this.state.sd_main_readyprint_authorization_letter == "checked" ? "yes" : "",
                "sd_main_readyprint_electronic_payment_authorization": this.state.sd_main_readyprint_electronic_payment_authorization == "checked" ? "yes" : "",
                "sd_main_readyprint_do_not_sign": this.state.sd_main_readyprint_do_not_sign == "checked" ? "yes" : "",
                "sd_main_readyprint_receipt_downpayment": this.state.sd_main_readyprint_receipt_downpayment == "checked" ? "yes" : "",
                "sd_main_readyprint_buyer_information": this.state.sd_main_readyprint_buyer_information == "checked" ? "yes" : "",

                "document_type": "print"

            }

            console.log(dataTexas);

            if (this.state.transact_id == "")
                this.isuserexpied()

            this.setState({ isLoading: true, btn_disable_dealprint: true })

            fetch(API_URL + "insertdealprint", {
                method: "POST",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },

                body:
                    this.state.userState == "FLORIDA" ? JSON.stringify(dataFlorida) :
                        this.state.userState == "TEXAS" ? JSON.stringify(dataTexas)
                            : JSON.stringify(data)
            })
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    // console.log(data);
                    // console.log("html "+JSON.parse(data.data).transact_id);
                    //console.log("html "+data.data.html);
                    if (data.status == "true") {
                        if (Platform.OS === 'android') {
                            ToastAndroid.show(data.message, ToastAndroid.SHORT);
                        } else {
                            alert(data.message);
                        }

                        this.setState({
                            transact_id: data.data.transact_id,
                            isModalPrintVisible: !this.state.isModalPrintVisible
                        })
                        this.downloadDocument(data.data.pdfFilePath)
                        this.props.navigation.navigate('YourdealScreen')
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
        // this.setState({
        //     isModalPrintVisible: !this.state.isModalPrintVisible,
        // });
    }

    async insertdeal_contract() {

        if (this.state.sd_main_buyers_first_name == "") {
            if (this.state.buyerUp == false) this.buyerToggle()
            this.setState({ errorsd_main_buyers_first_name: true, isModalContractVisible: !this.state.isModalContractVisible });
            this.sd_main_buyers_first_nameTextInput.focus();
        } else if (this.state.sd_main_buyers_last_name == "") {
            if (this.state.buyerUp == false) this.buyerToggle()
            this.setState({ errorsd_main_buyers_last_name: true, isModalContractVisible: !this.state.isModalContractVisible });
            this.sd_main_buyers_last_nameTextInput.focus();
        } else if (this.state.sd_main_buyers_address == "") {
            if (this.state.buyerUp == false) this.buyerToggle()
            this.setState({ errorsd_main_buyers_address: true, isModalContractVisible: !this.state.isModalContractVisible });
            this.sd_main_buyers_addressTextInput.focus();
        } else if (this.state.sd_main_buyers_city == "") {
            if (this.state.buyerUp == false) this.buyerToggle()
            this.setState({ errorsd_main_buyers_city: true, isModalContractVisible: !this.state.isModalContractVisible });
            this.sd_main_buyers_cityTextInput.focus();
        } else if (this.state.sd_main_buyers_state == "") {
            if (this.state.buyerUp == false) this.buyerToggle()
            this.setState({ errorsd_main_buyers_state: true, isModalContractVisible: !this.state.isModalContractVisible });
            this.sd_main_buyers_stateTextInput.focus();
        } else if (this.state.sd_main_buyers_zip == "") {
            if (this.state.buyerUp == false) this.buyerToggle()
            this.setState({ errorsd_main_buyers_zip: true, isModalContractVisible: !this.state.isModalContractVisible });
            this.sd_main_buyers_zipTextInput.focus();
        } else if (this.state.sd_main_buyers_country == "") {
            if (this.state.buyerUp == false) this.buyerToggle()
            this.setState({ errorsd_main_buyers_country: true, isModalContractVisible: !this.state.isModalContractVisible });
            this.sd_main_buyers_countryTextInput.focus();
        } else if (this.state.sd_main_buyers_email == "") {
            if (this.state.buyerUp == false) this.buyerToggle()
            this.setState({ errorsd_main_buyers_email: true, isModalContractVisible: !this.state.isModalContractVisible });
            this.sd_main_buyers_emailTextInput.focus();
        } else if (this.state.sd_main_buyers_work_phone == "" && this.state.sd_main_buyers_home_phone == "" && this.state.sd_main_buyers_mobile == "") {
            if (this.state.buyerUp == false) this.buyerToggle()
            this.setState({ errorsd_main_buyers_work_phone: true, isModalContractVisible: !this.state.isModalContractVisible });
            this.sd_main_buyers_work_phoneTextInput.focus();
        } else if (this.state.sd_main_dl_number == "") {
            if (this.state.buyerUp == false) this.buyerToggle()
            this.setState({ errorsd_main_dl_number: true, isModalContractVisible: !this.state.isModalContractVisible });
            this.sd_main_dl_numberTextInput.focus();
        } else if (this.state.sd_main_buyers_dl_state == "") {
            if (this.state.buyerUp == false) this.buyerToggle()
            this.setState({ errorsd_main_buyers_dl_state: true, isModalContractVisible: !this.state.isModalContractVisible });
            this.sd_main_buyers_dl_stateTextInput.focus();

        } else if (this.state.sd_main_inv_vin == "" && this.state.inv_id != 0) {
            if (this.state.inventoryUp == false) this.inventoryToggle()
            this.setState({ errorsd_main_inv_vin: true, isModalContractVisible: !this.state.isModalContractVisible });
            this.sd_main_inv_vinTextInput.focus();
        } else if (this.state.sd_main_inv_year == "" && this.state.inv_id != 0) {
            if (this.state.inventoryUp == false) this.inventoryToggle()
            this.setState({ errorsd_main_inv_year: true, isModalContractVisible: !this.state.isModalContractVisible });
            this.sd_main_inv_yearTextInput.focus();
        } else if (this.state.sd_main_inv_make == "" && this.state.inv_id != 0) {
            if (this.state.inventoryUp == false) this.inventoryToggle()
            this.setState({ errorsd_main_inv_make: true, isModalContractVisible: !this.state.isModalContractVisible });
            this.sd_main_inv_makeTextInput.focus();
        } else if (this.state.sd_main_inv_model == "" && this.state.inv_id != 0) {
            if (this.state.inventoryUp == false) this.inventoryToggle()
            this.setState({ errorsd_main_inv_model: true, isModalContractVisible: !this.state.isModalContractVisible });
            this.sd_main_inv_modelTextInput.focus();
        } else if (this.state.sd_main_inv_style == "" && this.state.inv_id != 0) {
            if (this.state.inventoryUp == false) this.inventoryToggle()
            this.setState({ errorsd_main_inv_style: true, isModalContractVisible: !this.state.isModalContractVisible });
            this.sd_main_inv_styleTextInput.focus();
        } else if (this.state.sd_main_inv_stockNumber == "" && this.state.inv_id != 0) {
            if (this.state.inventoryUp == false) this.inventoryToggle()
            this.setState({ errorsd_main_inv_stockNumber: true, isModalContractVisible: !this.state.isModalContractVisible });
            this.sd_main_inv_stockNumberTextInput.focus();
        } else if (this.state.sd_main_inv_color == "" && this.state.inv_id != 0) {
            if (this.state.inventoryUp == false) this.inventoryToggle()
            this.setState({ errorsd_main_inv_color: true, isModalContractVisible: !this.state.isModalContractVisible });
            this.sd_main_inv_colorTextInput.focus();
        } else if (this.state.sd_main_inv_exempt == "unchecked" && this.state.sd_main_inv_mileage == "" && this.state.inv_id != 0) {
            if (this.state.inventoryUp == false) this.inventoryToggle()
            this.setState({ errorsd_main_inv_mileage: true, isModalContractVisible: !this.state.isModalContractVisible });
            this.sd_main_inv_mileageTextInput.focus();
        } else if (this.state.sd_main_inv_cost == "" && this.state.inv_id != 0) {
            if (this.state.inventoryUp == false) this.inventoryToggle()
            this.setState({ errorsd_main_inv_cost: true, isModalContractVisible: !this.state.isModalContractVisible });
            this.sd_main_inv_costTextInput.focus();
        } else if (this.state.sd_main_inv_addedCost == "" && this.state.inv_id != 0) {
            if (this.state.inventoryUp == false) this.inventoryToggle()
            this.setState({ errorsd_main_inv_addedCost: true, isModalContractVisible: !this.state.isModalContractVisible });
            this.sd_main_inv_addedCostTextInput.focus();
        } else if (this.state.sd_main_inv_vehiclePrice == "" && this.state.inv_id != 0) {
            if (this.state.inventoryUp == false) this.inventoryToggle()
            this.setState({ errorsd_main_inv_vehiclePrice: true, isModalContractVisible: !this.state.isModalContractVisible });
            this.sd_main_inv_vehiclePriceTextInput.focus();

        } else if (this.state.sd_main_trade_inv_vin == "" && this.state.trade_inv_id != 0) {
            if (this.state.tradeUp == false) this.tradeToggle()
            this.setState({ errorsd_main_trade_inv_vin: true, isModalContractVisible: !this.state.isModalContractVisible });
            this.sd_main_trade_inv_vinTextInput.focus();
        } else if (this.state.sd_main_trade_inv_year == "" && this.state.trade_inv_id != 0) {
            if (this.state.tradeUp == false) this.tradeToggle()
            this.setState({ errorsd_main_trade_inv_year: true, isModalContractVisible: !this.state.isModalContractVisible });
            this.sd_main_trade_inv_yearTextInput.focus();
        } else if (this.state.sd_main_trade_inv_make == "" && this.state.trade_inv_id != 0) {
            if (this.state.tradeUp == false) this.tradeToggle()
            this.setState({ errorsd_main_trade_inv_make: true, isModalContractVisible: !this.state.isModalContractVisible });
            this.sd_main_trade_inv_makeTextInput.focus();
        } else if (this.state.sd_main_trade_inv_model == "" && this.state.trade_inv_id != 0) {
            if (this.state.tradeUp == false) this.tradeToggle()
            this.setState({ errorsd_main_trade_inv_model: true, isModalContractVisible: !this.state.isModalContractVisible });
            this.sd_main_trade_inv_modelTextInput.focus();
        } else if (this.state.sd_main_trade_inv_style == "" && this.state.trade_inv_id != 0) {
            if (this.state.tradeUp == false) this.tradeToggle()
            this.setState({ errorsd_main_trade_inv_style: true, isModalContractVisible: !this.state.isModalContractVisible });
            this.sd_main_trade_inv_styleTextInput.focus();
        } else if (this.state.sd_main_trade_inv_color == "" && this.state.trade_inv_id != 0) {
            if (this.state.tradeUp == false) this.tradeToggle()
            this.setState({ errorsd_main_trade_inv_color: true, isModalContractVisible: !this.state.isModalContractVisible });
            this.sd_main_trade_inv_colorTextInput.focus();
        } else if (this.state.sd_main_trade_inv_exempt == "unchecked" && this.state.sd_main_trade_inv_mileage == "" && this.state.trade_inv_id != 0) {
            if (this.state.tradeUp == false) this.tradeToggle()
            this.setState({ errorsd_main_trade_inv_mileage: true, isModalContractVisible: !this.state.isModalContractVisible });
            this.sd_main_trade_inv_mileageTextInput.focus();
        } else if (this.state.sd_main_trade_inv_price == "" && this.state.trade_inv_id != 0) {
            if (this.state.tradeUp == false) this.tradeToggle()
            this.setState({ errorsd_main_trade_inv_price: true, isModalContractVisible: !this.state.isModalContractVisible });
            this.sd_main_trade_inv_priceTextInput.focus();

        } else if (this.state.sd_main_math_saleprice == "") {
            if (this.state.numbersUp == false) this.numbersToggle()
            this.setState({ errorsd_main_math_saleprice: true, isModalContractVisible: !this.state.isModalContractVisible });
            this.sd_main_math_salepriceTextInput.focus();
        } else if (this.state.sd_main_math_cashcredit == "") {
            if (this.state.numbersUp == false) this.numbersToggle()
            this.setState({ errorsd_main_math_cashcredit: true, isModalContractVisible: !this.state.isModalContractVisible });
            this.sd_main_math_cashcreditTextInput.focus();
        } else if (this.state.sd_main_math_tradecredit == "") {
            if (this.state.numbersUp == false) this.numbersToggle()
            this.setState({ errorsd_main_math_tradecredit: true, isModalContractVisible: !this.state.isModalContractVisible });
            this.sd_main_math_tradecreditTextInput.focus();
        } else if (this.state.sd_main_math_servicefee == "") {
            if (this.state.numbersUp == false) this.numbersToggle()
            this.setState({ errorsd_main_math_servicefee: true, isModalContractVisible: !this.state.isModalContractVisible });
            this.sd_main_math_servicefeeTextInput.focus();
        } else if (this.state.sd_main_math_tagregistration == "") {
            if (this.state.numbersUp == false) this.numbersToggle()
            this.setState({ errorsd_main_math_tagregistration: true, isModalContractVisible: !this.state.isModalContractVisible });
            this.sd_main_math_tagregistrationTextInput.focus();
        } else if (this.state.sd_main_math_taxdue == "") {
            if (this.state.numbersUp == false) this.numbersToggle()
            this.setState({ errorsd_main_math_taxdue: true, isModalContractVisible: !this.state.isModalContractVisible });
            this.sd_main_math_taxdueTextInput.focus();
        } else if (this.state.sd_main_math_totaldue == "") {
            if (this.state.numbersUp == false) this.numbersToggle()
            this.setState({ errorsd_main_math_totaldue: true, isModalContractVisible: !this.state.isModalContractVisible });
            this.sd_main_math_totaldueTextInput.focus();
        } else {
            if (this.state.sd_main_bhphcontract_cb == "unchecked") {
                if (Platform.OS === 'android') {
                    ToastAndroid.show("checked BHPH Contract to procced further!", ToastAndroid.SHORT);
                } else {
                    alert("checked BHPH Contract to procced further!");
                }
            } else {

                if (this.state.sd_main_bhphcontract_cash_price == "") {
                    this.setState({ errorsd_main_bhphcontract_cash_price: true });
                    this.sd_main_bhphcontract_cash_priceTextInput.focus();
                } else if (this.state.sd_main_bhphcontract_dealer_fee == "") {
                    if (this.state.numbersUp == false) this.numbersToggle()
                    this.setState({ errorsd_main_bhphcontract_dealer_fee: true });
                    this.sd_main_bhphcontract_dealer_feeTextInput.focus();
                } else if (this.state.sd_main_bhphcontract_taxes == "") {
                    if (this.state.numbersUp == false) this.numbersToggle()
                    this.setState({ errorsd_main_bhphcontract_taxes: true });
                    this.sd_main_bhphcontract_taxesTextInput.focus();
                } else if (this.state.sd_main_bhphcontract_cashdown == "") {
                    if (this.state.numbersUp == false) this.numbersToggle()
                    this.setState({ errorsd_main_bhphcontract_cashdown: true });
                    this.sd_main_bhphcontract_cashdownTextInput.focus();
                } else if (this.state.sd_main_bhphcontract_deferred_down == "") {
                    if (this.state.numbersUp == false) this.numbersToggle()
                    this.setState({ errorsd_main_bhphcontract_deferred_down: true });
                    this.sd_main_bhphcontract_deferred_downTextInput.focus();
                } else if (this.state.sd_main_bhphcontract_trade_allowance == "") {
                    if (this.state.numbersUp == false) this.numbersToggle()
                    this.setState({ errorsd_main_bhphcontract_trade_allowance: true });
                    this.sd_main_bhphcontract_trade_allowanceTextInput.focus();
                } else if (this.state.sd_main_bhphcontract_title_fee == "") {
                    if (this.state.numbersUp == false) this.numbersToggle()
                    this.setState({ errorsd_main_bhphcontract_title_fee: true });
                    this.sd_main_bhphcontract_title_feeTextInput.focus();
                } else if (this.state.sd_main_bhphcontract_payment_amount == "") {
                    if (this.state.numbersUp == false) this.numbersToggle()
                    this.setState({ errorsd_main_bhphcontract_payment_amount: true });
                    this.sd_main_bhphcontract_payment_amountTextInput.focus();
                } else if (this.state.sd_main_bhphcontract_number_payments == "") {
                    if (this.state.numbersUp == false) this.numbersToggle()
                    this.setState({ errorsd_main_bhphcontract_number_payments: true });
                    this.sd_main_bhphcontract_number_paymentsTextInput.focus();
                } else if (this.state.sd_main_bhphcontract_interest_rate == "") {
                    if (this.state.numbersUp == false) this.numbersToggle()
                    this.setState({ errorsd_main_bhphcontract_interest_rate: true });
                    this.sd_main_bhphcontract_interest_rateTextInput.focus();
                } else if (this.state.sd_main_bhphcontract_total_payments == "") {
                    if (this.state.numbersUp == false) this.numbersToggle()
                    this.setState({ errorsd_main_bhphcontract_total_payments: true });
                    this.sd_main_bhphcontract_total_paymentsTextInput.focus();
                } else if (this.state.sd_main_bhphcontract_finance_charge == "") {
                    if (this.state.numbersUp == false) this.numbersToggle()
                    this.setState({ errorsd_main_bhphcontract_finance_charge: true });
                    this.sd_main_bhphcontract_finance_chargeTextInput.focus();
                } else if (this.state.sd_main_bhphcontract_tot_finance_amt == "") {
                    if (this.state.numbersUp == false) this.numbersToggle()
                    this.setState({ errorsd_main_bhphcontract_tot_finance_amt: true });
                    this.sd_main_bhphcontract_tot_finance_amtTextInput.focus();
                } else if (this.state.sd_main_bhphcontract_tot_price_paid == "") {
                    if (this.state.numbersUp == false) this.numbersToggle()
                    this.setState({ errorsd_main_bhphcontract_tot_price_paid: true });
                    this.sd_main_bhphcontract_tot_price_paidTextInput.focus();
                } else {
                    var data = {
                        "member_id": this.state.userid,
                        "transact_id": this.state.transact_id,

                        "inv_id": this.state.inv_id,
                        "trade_inv_id": this.state.trade_inv_id,
                        "buyers_id": this.state.buyers_id,
                        "cobuyers_id": this.state.cobuyers_id,
                        "insurance_buyers_id": this.state.insurance_buyers_id,

                        //update main buyer
                        "buyers_firstname": this.state.sd_main_buyers_first_name,
                        "buyers_middlename": this.state.sd_main_buyers_mid_name,
                        "buyers_lastname": this.state.sd_main_buyers_last_name,
                        "buyers_address": this.state.sd_main_buyers_address,
                        "buyers_city": this.state.sd_main_buyers_city,
                        "buyers_state": this.state.sd_main_buyers_state,
                        "buyers_zip": this.state.sd_main_buyers_zip,
                        // "sd_main_buyers_country": this.state.sd_main_buyers_country,
                        "buyers_email": this.state.sd_main_buyers_email,
                        "buyers_workphone": this.state.sd_main_buyers_work_phone,
                        "buyers_homephone": this.state.sd_main_buyers_home_phone,
                        "buyers_mobile": this.state.sd_main_buyers_mobile,
                        "buyers_dlnumber": this.state.sd_main_dl_number,
                        "buyers_dlstate": this.state.sd_main_buyers_dl_state,
                        "buyers_dlexpire": this.state.sd_main_buyers_dl_expire,
                        "buyers_dldob": this.state.sd_main_buyers_dl_dob,
                        "buyers_temp_tag_number": this.state.sd_main_buyers_tag_number,

                        //update main inventory
                        "inventory_vin": this.state.sd_main_inv_vin,
                        "inventory_year": this.state.sd_main_inv_year,
                        "inventory_make": this.state.sd_main_inv_make,
                        "inventory_model": this.state.sd_main_inv_model,
                        "inventory_style": this.state.sd_main_inv_style,
                        "inventory_stocknumber": this.state.sd_main_inv_stockNumber,
                        "inventory_color": this.state.sd_main_inv_color,
                        "inventory_mileage": this.state.sd_main_inv_mileage,
                        "inventory_exempt": this.state.sd_main_inv_exempt == "checked" ? 'yes' : 'no',
                        "inventory_cost": this.state.sd_main_inv_cost,
                        "inventory_addedcost": this.state.sd_main_inv_addedCost,
                        "inventory_totalcost": this.state.sd_main_inv_totalCost,
                        "inventory_price": this.state.sd_main_inv_vehiclePrice,

                        //update main trade
                        "trade_vin": this.state.sd_main_trade_inv_vin,
                        "trade_year": this.state.sd_main_trade_inv_year,
                        "trade_make": this.state.sd_main_trade_inv_make,
                        "trade_model": this.state.sd_main_trade_inv_model,
                        "trade_style": this.state.sd_main_trade_inv_style,
                        "trade_color": this.state.sd_main_trade_inv_color,
                        "trade_mileage": this.state.sd_main_trade_inv_mileage,
                        "trade_exempt": this.state.sd_main_trade_inv_exempt == "checked" ? 'yes' : 'no',
                        "trade_allowance": this.state.sd_main_trade_inv_price,

                        //update main math
                        "saleprice": this.state.sd_main_math_saleprice,
                        "cashcredit": this.state.sd_main_math_cashcredit,
                        "tradecredit": this.state.sd_main_math_tradecredit,
                        "tax": this.state.sd_main_math_taxdue,
                        "servicefee": this.state.sd_main_math_servicefee,
                        "tagregistration": this.state.sd_main_math_tagregistration,
                        "total_due": this.state.sd_main_math_totaldue,
                        "sub_due": this.state.sub_due,
                        "sub_due1": this.state.sub_due1,
                        "sub_due2": this.state.sub_due2,

                        "sd_main_bhphcontract_date": this.state.sd_main_bhphcontract_date,
                        "sd_main_bhphcontract_cash_price": this.state.sd_main_bhphcontract_cash_price,
                        "sd_main_bhphcontract_dealer_fee": this.state.sd_main_bhphcontract_dealer_fee,
                        "sd_main_bhphcontract_taxes": this.state.sd_main_bhphcontract_taxes,
                        "sd_main_bhphcontract_cashdown": this.state.sd_main_bhphcontract_cashdown,
                        "sd_main_bhphcontract_deferred_down": this.state.sd_main_bhphcontract_deferred_down,
                        "sd_main_bhphcontract_trade_allowance": this.state.sd_main_bhphcontract_trade_allowance,
                        "sd_main_bhphcontract_title_fee": this.state.sd_main_bhphcontract_title_fee,
                        "sd_main_bhphcontract_payment_amount": this.state.sd_main_bhphcontract_payment_amount,
                        "sd_main_bhphcontract_number_payments": this.state.sd_main_bhphcontract_number_payments,
                        "sd_main_bhphcontract_interest_rate": this.state.sd_main_bhphcontract_interest_rate,
                        "sd_main_bhphcontract_total_payments": this.state.sd_main_bhphcontract_total_payments,
                        "sd_main_bhphcontract_finance_charge": this.state.sd_main_bhphcontract_finance_charge,
                        "sd_main_bhphcontract_tot_finance_amt": this.state.sd_main_bhphcontract_tot_finance_amt,
                        "sd_main_bhphcontract_tot_price_paid": this.state.sd_main_bhphcontract_tot_price_paid,
                        "sd_main_bhphcontract_payment_schedule": this.state.sd_main_bhphcontract_payment_scheduleFrom + " - " + this.state.sd_main_bhphcontract_payment_scheduleTo,
                        "document_type": "contract"

                    }
                    this.setState({ isLoading: true, btn_disable_dealcontract: true })

                    fetch(API_URL + "insertdealprint", {
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
                            // console.log("html "+JSON.parse(data.data).transact_id);
                            //console.log("html "+data.data.html);
                            if (data.status == "true") {
                                if (Platform.OS === 'android') {
                                    ToastAndroid.show(data.message, ToastAndroid.SHORT);
                                } else {
                                    alert(data.message);
                                }

                                this.setState({
                                    transact_id: data.data.transact_id,
                                    isModalContractVisible: !this.state.isModalContractVisible
                                })
                                this.downloadDocument(data.data.pdfFilePath)
                                this.props.navigation.navigate('YourdealScreen')
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
            }
        }
    }

    async deal_not_save() {
        var data = {
            "member_id": this.state.userid,
            "transact_id": this.state.transact_id
        }

        this.setState({ isLoading: true, btn_disable_dealnotsave: true })

        fetch(API_URL + "setdealnotclosed", {
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
                    this.props.navigation.navigate('YourdealScreen')
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

    async downloadDocument(uri) {
        this.setState({ isLoading: true })

        FileSystem.downloadAsync(
            uri,
            FileSystem.documentDirectory + uri.replace(/^.*[\\\/]/, '')
        )
            .then(({ uri }) => {
                // console.log('Finished downloading to ', uri);
                // this.setState({ uri: uri });
                // this.openBrowser(uri)

                FileSystem.getContentUriAsync(uri).then(cUri => {
                    this.setState({ isLoading: false })

                    if (Platform.OS == "android") {

                        // console.log(cUri);
                        IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
                            data: cUri,
                            flags: 1,
                        });
                    } else {
                        Share.share(
                            {
                                message: 'Final Document',
                                url: cUri
                            }
                        ).then(({ action, activityType }) => {
                            if (action === Share.sharedAction)
                                console.log('Share was successful');
                            else
                                console.log('Share was dismissed');
                        });
                    }

                });
            })
            .catch(error => {
                console.error("error ", error);
            });
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
                // console.log(data);
                if (data.status == "true") {
                    {
                        this.setState({ screen1: false, screen2: false, screen3: false, screen4: false, screen5: false, screen6: false, screen7: true })

                        this.setState({
                            transact_status: data.data[0].status,

                            //update main math
                            sd_main_math_saleprice: '', sd_main_math_cashcredit: 0, sd_main_math_tradecredit: 0, sd_main_math_taxdue: '', sd_main_math_totaldue: '', sd_main_math_servicefee: 0, sd_main_math_tagregistration: 0,
                            errorsd_main_math_saleprice: false, errorsd_main_math_cashcredit: false, errorsd_main_math_tradecredit: false, errorsd_main_math_taxdue: false, errorsd_main_math_totaldue: false, errorsd_main_math_servicefee: false, errorsd_main_math_tagregistration: false,
                            //update main buyer
                            sd_main_buyers_first_name: '', sd_main_buyers_mid_name: '', sd_main_buyers_last_name: '', sd_main_buyers_address: '', sd_main_buyers_city: '', sd_main_buyers_state: '', sd_main_buyers_zip: '', sd_main_buyers_country: 'USA', sd_main_buyers_email: '', sd_main_buyers_work_phone: '', sd_main_buyers_home_phone: '', sd_main_buyers_mobile: '', sd_main_dl_number: '', sd_main_buyers_dl_state: '', sd_main_buyers_dl_expire: '', sd_main_buyers_dl_dob: '', sd_main_buyers_tag_number: '',
                            errorsd_main_buyers_first_name: false, errorsd_main_buyers_mid_name: false, errorsd_main_buyers_last_name: false, errorsd_main_buyers_address: false, errorsd_main_buyers_city: false, errorsd_main_buyers_state: false, errorsd_main_buyers_zip: false, errorsd_main_buyers_country: false, errorsd_main_buyers_email: false, errorsd_main_buyers_work_phone: false, errorsd_main_buyers_home_phone: false, errorsd_main_buyers_mobile: false, errorsd_main_dl_number: false, errorsd_main_buyers_dl_state: false, errorsd_main_buyers_dl_expire: false, errorsd_main_buyers_dl_dob: false, errorsd_main_buyers_tag_number: false,
                            //update main inventory
                            sd_main_inv_vin: "", sd_main_inv_year: "", sd_main_inv_make: "", sd_main_inv_model: "", sd_main_inv_style: "", sd_main_inv_stockNumber: "", sd_main_inv_color: "", sd_main_inv_mileage: "", sd_main_inv_exempt: "unchecked", sd_main_inv_cost: 0, sd_main_inv_addedCost: 0, sd_main_inv_totalCost: 0, sd_main_inv_vehiclePrice: "",
                            errorsd_main_inv_vin: false, errorsd_main_inv_year: false, errorsd_main_inv_make: false, errorsd_main_inv_model: false, errorsd_main_inv_style: false, errorsd_main_inv_stockNumber: false, errorsd_main_inv_color: false, errorsd_main_inv_mileage: false, errorsd_main_inv_cost: false, errorsd_main_inv_addedCost: false, errorsd_main_inv_vehiclePrice: false,
                            //update main trade
                            sd_main_trade_inv_vin: "", sd_main_trade_inv_year: "", sd_main_trade_inv_make: "", sd_main_trade_inv_model: "", sd_main_trade_inv_style: "", sd_main_trade_inv_color: "", sd_main_trade_inv_mileage: "", sd_main_trade_inv_exempt: "unchecked", sd_main_trade_inv_price: 0,
                            errorsd_main_trade_inv_vin: false, errorsd_main_trade_inv_year: false, errorsd_main_trade_inv_make: false, errorsd_main_trade_inv_model: false, errorsd_main_trade_inv_style: false, errorsd_main_trade_inv_color: false, errorsd_main_trade_inv_mileage: false, errorsd_main_trade_inv_price: false,
                            //bhph contract
                            sd_main_bhphcontract_cash_price: "", sd_main_bhphcontract_dealer_fee: "", sd_main_bhphcontract_taxes: "", sd_main_bhphcontract_cashdown: "", sd_main_bhphcontract_deferred_down: "", sd_main_bhphcontract_trade_allowance: "", sd_main_bhphcontract_title_fee: "", sd_main_bhphcontract_payment_amount: "", sd_main_bhphcontract_number_payments: "", sd_main_bhphcontract_interest_rate: "", sd_main_bhphcontract_total_payments: "", sd_main_bhphcontract_finance_charge: "", sd_main_bhphcontract_tot_finance_amt: "", sd_main_bhphcontract_tot_price_paid: "",
                            errorsd_main_bhphcontract_cash_price: false, errorsd_main_bhphcontract_dealer_fee: false, errorsd_main_bhphcontract_taxes: false, errorsd_main_bhphcontract_cashdown: false, errorsd_main_bhphcontract_deferred_down: false, errorsd_main_bhphcontract_trade_allowance: false, errorsd_main_bhphcontract_title_fee: false, errorsd_main_bhphcontract_payment_amount: false, errorsd_main_bhphcontract_number_payments: false, errorsd_main_bhphcontract_interest_rate: false, errorsd_main_bhphcontract_total_payments: false, errorsd_main_bhphcontract_finance_charge: false, errorsd_main_bhphcontract_tot_finance_amt: false, errorsd_main_bhphcontract_tot_price_paid: false,
                        })

                        this.state.itemsBuyers.push({
                            buyers_id: data.data[0].buyers_id,
                            buyers_first_name: data.data[0].buyers_first_name,
                            buyers_mid_name: data.data[0].buyers_mid_name,
                            buyers_last_name: data.data[0].buyers_last_name,
                            value: data.data[0].buyers_first_name + " " + data.data[0].buyers_mid_name + " " + data.data[0].buyers_last_name,
                            co_buyers_first_name: data.data[0].co_buyers_first_name,
                            co_buyers_mid_name: data.data[0].co_buyers_mid_name,
                            co_buyers_last_name: data.data[0].co_buyers_last_name,
                            ins_pol_num: data.data[0].ins_pol_num,
                        })

                        this.setState({
                            buyers_id: data.data[0].buyers_id,
                            buyers_id_value: data.data[0].buyers_first_name + " " + data.data[0].buyers_mid_name + " " + data.data[0].buyers_last_name
                        })

                        if (data.data[0].co_buyers_first_name != "") {
                            this.setState({
                                cobuyers_id: data.data[0].buyers_id,
                                cobuyers_id_value: data.data[0].co_buyers_first_name + " " + data.data[0].co_buyers_mid_name + " " + data.data[0].co_buyers_last_name
                            })
                        } else {
                            this.setState({ cobuyers_id: "", cobuyers_id_value: "" })
                        }
                        if (data.data[0].ins_pol_num != "") {
                            this.setState({
                                insurance_buyers_id: data.data[0].buyers_id,
                                insurance_buyers_id_value: data.data[0].ins_pol_num
                            })
                        } else {
                            this.setState({ insurance_buyers_id: "", insurance_buyers_id_value: "" })
                        }

                        this.setState({
                            sd_main_buyers_first_name: data.data[0].buyers_first_name,
                            sd_main_buyers_mid_name: data.data[0].buyers_mid_name,
                            sd_main_buyers_last_name: data.data[0].buyers_last_name,
                            sd_main_buyers_address: data.data[0].buyers_address,
                            sd_main_buyers_city: data.data[0].buyers_city,
                            sd_main_buyers_state: data.data[0].buyers_state,
                            sd_main_buyers_zip: data.data[0].buyers_zip,
                            sd_main_buyers_country: data.data[0].buyers_county,
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
                            tax: data.data[0].tax,
                            sub_due: data.data[0].sub_due,
                            sub_due1: data.data[0].sub_due1,
                            sub_due2: data.data[0].sub_due2,
                        })

                        this.setState({
                            math_saleprice: data.data[0].sale_price,
                            math_cashcredit: data.data[0].cash_credit,
                            math_tradecredit: data.data[0].trade_credit,
                            math_taxdue: data.data[0].tax,
                            math_totaldue: data.data[0].total_due,
                            servicefee: data.data[0].dealer_fee,
                            tagregistration: data.data[0].dmv,

                            calc_amountToFinance: data.data[0].total_due,
                        })

                        this.autocalculatersd("", '')

                        this.setState({
                            //bhph contract
                            sd_main_bhphcontract_cash_price: data.data[1].sale_price,
                            sd_main_bhphcontract_dealer_fee: data.data[1].dealer_fee,
                            sd_main_bhphcontract_taxes: data.data[1].tax,
                            sd_main_bhphcontract_cashdown: data.data[1].cash_credit,
                            sd_main_bhphcontract_deferred_down: data.data[1].cal_down_payment,
                            sd_main_bhphcontract_trade_allowance: data.data[1].trade_credit,
                            sd_main_bhphcontract_title_fee: data.data[1].dmv,
                            sd_main_bhphcontract_payment_amount: data.data[1].cal_monthly_payment,
                            sd_main_bhphcontract_number_payments: data.data[1].bhph_months,
                            sd_main_bhphcontract_interest_rate: data.data[1].bhph_rate,
                            sd_main_bhphcontract_total_payments: data.data[1].bhph_tpmts,
                            sd_main_bhphcontract_finance_charge: data.data[1].cal_total_interest,
                            sd_main_bhphcontract_tot_finance_amt: data.data[1].cal_amount_finance,
                            sd_main_bhphcontract_tot_price_paid: parseFloat(data.data[1].cash_credit) + parseFloat(data.data[1].bhph_tpmts),
                        })



                        if (data.data[0].inv_vin != 0 && data.data[0].trade_inv_vin != 0) {

                            this.state.itemsInv.push({
                                inv_id: data.data[0].inv_id,
                                inv_vin: data.data[0].inv_vin,
                                inv_stock: data.data[0].inv_stock,
                                inv_year: data.data[0].inv_year,
                                total_cost: data.data[0].inv_flrc,
                                vehicle_price: data.data[0].inv_price,
                                value: data.data[0].inv_stock + " " + data.data[0].inv_year + " " + data.data[0].inv_make + " (" + data.data[0].inv_model + ") VIN " + data.data[0].inv_vin
                            })

                            this.setState({
                                inv_id: data.data[0].inv_id,
                                inv_id_value: data.data[0].inv_stock + " " + data.data[0].inv_year + " " + data.data[0].inv_make + " (" + data.data[0].inv_model + ") VIN " + data.data[0].inv_vin,

                                trade_inv_id: data.data[0].trade_inv_id,
                                trade_inv_id_value: data.data[0].trade_inv_year + " " + data.data[0].trade_inv_make + " (" + data.data[0].trade_inv_model + ") VIN " + data.data[0].trade_inv_vin,
                            })

                            this.state.itemsTrade.push({
                                trade_inv_id: data.data[0].trade_inv_id,
                                trade_inv_vin: data.data[0].trade_inv_vin,
                                trade_inv_year: data.data[0].trade_inv_year,
                                trade_inv_make: data.data[0].trade_inv_make,
                                trade_inv_model: data.data[0].trade_inv_model,
                                trade_inv_price: data.data[0].trade_inv_price,
                                value: data.data[0].trade_inv_year + " " + data.data[0].trade_inv_make + " (" + data.data[0].trade_inv_model + ") VIN " + data.data[0].trade_inv_vin
                            })

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

                            this.state.itemsInv.push({
                                inv_id: data.data[0].inv_id,
                                inv_vin: data.data[0].inv_vin,
                                inv_stock: data.data[0].inv_stock,
                                inv_year: data.data[0].inv_year,
                                total_cost: data.data[0].inv_flrc,
                                vehicle_price: data.data[0].inv_price,
                                value: data.data[0].inv_stock + " " + data.data[0].inv_year + " " + data.data[0].inv_make + " (" + data.data[0].inv_model + ") VIN " + data.data[0].inv_vin
                            })

                            this.setState({
                                inv_id: data.data[0].inv_id,
                                inv_id_value: data.data[0].inv_stock + " " + data.data[0].inv_year + " " + data.data[0].inv_make + " (" + data.data[0].inv_model + ") VIN " + data.data[0].inv_vin,
                            })

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
                                trade_inv_id: data.data[0].trade_inv_id,
                                trade_inv_id_value: data.data[0].trade_inv_year + " " + data.data[0].trade_inv_make + " (" + data.data[0].trade_inv_model + ") VIN " + data.data[0].trade_inv_vin,
                            })

                            this.state.itemsTrade.push({
                                trade_inv_id: data.data[0].trade_inv_id,
                                trade_inv_vin: data.data[0].trade_inv_vin,
                                trade_inv_year: data.data[0].trade_inv_year,
                                trade_inv_make: data.data[0].trade_inv_make,
                                trade_inv_model: data.data[0].trade_inv_model,
                                trade_inv_price: data.data[0].trade_inv_price,
                                value: data.data[0].trade_inv_year + " " + data.data[0].trade_inv_make + " (" + data.data[0].trade_inv_model + ") VIN " + data.data[0].trade_inv_vin
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

    onSelectedItemsChange = selectedDDInv => {
        this.setState({ selectedDDInv });
        var array = this.state.itemsInv;
        var index = array.findIndex(x => x.inv_id === selectedDDInv + "")
        // console.log(index+" | "+selectedDDInv);
        this.onDropdownPress('itemsInv', index, 'inv_id')
    };

    onSelectedItemsChangeTrade = selectedDDTrade => {
        this.setState({ selectedDDTrade });
        var array = this.state.itemsTrade;
        var index = array.findIndex(x => x.trade_inv_id === selectedDDTrade + "")
        // console.log(index+" | "+selectedDDTrade);
        this.onDropdownPress('itemsTrade', index, 'trade_inv_id')
    };

    render() {
        const { selectedDDInv, selectedDDTrade } = this.state;
        return (
            <View style={styles.container}>

                {/* menu header start */}
                <TouchableOpacity style={AppStyles.navigationButton} onPress={() => this.props.navigation.navigate("YourdealScreen")}>
                    {/*Donute Button Image */}
                    <Image
                        style={{ width: 20, height: 20, margin: 10, resizeMode: "cover" }}
                        source={require('../../assets/images/cancel_black.png')}
                    />
                </TouchableOpacity>
                {/* menu header end */}

                <Text style={AppStyles.header_title_screen}>Create New Deal</Text>

                {/* startdeal progress bar start */}
                <View style={{
                    flexDirection: 'row',
                    backgroundColor: 'white',
                    borderRadius: 20,
                    //  width: width-20,
                    alignSelf: 'center'
                }}>
                    <View style={[this.state.screen1 ? styles.step_one_active : styles.step_one_pre]}>
                        <Image
                            style={{ width: 24, height: 20, margin: 10, resizeMode: "cover" }}
                            source={require('../../assets/stepicon/Inventory_white.png')} />
                    </View>

                    {this.state.screen2 ?

                        <View style={styles.step_active}>
                            <Image
                                style={{ width: 24, height: 20, margin: 10, resizeMode: "cover" }}
                                source={require('../../assets/stepicon/Trade_white.png')} />
                        </View>
                        :
                        this.state.screen3 || this.state.screen4 || this.state.screen5 || this.state.screen6 || this.state.screen7 ?
                            <View style={styles.step_previous}>
                                <Image
                                    style={{ width: 24, height: 20, margin: 10, resizeMode: "cover" }}
                                    source={require('../../assets/stepicon/Trade_white.png')} />
                            </View>
                            :
                            <View>
                                <Image
                                    style={{ width: 24, height: 20, margin: 10, resizeMode: "cover" }}
                                    source={require('../../assets/stepicon/Trade.png')} />
                            </View>
                    }

                    {this.state.screen3 ?

                        <View style={styles.step_active}>
                            <Image
                                style={{ width: 24, height: 20, margin: 10, resizeMode: "contain" }}
                                source={require('../../assets/stepicon/Buyers_white.png')} />
                        </View>
                        :
                        this.state.screen4 || this.state.screen5 || this.state.screen6 || this.state.screen7 ?
                            <View style={styles.step_previous}>
                                <Image
                                    style={{ width: 24, height: 20, margin: 10, resizeMode: "contain" }}
                                    source={require('../../assets/stepicon/Buyers_white.png')} />
                            </View>
                            :
                            <View>
                                <Image
                                    style={{ width: 24, height: 20, margin: 10, resizeMode: "contain" }}
                                    source={require('../../assets/stepicon/Buyers.png')} />
                            </View>
                    }

                    {this.state.screen4 ?

                        <View style={styles.step_active}>
                            <Image
                                style={{ width: 24, height: 20, margin: 10, resizeMode: "cover" }}
                                source={require('../../assets/stepicon/CoBuyers_white.png')} />
                        </View>
                        :
                        this.state.screen5 || this.state.screen6 || this.state.screen7 ?
                            <View style={styles.step_previous}>
                                <Image
                                    style={{ width: 24, height: 20, margin: 10, resizeMode: "cover" }}
                                    source={require('../../assets/stepicon/CoBuyers_white.png')} />
                            </View>
                            :
                            <View>
                                <Image
                                    style={{ width: 24, height: 20, margin: 10, resizeMode: "cover" }}
                                    source={require('../../assets/stepicon/CoBuyers.png')} />
                            </View>
                    }

                    {this.state.screen5 ?

                        <View style={styles.step_active}>
                            <Image
                                style={{ width: 24, height: 20, margin: 10, resizeMode: "cover" }}
                                source={require('../../assets/stepicon/Insurance_white.png')} />
                        </View>
                        :
                        this.state.screen6 || this.state.screen7 ?
                            <View style={styles.step_previous}>
                                <Image
                                    style={{ width: 24, height: 20, margin: 10, resizeMode: "cover" }}
                                    source={require('../../assets/stepicon/Insurance_white.png')} />
                            </View>
                            :
                            <View>
                                <Image
                                    style={{ width: 24, height: 20, margin: 10, resizeMode: "cover" }}
                                    source={require('../../assets/stepicon/Insurance.png')} />
                            </View>
                    }

                    {this.state.screen6 ?

                        <View style={styles.step_active}>
                            <Image
                                style={{ width: 24, height: 20, margin: 10, resizeMode: "contain" }}
                                source={require('../../assets/stepicon/Calculator_white.png')} />
                        </View>
                        :
                        this.state.screen7 ?
                            <View style={styles.step_previous}>
                                <Image
                                    style={{ width: 24, height: 20, margin: 10, resizeMode: "contain" }}
                                    source={require('../../assets/stepicon/Calculator_white.png')} />
                            </View>
                            :
                            <View>
                                <Image
                                    style={{ width: 24, height: 20, margin: 10, resizeMode: "contain" }}
                                    source={require('../../assets/stepicon/Calculator.png')} />
                            </View>
                    }

                    {this.state.screen7 ?

                        <View style={{ ...styles.step_active, paddingRight: 10 }}>
                            <Image
                                style={{ width: 24, height: 20, margin: 10, resizeMode: "cover" }}
                                source={require('../../assets/stepicon/preview_white.png')} />
                        </View>
                        :

                        <View style={{ paddingRight: 10 }}>
                            <Image
                                style={{ width: 24, height: 20, margin: 10, resizeMode: "cover" }}
                                source={require('../../assets/stepicon/preview.png')} />
                        </View>
                    }



                    {/* <View>
                        <Image
                            style={{ width: 24, height: 20, margin: 10, resizeMode: "contain" }}
                            source={require('../../assets/stepicon/Buyers.png')} />
                    </View> 

                     <View>
                        <Image
                            style={{ width: 24, height: 20, margin: 10, resizeMode: "cover" }}
                            source={require('../../assets/stepicon/CoBuyers.png')} />
                    </View> 

                     <View>
                        <Image
                            style={{ width: 24, height: 20, margin: 10, resizeMode: "cover" }}
                            source={require('../../assets/stepicon/Insurance.png')} />
                    </View> 

                     <View>
                        <Image
                            style={{ width: 24, height: 20, margin: 10, resizeMode: "contain" }}
                            source={require('../../assets/stepicon/Calculator.png')} />
                    </View> 

                     <View style={{ borderRadius: 20, paddingRight: 10 }}>
                        <Image
                            style={{ width: 24, height: 20, margin: 10, resizeMode: "cover" }}
                            source={require('../../assets/stepicon/preview.png')} />
                    </View> */}
                </View>
                {/* startdeal progress bar end */}

                {this.state.screen1 &&
                    <View>
                        <Text style={styles.text_title}>Inventory</Text>
                        <Text style={styles.text}>Select Vehicle</Text>
                        {/* <Dropdown
                            ref={(input) => { this.buyers_stateTextInput = input; }}
                            style={{ fontSize: 16, fontFamily: 'poppinsRegular', color: AppStyles.colorBlue.color, marginTop: 5 }}
                            data={this.state.itemsInv}
                            animationDuration={100}
                            itemTextStyle={{ fontFamily: 'poppinsRegular' }}
                            containerStyle={{
                                marginTop: -25,
                                marginHorizontal: 10
                            }}
                            inputContainerStyle={{ borderBottomColor: AppStyles.colorBlue.color, borderBottomWidth: 1 }}
                            value={this.state.inv_id_value}
                            onChangeText={(value, key) => this.onDropdownPress('itemsInv', key, 'inv_id')}
                        /> */}
                        <MultiSelect
                            hideTags
                            items={this.state.itemsInv}
                            uniqueKey="inv_id"
                            ref={(component) => { this.multiSelect = component }}
                            onSelectedItemsChange={this.onSelectedItemsChange}
                            selectedItems={selectedDDInv}
                            selectText={this.state.inv_id_value}
                            searchInputPlaceholderText="Search vehicle..."
                            onChangeInput={(text) => console.log(text)}
                            altFontFamily="poppinsRegular"
                            fontSize={16}
                            tagRemoveIconColor="#CCC"
                            tagBorderColor="#CCC"
                            tagTextColor="#CCC"
                            selectedItemTextColor="#CCC"
                            selectedItemIconColor="#CCC"
                            itemTextColor="#000"
                            displayKey="value"
                            styleDropdownMenuSubsection={{ backgroundColor: AppStyles.colorGreyLight }} //search box
                            styleMainWrapper={{ color: '#000', marginHorizontal: 10, marginTop: 5, fontFamily: "poppinsRegular" }}
                            styleInputGroup={{ color: '#000', paddingVertical: 5, fontFamily: "poppinsRegular" }} //search box
                            single='yes'
                        />
                        {/* <View>
                            {this.multiSelect.getSelectedItemsExt(selectedItems)}
                        </View> */}
                        {this.state.error_inv_id ? (
                            <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                * Please select inventory to proceed.
                            </Text>
                        ) : null}
                        <Text style={{ ...styles.text_title, textAlign: 'center', marginBottom: 10 }}>OR</Text>

                        <TouchableOpacity style={{ ...AppStyles.button, position: 'relative' }} activeOpacity={.5} onPress={this.toggleModalInventoryScan}>
                            <Text style={AppStyles.buttonText}> Add Vehicle </Text>
                        </TouchableOpacity>
                    </View>
                }

                {this.state.screen2 &&
                    <View>
                        <Text style={styles.text_title}>Trade In</Text>
                        <Text style={styles.text}>Select Vehicle</Text>
                        {/* <Dropdown
                            ref={(input) => { this.buyers_stateTextInput = input; }}
                            style={{ fontSize: 16, fontFamily: 'poppinsRegular', color: AppStyles.colorBlue.color, marginTop: 5 }}
                            data={this.state.itemsTrade}
                            animationDuration={100}
                            itemTextStyle={{ fontFamily: 'poppinsRegular' }}
                            containerStyle={{
                                marginTop: -25,
                                marginHorizontal: 10
                            }}
                            inputContainerStyle={{ borderBottomColor: AppStyles.colorBlue.color, borderBottomWidth: 1 }}
                            value={this.state.trade_inv_id_value}
                            onChangeText={(value, key) => this.onDropdownPress('itemsTrade', key, 'trade_inv_id')}
                        /> */}
                        <MultiSelect
                            hideTags
                            items={this.state.itemsTrade}
                            uniqueKey="trade_inv_id"
                            ref={(component) => { this.multiSelect = component }}
                            onSelectedItemsChange={this.onSelectedItemsChangeTrade}
                            selectedItems={selectedDDTrade}
                            selectText={this.state.trade_inv_id_value}
                            searchInputPlaceholderText="Search vehicle..."
                            onChangeInput={(text) => console.log(text)}
                            altFontFamily="poppinsRegular"
                            fontSize={16}
                            tagRemoveIconColor="#CCC"
                            tagBorderColor="#CCC"
                            tagTextColor="#CCC"
                            selectedItemTextColor="#CCC"
                            selectedItemIconColor="#CCC"
                            itemTextColor="#000"
                            displayKey="value"
                            styleDropdownMenuSubsection={{ backgroundColor: AppStyles.colorGreyLight }} //search box
                            styleMainWrapper={{ color: '#000', marginHorizontal: 10, marginTop: 5, fontFamily: "poppinsRegular" }}
                            styleInputGroup={{ color: '#000', paddingVertical: 5, fontFamily: "poppinsRegular" }} //search box
                            single='yes'
                        />
                        {this.state.error_trade_inv_id ? (
                            <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                * Please select trade to proceed.
                            </Text>
                        ) : null}
                        <Text style={{ ...styles.text_title, textAlign: 'center', marginBottom: 10 }}>OR</Text>

                        <TouchableOpacity style={{ ...AppStyles.button, position: 'relative' }} activeOpacity={.5} onPress={this.toggleModalTradeScan}>
                            <Text style={AppStyles.buttonText}> Add Vehicle </Text>
                        </TouchableOpacity>
                    </View>
                }

                {this.state.screen3 &&
                    <View>
                        <Text style={styles.text_title}>Buyer</Text>
                        <Text style={styles.text}>Select Buyer</Text>
                        <Dropdown
                            ref={(input) => { this.buyers_stateTextInput = input; }}
                            style={{ fontSize: 16, fontFamily: 'poppinsRegular', color: AppStyles.colorBlue.color, marginTop: 5 }}
                            data={this.state.itemsBuyers}
                            animationDuration={100}
                            itemTextStyle={{ fontFamily: 'poppinsRegular' }}
                            containerStyle={{
                                marginTop: -25,
                                marginHorizontal: 10
                            }}
                            inputContainerStyle={{ borderBottomColor: AppStyles.colorBlue.color, borderBottomWidth: 1 }}
                            value={this.state.buyers_id_value}
                            onChangeText={(value, key) => this.onDropdownPress('itemsBuyers', key, 'buyers_id')}
                        />
                        {this.state.error_buyers_id ? (
                            <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                * Please select buyers to proceed.
                            </Text>
                        ) : null}
                        <Text style={{ ...styles.text_title, textAlign: 'center', marginBottom: 10 }}>OR</Text>

                        <TouchableOpacity style={{ ...AppStyles.button, position: 'relative' }} activeOpacity={.5} onPress={this.toggleModalBuyer}>
                            <Text style={AppStyles.buttonText}> Add Buyer </Text>
                        </TouchableOpacity>
                    </View>
                }

                {this.state.screen4 &&
                    <View>
                        <Text style={styles.text_title}>Co-Buyer</Text>
                        <Text style={styles.text}>Select Co-Buyer</Text>
                        <TextInput
                            style={styles.textInput}
                            editable={false}
                            value={this.state.cobuyers_id_value}
                        />
                        <Text style={{ ...styles.text_title, textAlign: 'center', marginBottom: 10 }}>OR</Text>

                        <TouchableOpacity style={{ ...AppStyles.button, position: 'relative' }} activeOpacity={.5} onPress={this.toggleModalCoBuyer}>
                            <Text style={AppStyles.buttonText}> Add Co-Buyer </Text>
                        </TouchableOpacity>
                    </View>
                }

                {this.state.screen5 &&
                    <View>
                        <Text style={styles.text_title}>Insurance</Text>
                        <Text style={styles.text}>Select Insurance</Text>
                        <TextInput
                            style={styles.textInput}
                            editable={false}
                            value={this.state.insurance_buyers_id_value}
                        />
                        <Text style={{ ...styles.text_title, textAlign: 'center', marginBottom: 10 }}>OR</Text>

                        <TouchableOpacity style={{ ...AppStyles.button, position: 'relative' }} activeOpacity={.5} onPress={this.toggleModalInsurance}>
                            <Text style={AppStyles.buttonText}> Add Insurance </Text>
                        </TouchableOpacity>
                    </View>
                }

                {this.state.screen6 &&
                    <View style={{ paddingBottom: 200 }}>
                        <Text style={styles.text_title}>Calculator</Text>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={{ paddingBottom: 80 }}>
                                <Text style={styles.text}>Vehicle Price</Text>
                                <TextInput
                                    ref={(input) => { this.math_salepriceTextInput = input; }}
                                    style={styles.textInput}
                                    editable
                                    keyboardType="numeric"
                                    value={this.state.math_saleprice}
                                    onChangeText={(text) => this.autocalculatersd(text, 'math_saleprice')}
                                />
                                {this.state.errormath_saleprice ? (
                                    <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                        * Please enter saleprice to proceed.
                                    </Text>
                                ) : null}

                                <Text style={styles.text}>Down Payment</Text>
                                <TextInput
                                    ref={(input) => { this.math_cashcreditTextInput = input; }}
                                    style={styles.textInput}
                                    editable
                                    keyboardType="numeric"
                                    value={this.state.math_cashcredit}
                                    onChangeText={(text) => this.autocalculatersd(text, 'math_cashcredit')}
                                />
                                {this.state.errormath_cashcredit ? (
                                    <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                        * Please enter down payment to proceed.
                                    </Text>
                                ) : null}

                                <Text style={styles.text}>Trade In Credit</Text>
                                <TextInput
                                    ref={(input) => { this.math_tradecreditTextInput = input; }}
                                    style={styles.textInput}
                                    editable
                                    keyboardType="numeric"
                                    value={this.state.math_tradecredit}
                                    onChangeText={(text) => this.autocalculatersd(text, 'math_tradecredit')}
                                />
                                {this.state.errormath_tradecredit ? (
                                    <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                        * Please enter trade in credit to proceed.
                                    </Text>
                                ) : null}

                                <Text style={styles.text}>GA TAVT Price</Text>
                                <TextInput
                                    style={styles.textInput}
                                    editable
                                    keyboardType="numeric"
                                    value={this.state.math_tavtprice}
                                    onChangeText={(text) => this.autocalculatersd(text, 'math_tavtprice')}
                                />
                                {this.state.errormath_tavtprice ? (
                                    <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                        * Please enter tavt price to proceed.
                                    </Text>
                                ) : null}

                                <Text style={styles.text}>Tax Rate(ex 7)</Text>
                                <TextInput
                                    ref={(input) => { this.taxrateTextInput = input; }}
                                    style={styles.textInput}
                                    editable
                                    keyboardType="numeric"
                                    value={this.state.taxrate}
                                    onChangeText={(text) => this.autocalculatersd(text, 'taxrate')}
                                />
                                {this.state.errortaxrate ? (
                                    <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                        * Please enter tax rate to proceed.
                                    </Text>
                                ) : null}

                                <Text style={styles.text}>Service Fee</Text>
                                <TextInput
                                    ref={(input) => { this.servicefeeTextInput = input; }}
                                    style={styles.textInput}
                                    editable
                                    keyboardType="numeric"
                                    value={this.state.servicefee}
                                    onChangeText={(text) => this.autocalculatersd(text, 'servicefee')}
                                />
                                {this.state.errorservicefee ? (
                                    <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                        * Please enter service fee to proceed.
                                    </Text>
                                ) : null}

                                <Text style={styles.text}>Tag/Registration</Text>
                                <TextInput
                                    ref={(input) => { this.tagregistrationTextInput = input; }}
                                    style={styles.textInput}
                                    editable
                                    keyboardType="numeric"
                                    value={this.state.tagregistration}
                                    onChangeText={(text) => this.autocalculatersd(text, 'tagregistration')}
                                />
                                {this.state.errortagregistration ? (
                                    <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                        * Please enter tag/registration to proceed.
                                    </Text>
                                ) : null}

                                <Text style={styles.text}>Tax Due</Text>
                                <TextInput
                                    style={styles.textInput}
                                    editable={false}
                                    value={this.state.math_taxdue}
                                />

                                <Text style={styles.text}>Total Due</Text>
                                <TextInput
                                    style={styles.textInput}
                                    editable={false}
                                    value={this.state.math_totaldue}
                                />

                                <TouchableOpacity style={{ ...AppStyles.button, position: 'relative', marginTop: 10 }} activeOpacity={.5} onPress={() => this.updatemathinfo()}>
                                    <Text style={AppStyles.buttonText}> Submit Sale/Deal/Price </Text>
                                </TouchableOpacity>

                                <Text style={styles.text_title}>Bobby's Payment Calculator</Text>

                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                    <Checkbox
                                        status={this.state.calc_cb_monthly}
                                        color={AppStyles.colorBlue.color}
                                        onPress={() => this.changeCheckBox('calc_cb_monthly', 'monthly')}
                                    />
                                    <Text style={styles.checkboxtext}>Monthly</Text>

                                    <Checkbox
                                        status={this.state.calc_cb_biweekly}
                                        color={AppStyles.colorBlue.color}
                                        onPress={() => this.changeCheckBox('calc_cb_biweekly', 'biweekly')}
                                    />
                                    <Text style={styles.checkboxtext}>Bi-weekly</Text>
                                </View>

                                <Text style={styles.text}>Amount to Finance</Text>
                                <TextInput
                                    style={styles.textInput}
                                    editable
                                    numeric
                                    keyboardType="numeric"
                                    value={this.state.calc_amountToFinance}
                                    onChangeText={(text) => this.onChangeTextForCalc(text, 'calc_amountToFinance')}
                                />
                                {this.state.error_calc_amountToFinance ? (
                                    <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                        * Please enter amount finance to proceed.
                                    </Text>
                                ) : null}

                                <Text style={styles.text}>Down Payment</Text>
                                <TextInput
                                    style={styles.textInput}
                                    editable
                                    keyboardType="numeric"
                                    value={this.state.calc_downpayment}
                                    onChangeText={(text) => this.onChangeTextForCalc(text, 'calc_downpayment')}
                                />

                                <Text style={styles.text}>Loan Length</Text>
                                <Dropdown
                                    style={{ fontSize: 16, fontFamily: 'poppinsRegular', color: AppStyles.colorBlue.color }}
                                    data={loanLength}
                                    animationDuration={100}
                                    itemTextStyle={{ fontFamily: 'poppinsRegular' }}
                                    useNativeDriver={true}
                                    containerStyle={{
                                        marginTop: -25,
                                        marginHorizontal: 10
                                    }}
                                    inputContainerStyle={{ borderBottomColor: AppStyles.colorBlue.color, borderBottomWidth: 1 }}
                                    onChangeText={(value, key) => this.onSelectLoanLenthPress(key, 'calc_loanLength')}
                                />
                                {this.state.error_calc_loanLength ? (
                                    <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                        * Please select loan length to proceed.
                                    </Text>
                                ) : null}

                                <Text style={styles.text}>Interest Rate</Text>
                                <TextInput
                                    style={styles.textInput}
                                    editable
                                    keyboardType="numeric"
                                    value={this.state.calc_interestRate}
                                    onChangeText={(text) => this.onChangeTextForCalc(text, 'calc_interestRate')}
                                />
                                {this.state.error_calc_interestRate ? (
                                    <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                        * Please enter interest rate to proceed.
                                    </Text>
                                ) : null}


                                <View style={{ backgroundColor: AppStyles.colorOrange.color, height: 0, marginTop: 15 }}></View>

                                {/* Monthly Payment */}
                                {this.state.calc_cb_monthly == "checked" &&
                                    <View style={{ flexDirection: "row", marginHorizontal: 10, display: 'flex' }}>
                                        <Text style={styles.textLeft}>Payment</Text>
                                        <Text style={styles.textRight}>${this.state.calc_monthlyPay}</Text>
                                    </View>
                                }

                                {/* Bi-Weekly Payment */}
                                {this.state.calc_cb_biweekly == "checked" &&
                                    <View style={{ flexDirection: "row", marginHorizontal: 10 }}>
                                        <Text style={styles.textLeft}>Payment</Text>
                                        <Text style={styles.textRight}>${this.state.calc_biweeklyPay}</Text>
                                    </View>
                                }

                                {/* Monthly payments interest */}
                                {this.state.calc_cb_monthly == "checked" &&
                                    <View style={{ flexDirection: "row", marginHorizontal: 10 }}>
                                        <Text style={styles.textLeft}>Payments interest</Text>
                                        <Text style={styles.textRight}>${this.state.calc_totalInterest}</Text>
                                    </View>
                                }

                                {/* Bi-weekly payments interest */}
                                {this.state.calc_cb_biweekly == "checked" &&
                                    <View style={{ flexDirection: "row", marginHorizontal: 10 }}>
                                        <Text style={styles.textLeft}>Payments interest</Text>
                                        <Text style={styles.textRight}>${this.state.calc_biweekly_interest}</Text>
                                    </View>
                                }

                                {/* Monthly total payment */}
                                {this.state.calc_cb_monthly == "checked" &&
                                    <View style={{ flexDirection: "row", marginHorizontal: 10 }}>
                                        <Text style={styles.textLeft}>Total payment</Text>
                                        <Text style={styles.textRight}>${this.state.calc_monthlytotalPayment}</Text>
                                    </View>
                                }

                                {/* Monthly total payment */}
                                {this.state.calc_cb_biweekly == "checked" &&
                                    <View style={{ flexDirection: "row", marginHorizontal: 10 }}>
                                        <Text style={styles.textLeft}>Total payment</Text>
                                        <Text style={styles.textRight}>${this.state.calc_biweeklytotalPayment}</Text>
                                    </View>
                                }

                            </View>
                        </ScrollView>

                    </View>
                }

                {this.state.screen7 &&
                    <View style={{ paddingBottom: 190 }}>

                        <Text style={styles.text_title}>Review</Text>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={{ paddingBottom: 100 }}>
                                <TouchableOpacity style={{ ...AppStyles.button, width: '95%', position: 'relative', marginTop: 10 }} activeOpacity={.5}
                                    onPress={this.toggleModalPrint}>
                                    <Text style={AppStyles.buttonText}> Print All Forms </Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={{ ...AppStyles.button, width: '95%', position: 'relative' }} activeOpacity={.5}
                                    onPress={this.toggleModalContract}>
                                    <Text style={AppStyles.buttonText}> Print BHPH Contract </Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={{ ...AppStyles.button, width: '95%', position: 'relative' }} disabled={this.state.btn_disable_dealsave} activeOpacity={.5} onPress={() => this.insertdeal_save()}>
                                    <Text style={AppStyles.buttonText}> Save </Text>
                                </TouchableOpacity>

                                {this.state.transact_status == "pending_print" ?
                                    <TouchableOpacity style={{ ...AppStyles.button, width: '95%', position: 'relative' }} disabled={this.state.btn_disable_dealnotsave} activeOpacity={.5} onPress={() => this.deal_not_save()}>
                                        <Text style={AppStyles.buttonText}> Deal Not Closed </Text>
                                    </TouchableOpacity>
                                    : null
                                }
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
                                        <TextInput
                                            ref={(input) => { this.sd_main_buyers_first_nameTextInput = input; }}
                                            style={styles.textInput}
                                            editable
                                            keyboardType="default"
                                            value={this.state.sd_main_buyers_first_name}
                                            onChangeText={(text) => this.onModelChangeText(text, 'sd_main_buyers_first_name')}
                                        />
                                        {this.state.errorsd_main_buyers_first_name ? (
                                            <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                                * Please enter first name to proceed.
                                            </Text>
                                        ) : null}

                                        <Text style={styles.text}>Buyer Middle Name</Text>
                                        <TextInput
                                            ref={(input) => { this.sd_main_buyers_mid_nameTextInput = input; }}
                                            style={styles.textInput}
                                            editable
                                            keyboardType="default"
                                            value={this.state.sd_main_buyers_mid_name}
                                            onChangeText={(text) => this.onModelChangeText(text, 'sd_main_buyers_mid_name')}
                                        />

                                        <Text style={styles.text}>Buyer Last Name</Text>
                                        <TextInput
                                            ref={(input) => { this.sd_main_buyers_last_nameTextInput = input; }}
                                            style={styles.textInput}
                                            editable
                                            keyboardType="default"
                                            value={this.state.sd_main_buyers_last_name}
                                            onChangeText={(text) => this.onModelChangeText(text, 'sd_main_buyers_last_name')}
                                        />
                                        {this.state.errorsd_main_buyers_last_name ? (
                                            <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                                * Please enter last name to proceed.
                                            </Text>
                                        ) : null}

                                        <Text style={styles.text}>Buyer Address</Text>
                                        <TextInput
                                            ref={(input) => { this.sd_main_buyers_addressTextInput = input; }}
                                            style={styles.textInput}
                                            editable
                                            keyboardType="default"
                                            value={this.state.sd_main_buyers_address}
                                            onChangeText={(text) => this.onModelChangeText(text, 'sd_main_buyers_address')}
                                        />
                                        {this.state.errorsd_main_buyers_address ? (
                                            <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                                * Please enter address to proceed.
                                            </Text>
                                        ) : null}

                                        <Text style={styles.text}>Buyer City</Text>
                                        <TextInput
                                            ref={(input) => { this.sd_main_buyers_cityTextInput = input; }}
                                            style={styles.textInput}
                                            editable
                                            keyboardType="default"
                                            value={this.state.sd_main_buyers_city}
                                            onChangeText={(text) => this.onModelChangeText(text, 'sd_main_buyers_city')}
                                        />
                                        {this.state.errorsd_main_buyers_city ? (
                                            <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                                * Please enter city to proceed.
                                            </Text>
                                        ) : null}

                                        <Text style={styles.text}>Buyer State</Text>
                                        <Dropdown
                                            ref={(input) => { this.sd_main_buyers_stateTextInput = input; }}
                                            style={{ fontSize: 16, fontFamily: 'poppinsRegular', color: AppStyles.colorBlue.color, marginTop: 5 }}
                                            data={STATE}
                                            animationDuration={100}
                                            itemTextStyle={{ fontFamily: 'poppinsRegular' }}
                                            containerStyle={{
                                                marginTop: -25,
                                                marginHorizontal: 10
                                            }}
                                            inputContainerStyle={{ borderBottomColor: AppStyles.colorBlue.color, borderBottomWidth: 1 }}
                                            value={this.state.sd_main_buyers_state}
                                            onChangeText={(value, key) => this.onStatePress(value, 'sd_main_buyers_state')}
                                        />
                                        {this.state.errorsd_main_buyers_state ? (
                                            <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                                * Please enter state to proceed.
                                            </Text>
                                        ) : null}

                                        <Text style={styles.text}>Buyer Zip</Text>
                                        <TextInput
                                            ref={(input) => { this.sd_main_buyers_zipTextInput = input; }}
                                            style={styles.textInput}
                                            editable
                                            keyboardType="numeric"
                                            value={this.state.sd_main_buyers_zip}
                                            onChangeText={(text) => this.onModelChangeText(text, 'sd_main_buyers_zip')}
                                        />
                                        {this.state.errorsd_main_buyers_zip ? (
                                            <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                                * Please enter zip to proceed.
                                            </Text>
                                        ) : null}

                                        <Text style={styles.text}>Buyer Country</Text>
                                        <TextInput
                                            ref={(input) => { this.sd_main_buyers_countryTextInput = input; }}
                                            style={styles.textInput}
                                            editable
                                            keyboardType="default"
                                            value={this.state.sd_main_buyers_country}
                                            onChangeText={(text) => this.onModelChangeText(text, 'sd_main_buyers_country')}
                                        />
                                        {this.state.errorsd_main_buyers_country ? (
                                            <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                                * Please enter country to proceed.
                                            </Text>
                                        ) : null}

                                        <Text style={styles.text}>Buyer Email</Text>
                                        <TextInput
                                            ref={(input) => { this.sd_main_buyers_emailTextInput = input; }}
                                            style={styles.textInput}
                                            editable
                                            keyboardType="email-address"
                                            value={this.state.sd_main_buyers_email}
                                            onChangeText={(text) => this.onModelChangeText(text, 'sd_main_buyers_email')}
                                        />
                                        {this.state.errorsd_main_buyers_email ? (
                                            <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                                * Please enter email to proceed.
                                            </Text>
                                        ) : null}

                                        <Text style={styles.text}>Buyer Work Phone</Text>
                                        <TextInput
                                            ref={(input) => { this.sd_main_buyers_work_phoneTextInput = input; }}
                                            style={styles.textInput}
                                            editable
                                            keyboardType="numeric"
                                            value={this.state.sd_main_buyers_work_phone}
                                            onChangeText={(text) => this.onModelChangeText(text, 'sd_main_buyers_work_phone')}
                                        />
                                        {this.state.errorsd_main_buyers_work_phone ? (
                                            <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                                * Please enter work phone to proceed.
                                            </Text>
                                        ) : null}

                                        <Text style={styles.text}>Buyer Home Phone</Text>
                                        <TextInput
                                            ref={(input) => { this.sd_main_buyers_home_phoneTextInput = input; }}
                                            style={styles.textInput}
                                            editable
                                            keyboardType="numeric"
                                            value={this.state.sd_main_buyers_home_phone}
                                            onChangeText={(text) => this.onModelChangeText(text, 'sd_main_buyers_home_phone')}
                                        />


                                        <Text style={styles.text}>Buyer Mobile</Text>
                                        <TextInput
                                            ref={(input) => { this.sd_main_buyers_mobileTextInput = input; }}
                                            style={styles.textInput}
                                            editable
                                            keyboardType="numeric"
                                            value={this.state.sd_main_buyers_mobile}
                                            onChangeText={(text) => this.onModelChangeText(text, 'sd_main_buyers_mobile')}
                                        />

                                        <Text style={styles.text}>Buyer DL State</Text>
                                        <Dropdown
                                            ref={(input) => { this.sd_main_buyers_dl_stateTextInput = input; }}
                                            style={{ fontSize: 16, fontFamily: 'poppinsRegular', color: AppStyles.colorBlue.color, marginTop: 5 }}
                                            data={STATE}
                                            animationDuration={100}
                                            itemTextStyle={{ fontFamily: 'poppinsRegular' }}
                                            containerStyle={{
                                                marginTop: -25,
                                                marginHorizontal: 10
                                            }}
                                            inputContainerStyle={{ borderBottomColor: AppStyles.colorBlue.color, borderBottomWidth: 1 }}
                                            value={this.state.sd_main_buyers_dl_state}
                                            onChangeText={(value, key) => this.onStatePress(value, 'sd_main_buyers_dl_state')}
                                        />
                                        {this.state.errorsd_main_buyers_dl_state ? (
                                            <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                                * Please enter dl state to proceed.
                                            </Text>
                                        ) : null}

                                        <Text style={styles.text}>Drivers License Number</Text>
                                        <TextInput
                                            ref={(input) => { this.sd_main_dl_numberTextInput = input; }}
                                            style={styles.textInput}
                                            editable
                                            keyboardType="default"
                                            value={this.state.sd_main_dl_number}
                                            onChangeText={(text) => this.onModelChangeText(text, 'sd_main_dl_number')}
                                        />
                                        {this.state.errorsd_main_dl_number ? (
                                            <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                                * Please enter dl number to proceed.
                                            </Text>
                                        ) : null}

                                        <Text style={styles.text}>Buyer DL Expire</Text>
                                        <DatePicker
                                            style={{ alignItems: 'flex-start', width: Dimensions.get("window").width / 1.06, marginHorizontal: 10 }}
                                            date={this.state.sd_main_buyers_dl_expire} //initial date from state
                                            mode="date" //The enum of date, datetime and time
                                            // placeholder="dob"
                                            format="MM/DD/YYYY"
                                            minDate="01/01/2020"
                                            maxDate="01/01/2099"
                                            confirmBtnText="Confirm"
                                            cancelBtnText="Cancel"
                                            customStyles={{
                                                dateIcon: { display: 'none', },
                                                dateInput: AppStyles.dateInput,
                                                dateText: AppStyles.dateText,
                                            }}
                                            onDateChange={(date) => { this.setState({ sd_main_buyers_dl_expire: date }); }}
                                        />
                                        <View style={{ backgroundColor: AppStyles.colorBlue.color, height: 1, marginHorizontal: 10 }}></View>

                                        <Text style={styles.text}>Buyer DL Date of Birth</Text>
                                        <DatePicker
                                            style={{ alignItems: 'flex-start', width: Dimensions.get("window").width / 1.06, marginHorizontal: 10 }}
                                            date={this.state.sd_main_buyers_dl_dob} //initial date from state
                                            mode="date" //The enum of date, datetime and time
                                            // placeholder="dob"
                                            format="MM/DD/YYYY"
                                            minDate="01/01/1901"
                                            maxDate="01/01/2020"
                                            confirmBtnText="Confirm"
                                            cancelBtnText="Cancel"
                                            customStyles={{
                                                dateIcon: { display: 'none', },
                                                dateInput: AppStyles.dateInput,
                                                dateText: AppStyles.dateText,
                                            }}
                                            onDateChange={(date) => { this.setState({ sd_main_buyers_dl_dob: date }); }}
                                        />
                                        <View style={{ backgroundColor: AppStyles.colorBlue.color, height: 1, marginHorizontal: 10 }}></View>

                                        <Text style={styles.text}>Buyer Tag Number</Text>
                                        <TextInput
                                            style={styles.textInput}
                                            editable
                                            keyboardType="default"
                                            value={this.state.sd_main_buyers_tag_number}
                                            onChangeText={(text) => this.onModelChangeText(text, 'sd_main_buyers_tag_number')}
                                        />

                                        <TouchableOpacity style={{ ...AppStyles.button, width: '95%', position: 'relative', marginTop: 10 }} activeOpacity={.5} onPress={() => this.updatebuyers_sd_main()}>
                                            <Text style={AppStyles.buttonText}> Update Buyer </Text>
                                        </TouchableOpacity>
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
                                        <TextInput
                                            ref={(input) => { this.sd_main_inv_vinTextInput = input; }}
                                            style={styles.textInput}
                                            editable
                                            keyboardType="default"
                                            value={this.state.sd_main_inv_vin}
                                            onChangeText={(text) => this.onModelChangeText(text, 'sd_main_inv_vin')}
                                        />
                                        {this.state.errorsd_main_inv_vin ? (
                                            <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                                * Please enter vin to proceed.
                                            </Text>
                                        ) : null}

                                        <Text style={styles.text}>Year</Text>
                                        <TextInput
                                            ref={(input) => { this.sd_main_inv_yearTextInput = input; }}
                                            style={styles.textInput}
                                            editable
                                            keyboardType="numeric"
                                            value={this.state.sd_main_inv_year}
                                            onChangeText={(text) => this.onModelChangeText(text, 'sd_main_inv_year')}
                                        />
                                        {this.state.errorsd_main_inv_year ? (
                                            <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                                * Please enter year to proceed.
                                            </Text>
                                        ) : null}

                                        <Text style={styles.text}>Make</Text>
                                        <TextInput
                                            ref={(input) => { this.sd_main_inv_makeTextInput = input; }}
                                            style={styles.textInput}
                                            editable
                                            keyboardType="default"
                                            value={this.state.sd_main_inv_make}
                                            onChangeText={(text) => this.onModelChangeText(text, 'sd_main_inv_make')}
                                        />
                                        {this.state.errorsd_main_inv_make ? (
                                            <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                                * Please enter make to proceed.
                                            </Text>
                                        ) : null}

                                        <Text style={styles.text}>Model</Text>
                                        <TextInput
                                            ref={(input) => { this.sd_main_inv_modelTextInput = input; }}
                                            style={styles.textInput}
                                            editable
                                            keyboardType="default"
                                            value={this.state.sd_main_inv_model}
                                            onChangeText={(text) => this.onModelChangeText(text, 'sd_main_inv_model')}
                                        />
                                        {this.state.errorsd_main_inv_model ? (
                                            <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                                * Please enter model to proceed.
                                            </Text>
                                        ) : null}

                                        <Text style={styles.text}>Style</Text>
                                        <TextInput
                                            ref={(input) => { this.sd_main_inv_styleTextInput = input; }}
                                            style={styles.textInput}
                                            editable
                                            keyboardType="default"
                                            value={this.state.sd_main_inv_style}
                                            onChangeText={(text) => this.onModelChangeText(text, 'sd_main_inv_style')}
                                        />
                                        {this.state.errorsd_main_inv_style ? (
                                            <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                                * Please enter style to proceed.
                                            </Text>
                                        ) : null}

                                        <Text style={styles.text}>Stock Number</Text>
                                        <TextInput
                                            ref={(input) => { this.sd_main_inv_stockNumberTextInput = input; }}
                                            style={styles.textInput}
                                            editable
                                            keyboardType="default"
                                            value={this.state.sd_main_inv_stockNumber}
                                            onChangeText={(text) => this.onModelChangeText(text, 'sd_main_inv_stockNumber')}
                                        />
                                        {this.state.errorsd_main_inv_stockNumber ? (
                                            <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                                * Please enter stock number to proceed.
                                            </Text>
                                        ) : null}

                                        <Text style={styles.text}>Color</Text>
                                        <TextInput
                                            ref={(input) => { this.sd_main_inv_colorTextInput = input; }}
                                            style={styles.textInput}
                                            editable
                                            keyboardType="default"
                                            value={this.state.sd_main_inv_color}
                                            onChangeText={(text) => this.onModelChangeText(text, 'sd_main_inv_color')}
                                        />
                                        {this.state.errorsd_main_inv_color ? (
                                            <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                                * Please enter color to proceed.
                                            </Text>
                                        ) : null}

                                        <Text style={styles.text}>Mileage</Text>
                                        <TextInput
                                            ref={(input) => { this.sd_main_inv_mileageTextInput = input; }}
                                            style={styles.textInput}
                                            editable
                                            keyboardType="numeric"
                                            value={this.state.sd_main_inv_mileage}
                                            onChangeText={(text) => this.onModelChangeText(text, 'sd_main_inv_mileage')}
                                        />
                                        {this.state.errorsd_main_inv_mileage ? (
                                            <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                                * Please enter mileage to proceed.
                                            </Text>
                                        ) : null}

                                        <View style={{ flexDirection: 'row' }}>
                                            <Checkbox
                                                status={this.state.sd_main_inv_exempt}
                                                color={AppStyles.colorBlue.color}
                                                onPress={() => this.changeCheckBoxForExempt('sd_main_inv_exempt', 'errorsd_main_inv_mileage')}
                                            />
                                            <Text style={styles.checkboxtextexempt}>Exempt</Text>
                                        </View>

                                        <Text style={styles.text}>Cost</Text>
                                        <TextInput
                                            ref={(input) => { this.sd_main_inv_costTextInput = input; }}
                                            style={styles.textInput}
                                            editable
                                            keyboardType="numeric"
                                            value={this.state.sd_main_inv_cost}
                                            onChangeText={(text) => this.onModelChangeText(text, 'sd_main_inv_cost')}
                                        />
                                        {this.state.errorsd_main_inv_cost ? (
                                            <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                                * Please enter cost to proceed.
                                            </Text>
                                        ) : null}

                                        <Text style={styles.text}>Added Cost</Text>
                                        <TextInput
                                            ref={(input) => { this.sd_main_inv_addedCostTextInput = input; }}
                                            style={styles.textInput}
                                            editable
                                            keyboardType="numeric"
                                            value={this.state.sd_main_inv_addedCost}
                                            onChangeText={(text) => this.onModelChangeText(text, 'sd_main_inv_addedCost')}
                                        />
                                        {this.state.errorsd_main_inv_addedCost ? (
                                            <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                                * Please enter addedcost to proceed.
                                            </Text>
                                        ) : null}

                                        <Text style={styles.text}>Total Cost</Text>
                                        <TextInput
                                            style={styles.textInput}
                                            editable={false}
                                            value={this.state.sd_main_inv_totalCost}
                                        />

                                        <Text style={styles.text}>Vehicle Price</Text>
                                        <TextInput
                                            ref={(input) => { this.sd_main_inv_vehiclePriceTextInput = input; }}
                                            style={styles.textInput}
                                            editable
                                            keyboardType="numeric"
                                            value={this.state.sd_main_inv_vehiclePrice}
                                            onChangeText={(text) => this.onModelChangeText(text, 'sd_main_inv_vehiclePrice')}
                                        />
                                        {this.state.errorsd_main_inv_vehiclePrice ? (
                                            <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                                * Please enter vehicle price to proceed.
                                            </Text>
                                        ) : null}

                                        <TouchableOpacity style={{ ...AppStyles.button, width: '95%', position: 'relative', marginTop: 10 }} activeOpacity={.5} onPress={() => this.updateinventory_sd_main()}>
                                            <Text style={AppStyles.buttonText}> Update Inventory </Text>
                                        </TouchableOpacity>
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
                                        <TextInput
                                            ref={(input) => { this.sd_main_trade_inv_vinTextInput = input; }}
                                            style={styles.textInput}
                                            editable
                                            keyboardType="default"
                                            value={this.state.sd_main_trade_inv_vin}
                                            onChangeText={(text) => this.onModelChangeText(text, 'sd_main_trade_inv_vin')}
                                        />
                                        {this.state.errorsd_main_trade_inv_vin ? (
                                            <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                                * Please enter vin to proceed.
                                            </Text>
                                        ) : null}

                                        <Text style={styles.text}>Year</Text>
                                        <TextInput
                                            ref={(input) => { this.sd_main_trade_inv_yearTextInput = input; }}
                                            style={styles.textInput}
                                            editable
                                            keyboardType="default"
                                            value={this.state.sd_main_trade_inv_year}
                                            onChangeText={(text) => this.onModelChangeText(text, 'sd_main_trade_inv_year')}
                                        />
                                        {this.state.errorsd_main_trade_inv_year ? (
                                            <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                                * Please enter year to proceed.
                                            </Text>
                                        ) : null}

                                        <Text style={styles.text}>Make</Text>
                                        <TextInput
                                            ref={(input) => { this.sd_main_trade_inv_makeTextInput = input; }}
                                            style={styles.textInput}
                                            editable
                                            keyboardType="default"
                                            value={this.state.sd_main_trade_inv_make}
                                            onChangeText={(text) => this.onModelChangeText(text, 'sd_main_trade_inv_make')}
                                        />
                                        {this.state.errorsd_main_trade_inv_make ? (
                                            <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                                * Please enter make to proceed.
                                            </Text>
                                        ) : null}

                                        <Text style={styles.text}>Model</Text>
                                        <TextInput
                                            ref={(input) => { this.sd_main_trade_inv_modelTextInput = input; }}
                                            style={styles.textInput}
                                            editable
                                            keyboardType="default"
                                            value={this.state.sd_main_trade_inv_model}
                                            onChangeText={(text) => this.onModelChangeText(text, 'sd_main_trade_inv_model')}
                                        />
                                        {this.state.errorsd_main_trade_inv_model ? (
                                            <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                                * Please enter model to proceed.
                                            </Text>
                                        ) : null}

                                        <Text style={styles.text}>Style</Text>
                                        <TextInput
                                            ref={(input) => { this.sd_main_trade_inv_styleTextInput = input; }}
                                            style={styles.textInput}
                                            editable
                                            keyboardType="default"
                                            value={this.state.sd_main_trade_inv_style}
                                            onChangeText={(text) => this.onModelChangeText(text, 'sd_main_trade_inv_style')}
                                        />
                                        {this.state.errorsd_main_trade_inv_style ? (
                                            <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                                * Please enter style to proceed.
                                            </Text>
                                        ) : null}

                                        <Text style={styles.text}>Color</Text>
                                        <TextInput
                                            ref={(input) => { this.sd_main_trade_inv_colorTextInput = input; }}
                                            style={styles.textInput}
                                            editable
                                            keyboardType="default"
                                            value={this.state.sd_main_trade_inv_color}
                                            onChangeText={(text) => this.onModelChangeText(text, 'sd_main_trade_inv_color')}
                                        />
                                        {this.state.errorsd_main_trade_inv_color ? (
                                            <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                                * Please enter color to proceed.
                                            </Text>
                                        ) : null}

                                        <Text style={styles.text}>Mileage</Text>
                                        <TextInput
                                            ref={(input) => { this.sd_main_trade_inv_mileageTextInput = input; }}
                                            style={styles.textInput}
                                            editable
                                            keyboardType="numeric"
                                            value={this.state.sd_main_trade_inv_mileage}
                                            onChangeText={(text) => this.onModelChangeText(text, 'sd_main_trade_inv_mileage')}
                                        />
                                        {this.state.errorsd_main_trade_inv_mileage ? (
                                            <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                                * Please enter mileage to proceed.
                                            </Text>
                                        ) : null}

                                        <View style={{ flexDirection: 'row' }}>
                                            <Checkbox
                                                status={this.state.sd_main_trade_inv_exempt}
                                                color={AppStyles.colorBlue.color}
                                                onPress={() => this.changeCheckBoxForExempt('sd_main_trade_inv_exempt', 'errorsd_main_trade_inv_mileage')}
                                            />
                                            <Text style={styles.checkboxtextexempt}>Exempt</Text>
                                        </View>

                                        <Text style={styles.text}>Trade Allowance</Text>
                                        <TextInput
                                            ref={(input) => { this.sd_main_trade_inv_priceTextInput = input; }}
                                            style={styles.textInput}
                                            editable
                                            keyboardType="numeric"
                                            value={this.state.sd_main_trade_inv_price}
                                            onChangeText={(text) => this.onModelChangeText(text, 'sd_main_trade_inv_price')}
                                        />
                                        {this.state.errorsd_main_trade_inv_price ? (
                                            <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                                * Please enter trade allowance to proceed.
                                            </Text>
                                        ) : null}

                                        <TouchableOpacity style={{ ...AppStyles.button, width: '95%', position: 'relative', marginTop: 10 }} activeOpacity={.5} onPress={() => this.updatetrade_sd_main()}>
                                            <Text style={AppStyles.buttonText}> Update Trade </Text>
                                        </TouchableOpacity>
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
                                        <TextInput
                                            ref={(input) => { this.sd_main_math_salepriceTextInput = input; }}
                                            style={styles.textInput}
                                            editable
                                            keyboardType="numeric"
                                            value={this.state.sd_main_math_saleprice}
                                            onChangeText={(text) => this.onModelChangeText(text, 'sd_main_math_saleprice')}
                                        />
                                        {this.state.errorsd_main_math_saleprice ? (
                                            <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                                * Please enter sale price to proceed.
                                            </Text>
                                        ) : null}

                                        <Text style={styles.text}>Cash Down</Text>
                                        <TextInput
                                            ref={(input) => { this.sd_main_math_cashcreditTextInput = input; }}
                                            style={styles.textInput}
                                            editable
                                            keyboardType="numeric"
                                            value={this.state.sd_main_math_cashcredit}
                                            onChangeText={(text) => this.onModelChangeText(text, 'sd_main_math_cashcredit')}
                                        />
                                        {this.state.errorsd_main_math_cashcredit ? (
                                            <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                                * Please enter cash down to proceed.
                                            </Text>
                                        ) : null}

                                        <Text style={styles.text}>Trade In Credit</Text>
                                        <TextInput
                                            ref={(input) => { this.sd_main_math_tradecreditTextInput = input; }}
                                            style={styles.textInput}
                                            editable
                                            keyboardType="numeric"
                                            value={this.state.sd_main_math_tradecredit}
                                            onChangeText={(text) => this.onModelChangeText(text, 'sd_main_math_tradecredit')}
                                        />
                                        {this.state.errorsd_main_math_tradecredit ? (
                                            <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                                * Please enter trade in credit to proceed.
                                            </Text>
                                        ) : null}

                                        <Text style={styles.text}>Service Fee</Text>
                                        <TextInput
                                            ref={(input) => { this.sd_main_math_servicefeeTextInput = input; }}
                                            style={styles.textInput}
                                            editable
                                            keyboardType="numeric"
                                            value={this.state.sd_main_math_servicefee}
                                            onChangeText={(text) => this.onModelChangeText(text, 'sd_main_math_servicefee')}
                                        />
                                        {this.state.errorsd_main_math_servicefee ? (
                                            <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                                * Please enter service fee to proceed.
                                            </Text>
                                        ) : null}

                                        <Text style={styles.text}>Tag/Registration</Text>
                                        <TextInput
                                            ref={(input) => { this.sd_main_math_tagregistrationTextInput = input; }}
                                            style={styles.textInput}
                                            editable
                                            keyboardType="numeric"
                                            value={this.state.sd_main_math_tagregistration}
                                            onChangeText={(text) => this.onModelChangeText(text, 'sd_main_math_tagregistration')}
                                        />
                                        {this.state.errorsd_main_math_tagregistration ? (
                                            <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                                * Please enter tag/registration to proceed.
                                            </Text>
                                        ) : null}

                                        <Text style={styles.text}>Total Tax</Text>
                                        <TextInput
                                            ref={(input) => { this.sd_main_math_taxdueTextInput = input; }}
                                            style={styles.textInput}
                                            editable
                                            keyboardType="default"
                                            value={this.state.sd_main_math_taxdue}
                                            onChangeText={(text) => this.onModelChangeText(text, 'sd_main_math_taxdue')}
                                        />
                                        {this.state.errorsd_main_math_taxdue ? (
                                            <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                                * Please enter total tax to proceed.
                                            </Text>
                                        ) : null}

                                        <Text style={styles.text}>Total Due</Text>
                                        <TextInput
                                            ref={(input) => { this.sd_main_math_totaldueTextInput = input; }}
                                            style={styles.textInput}
                                            editable
                                            keyboardType="default"
                                            value={this.state.sd_main_math_totaldue}
                                            onChangeText={(text) => this.onModelChangeText(text, 'sd_main_math_totaldue')}
                                        />
                                        {this.state.errorsd_main_math_totaldue ? (
                                            <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                                                * Please enter total due to proceed.
                                            </Text>
                                        ) : null}

                                        <TouchableOpacity style={{ ...AppStyles.button, width: '95%', position: 'relative', marginTop: 10 }} activeOpacity={.5}
                                            onPress={() => {
                                                this.setState({ screen1: false, screen2: false, screen3: false, screen4: false, screen5: false, screen6: true, screen7: false })
                                            }}>
                                            <Text style={AppStyles.buttonText}> Change Number </Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>

                            </View>
                        </ScrollView>
                        {this.state.isLoading ?
                            <View style={AppStyles.loader}>
                                <ActivityIndicator size='large' color={AppStyles.colorOrange.color} />
                            </View>
                            :
                            <View></View>}
                    </View>
                }

                {/* inventory scan model start */}
                <Modal closeOnClick={true}
                    animationType="fade"
                    transparent={true}
                    visible={this.state.isModalInventoryScanVisible}
                    onRequestClose={() => {
                        alert("Modal has been closed.");
                    }}
                >
                    <TouchableWithoutFeedback onPress={this.toggleModalInventoryScan}>
                        <View style={styles.centeredView}>
                            <TouchableHighlight style={styles.modalView}>
                                <View>
                                    <Text style={styles.modalText}>Add Inventory Info</Text>

                                    <Text style={{
                                        fontSize: 16,
                                        color: AppStyles.colorGrey.color,
                                        textAlign: 'left',
                                        fontFamily: 'poppinsRegular',
                                        marginTop: 10,
                                        marginHorizontal: 10
                                    }}>Enter VIN Here</Text>
                                    <View style={{ flexDirection: "row" }}>
                                        <TextInput
                                            style={{ ...styles.textInput, flex: 1, paddingEnd: 40 }}
                                            editable
                                            keyboardType="default"
                                            value={this.state.inv_vin_model}
                                            onChangeText={(text) => this.changeVINtext(text, "inv_vin_model")}
                                        />
                                        <TouchableOpacity style={{ position: "absolute", right: 0, bottom: 0 }} onPress={() => {
                                            this.props.navigation.navigate("BarcodeScannerScreen", { screen: "StartDealScreen", modelType: "SDModelInv" })
                                            this.setState({ isModalInventoryScanVisible: !this.state.isModalInventoryScanVisible, inv_vin_model: "", errorinv_vin_model: false })
                                        }}>
                                            {/*Donute Button Image */}
                                            <Image
                                                style={{ width: 24, height: 24, margin: 10, resizeMode: "cover" }}
                                                source={require('../../assets/images/qr-code.png')}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    {this.state.errorinv_vin_model ? (
                                        <Text style={AppStyles.errortext}>
                                            * Please enter VIN number to proceed.
                                        </Text>
                                    ) : null}

                                    <TouchableOpacity
                                        style={styles.openButton}
                                        activeOpacity={.5}
                                        onPress={() => {
                                            this.addInventoryInfoScan()
                                            // this.toggleModalInventoryInfo()
                                            // this.setState({
                                            //     isModalInventoryScanVisible: !this.state.isModalInventoryScanVisible,
                                            // });
                                        }}
                                    >
                                        <Text style={styles.textStyle}>Add Inventory Info</Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableHighlight>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
                {/* inventory scan model end */}

                {/* inventory info model start */}
                <Modal closeOnClick={true}
                    animationType="fade"
                    transparent={true}
                    visible={this.state.isModalInventoryInfoVisible}
                    onRequestClose={() => {
                        alert("Modal has been closed.");
                    }}
                >
                    <TouchableWithoutFeedback onPress={() => this.toggleModalInventoryInfo()}>
                        <View style={styles.centeredView}>


                            <TouchableHighlight style={styles.modalView}>
                                <View style={{ marginBottom: 10, paddingBottom: 20, }}>
                                    {this.state.isLoading ?
                                        <View style={AppStyles.loader}>
                                            <ActivityIndicator size='large' color={AppStyles.colorOrange.color} />
                                        </View>
                                        :
                                        <View></View>}
                                    <TouchableOpacity style={{ position: 'absolute', alignSelf: 'center', top: -42 }} onPress={() => this.toggleModalInventoryInfo()}>
                                        <Image
                                            source={require('../../assets/images/close.png')}
                                            style={{ width: 45, height: 45, alignSelf: 'center' }}
                                        />
                                    </TouchableOpacity>
                                    <Text style={{ ...styles.modalText, marginBottom: 0, marginTop: 10 }}>Add Inventory Info</Text>

                                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
                                        <TouchableOpacity activeOpacity={1}>

                                            <Text style={styles.modalText1}>VIN</Text>
                                            <View style={{ flexDirection: "row", }}>
                                                <TextInput
                                                    ref={(input) => { this.inv_vinTextInput = input; }}
                                                    style={{ ...styles.textInput, marginHorizontal: 0, flex: 1, paddingEnd: 40 }}
                                                    editable
                                                    keyboardType="default"
                                                    value={this.state.inv_vin}
                                                    onChangeText={(text) => this.onModelChangeText(text, 'inv_vin')}
                                                />
                                                <TouchableOpacity style={{ position: "absolute", right: 0, bottom: 0 }} onPress={() => {
                                                    this.props.navigation.navigate("BarcodeScannerScreen", { screen: "StartDealScreen", modelType: "SDModelInv" })
                                                    this.setState({ isModalInventoryInfoVisible: !this.state.isModalInventoryInfoVisible })
                                                }}>
                                                    {/*Donute Button Image */}
                                                    <Image
                                                        style={{ width: 24, height: 24, margin: 10, resizeMode: "cover" }}
                                                        source={require('../../assets/images/qr-code.png')}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                            {this.state.errorinv_vin ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter VIN number to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Year</Text>
                                            <TextInput
                                                ref={(input) => { this.inv_yearTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="numeric"
                                                value={this.state.inv_year}
                                                onChangeText={(text) => this.onModelChangeText(text, 'inv_year')}
                                            />
                                            {this.state.errorinv_year ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter year to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Make</Text>
                                            <TextInput
                                                ref={(input) => { this.inv_makeTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="default"
                                                value={this.state.inv_make}
                                                onChangeText={(text) => this.onModelChangeText(text, 'inv_make')}
                                            />
                                            {this.state.errorinv_make ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter make to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Model</Text>
                                            <TextInput
                                                ref={(input) => { this.inv_modelTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="default"
                                                value={this.state.inv_model}
                                                onChangeText={(text) => this.onModelChangeText(text, 'inv_model')}
                                            />
                                            {this.state.errorinv_model ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter model to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Style</Text>
                                            <TextInput
                                                ref={(input) => { this.inv_styleTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="default"
                                                value={this.state.inv_style}
                                                onChangeText={(text) => this.onModelChangeText(text, 'inv_style')}
                                            />
                                            {this.state.errorinv_style ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter style to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Stock Number</Text>
                                            <TextInput
                                                ref={(input) => { this.inv_stockNumberTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="number-pad"
                                                value={this.state.inv_stockNumber}
                                                onChangeText={(text) => this.onModelChangeText(text, 'inv_stockNumber')}
                                            />
                                            {this.state.errorinv_stockNumber ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter stocknumber to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Color</Text>
                                            <TextInput
                                                ref={(input) => { this.inv_colorTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="default"
                                                value={this.state.inv_color}
                                                onChangeText={(text) => this.onModelChangeText(text, 'inv_color')}
                                            />
                                            {this.state.errorinv_color ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter color to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Mileage</Text>
                                            <TextInput
                                                ref={(input) => { this.inv_mileageTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="numeric"
                                                value={this.state.inv_mileage}
                                                onChangeText={(text) => this.onModelChangeText(text, 'inv_mileage')}
                                            />
                                            {this.state.errorinv_mileage ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter mileage to proceed.
                                                </Text>
                                            ) : null}

                                            <View style={{ flexDirection: 'row' }}>
                                                <Checkbox
                                                    status={this.state.inv_exempt}
                                                    color={AppStyles.colorBlue.color}
                                                    onPress={() => this.changeCheckBoxForExempt('inv_exempt', 'errorinv_mileage')}
                                                />
                                                <Text style={styles.checkboxtextexempt}>Exempt</Text>
                                            </View>

                                            <Text style={styles.modalText1}>Cost</Text>
                                            <TextInput
                                                ref={(input) => { this.inv_costTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="numeric"
                                                value={this.state.inv_cost}
                                                onChangeText={(text) => this.onModelChangeText(text, 'inv_cost')}
                                            />
                                            {this.state.errorinv_cost ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter cost to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Added Cost</Text>
                                            <TextInput
                                                ref={(input) => { this.inv_addedCostTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="numeric"
                                                value={this.state.inv_addedCost}
                                                onChangeText={(text) => this.onModelChangeText(text, 'inv_addedCost')}
                                            />
                                            {this.state.errorinv_addedCost ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter added cost to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Total Cost</Text>
                                            <TextInput
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable={false}
                                                value={this.state.inv_totalCost}

                                            />

                                            <Text style={styles.modalText1}>Vehicle Price</Text>
                                            <TextInput
                                                ref={(input) => { this.inv_vehiclePriceTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="numeric"
                                                value={this.state.inv_vehiclePrice}
                                                onChangeText={(text) => this.onModelChangeText(text, 'inv_vehiclePrice')}
                                            />
                                            {this.state.errorvehiclePrice ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter vehicle price to proceed.
                                                </Text>
                                            ) : null}

                                            <TouchableOpacity
                                                style={styles.openButton}
                                                activeOpacity={.5}
                                                onPress={() => this.addInventoryInfo()}
                                            >
                                                <Text style={styles.textStyle}>Add Vehicle</Text>
                                            </TouchableOpacity>

                                        </TouchableOpacity>
                                    </ScrollView>
                                </View>
                            </TouchableHighlight>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
                {/* inventory info model end */}

                {/* trade scan model start */}
                <Modal closeOnClick={true}
                    animationType="fade"
                    transparent={true}
                    visible={this.state.isModalTradeScanVisible}
                    onRequestClose={() => {
                        alert("Modal has been closed.");
                    }}
                >
                    <TouchableWithoutFeedback onPress={this.toggleModalTradeScan}>
                        <View style={styles.centeredView}>
                            <TouchableHighlight style={styles.modalView}>
                                <View>
                                    <Text style={styles.modalText}>Add Trade Info</Text>

                                    <Text style={{
                                        fontSize: 16,
                                        color: AppStyles.colorGrey.color,
                                        textAlign: 'left',
                                        fontFamily: 'poppinsRegular',
                                        marginTop: 10,
                                        marginHorizontal: 10
                                    }}>Enter VIN Here</Text>
                                    <View style={{ flexDirection: "row" }}>
                                        <TextInput
                                            style={{ ...styles.textInput, flex: 1, paddingEnd: 40 }}
                                            editable
                                            keyboardType="default"
                                            value={this.state.trade_inv_vin_model}
                                            onChangeText={(text) => this.changeVINtext(text, "trade_inv_vin_model")}
                                        />
                                        <TouchableOpacity style={{ position: "absolute", right: 0, bottom: 0 }} onPress={() => {
                                            this.props.navigation.navigate("BarcodeScannerScreen", { screen: "StartDealScreen", modelType: "SDModelTrade" })
                                            this.setState({ isModalTradeScanVisible: !this.state.isModalTradeScanVisible, trade_inv_vin_model: "", errortrade_inv_vin_model: false })
                                        }}>
                                            {/*Donute Button Image */}
                                            <Image
                                                style={{ width: 24, height: 24, margin: 10, resizeMode: "cover" }}
                                                source={require('../../assets/images/qr-code.png')}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    {this.state.errortrade_inv_vin_model ? (
                                        <Text style={AppStyles.errortext}>
                                            * Please enter VIN number to proceed.
                                        </Text>
                                    ) : null}

                                    <TouchableOpacity
                                        style={styles.openButton}
                                        activeOpacity={.5}
                                        onPress={() => {
                                            this.addTradeInfoScan()
                                            // this.toggleModalTradeInfo()
                                            // this.setState({
                                            //     isModalTradeScanVisible: !this.state.isModalTradeScanVisible,
                                            // });
                                        }}
                                    >
                                        <Text style={styles.textStyle}>Add Trade Info</Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableHighlight>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
                {/* trade scan model end */}

                {/* trade info model start */}
                <Modal closeOnClick={true}
                    animationType="fade"
                    transparent={true}
                    visible={this.state.isModalTradeInfoVisible}
                    onRequestClose={() => {
                        alert("Modal has been closed.");
                    }}
                >
                    <TouchableWithoutFeedback onPress={() => this.toggleModalTradeInfo()}>
                        <View style={styles.centeredView}>

                            {this.state.isLoading ?
                                <View style={AppStyles.loader}>
                                    <ActivityIndicator size='large' color={AppStyles.colorOrange.color} />
                                </View>
                                :
                                <View></View>}

                            <TouchableHighlight style={styles.modalView}>
                                <View style={{ marginBottom: 10, paddingBottom: 20, }}>

                                    <TouchableOpacity style={{ position: 'absolute', alignSelf: 'center', top: -42 }} onPress={() => this.toggleModalTradeInfo()}>
                                        <Image
                                            source={require('../../assets/images/close.png')}
                                            style={{ width: 45, height: 45, alignSelf: 'center' }}
                                        />
                                    </TouchableOpacity>
                                    <Text style={{ ...styles.modalText, marginBottom: 0, marginTop: 10 }}>Add Trade Info</Text>

                                    {this.state.isLoading ?
                                        <View style={AppStyles.loader}>
                                            <ActivityIndicator size='large' color={AppStyles.colorOrange.color} />
                                        </View>
                                        :
                                        <View></View>}

                                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
                                        <TouchableOpacity activeOpacity={1}>

                                            <Text style={styles.modalText1}>VIN</Text>
                                            <View style={{ flexDirection: "row", }}>
                                                <TextInput
                                                    ref={(input) => { this.trade_inv_vinTextInput = input; }}
                                                    style={{ ...styles.textInput, marginHorizontal: 0, flex: 1, paddingEnd: 40 }}
                                                    editable
                                                    keyboardType="default"
                                                    value={this.state.trade_inv_vin}
                                                    onChangeText={(text) => this.onModelChangeText(text, 'trade_inv_vin')}
                                                />
                                                <TouchableOpacity style={{ position: "absolute", right: 0, bottom: 0 }} onPress={() => {
                                                    this.props.navigation.navigate("BarcodeScannerScreen", { screen: "StartDealScreen", modelType: "SDModelTrade" })
                                                    this.setState({ isModalTradeInfoVisible: !this.state.isModalTradeInfoVisible })
                                                }}>
                                                    {/*Donute Button Image */}
                                                    <Image
                                                        style={{ width: 24, height: 24, margin: 10, resizeMode: "cover" }}
                                                        source={require('../../assets/images/qr-code.png')}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                            {this.state.errortrade_inv_vin ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter VIN number to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Year</Text>
                                            <TextInput
                                                ref={(input) => { this.trade_inv_yearTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="numeric"
                                                value={this.state.trade_inv_year}
                                                onChangeText={(text) => this.onModelChangeText(text, 'trade_inv_year')}
                                            />
                                            {this.state.errortrade_inv_year ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter year to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Make</Text>
                                            <TextInput
                                                ref={(input) => { this.trade_inv_makeTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="default"
                                                value={this.state.trade_inv_make}
                                                onChangeText={(text) => this.onModelChangeText(text, 'trade_inv_make')}
                                            />
                                            {this.state.errortrade_inv_make ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter make to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Model</Text>
                                            <TextInput
                                                ref={(input) => { this.trade_inv_modelTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="default"
                                                value={this.state.trade_inv_model}
                                                onChangeText={(text) => this.onModelChangeText(text, 'trade_inv_model')}
                                            />
                                            {this.state.errortrade_inv_model ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter model to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Style</Text>
                                            <TextInput
                                                ref={(input) => { this.trade_inv_styleTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="default"
                                                value={this.state.trade_inv_style}
                                                onChangeText={(text) => this.onModelChangeText(text, 'trade_inv_style')}
                                            />
                                            {this.state.errortrade_inv_style ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter style to proceed.
                                                </Text>
                                            ) : null}


                                            <Text style={styles.modalText1}>Color</Text>
                                            <TextInput
                                                ref={(input) => { this.trade_inv_colorTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="default"
                                                value={this.state.trade_inv_color}
                                                onChangeText={(text) => this.onModelChangeText(text, 'trade_inv_color')}
                                            />
                                            {this.state.errortrade_inv_color ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter color to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Mileage</Text>
                                            <TextInput
                                                ref={(input) => { this.trade_inv_mileageTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="numeric"
                                                value={this.state.trade_inv_mileage}
                                                onChangeText={(text) => this.onModelChangeText(text, 'trade_inv_mileage')}
                                            />
                                            {this.state.errortrade_inv_mileage ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter mileage to proceed.
                                                </Text>
                                            ) : null}

                                            <View style={{ flexDirection: 'row' }}>
                                                <Checkbox
                                                    status={this.state.trade_inv_exempt}
                                                    color={AppStyles.colorBlue.color}
                                                    onPress={() => this.changeCheckBoxForExempt('trade_inv_exempt', 'errortrade_inv_mileage')}
                                                />
                                                <Text style={styles.checkboxtextexempt}>Exempt</Text>
                                            </View>

                                            <Text style={styles.modalText1}>Total Allowance</Text>
                                            <TextInput
                                                ref={(input) => { this.trade_inv_priceTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="number-pad"
                                                value={this.state.trade_inv_price}
                                                onChangeText={(text) => this.onModelChangeText(text, 'trade_inv_price')}
                                            />
                                            {this.state.errortrade_inv_price ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter total allowance to proceed.
                                                </Text>
                                            ) : null}


                                            <TouchableOpacity
                                                style={styles.openButton}
                                                activeOpacity={.5}
                                                onPress={() => this.addTradeInfo()}
                                            >
                                                <Text style={styles.textStyle}>Add Vehicle</Text>
                                            </TouchableOpacity>

                                        </TouchableOpacity>
                                    </ScrollView>
                                </View>
                            </TouchableHighlight>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
                {/* trade info model end */}

                {/* Buyer info model start */}
                <Modal closeOnClick={true}
                    animationType="fade"
                    transparent={true}
                    visible={this.state.isModalBuyerVisible}
                    onRequestClose={() => {
                        alert("Modal has been closed.");
                    }}
                >
                    <TouchableWithoutFeedback onPress={() => this.toggleModalBuyer()}>
                        <View style={styles.centeredView}>

                            <TouchableHighlight style={styles.modalView}>
                                <View style={{ marginBottom: 10, paddingBottom: 20, }}>

                                    {this.state.isLoading ?
                                        <View style={AppStyles.loader}>
                                            <ActivityIndicator size='large' color={AppStyles.colorOrange.color} />
                                        </View>
                                        :
                                        <View></View>}

                                    <TouchableOpacity style={{ position: 'absolute', alignSelf: 'center', top: -42 }} onPress={() => this.toggleModalBuyer()}>
                                        <Image
                                            source={require('../../assets/images/close.png')}
                                            style={{ width: 45, height: 45, alignSelf: 'center' }}
                                        />
                                    </TouchableOpacity>
                                    <Text style={{ ...styles.modalText, marginBottom: 0, marginTop: 10 }}>Add Buyer</Text>

                                    <TouchableOpacity style={{ marginTop: 10, right: 10, position: "absolute" }} onPress={() => {
                                        this.props.navigation.navigate('OcrCameraScreen', { screen: 'StartDealScreen', modelType: 'sdbuyer' })
                                        this.setState({ isModalBuyerVisible: !this.state.isModalBuyerVisible })
                                    }}>
                                        <Image
                                            style={{ width: 24, height: 24, resizeMode: "contain" }}
                                            source={require('../../assets/images/qr-code.png')}
                                        />
                                    </TouchableOpacity>

                                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
                                        <TouchableOpacity activeOpacity={1}>


                                            <Text style={styles.modalText1}>Buyer First Name</Text>
                                            <TextInput
                                                ref={(input) => { this.buyers_first_nameTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="default"
                                                value={this.state.buyers_first_name}
                                                onChangeText={(text) => this.onModelChangeText(text, 'buyers_first_name')}
                                            />
                                            {this.state.errorbuyers_first_name ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter first name to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Buyer Middle Name</Text>
                                            <TextInput
                                                ref={(input) => { this.buyers_mid_nameTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="default"
                                                value={this.state.buyers_mid_name}
                                                onChangeText={(text) => this.onModelChangeText(text, 'buyers_mid_name')}
                                            />

                                            <Text style={styles.modalText1}>Buyer Last Name</Text>
                                            <TextInput
                                                ref={(input) => { this.buyers_last_nameTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="default"
                                                value={this.state.buyers_last_name}
                                                onChangeText={(text) => this.onModelChangeText(text, 'buyers_last_name')}
                                            />
                                            {this.state.errorbuyers_last_name ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter last name to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Buyer Address</Text>
                                            <TextInput
                                                ref={(input) => { this.buyers_addressTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="default"
                                                value={this.state.buyers_address}
                                                onChangeText={(text) => this.onModelChangeText(text, 'buyers_address')}
                                            />
                                            {this.state.errorbuyers_address ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter address to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Buyer City</Text>
                                            <TextInput
                                                ref={(input) => { this.buyers_cityTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="default"
                                                value={this.state.buyers_city}
                                                onChangeText={(text) => this.onModelChangeText(text, 'buyers_city')}
                                            />
                                            {this.state.errorbuyers_city ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter city to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Buyer State</Text>
                                            <Dropdown
                                                ref={(input) => { this.buyers_stateTextInput = input; }}
                                                style={{ fontSize: 16, fontFamily: 'poppinsRegular', color: AppStyles.colorBlue.color, marginTop: 5 }}
                                                data={STATE}
                                                animationDuration={100}
                                                itemTextStyle={{ fontFamily: 'poppinsRegular' }}
                                                containerStyle={{
                                                    marginTop: -25,
                                                }}
                                                inputContainerStyle={{ borderBottomColor: AppStyles.colorBlue.color, borderBottomWidth: 1 }}
                                                value={this.state.buyers_state}
                                                onChangeText={(value, key) => this.onStatePress(value, 'buyers_state')}
                                            />
                                            {this.state.errorbuyers_state ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter state to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Buyer Zip</Text>
                                            <TextInput
                                                ref={(input) => { this.buyers_zipTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="numeric"
                                                value={this.state.buyers_zip}
                                                onChangeText={(text) => this.onModelChangeText(text, 'buyers_zip')}
                                            />
                                            {this.state.errorbuyers_zip ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter zip to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Buyer Country</Text>
                                            <TextInput
                                                ref={(input) => { this.buyers_countryTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="default"
                                                value={this.state.buyers_country}
                                                onChangeText={(text) => this.onModelChangeText(text, 'buyers_country')}
                                            />
                                            {this.state.errorbuyers_country ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter country to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Buyer Email</Text>
                                            <TextInput
                                                ref={(input) => { this.buyers_emailTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="email-address"
                                                value={this.state.buyers_email}
                                                onChangeText={(text) => this.onModelChangeText(text, 'buyers_email')}
                                            />
                                            {this.state.errorbuyers_email ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter email to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Buyer Work Phone</Text>
                                            <TextInput
                                                ref={(input) => { this.buyers_work_phoneTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="phone-pad"
                                                value={this.state.buyers_work_phone}
                                                onChangeText={(text) => this.onModelChangeText(text, 'buyers_work_phone')}
                                            />
                                            {this.state.errorbuyers_work_phone ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter any one number to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Buyer Home Phone</Text>
                                            <TextInput
                                                ref={(input) => { this.buyers_home_phoneTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="phone-pad"
                                                value={this.state.buyers_home_phone}
                                                onChangeText={(text) => this.onModelChangeText(text, 'buyers_home_phone')}
                                            />

                                            <Text style={styles.modalText1}>Buyer Mobile</Text>
                                            <TextInput
                                                ref={(input) => { this.buyers_mobileTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="phone-pad"
                                                value={this.state.buyers_mobile}
                                                onChangeText={(text) => this.onModelChangeText(text, 'buyers_mobile')}
                                            />

                                            <Text style={styles.modalText1}>Drivers License Number</Text>
                                            <TextInput
                                                ref={(input) => { this.dl_numberTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="default"
                                                value={this.state.dl_number}
                                                onChangeText={(text) => this.onModelChangeText(text, 'dl_number')}
                                            />
                                            {this.state.errordl_number ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter dl number to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Buyer DL State</Text>
                                            <Dropdown
                                                ref={(input) => { this.buyers_addressTextInput = input; }}
                                                style={{ fontSize: 16, fontFamily: 'poppinsRegular', color: AppStyles.colorBlue.color, marginTop: 5 }}
                                                data={STATE}
                                                animationDuration={100}
                                                itemTextStyle={{ fontFamily: 'poppinsRegular' }}
                                                containerStyle={{
                                                    marginTop: -25,
                                                    marginBottom: -10
                                                }}
                                                inputContainerStyle={{ borderBottomColor: AppStyles.colorBlue.color, borderBottomWidth: 1 }}
                                                value={this.state.buyers_dl_state}
                                                onChangeText={(value, key) => this.onStatePress(value, 'buyers_dl_state')}
                                            />
                                            {this.state.errorbuyers_dl_state ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter dl state to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Buyer DL Expire</Text>
                                            <DatePicker
                                                style={{ alignItems: 'flex-start', width: Dimensions.get("window").width / 1.06 }}
                                                date={this.state.buyers_dl_expire} //initial date from state
                                                mode="date" //The enum of date, datetime and time
                                                // placeholder="dob"
                                                format="MM/DD/YYYY"
                                                minDate="01/01/2020"
                                                maxDate="01/01/2099"
                                                confirmBtnText="Confirm"
                                                cancelBtnText="Cancel"
                                                customStyles={{
                                                    dateIcon: { display: 'none', },
                                                    dateInput: AppStyles.dateInput,
                                                    dateText: AppStyles.dateText,
                                                }}
                                                onDateChange={(date) => { this.setState({ buyers_dl_expire: date }); }}
                                            />
                                            <View style={{ backgroundColor: AppStyles.colorBlue.color, height: 1 }}></View>

                                            <Text style={styles.modalText1}>Buyer DL Date of Birth</Text>
                                            <DatePicker
                                                style={{ alignItems: 'flex-start', width: Dimensions.get("window").width / 1.06 }}
                                                date={this.state.buyers_dl_dob} //initial date from state
                                                mode="date" //The enum of date, datetime and time
                                                // placeholder="dob"
                                                format="MM/DD/YYYY"
                                                minDate="01/01/1901"
                                                maxDate="01/01/2020"
                                                confirmBtnText="Confirm"
                                                cancelBtnText="Cancel"
                                                customStyles={{
                                                    dateIcon: { display: 'none', },
                                                    dateInput: AppStyles.dateInput,
                                                    dateText: AppStyles.dateText,
                                                }}
                                                onDateChange={(date) => { this.setState({ buyers_dl_dob: date }); }}
                                            />
                                            <View style={{ backgroundColor: AppStyles.colorBlue.color, height: 1 }}></View>

                                            <Text style={styles.modalText1}>Buyer Tag Number</Text>
                                            <TextInput
                                                ref={(input) => { this.buyers_tag_numberTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="default"
                                                value={this.state.buyers_tag_number}
                                                onChangeText={(text) => this.onModelChangeText(text, 'buyers_tag_number')}
                                            />
                                            {/* {this.state.errorbuyers_tag_number ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter tag number to proceed.
                                                </Text>
                                            ) : null} */}

                                            <TouchableOpacity
                                                style={styles.openButton}
                                                activeOpacity={.5}
                                                onPress={() => this.addBuyersInfo()}
                                            >
                                                <Text style={styles.textStyle}>Add Buyer</Text>
                                            </TouchableOpacity>

                                        </TouchableOpacity>
                                    </ScrollView>
                                </View>
                            </TouchableHighlight>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
                {/* Buyer info model end */}

                {/* CoBuyer info model start */}
                <Modal closeOnClick={true}
                    animationType="fade"
                    transparent={true}
                    visible={this.state.isModalCoBuyerVisible}
                    onRequestClose={() => {
                        alert("Modal has been closed.");
                    }}
                >
                    <TouchableWithoutFeedback onPress={() => this.toggleModalCoBuyer()}>
                        <View style={styles.centeredView}>

                            {this.state.isLoading ?
                                <View style={AppStyles.loader}>
                                    <ActivityIndicator size='large' color={AppStyles.colorOrange.color} />
                                </View>
                                :
                                <View></View>}

                            <TouchableHighlight style={styles.modalView}>

                                <View style={{ marginBottom: 10, paddingBottom: 20, }}>

                                    {this.state.isLoading ?
                                        <View style={AppStyles.loader}>
                                            <ActivityIndicator size='large' color={AppStyles.colorOrange.color} />
                                        </View>
                                        :
                                        <View></View>}

                                    <TouchableOpacity style={{ position: 'absolute', alignSelf: 'center', top: -42 }} onPress={() => this.toggleModalCoBuyer()}>
                                        <Image
                                            source={require('../../assets/images/close.png')}
                                            style={{ width: 45, height: 45, alignSelf: 'center' }}
                                        />
                                    </TouchableOpacity>
                                    <Text style={{ ...styles.modalText, marginBottom: 0, marginTop: 10 }}>Add Co-Buyer</Text>
                                    <TouchableOpacity style={{ marginTop: 10, right: 10, position: "absolute" }} onPress={() => {
                                        this.props.navigation.navigate('OcrCameraScreen', { screen: 'StartDealScreen', modelType: 'sdcobuyer' })
                                        this.setState({ isModalCoBuyerVisible: !this.state.isModalCoBuyerVisible })
                                    }}>
                                        <Image
                                            style={{ width: 24, height: 24, resizeMode: "contain" }}
                                            source={require('../../assets/images/qr-code.png')}
                                        />
                                    </TouchableOpacity>

                                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
                                        <TouchableOpacity activeOpacity={1}>


                                            <Text style={styles.modalText1}>Add Co-Buyer to</Text>
                                            <TextInput
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable={false}
                                                value={this.state.buyers_id_value}
                                            />

                                            <Text style={styles.modalText1}>Co-Buyer First Name</Text>
                                            <TextInput
                                                ref={(input) => { this.co_buyers_first_nameTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="default"
                                                value={this.state.co_buyers_first_name}
                                                onChangeText={(text) => this.onModelChangeText(text, 'co_buyers_first_name')}
                                            />
                                            {this.state.errorco_buyers_first_name ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter first name to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Co-Buyer Middle Name</Text>
                                            <TextInput
                                                ref={(input) => { this.co_buyers_mid_nameTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="default"
                                                value={this.state.co_buyers_mid_name}
                                                onChangeText={(text) => this.onModelChangeText(text, 'co_buyers_mid_name')}
                                            />

                                            <Text style={styles.modalText1}>Co-Buyer Last Name</Text>
                                            <TextInput
                                                ref={(input) => { this.co_buyers_last_nameTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="default"
                                                value={this.state.co_buyers_last_name}
                                                onChangeText={(text) => this.onModelChangeText(text, 'co_buyers_last_name')}
                                            />
                                            {this.state.errorco_buyers_last_name ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter last name to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Co-Buyer Address</Text>
                                            <TextInput
                                                ref={(input) => { this.co_buyers_addressTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="default"
                                                value={this.state.co_buyers_address}
                                                onChangeText={(text) => this.onModelChangeText(text, 'co_buyers_address')}
                                            />
                                            {this.state.errorco_buyers_address ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter address to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Co-Buyer City</Text>
                                            <TextInput
                                                ref={(input) => { this.co_buyers_cityTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="default"
                                                value={this.state.co_buyers_city}
                                                onChangeText={(text) => this.onModelChangeText(text, 'co_buyers_city')}
                                            />
                                            {this.state.errorco_buyers_city ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter city to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Co-Buyer State</Text>
                                            <Dropdown
                                                ref={(input) => { this.co_buyers_stateTextInput = input; }}
                                                style={{ fontSize: 16, fontFamily: 'poppinsRegular', color: AppStyles.colorBlue.color, marginTop: 5 }}
                                                data={STATE}
                                                animationDuration={100}
                                                itemTextStyle={{ fontFamily: 'poppinsRegular' }}
                                                containerStyle={{
                                                    marginTop: -25,
                                                    marginBottom: -10
                                                }}
                                                inputContainerStyle={{ borderBottomColor: AppStyles.colorBlue.color, borderBottomWidth: 1 }}
                                                value={this.state.co_buyers_state}
                                                onChangeText={(value, key) => this.onStatePress(value, 'co_buyers_state')}
                                            />
                                            {this.state.errorco_buyers_state ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter state to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Co-Buyer Zip</Text>
                                            <TextInput
                                                ref={(input) => { this.co_buyers_zipTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="numeric"
                                                value={this.state.co_buyers_zip}
                                                onChangeText={(text) => this.onModelChangeText(text, 'co_buyers_zip')}
                                            />
                                            {this.state.errorco_buyers_zip ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter zip to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Co-Buyer Country</Text>
                                            <TextInput
                                                ref={(input) => { this.co_buyers_countryTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="default"
                                                value={this.state.co_buyers_country}
                                                onChangeText={(text) => this.onModelChangeText(text, 'co_buyers_country')}
                                            />
                                            {this.state.errorco_buyers_country ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter country to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Co-Buyer Email</Text>
                                            <TextInput
                                                ref={(input) => { this.co_buyers_emailTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="email-address"
                                                value={this.state.co_buyers_email}
                                                onChangeText={(text) => this.onModelChangeText(text, 'co_buyers_email')}
                                            />
                                            {this.state.errorco_buyers_email ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter email to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Co-Buyer Work Phone</Text>
                                            <TextInput
                                                ref={(input) => { this.co_buyers_work_phoneTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="numeric"
                                                value={this.state.co_buyers_work_phone}
                                                onChangeText={(text) => this.onModelChangeText(text, 'co_buyers_work_phone')}
                                            />
                                            {this.state.errorco_buyers_work_phone ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter work phone to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Co-Buyer Home Phone</Text>
                                            <TextInput
                                                ref={(input) => { this.co_buyers_home_phoneTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="numeric"
                                                value={this.state.co_buyers_home_phone}
                                                onChangeText={(text) => this.onModelChangeText(text, 'co_buyers_home_phone')}
                                            />

                                            <Text style={styles.modalText1}>Co-Buyer Mobile</Text>
                                            <TextInput
                                                ref={(input) => { this.co_buyers_mobileTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="numeric"
                                                value={this.state.co_buyers_mobile}
                                                onChangeText={(text) => this.onModelChangeText(text, 'co_buyers_mobile')}
                                            />

                                            <Text style={styles.modalText1}>Co-Buyer DL State</Text>
                                            <Dropdown
                                                ref={(input) => { this.co_buyers_dl_stateTextInput = input; }}
                                                style={{ fontSize: 16, fontFamily: 'poppinsRegular', color: AppStyles.colorBlue.color, marginTop: 5 }}
                                                data={STATE}
                                                animationDuration={100}
                                                itemTextStyle={{ fontFamily: 'poppinsRegular' }}
                                                containerStyle={{
                                                    marginTop: -25,
                                                    marginBottom: -10
                                                }}
                                                inputContainerStyle={{ borderBottomColor: AppStyles.colorBlue.color, borderBottomWidth: 1 }}
                                                value={this.state.co_buyers_dl_state}
                                                onChangeText={(value, key) => this.onStatePress(value, 'co_buyers_dl_state')}
                                            />
                                            {this.state.errorco_buyers_dl_state ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter dl state to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Co-Buyer Drivers License Number</Text>
                                            <TextInput
                                                ref={(input) => { this.co_buyers_dl_numberTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="default"
                                                value={this.state.co_buyers_dl_number}
                                                onChangeText={(text) => this.onModelChangeText(text, 'co_buyers_dl_number')}
                                            />
                                            {this.state.errorco_buyers_dl_number ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter dl number to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Co-Buyer DL Expire</Text>
                                            <DatePicker
                                                style={{ alignItems: 'flex-start', width: Dimensions.get("window").width / 1.06 }}
                                                date={this.state.co_buyers_dl_expire} //initial date from state
                                                mode="date" //The enum of date, datetime and time
                                                // placeholder="dob"
                                                format="MM/DD/YYYY"
                                                minDate="01/01/2020"
                                                maxDate="01/01/2099"
                                                confirmBtnText="Confirm"
                                                cancelBtnText="Cancel"
                                                customStyles={{
                                                    dateIcon: { display: 'none', },
                                                    dateInput: AppStyles.dateInput,
                                                    dateText: AppStyles.dateText,
                                                }}
                                                onDateChange={(date) => { this.setState({ co_buyers_dl_expire: date }); }}
                                            />
                                            <View style={{ backgroundColor: AppStyles.colorBlue.color, height: 1 }}></View>

                                            <Text style={styles.modalText1}>Co-Buyer DL Date of Birth</Text>
                                            <DatePicker
                                                style={{ alignItems: 'flex-start', width: Dimensions.get("window").width / 1.06 }}
                                                date={this.state.co_buyers_dl_dob} //initial date from state
                                                mode="date" //The enum of date, datetime and time
                                                // placeholder="dob"
                                                format="MM/DD/YYYY"
                                                minDate="01/01/1901"
                                                maxDate="01/01/2020"
                                                confirmBtnText="Confirm"
                                                cancelBtnText="Cancel"
                                                customStyles={{
                                                    dateIcon: { display: 'none', },
                                                    dateInput: AppStyles.dateInput,
                                                    dateText: AppStyles.dateText,
                                                }}
                                                onDateChange={(date) => { this.setState({ co_buyers_dl_dob: date }); }}
                                            />
                                            <View style={{ backgroundColor: AppStyles.colorBlue.color, height: 1 }}></View>

                                            <TouchableOpacity
                                                style={styles.openButton}
                                                activeOpacity={.5}
                                                onPress={() => this.addCoBuyersInfo()}
                                            >
                                                <Text style={styles.textStyle}>Add Co-Buyer</Text>
                                            </TouchableOpacity>

                                        </TouchableOpacity>
                                    </ScrollView>
                                </View>
                            </TouchableHighlight>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
                {/* CoBuyer info model end */}

                {/* Insurance info model start */}
                <Modal closeOnClick={true}
                    animationType="fade"
                    transparent={true}
                    visible={this.state.isModalInsuranceVisible}
                    onRequestClose={() => {
                        alert("Modal has been closed.");
                    }}
                >
                    <TouchableWithoutFeedback>
                        <View style={styles.centeredView}>

                            <TouchableHighlight style={styles.modalView}>
                                <View style={{ marginBottom: 10, paddingBottom: 20, }}>

                                    {this.state.isLoading ?
                                        <View style={AppStyles.loader}>
                                            <ActivityIndicator size='large' color={AppStyles.colorOrange.color} />
                                        </View>
                                        :
                                        <View></View>}

                                    <TouchableOpacity style={{ position: 'absolute', alignSelf: 'center', top: -42 }} onPress={() => this.toggleModalInsurance()}>
                                        <Image
                                            source={require('../../assets/images/close.png')}
                                            style={{ width: 45, height: 45, alignSelf: 'center' }}
                                        />
                                    </TouchableOpacity>
                                    <Text style={{ ...styles.modalText, marginBottom: 0, marginTop: 10 }}>Add Insurance</Text>

                                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
                                        <TouchableOpacity activeOpacity={1}>

                                            <Text style={styles.modalText1}>Add Insurance to</Text>
                                            <TextInput
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable={false}
                                                value={this.state.buyers_id_value}
                                            />

                                            <Text style={styles.modalText1}>Insurance Company</Text>
                                            <TextInput
                                                ref={(input) => { this.ins_companyTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="default"
                                                value={this.state.ins_company}
                                                onChangeText={(text) => this.onModelChangeText(text, 'ins_company')}
                                            />
                                            {this.state.errorins_company ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter insurance company to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Policy Number</Text>
                                            <TextInput
                                                ref={(input) => { this.ins_pol_numTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="default"
                                                value={this.state.ins_pol_num}
                                                onChangeText={(text) => this.onModelChangeText(text, 'ins_pol_num')}
                                            />
                                            {this.state.errorins_pol_num ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter policy number to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Agent Name</Text>
                                            <TextInput
                                                ref={(input) => { this.ins_agentTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="default"
                                                value={this.state.ins_agent}
                                                onChangeText={(text) => this.onModelChangeText(text, 'ins_agent')}
                                            />
                                            {this.state.errorins_agent ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter agent name to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Agent Phone</Text>
                                            <TextInput
                                                ref={(input) => { this.ins_phoneTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="numeric"
                                                value={this.state.ins_phone}
                                                onChangeText={(text) => this.onModelChangeText(text, 'ins_phone')}
                                            />
                                            {this.state.errorins_phone ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter agent phone to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Address</Text>
                                            <TextInput
                                                ref={(input) => { this.ins_addressTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="default"
                                                value={this.state.ins_address}
                                                onChangeText={(text) => this.onModelChangeText(text, 'ins_address')}
                                            />
                                            {this.state.errorins_address ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter address to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>City</Text>
                                            <TextInput
                                                ref={(input) => { this.ins_cityTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="default"
                                                value={this.state.ins_city}
                                                onChangeText={(text) => this.onModelChangeText(text, 'ins_city')}
                                            />
                                            {this.state.errorins_city ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter city to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>State</Text>
                                            <Dropdown
                                                ref={(input) => { this.ins_stateTextInput = input; }}
                                                style={{ fontSize: 16, fontFamily: 'poppinsRegular', color: AppStyles.colorBlue.color, marginTop: 5 }}
                                                data={STATE}
                                                animationDuration={100}
                                                itemTextStyle={{ fontFamily: 'poppinsRegular' }}
                                                containerStyle={{
                                                    marginTop: -25,
                                                    marginBottom: -10
                                                }}
                                                inputContainerStyle={{ borderBottomColor: AppStyles.colorBlue.color, borderBottomWidth: 1 }}
                                                value={this.state.ins_state}
                                                onChangeText={(value, key) => this.onStatePress(value, 'ins_state')}
                                            />
                                            {this.state.errorins_state ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter state to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Zip</Text>
                                            <TextInput
                                                ref={(input) => { this.ins_zipTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="numeric"
                                                value={this.state.ins_zip}
                                                onChangeText={(text) => this.onModelChangeText(text, 'ins_zip')}
                                            />
                                            {this.state.errorins_zip ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter zip to proceed.
                                                </Text>
                                            ) : null}

                                            <TouchableOpacity
                                                style={styles.openButton}
                                                activeOpacity={.5}
                                                onPress={() => this.addInsuranceInfo()}
                                            >
                                                <Text style={styles.textStyle}>Add Insurance</Text>
                                            </TouchableOpacity>

                                        </TouchableOpacity>
                                    </ScrollView>
                                </View>
                            </TouchableHighlight>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
                {/* Insurance info model end */}

                {/* print model start */}
                <Modal closeOnClick={true}
                    animationType="fade"
                    transparent={true}
                    visible={this.state.isModalPrintVisible}
                    onRequestClose={() => {

                    }}
                >
                    <TouchableWithoutFeedback onPress={() => this.toggleModalPrint()}>
                        <View style={styles.centeredView}>
                            <TouchableHighlight style={styles.modalView}>
                                <View style={{ marginBottom: 30, paddingBottom: 20, }}>

                                    {this.state.isLoading ?
                                        <View style={AppStyles.loader}>
                                            <ActivityIndicator size='large' color={AppStyles.colorOrange.color} />
                                        </View>
                                        :
                                        <View></View>}

                                    <TouchableOpacity style={{ position: 'absolute', alignSelf: 'center', top: -42 }} onPress={() => this.toggleModalPrint()}>
                                        <Image
                                            source={require('../../assets/images/close.png')}
                                            style={{ width: 45, height: 45, alignSelf: 'center' }}
                                        />
                                    </TouchableOpacity>
                                    <Text style={{ ...styles.modalText, marginBottom: 0, marginTop: 10 }}>Choose The Documents You Want to Print</Text>

                                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
                                        {this.state.userState == "GEORGIA" ?
                                            <TouchableOpacity activeOpacity={1}>
                                                <Text style={styles.modalText1}>Choose Document(s) Date</Text>
                                                <DatePicker
                                                    style={{ alignItems: 'flex-start', width: Dimensions.get("window").width / 1.06, marginHorizontal: 10 }}
                                                    date={this.state.sd_main_readyprint_date} //initial date from state
                                                    mode="date" //The enum of date, datetime and time
                                                    // placeholder="dob"
                                                    format="MM/DD/YYYY"
                                                    minDate="01/01/2020"
                                                    maxDate="01/01/2099"
                                                    confirmBtnText="Confirm"
                                                    cancelBtnText="Cancel"
                                                    customStyles={{
                                                        dateIcon: { display: 'none', },
                                                        dateInput: AppStyles.dateInput,
                                                        dateText: AppStyles.dateText,
                                                    }}
                                                    onDateChange={(date) => { this.setState({ sd_main_readyprint_date: date }); }}
                                                />
                                                <View style={{ backgroundColor: AppStyles.colorBlue.color, height: 1, marginHorizontal: 10 }}></View>

                                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_chooseall}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_chooseall', 'all')}
                                                    />
                                                    <Text style={styles.checkboxtext}>Choose to Print All</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_billofsale}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_billofsale', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>Bill Of Sale</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_title_application}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_title_application', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>Title Application</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_odometer_statement}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_odometer_statement', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>Odometer Statement</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_as_is}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_as_is', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>As-Is</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_proof_of_insurance}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_proof_of_insurance', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>Proof Of Insurance</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_power_of_attorney}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_power_of_attorney', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>Power of Attorney</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_arbitration_agreement}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_arbitration_agreement', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>Arbitration Agreement</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_right_repossession}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_right_repossession', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>Right Of Repossession</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_ofac_statement}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_ofac_statement', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>OFAC Statement</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_privacy_information}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_privacy_information', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>Privacy Information</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_certificate_exemption}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_certificate_exemption', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>Certificate Of Exemption</Text>
                                                </View>


                                                <TouchableOpacity
                                                    style={styles.openButton}
                                                    activeOpacity={.5}
                                                    disabled={this.state.btn_disable_dealprint}
                                                    onPress={() => this.insertdeal_print()}
                                                >
                                                    <Text style={styles.textStyle}>Print Forms</Text>
                                                </TouchableOpacity>

                                            </TouchableOpacity>
                                            : null}

                                        {this.state.userState == "FLORIDA" ?
                                            <TouchableOpacity activeOpacity={1}>
                                                <Text style={styles.modalText1}>Choose Document(s) Date</Text>
                                                <DatePicker
                                                    style={{ alignItems: 'flex-start', width: Dimensions.get("window").width / 1.06, marginHorizontal: 10 }}
                                                    date={this.state.sd_main_readyprint_date} //initial date from state
                                                    mode="date" //The enum of date, datetime and time
                                                    // placeholder="dob"
                                                    format="MM/DD/YYYY"
                                                    minDate="01/01/2020"
                                                    maxDate="01/01/2099"
                                                    confirmBtnText="Confirm"
                                                    cancelBtnText="Cancel"
                                                    customStyles={{
                                                        dateIcon: { display: 'none', },
                                                        dateInput: AppStyles.dateInput,
                                                        dateText: AppStyles.dateText,
                                                    }}
                                                    onDateChange={(date) => { this.setState({ sd_main_readyprint_date: date }); }}
                                                />
                                                <View style={{ backgroundColor: AppStyles.colorBlue.color, height: 1, marginHorizontal: 10 }}></View>

                                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_chooseall}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_chooseall', 'all')}
                                                    />
                                                    <Text style={styles.checkboxtext}>Choose to Print All</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_ofac_statement}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_ofac_statement', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>OFAC Statement</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_billofsale}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_billofsale', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>Bill Of Sale</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_as_is}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_as_is', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>As-Is</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_customer_consent}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_customer_consent', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>Customer Consent</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_odometer_statement}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_odometer_statement', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>Odometer Disclosure Statement</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_power_of_attorney}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_power_of_attorney', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>Power of Attorney</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_apc}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_apc', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>Vehicle Air Pollution Control Statement</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_hope_scholarship_program}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_hope_scholarship_program', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>Hope Scholarship Program</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_federal_risk}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_federal_risk', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>Federal Risk Based Pricing Notice</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_right_repossession}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_right_repossession', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>Repossession Agreement</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_buyers_agreement}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_buyers_agreement', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>Buyers Agreement</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_arbitration_agreement}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_arbitration_agreement', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>Arbitration Agreement</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_sep_odometer_statement}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_sep_odometer_statement', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>Separate Odometer Disclosure Statement</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_buyers_guide}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_buyers_guide', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>Buyers Guide</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_facts}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_facts', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>Facts</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_insurance_affidavit}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_insurance_affidavit', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>Insurance Affidavit</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_insurance_agreement}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_insurance_agreement', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>Insurance Agreement</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_installment_contract}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_installment_contract', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>Installment Contract and Security Agreement</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_buyers_order}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_buyers_order', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>Buyer's Order</Text>
                                                </View>


                                                <TouchableOpacity
                                                    style={styles.openButton}
                                                    activeOpacity={.5}
                                                    disabled={this.state.btn_disable_dealprint}
                                                    onPress={() => this.insertdeal_print()}
                                                >
                                                    <Text style={styles.textStyle}>Print Forms</Text>
                                                </TouchableOpacity>

                                            </TouchableOpacity>
                                            : null}

                                        {this.state.userState == "TEXAS" ?
                                            <TouchableOpacity activeOpacity={1}>
                                                <Text style={styles.modalText1}>Choose Document(s) Date</Text>
                                                <DatePicker
                                                    style={{ alignItems: 'flex-start', width: Dimensions.get("window").width / 1.06, marginHorizontal: 10 }}
                                                    date={this.state.sd_main_readyprint_date} //initial date from state
                                                    mode="date" //The enum of date, datetime and time
                                                    // placeholder="dob"
                                                    format="MM/DD/YYYY"
                                                    minDate="01/01/2020"
                                                    maxDate="01/01/2099"
                                                    confirmBtnText="Confirm"
                                                    cancelBtnText="Cancel"
                                                    customStyles={{
                                                        dateIcon: { display: 'none', },
                                                        dateInput: AppStyles.dateInput,
                                                        dateText: AppStyles.dateText,
                                                    }}
                                                    onDateChange={(date) => { this.setState({ sd_main_readyprint_date: date }); }}
                                                />
                                                <View style={{ backgroundColor: AppStyles.colorBlue.color, height: 1, marginHorizontal: 10 }}></View>

                                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_chooseall}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_chooseall', 'all')}
                                                    />
                                                    <Text style={styles.checkboxtext}>Choose to Print All</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_app_title_registration}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_app_title_registration', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>Application For Title And Registration</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_billofsale}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_billofsale', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>Bill Of Sale</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_installment_contract}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_installment_contract', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>Retail Installment Sales Contract</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_power_of_attorney}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_power_of_attorney', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>Power of Attorney</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_buyers_guide}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_buyers_guide', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>Buyers Guide</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_loan_payment_schedule}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_loan_payment_schedule', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>Vehicle Purchase Loan Payment Schedule</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_arbitration_agreement}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_arbitration_agreement', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>Arbitration Agreement</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_credit_reporting_disclosure}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_credit_reporting_disclosure', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>Credit Reporting Disclosure</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_facts}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_facts', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>Facts</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_airbags}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_airbags', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>Disclosure On Airbags</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_release_agreement}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_release_agreement', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>Release Agreement</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_odometer_statement}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_odometer_statement', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>Odometer Disclosure Statement</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_api}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_api', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>Agreement To Provide Insurance</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_country_title_issurance}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_country_title_issurance', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>Country Of Title Issurance</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_authorization_letter}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_authorization_letter', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>Authorization Letter</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_electronic_payment_authorization}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_electronic_payment_authorization', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>Electronic Payment Authorization</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_do_not_sign}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_do_not_sign', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>Do Not Sign This Paper Untill Fully Read</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_receipt_downpayment}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_receipt_downpayment', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>Receipt For Down Payment</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Checkbox
                                                        status={this.state.sd_main_readyprint_buyer_information}
                                                        color={AppStyles.colorBlue.color}
                                                        onPress={() => this.changeCheckBox('sd_main_readyprint_buyer_information', '')}
                                                    />
                                                    <Text style={styles.checkboxtext}>Buyer Information</Text>
                                                </View>


                                                <TouchableOpacity
                                                    style={styles.openButton}
                                                    activeOpacity={.5}
                                                    disabled={this.state.btn_disable_dealprint}
                                                    onPress={() => this.insertdeal_print()}
                                                >
                                                    <Text style={styles.textStyle}>Print Forms</Text>
                                                </TouchableOpacity>

                                            </TouchableOpacity>
                                            : null}

                                    </ScrollView>
                                </View>
                            </TouchableHighlight>
                            {this.state.isLoading ?
                                <View style={AppStyles.loader}>
                                    <ActivityIndicator size='large' color={AppStyles.colorOrange.color} />
                                </View>
                                :
                                <View></View>}
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
                {/* print model end */}

                {/* contract model start */}
                <Modal closeOnClick={true}
                    animationType="fade"
                    transparent={true}
                    visible={this.state.isModalContractVisible}
                    onRequestClose={() => {
                        alert("Modal has been closed.");
                    }}
                >
                    <TouchableWithoutFeedback onPress={() => this.toggleModalContract()}>
                        <View style={styles.centeredView}>
                            <TouchableHighlight style={styles.modalView}>
                                <View style={{ marginBottom: 10, paddingBottom: 20, }}>

                                    {this.state.isLoading ?
                                        <View style={AppStyles.loader}>
                                            <ActivityIndicator size='large' color={AppStyles.colorOrange.color} />
                                        </View>
                                        :
                                        <View></View>}

                                    <TouchableOpacity style={{ position: 'absolute', alignSelf: 'center', top: -42 }} onPress={() => this.toggleModalContract()}>
                                        <Image
                                            source={require('../../assets/images/close.png')}
                                            style={{ width: 45, height: 45, alignSelf: 'center' }}
                                        />
                                    </TouchableOpacity>
                                    <Text style={{ ...styles.modalText, marginBottom: 0, marginTop: 10 }}>BHPH Contract</Text>

                                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
                                        <TouchableOpacity activeOpacity={1}>

                                            <Text style={styles.modalText1}>Choose Document(s) Date</Text>
                                            <DatePicker
                                                style={{ alignItems: 'flex-start', width: Dimensions.get("window").width / 1.06 }}
                                                date={this.state.sd_main_bhphcontract_date} //initial date from state
                                                mode="date" //The enum of date, datetime and time
                                                // placeholder="dob"
                                                format="MM/DD/YYYY"
                                                minDate="01/01/2020"
                                                maxDate="01/01/2099"
                                                confirmBtnText="Confirm"
                                                cancelBtnText="Cancel"
                                                customStyles={{
                                                    dateIcon: { display: 'none', },
                                                    dateInput: AppStyles.dateInput,
                                                    dateText: AppStyles.dateText,
                                                }}
                                                onDateChange={(date) => { this.setState({ sd_main_bhphcontract_date: date }); }}
                                            />
                                            <View style={{ backgroundColor: AppStyles.colorBlue.color, height: 1 }}></View>

                                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                                <Checkbox
                                                    status={this.state.sd_main_bhphcontract_cb}
                                                    color={AppStyles.colorBlue.color}
                                                    onPress={() => this.changeCheckBox('sd_main_bhphcontract_cb', '')}
                                                />
                                                <Text style={styles.checkboxtext}>BHPH Contract</Text>
                                            </View>

                                            <Text style={styles.modalText1}>Cash Price</Text>
                                            <TextInput
                                                ref={(input) => { this.sd_main_bhphcontract_cash_priceTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="numeric"
                                                value={this.state.sd_main_bhphcontract_cash_price}
                                                onChangeText={(text) => this.onModelChangeText(text, 'sd_main_bhphcontract_cash_price')}
                                            />
                                            {this.state.errorsd_main_bhphcontract_cash_price ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter cash price to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Dealer Fee</Text>
                                            <TextInput
                                                ref={(input) => { this.sd_main_bhphcontract_dealer_feeTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="numeric"
                                                value={this.state.sd_main_bhphcontract_dealer_fee}
                                                onChangeText={(text) => this.onModelChangeText(text, 'sd_main_bhphcontract_dealer_fee')}
                                            />
                                            {this.state.errorsd_main_bhphcontract_dealer_fee ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter dealer fee to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Taxes</Text>
                                            <TextInput
                                                ref={(input) => { this.sd_main_bhphcontract_taxesTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="numeric"
                                                value={this.state.sd_main_bhphcontract_taxes}
                                                onChangeText={(text) => this.onModelChangeText(text, 'sd_main_bhphcontract_taxes')}
                                            />
                                            {this.state.errorsd_main_bhphcontract_taxes ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter taxes to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Cash Down</Text>
                                            <TextInput
                                                ref={(input) => { this.sd_main_bhphcontract_cashdownTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="numeric"
                                                value={this.state.sd_main_bhphcontract_cashdown}
                                                onChangeText={(text) => this.onModelChangeText(text, 'sd_main_bhphcontract_cashdown')}
                                            />
                                            {this.state.errorsd_main_bhphcontract_cashdown ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter cash down to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Deferred Down</Text>
                                            <TextInput
                                                ref={(input) => { this.sd_main_bhphcontract_deferred_downTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="numeric"
                                                value={this.state.sd_main_bhphcontract_deferred_down}
                                                onChangeText={(text) => this.onModelChangeText(text, 'sd_main_bhphcontract_deferred_down')}
                                            />
                                            {this.state.errorsd_main_bhphcontract_deferred_down ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter deferred down to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Trade Allowance</Text>
                                            <TextInput
                                                ref={(input) => { this.sd_main_bhphcontract_trade_allowanceTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="numeric"
                                                value={this.state.sd_main_bhphcontract_trade_allowance}
                                                onChangeText={(text) => this.onModelChangeText(text, 'sd_main_bhphcontract_trade_allowance')}
                                            />
                                            {this.state.errorsd_main_bhphcontract_trade_allowance ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter trade allowance to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Title Fee</Text>
                                            <TextInput
                                                ref={(input) => { this.sd_main_bhphcontract_title_feeTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="numeric"
                                                value={this.state.sd_main_bhphcontract_title_fee}
                                                onChangeText={(text) => this.onModelChangeText(text, 'sd_main_bhphcontract_title_fee')}
                                            />
                                            {this.state.errorsd_main_bhphcontract_title_fee ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter title fee to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Payment Amount</Text>
                                            <TextInput
                                                ref={(input) => { this.sd_main_bhphcontract_payment_amountTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="numeric"
                                                value={this.state.sd_main_bhphcontract_payment_amount}
                                                onChangeText={(text) => this.onModelChangeText(text, 'sd_main_bhphcontract_payment_amount')}
                                            />
                                            {this.state.errorsd_main_bhphcontract_payment_amount ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter payment amount to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Number of Payments</Text>
                                            <TextInput
                                                ref={(input) => { this.sd_main_bhphcontract_number_paymentsTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="numeric"
                                                value={this.state.sd_main_bhphcontract_number_payments}
                                                onChangeText={(text) => this.onModelChangeText(text, 'sd_main_bhphcontract_number_payments')}
                                            />
                                            {this.state.errorsd_main_bhphcontract_number_payments ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter number of payments to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Interest Rate (Percentage)</Text>
                                            <TextInput
                                                ref={(input) => { this.sd_main_bhphcontract_interest_rateTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="numeric"
                                                value={this.state.sd_main_bhphcontract_interest_rate}
                                                onChangeText={(text) => this.onModelChangeText(text, 'sd_main_bhphcontract_interest_rate')}
                                            />
                                            {this.state.errorsd_main_bhphcontract_interest_rate ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter interest rate to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Total of Payments</Text>
                                            <TextInput
                                                ref={(input) => { this.sd_main_bhphcontract_total_paymentsTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="numeric"
                                                value={this.state.sd_main_bhphcontract_total_payments}
                                                onChangeText={(text) => this.onModelChangeText(text, 'sd_main_bhphcontract_total_payments')}
                                            />
                                            {this.state.errorsd_main_bhphcontract_total_payments ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter total of payment to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Finance Charge</Text>
                                            <TextInput
                                                ref={(input) => { this.sd_main_bhphcontract_finance_chargeTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="numeric"
                                                value={this.state.sd_main_bhphcontract_finance_charge}
                                                onChangeText={(text) => this.onModelChangeText(text, 'sd_main_bhphcontract_finance_charge')}
                                            />
                                            {this.state.errorsd_main_bhphcontract_finance_charge ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter finance charge to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Total Finance Amt</Text>
                                            <TextInput
                                                ref={(input) => { this.sd_main_bhphcontract_tot_finance_amtTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="numeric"
                                                value={this.state.sd_main_bhphcontract_tot_finance_amt}
                                                onChangeText={(text) => this.onModelChangeText(text, 'sd_main_bhphcontract_tot_finance_amt')}
                                            />
                                            {this.state.errorsd_main_bhphcontract_tot_finance_amt ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter total finance amt to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Total Price Paid (Includes Down Pmt)</Text>
                                            <TextInput
                                                ref={(input) => { this.sd_main_bhphcontract_tot_price_paidTextInput = input; }}
                                                style={{ ...styles.textInput, marginHorizontal: 0, paddingEnd: 40 }}
                                                editable
                                                keyboardType="numeric"
                                                value={this.state.sd_main_bhphcontract_tot_price_paid}
                                                onChangeText={(text) => this.onModelChangeText(text, 'sd_main_bhphcontract_tot_price_paid')}
                                            />
                                            {this.state.errorsd_main_bhphcontract_tot_price_paid ? (
                                                <Text style={AppStyles.errortext}>
                                                    * Please enter total price paid to proceed.
                                                </Text>
                                            ) : null}

                                            <Text style={styles.modalText1}>Payment Schedule From</Text>
                                            <DatePicker
                                                style={{ alignItems: 'flex-start', width: Dimensions.get("window").width / 1.06 }}
                                                date={this.state.sd_main_bhphcontract_payment_scheduleFrom} //initial date from state
                                                mode="date" //The enum of date, datetime and time
                                                // placeholder="dob"
                                                format="MM/DD/YYYY"
                                                confirmBtnText="Confirm"
                                                cancelBtnText="Cancel"
                                                customStyles={{
                                                    dateIcon: { display: 'none', },
                                                    dateInput: AppStyles.dateInput,
                                                    dateText: AppStyles.dateText,
                                                }}
                                                onDateChange={(date) => { this.setState({ sd_main_bhphcontract_payment_scheduleFrom: date }); }}
                                            />
                                            <View style={{ backgroundColor: AppStyles.colorBlue.color, height: 1 }}></View>

                                            <Text style={styles.modalText1}>Payment Schedule To</Text>
                                            <DatePicker
                                                style={{ alignItems: 'flex-start', width: Dimensions.get("window").width / 1.06 }}
                                                date={this.state.sd_main_bhphcontract_payment_scheduleTo} //initial date from state
                                                mode="date" //The enum of date, datetime and time
                                                // placeholder="dob"
                                                format="MM/DD/YYYY"
                                                confirmBtnText="Confirm"
                                                cancelBtnText="Cancel"
                                                customStyles={{
                                                    dateIcon: { display: 'none', },
                                                    dateInput: AppStyles.dateInput,
                                                    dateText: AppStyles.dateText,
                                                }}
                                                onDateChange={(date) => { this.setState({ sd_main_bhphcontract_payment_scheduleTo: date }); }}
                                            />
                                            <View style={{ backgroundColor: AppStyles.colorBlue.color, height: 1 }}></View>

                                            <TouchableOpacity
                                                style={styles.openButton}
                                                activeOpacity={.5}
                                                disabled={this.state.btn_disable_dealcontract}
                                                onPress={() => this.insertdeal_contract()}
                                            >
                                                <Text style={styles.textStyle}>Print Contract</Text>
                                            </TouchableOpacity>

                                        </TouchableOpacity>
                                    </ScrollView>
                                </View>
                            </TouchableHighlight>
                            {this.state.isLoading ?
                                <View style={AppStyles.loader}>
                                    <ActivityIndicator size='large' color={AppStyles.colorOrange.color} />
                                </View>
                                :
                                <View></View>}
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
                {/* contract model end */}

                <View style={{
                    width: width - 10,
                    flexDirection: 'row',
                    position: 'absolute',
                    bottom: 0,
                    marginTop: 10,
                    marginBottom: 20,
                    paddingHorizontal: 10
                }}>

                    {this.state.screen1 ? <View></View> :
                        <TouchableOpacity style={styles.buttonCard} activeOpacity={0.8}
                            onPress={() => this.step_previous()}>
                            <Image
                                source={require('../../assets/home/buttonarrowleft.png')}
                                style={{ width: 45, height: 45, marginLeft: 0 }}
                            />
                            <Text style={{ ...AppStyles.buttonCardText, marginRight: 10 }}>Previous</Text>
                        </TouchableOpacity>
                    }

                    {this.state.screen7 ? <View></View> :
                        <TouchableOpacity style={{ ...styles.buttonCard, position: 'absolute', right: 0, bottom: 0 }} activeOpacity={0.8}
                            onPress={() => this.step_next()}>
                            <Text style={AppStyles.buttonCardText}>Next</Text>
                            <Image
                                source={require('../../assets/home/buttonarrow.png')}
                                style={{ width: 45, height: 45, marginLeft: 10 }}
                            />
                        </TouchableOpacity>
                    }
                </View>

                {this.state.isLoading ?
                    <View style={AppStyles.loader}>
                        <ActivityIndicator size='large' color={AppStyles.colorOrange.color} />
                    </View>
                    :
                    <View></View>}
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
    textInput: {
        fontSize: 18,
        color: AppStyles.colorBlue.color,
        textAlign: 'left',
        fontFamily: 'poppinsRegular',
        marginHorizontal: 10,
        marginTop: 0,
        paddingBottom: 0,
        borderBottomColor: AppStyles.colorBlue.color, // Add this to specify bottom border color
        borderBottomWidth: 1,
    },

    buttonCard: {
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        flexDirection: 'row',
        paddingHorizontal: 5,
        paddingVertical: 5,
        backgroundColor: '#fd7801',
        borderColor: '#fd7801',
        borderWidth: 1,
        borderRadius: 50,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 9,
    },

    step_one_active: {
        backgroundColor: AppStyles.colorOrange.color,
        borderRadius: 20,
        paddingLeft: 10
    },
    step_one_pre: {
        backgroundColor: AppStyles.colorOrange.color,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        paddingLeft: 10
    },
    step_previous: {
        backgroundColor: AppStyles.colorOrange.color,
    },
    step_active: {
        backgroundColor: AppStyles.colorOrange.color,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
    },




    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // paddingTop: 22,
        paddingVertical: 50,
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
    modalText1: {
        fontSize: 16,
        color: AppStyles.colorGrey.color,
        textAlign: 'left',
        fontFamily: 'poppinsRegular',
        marginTop: 10
    },
    checkboxtext: {
        fontSize: 16,
        // textAlign: 'left',
        fontFamily: 'poppinsMedium',
        marginRight: 10,
        alignSelf: "center",
    },
    textLeft: {
        flex: 1,
        fontSize: 16,
        color: AppStyles.colorGrey.color,
        textAlign: 'left',
        fontFamily: 'poppinsMedium',
        marginTop: 10
    },

    textRight: {
        flex: 1,
        fontSize: 16,
        color: AppStyles.colorBlue.color,
        textAlign: 'right',
        fontFamily: 'poppinsMedium',
        marginTop: 10
    },

    checkboxtextexempt: {
        fontSize: 16,
        // textAlign: 'left',
        fontFamily: 'poppinsRegular',
        marginRight: 10,
        alignSelf: "center",
    },

});