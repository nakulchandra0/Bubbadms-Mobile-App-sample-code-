import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TextInput, ActivityIndicator, ToastAndroid, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Entypo, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { getUserData, storeUserData } from "../auth";
import AppStyles from '../../utility/Styles'
import { API_URL } from '../../utility/Constants'
import { RadioButton } from 'react-native-paper';

export default class ProfileSettingsScreen extends React.Component {

    constructor(props) {
        super(props)
        this.profileImage = 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80';
    }

    static navigationOptions = { headerShown: false };

    state = {
        userid: "",
        isLoading: false,
        business_purpose_yes: "checked",
        business_purpose_no: "unchecked",
        marketing_purposes_yes: "checked",
        marketing_purposes_no: "unchecked",
        affiliates_yes: "checked",
        affiliates_no: "unchecked",
        financial_yes: "checked",
        financial_no: "unchecked",
        affiliates_everyday_yes: "checked",
        affiliates_everyday_no: "unchecked",
        affiliates_market_yes: "checked",
        affiliates_market_no: "unchecked",
        nonaffiliates_yes: "checked",
        nonaffiliates_no: "unchecked",
        sharing_yes: "checked",
        sharing_no: "unchecked",
        taxrate: "",
        servicefee: "",
        tagregistration: "",
        saletax: "",
        twelve_digit_number: ""
    }

    componentDidMount() {

        const { navigation } = this.props;
        this.focusListener = navigation.addListener('didFocus', () => {

            getUserData()
                .then(res => {
                    let data = JSON.parse(res);
                    // console.log(data)
                    this.setState({
                        userid: data.id,
                        business_purpose_yes: data.ebd == "yes" ? 'checked' : 'unchecked',
                        business_purpose_no: data.ebd == "no" ? 'checked' : 'unchecked',
                        marketing_purposes_yes: data.omp == "yes" ? 'checked' : 'unchecked',
                        marketing_purposes_no: data.omp == "no" ? 'checked' : 'unchecked',
                        affiliates_yes: data.aebt == "yes" ? 'checked' : 'unchecked',
                        affiliates_no: data.aebt == "no" ? 'checked' : 'unchecked',
                        financial_yes: data.jmf == "yes" ? 'checked' : 'unchecked',
                        financial_no: data.jmf == "no" ? 'checked' : 'unchecked',
                        affiliates_everyday_yes: data.aebc == "yes" ? 'checked' : 'unchecked',
                        affiliates_everyday_no: data.aebc == "no" ? 'checked' : 'unchecked',
                        affiliates_market_yes: data.atm == "yes" ? 'checked' : 'unchecked',
                        affiliates_market_no: data.atm == "no" ? 'checked' : 'unchecked',
                        nonaffiliates_yes: data.natm == "yes" ? 'checked' : 'unchecked',
                        nonaffiliates_no: data.natm == "no" ? 'checked' : 'unchecked',
                        sharing_yes: data.share == "yes" ? 'checked' : 'unchecked',
                        sharing_no: data.share == "no" ? 'checked' : 'unchecked',
                        taxrate: data.tax,
                        servicefee: data.dealer_fee,
                        tagregistration: data.dmv,
                        saletax: data.saletax,
                        twelve_digit_number: data.twelve_digit_number
                    })
                })
                .catch(err => alert("An error occurred"));
        });
    }

    componentWillUnmount() {
        // Remove the event listener
        this.focusListener.remove();
    }

    changeCheckBox(statename, type) {

        var oppType = "";
        if (type == 'yes') oppType = 'no'; else oppType = 'yes';

        if (this.state[statename + "_" + type] == 'unchecked')
            this.setState({ [statename + "_" + type]: 'checked', [statename + "_" + oppType]: 'unchecked' })

    }

