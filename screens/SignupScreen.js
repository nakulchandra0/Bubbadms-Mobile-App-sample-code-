import React, { Component } from 'react';
import { Ionicons, Entypo, FontAwesome } from '@expo/vector-icons';
import { StyleSheet, View, Text, Button, ImageBackground, Image, TouchableOpacity, Dimensions, ActivityIndicator, ToastAndroid } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AppStyles from '../utility/Styles'
import { getUserData, storeUserData } from "../screens/auth";
import Carousel from 'react-native-anchor-carousel';
import { API_URL, commafy } from '../utility/Constants';


const { width, height } = Dimensions.get('window');

const datas = [
    {
        title: 'Field Testing',
        price: '0.00',
        content: 'Free 60 Day Trial\nField Testing\nCan Access All Functionality\nGives Us Yoru Feedback',
        content2: '60 Day Free Trial'
    }, {
        title: 'Primium',
        price: '10.00',
        content: 'Free 60 Day Trial\nField Testing\nCan Access All Functionality\nGives Us Yoru Feedback',
        content2: '260 Day Free'
    }, {
        title: 'Gold',
        price: '20.00',
        content: 'Free 60 Day Trial\nField Testing\nCan Access All Functionality\nGives Us Yoru Feedback',
        content2: '1 Year Free'
    }, {
        title: 'Advance',
        price: '50.00',
        content: 'Free 60 Day Trial\nField Testing\nCan Access All Functionality\nGives Us Yoru Feedback',
        content2: 'Unlimited'
    }
];

export default class SignupScreen extends React.Component {

    static navigationOptions = { headerShown: false, };
    constructor(props) {
        super();
        getUserData()
            .then(res => {
                let data = JSON.parse(res);
                this.setState({ userid: data.id });
                //this.getPackageList();
                // console.log(datas);
                // console.log(this.state.items);

            })
            .catch(err => alert("An error occurred"));
    }

    state = {
        userid: "",
        isLoading: false,
        items: []
    }

    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('didFocus', () => {
            // The screen is focused
            // Call any action
            this.setState({ searchText: '', items: [] })

            getUserData()
                .then(res => {
                    let data = JSON.parse(res);
                    this.setState({ userid: data.id });
                    this.getPackageList();
                    // console.log(datas);
                    // console.log(this.state.items);

                })
                .catch(err => alert("An error occurred"));

        });
    }

    componentWillUnmount() {
        // Remove the event listener
        this.focusListener.remove();
    }

    async getPackageList() {

        this.setState({ isLoading: true });
        this.setState({
            items: []
        })
        var data = {
            "member_id": this.state.userid,
            "tokenid": "d864990fcc21b190b7e7beb82409471ce5b8a9fe"
        }
        fetch(API_URL + "packagelist", {
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
                        data.data.map((item, key) => (
                            this.state.items.push({
                                id: item.id,
                                title: item.group_title,
                                price: item.subscription_fee,
                                content: item.subscription_info.join("\n"),
                                content2: item.subscription_days
                            })
                        ))


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

    //Screen1 Component
    render() {


        return (
            <View style={styles.container}>

                <View style={{ flexDirection: 'row', paddingTop: 40, paddingHorizontal: 10 }}>
                    <TouchableOpacity
                        activeOpacity={.5}
                        onPress={() => this.props.navigation.replace('LoginScreen')}
                    >
                        <Image
                            style={AppStyles.backIcon}
                            source={require('../assets/images/arrow_left_black.png')}
                        />
                    </TouchableOpacity>
                    {/* <Text style={styles.textHeader}>Edit Name</Text> */}
                </View>

                <Text style={{ ...AppStyles.header_title_screen, marginTop: 10, marginBottom:10 }}>Our Plan(Atleast One Plan is required for Sign Up Process)</Text>

                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View style={styles.carouselContainer}>
                        <ImageCarousel packageData={this.state.items} propsdata={this.props.navigation} />
                    </View>
                </View>

                {this.state.isLoading ?
                    <View style={AppStyles.loader}>
                        <ActivityIndicator size='large' color={AppStyles.colorOrange.color} />
                    </View>
                    : <View></View>}

            </View>
        );
    }
}

class ImageCarousel extends Component {

    renderItem = ({ item, index }) => {
        const propsdata = this.props.propsdata;
        const { id, title, price, content, content2 } = item;
        return (
            <TouchableOpacity
                activeOpacity={1}
                style={styles.item}
                onPress={() => {
                    this.numberCarousel.scrollToIndex(index);
                }}
            >

                <Text style={{
                    fontSize: 20,
                    fontFamily: 'poppinsBold',
                    textAlign: 'center',
                }}>{title}</Text>

                <Text style={{
                    fontSize: 30,
                    fontFamily: 'poppinsBold',
                    textAlign: 'center',
                    color: AppStyles.colorOrange.color,
                }}>${price}</Text>

                <Text style={{
                    fontSize: 14,
                    fontFamily: 'poppinsMedium',
                    textAlign: 'center',
                    marginHorizontal: 10
                }}>{content}</Text>

                <Text style={{
                    fontSize: 22,
                    fontFamily: 'poppinsBold',
                    textAlign: 'center',
                }}>{content2} Day Free</Text>

                <TouchableOpacity style={{ ...AppStyles.buttonCard, bottom: -50 }} activeOpacity={0.8} onPress={() => propsdata.replace('RegistrationScreen', { planid: id, plantitle: title })}>
                    <Text style={AppStyles.buttonCardText}> Upgrade </Text>
                    <Image
                        source={require('../assets/home/buttonarrow.png')}
                        style={{ width: 45, height: 45, marginLeft: 10 }}
                    />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    render() {
        const packageData = this.props.packageData;
        return (
            <Carousel
                style={styles.carousel}
                data={packageData}
                renderItem={this.renderItem}
                itemWidth={0.7 * width}
                inActiveOpacity={1}
                containerWidth={width - 10}
                initialIndex={packageData.length > 1 ? 1 : 0}
                ref={(c) => {
                    this.numberCarousel = c;
                }}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignContent: 'stretch',
        // alignItems: 'center',
        // backgroundColor:'red'
    },

    carouselContainer: {
        width: width,
        // height: height / 1.5,
        height:'70%',
        alignItems: 'center',
        marginBottom: 100,
        // backgroundColor: 'blue',
        // alignContent:'center'
    },

    carousel: {
        flex: 1,
        backgroundColor: AppStyles.backgroundColor.color,
        // backgroundColor: 'red',
        marginVertical: -40
    },
    item: {
        paddingTop: 20,
        paddingBottom: 40,
        borderWidth: 0,
        backgroundColor: 'white',
        flex: 0,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 5,
        // marginHorizontal:10
    },

});  
