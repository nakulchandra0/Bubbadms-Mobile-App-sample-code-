import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from "react-native";
import posed from "react-native-pose";

const windowWidth = Dimensions.get("window").width;
const tabWidth = windowWidth / 3;
const SpotLight = posed.View({
  route0: { x: 0 },
  route1: { x: tabWidth },
  route2: { x: tabWidth * 2 },
  route3: { x: tabWidth * 3 }
});

const Scaler = posed.View({
  active: { scale: 1.25 },
  inactive: { scale: 1 }
});

const TabBar = props => {
  const {
    renderIcon,
    activeTintColor,
    inactiveTintColor,
    onTabPress,
    onTabLongPress,
    getAccessibilityLabel,
    navigation
  } = props;

  const { routes, index: activeRouteIndex } = navigation.state;
  //  console.log(`S.spotLight`+activeRouteIndex);

  return (
    <View style={S.container}>
      {activeRouteIndex === 0 ?
        <View style={StyleSheet.absoluteFillObject}>
        <SpotLight 
         style={S.spotLight0}
         pose={`route${activeRouteIndex}`}>
          <View style={S.spotLightInner0} />
        </SpotLight>
      </View>
      :
      activeRouteIndex === 1 ?
        <View style={StyleSheet.absoluteFillObject}>
        <SpotLight 
         style={S.spotLight1}
         pose={`route${activeRouteIndex}`}>
          <View style={S.spotLightInner1} />
        </SpotLight>
      </View>
      :
      activeRouteIndex === 2 ?
        <View style={StyleSheet.absoluteFillObject}>
        <SpotLight 
         style={S.spotLight2}
         pose={`route${activeRouteIndex}`}>
          <View style={S.spotLightInner2} />
        </SpotLight>
      </View>
      :
      <View></View>  
    
    }
    

      {routes.slice(0, 3).map((route, routeIndex) => {
        const isRouteActive = routeIndex === activeRouteIndex;
        const tintColor = isRouteActive ? activeTintColor : inactiveTintColor;
        return (
          <TouchableOpacity
            key={routeIndex}
            style={S.tabButton}
            onPress={() => {
              onTabPress({ route });
            }}
            onLongPress={() => {
              onTabLongPress({ route });
            }}
            accessibilityLabel={getAccessibilityLabel({ route })}
          >
            <Scaler
              pose={isRouteActive ? "active" : "inactive"}
              style={S.scaler}
            >
              {/* {renderIcon({ route, focused: isRouteActive, tintColor })} */}
            <Text style={S.textTab}>{route.routeName}</Text>
            </Scaler>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TabBar;

const S = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 30,
    elevation: 2,
    alignItems: "center",
    backgroundColor:'#01184e',//blue
    borderRadius: 25, 
    margin:10,
  },
  tabButton: { flex: 1 },
  spotLight0: {
    width: tabWidth/1.1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  spotLightInner0: {
    width: Dimensions.get("window").width/3.2,
    height: 30,
    backgroundColor: "#ea4b6a",//pink
    borderRadius: 25,
  },
  spotLight1: {
    width: tabWidth/1.2,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  spotLightInner1: {
    width: Dimensions.get("window").width/3,
    height: 30,
    backgroundColor: "#ea4b6a",//pink
    borderRadius: 25,
  },
  spotLight2: {
    width: tabWidth/1.4,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  spotLightInner2: {
    width: Dimensions.get("window").width/3.1,
    height: 30,
    backgroundColor: "#ea4b6a",//pink
    borderRadius: 25,
  },
  scaler: { flex: 1, alignItems: "center", justifyContent: "center" },
  textTab:{
    fontFamily:'LexendDecaRegular',
    color:'#fff',
    fontSize:12,
    // paddingRight:5,
    // paddingLeft:5,
    // borderRadius: 50 / 2,
  }
});