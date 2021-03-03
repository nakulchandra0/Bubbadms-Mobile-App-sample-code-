import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ToastAndroid, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';
import AppStyles from '../utility/Styles'
import { API_URL } from '../utility/Constants';

export default class ForgetPassScreen extends React.Component {

    static navigationOptions = {
        headerShown: false,
    };

    constructor(props) {
        super(props);
    }

    state = {
        phonenumber: "",
        errorphonenumber: false,
        isLoading: false,
    }



    componentDidMount = async () => {

    }

    onChangeText(text, type) {
        const re = /^[0-9+\b]+$/;
        if (text != "" && !re.test(text)) return false;

        if (text.trim() != 0) {
            this.setState({ [type]: text, ['error' + type]: false });
        } else {
            this.setState({ [type]: text, ['error' + type]: true });
        }

    }

    getotp() {
        if (this.state.phonenumber == "") {
            this.setState({ errorphonenumber: true, });
            this.phonenumberTextInput.focus();
        } else {
            this.setState({ isLoading: true })
            var data = {
                "phone": this.state.phonenumber
            }
            fetch(API_URL + "getotp", {
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
                        // if (Platform.OS === 'android') {
                        //     ToastAndroid.show(data.message, ToastAndroid.SHORT);
                        // } else {
                        //     alert(data.message);
                        // }
                        this.props.navigation.replace('OtpScreen', { phone: this.state.phonenumber })
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

                <View style={{ height: 200, marginBottom: 10 }}>
                    <Text style={AppStyles.title_orange_two}>{'Forgot\n Password'}</Text>
                    <Text style={styles.text_after_title}>Please enter your phone number to recieve a code to create a new passward. </Text>
                </View>

                <View style={styles.textBoxContainer}>
                    <Text style={styles.text}>Phone Number</Text>
                    <TextInput
                        ref={(input) => { this.phonenumberTextInput = input; }}
                        style={styles.textInput}
                        keyboardType="numeric"
                        editable
                        value={this.state.phonenumber}
                        onChangeText={(text) => this.onChangeText(text, 'phonenumber')}
                    />
                    {this.state.errorphonenumber ? (
                        <Text style={AppStyles.errortext}>
                            * Please enter phone number to proceed.
                        </Text>
                    ) : null}
                </View>


                <TouchableOpacity style={styles.button} activeOpacity={.5}
                    onPress={() => this.getotp()}>
                    <Text style={styles.buttonText}> Send </Text>
                </TouchableOpacity>

                <View style={{ flexDirection: "row", marginBottom: 10 }}>
                    <Text style={{ ...styles.text, color: 'black' }}>Back to </Text>
                    <TouchableOpacity
                        activeOpacity={.5}
                        onPress={() => this.props.navigation.replace('LoginScreen')}>
                        <Text style={styles.text_left_orange}>Sign in</Text>
                    </TouchableOpacity>
                </View>

                {/* <Image source={require('../assets/images/bottom_car.png')} style={styles.image} /> */}
            </View>
        );

    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: "column"
    },
    image: {
        flex: 0,
        resizeMode: "center",
        height: 100,
        width: '80%',
        opacity: 0.6,
        bottom: 0,
        position: 'absolute',
    },
    textBoxContainer: {
        position: 'relative',
        alignSelf: 'stretch',
        justifyContent: 'center',
        marginHorizontal: 25,
    },
    textInput: {
        fontSize: 18,
        color: AppStyles.colorBlue.color,
        textAlign: 'left',
        fontFamily: 'poppinsRegular',
        paddingBottom: 5,
        borderBottomColor: AppStyles.colorBlue.color, // Add this to specify bottom border color
        borderBottomWidth: 1
    },

    buttonImage: {
        height: '100%',
        width: '100%',
        resizeMode: 'contain',
    },

    text: {
        fontSize: 14,
        color: AppStyles.colorGrey.color,
        textAlign: 'left',
        fontFamily: 'poppinsRegular',
        marginTop: 15,
    },

    text_after_title: {
        fontSize: 12,
        color: AppStyles.colorGrey.color,
        textAlign: 'left',
        fontFamily: 'poppinsBold',
        color: 'black',
        marginTop: 0,
        textAlign: 'center',
        marginHorizontal: 40
    },

    text_left_orange: {
        fontSize: 14,
        color: AppStyles.colorOrange.color,
        textAlign: "right",
        fontFamily: 'poppinsRegular',
        marginTop: 15,
    },

    title: {
        fontSize: 26,
        color: '#000',
        textAlign: "left",
        marginBottom: 16,
        fontFamily: 'poppinsMedium',
        marginHorizontal: 30
    },
    imageIconStyle: {
        alignSelf: "center",
        width: 60,
        height: 60,
    },
    button: {
        width: '90%',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fff',
        backgroundColor: AppStyles.colorOrange.color,
        alignSelf: 'center',
        marginBottom: 10,
        marginTop: 30,
    },
    buttonText: {
        paddingVertical: 10,
        paddingLeft: 20,
        paddingRight: 20,
        fontSize: 16,
        fontFamily: 'poppinsBold',
        color: 'white',
        textAlign: 'center',
    },

});
