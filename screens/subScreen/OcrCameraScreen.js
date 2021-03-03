import React from 'react';
import { Text, View, TouchableOpacity, Dimensions, Image } from 'react-native';
import { Camera } from 'expo-camera';
import AppStyles from '../../utility/Styles'
import * as Permissions from 'expo-permissions';
import { withNavigationFocus } from 'react-navigation'

const { height, width } = Dimensions.get('window');
class OcrCameraScreen extends React.Component {
    static navigationOptions = { headerShown: false };
    camera = null;

    state = {
        hasCameraPermission: null,
    };


    async componentDidMount() {

        // this.props.fetchData();
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            // this.props.fetchData();
            this.getPermissionAsync()
        });
    }

    componentWillUnmount() {
        this.focusListener.remove();
    }

    getPermissionAsync = async () => {
        const camera = await Permissions.askAsync(Permissions.CAMERA);
        // const audio = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
        const hasCameraPermission = (camera.status === 'granted');
        this.setState({ hasCameraPermission });
    };

    goback() {
        var screen = this.props.navigation.getParam('screen');
        var modelType = this.props.navigation.getParam('modelType');
        if (modelType == 'sdbuyer') {
            this.props.navigation.navigate(screen, { modelType: 'sdbuyer', imageurl: '' })
        } else if (modelType == 'sdcobuyer') {
            this.props.navigation.navigate(screen, { modelType: 'sdcobuyer', imageurl: '' })
        } else {
            this.props.navigation.navigate(screen)
        }
    }

    oncameraclick(imageurl) {
        var screen = this.props.navigation.getParam('screen');
        // this.props.navigation.navigate(screen, { imageurl })
        var modelType = this.props.navigation.getParam('modelType');
        if (modelType == 'sdbuyer') {
            this.props.navigation.navigate(screen, { modelType: 'sdbuyer', imageurl })
        } else if (modelType == 'sdcobuyer') {
            this.props.navigation.navigate(screen, { modelType: 'sdcobuyer', imageurl })
        } else {
            this.props.navigation.navigate(screen, { imageurl })
        }
    }


    render() {
        const { isFocused } = this.props
        const { hasCameraPermission } = this.state;
        if (hasCameraPermission === null) {
            return <View />;
        } else if (hasCameraPermission === false) {
            return <Text>Access to camera has been denied.</Text>;
        }
        return (
            <View style={{
                flex: 1, flexDirection: 'column',
                alignContent: 'stretch',
            }}>

                {/* menu header start */}

                <View style={{ flexDirection: "row" }}>
                    {/* menu header start */}
                    <TouchableOpacity style={AppStyles.navigationButton} onPress={() => this.goback()}>
                        {/*Donute Button Image */}
                        <Image
                            style={{ width: 24, height: 20, margin: 10, resizeMode: "cover" }}
                            source={require('../../assets/images/arrow_left_black.png')}
                        />
                    </TouchableOpacity>
                    {/* menu header end */}

                </View>
                <Text style={AppStyles.header_title_screen}>Capture Driving License</Text>

                {/* menu header end */}


                { isFocused && <Camera style={{ flex: 0, height: height / 1.5 }} ref={camera => this.camera = camera} />}


                <View
                    style={{
                        flex: 1,
                        backgroundColor: 'transparent',
                        justifyContent: 'center'
                    }}>

                    <TouchableOpacity style={{ alignSelf: 'center' }} onPress={async () => {
                        if (this.camera) {
                            let photo = await this.camera.takePictureAsync();
                            // console.log('photo', photo);
                            this.oncameraclick(photo.uri)

                        }
                    }}>
                        <View style={{
                            borderWidth: 2,
                            borderRadius: 50,
                            borderColor: AppStyles.colorOrange.color,
                            height: 60,
                            width: 60,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        >
                            <View style={{
                                borderWidth: 2,
                                borderRadius: 50,
                                borderColor: AppStyles.colorOrange.color,
                                height: 50,
                                width: 50,
                                backgroundColor: AppStyles.colorOrange.color
                            }} >
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
export default withNavigationFocus(OcrCameraScreen)