    onChangeText(text, type) {
        // const re = /^[0-9\b]+$/;
        // if (type == "phone" || type == "zip") {
        //     if (text != "" && !re.test(text)) return false;
        // }

        if (type == "twelve_digit_number") {
            var regex = new RegExp(/^[0-9]+$/)
            if (text != "" && !regex.test(text)) return false;
            this.setState({ [type]: text });
        } else {
            var regex = new RegExp(/^[0-9.\b]+$/)
            if (text != "" && !regex.test(text)) return false;
            try {
                var count = text.match(/\./g).length;
                if (count > 1) {
                    return false;
                }
            } catch (error) {}
            this.setState({ [type]: text });
        }
    }

    updateProfileSettingByapi() {

        // console.log(this.state.business_purpose_yes=='checked'?'yes':'no')

        this.setState({ isLoading: true });
        var data = {
            "member_id": this.state.userid,
            "business_purposes": this.state.business_purpose_yes == 'checked' ? 'yes' : 'no',
            "marketing_purposes": this.state.marketing_purposes_yes == 'checked' ? 'yes' : 'no',
            "financial": this.state.financial_yes == 'checked' ? 'yes' : 'no',
            "affiliates": this.state.affiliates_yes == 'checked' ? 'yes' : 'no',
            "affiliates_everyday": this.state.affiliates_everyday_yes == 'checked' ? 'yes' : 'no',
            "affiliates_market": this.state.affiliates_market_yes == 'checked' ? 'yes' : 'no',
            "nonaffiliates": this.state.nonaffiliates_yes == 'checked' ? 'yes' : 'no',
            "sharing": this.state.sharing_yes == 'checked' ? 'yes' : 'no',
            "taxrate": this.state.taxrate,
            "servicefee": this.state.servicefee,
            "tagregistration": this.state.tagregistration,
            "saletax": this.state.saletax,
            "twelve_digit_number": this.state.twelve_digit_number
        }
        fetch(API_URL + "updateprofilesettings", {
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
                        storeUserData(data.data)
                        this.props.navigation.navigate('MyprofileScreen');
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

    render() {
        return (
            <View style={styles.container}>

                {this.state.isLoading ?
                    <View style={AppStyles.loader}>
                        <ActivityIndicator size='large' color={AppStyles.colorOrange.color} />
                    </View>
                    : <View></View>}

                <View style={{ flexDirection: "row" }}>
                    {/* menu header start */}
                    <TouchableOpacity style={AppStyles.navigationButton} onPress={() => this.props.navigation.navigate("MyprofileScreen")}>
                        {/*Donute Button Image */}
                        <Image
                            style={{ width: 24, height: 20, margin: 10, resizeMode: "cover" }}
                            source={require('../../assets/images/arrow_left_black.png')}
                        />
                    </TouchableOpacity>
                    {/* menu header end */}

                    {/* <TouchableOpacity style={{ marginTop: 45, right: 10, position: "absolute" }} onPress={() => null}>
                        <Image
                            style={{ width: 24, height: 20, resizeMode: "contain" }}
                            source={require('../../assets/images/controls.png')}
                        />
                    </TouchableOpacity> */}
                </View>
                <Text style={AppStyles.header_title_screen}>Profile Settings</Text>

                <ScrollView showsVerticalScrollIndicator={false}>

                    <View style={{ paddingBottom: 70 }}>

                        <Text style={styles.text}>For our everyday business purposes</Text>
                        <View style={{ flexDirection: 'row', marginTop: -5 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <RadioButton
                                    value="first"
                                    status={this.state.business_purpose_yes}
                                    color={AppStyles.colorBlue.color}
                                    onPress={() => this.changeCheckBox('business_purpose', 'yes')}
                                />
                                <Text style={styles.radiotext}>Yes</Text>
                            </View>

                            <View style={{ flexDirection: 'row' }}>
                                <RadioButton
                                    value="first"
                                    status={this.state.business_purpose_no}
                                    color={AppStyles.colorBlue.color}
                                    onPress={() => this.changeCheckBox('business_purpose', 'no')}
                                />
                                <Text style={styles.radiotext}>No</Text>
                            </View>
                        </View>

                        <Text style={styles.text}>For our marketing purposes</Text>
                        <View style={{ flexDirection: 'row', marginTop: -5 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <RadioButton
                                    value="first"
                                    status={this.state.marketing_purposes_yes}
                                    color={AppStyles.colorBlue.color}
                                    onPress={() => this.changeCheckBox('marketing_purposes', 'yes')}
                                />
                                <Text style={styles.radiotext}>Yes</Text>
                            </View>

                            <View style={{ flexDirection: 'row' }}>
                                <RadioButton
                                    value="first"
                                    status={this.state.marketing_purposes_no}
                                    color={AppStyles.colorBlue.color}
                                    onPress={() => this.changeCheckBox('marketing_purposes', 'no')}
                                />
                                <Text style={styles.radiotext}>No</Text>
                            </View>
                        </View>

                        <Text style={styles.text}>For joint marketing with other financial companies</Text>
                        <View style={{ flexDirection: 'row', marginTop: -5 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <RadioButton
                                    value="first"
                                    status={this.state.financial_yes}
                                    color={AppStyles.colorBlue.color}
                                    onPress={() => this.changeCheckBox('financial', 'yes')}

                                />
                                <Text style={styles.radiotext}>Yes</Text>
                            </View>

                            <View style={{ flexDirection: 'row' }}>
                                <RadioButton
                                    value="first"
                                    status={this.state.financial_no}
                                    color={AppStyles.colorBlue.color}
                                    onPress={() => this.changeCheckBox('financial', 'no')}

                                />
                                <Text style={styles.radiotext}>No</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.text}>For our affiliates' everyday business purposes
                            <Text style={{ ...styles.text, fontSize: 12 }}> (information about your transactions and experiences)</Text></Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: -5 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <RadioButton
                                    value="first"
                                    status={this.state.affiliates_yes}
                                    color={AppStyles.colorBlue.color}
                                    onPress={() => this.changeCheckBox('affiliates', 'yes')}

                                />
                                <Text style={styles.radiotext}>Yes</Text>
                            </View>

                            <View style={{ flexDirection: 'row' }}>
                                <RadioButton
                                    value="first"
                                    status={this.state.affiliates_no}
                                    color={AppStyles.colorBlue.color}
                                    onPress={() => this.changeCheckBox('affiliates', 'no')}

                                />
                                <Text style={styles.radiotext}>No</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.text}>For our affiliates' everyday business purposes
                            <Text style={{ ...styles.text, fontSize: 12 }}> (information about your creditworthiness)</Text></Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: -5 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <RadioButton
                                    value="first"
                                    status={this.state.affiliates_everyday_yes}
                                    color={AppStyles.colorBlue.color}
                                    onPress={() => this.changeCheckBox('affiliates_everyday', 'yes')}

                                />
                                <Text style={styles.radiotext}>Yes</Text>
                            </View>

                            <View style={{ flexDirection: 'row' }}>
                                <RadioButton
                                    value="first"
                                    status={this.state.affiliates_everyday_no}
                                    color={AppStyles.colorBlue.color}
                                    onPress={() => this.changeCheckBox('affiliates_everyday', 'no')}

                                />
                                <Text style={styles.radiotext}>No</Text>
                            </View>
                        </View>

                        <Text style={styles.text}>For our affiliates to market to you</Text>
                        <View style={{ flexDirection: 'row', marginTop: -5 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <RadioButton
                                    value="first"
                                    status={this.state.affiliates_market_yes}
                                    color={AppStyles.colorBlue.color}
                                    onPress={() => this.changeCheckBox('affiliates_market', 'yes')}

                                />
                                <Text style={styles.radiotext}>Yes</Text>
                            </View>

                            <View style={{ flexDirection: 'row' }}>
                                <RadioButton
                                    value="first"
                                    status={this.state.affiliates_market_no}
                                    color={AppStyles.colorBlue.color}
                                    onPress={() => this.changeCheckBox('affiliates_market', 'no')}

                                />
                                <Text style={styles.radiotext}>No</Text>
                            </View>
                        </View>

                        <Text style={styles.text}>For nonaffiliates to market to you</Text>
                        <View style={{ flexDirection: 'row', marginTop: -5 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <RadioButton
                                    value="first"
                                    status={this.state.nonaffiliates_yes}
                                    color={AppStyles.colorBlue.color}
                                    onPress={() => this.changeCheckBox('nonaffiliates', 'yes')}

                                />
                                <Text style={styles.radiotext}>Yes</Text>
                            </View>

                            <View style={{ flexDirection: 'row' }}>
                                <RadioButton
                                    value="first"
                                    status={this.state.nonaffiliates_no}
                                    color={AppStyles.colorBlue.color}
                                    onPress={() => this.changeCheckBox('nonaffiliates', 'no')}

                                />
                                <Text style={styles.radiotext}>No</Text>
                            </View>
                        </View>

                        <Text style={styles.text}>Can Sharing Be Limited?</Text>
                        <View style={{ flexDirection: 'row', marginTop: -5 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <RadioButton
                                    value="first"
                                    status={this.state.sharing_yes}
                                    color={AppStyles.colorBlue.color}
                                    onPress={() => this.changeCheckBox('sharing', 'yes')}

                                />
                                <Text style={styles.radiotext}>Yes</Text>
                            </View>

                            <View style={{ flexDirection: 'row' }}>
                                <RadioButton
                                    value="first"
                                    status={this.state.sharing_no}
                                    color={AppStyles.colorBlue.color}
                                    onPress={() => this.changeCheckBox('sharing', 'no')}

                                />
                                <Text style={styles.radiotext}>No</Text>
                            </View>
                        </View>

                        <Text style={styles.text}>Tax Rate(ex 0.07)</Text>
                        <TextInput
                            style={styles.textInput}
                            editable
                            keyboardType="numeric"
                            value={this.state.taxrate}
                            onChangeText={(text) => this.onChangeText(text, 'taxrate')}
                        />

                        <Text style={styles.text}>Service Fee</Text>
                        <TextInput
                            style={styles.textInput}
                            editable
                            keyboardType="numeric"
                            value={this.state.servicefee}
                            onChangeText={(text) => this.onChangeText(text, 'servicefee')}
                        />

                        <Text style={styles.text}>Tag/Registration</Text>
                        <TextInput
                            style={styles.textInput}
                            editable
                            keyboardType="numeric"
                            value={this.state.tagregistration}
                            onChangeText={(text) => this.onChangeText(text, 'tagregistration')}
                        />

                        <Text style={styles.text}>Sales Tax</Text>
                        <TextInput
                            style={styles.textInput}
                            editable
                            keyboardType="numeric"
                            value={this.state.saletax}
                            onChangeText={(text) => this.onChangeText(text, 'saletax')}
                        />

                        <Text style={styles.text}>12-Digit Dealer Number</Text>
                        <TextInput
                            style={styles.textInput}
                            editable
                            keyboardType="numeric"
                            value={this.state.twelve_digit_number}
                            maxLength={12}
                            onChangeText={(text) => this.onChangeText(text, 'twelve_digit_number')}
                        />

                    </View>

                </ScrollView>

                <TouchableOpacity style={AppStyles.button} activeOpacity={.5} onPress={() => this.updateProfileSettingByapi()}>
                    <Text style={AppStyles.buttonText}> Save Changes </Text>
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

    text: {
        fontSize: 16,
        color: AppStyles.colorGrey.color,
        textAlign: 'left',
        fontFamily: 'poppinsRegular',
        marginHorizontal: 10,
        marginTop: 15,
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

    radiotext: {
        fontSize: 16,
        color: AppStyles.colorGrey.color,
        textAlign: 'left',
        fontFamily: 'poppinsRegular',
        marginRight: 10,
        alignSelf: "center",
    },
});