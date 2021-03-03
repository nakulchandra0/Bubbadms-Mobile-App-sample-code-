import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { AsyncStorage, Platform, StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ActivityIndicator, ToastAndroid } from 'react-native';
import * as Font from 'expo-font';
import AppStyles from '../utility/Styles'
import { API_URL } from '../utility/Constants'
import * as Device from 'expo-device';
import { log } from 'react-native-reanimated';
import { onSignIn, USERDATA_KEY } from "./auth";

export default class LoginScreen extends React.Component {

    static navigationOptions = {
        headerShown: false,
    };

    constructor(props) {
        super(props);

    }

    state = {
        fontLoaded: false,
        hidePassword: true,
        email: "",
        password: "",
        isLoading: false,
        errorEmail: false,
        errorPassword: false
    }

    setPasswordVisibility1 = () => {
        this.setState({ hidePassword: !this.state.hidePassword });
    }

    onEnterEmailText = (text) => {
        if (text.trim() != 0) {
            this.setState({ email: text, errorEmail: false });
        } else {
            this.setState({ email: text, errorEmail: true });
        }
    }

    onEnterPassText = (text) => {
        if (text.trim() != 0) {
            this.setState({ password: text, errorPassword: false });
        } else {
            this.setState({ password: text, errorPassword: true });
        }
    }


    componentDidMount = async () => {
        await Font.loadAsync({
            poppinsBold: require('../assets/fonts/poppinsBold.ttf'),
            poppinsMedium: require('../assets/fonts/poppinsMedium.ttf'),
            poppinsRegular: require('../assets/fonts/poppinsRegular.ttf'),
          })
          try {
            this.setState({ fontLoaded: true });
          } catch (error) {
      
          }
    }

    dologin() {
        // console.log("manufacturer " + Device.manufacturer);
        // console.log("modelName " + Device.modelName);
        // console.log("os " + Platform.OS);
        if (this.state.email == "") {
            this.setState({ errorEmail: true });

        } else if (this.state.password == "") {
            this.setState({ errorPassword: true });

        } else {
            this.setState({ isLoading: true });

            var data = {
                "email": this.state.email,
                "password": this.state.password
            }

            fetch(API_URL + "dologin", {
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
                        }
                        // this.props.navigation.replace('UserOtpScreen', { phonenumer: phonenumer })
                        this.storeUserData(data.data);
                        // onSignIn().then(() => this.props.navigation.replace('MainScreen'));
                        onSignIn().then(() => this.props.navigation.replace('MainScreen'));
                    } else {
                        if (Platform.OS === 'android') {
                            ToastAndroid.show("Something went wrong! " + data.message, ToastAndroid.SHORT);
                        } else {
                            alert("Something went wrong! " + data.message);
                        }
                    }

                })
                .catch((error) => console.error(error))
                .finally(() => this.setState({ isLoading: false }));
        }
    }

    async storeUserData(user) {
        try {
            await AsyncStorage.setItem(USERDATA_KEY, JSON.stringify(user));
        } catch (error) {
            console.log("Something went wrong", error);
        }
    }

    render() {

        if (this.state.fontLoaded) {
            return (
                <View style={styles.container}>

                    {this.state.isLoading ?
                        <View style={AppStyles.loader}>
                            <ActivityIndicator size='large' color={AppStyles.colorOrange.color} />
                        </View>
                        :
                        <View></View>}

                    <Text style={AppStyles.title_orange}>{'Welcome\n Back!'}</Text>

                    <View style={styles.textBoxContainer}>
                        <Text style={styles.text}>Email</Text>
                        <TextInput
                            style={styles.textInput}
                            value={this.state.fname}
                            editable
                            keyboardType="email-address"
                            onChangeText={(text) => this.onEnterEmailText(text)}
                        />
                        {this.state.errorEmail ? (
                            <Text style={AppStyles.errortext}>
                                * Please enter email to proceed.
                            </Text>
                        ) : null}
                    </View>

                    <View style={styles.textBoxContainer}>
                        <Text style={styles.text}>Password</Text>
                        <TextInput secureTextEntry={this.state.hidePassword} style={styles.textInput} onChangeText={(text) => this.onEnterPassText(text)} />
                        <TouchableOpacity activeOpacity={0.8} style={styles.touachableButton} onPress={this.setPasswordVisibility1}>
                            <Ionicons name={(this.state.hidePassword) ? 'md-eye-off' : 'md-eye'} style={styles.buttonImage} color={AppStyles.colorBlue.color} size={24} />
                        </TouchableOpacity>
                        {this.state.errorPassword ? (
                            <Text style={AppStyles.errortext}>
                                * Please enter password to proceed.
                            </Text>
                        ) : null}
                    </View>

                    <View style={{ ...styles.textBoxContainer, marginBottom: 20 }}>
                        <TouchableOpacity
                            activeOpacity={.5}
                            onPress={() => this.props.navigation.navigate('ForgetPassScreen')}>
                            <Text style={styles.text_left_orange}>Forgot Password?</Text>
                        </TouchableOpacity>

                    </View>

                    <TouchableOpacity style={styles.button} activeOpacity={.5}
                        onPress={() => this.dologin()}>
                        <Text style={styles.buttonText}> Sign in </Text>
                    </TouchableOpacity>

                    <View style={{ flexDirection: "row", marginBottom: 10, marginHorizontal: 10 }}>
                        <Text style={{ ...styles.text, color: 'black' }}>Don't have an account? </Text>
                        <TouchableOpacity
                            activeOpacity={.5}
                            onPress={() => this.props.navigation.replace('SignupScreen')}>
                            <Text style={styles.text_left_orange}>Choose a plan to Sign up</Text>
                        </TouchableOpacity>
                    </View>

                    {/* <Image source={require('../assets/images/bottom_car.png')} style={AppStyles.image_bottom} /> */}
                </View>
            );
        } else {
            return (
                <View></View>
            );
        }

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
