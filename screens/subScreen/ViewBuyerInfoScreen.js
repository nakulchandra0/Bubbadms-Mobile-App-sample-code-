import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TextInput, ActivityIndicator, ToastAndroid, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import { getUserData, storeUserData } from "../auth";
import AppStyles from '../../utility/Styles'
import { API_URL } from '../../utility/Constants'

export default class ViewBuyerInfoScreen extends React.Component {

    constructor(props) {
        super(props)
    }

    static navigationOptions = { headerShown: false };

    state = {
        userid: "",
        isLoading: false,
        items: "",
        buyers_id: "",
    }

    componentDidMount = async () => {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('didFocus', () => {
            this.getBuyerView();
        });
    }

    componentWillUnmount() {
        // Remove the event listener
        this.focusListener.remove();
    }

    async getBuyerView() {
        this.setState({ isLoading: true });

        var buyers_id = this.props.navigation.getParam('buyers_id');
        this.setState({ buyers_id: buyers_id })
        this.setState({ items: '' });
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
                // console.log(data);
                if (data.status == "true") {
                    {
                        this.setState({ items: data.data });
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
                    :
                    <View></View>}
                {/* menu header start */}
                <TouchableOpacity style={AppStyles.navigationButton} onPress={() => this.props.navigation.navigate("BuyersScreen")}>
                    {/*Donute Button Image */}
                    <Image
                        style={{ width: 24, height: 20, margin: 10, resizeMode: "cover" }}
                        source={require('../../assets/images/arrow_left_black.png')}
                    />
                </TouchableOpacity>
                {/* menu header end */}

                <Text style={AppStyles.header_title_screen}>View Buyer Info</Text>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                >

                    <View style={{ paddingBottom: 70, marginHorizontal: 10, marginTop: 10 }}>

                        <Text style={styles.text}> Buyer First Name </Text>
                        <Text style={styles.text2} numberOfLines={1}> {this.state.items.buyers_first_name} </Text>

                        <Text style={styles.text}> Buyer Middle Name </Text>
                        <Text style={styles.text2} numberOfLines={1}> {this.state.items.buyers_mid_name} </Text>

                        <Text style={styles.text}> Buyer Last Name </Text>
                        <Text style={styles.text2} numberOfLines={1}> {this.state.items.buyers_last_name} </Text>

                        <Text style={styles.text}> Buyer Address </Text>
                        <Text style={styles.text2} numberOfLines={1}> {this.state.items.buyers_address} </Text>

                        <Text style={styles.text}> Buyer City </Text>
                        <Text style={styles.text2} numberOfLines={1}> {this.state.items.buyers_city} </Text>

                        <Text style={styles.text}> Buyer State </Text>
                        <Text style={styles.text2} numberOfLines={1}> {this.state.items.buyers_state} </Text>

                        <Text style={styles.text}> Buyer Zip </Text>
                        <Text style={styles.text2} numberOfLines={1}> {this.state.items.buyers_zip} </Text>

                        <Text style={styles.text}> Buyer Country </Text>
                        <Text style={styles.text2} numberOfLines={1}> {this.state.items.buyers_county} </Text>

                        <Text style={styles.text}> Buyer Email </Text>
                        <Text style={styles.text2} numberOfLines={1}> {this.state.items.buyers_pri_email} </Text>

                        <Text style={styles.text}> Buyer Work Phone </Text>
                        <Text style={styles.text2} numberOfLines={1}> {this.state.items.buyers_work_phone} </Text>

                        <Text style={styles.text}> Buyer Home Phone </Text>
                        <Text style={styles.text2} numberOfLines={1}> {this.state.items.buyers_home_phone} </Text>

                        <Text style={styles.text}> Buyer Mobile </Text>
                        <Text style={styles.text2} numberOfLines={1}> {this.state.items.buyers_pri_phone_cell} </Text>

                        <Text style={styles.text}> Drivers License Number </Text>
                        <Text style={styles.text2} numberOfLines={1}> {this.state.items.buyers_DL_number} </Text>

                        <Text style={styles.text}> Buyer DL State </Text>
                        <Text style={styles.text2} numberOfLines={1}> {this.state.items.buyers_DL_state} </Text>

                        <Text style={styles.text}> Buyer DL Expire </Text>
                        <Text style={styles.text2} numberOfLines={1}> {this.state.items.buyers_DL_expire} </Text>

                        <Text style={styles.text}> Buyer DL Date of Birth </Text>
                        <Text style={styles.text2} numberOfLines={1}> {this.state.items.buyers_DL_dob} </Text>

                        <Text style={styles.text}> Buyer Tag Number </Text>
                        <Text style={styles.text2} numberOfLines={1}> {this.state.items.buyers_temp_tag_number} </Text>

                    </View>
                </ScrollView>

                <TouchableOpacity style={AppStyles.button} activeOpacity={.5} onPress={() => this.props.navigation.navigate("EditBuyerInfoScreen", { buyers_id: this.state.buyers_id })}>
                    <Text style={AppStyles.buttonText}> Edit Buyer Info </Text>
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
        textAlign: 'left',
        color: AppStyles.colorGreyDark.color,
        fontFamily: 'poppinsRegular',
    },
    text2: {
        fontSize: 16,
        textAlign: 'left',
        color: AppStyles.colorBlack.color,
        fontFamily: 'poppinsMedium',
        marginTop: -5,
        marginBottom: 5
    },

});