import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TextInput, ActivityIndicator, ToastAndroid, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Entypo, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { getUserData, storeUserData } from "../auth";
import AppStyles from '../../utility/Styles'
import { API_URL, isPasswordValid } from '../../utility/Constants'

export default class ChangePasswordScreen extends React.Component {

    constructor(props) {
        super(props)
        this.profileImage = 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80';

        getUserData()
            .then(res => {
                let data = JSON.parse(res);
                this.setState({ userid: data.id })
                // setProfileImage(data.profile_image);
            })
            .catch(err => alert("An error occurred"));

    }

    static navigationOptions = { headerShown: false };

    state = {
        userid: "",
        isLoading: false,
        hidePassword1: true,
        hidePassword2: true,
        newpass: '', confirmpass: '',
        errornewpass: false, errorconfirmpass: false, errormatchpass_false: false, errormatchpass_true: false
    }

    setPasswordVisibility1 = () => {
        this.setState({ hidePassword1: !this.state.hidePassword1 });
    }
    setPasswordVisibility2 = () => {
        this.setState({ hidePassword2: !this.state.hidePassword2 });
    }

    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('didFocus', () => {
            var vin = this.props.navigation.getParam('vin');

            this.setState({
                hidePassword1: true,
                hidePassword2: true,
                newpass: '', confirmpass: '',
                errornewpass: false, errorconfirmpass: false, errormatchpass_false: false, errormatchpass_true: false
            })
        });
    }

    componentWillUnmount() {
        // Remove the event listener
        this.focusListener.remove();
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
            var data = {
                "member_id": this.state.userid,
                "newpassword": this.state.confirmpass
            }
            fetch(API_URL + "changepassword", {
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

    render() {
        return (
            <View style={styles.container}>

                {this.state.isLoading ?
                    <View style={AppStyles.loader}>
                        <ActivityIndicator size='large' color={AppStyles.colorOrange.color} />
                    </View>
                    :
                    <View></View>}

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
                <Text style={AppStyles.header_title_screen}>Change Password</Text>

                <Text style={styles.text}>New Password</Text>
                <View style={styles.textBoxContainer}>
                    <TextInput secureTextEntry={this.state.hidePassword1} style={styles.textInput} onChangeText={(text) => this.onChangeText(text, 'newpass')} />
                    <TouchableOpacity activeOpacity={0.8} style={styles.touachableButton} onPress={this.setPasswordVisibility1}>
                        <Ionicons name={(this.state.hidePassword1) ? 'md-eye-off' : 'md-eye'} color="#000" size={24} />
                    </TouchableOpacity>
                </View>
                {this.state.errornewpass ? (
                    <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                        * Please enter new password to proceed.
                    </Text>
                ) : null}

                <Text style={styles.text}>Confirm Password</Text>
                <View style={styles.textBoxContainer}>
                    <TextInput secureTextEntry={this.state.hidePassword2} style={styles.textInput} onChangeText={(text) => this.onChangeText(text, 'confirmpass')} />
                    <TouchableOpacity activeOpacity={0.8} style={styles.touachableButton} onPress={this.setPasswordVisibility2}>
                        <Ionicons name={(this.state.hidePassword2) ? 'md-eye-off' : 'md-eye'} color="#000" size={24} />
                    </TouchableOpacity>
                </View>
                {this.state.errorconfirmpass ? (
                    <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                        * Please enter confirm password to proceed.
                    </Text>
                ) : null}
                {this.state.errormatchpass_false ? (
                    <Text style={{ ...AppStyles.errortext, marginHorizontal: 10 }}>
                        * password does not match.
                    </Text>
                ) : null}
                {this.state.errormatchpass_true ? (
                    <Text style={{ ...AppStyles.errortext, marginHorizontal: 10, color: AppStyles.colorGreen.color }}>
                        * password matched.
                    </Text>
                ) : null}

                <Text style={{ ...AppStyles.errortext, marginHorizontal: 10, color: AppStyles.colorBlack.color }}>
                    Password should be of 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character.
                    </Text>

                <TouchableOpacity style={AppStyles.button} activeOpacity={.5}
                    onPress={() => this.changePasswordByapi()}>
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

    textBoxContainer: {
        position: 'relative',
        alignSelf: 'stretch',
        justifyContent: 'center'
    },

    touachableButton: {
        position: 'absolute',
        right: 5,
        height: 40,
        width: 40,
        padding: 2,
    },
});