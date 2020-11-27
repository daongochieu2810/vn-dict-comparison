import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";

import VN_NAME from "./config/vn_name";
import HomeScreen from "./components/screens/HomeScreen";
import ComparisonScreen from "./components/screens/ComparisonScreen";
import UpdateScreen from "./components/screens/UpdateScreen";
import WordScreen from "./components/cards/WordScreen";
import LoginScreen from "./components/screens/LoginScreen";
import RegisterScreen from "./components/screens/RegisterScreen";
import LoadingScreen from "./components/screens/LoadingScreen";
import Toast from "react-native-toast-message";
import globalStorage from "./backend/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { enableScreens } from "react-native-screens";
enableScreens();

const Stack = createSharedElementStackNavigator();
const Tab = createBottomTabNavigator();
function MainTabNav() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === VN_NAME.COMPARISON_SCREEN) {
            return (
              <MaterialCommunityIcons
                name="book-open-outline"
                size={size}
                color={color}
              />
            );
          } else if (route.name === VN_NAME.DICTIONARY_SCREEN) {
            return (
              <MaterialCommunityIcons
                name="file-compare"
                size={size}
                color={color}
              />
            );
          } else {
            return (
              <Ionicons
                name="ios-add-circle-outline"
                size={size}
                color={color}
              />
            );
          }
        },
      })}
      tabBarOptions={{
        activeTintColor: "#ff425b",
        inactiveTintColor: "gray",
        labelStyle: {
          marginTop: 0,
          paddingBottom: 2,
        },
        style: {
          paddingVertical: 5,
        },
      }}
    >
      <Tab.Screen name={VN_NAME.DICTIONARY_SCREEN} component={HomeScreen} />
      <Tab.Screen
        name={VN_NAME.COMPARISON_SCREEN}
        component={ComparisonScreen}
      />
      <Tab.Screen name={VN_NAME.UPDATE_SCREEN} component={UpdateScreen} />
    </Tab.Navigator>
  );
}
function App() {
  return (
    <Provider store={globalStorage.store}>
      <PersistGate persistor={globalStorage.persistor}>
        <StatusBar />
        <>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen
                name="Loading"
                component={LoadingScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="App"
                component={MainTabNav}
                options={{
                  headerShown: false,
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </>
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </PersistGate>
    </Provider>
  );
}

export default App;
