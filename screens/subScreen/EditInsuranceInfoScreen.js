import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TextInput, ActivityIndicator, ToastAndroid, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import { getUserData, storeUserData } from "../auth";
import AppStyles from '../../utility/Styles'
import { API_URL, STATE } from '../../utility/Constants'
import { Dropdown } from 'react-native-material-dropdown';

export default class EditInsuranceInfoScreen extends React.Component {

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
        ins_company: '', ins_pol_num: '', ins_phone: '', ins_address: '', ins_city: '', ins_state: '', ins_zip: '', ins_agent: '',
        error_buyers_id: false, error_ins_company: false, error_ins_pol_num: false, error_ins_phone: false, error_ins_address: false, error_ins_city: false, error_ins_state: false, error_ins_zip: false, error_ins_agent: false
    }

    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('didFocus', () => {

            this.setState({
                buyers_id: '', buyers_first_name: '', buyers_mid_name: '', buyers_last_name: '', ins_company: '', ins_pol_num: '', ins_phone: '', ins_address: '', ins_city: '', ins_state: '', ins_zip: '', ins_agent: '',
                error_buyers_id: false, error_ins_company: false, error_ins_pol_num: false, error_ins_phone: false, error_ins_address: false, error_ins_city: false, error_ins_state: false, error_ins_zip: false, error_ins_agent: false
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
                            ins_company: data.data.ins_company,
                            ins_pol_num: data.data.ins_pol_num,
                            ins_phone: data.data.ins_phone,
                            ins_address: data.data.ins_address,
                            ins_city: data.data.ins_city,
                            ins_state: data.data.ins_state,
                            ins_zip: data.data.ins_zip,
                            ins_agent: data.data.ins_agent
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
        if (type == "ins_zip" || type == "ins_phone") if (text != "" && !re.test(text)) return false;

        if (text.trim() != 0) this.setState({ [type]: text, ['error_' + type]: false });
        else this.setState({ [type]: text, ['error_' + type]: true });

    }

    onStatePress(text, type) {
        this.setState({ [type]: text, ['error_' + type]: false });
    }

    async editInsuranceInfo() {
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
            fetch(API_URL + "editinsurance", {
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
                        this.props.navigation.navigate('InsuranceScreen');
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
                <TouchableOpacity style={AppStyles.navigationButton} onPress={() => this.props.navigation.navigate("InsuranceScreen")}>
                    {/*Donute Button Image */}
                    <Image
                        style={{ width: 24, height: 20, margin: 10, resizeMode: "cover" }}
                        source={require('../../assets/images/arrow_left_black.png')}
                    />
                </TouchableOpacity>
                {/* menu header end */}

                <Text style={AppStyles.header_title_screen}>Edit Insurance Info</Text>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                >

                    <View style={{ paddingBottom: 70, marginHorizontal: 10 }}>

                        <Text style={styles.text}>Select Buyer</Text>
                        <TextInput
                            style={styles.textInput}
                            editable={false}
                            keyboardType="default"
                            value={this.state.buyers_first_name + ' ' + this.state.buyers_mid_name + ' ' + this.state.buyers_last_name}
                        />

                        <Text style={styles.text}>Insurance Company</Text>
                        <TextInput
                            ref={(input) => { this.ins_companyTextInput = input; }}
                            style={styles.textInput}
                            editable
                            keyboardType="default"
                            value={this.state.ins_company}
                            onChangeText={(text) => this.onChangeText(text, 'ins_company')}
                        />
                        {this.state.error_ins_company ? (
                            <Text style={AppStyles.errortext}>
                                * Please enter company name to proceed.
                            </Text>
                        ) : null}

                        <Text style={styles.text}>Policy Number</Text>
                        <TextInput
                            ref={(input) => { this.ins_pol_numTextInput = input; }}
                            style={styles.textInput}
                            editable
                            keyboardType="default"
                            value={this.state.ins_pol_num}
                            onChangeText={(text) => this.onChangeText(text, 'ins_pol_num')}
                        />
                        {this.state.error_ins_pol_num ? (
                            <Text style={AppStyles.errortext}>
                                * Please enter policy number to proceed.
                            </Text>
                        ) : null}

                        <Text style={styles.text}>Agent Name</Text>
                        <TextInput
                            ref={(input) => { this.ins_agentTextInput = input; }}
                            style={styles.textInput}
                            editable
                            keyboardType="default"
                            value={this.state.ins_agent}
                            onChangeText={(text) => this.onChangeText(text, 'ins_agent')}
                        />
                        {this.state.error_ins_agent ? (
                            <Text style={AppStyles.errortext}>
                                * Please enter agent name to proceed.
                            </Text>
                        ) : null}

                        <Text style={styles.text}>Agent Phone</Text>
                        <TextInput
                            ref={(input) => { this.ins_phoneTextInput = input; }}
                            style={styles.textInput}
                            editable
                            keyboardType="numeric"
                            value={this.state.ins_phone}
                            onChangeText={(text) => this.onChangeText(text, 'ins_phone')}
                        />
                        {this.state.error_ins_phone ? (
                            <Text style={AppStyles.errortext}>
                                * Please enter agent phone to proceed.
                            </Text>
                        ) : null}

                        <Text style={styles.text}>Address</Text>
                        <TextInput
                            ref={(input) => { this.ins_addressTextInput = input; }}
                            style={styles.textInput}
                            editable
                            keyboardType="default"
                            value={this.state.ins_address}
                            onChangeText={(text) => this.onChangeText(text, 'ins_address')}
                        />
                        {this.state.error_ins_address ? (
                            <Text style={AppStyles.errortext}>
                                * Please enter address to proceed.
                            </Text>
                        ) : null}

                        <Text style={styles.text}>City</Text>
                        <TextInput
                            ref={(input) => { this.ins_cityTextInput = input; }}
                            style={styles.textInput}
                            editable
                            keyboardType="default"
                            value={this.state.ins_city}
                            onChangeText={(text) => this.onChangeText(text, 'ins_city')}
                        />
                        {this.state.error_ins_city ? (
                            <Text style={AppStyles.errortext}>
                                * Please enter city to proceed.
                            </Text>
                        ) : null}

                        <Text style={styles.text}>State</Text>
                        <Dropdown
                            ref={(input) => { this.ins_stateTextInput = input; }}
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
                            value={this.state.ins_state}
                            onChangeText={(value, key) => this.onStatePress(value, 'ins_state')}
                        />
                        {this.state.error_ins_state ? (
                            <Text style={AppStyles.errortext}>
                                * Please enter state to proceed.
                            </Text>
                        ) : null}

                        <Text style={styles.text}>Zip</Text>
                        <TextInput
                            ref={(input) => { this.ins_zipTextInput = input; }}
                            style={styles.textInput}
                            editable
                            keyboardType="numeric"
                            value={this.state.ins_zip}
                            onChangeText={(text) => this.onChangeText(text, 'ins_zip')}
                        />
                        {this.state.error_ins_zip ? (
                            <Text style={AppStyles.errortext}>
                                * Please enter zip to proceed.
                            </Text>
                        ) : null}

                    </View>
                </ScrollView>

                <TouchableOpacity style={AppStyles.button} activeOpacity={.5} onPress={()=> this.editInsuranceInfo()}>
                    <Text style={AppStyles.buttonText}> Save Insurance Info </Text>
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