import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TextInput, ActivityIndicator, ToastAndroid, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import { getUserData, storeUserData } from "../auth";
import AppStyles from '../../utility/Styles'
import { API_URL } from '../../utility/Constants'

export default class ViewCoBuyerInfoScreen extends React.Component {

    constructor(props) {
        super(props)
        this.profileImage = 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80';
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
                <TouchableOpacity style={AppStyles.navigationButton} onPress={() => this.props.navigation.navigate("CoBuyersScreen")}>
                    {/*Donute Button Image */}
                    <Image
                        style={{ width: 24, height: 20, margin: 10, resizeMode: "cover" }}
                        source={require('../../assets/images/arrow_left_black.png')}
                    />
                </TouchableOpacity>
                {/* menu header end */}

                <Text style={AppStyles.header_title_screen}>View Co-Buyer Info</Text>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                >

                    <View style={{ paddingBottom: 70, marginHorizontal: 10, marginTop: 10 }}>

                        <Text style={styles.text}> Buyer </Text>
                        <Text style={styles.text2} numberOfLines={1}> {this.state.items.buyers_first_name} {this.state.items.buyers_mid_name} {this.state.items.buyers_last_name} </Text>

                        <Text style={styles.text}> Co-Buyer First Name </Text>
                        <Text style={styles.text2} numberOfLines={1}> {this.state.items.co_buyers_first_name} </Text>

                        <Text style={styles.text}> Co-Buyer Middle Name </Text>
                        <Text style={styles.text2} numberOfLines={1}> {this.state.items.co_buyers_mid_name} </Text>

                        <Text style={styles.text}> Co-Buyer Last Name </Text>
                        <Text style={styles.text2} numberOfLines={1}> {this.state.items.co_buyers_last_name} </Text>

                        <Text style={styles.text}> Co-Buyer Address </Text>
                        <Text style={styles.text2} numberOfLines={1}> {this.state.items.co_buyers_address} </Text>

                        <Text style={styles.text}> Co-Buyer City </Text>
                        <Text style={styles.text2} numberOfLines={1}> {this.state.items.co_buyers_city} </Text>

                        <Text style={styles.text}> Co-Buyer State </Text>
                        <Text style={styles.text2} numberOfLines={1}> {this.state.items.co_buyers_state} </Text>

                        <Text style={styles.text}> Co-Buyer Zip </Text>
                        <Text style={styles.text2} numberOfLines={1}> {this.state.items.co_buyers_zip} </Text>

                        <Text style={styles.text}> Co-Buyer Country </Text>
                        <Text style={styles.text2} numberOfLines={1}> {this.state.items.co_buyers_county} </Text>

                        <Text style={styles.text}> Co-Buyer Email </Text>
                        <Text style={styles.text2} numberOfLines={1}> {this.state.items.co_buyers_pri_email} </Text>

                        <Text style={styles.text}> Co-Buyer Work Phone </Text>
                        <Text style={styles.text2} numberOfLines={1}> {this.state.items.co_buyers_work_phone} </Text>

                        <Text style={styles.text}> Co-Buyer Home Phone </Text>
                        <Text style={styles.text2} numberOfLines={1}> {this.state.items.co_buyers_home_phone} </Text>

                        <Text style={styles.text}> Co-Buyer Mobile </Text>
                        <Text style={styles.text2} numberOfLines={1}> {this.state.items.co_buyers_pri_phone_cell} </Text>

                        <Text style={styles.text}> Co-Buyer Drivers License Number </Text>
                        <Text style={styles.text2} numberOfLines={1}> {this.state.items.co_buyers_DL_number} </Text>

                        <Text style={styles.text}> Co-Buyer DL State </Text>
                        <Text style={styles.text2} numberOfLines={1}> {this.state.items.co_buyers_DL_state} </Text>

                        <Text style={styles.text}> Co-Buyer DL Expire </Text>
                        <Text style={styles.text2} numberOfLines={1}> {this.state.items.co_buyers_DL_expire} </Text>

                        <Text style={styles.text}> Co-Buyer DL Date of Birth </Text>
                        <Text style={styles.text2} numberOfLines={1}> {this.state.items.co_buyers_DL_dob} </Text>

                    </View>
                </ScrollView>

                <TouchableOpacity style={AppStyles.button} activeOpacity={.5} onPress={() => this.props.navigation.navigate("EditCoBuyerInfoScreen", { buyers_id: this.state.buyers_id })}>
                    <Text style={AppStyles.buttonText}> Edit Co-Buyer Info </Text>
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