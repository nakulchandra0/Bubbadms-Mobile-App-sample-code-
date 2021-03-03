import React from 'react'
// import Screen from './Screen'
import { StackActions, NavigationActions } from 'react-navigation'

import Home from './navigationScreen/Home'
import Inventory from './navigationScreen/Inventory'
import Trade from './navigationScreen/Trade'
import Buyers from './navigationScreen/Buyers'
import CoBuyers from './navigationScreen/CoBuyers'
import Insurance from './navigationScreen/Insurance'
import Calculator from './navigationScreen/Calculator'
import Yourdeal from './navigationScreen/Yourdeal'
import Reports from './navigationScreen/Reports'
import Ourplan from './navigationScreen/Ourplan'
import Myprofile from './navigationScreen/Myprofile'
import About from './navigationScreen/About'
import App from '../App';
import { onSignOut } from "../screens/auth";

export const HomeScreen = ({ navigation }) => <Home navigation={navigation} name="Home" />
export const InventoryScreen = ({ navigation }) => <Inventory navigation={navigation} name="Inventory" />
export const TradeScreen = ({ navigation }) => <Trade navigation={navigation} name="Trade" />
export const BuyersScreen = ({ navigation }) => <Buyers navigation={navigation} name="Buyers" />
export const CoBuyersScreen = ({ navigation }) => <CoBuyers navigation={navigation} name="CoBuyers" />
export const InsuranceScreen = ({ navigation }) => <Insurance navigation={navigation} name="Insurance" />
export const CalculatorScreen = ({ navigation }) => <Calculator navigation={navigation} name="Calculator" />
export const YourdealScreen = ({ navigation }) => <Yourdeal navigation={navigation} name="Yourdeal" />
export const ReportsScreen = ({ navigation }) => <Reports navigation={navigation} name="Reports" />
export const OurplanScreen = ({ navigation }) => <Ourplan navigation={navigation} name="Ourplan" />
export const MyprofileScreen = ({ navigation }) => <Myprofile navigation={navigation} name="Myprofile" />
export const AboutScreen = ({ navigation }) => <About navigation={navigation} name="About" />

export const LogoutScreen = ({ navigation }) => {
    onSignOut();
    return (
        <App />
    );
}
// export const SubProfileNameScreen = ({navigation}) => <SubProfileName navigation={navigation} name="Logout"/>