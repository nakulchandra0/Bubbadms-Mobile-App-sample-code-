import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TextInput, ActivityIndicator, ToastAndroid, Dimensions, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import { getUserData, storeUserData } from "../auth";
import AppStyles from '../../utility/Styles'
import { API_URL, STATE } from '../../utility/Constants'
import { Dropdown } from 'react-native-material-dropdown';
import DatePicker from 'react-native-datepicker';

export default class EditBuyerInfoScreen extends React.Component {

    constructor(props) {
        super(props)
        this.profileImage = 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80';
    }

    static navigationOptions = { headerShown: false };

    state = {
        userid: "",
        isLoading: false,
        buyers_id: "",
        buyers_first_name: '', buyers_mid_name: '', buyers_last_name: '', buyers_address: '', buyers_city: '', buyers_state: '', buyers_zip: '', buyers_country: '', buyers_email: '', buyers_work_phone: '', buyers_home_phone: '', buyers_mobile: '', dl_number: '', buyers_dl_state: '', buyers_dl_expire: '', buyers_dl_dob: '', buyers_tag_number: '',
        error_buyers_first_name: false, error_buyers_mid_name: false, error_buyers_last_name: false, error_buyers_address: false, error_buyers_city: false, error_buyers_state: false, error_buyers_zip: false, error_buyers_country: false, error_buyers_email: false, error_buyers_work_phone: false, error_buyers_home_phone: false, error_buyers_mobile: false, error_dl_number: false, error_buyers_dl_state: false, error_buyers_dl_expire: false, error_buyers_dl_dob: false, error_buyers_tag_number: false
    }

    onChangeText(text, type) {
        const re = /^[0-9\b]+$/;
        if (type == "buyers_zip" || type == "buyers_work_phone" || type == "buyers_home_phone" || type == "buyers_mobile") {
            if (text != "" && !re.test(text)) return false;

        }
        if (type == "buyers_work_phone" || type == "buyers_home_phone" || type == "buyers_mobile") {
            if (text.trim() != 0)
                this.setState({ [type]: text, error_buyers_work_phone: false });
            else
                this.setState({ [type]: text, error_buyers_work_phone: true });
        } else {
            if (text.trim() != 0) {
                this.setState({ [type]: text, ['error_' + type]: false });
            } else {
                this.setState({ [type]: text, ['error_' + type]: true });
            }
        }
    }

