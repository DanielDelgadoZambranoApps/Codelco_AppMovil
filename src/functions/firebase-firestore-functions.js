import { Alert } from "react-native"

import { DeleteEventPictures } from './firebase-storage-functions'
import { CheckConnectivity } from '../functions/general-functions'
import firestore from '@react-native-firebase/firestore'; 

export const GetCollection = async (collection, setData) =>{
    if(CheckConnectivity()){
      console.log(collection  + " sacado desde Firebase")
      const subscriber = firestore().collection(collection).onSnapshot(
        (querySnapshot) => {
          let temp = []
          querySnapshot.forEach((documentSnapshot) => {
            let userDetails = {};
            userDetails = documentSnapshot.data();
            userDetails['id'] = documentSnapshot.id;
            temp.push(userDetails);
          })
          setData(temp);
        },
        (error) => {
          console.log('error', error);
        })
        return () => subscriber()  
        }
      else {
        Alert.alert("No hay Conexion ...", " ", [{ text: "Continuar", onPress: () => {return null}}])
      }
  }

export const createUserIniatialDataInFirebase = (user, userName) => {
  firestore().collection('Usuarios').doc(user['user'].uid).set({
    Creditos: Number(30000),
    userMail:user['user'].email ,
    userCompleteName : userName ,
    userID: user['user'].uid,
    requestSends:[],
    requestReceive:[],
    userItems:[]
  })
  .then((value) => {
    console.log("Registro en Firestore realizado satisfactoriamente !")
  }) 
}

export const deleteItem = async (itemID = null) => {
  await firestore().collection('Items').doc(itemID).delete().then(()=>{console.log("Item " + itemID + " eliminado con exito !")})
 // DeleteEventPictures("", itemID)
}

export const BuyItem = async (item , userInfo) => {

  const userRequestInfo =  await firestore().collection('Usuarios').doc(userInfo.userID).get()
  const userOwnerInfo =  await firestore().collection('Usuarios').doc(item['item'].userID).get()

  let newItemInfo = item['item']
  let newRequestReceive = []
  let newRequestSends = []

  newItemInfo.requesterUserName = userInfo.userCompleteName
  newItemInfo.requesterUserID=userInfo.userID
  

  if( Number(userInfo.Creditos) < Number(item['item'].credits)  ){
    Alert.alert("No tiene suficiente dinero para adquirir el articulo ...", "",
                [{ text: "Continuar", onPress: () => { return null }}],{ cancelable: false })
  } else {
    Alert.alert("Solicitud enviada !", "Revise la pantalla de solicitudes ...",
                [{ text: "Continuar", onPress: () => { return null }}],{ cancelable: false })

                if(userRequestInfo){
                  if(userRequestInfo._data){
                    if(userRequestInfo._data.requestSends) newRequestSends = userRequestInfo._data.requestSends 
                  }
                }
                newRequestSends.push(newItemInfo)
                firestore().collection('Usuarios').doc(userInfo.userID).update({ requestSends:newRequestSends})
                .then(() => {})
                if(userOwnerInfo){
                  if(userOwnerInfo._data){
                    if(userOwnerInfo._data.requestReceive) newRequestReceive = userOwnerInfo._data.requestReceive 
                     
                  }
                }
                newRequestReceive.push(newItemInfo)
                firestore().collection('Usuarios').doc(item['item'].userID).update({ requestReceive:newRequestReceive})
                .then(() => {})
  }
}


export const deleteOrConfirmRequest = async (userInfo, item, setUpdate, update, addItem=false) => {

  const userRequestInfo =  await firestore().collection('Usuarios').doc(item['item'].requesterUserID).get()
  const userOwnerInfo =  await firestore().collection('Usuarios').doc(item['item'].userID).get()
  const itemInfo =  await firestore().collection('Items').doc(item['item'].id).get()

  let newRequestSends = []
  let newRequestReceive = []
  let newUserItems = []
  let updateUserCredits
  let itemAvailable = addItem
  let newAmount 
  let addItemInfo = false 

  if(userRequestInfo){
    if(userRequestInfo._data){
      if(userRequestInfo._data.requestSends){
        for(const [key, value] of  Object.entries(userRequestInfo._data.requestSends) ){
          if( !(value.itemID === item['item'].itemID) || addItemInfo ){
            newRequestSends.push(value)
          } else {
            addItemInfo=true
          }
        }
      } 
      if(userRequestInfo._data.userItems) newUserItems = userRequestInfo._data.userItems
      if(addItem){
        newUserItems.push(item['item'])
        if(itemInfo) if(itemInfo._data){
          if (itemInfo._data.cantidad)  newAmount = Number(itemInfo._data.cantidad) - 1
        } 
      } 
      updateUserCredits = Number(userRequestInfo._data.Creditos) - Number(item['item'].credits)
    }
  }
  addItemInfo=false

  firestore().collection('Usuarios').doc(userRequestInfo._data.userID).update({
    requestSends:newRequestSends,
  }).then((value)=>{
    setUpdate(!update)
  })

  if(itemAvailable){
    firestore().collection('Usuarios').doc(userRequestInfo._data.userID).update({
      userItems:newUserItems,
      Creditos:updateUserCredits
    }).then((value)=>{
      setUpdate(!update)
    }) 

    if(newAmount>0){
      firestore().collection('Items').doc(item['item'].id).update({
        cantidad:newAmount
      }).then((value)=>{
      })
    } else {
      deleteItem(item['item'].id)
      Alert.alert("Error", "No quedan unidades disponibles de este articulo ...",
      [{ text: "Continuar", onPress: () => { return null }}],{ cancelable: false })
    }
  }

  if(userOwnerInfo){
    if(userOwnerInfo._data){
      if(userOwnerInfo._data.requestReceive){
        for(const [key, value] of Object.entries(userOwnerInfo._data.requestReceive) ){
          if( !(value.itemID === item['item'].itemID) || (addItemInfo) ){
            newRequestReceive.push(value)
          } else {
            addItemInfo=true
          }
        }
      } 
    }
  }
  
  firestore().collection('Usuarios').doc(item['item'].userID).update({
    requestReceive:newRequestReceive
  }).then((value)=>{
    setUpdate(!update)
  })

  if(addItem){
    Alert.alert("Confirmacion exitosa !", "El articulo se agrego al inventario del usuario que realizo la solicitud.",
                [{ text: "Continuar", onPress: () => { return null }}],{ cancelable: false })

  } else {
    Alert.alert("Eliminada", "La solicitud se elimino de manera satisfactoria.",
                [{ text: "Continuar", onPress: () => { return null }}],{ cancelable: false })

  }
}

export const GetSpecificDocCollection = async (collection, docID)=>{
  const userInfo =  await firestore().collection(collection).doc(docID).get()
  if(userInfo){
    if(userInfo._data){
      if(userInfo._data.credits)
      console.log("creditos del usuario ----> " + userInfo._data.credits)
    }
  }
}

export const GetAllUserData = async (collection, userDocID, setData)=>{
  const userInfo =  await firestore().collection(collection).doc(userDocID).get()
  if(userInfo) if(userInfo._data)setData(userInfo._data) 
}