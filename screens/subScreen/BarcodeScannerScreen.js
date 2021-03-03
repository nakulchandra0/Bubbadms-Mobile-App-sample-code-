import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image, Dimensions } from 'react-native';
// import Camera from 'react-native-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions';
import AppStyles from '../../utility/Styles'
import { da } from 'date-fns/locale';

export default class BarcodeScannerScreen extends React.Component {
    constructor(props) {
        super(props);
        const {
            navigation
        } = props;
    }


    //********barcode code*********//
    state = {
        hasCameraPermission: null,
        scanned: false,
    };

    async componentDidMount() {
        this.getPermissionsAsync();
    }

    getPermissionsAsync = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            hasCameraPermission: status === 'granted'
        });
    };

    render() {

        const { height, width } = Dimensions.get('window');
        const maskRowHeight = Math.round((height - 300) / 20);
        const maskColWidth = (width - 300) / 2;

        const {
            hasCameraPermission,
            scanned
        } = this.state;

        if (hasCameraPermission === null) {
            return (
                <View style={styles.container}>
                    <Text style={styles.text}>Requesting for camera permission </Text>
                </View>
            );
        }
        if (hasCameraPermission === false) {
            return (
                <View style={styles.container}>
                    <Text style={styles.text}> No access to camera </Text>
                </View>
            );
        }
        return (
            <View style={styles.container}>



                <Text style={AppStyles.header_title_screen}>Scan VIN Barcode</Text>
                <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
                    style={StyleSheet.absoluteFillObject}
                >
                    <View style={styles.maskOutter}>
                        <View style={[{ flex: maskRowHeight }, styles.maskRow, styles.maskFrame]} />
                        <View style={[{ flex: 30 }, styles.maskCenter]}>
                            <View style={[{ width: maskColWidth }, styles.maskFrame]} />
                            <View style={styles.maskInner} />
                            <View style={[{ width: maskColWidth }, styles.maskFrame]} />
                        </View>
                        <View style={[{ flex: maskRowHeight }, styles.maskRow, styles.maskFrame]} />
                    </View>
                </BarCodeScanner>
                {scanned && (<Button title={'Tap to Scan Again'}
                    onPress={() => this.setState({ scanned: false })}
                />
                )
                }

                {/* menu header start */}
                <TouchableOpacity style={AppStyles.navigationButton} onPress={() => {
                    var screen = this.props.navigation.getParam('screen')
                    if(screen == "AddInventoryInfoScreen"){
                        this.props.navigation.navigate("InventoryScreen")
                    }else if(screen == "AddTradeInfoScreen"){
                        this.props.navigation.navigate("TradeScreen")
                    }else if(screen == "StartDealScreen"){
                        this.props.navigation.navigate("StartDealScreen",{ modelType:'' })
                    }
                }}>
                    {/*Donute Button Image */}
                    <Image
                        style={{ width: 24, height: 20, margin: 10, resizeMode: "cover" }}
                        source={require('../../assets/images/arrow_left_black.png')}
                    />
                </TouchableOpacity>
                {/* menu header end */}
            </View>
        );
    }
    handleBarCodeScanned = ({
        type,
        data
    }) => {
        // this.setState({
        //     scanned: true
        // });
        // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
        var screen = this.props.navigation.getParam('screen');
        var modelType = this.props.navigation.getParam('modelType');
        // if(screen == "EditInventoryInfoScreen"){
        //     this.props.navigation.navigate(screen, { vin: data, inv_id: this.props.navigation.getParam('inv_id')})
        // }else if(screen == "EditTradeInfoScreen"){
        //     this.props.navigation.navigate(screen, { vin: data, inv_id: this.props.navigation.getParam('inv_id')})
        // }else

        var data = data.replace('I','')
        if(modelType=="SDModelInv"){
            this.props.navigation.navigate(screen, { vin: data,modelType:'SDModelInv' })
        }else if(modelType=="SDModelTrade"){
            this.props.navigation.navigate(screen, { vin: data,modelType:'SDModelTrade' })
        }else{
            this.props.navigation.navigate(screen, { vin: data })
        }

        // if(screen=="inventory"){
        //     this.props.navigation.navigate('AddInventoryInfoScreen',{ vin: data })
        // }else if(screen=="trade"){
        //     this.props.navigation.navigate('AddTradeInfoScreen',{ vin: data })
        // }

    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // alignItems: 'center',
        // justifyContent: 'center',

        flexDirection: 'column',
        alignContent: 'stretch',
    },

    text: {
        fontSize: 16,
        color: AppStyles.colorBlack.color,
        textAlign: "center",
        fontFamily: 'poppinsRegular',
        textAlignVertical: 'center',
        flex: 1
    },

    maskOutter: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    maskInner: {
        width: 300,
        backgroundColor: 'transparent',
        borderColor: AppStyles.colorBlue.color,
        borderWidth: 1,
    },
    maskFrame: {
        // backgroundColor: 'rgba(1,1,1,0.6)',
    },
    maskRow: {
        width: '100%',
    },
    maskCenter: { flexDirection: 'row' },
});