    onStatePress(text, type) {
        this.setState({ [type]: text, ['error_' + type]: false });
        // this.getModelList(this.makeData[key].id)
    }

    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('didFocus', () => {
            var buyers_id = this.props.navigation.getParam('buyers_id');
            this.setState({ buyers_id })
            // var vin = this.props.navigation.getParam('vin');
            this.setState({  buyers_first_name: '', buyers_mid_name: '', buyers_last_name: '', buyers_address: '', buyers_city: '', buyers_state: '', buyers_zip: '', buyers_country: '', buyers_email: '', buyers_work_phone: '', buyers_home_phone: '', buyers_mobile: '', dl_number: '', buyers_dl_state: '', buyers_dl_expire: '', buyers_dl_dob: '', buyers_tag_number: ''})
            this.getBuyerDataFromBuyerid(buyers_id);
        });
    }

    componentWillUnmount() {
        // Remove the event listener
        this.focusListener.remove();
    }

    async getBuyerDataFromBuyerid(buyers_id) {
        this.setState({ isLoading: true });

        var data = {
            "buyers_id": buyers_id
        }

        fetch(API_URL + "viewbuyer", {
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
                    {
                        this.setState({
                            buyers_first_name: data.data.buyers_first_name,
                            buyers_mid_name: data.data.buyers_mid_name,
                            buyers_last_name: data.data.buyers_last_name,
                            buyers_address: data.data.buyers_address,
                            buyers_city: data.data.buyers_city,
                            buyers_state: data.data.buyers_state,
                            buyers_zip: data.data.buyers_zip,
                            buyers_country: 'USA',
                            buyers_email: data.data.buyers_pri_email,
                            buyers_work_phone: data.data.buyers_work_phone,
                            buyers_home_phone: data.data.buyers_home_phone,
                            buyers_mobile: data.data.buyers_pri_phone_cell,
                            dl_number: data.data.buyers_DL_number,
                            buyers_dl_state: data.data.buyers_DL_state,
                            buyers_dl_expire: data.data.buyers_DL_expire,
                            buyers_dl_dob: data.data.buyers_DL_dob,
                            buyers_tag_number: data.data.buyers_temp_tag_number

                        });
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

    async editBuyersInfo() {
        if (this.state.buyers_first_name == "") {
            this.setState({ error_buyers_first_name: true, });
            this.buyers_first_nameTextInput.focus();
        } else if (this.state.buyers_last_name == "") {
            this.setState({ error_buyers_last_name: true, });
            this.buyers_last_nameTextInput.focus();
        } else if (this.state.buyers_address == "") {
            this.setState({ error_buyers_address: true, });
            this.buyers_addressTextInput.focus();
        } else if (this.state.buyers_city == "") {
            this.setState({ error_buyers_city: true, });
            this.buyers_cityTextInput.focus();
        } else if (this.state.buyers_state == "") {
            this.setState({ error_buyers_state: true, });
            this.buyers_stateTextInput.focus();
        } else if (this.state.buyers_zip == "") {
            this.setState({ error_buyers_zip: true, });
            this.buyers_zipTextInput.focus();
        } else if (this.state.buyers_country == "") {
            this.setState({ error_buyers_country: true, });
            this.buyers_countryTextInput.focus();
        } else if (this.state.buyers_email == "") {
            this.setState({ error_buyers_email: true, });
            this.buyers_emailTextInput.focus();


        } else if (this.state.buyers_work_phone == "" && this.state.buyers_home_phone == "" && this.state.buyers_mobile == "") {
            this.setState({ error_buyers_work_phone: true, });
            this.buyers_work_phoneTextInput.focus();
            // } else if (this.state.buyers_home_phone == "") {
            //     this.setState({ error_buyers_home_phone: true, });
            //     this.buyers_home_phoneTextInput.focus();
            // } else if (this.state.buyers_mobile == "") {
            //     this.setState({ error_buyers_mobile: true, });
            //     this.buyers_mobileTextInput.focus();



        } else if (this.state.dl_number == "") {
            this.setState({ error_dl_number: true, });
            this.dl_numberTextInput.focus();
        } else if (this.state.buyers_dl_state == "") {
            this.setState({ error_buyers_dl_state: true, });
            this.buyers_dl_stateTextInput.focus();
            // } else if (this.state.buyers_dl_expire == "") {
            //     this.setState({ error_buyers_dl_expire: true, });
            // } else if (this.state.buyers_dl_dob == "") {
            //     this.setState({ error_buyers_dl_dob: true, });
        } else {
            this.setState({ isLoading: true });
            var data = {
                "buyers_id": this.state.buyers_id,
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
                        this.props.navigation.navigate('BuyersScreen');
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
                <TouchableOpacity style={AppStyles.navigationButton} onPress={() => this.props.navigation.navigate("BuyersScreen")}>
                    {/*Donute Button Image */}
                    <Image
                        style={{ width: 24, height: 20, margin: 10, resizeMode: "cover" }}
                        source={require('../../assets/images/arrow_left_black.png')}
                    />
                </TouchableOpacity>
                {/* menu header end */}

                <Text style={AppStyles.header_title_screen}>Edit Buyer Info</Text>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                >

                    <View style={{ paddingBottom: 70, marginHorizontal: 10 }}>

                        <Text style={styles.text}>Buyer First Name</Text>
                        <TextInput
                            ref={(input) => { this.buyers_first_nameTextInput = input; }}
                            style={styles.textInput}
                            editable
                            keyboardType="default"
                            value={this.state.buyers_first_name}
                            onChangeText={(text) => this.onChangeText(text, 'buyers_first_name')}
                        />
                        {this.state.error_buyers_first_name ? (
                            <Text style={AppStyles.errortext}>
                                * Please enter first name to proceed.
                            </Text>
                        ) : null}

                        <Text style={styles.text}>Buyer Middle Name</Text>
                        <TextInput
                            ref={(input) => { this.buyers_mid_nameTextInput = input; }}
                            style={styles.textInput}
                            editable
                            keyboardType="default"
                            value={this.state.buyers_mid_name}
                            onChangeText={(text) => this.onChangeText(text, 'buyers_mid_name')}
                        />
                        <Text style={styles.text}>Buyer Last Name</Text>
                        <TextInput
                            ref={(input) => { this.buyers_last_nameTextInput = input; }}
                            style={styles.textInput}
                            editable
                            keyboardType="default"
                            value={this.state.buyers_last_name}
                            onChangeText={(text) => this.onChangeText(text, 'buyers_last_name')}
                        />
                        {this.state.error_buyers_last_name ? (
                            <Text style={AppStyles.errortext}>
                                * Please enter last name to proceed.
                            </Text>
                        ) : null}

                        <Text style={styles.text}>Buyer Address</Text>
                        <TextInput
                            ref={(input) => { this.buyers_addressTextInput = input; }}
                            style={styles.textInput}
                            editable
                            keyboardType="default"
                            value={this.state.buyers_address}
                            onChangeText={(text) => this.onChangeText(text, 'buyers_address')}
                        />
                        {this.state.error_buyers_address ? (
                            <Text style={AppStyles.errortext}>
                                * Please enter address to proceed.
                            </Text>
                        ) : null}

                        <Text style={styles.text}>Buyer City</Text>
                        <TextInput
                            ref={(input) => { this.buyers_cityTextInput = input; }}
                            style={styles.textInput}
                            editable
                            keyboardType="default"
                            value={this.state.buyers_city}
                            onChangeText={(text) => this.onChangeText(text, 'buyers_city')}
                        />
                        {this.state.error_buyers_city ? (
                            <Text style={AppStyles.errortext}>
                                * Please enter city to proceed.
                            </Text>
                        ) : null}

                        <Text style={styles.text}>Buyer State</Text>
                        <Dropdown
                            ref={(input) => { this.buyers_stateTextInput = input; }}
                            style={{ fontSize: 16, fontFamily: 'poppinsRegular', color: AppStyles.colorBlue.color, marginTop:5  }}
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
                        {this.state.error_buyers_state ? (
                            <Text style={AppStyles.errortext}>
                                * Please enter state to proceed.
                            </Text>
                        ) : null}

                        <Text style={styles.text}>Buyer Zip</Text>
                        <TextInput
                            ref={(input) => { this.buyers_zipTextInput = input; }}
                            style={styles.textInput}
                            editable
                            keyboardType="numeric"
                            value={this.state.buyers_zip}
                            onChangeText={(text) => this.onChangeText(text, 'buyers_zip')}
                        />
                        {this.state.error_buyers_zip ? (
                            <Text style={AppStyles.errortext}>
                                * Please enter zip to proceed.
                            </Text>
                        ) : null}

                        <Text style={styles.text}>Buyer Country</Text>
                        <TextInput
                            ref={(input) => { this.buyers_countryTextInput = input; }}
                            style={styles.textInput}
                            editable
                            keyboardType="default"
                            value={this.state.buyers_country}
                            onChangeText={(text) => this.onChangeText(text, 'buyers_country')}
                        />
                        {this.state.error_buyers_country ? (
                            <Text style={AppStyles.errortext}>
                                * Please enter country to proceed.
                            </Text>
                        ) : null}

                        <Text style={styles.text}>Buyer Email</Text>
                        <TextInput
                            ref={(input) => { this.buyers_emailTextInput = input; }}
                            style={styles.textInput}
                            editable
                            keyboardType="email-address"
                            value={this.state.buyers_email}
                            onChangeText={(text) => this.onChangeText(text, 'buyers_email')}
                        />
                        {this.state.error_buyers_email ? (
                            <Text style={AppStyles.errortext}>
                                * Please enter email to proceed.
                            </Text>
                        ) : null}

                        <Text style={styles.text}>Buyer Work Phone</Text>
                        <TextInput
                            ref={(input) => { this.buyers_work_phoneTextInput = input; }}
                            style={styles.textInput}
                            editable
                            keyboardType="phone-pad"
                            value={this.state.buyers_work_phone}
                            onChangeText={(text) => this.onChangeText(text, 'buyers_work_phone')}
                        />
                        {this.state.error_buyers_work_phone ? (
                            <Text style={AppStyles.errortext}>
                                * Please enter work phone to proceed.
                            </Text>
                        ) : null}

                        <Text style={styles.text}>Buyer Home Phone</Text>
                        <TextInput
                            ref={(input) => { this.buyers_home_phoneTextInput = input; }}
                            style={styles.textInput}
                            editable
                            keyboardType="phone-pad"
                            value={this.state.buyers_home_phone}
                            onChangeText={(text) => this.onChangeText(text, 'buyers_home_phone')}
                        />

                        <Text style={styles.text}>Buyer Mobile</Text>
                        <TextInput
                            ref={(input) => { this.buyers_mobileTextInput = input; }}
                            style={styles.textInput}
                            editable
                            keyboardType="phone-pad"
                            value={this.state.buyers_mobile}
                            onChangeText={(text) => this.onChangeText(text, 'buyers_mobile')}
                        />

                        <Text style={styles.text}>Drivers License Number</Text>
                        <TextInput
                            ref={(input) => { this.dl_numberTextInput = input; }}
                            style={styles.textInput}
                            editable
                            keyboardType="default"
                            value={this.state.dl_number}
                            onChangeText={(text) => this.onChangeText(text, 'dl_number')}
                        />
                        {this.state.error_dl_number ? (
                            <Text style={AppStyles.errortext}>
                                * Please enter dl number to proceed.
                            </Text>
                        ) : null}

                        <Text style={styles.text}>Buyer DL State</Text>
                        <Dropdown
                            ref={(input) => { this.buyers_addressTextInput = input; }}
                            style={{ fontSize: 16, fontFamily: 'poppinsRegular', color: AppStyles.colorBlue.color, marginTop:5  }}
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
                        {this.state.error_buyers_dl_state ? (
                            <Text style={AppStyles.errortext}>
                                * Please enter dl state to proceed.
                            </Text>
                        ) : null}

                        <Text style={styles.text}>Buyer DL Expire</Text>
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
                        

                        <Text style={styles.text}>Buyer DL Date of Birth</Text>
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
                        

                        <Text style={styles.text}>Buyer Tag Number</Text>
                        <TextInput
                            ref={(input) => { this.buyers_tag_numberTextInput = input; }}
                            style={styles.textInput}
                            editable
                            keyboardType="default"
                            value={this.state.buyers_tag_number}
                            onChangeText={(text) => this.onChangeText(text, 'buyers_tag_number')}
                        />

                    </View>
                </ScrollView>

                <TouchableOpacity style={AppStyles.button} activeOpacity={.5} onPress={() => this.editBuyersInfo()}>
                    <Text style={AppStyles.buttonText}> Save Buyer Info </Text>
                </TouchableOpacity>



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
        fontSize: 18,
        color: '#01184e',
        textAlign: 'left',
        fontFamily: 'poppinsRegular',
        marginHorizontal: 15,
        alignSelf: 'center',
        marginBottom: 5,
    },

    text: {
        fontSize: 16,
        color: AppStyles.colorGrey.color,
        textAlign: 'left',
        fontFamily: 'poppinsRegular',
        marginTop: 10,
    },
    textInput: {
        fontSize: 18,
        color: AppStyles.colorBlue.color,
        textAlign: 'left',
        fontFamily: 'poppinsRegular',
        marginTop: 0,
        paddingBottom: 0,
        borderBottomColor: AppStyles.colorBlue.color, // Add this to specify bottom border color
        borderBottomWidth: 1,
    },

    profileIcon: {
        resizeMode: 'center',
        width: 120,
        height: 120,
        marginTop: 0,
        // marginLeft: 10,
        borderRadius: 25,
    },
    icon: {
        width: 30,
        height: 30,
        left: 100,
        top: -10,
        alignSelf: 'flex-end',
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: AppStyles.colorOrange.color,
        // textAlign: 'center',
        // textAlignVertical: 'center',
        borderRadius: 10,
        position: 'absolute',
    },
});