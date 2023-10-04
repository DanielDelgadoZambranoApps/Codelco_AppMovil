import React, {useState, useEffect} from 'react';
import { View, StyleSheet, Text, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Button } from '@ui-kitten/components'

import { deleteOrConfirmRequest, GetAllUserData } from '../functions/firebase-firestore-functions'
import { GetSpecificValueFromAsyncStorage } from "../storage/storage-functions"
import { GetCurrentSpecificInfo } from '../functions/firebase-auth-functions'
import { CheckConnectivity } from '../functions/general-functions'

const PendingRequestScreen =({navigation, route})=> {

  const [requestSends, setRequestSends] = useState(null)
  const [requestReceive, setRequestReceive] = useState(null)
  const [userInfo, setUserInfo] = useState(null)
  const [update, setUpdate] = useState(false)
  const [userID, setUserID] = useState(null)

  let collection = 'Usuarios'

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: ({})=>{
          return (
            <TouchableOpacity onPress={()=>setUpdate(!update)} >
              <MaterialCommunityIcons style={{right:10}} name={'refresh'} size={34} color="black" />
            </TouchableOpacity>
          ) 
      },
    });
  }, [navigation]);

  useEffect(()=>{
    if (CheckConnectivity()){
      GetCurrentSpecificInfo('id', setUserID)
    } else {
      GetSpecificValueFromAsyncStorage('id', setUserID)
    }
  },[update])

  useEffect(()=>{
    if(userID) GetAllUserData(collection, userID, setUserInfo)
  },[userID, update])

  useEffect(()=>{
    if(userInfo){
      if(userInfo.requestSends) setRequestSends(userInfo.requestSends)
    }
    if(userInfo){
      if(userInfo.requestReceive) setRequestReceive(userInfo.requestReceive)
    }
  },[userInfo, update])

  const checkInternetBeforeUpdate=(item)=>{
    if(CheckConnectivity()){
      deleteOrConfirmRequest(userInfo, item, setUpdate, update, true)
    } else {
      Alert.alert("No hay Conexion ...", " ", [{ text: "Continuar", onPress: () => {return null}}])
    }
  }
  
  const SecondaryRenderItem =( item, index ) => {
    return(
      <>
      <View style={styles.itemRender}>
        <View style={{flexDirection:'column', width:'80%', marginLeft:7, marginRight:-56}}>
          <View style={{marginRight:52}} >
            <Text style={styles.renderText} >{ item['item'].itemName} </Text>
            <Text style={styles.renderSubText}>{  item['item'].itemDescription}</Text>
        </View>
        </View>
          <View style={{left:0}}>
          <Button onPress={()=>checkInternetBeforeUpdate(item)} >Confirmar</Button>
          </View>
       </View>
       <Text style={styles.requesterUserName}>Usuario : {  item['item'].requesterUserName} {"\n"} </Text>
      </>
    )
  }

  const PrimaryRenderItem =( item, index ) => {
    return(
      <>
      <View style={styles.itemRender}>
        <View style={{flexDirection:'column', width:'80%', marginLeft:7, marginRight:-56}}>
          <View style={{marginRight:52}} >
            <Text style={styles.renderText} >{ item['item'].itemName} </Text>
            <Text style={styles.renderSubText}>{  item['item'].itemDescription}   </Text>
        </View>
        </View>
          <View style={{marginTop:5, left:10}}>
            <Button onPress={()=>{ deleteOrConfirmRequest(userInfo, item, setUpdate, update)} } status='danger'>Eliminar </Button>
          </View>
       </View>
      </>
    )
  }

  return(
    <>
      <View style={styles.container} >
        <View style={styles.mainBox} >
          <Text style={styles.text}>{' Solicitudes Recibidas '}</Text>
            <View   style={styles.fourBox} >
              { requestReceive ?
                <>
                  <FlatList data={requestReceive} renderItem={(item, index) => SecondaryRenderItem(item, index)} 
                  keyExtractor={(item, index) => index} />
                </>
                :
                <>
                  <ActivityIndicator style={styles.activityStyle} status='danger' />
                </>
              }
            </View>
        </View>
        <View style={styles.secondaryBox} >
          <Text style={styles.text}>{' Solicitudes Enviadas '}</Text>
            <View   style={styles.thirdBox} >
              { requestSends ?
              <>
               <FlatList data={requestSends} renderItem={(item, index) => PrimaryRenderItem(item, index)} 
               keyExtractor={(item, index) => index} />
              </>
              :
              <>
                <ActivityIndicator style={styles.activityStyle} />      
              </>
              }
              </View>
            </View>
          </View>    
    </>
  )
}

export default PendingRequestScreen

const styles = StyleSheet.create({
    container:{
      flex:1,
      backgroundColor:"#ffffff"
    },
    mainBox:{
      marginTop: 22,
      paddingVertical: 8,
      borderWidth: 0,
      borderColor: "#20232a",
      borderRadius: 6,
      backgroundColor: "#CAC6C2",
      color: "#20232a",
      textAlign: "center",
      fontSize: 30,
      fontWeight: "bold",
      width:'90%',
      height:'45%',
      alignSelf:'center'
    },
    secondaryBox:{
      marginTop: 20,
      paddingVertical: 8,
      borderWidth: 0,
      borderColor: "#20232a",
      borderRadius: 6,
      backgroundColor: "#CAC6C2",
      color: "#20232a",
      textAlign: "center",
      fontSize: 30,
      fontWeight: "bold",
      width:'90%',
      height:'46%',
      alignSelf:'center',
    },
    text:{
      fontSize: 18.5,
      textAlign: 'center',
      marginBottom: 0,
      marginTop: 0
    },
    thirdBox:{
      marginTop:10,
      paddingVertical: 8,
      borderWidth: 0,
      borderColor: "#20232a",
      borderRadius: 6,
      backgroundColor: "#ffffff",
      color: "#20232a",
      textAlign: "center",
      fontSize: 30,
      fontWeight: "bold",
      width:'90%',
      height:'78%',
      alignSelf:'center'
    },
    fourBox:{
      marginTop:10,
      paddingVertical: 8,
      borderWidth: 0,
      borderColor: "#20232a",
      borderRadius: 6,
      backgroundColor: "#ffffff",
      color: "#20232a",
      textAlign: "center",
      fontSize: 30,
      fontWeight: "bold",
      width:'90%',
      height:'80%',
      alignSelf:'center'
    },
    secondaryContainer: {
      maxHeight: 192,
    },
    itemRender:{
      flexDirection:'row',
      marginBottom:10,
    },
    renderText:{
      fontSize:18
    },
    buttonStyle:{
      marginTop:5,
      rigth:40
    },
    renderSubText:{
      fontSize:14,
      right:8,
      marginLeft:8
    },
    requesterUserName:{
      fontSize:14,
      marginLeft:8,
      marginTop:0    },
    buttonSecondaryStyle:{
      marginTop:10,
    },
    activityStyle:{
      size:"large",
      color:"#0000ff"
    },

})
  