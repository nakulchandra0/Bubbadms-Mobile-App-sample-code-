import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TextInput, ActivityIndicator, ToastAndroid, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import { getUserData, storeUserData } from "../auth";
import AppStyles from '../../utility/Styles'
import { API_URL, STATE, PROFILE_IMAGE_URL, PROFILE_IMAGE } from '../../utility/Constants'
import { Dropdown } from 'react-native-material-dropdown';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';



export default class EditProfileScreen extends React.Component {

    constructor(props) {
        super(props)
        // this.profileImage = 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80';
    }

    static navigationOptions = { headerShown: false };

    state = {
        userid: "",
        isLoading: false,
        firstname: "", lastname: "", phone: "", website: "", address: "", city: "", state: "", zip: "", companyname: "", profileImage: "",
        errorfirstname: "", errorlastname: "", errorphone: "", errorwebsite: "", erroraddress: "", errorcity: "", errorstate: "", errorzip: "", errorcompanyname: ""

    }

    onChangeText(text, type) {
        const re = /^[0-9\b]+$/;
        if (type == "phone" || type == "zip") {
            if (text != "" && !re.test(text)) return false;
        }
        if (text.trim() != 0) {
            this.setState({ [type]: text, ['error' + type]: false });
        } else {
            this.setState({ [type]: text, ['error' + type]: true });
        }

    }

    onStatePress(text, type) {
        this.setState({ [type]: text, ['error' + type]: false });
        // this.getModelList(this.makeData[key].id)
    }

    componentDidMount() {
        this.getPermissionAsync();

        const { navigation } = this.props;
        this.focusListener = navigation.addListener('didFocus', () => {

            getUserData()
                .then(res => {
                    let data = JSON.parse(res);
                    this.setState({
                        userid: data.id,
                        firstname: data.first_name,
                        lastname: data.last_name,
                        phone: data.phone,
                        website: data.website,
                        address: data.address,
                        city: data.city,
                        state: data.state,
                        zip: data.zip,
                        companyname: data.company_name,
                        profileImage: data.profile_image ? PROFILE_IMAGE_URL + data.profile_image : PROFILE_IMAGE
                    })
                })
                .catch(err => alert("An error occurred"));
        });
    }

    componentWillUnmount() {
        // Remove the event listener
        this.focusListener.remove();
    }

    getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    };

    selectPhotoTapped = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 4],
                quality: 1,
            });
            if (!result.cancelled) {
                this.setState({ profileImage: result.uri });
            }

            // console.log(result);

            this.editprofileimageByApi(result);

        } catch (E) {
            console.log(E);
        }
    };

    async editprofileimageByApi(profile_image) {

        let localUri = profile_image.uri;
        let filename = localUri.split('/').pop();

        // Infer the type of the image
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        var userid = {
            "member_id": this.state.userid
        }
        const postData = new FormData();
        // postData.append('profile_image', Platform.OS === "android" ? profile_image : profile_image.replace("file://", ""));
        postData.append('profile_image', { uri: localUri, name: filename, type });
        postData.append('jsonstring', JSON.stringify(userid));

        fetch(API_URL + "editprofileimage", {
            method: "POST",
            headers: {
                Accept: 'multipart/form-data',
                'Content-Type': 'multipart/form-data'
            },
            body: postData
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                // console.log(data);
                if (data.status == "true") {
                    storeUserData(data.data)
                    if (Platform.OS === 'android') {
                        ToastAndroid.show(data.message, ToastAndroid.SHORT);
                    } else {
                        alert(data.message);
                    }
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

    updateProfileDataByapi() {
        if (this.state.firstname == "") {
            this.setState({ errorfirstname: true, });
        } else if (this.state.lastname == "") {
            this.setState({ errorlastname: true, });
        } else if (this.state.phone == "") {
            this.setState({ errorphone: true, });
        } else if (this.state.website == "") {
            this.setState({ errorwebsite: true, });
        } else if (this.state.address == "") {
            this.setState({ erroraddress: true, });
        } else if (this.state.city == "") {
            this.setState({ errorcity: true, });
        } else if (this.state.state == "") {
            this.setState({ errorstate: true, });
        } else if (this.state.zip == "") {
            this.setState({ errorzip: true, });
        } else if (this.state.companyname == "") {
            this.setState({ errorcompanyname: true, });
        } else {
            this.setState({ isLoading: true });
            var data = {
                "member_id": this.state.userid,
                "firstname": this.state.firstname,
                "lastname": this.state.lastname,
                "phone": this.state.phone,
                "website": this.state.website,
                "address": this.state.address,
                "city": this.state.city,
                "state": this.state.state,
                "zip": this.state.zip,
                "companyname": this.state.companyname
            }
            fetch(API_URL + "updateprofile", {
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

                <Text style={AppStyles.header_title_screen}>Edit Profile</Text>

                <ScrollView showsVerticalScrollIndicator={false}>

                    <View style={{ paddingBottom: 70, marginHorizontal: 10 }}>
                        <View style={{ flexDirection: "row", marginTop: 15 }}>
                            <View>
                                <Image
                                    source={{ uri: this.state.profileImage }}
                                    style={styles.profileIcon}
                                />
                                {/* image picker */}
                                <TouchableOpacity activeOpacity={.5} style={styles.icon} onPress={this.selectPhotoTapped}>
                                    <Entypo name="edit" color="#fff" size={18} />
                                </TouchableOpacity>

                            </View>

                            <View style={{ flexDirection: "column", flex: 1, marginLeft: 15 }}>
                                <Text style={{ ...styles.text, marginTop: 0 }}>First Name</Text>
                                <TextInput
                                    style={styles.textInput}
                                    editable
                                    value={this.state.firstname}
                                    onChangeText={(text) => this.onChangeText(text, 'firstname')}
                                />
                                {this.state.errorfirstname ? (
                                    <Text style={{ ...AppStyles.errortext }}>
                                        * Please enter first name to proceed.
                                    </Text>
                                ) : null}

                                <Text style={styles.text}>Last Name</Text>
                                <TextInput
                                    style={styles.textInput}
                                    editable
                                    value={this.state.lastname}
                                    onChangeText={(text) => this.onChangeText(text, 'lastname')}
                                />
                                {this.state.errorlastname ? (
                                    <Text style={{ ...AppStyles.errortext }}>
                                        * Please enter last name to proceed.
                                    </Text>
                                ) : null}
                            </View>
                        </View>

                        <Text style={styles.text}>Phone</Text>
                        <TextInput
                            style={styles.textInput}
                            editable
                            value={this.state.phone}
                            keyboardType="phone-pad"
                            onChangeText={(text) => this.onChangeText(text, 'phone')}
                        />
                        {this.state.errorphone ? (
                            <Text style={{ ...AppStyles.errortext }}>
                                * Please enter phone to proceed.
                            </Text>
                        ) : null}

                        <Text style={styles.text}>Website</Text>
                        <TextInput
                            style={styles.textInput}
                            editable
                            value={this.state.website}
                            keyboardType="url"
                            onChangeText={(text) => this.onChangeText(text, 'website')}
                        />
                        {this.state.errorwebsite ? (
                            <Text style={{ ...AppStyles.errortext }}>
                                * Please enter website to proceed.
                            </Text>
                        ) : null}

                        <Text style={styles.text}>Address</Text>
                        <TextInput
                            style={styles.textInput}
                            editable
                            value={this.state.address}
                            keyboardType="default"
                            onChangeText={(text) => this.onChangeText(text, 'address')}
                        />
                        {this.state.erroraddress ? (
                            <Text style={{ ...AppStyles.errortext }}>
                                * Please enter address to proceed.
                            </Text>
                        ) : null}

                        <Text style={styles.text}>City</Text>
                        <TextInput
                            style={styles.textInput}
                            editable
                            value={this.state.city}
                            keyboardType="default"
                            onChangeText={(text) => this.onChangeText(text, 'city')}
                        />
                        {this.state.errorcity ? (
                            <Text style={{ ...AppStyles.errortext }}>
                                * Please enter city to proceed.
                            </Text>
                        ) : null}

                        <Text style={styles.text}>State</Text>
                        <Dropdown
                            ref={(input) => { this.cobuyers_stateTextInput = input; }}
                            style={{ fontSize: 16, fontFamily: 'poppinsRegular', color: AppStyles.colorBlue.color, marginTop: 5 }}
                            data={STATE}
                            animationDuration={100}
                            itemTextStyle={{ fontFamily: 'poppinsRegular' }}
                            // labelTextStyle
                            containerStyle={{
                                marginTop: -25,
                                // borderBottomColor: '#636363',
                                // borderBottomWidth: 1,
                            }}
                            inputContainerStyle={{ borderBottomColor: AppStyles.colorBlue.color, borderBottomWidth: 1 }}
                            value={this.state.state}
                            onChangeText={(value, key) => this.onStatePress(value, 'state')}
                        />
                        {this.state.errorstate ? (
                            <Text style={{ ...AppStyles.errortext }}>
                                * Please select state to proceed.
                            </Text>
                        ) : null}

                        <Text style={styles.text}>Zipcode</Text>
                        <TextInput
                            style={styles.textInput}
                            editable
                            value={this.state.zip}
                            keyboardType="number-pad"
                            onChangeText={(text) => this.onChangeText(text, 'zip')}
                        />
                        {this.state.errorzip ? (
                            <Text style={{ ...AppStyles.errortext }}>
                                * Please enter zipcode to proceed.
                            </Text>
                        ) : null}

                        <Text style={styles.text}>Company Name</Text>
                        <TextInput
                            style={styles.textInput}
                            editable
                            value={this.state.companyname}
                            keyboardType="default"
                            onChangeText={(text) => this.onChangeText(text, 'companyname')}
                        />
                        {this.state.errorcompanyname ? (
                            <Text style={{ ...AppStyles.errortext }}>
                                * Please enter company name to proceed.
                            </Text>
                        ) : null}

                    </View>
                </ScrollView>

                <TouchableOpacity style={AppStyles.button} activeOpacity={.5} onPress={() => this.updateProfileDataByapi()}>
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
        resizeMode: 'cover',
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