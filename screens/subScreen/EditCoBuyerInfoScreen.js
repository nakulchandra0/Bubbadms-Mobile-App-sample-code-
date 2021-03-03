import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TextInput, ActivityIndicator, ToastAndroid, Dimensions, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import { getUserData, storeUserData } from "../auth";
import AppStyles from '../../utility/Styles'
import { API_URL, STATE } from '../../utility/Constants'
import { Dropdown } from 'react-native-material-dropdown';
import DatePicker from 'react-native-datepicker';

export default class EditCoBuyerInfoScreen extends React.Component {

    constructor(props) {
        super(props)
        this.profileImage = 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80';
    }

    static navigationOptions = { headerShown: false };

    state = {
        userid: "",
        isLoading: false,
        buyers_id: '',
        buyers_first_name: '', buyers_mid_name: '', buyers_last_name: '',
        cobuyers_first_name: '', cobuyers_mid_name: '', cobuyers_last_name: '', cobuyers_address: '', cobuyers_city: '', cobuyers_state: '', cobuyers_zip: '', cobuyers_country: '', cobuyers_email: '', cobuyers_work_phone: '', cobuyers_home_phone: '', cobuyers_mobile: '', dl_number: '', cobuyers_dl_state: '', cobuyers_dl_expire: '', cobuyers_dl_dob: '',
        error_buyers_id: false, error_cobuyers_first_name: false, error_cobuyers_mid_name: false, error_cobuyers_last_name: false, error_cobuyers_address: false, error_cobuyers_city: false, error_cobuyers_state: false, error_cobuyers_zip: false, error_cobuyers_country: false, error_cobuyers_email: false, error_cobuyers_work_phone: false, error_cobuyers_home_phone: false, error_cobuyers_mobile: false, error_dl_number: false, error_cobuyers_dl_state: false, error_cobuyers_dl_expire: false, error_cobuyers_dl_dob: false
    }

    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('didFocus', () => {

            this.setState({
                buyers_id: '', buyers_first_name: '', buyers_mid_name: '', buyers_last_name: '', cobuyers_first_name: '', cobuyers_mid_name: '', cobuyers_last_name: '', cobuyers_address: '', cobuyers_city: '', cobuyers_state: '', cobuyers_zip: '', cobuyers_country: '', cobuyers_email: '', cobuyers_work_phone: '', cobuyers_home_phone: '', cobuyers_mobile: '', dl_number: '', cobuyers_dl_state: '', cobuyers_dl_expire: '', cobuyers_dl_dob: '',
                error_buyers_id: false, error_cobuyers_first_name: false, error_cobuyers_mid_name: false, error_cobuyers_last_name: false, error_cobuyers_address: false, error_cobuyers_city: false, error_cobuyers_state: false, error_cobuyers_zip: false, error_cobuyers_country: false, error_cobuyers_email: false, error_cobuyers_work_phone: false, error_cobuyers_home_phone: false, error_cobuyers_mobile: false, error_dl_number: false, error_cobuyers_dl_state: false, error_cobuyers_dl_expire: false, error_cobuyers_dl_dob: false
            })

            var buyers_id = this.props.navigation.getParam('buyers_id');
            this.setState({ buyers_id })
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
                            cobuyers_first_name: data.data.co_buyers_first_name,
                            cobuyers_mid_name: data.data.co_buyers_mid_name,
                            cobuyers_last_name: data.data.co_buyers_last_name,
                            cobuyers_address: data.data.co_buyers_address,
                            cobuyers_city: data.data.co_buyers_city,
                            cobuyers_state: data.data.co_buyers_state,
                            cobuyers_zip: data.data.co_buyers_zip,
                            cobuyers_country: data.data.co_buyers_county,
                            cobuyers_email: data.data.co_buyers_pri_email,
                            cobuyers_work_phone: data.data.co_buyers_work_phone,
                            cobuyers_home_phone: data.data.co_buyers_home_phone,
                            cobuyers_mobile: data.data.co_buyers_pri_phone_cell,
                            dl_number: data.data.co_buyers_DL_number,
                            cobuyers_dl_state: data.data.co_buyers_DL_state,
                            cobuyers_dl_expire: data.data.co_buyers_DL_expire,
                            cobuyers_dl_dob: data.data.co_buyers_DL_dob,
                            cobuyers_tag_number: data.data.co_buyers_temp_tag_number

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

    onChangeText(text, type) {
        const re = /^[0-9\b]+$/;
        if (type == "cobuyers_zip" || type == "cobuyers_work_phone" || type == "cobuyers_home_phone" || type == "cobuyers_mobile") {
            if (text != "" && !re.test(text)) return false;

        }
        if (type == "cobuyers_work_phone" || type == "cobuyers_home_phone" || type == "cobuyers_mobile") {
            if (text.trim() != 0)
                this.setState({ [type]: text, error_cobuyers_work_phone: false });
            else
                this.setState({ [type]: text, error_cobuyers_work_phone: true });
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

    async editCoBuyersInfo() {
        if (this.state.cobuyers_first_name == "") {
            this.setState({ error_cobuyers_first_name: true, });
            this.cobuyers_first_nameTextInput.focus();
        } else if (this.state.cobuyers_last_name == "") {
            this.setState({ error_cobuyers_last_name: true, });
            this.cobuyers_last_nameTextInput.focus();
        } else if (this.state.cobuyers_address == "") {
            this.setState({ error_cobuyers_address: true, });
            this.cobuyers_addressTextInput.focus();
        } else if (this.state.cobuyers_city == "") {
            this.setState({ error_cobuyers_city: true, });
            this.cobuyers_cityTextInput.focus();
        } else if (this.state.cobuyers_state == "") {
            this.setState({ error_cobuyers_state: true, });
            this.cobuyers_stateTextInput.focus();
        } else if (this.state.cobuyers_zip == "") {
            this.setState({ error_cobuyers_zip: true, });
            this.cobuyers_zipTextInput.focus();
        } else if (this.state.cobuyers_country == "") {
            this.setState({ error_cobuyers_country: true, });
            this.cobuyers_countryTextInput.focus();
        } else if (this.state.cobuyers_email == "") {
            this.setState({ error_cobuyers_email: true, });
            this.cobuyers_emailTextInput.focus();


        } else if (this.state.cobuyers_work_phone == "" && this.state.cobuyers_home_phone == "" && this.state.cobuyers_mobile == "") {
            this.setState({ error_cobuyers_work_phone: true, });
            this.cobuyers_work_phoneTextInput.focus();

        } else if (this.state.dl_number == "") {
            this.setState({ error_dl_number: true, });
            this.dl_numberTextInput.focus();
        } else if (this.state.cobuyers_dl_state == "") {
            this.setState({ error_cobuyers_dl_state: true, });
            this.cobuyers_dl_stateTextInput.focus();

        } else {
            this.setState({ isLoading: true });
            var data = {
                "buyers_id": this.state.buyers_id,
                "cobuyer_firstname": this.state.cobuyers_first_name,
                "cobuyer_middlename": this.state.cobuyers_mid_name,
                "cobuyer_lastname": this.state.cobuyers_last_name,
                "cobuyer_email": this.state.cobuyers_email,
                "cobuyer_address": this.state.cobuyers_address,
                "cobuyer_city": this.state.cobuyers_city,
                "cobuyer_country": this.state.cobuyers_country,
                "cobuyer_state": this.state.cobuyers_state,
                "cobuyer_zip": this.state.cobuyers_zip,
                "cobuyer_workphone": this.state.cobuyers_work_phone,
                "cobuyer_homephone": this.state.cobuyers_home_phone,
                "cobuyer_mobile": this.state.cobuyers_mobile,
                "cobuyer_dlnumber": this.state.dl_number,
                "cobuyer_dlstate": this.state.cobuyers_dl_state,
                "cobuyer_dlexpire": this.state.cobuyers_dl_expire,
                "cobuyer_dldob": this.state.cobuyers_dl_dob
            }

            // console.log(data)
            fetch(API_URL + "editcobuyer", {
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
                        this.props.navigation.navigate('CoBuyersScreen');
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
                <TouchableOpacity style={AppStyles.navigationButton} onPress={() => this.props.navigation.navigate("CoBuyersScreen")}>
                    {/*Donute Button Image */}
                    <Image
                        style={{ width: 24, height: 20, margin: 10, resizeMode: "cover" }}
                        source={require('../../assets/images/arrow_left_black.png')}
                    />
                </TouchableOpacity>
                {/* menu header end */}

                <Text style={AppStyles.header_title_screen}>Edit Co-Buyer Info</Text>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                >

                    <View style={{ paddingBottom: 70, marginHorizontal:10 }}>

                        <Text style={styles.text}>Selected Buyer</Text>
                        <TextInput
                            style={styles.textInput}
                            editable={false}
                            keyboardType="default"
                            value={this.state.buyers_first_name + ' ' + this.state.buyers_mid_name + ' ' + this.state.buyers_last_name}
                        />

                        <Text style={styles.text}>Co-Buyer First Name</Text>
                        <TextInput
                            ref={(input) => { this.cobuyers_first_nameTextInput = input; }}
                            style={styles.textInput}
                            editable
                            keyboardType="default"
                            value={this.state.cobuyers_first_name}
                            onChangeText={(text) => this.onChangeText(text, 'cobuyers_first_name')}
                        />
                        {this.state.error_cobuyers_first_name ? (
                            <Text style={AppStyles.errortext}>
                                * Please enter first name to proceed.
                            </Text>
                        ) : null}

                        <Text style={styles.text}>Co-Buyer Middle Name</Text>
                        <TextInput
                            ref={(input) => { this.cobuyers_mid_nameTextInput = input; }}
                            style={styles.textInput}
                            editable
                            keyboardType="default"
                            value={this.state.cobuyers_mid_name}
                            onChangeText={(text) => this.onChangeText(text, 'cobuyers_mid_name')}
                        />

                        <Text style={styles.text}>Co-Buyer Last Name</Text>
                        <TextInput
                            ref={(input) => { this.cobuyers_last_nameTextInput = input; }}
                            style={styles.textInput}
                            editable
                            keyboardType="default"
                            value={this.state.cobuyers_last_name}
                            onChangeText={(text) => this.onChangeText(text, 'cobuyers_last_name')}
                        />
                        {this.state.error_cobuyers_last_name ? (
                            <Text style={AppStyles.errortext}>
                                * Please enter last name to proceed.
                            </Text>
                        ) : null}

                        <Text style={styles.text}>Co-Buyer Address</Text>
                        <TextInput
                            ref={(input) => { this.cobuyers_addressTextInput = input; }}
                            style={styles.textInput}
                            editable
                            keyboardType="default"
                            value={this.state.cobuyers_address}
                            onChangeText={(text) => this.onChangeText(text, 'cobuyers_address')}
                        />
                        {this.state.error_cobuyers_address ? (
                            <Text style={AppStyles.errortext}>
                                * Please enter address to proceed.
                            </Text>
                        ) : null}

                        <Text style={styles.text}>Co-Buyer City</Text>
                        <TextInput
                            ref={(input) => { this.cobuyers_cityTextInput = input; }}
                            style={styles.textInput}
                            editable
                            keyboardType="default"
                            value={this.state.cobuyers_city}
                            onChangeText={(text) => this.onChangeText(text, 'cobuyers_city')}
                        />
                        {this.state.error_cobuyers_city ? (
                            <Text style={AppStyles.errortext}>
                                * Please enter city to proceed.
                            </Text>
                        ) : null}

                        <Text style={styles.text}>Co-Buyer State</Text>
                        <Dropdown
                            ref={(input) => { this.cobuyers_stateTextInput = input; }}
                            style={{ fontSize: 16, fontFamily: 'poppinsRegular', color: AppStyles.colorBlue.color, marginTop:5  }}
                            data={STATE}
                            animationDuration={100}
                            itemTextStyle={{ fontFamily: 'poppinsRegular' }}
                            containerStyle={{
                                marginTop: -25,
                                // borderBottomColor: '#636363',
                                // borderBottomWidth: 1,
                            }}
                            inputContainerStyle={{ borderBottomColor: AppStyles.colorBlue.color, borderBottomWidth: 1 }}
                            value={this.state.cobuyers_state}
                            onChangeText={(value, key) => this.onStatePress(value, 'cobuyers_state')}
                        />
                        {this.state.error_cobuyers_state ? (
                            <Text style={AppStyles.errortext}>
                                * Please enter state to proceed.
                            </Text>
                        ) : null}

                        <Text style={styles.text}>Co-Buyer Zip</Text>
                        <TextInput
                            ref={(input) => { this.cobuyers_zipTextInput = input; }}
                            style={styles.textInput}
                            editable
                            keyboardType="numeric"
                            value={this.state.cobuyers_zip}
                            onChangeText={(text) => this.onChangeText(text, 'cobuyers_zip')}
                        />
                        {this.state.error_cobuyers_zip ? (
                            <Text style={AppStyles.errortext}>
                                * Please enter zip to proceed.
                            </Text>
                        ) : null}

                        <Text style={styles.text}>Co-Buyer Country</Text>
                        <TextInput
                            ref={(input) => { this.cobuyers_countryTextInput = input; }}
                            style={styles.textInput}
                            editable
                            keyboardType="default"
                            value={this.state.cobuyers_country}
                            onChangeText={(text) => this.onChangeText(text, 'cobuyers_country')}
                        />
                        {this.state.error_cobuyers_country ? (
                            <Text style={AppStyles.errortext}>
                                * Please enter country to proceed.
                            </Text>
                        ) : null}

                        <Text style={styles.text}>Co-Buyer Email</Text>
                        <TextInput
                            ref={(input) => { this.cobuyers_emailTextInput = input; }}
                            style={styles.textInput}
                            editable
                            keyboardType="email-address"
                            value={this.state.cobuyers_email}
                            onChangeText={(text) => this.onChangeText(text, 'cobuyers_email')}
                        />
                        {this.state.error_cobuyers_email ? (
                            <Text style={AppStyles.errortext}>
                                * Please enter email to proceed.
                            </Text>
                        ) : null}

                        <Text style={styles.text}>Co-Buyer Work Phone</Text>
                        <TextInput
                            ref={(input) => { this.cobuyers_work_phoneTextInput = input; }}
                            style={styles.textInput}
                            editable
                            keyboardType="phone-pad"
                            value={this.state.cobuyers_work_phone}
                            onChangeText={(text) => this.onChangeText(text, 'cobuyers_work_phone')}
                        />
                        {this.state.error_cobuyers_work_phone ? (
                            <Text style={AppStyles.errortext}>
                                * Please enter any one number to proceed.
                            </Text>
                        ) : null}

                        <Text style={styles.text}>Co-Buyer Home Phone</Text>
                        <TextInput
                            ref={(input) => { this.cobuyers_home_phoneTextInput = input; }}
                            style={styles.textInput}
                            editable
                            keyboardType="phone-pad"
                            value={this.state.cobuyers_home_phone}
                            onChangeText={(text) => this.onChangeText(text, 'cobuyers_home_phone')}
                        />

                        <Text style={styles.text}>Co-Buyer Mobile</Text>
                        <TextInput
                            ref={(input) => { this.cobuyers_mobileTextInput = input; }}
                            style={styles.textInput}
                            editable
                            keyboardType="phone-pad"
                            value={this.state.cobuyers_mobile}
                            onChangeText={(text) => this.onChangeText(text, 'cobuyers_mobile')}
                        />

                        <Text style={styles.text}>Co-Buyer Drivers License Number</Text>
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

                        <Text style={styles.text}>Co-Buyer DL State</Text>
                        <Dropdown
                            ref={(input) => { this.cobuyers_addressTextInput = input; }}
                            style={{ fontSize: 16, fontFamily: 'poppinsRegular', color: AppStyles.colorBlue.color, marginTop:5  }}
                            data={STATE}
                            animationDuration={100}
                            itemTextStyle={{ fontFamily: 'poppinsRegular' }}
                            containerStyle={{
                                marginTop: -25,
                                marginBottom: -10
                                // borderBottomColor: '#636363',
                                // borderBottomWidth: 1,
                            }}
                            inputContainerStyle={{ borderBottomColor: AppStyles.colorBlue.color, borderBottomWidth: 1 }}
                            value={this.state.cobuyers_dl_state}
                            onChangeText={(value, key) => this.onStatePress(value, 'cobuyers_dl_state')}
                        />
                        {this.state.error_cobuyers_dl_state ? (
                            <Text style={AppStyles.errortext}>
                                * Please enter dl state to proceed.
                            </Text>
                        ) : null}

                        <Text style={styles.text}>Co-Buyer DL Expire</Text>
                        <DatePicker
                            style={{ alignItems: 'flex-start', width: Dimensions.get("window").width / 1.06 }}
                            date={this.state.cobuyers_dl_expire} //initial date from state
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
                            onDateChange={(date) => { this.setState({ cobuyers_dl_expire: date }); }}
                        />
                        <View style={{ backgroundColor: AppStyles.colorBlue.color, height: 1 }}></View>

                        <Text style={styles.text}>Co-Buyer DL Date of Birth</Text>
                        <DatePicker
                            style={{ alignItems: 'flex-start', width: Dimensions.get("window").width / 1.06 }}
                            date={this.state.cobuyers_dl_dob} //initial date from state
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
                            onDateChange={(date) => { this.setState({ cobuyers_dl_dob: date }); }}
                        />
                        <View style={{ backgroundColor: AppStyles.colorBlue.color, height: 1 }}></View>

                    </View>
                </ScrollView>

                <TouchableOpacity style={AppStyles.button} activeOpacity={.5} onPress={()=> this.editCoBuyersInfo()}>
                    <Text style={AppStyles.buttonText}> Save Co-Buyer Info </Text>
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