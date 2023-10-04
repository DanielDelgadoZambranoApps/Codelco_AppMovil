import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import EvilIcons from 'react-native-vector-icons/EvilIcons'

import { GetCurrentSpecificInfo } from '../functions/firebase-auth-functions'
import { GetAllUserData } from '../functions/firebase-firestore-functions'
import { CheckConnectivity } from '../functions/general-functions'

import PendingRequestScreen from '../screens/PendingRequestScreen'
import ProfileScreen from '../screens/ProfileScreen'
import ItemsScreen from '../screens/ItemsScreen' 

const Tab = createBottomTabNavigator()

const TabsNavigator = () => {

  const [totalRequestesReceive, setTotalRequestesReceive] = useState(null)
  const [userInfo, setUserInfo] = useState(null)
  const [update, setUpdate] = useState(true)
  const [userID, setUserID] = useState(null)

  let collection = 'Usuarios'
  let frecuency = 1000

  useEffect(()=>{
    if (CheckConnectivity()){
      GetCurrentSpecificInfo('id', setUserID)
    } else {
      GetSpecificValueFromAsyncStorage('id', setUserID)
    }
    getCurrentTotalRequestReceive()
  },[])

  useEffect(()=>{
    if(userID) GetAllUserData(collection, userID, setUserInfo)
  },[userID,update])

  useEffect(()=>{
    if(userInfo){
      if(userInfo.requestReceive){
        if(userInfo.requestReceive.length>0){
          setTotalRequestesReceive(Number(userInfo.requestReceive.length))
        } else {
          setTotalRequestesReceive(null)
        }
      } 
    }
  },[userInfo, update])

  const getCurrentTotalRequestReceive = () => {
    setUpdate(!update)
    setTimeout(getCurrentTotalRequestReceive, frecuency)
  }

  return(
    <>
      <Tab.Navigator
      initialRouteName='ItemsScreen'
      screenOptions={({route}) =>({
        tabBarActiveTintColor:'#EDB16E',
        headerStyle:{backgroundColor:'#EDB16E'},
        headerTitleAlign:'center',
        tabBarInactiveBackgroundColor:'#EDB16E',
        tabBarLabelStyle:{color:'black'},
        tabBarActiveBackgroundColor:'#E7A65E',
        tabBarShowLabel:true,
        tabBarIcon: ({focused, size, color })=>{
          let iconName;
          if(route.name === 'ItemsScreen'){
            iconName = 'appstore-o'
            size = focused ? 26 :28
            return (<AntDesign name={iconName} size={size} color="black" />)
          }
          if(route.name === 'PendingRequestScreen'){
            iconName = 'send-o'
            size = focused ? 26 :28
            return (<FontAwesome name={iconName} size={size} color="black" />)
          }
          if(route.name === 'ProfileScreen'){
            iconName = 'user'
            size = focused ? 36.1 : 37.5
            return (<EvilIcons name={iconName} size={size} color="black" />)
          }
        }})
      }>
      <Tab.Screen name='ItemsScreen'  component={ItemsScreen}   options={{ tabBarLabel: 'Inventario', headerTitle:'Inventario', unmountOnBlur:true}} />
      <Tab.Screen name='PendingRequestScreen' component={PendingRequestScreen} options={{ tabBarLabel: 'Solicitudes', headerTitle:'Pendientes', unmountOnBlur:true, tabBarBadge:totalRequestesReceive}} />
      <Tab.Screen name='ProfileScreen' component={ProfileScreen} options={{ tabBarLabel: 'Mi Perfil', headerTitle:'Mi Cuenta', unmountOnBlur:true}}  /> 
      </Tab.Navigator>
    </>
  )
};


export default TabsNavigator;