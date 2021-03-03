import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TextInput, ActivityIndicator, ToastAndroid, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import { getUserData, storeUserData } from "../auth";
import AppStyles from '../../utility/Styles'
import { API_URL } from '../../utility/Constants'

export default class ViewTradeInfoScreen extends React.Component {

    constructor(props) {
        super(props)
    }

    static navigationOptions = { headerShown: false };

    state = {
        userid: "",
        isLoading: false,
        items: "",
        trade_inv_id: ""
    }

    componentDidMount = async () => {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('didFocus', () => {
            this.getTradeView();
        });
    }

    componentWillUnmount() {
        // Remove the event listener
        this.focusListener.remove();
    }

    async getTradeView() {
        this.setState({ isLoading: true });

        var trade_inv_id = this.props.navigation.getParam('trade_inv_id');
        this.setState({ trade_inv_id: trade_inv_id })
        this.setState({ items: '' });

        var data = {
            "trade_inv_id": trade_inv_id
        }
        fetch(API_URL + "viewtrade", {
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
                <TouchableOpacity style={AppStyles.navigationButton} onPress={() => this.props.navigation.navigate("TradeScreen")}>
                    {/*Donute Button Image */}
                    <Image
                        style={{ width: 24, height: 20, margin: 10, resizeMode: "cover" }}
                        source={require('../../assets/images/arrow_left_black.png')}
                    />
                </TouchableOpacity>
                {/* menu header end */}

                <Text style={AppStyles.header_title_screen}>View Trade In Info</Text>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                >

                    <View style={{ paddingBottom: 70, marginHorizontal: 10, marginTop: 10 }}>

                        <Text style={styles.text}> VIN </Text>
                        <Text style={styles.text2} numberOfLines={1}> {this.state.items.trade_inv_vin} </Text>

                        <Text style={styles.text}> Year </Text>
                        <Text style={styles.text2} numberOfLines={1}> {this.state.items.trade_inv_year} </Text>

                        <Text style={styles.text}> Make </Text>
                        <Text style={styles.text2} numberOfLines={1}> {this.state.items.trade_inv_make} </Text>

                        <Text style={styles.text}> Model </Text>
                        <Text style={styles.text2} numberOfLines={1}> {this.state.items.trade_inv_model} </Text>

                        <Text style={styles.text}> Style </Text>
                        <Text style={styles.text2} numberOfLines={1}> {this.state.items.trade_inv_style} </Text>

                        <Text style={styles.text}> Color </Text>
                        <Text style={styles.text2} numberOfLines={1}> {this.state.items.trade_inv_color} </Text>

                        <Text style={styles.text}> Mileage </Text>
                        <Text style={styles.text2} numberOfLines={1}> {this.state.items.trade_inv_exempt=="yes"?'Exempt' : this.state.items.trade_inv_mileage} </Text>

                        <Text style={styles.text}> Trade Allowance </Text>
                        <Text style={styles.text2} numberOfLines={1}> {this.state.items.trade_inv_price} </Text>

                    </View>
                </ScrollView>

                <TouchableOpacity style={AppStyles.button} activeOpacity={.5} onPress={() => this.props.navigation.navigate("EditTradeInfoScreen", { trade_inv_id: this.state.trade_inv_id })}>
                    <Text style={AppStyles.buttonText}> Edit Trade In Info </Text>
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