import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TextInput, ActivityIndicator, ToastAndroid, Dimensions, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import { getUserData, storeUserData } from "../auth";
import AppStyles from '../../utility/Styles'
import { API_URL, STATE } from '../../utility/Constants'
import { Dropdown } from 'react-native-material-dropdown';
import DatePicker from 'react-native-datepicker';

export default class AddCoBuyerInfoScreen extends React.Component {

    constructor(props) {
        super(props)
        this.profileImage = 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80';

    }

    static navigationOptions = { headerShown: false };

    state = {
        userid: "",
        isLoading: false,
        buyers_id: '',
        cobuyers_first_name: '', cobuyers_mid_name: '', cobuyers_last_name: '', cobuyers_address: '', cobuyers_city: '', cobuyers_state: '', cobuyers_zip: '', cobuyers_country: 'USA', cobuyers_email: '', cobuyers_work_phone: '', cobuyers_home_phone: '', cobuyers_mobile: '', dl_number: '', cobuyers_dl_state: '', cobuyers_dl_expire: '', cobuyers_dl_dob: '',
        error_buyers_id: false, error_cobuyers_first_name: false, error_cobuyers_mid_name: false, error_cobuyers_last_name: false, error_cobuyers_address: false, error_cobuyers_city: false, error_cobuyers_state: false, error_cobuyers_zip: false, error_cobuyers_country: false, error_cobuyers_email: false, error_cobuyers_work_phone: false, error_cobuyers_home_phone: false, error_cobuyers_mobile: false, error_dl_number: false, error_cobuyers_dl_state: false, error_cobuyers_dl_expire: false, error_cobuyers_dl_dob: false
    }

    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('didFocus', () => {

            this.setState({
                buyers_id: '', cobuyers_first_name: '', cobuyers_mid_name: '', cobuyers_last_name: '', cobuyers_address: '', cobuyers_city: '', cobuyers_state: '', cobuyers_zip: '', cobuyers_country: 'USA', cobuyers_email: '', cobuyers_work_phone: '', cobuyers_home_phone: '', cobuyers_mobile: '', dl_number: '', cobuyers_dl_state: '', cobuyers_dl_expire: '', cobuyers_dl_dob: '',
                error_buyers_id: false, error_cobuyers_first_name: false, error_cobuyers_mid_name: false, error_cobuyers_last_name: false, error_cobuyers_address: false, error_cobuyers_city: false, error_cobuyers_state: false, error_cobuyers_zip: false, error_cobuyers_country: false, error_cobuyers_email: false, error_cobuyers_work_phone: false, error_cobuyers_home_phone: false, error_cobuyers_mobile: false, error_dl_number: false, error_cobuyers_dl_state: false, error_cobuyers_dl_expire: false, error_cobuyers_dl_dob: false
            })

            getUserData()
                .then(res => {
                    let data = JSON.parse(res);
                    //console.log(data);
                    // console.log(data.id);
                    this.setState({ userid: data.id });
                    this.getBuyerList();
                })
                .catch(err => alert("An error occurred"));

            var imageurl = this.props.navigation.getParam('imageurl');
            if (imageurl != "") {
                this.openocr(imageurl)
            }
        });
    }

    componentWillUnmount() {
        // Remove the event listener
        this.focusListener.remove();
    }

    onChangeText(text, type) {

        if (type == "cobuyers_zip") {
            var regex = new RegExp(/^[0-9-\b]+$/)
            if (text != "" && !regex.test(text)) return false;
            try {
                var count = text.match(/\-/g).length;
                if (count > 1) return false;
            } catch (error) { }
        }

        const re = /^[0-9\b]+$/;
        if (type == "cobuyers_work_phone" || type == "cobuyers_home_phone" || type == "cobuyers_mobile") {
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
    }

    onSelectBuyerPress(key, type) {
        this.setState({ [type]: this.state.items[key].id, ['error_' + type]: false });
    }

    openocr = async (profile_image) => {

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

                this.setState({
                    cobuyers_first_name: buyername[0],
                    cobuyers_mid_name: buyername[1],
                    cobuyers_last_name: buyername.length > 2 ? buyername[2] : '',
                    cobuyers_address: buyers_address,
                    cobuyers_city: buyers_city,
                    cobuyers_state: buyers_state.toUpperCase(),
                    cobuyers_zip: buyers_zip,
                    cobuyers_country: 'USA',
                    cobuyers_email: '',
                    cobuyers_work_phone: '',
                    cobuyers_home_phone: '',
                    cobuyers_mobile: '',
                    dl_number: dl_number,
                    cobuyers_dl_state: buyers_state.toUpperCase(),
                    cobuyers_dl_expire: buyers_dl_expire,
                    cobuyers_dl_dob: buyers_dl_dob,
                })
                if (Platform.OS === 'android') {
                    ToastAndroid.show(data.message, ToastAndroid.SHORT);
                } else {
                    alert(data.message);
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
                        data.data.map((item, key) => (
                            this.state.items.push({
                                id: item.buyers_id,
                                value: item.buyers_first_name + " " + item.buyers_mid_name + " " + item.buyers_last_name
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

    async addCoBuyersInfo() {
        if (this.state.buyers_id == "") {
            this.setState({ error_buyers_id: true, });
            this.buyers_selectTextInput.focus();
        } else if (this.state.cobuyers_first_name == "") {
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
                "member_id": this.state.userid,
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
                <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity style={AppStyles.navigationButton} onPress={() => this.props.navigation.navigate("CoBuyersScreen")}>
                        {/*Donute Button Image */}
                        <Image
                            style={{ width: 24, height: 20, margin: 10, resizeMode: "cover" }}
                            source={require('../../assets/images/arrow_left_black.png')}
                        />
                    </TouchableOpacity>
                    <Text style={{
                        marginTop: 45,
                        fontSize: 16,
                        color: AppStyles.colorGrey.color,
                        right: 45, position: "absolute",
                        fontFamily: 'poppinsRegular'
                    }}>Click here to scan {">"}</Text>
                    <TouchableOpacity style={{ marginTop: 45, right: 10, position: "absolute" }} onPress={() => this.props.navigation.navigate('OcrCameraScreen', { screen: 'AddCoBuyerInfoScreen' })}>
                        <Image
                            style={{ width: 24, height: 24, resizeMode: "contain" }}
                            source={require('../../assets/images/qr-code.png')}
                        />
                    </TouchableOpacity>
                </View>
                {/* menu header end */}

                <Text style={AppStyles.header_title_screen}>Add Co-Buyer Info</Text>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                >

                    <View style={{ paddingBottom: 70, marginHorizontal: 10 }}>

                        <Text style={styles.text}>Select Buyer</Text>
                        <Dropdown
                            ref={(input) => { this.buyers_selectTextInput = input; }}
                            style={{ fontSize: 18, fontFamily: 'poppinsRegular', color: AppStyles.colorBlue.color }}
                            data={this.state.items}
                            animationDuration={100}
                            itemTextStyle={{ fontFamily: 'poppinsRegular' }}
                            containerStyle={{
                                marginTop: -25,
                            }}
                            inputContainerStyle={{ borderBottomColor: AppStyles.colorBlue.color, borderBottomWidth: 1 }}
                            value={this.state.buyers_id}
                            onChangeText={(value, key) => this.onSelectBuyerPress(key, 'buyers_id')}
                        />
                        {this.state.error_buyers_id ? (
                            <Text style={AppStyles.errortext}>
                                * Please select buyer to proceed.
                            </Text>
                        ) : null}

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
                            style={{ fontSize: 16, fontFamily: 'poppinsRegular', color: AppStyles.colorBlue.color, marginTop: 5 }}
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
                            style={{ fontSize: 16, fontFamily: 'poppinsRegular', color: AppStyles.colorBlue.color, marginTop: 5 }}
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

                <TouchableOpacity style={AppStyles.button} activeOpacity={.5} onPress={() => this.addCoBuyersInfo()}>
                    <Text style={AppStyles.buttonText}> Add Co-Buyer Info </Text>
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