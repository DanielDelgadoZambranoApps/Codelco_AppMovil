import React from 'react'

import { ApplicationProvider, IconRegistry } from '@ui-kitten/components'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import UserItemsScreen from '../screens/UserItemsScreen'
import RegisterScreen from '../screens/RegisterScreen'
import NewItemScreen from '../screens/NewItemScreen'
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import SplashScreen from '../screens/SplashScreen'
import LoginScreen from '../screens/LoginScreen'
import TabsNavigator from './TabsNavigator'
import * as eva from '@eva-design/eva'

const Stack = createStackNavigator();

const MainNavigator = () => {
  return(
    <>
      <IconRegistry icons={EvaIconsPack}/>
        <ApplicationProvider {...eva} theme={eva.light}>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="SplashScreen"
              screenOptions={({route}) =>({
                headerTintColor:'black',
                activeTintColor: '#ffffff',
                headerTitleAlign:'center',
                headerStyle:{backgroundColor:'#ffffff'},
                drawerStyle:{width:220},
                headerTitleStyle:{fontSize:20},
              // drawerLabel:route.name
              headerShown:false,
              })}>
          <Stack.Screen name='RegisterScreen' component={RegisterScreen}  options={{unmountOnBlur: true}}/> 
          <Stack.Screen name='TabsNavigator' component={TabsNavigator}  options={{unmountOnBlur: true}} />  
          <Stack.Screen name='NewItemScreen' component={NewItemScreen} options={{unmountOnBlur: true}} />  
          <Stack.Screen name='UserItemsScreen' component={UserItemsScreen} options={{unmountOnBlur: true}} /> 
          <Stack.Screen name='SplashScreen' component={SplashScreen}  options={{unmountOnBlur: true}} />  
          <Stack.Screen name='LoginScreen' component={LoginScreen}  options={{unmountOnBlur: true}}/>  
        </Stack.Navigator>
      </NavigationContainer> 
    </ApplicationProvider>
    </>
  )}

export default MainNavigator;