import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ToastAndroid, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';
import AppStyles from '../utility/Styles'
import { API_URL, isPasswordValid } from '../utility/Constants';

export default class ChangePassScreen extends React.Component {

    static navigationOptions = {
        headerShown: false,
    };

    constructor(props) {
        super(props);
    }

    state = {
        hidePassword1: true,
        hidePassword2: true,
        newpass: '', confirmpass: '',
        errornewpass: false, errorconfirmpass: false, errormatchpass_false: false, errormatchpass_true: false,
        isLoading: false,
    }

    onChangeText(text, type) {
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
                else
                    if (this.state.newpass == text)
                        this.setState({ errormatchpass_false: false, errormatchpass_true: true });
                    else
                        this.setState({ errormatchpass_false: true, errormatchpass_true: false });
            else
                null
        else
            this.setState({ errormatchpass_false: false, errormatchpass_true: false });

    }


    setPasswordVisibility1 = () => {
        this.setState({ hidePassword1: !this.state.hidePassword1 });
    }
    setPasswordVisibility2 = () => {
        this.setState({ hidePassword2: !this.state.hidePassword2 });
    }

    changePasswordByapi() {

        if (this.state.newpass == "") {
            this.setState({ errornewpass: true, });
        } else if (this.state.confirmpass == "") {
            this.setState({ errorconfirmpass: true, });
        } else if (this.state.newpass != this.state.confirmpass) {
            this.setState({ errormatchpass_false: true, errormatchpass_true: false });
        } else if (!isPasswordValid(this.state.confirmpass)) {
            // ToastAndroid.show("you've entered invalid password! make sure formate is correct", ToastAndroid.SHORT);
            if (Platform.OS === 'android') {
                ToastAndroid.show("Criteria not match", ToastAndroid.SHORT);
            } else {
                alert("Criteria not match");
            }
        } else {
            this.setState({ isLoading: true });
            var phone = this.props.navigation.getParam('phone');
            var data = {
                "phone": phone,
                "newpassword": this.state.confirmpass
            }
            fetch(API_URL + "changepasswordbyphone", {
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
                            this.props.navigation.replace('LoginScreen');
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

    render() {

        return (
            <View style={styles.container}>

                {this.state.isLoading ?
                    <View style={AppStyles.loader}>
                        <ActivityIndicator size='large' color={AppStyles.colorOrange.color} />
                    </View>
                    :
                    <View></View>}

                <Text style={AppStyles.title_orange}>{'Set New\n to Password'}</Text>

                <View style={styles.textBoxContainer}>
                    <Text style={styles.text}>New Password</Text>

                    <TextInput
                        secureTextEntry={this.state.hidePassword1}
                        style={styles.textInput}
                        ref={(input) => { this.newpassTextInput = input; }}
                        onChangeText={(text) => this.onChangeText(text, 'newpass')}
                    />

                    <TouchableOpacity activeOpacity={0.8} style={styles.touachableButton} onPress={this.setPasswordVisibility1}>
                        <Ionicons name={(this.state.hidePassword1) ? 'md-eye-off' : 'md-eye'} style={styles.buttonImage} color={AppStyles.colorBlue.color} size={24} />
                    </TouchableOpacity>

                </View>
                {this.state.errornewpass ? (
                        <Text style={{...AppStyles.errortext,alignSelf:'flex-start', marginHorizontal:25}}>
                            * Please enter new password to proceed.
                        </Text>
                    ) : null}

                <View style={styles.textBoxContainer}>
                    <Text style={styles.text}>Confirm Password</Text>

                    <TextInput
                        secureTextEntry={this.state.hidePassword2}
                        style={styles.textInput}
                        ref={(input) => { this.confirmpassTextInput = input; }}
                        onChangeText={(text) => this.onChangeText(text, 'confirmpass')}
                    />

                    <TouchableOpacity activeOpacity={0.8} style={styles.touachableButton} onPress={this.setPasswordVisibility2}>
                        <Ionicons name={(this.state.hidePassword2) ? 'md-eye-off' : 'md-eye'} style={styles.buttonImage} color={AppStyles.colorBlue.color} size={24} />
                    </TouchableOpacity>

                </View>

                {this.state.errorconfirmpass ? (
                        <Text style={{...AppStyles.errortext,alignSelf:'flex-start', marginHorizontal:25}}>
                            * Please enter confirm password to proceed.
                        </Text>
                    ) : null}
                    {this.state.errormatchpass_false ? (
                        <Text style={{...AppStyles.errortext,alignSelf:'flex-start', marginHorizontal:25}}>
                            * password does not match.
                        </Text>
                    ) : null}
                    {this.state.errormatchpass_true ? (
                        <Text style={{ ...AppStyles.errortext, color: AppStyles.colorGreen.color, alignSelf:'flex-start', marginHorizontal:25 }}>
                            * password matched.
                        </Text>
                    ) : null}

                <Text style={{ ...AppStyles.errortext, color: AppStyles.colorBlack.color, fontSize: 10,marginHorizontal:25 }}>
                    Password should be of 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character.
                </Text>

                <TouchableOpacity style={styles.button} activeOpacity={.5}
                    onPress={() => this.changePasswordByapi()}>
                    <Text style={styles.buttonText}> Change Password </Text>
                </TouchableOpacity>

                <View style={{ flexDirection: "row", marginBottom: 10 }}>
                    <Text style={{ ...styles.text, color: 'black' }}>Already have an account? </Text>
                    <TouchableOpacity
                        activeOpacity={.5}
                        onPress={() => this.props.navigation.replace('LoginScreen')}>
                        <Text style={styles.text_left_orange}>Sign in</Text>
                    </TouchableOpacity>
                </View>


                {/* <Image source={require('../assets/images/bottom_car.png')} style={AppStyles.image_bottom} /> */}

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
    touachableButton: {
        position: 'absolute',
        right: 5,
        height: 35,
        width: 35,
        paddingHorizontal: 7,
        paddingTop: 10
    },
    buttonImage: {
        height: '100%',
        width: '100%',
    },

    text: {
        fontSize: 14,
        color: AppStyles.colorGrey.color,
        textAlign: 'left',
        fontFamily: 'poppinsRegular',
        marginTop: 15,
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
        marginTop: 40
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
