import React from 'react';
import { Ionicons, Entypo, FontAwesome } from '@expo/vector-icons';
import { StyleSheet, View, Text, Button, TextInput, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AppStyles from '../../utility/Styles'
import { Dropdown } from 'react-native-material-dropdown';
import { loanLength } from '../../utility/Constants';
import { Checkbox } from 'react-native-paper';

export default class Calculator extends React.Component {
  //static navigationOptions = {headerShown: false,};
  constructor(props) {
    super();
  }


  state = {
    isLoading: false,
    amountToFinance: 0,
    downpayment: 0,
    loanLength: 0,
    interestRate: 0,
    error_amountToFinance: false,
    error_downpayment: false,
    error_loanLength: false,
    error_interestRate: false,
    monthlyPay: 0,
    biweeklyPay: 0,
    monthlytotalPayment: 0,
    biweeklytotalPayment: 0,
    totalInterest: 0,
    biweekly_interest: 0,
    cb_monthly: "checked",
    cb_biweekly: "unchecked",
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {

      this.setState({
        amountToFinance: 0,
        downpayment: 0,
        loanLength: 0,
        interestRate: 0,
        error_amountToFinance: false,
        error_downpayment: false,
        error_loanLength: false,
        error_interestRate: false,
        monthlyPay: 0,
        biweeklyPay: 0,
        monthlytotalPayment: 0,
        biweeklytotalPayment: 0,
        totalInterest: 0,
        biweekly_interest: 0,
        cb_monthly: "checked",
        cb_biweekly: "unchecked",
      })

    });
  }

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }

  isFloatNumber(item, evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode == 46) {
      var regex = new RegExp(/\./g)
      var count = $(item).val().match(regex).length;
      if (count > 1) {
        return false;
      }
    }
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onChangeText(text, type) {
    // const regex = /^[0-9\b]+$/;

    var regex = new RegExp(/^[0-9.\b]+$/)
    if (text != "" && !regex.test(text)) return false;

    try {
      var count = text.match(/\./g).length;
      if (count > 1) {
        return false;
      }
    } catch (error) {
      // console.log('Error ' + error)
    }

    if (text.trim() != 0) {
      this.setState({ [type]: text, ['error_' + type]: false });
    } else {
      this.setState({ [type]: text, ['error_' + type]: true });
    }
    try {
      if (type == 'amountToFinance')
        if (text != '' && this.state.loanLength != '' && this.state.interestRate != '')
          this.doCalculation(text, type)

      if (type == 'loanLength')
        if (text != '' && this.state.amountToFinance != '' && this.state.interestRate != '')
          this.doCalculation(text, type)

      if (type == 'interestRate')
        if (text != '' && this.state.amountToFinance != '' && this.state.loanLength != '')
          this.doCalculation(text, type)

      if (type == 'downpayment')
        if (text != '' && this.state.amountToFinance != '' && this.state.loanLength != '')
          this.doCalculation(text, type)
    } catch (error) {
      console.log('Error ' + error)
    }
  }

  onSelectLoanLenthPress(key, type) {
    this.setState({ [type]: loanLength[key].totalmonth, ['error_' + type]: false });
    try {
      this.doCalculation(loanLength[key].totalmonth, 'loanLength')
    } catch (error) {
      console.log('onSelectLoanLenthPress ' + error)
    }
  }

  changeCheckBox(statename, type) {

    if (statename == "cb_monthly") {
      if (this.state[statename] == 'unchecked')
        this.setState({ [statename]: 'checked', cb_biweekly: 'unchecked' })
    } else {
      if (this.state[statename] == 'unchecked')
        this.setState({ [statename]: 'checked', cb_monthly: 'unchecked' })
    }
  }

  doCalculation(text, type) {

    if (this.state.amountToFinance == "") {
      this.setState({ error_amountToFinance: true, });
    } else if (this.state.loanLength == "") {
      this.setState({ error_loanLength: true, });
    } else if (this.state.interestRate == "") {
      this.setState({ error_interestRate: true, });
    } else {

      var prin1 = type == 'amountToFinance' ? text : this.state.amountToFinance;
      var Vpayextra = type == 'downpayment' ? text : this.state.downpayment;
      var numPmts1 = type == 'loanLength' ? text : this.state.loanLength;
      var rate = type == 'interestRate' ? text == "" ? 0 : text : this.state.interestRate;

      // console.log(prin1 + " " + Vpayextra + " " + numPmts1 + " " + rate)
      // var prin2 = type == 'amountToFinance' ? text : this.state.amountToFinance;

      var i = rate / 100.0;

      var i1 = i / 12;
      var i2 = i / 26;

      if (Vpayextra != "") {
        prin1 = prin1 - Vpayextra;
      }

      var pmt1 = this.computeMonthlyPayment(prin1, numPmts1, rate);
      this.setState({
        monthlyPay: this.fns(pmt1, 2, 1, 1, 1),
        monthlytotalPayment: this.fns(pmt1 * numPmts1, 2, 1, 1, 1),
      })
      // var pmt2 = (pmt1 / 2) + Number(Vpayextra);
      var pmt2 = (pmt1 / 2);
      var VbiwkPmt0 = pmt1 * 12 / 26;
      // $('#calc_result_biweekly_payment').text("$"+fns(VbiwkPmt0,2,1,1,1));

      this.setState({
        biweeklyPay: this.fns(VbiwkPmt0, 2, 1, 1, 1),
      })

      var count = 0;
      var prin = prin1;
      var intPort = 0;
      var prinPort = 0;
      var accumInt = 0;

      while (prin > 0) {

        if ((parseInt(prin) + (parseInt(prin) * i)) > pmt2) {
          intPort = prin * i2;
          prinPort = pmt2 - intPort;
          prin = prin - prinPort;
          accumInt = accumInt + intPort;
        } else {
          intPort = prin * i2;
          prinPort = prin;
          prin = prin - prinPort;
          accumInt = accumInt + intPort;
        }

        count = count + 1;

      }

      var numPmts2 = count;

      var numPmts3 = Math.ceil(numPmts1 - (12 * numPmts2 / 26));

      var VmoInt = this.computeFixedInterestCost(prin1, rate, pmt1);
      // $('#calc_result_monthly_interest').text("$"+fns(VmoInt,2,1,1,1));

      var VbiwkInt = accumInt;
      // $('#calc_result_biweekly_interest').text("$"+fns(VbiwkInt,2,1,1,1));
      this.setState({
        totalInterest: this.fns(VmoInt, 2, 1, 1, 1),
        biweekly_interest: this.fns(VbiwkInt, 2, 1, 1, 1),
        biweeklytotalPayment: this.fns(parseInt(prin1) + parseInt(VbiwkInt), 2, 1, 1, 1) 
      })
    }
  }

  computeMonthlyPayment(prin, numPmts, intRate) {

    var pmtAmt = 0;

    if (intRate == 0) {
      pmtAmt = prin / numPmts;
    } else {
      intRate = intRate / 100.0 / 12;

      var pow = 1;
      for (var j = 0; j < numPmts; j++)
        pow = pow * (1 + intRate);

      pmtAmt = (prin * pow * intRate) / (pow - 1);

    }

    return pmtAmt;

  }

  fns(num, places, comma, type, show) {

    var sym_1 = "";
    var sym_2 = "";

    var isNeg = 0;

    if (num < 0) {
      num = num * -1;
      isNeg = 1;
    }

    var myDecFact = 1;
    var myPlaces = 0;
    var myZeros = "";
    while (myPlaces < places) {
      myDecFact = myDecFact * 10;
      myPlaces = Number(myPlaces) + Number(1);
      myZeros = myZeros + "0";
    }

    var onum = Math.round(num * myDecFact) / myDecFact;

    var integer = Math.floor(onum);
    var decimal = "";

    if (Math.ceil(onum) == integer) {
      decimal = myZeros;
    } else {
      decimal = Math.round((onum - integer) * myDecFact)
    }
    decimal = decimal.toString();
    if (decimal.length < places) {
      var fillZeroes = places - decimal.length;
      for (var z = 0; z < fillZeroes; z++) {
        decimal = "0" + decimal;
      }
    }

    if (places > 0) {
      decimal = "." + decimal;
    }

    var finNum = ""
    if (comma == 1) {
      integer = integer.toString();
      var tmpnum = "";
      var tmpinteger = "";
      var y = 0;

      for (var x = integer.length; x > 0; x--) {
        tmpnum = tmpnum + integer.charAt(x - 1);
        y = y + 1;
        if (y == 3 & x > 1) {
          tmpnum = tmpnum + ",";
          y = 0;
        }
      }

      for (var x = tmpnum.length; x > 0; x--) {
        tmpinteger = tmpinteger + tmpnum.charAt(x - 1);
      }


      finNum = tmpinteger + "" + decimal;
    } else {
      finNum = integer + "" + decimal;
    }

    if (isNeg == 1) {
      if (type == 1 && show == 1) {
        finNum = "-" + sym_1 + "" + finNum + "" + sym_2;
      } else {
        finNum = "-" + finNum;
      }

    } else {
      if (show == 1) {
        if (type == 1) {
          finNum = sym_1 + "" + finNum + "" + sym_2;
        } else
          if (type == 2) {
            finNum = finNum + "%";
          }

      }

    }

    return finNum;
  }

  computeFixedInterestCost(principal, intRate, pmtAmt) {

    var i = eval(intRate);
    i /= 100;
    i /= 12;

    var prin = eval(principal);
    var intPort = 0;
    var accumInt = 0;
    var prinPort = 0;
    var pmtCount = 0;
    var testForLast = 0;

    //CYCLES THROUGH EACH PAYMENT OF GIVEN DEBT
    while (prin > 0) {

      testForLast = (prin * (1 + i));

      if (pmtAmt < testForLast) {
        intPort = prin * i;
        accumInt = eval(accumInt) + eval(intPort);
        prinPort = eval(pmtAmt) - eval(intPort);
        prin = eval(prin) - eval(prinPort);
      } else {
        //DETERMINE FINAL PAYMENT AMOUNT
        intPort = prin * i;
        accumInt = eval(accumInt) + eval(intPort);
        prinPort = prin;
        prin = 0;
      }

      pmtCount = eval(pmtCount) + eval(1);

      if (pmtCount > 1000 || accumInt > 1000000000) {
        prin = 0;
      }

    }

    return accumInt;

  }
  // doCalculation(text, type) {

  //   // var amountFinance = this.state.amountToFinance;
  //   // var downpayment = this.state.downpayment;
  //   // var loanLength = this.state.loanLength;
  //   // var interentRate = this.state.interestRate;
  //   // if (this.state[type] == "") {
  //   //   this.setState({ ['error_' + type]: true, });
  //   // } else {

  //   if (this.state.amountToFinance == "" && type == "onsubmit") {
  //     this.setState({ error_amountToFinance: true, });
  //   } else if (this.state.loanLength == "" && type == "onsubmit") {
  //     this.setState({ error_loanLength: true, });
  //   } else if (this.state.interestRate == "" && type == "onsubmit") {
  //     this.setState({ error_interestRate: true, });
  //   } else {

  //     var amountFinance = type == 'amountToFinance' ? text : this.state.amountToFinance;
  //     var downpayment = type == 'downpayment' ? text : this.state.downpayment;
  //     var loanLength = type == 'loanLength' ? text : this.state.loanLength;
  //     var interentRate = type == 'interestRate' ? text == "" ? 0 : text : this.state.interestRate;

  //     if (downpayment != "") {
  //       amountFinance = amountFinance - downpayment;
  //     }

  //     // if(tradeinCredit != ""){
  //     //   amountFinance = amountFinance - tradeinCredit;
  //     // }
  //     var principal = parseFloat(amountFinance);
  //     var interest = parseFloat(interentRate) / 100 / 12;
  //     var payments = parseFloat(loanLength);

  //     var x = Math.pow(1 + interest, payments); //Math.pow computes powers
  //     var monthly = (principal * x * interest) / (x - 1);
  //     var bimonthly = ((principal * x * interest) / (x - 1)) * .5;
  //     var weekly = ((principal * x * interest) / (x - 1)) * .25;

  //     if (isFinite(monthly)) {
  //       // Fill in the output fields, rounding to 2 decimal places

  //       this.setState({
  //         monthlyPay: monthly.toFixed(2),
  //         biweeklyPay: bimonthly.toFixed(2),
  //         weeklyPay: weekly.toFixed(2),
  //         monthlytotalPayment: (monthly * payments).toFixed(2),
  //         totalInterest: ((monthly * payments) - principal).toFixed(2)
  //       })

  //       // console.log("$"+monthly.toFixed(2)+"\n $"+bimonthly.toFixed(2)+"\n $"+weekly.toFixed(2)+"\n $"+(monthly * payments).toFixed(2)+"\n $"+((monthly * payments) - principal).toFixed(2))
  //     } else {
  //       this.setState({
  //         monthlyPay: 0,
  //         biweeklyPay: 0,
  //         weeklyPay: 0,
  //         monthlytotalPayment: 0,
  //         totalInterest: 0
  //       })
  //     }
  //   }
  // }

  //Screen1 Component
  render() {


    return (
      <View style={styles.container}>
        {/* <NavigationDrawer /> */}

        {/* menu header start */}
        <TouchableOpacity style={AppStyles.navigationButton} onPress={this.props.navigation.openDrawer}>
          {/*Donute Button Image */}
          <Image
            source={require('../../assets/menu/menu.png')}
            style={{ width: 30, height: 18, margin: 10, }}
          />
        </TouchableOpacity>
        {/* menu header end */}

        <Text style={AppStyles.header_title_screen}>Bobby's Payment Calculator</Text>

        <ScrollView
          showsVerticalScrollIndicator={false}
        >

          <View style={{ paddingBottom: 70, marginHorizontal: 10 }}>

            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <Checkbox
                status={this.state.cb_monthly}
                color={AppStyles.colorBlue.color}
                onPress={() => this.changeCheckBox('cb_monthly', 'monthly')}
              />
              <Text style={styles.checkboxtext}>Monthly</Text>

              <Checkbox
                status={this.state.cb_biweekly}
                color={AppStyles.colorBlue.color}
                onPress={() => this.changeCheckBox('cb_biweekly', 'biweekly')}
              />
              <Text style={styles.checkboxtext}>Bi-weekly</Text>
            </View>

            <Text style={styles.text}>Amount to Finance</Text>
            <TextInput
              style={styles.textInput}
              editable
              numeric
              keyboardType="numeric"
              value={this.state.amountToFinance}
              onChangeText={(text) => this.onChangeText(text, 'amountToFinance')}
            />
            {this.state.error_amountToFinance ? (
              <Text style={AppStyles.errortext}>
                * Please enter amount finance to proceed.
              </Text>
            ) : null}

            <Text style={styles.text}>Down Payment</Text>
            <TextInput
              style={styles.textInput}
              editable
              keyboardType="numeric"
              value={this.state.downpayment}
              onChangeText={(text) => this.onChangeText(text, 'downpayment')}
            />

            <Text style={styles.text}>Loan Length</Text>
            <Dropdown
              style={{ fontSize: 16, fontFamily: 'poppinsRegular', color: AppStyles.colorBlue.color }}
              data={loanLength}
              animationDuration={100}
              itemTextStyle={{ fontFamily: 'poppinsRegular' }}
              useNativeDriver={true}
              containerStyle={{
                marginTop: -25,
                // borderBottomColor: '#636363',
                // borderBottomWidth: 1,
              }}
              inputContainerStyle={{ borderBottomColor: AppStyles.colorBlue.color, borderBottomWidth: 1 }}
              onChangeText={(value, key) => this.onSelectLoanLenthPress(key, 'loanLength')}
            />
            {this.state.error_loanLength ? (
              <Text style={AppStyles.errortext}>
                * Please select loan length to proceed.
              </Text>
            ) : null}

            <Text style={styles.text}>Interest Rate</Text>
            <TextInput
              style={styles.textInput}
              editable
              keyboardType="numeric"
              value={this.state.interestRate}
              onChangeText={(text) => this.onChangeText(text, 'interestRate')}
            />
            {this.state.error_interestRate ? (
              <Text style={AppStyles.errortext}>
                * Please enter interest rate to proceed.
              </Text>
            ) : null}

            {/* <TouchableOpacity style={{ ...AppStyles.button, width: '95%', position: 'relative', marginTop: 10 }} activeOpacity={.5} onPress={() => this.doCalculation("", "onsubmit")}>
              <Text style={AppStyles.buttonText}> Calculate </Text>
            </TouchableOpacity> */}

            <View style={{ backgroundColor: AppStyles.colorOrange.color, height: 0, marginTop: 15 }}></View>

            {/* Monthly Payment */}
            {this.state.cb_monthly == "checked" &&
              <View style={{ flexDirection: "row", marginHorizontal: 10, display: 'flex' }}>
                <Text style={styles.textLeft}>Payment</Text>
                <Text style={styles.textRight}>${this.state.monthlyPay}</Text>
              </View>
            }

            {/* Bi-Weekly Payment */}
            {this.state.cb_biweekly == "checked" &&
              <View style={{ flexDirection: "row", marginHorizontal: 10 }}>
                <Text style={styles.textLeft}>Payment</Text>
                <Text style={styles.textRight}>${this.state.biweeklyPay}</Text>
              </View>
            }

            {/* Monthly payments interest */}
            {this.state.cb_monthly == "checked" &&
              <View style={{ flexDirection: "row", marginHorizontal: 10 }}>
                <Text style={styles.textLeft}>Payments interest</Text>
                <Text style={styles.textRight}>${this.state.totalInterest}</Text>
              </View>
            }

            {/* Bi-weekly payments interest */}
            {this.state.cb_biweekly == "checked" &&
              <View style={{ flexDirection: "row", marginHorizontal: 10 }}>
                <Text style={styles.textLeft}>Payments interest</Text>
                <Text style={styles.textRight}>${this.state.biweekly_interest}</Text>
              </View>
            }

            {/* Monthly total payment */}
            {this.state.cb_monthly == "checked" &&
              <View style={{ flexDirection: "row", marginHorizontal: 10 }}>
                <Text style={styles.textLeft}>Total payment</Text>
                <Text style={styles.textRight}>${this.state.monthlytotalPayment}</Text>
              </View>
            }

            {/* Monthly total payment */}
            {this.state.cb_biweekly == "checked" &&
              <View style={{ flexDirection: "row", marginHorizontal: 10 }}>
                <Text style={styles.textLeft}>Total payment</Text>
                <Text style={styles.textRight}>${this.state.biweeklytotalPayment}</Text>
              </View>
            }

          </View>
        </ScrollView>

      </View>
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

  text: {
    fontSize: 16,
    color: AppStyles.colorGrey.color,
    textAlign: 'left',
    fontFamily: 'poppinsRegular',
    marginTop: 10,
  },
  textInput: {
    fontSize: 18,
    color: AppStyles.colorBlue.color,
    textAlign: 'left',
    fontFamily: 'poppinsRegular',
    marginTop: 0,
    paddingBottom: 0,
    borderBottomColor: AppStyles.colorBlue.color, // Add this to specify bottom border color
    borderBottomWidth: 1,
  },
  textLeft: {
    flex: 1,
    fontSize: 16,
    color: AppStyles.colorGrey.color,
    textAlign: 'left',
    fontFamily: 'poppinsMedium',
    marginTop: 10
  },

  textRight: {
    flex: 1,
    fontSize: 16,
    color: AppStyles.colorBlue.color,
    textAlign: 'right',
    fontFamily: 'poppinsMedium',
    marginTop: 10
  },

  checkboxtext: {
    fontSize: 16,
    fontFamily: 'poppinsMedium',
    marginRight: 10,
    alignSelf: "center",
    paddingTop: 3
  }
});  