import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TextInput, ActivityIndicator, ToastAndroid, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import { getUserData, storeUserData } from "../auth";
import AppStyles from '../../utility/Styles'
import { API_URL } from '../../utility/Constants'
import { Checkbox } from 'react-native-paper';

export default class AddInventoryInfoScreen extends React.Component {

    constructor(props) {
        super(props)
        this.profileImage = 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80';
        this.onChangeText = this.onChangeText.bind(this)
        getUserData()
            .then(res => {
                let data = JSON.parse(res);
                this.setState({ userid: data.id })
                // setProfileImage(data.profile_image);
            })
            .catch(err => alert("An error occurred"));
    }

    static navigationOptions = { headerShown: false };

    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('didFocus', () => {
            var vin = this.props.navigation.getParam('vin');

            this.setState({
                vin: "", year: "", make: "", model: "", style: "", stockNumber: "", color: "", mileage: "", exempt: "unchecked", cost: 0, addedCost: 0, totalCost: 0, vehiclePrice: "",
                errorvin: false, erroryear: false, errormake: false, errormodel: false,
                errorstyle: false, errorstockNumber: false, errorcolor: false, errormileage: false,
                errorcost: false, erroraddedCost: false, errorvehiclePrice: false,
            })
            this.getInventoryDataFromVIN(vin);
        });
    }

    componentWillUnmount() {
        // Remove the event listener
        this.focusListener.remove();
    }

    async getInventoryDataFromVIN(vin) {
        this.setState({ isLoading: true });

        var data = {
            "format": 'json',
            "data": vin
        }

        var formBody = [];
        for (var property in data) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(data[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");

        fetch("https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVINValuesBatch", {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: formBody
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                // console.log(data['Results']);
                if (data['Count'] == 0) {
                    //ToastAndroid.show(data['Message'], ToastAndroid.SHORT);
                    this.setState({
                        vin: vin, year: '',make: '',model: '',style: '',stockNumber: '',color: "",mileage: "",exempt: "unchecked",cost: 0, addedCost: 0, totalCost: 0, vehiclePrice: "",
                    })
                }
                this.setState({
                    vin: vin,
                    year: data['Results'][0]['ModelYear'] ? data['Results'][0]['ModelYear'] : '',
                    make: data['Results'][0]['Make'] ? data['Results'][0]['Make'] : '',
                    model: data['Results'][0]['Model'] ? data['Results'][0]['Model'] : '',
                    style: data['Results'][0]['BodyClass'] ? data['Results'][0]['BodyClass'] : '',
                    stockNumber: "", color: "", mileage: "", exempt: "unchecked", cost: 0, addedCost: 0, totalCost: 0, vehiclePrice: "",
                })

            })
            .catch((error) => console.error(error))
            .finally(() => this.setState({ isLoading: false }));
    }

    state = {
        userid: "",
        isLoading: false,
        vin: "", year: "", make: "", model: "", style: "", stockNumber: "", color: "", mileage: "", exempt: "unchecked", cost: 0, addedCost: 0, totalCost: 0, vehiclePrice: "",
        errorvin: false, erroryear: false, errormake: false, errormodel: false, errorstyle: false, errorstockNumber: false, errorcolor: false, errormileage: false, errorcost: false, erroraddedCost: false, errorvehiclePrice: false,
    }

    onChangeText(text, type) {
        const re = /^[0-9\b]+$/;
        if ( type == "year" || type == "cost" || type == "addedCost" || type == "mileage" || type == "vehiclePrice" ) {
            if (text != "" && !re.test(text)) return false;
        }
        if (text.trim() != 0 && type != "addedCost") {
            this.setState({ [type]: text, ['error' + type]: false });
        } else {
            this.setState({ [type]: text, ['error' + type]: true });
        }

        if (type == "cost") {
            const totalcost = (parseInt(text) + parseInt(this.state.addedCost))
            this.setState({ totalCost: totalcost + "" })
        }
        if (type == "addedCost") {

            if (text.trim() != "") {
                this.setState({ [type]: text, ['error' + type]: false });
            } else {
                this.setState({ [type]: text, ['error' + type]: true });
            }

            const totalcost = (parseInt(this.state.cost) + parseInt(text))
            this.setState({ totalCost: totalcost + "" })
        }

        if (type == "vin") if (text.length >= 13) this.getInventoryDataFromVIN(text);


        // if(type == "year") if(!re.test(text))return false;


    }

    changeCheckBox(statename) {
        if (this.state[statename] == 'unchecked')
            this.setState({
                [statename]: 'checked', errormileage: false
            });
        else
            this.setState({
                [statename]: 'unchecked'
            })
    }

    async addInventoryInfo() {
        if (this.state.vin == "") {
            this.setState({ errorvin: true, });
        } else if (this.state.year == "") {
            this.setState({ erroryear: true, });
        } else if (this.state.make == "") {
            this.setState({ errormake: true, });
        } else if (this.state.model == "") {
            this.setState({ errormodel: true, });
        } else if (this.state.style == "") {
            this.setState({ errorstyle: true, });
        } else if (this.state.stockNumber == "") {
            this.setState({ errorstockNumber: true, });
        } else if (this.state.color == "") {
            this.setState({ errorcolor: true, });
        } else if (this.state.exempt == "unchecked" && this.state.mileage == "") {
            this.setState({ errormileage: true, });
        } else if (this.state.cost == "") {
            this.setState({ errorcost: true, });
        } else if (this.state.addedCost == "") {
            this.setState({ erroraddedCost: true, });
        } else if (this.state.vehiclePrice == "") {
            this.setState({ errorvehiclePrice: true, });
        } else {
            this.setState({ isLoading: true });
            var data = {
                "member_id": this.state.userid,
                "vin": this.state.vin,
                "stocknumber": this.state.stockNumber,
                "year": this.state.year,
                "make": this.state.make,
                "model": this.state.model,
                "style": this.state.style,
                "color": this.state.color,
                "mileage": this.state.mileage,
                "exempt": this.state.exempt == "checked" ? 'yes' : 'no',
                "cost": this.state.cost,
                "addedcost": this.state.addedCost,
                "stickerprice": this.state.vehiclePrice,
                "totalcost": this.state.totalCost
            }
            fetch(API_URL + "addinventory", {
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
                        this.props.navigation.navigate('InventoryScreen');
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
                <TouchableOpacity style={AppStyles.navigationButton} onPress={() => this.props.navigation.navigate("InventoryScreen")}>
                    {/*Donute Button Image */}
                    <Image
                        style={{ width: 24, height: 20, margin: 10, resizeMode: "cover" }}
                        source={require('../../assets/images/arrow_left_black.png')}
                    />
                </TouchableOpacity>
                {/* menu header end */}

                <Text style={AppStyles.header_title_screen}>Add Inventory Info</Text>

                <ScrollView showsVerticalScrollIndicator={false}>

                    <View style={{ paddingBottom: 70, marginHorizontal: 10 }}>

                        <Text style={styles.text}>VIN</Text>
                        <View style={{ flexDirection: "row" }}>
                            <TextInput
                                style={{ ...styles.textInput, flex: 1, paddingEnd: 40 }}
                                editable
                                keyboardType="default"
                                value={this.state.vin}
                                onChangeText={(text) => this.onChangeText(text, 'vin')}

                            />
                            <TouchableOpacity style={{ position: "absolute", right: 0, bottom: 0 }} onPress={() => this.props.navigation.navigate("BarcodeScannerScreen", { screen: "AddInventoryInfoScreen" })}>
                                {/*Donute Button Image */}
                                <Image
                                    style={{ width: 24, height: 24, margin: 10, resizeMode: "cover" }}
                                    source={require('../../assets/images/qr-code.png')}
                                />
                            </TouchableOpacity>
                        </View>
                        {this.state.errorvin ? (
                            <Text style={AppStyles.errortext}>
                                * Please enter VIN number to proceed.
                            </Text>
                        ) : null}

                        <Text style={styles.text}>Year</Text>
                        <TextInput
                            style={styles.textInput}
                            editable
                            keyboardType="numeric"
                            value={this.state.year}
                            onChangeText={(text) => this.onChangeText(text, 'year')}
                        />
                        {this.state.erroryear ? (
                            <Text style={AppStyles.errortext}>
                                * Please enter year to proceed.
                            </Text>
                        ) : null}

                        <Text style={styles.text}>Make</Text>
                        <TextInput
                            style={styles.textInput}
                            editable
                            keyboardType="default"
                            value={this.state.make}
                            onChangeText={(text) => this.onChangeText(text, 'make')}
                        />
                        {this.state.errormake ? (
                            <Text style={AppStyles.errortext}>
                                * Please enter make to proceed.
                            </Text>
                        ) : null}

                        <Text style={styles.text}>Model</Text>
                        <TextInput
                            style={styles.textInput}
                            editable
                            keyboardType="default"
                            value={this.state.model}
                            onChangeText={(text) => this.onChangeText(text, 'model')}
                        />
                        {this.state.errormodel ? (
                            <Text style={AppStyles.errortext}>
                                * Please enter model to proceed.
                            </Text>
                        ) : null}

                        <Text style={styles.text}>Style</Text>
                        <TextInput
                            style={styles.textInput}
                            editable
                            keyboardType="default"
                            value={this.state.style}
                            onChangeText={(text) => this.onChangeText(text, 'style')}
                        />
                        {this.state.errorstyle ? (
                            <Text style={AppStyles.errortext}>
                                * Please enter style to proceed.
                            </Text>
                        ) : null}

                        <Text style={styles.text}>Stock Number</Text>
                        <TextInput
                            style={styles.textInput}
                            editable
                            keyboardType="default"
                            value={this.state.stockNumber}
                            onChangeText={(text) => this.onChangeText(text, 'stockNumber')}
                        />
                        {this.state.errorstockNumber ? (
                            <Text style={AppStyles.errortext}>
                                * Please enter stock number to proceed.
                            </Text>
                        ) : null}

                        <Text style={styles.text}>Color</Text>
                        <TextInput
                            style={styles.textInput}
                            editable
                            keyboardType="default"
                            value={this.state.color}
                            onChangeText={(text) => this.onChangeText(text, 'color')}
                        />
                        {this.state.errorcolor ? (
                            <Text style={AppStyles.errortext}>
                                * Please enter color to proceed.
                            </Text>
                        ) : null}

                        <Text style={styles.text}>Mileage</Text>
                        <TextInput
                            style={styles.textInput}
                            editable
                            keyboardType="numeric"
                            value={this.state.mileage}
                            onChangeText={(text) => this.onChangeText(text, 'mileage')}
                        />
                        {this.state.errormileage ? (
                            <Text style={AppStyles.errortext}>
                                * Please enter mileage to proceed.
                            </Text>
                        ) : null}

                        <View style={{ flexDirection: 'row' }}>
                            <Checkbox
                                status={this.state.exempt}
                                color={AppStyles.colorBlue.color}
                                onPress={() => this.changeCheckBox('exempt')}
                            />
                            <Text style={styles.checkboxtext}>Exempt</Text>
                        </View>

                        <Text style={styles.text}>Cost</Text>
                        <TextInput
                            style={styles.textInput}
                            editable
                            keyboardType="numeric"
                            value={this.state.cost}
                            onChangeText={(text) => this.onChangeText(text, 'cost')}
                        />
                        {this.state.errorcost ? (
                            <Text style={AppStyles.errortext}>
                                * Please enter cost to proceed.
                            </Text>
                        ) : null}

                        <Text style={styles.text}>Added Cost</Text>
                        <TextInput
                            style={styles.textInput}
                            editable
                            keyboardType="numeric"
                            value={this.state.addedCost}
                            onChangeText={(text) => this.onChangeText(text, 'addedCost')}

                        />
                        {this.state.erroraddedCost ? (
                            <Text style={AppStyles.errortext}>
                                * Please enter added cost to proceed.
                            </Text>
                        ) : null}

                        <Text style={styles.text}>Total Cost</Text>
                        <TextInput
                            style={styles.textInput}
                            editable={false}
                            value={this.state.totalCost}
                        />

                        <Text style={styles.text}>Vehicle Price</Text>
                        <TextInput
                            style={styles.textInput}
                            editable
                            keyboardType="number-pad"
                            value={this.state.vehiclePrice}
                            onChangeText={(text) => this.onChangeText(text, 'vehiclePrice')}
                        />
                        {this.state.errorvehiclePrice ? (
                            <Text style={AppStyles.errortext}>
                                * Please enter vehicle price to proceed.
                            </Text>
                        ) : null}

                    </View>
                </ScrollView>

                <TouchableOpacity style={AppStyles.button} activeOpacity={.5} onPress={() => this.addInventoryInfo()}>
                    <Text style={AppStyles.buttonText}> Add Inventory Info </Text>
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
        // marginHorizontal: 10,
        marginTop: 10,
    },
    textInput: {
        fontSize: 18,
        color: AppStyles.colorBlue.color,
        textAlign: 'left',
        fontFamily: 'poppinsRegular',
        // marginHorizontal: 10,
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
    checkboxtext: {
        fontSize: 16,
        // textAlign: 'left',
        fontFamily: 'poppinsRegular',
        marginRight: 10,
        marginTop: 2,
        alignSelf: "center",
    },
});