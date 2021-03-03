import { StyleSheet, Dimensions } from 'react-native';

export default StyleSheet.create({
    navigationButton: {
        width: 68,
        height: 55,
        position: 'absolute',
        opacity: 1,
        marginTop: 35,
    },
    sideMenuProfileIcon: {
        right: 0,
        position: "absolute",
        resizeMode: 'cover',
        width: 55,
        height: 55,
        marginTop: 35,
        margin: 10,
        borderRadius: 15,
    },
    backIcon: {
        width: 24,
        height: 20,
        margin: 5,
        resizeMode: "cover",
        alignSelf: 'center',
    },
    textMenu: {
        alignSelf: 'flex-start',
        marginBottom: 10,
        marginLeft: 15,
        fontFamily: 'poppinsRegular',
        fontSize: 18,
        color: '#01184e'
    },
    colorOrange: {
        color: '#fd7801',
    },
    colorBlue: {
        color: '#3498db',
    },
    colorGrey: {
        color: '#a3a3a3',
    },
    colorGreyLight: {
        color: '#e2e2e2',
    },
    colorGreyDark: {
        color: '#999999',
    },
    colorBlack: {
        color: '#000',
    },
    colorWhite: {
        color: '#fff',
    },
    colorRed: {
        color: '#FF0000',
    },
    colorGreen: {
        color: '#00d362',
    },
    backgroundColor: {
        color: '#f0f0f0',
    },

    //start bottom button with ornage color
    button: {
        width: '90%',
        borderRadius: 10,
        // borderWidth: 1,
        // borderColor: '#fff',
        backgroundColor: '#fd7801',
        alignSelf: 'center',
        marginBottom: 10,
        position: 'absolute',
        bottom: 0
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
    //end bottom button with ornage color


    loader: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title_orange: {
        flex: 0,
        height: 150,
        fontSize: 40,
        color: '#fd7801',
        textAlign: "center",
        fontFamily: 'poppinsBold',
        marginHorizontal: 30
    },
    title_orange_two: {
        flex: 0,
        fontSize: 40,
        color: '#fd7801',
        textAlign: "center",
        fontFamily: 'poppinsBold',
        marginHorizontal: 30
    },
    image_bottom: {
        resizeMode: "center",
        alignSelf: 'center',
        height: 100,
        width: '80%',
        opacity: 0.6,
        position: 'absolute',
        bottom: 0
    },


    //home page big button
    buttonCard: {
        position: "absolute", //Here is the trick
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 20,
        paddingHorizontal: 5,
        paddingVertical: 5,
        backgroundColor: '#fd7801',
        borderColor: '#fd7801',
        borderWidth: 1,
        borderRadius: 50,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 9,
    },
    buttonCardText: {
        fontSize: 20,
        color: '#fff',
        fontFamily: 'poppinsMedium',
        marginTop: 0,
        marginLeft: 10,
    },


    //search view with textinput
    search__icon: {
        width: 35,
        height: 35,
        alignSelf: "center",
        right: 1,
        position: "absolute"
    },
    search_view: {
        backgroundColor: '#fff',
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 50,
        flexDirection: "row",
        margin: 10,
    },
    search_text: {
        width: Dimensions.get('window').width / 1.22,
        height: 35,
        paddingLeft: 10,
        paddingRight: 10,
        paddingVertical: 5,
        fontFamily: 'poppinsRegular',
    },

    header_title_screen: {
        fontSize: 18,
        textAlign: 'left',
        marginLeft: 10,
        marginRight: 0,
        marginTop: 75,
        color: "#000",
        fontFamily: 'poppinsBold',
    },

    errortext: {
        fontSize: 12,
        color: '#FF0000',
        textAlign: 'left',
        fontFamily: 'poppinsRegular',
        marginTop: 5,
    },

    // date picker style
    dateInput: {
        fontSize: 18,
        color: '#3498db',
        textAlign: 'left',
        fontFamily: 'poppinsRegular',
        marginTop: 0,
        paddingBottom: 0,
        borderBottomColor: '#3498db', // Add this to specify bottom border color
        borderBottomWidth: 0,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        alignItems: 'baseline',
    },
    dateText: {
        fontFamily: 'poppinsRegular',
        fontSize: 18,
        marginLeft: 0,
        textAlign: 'left',
        color: '#3498db'
    },
});