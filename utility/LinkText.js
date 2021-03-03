import React from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';
import AppStyles from './Styles'

class LinkText extends React.Component {
    state = {
        opacity: 1.0,
        isOnPressFire: false,

    }



    render() {
        return (<View>
            <Text
                style={{ ...styles.textlink, color: AppStyles.colorOrange.color, opacity: this.state.opacity }}
                suppressHighlighting={true}
                onResponderGrant={() => {
                    this.setState({ opacity: 0.5, isOnPressFire: true });
                }}
                onResponderRelease={() => {
                    setTimeout(() => {
                        this.setState({ opacity: 1.0, isOnPressFire: false });
                    }, 350);
                }}
                onResponderTerminate={() => {
                    this.setState({ opacity: 1.0, isOnPressFire: false });
                }}
                onPress={() => {
                    if (this.state.isOnPressFire) {
                        alert(this.props.data);
                    }
                    this.setState({ opacity: 1.0, isOnPressFire: false });
                }}
            >
                {this.props.data}
            </Text>
        </View>
        )
    }
}
export default LinkText;

const styles = StyleSheet.create({
    textlink: {
        fontSize: 18,
        textAlign: 'center',
        fontFamily: 'poppinsMedium',
        textDecorationLine: 'underline',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 5,
    },
});