import React, {useState, useEffect} from 'react'
import { View, TextInput, StyleSheet, TouchableOpacity, Image, Text, Alert, ScrollView } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

import { lauchCameraOrLibrary, CheckConnectivity } from '../functions/general-functions'
import { GetSpecificValueFromAsyncStorage } from "../storage/storage-functions"
import { GetCurrentSpecificInfo } from '../functions/firebase-auth-functions'
import { UploadItem } from '../functions/firebase-storage-functions'
import { windowHeight, windowWidth } from '../utils/Dimentions'

const   NewItemScreen =({navigation})=>{
  const [itemName, setItemName] = useState('')
  const [itemDescription, setItemDescription] = useState('')
  const [userName, setUserName] = useState('userFullName')
  const [userMail, setUserMail] = useState('userEmail')
  const [userID, setUserID] = useState('userID')
  const [credits, setCredits] = useState(null)
  const [amount, setAmount] = useState(null)
  const [images, setImages] = useState(null)

  let collectionName ='Items'

  useEffect(()=>{
    if(CheckConnectivity()){
      GetCurrentSpecificInfo('id', setUserID)
      GetCurrentSpecificInfo('userCompleteName', setUserName)
      GetCurrentSpecificInfo('email', setUserMail)

    } else { 
    GetSpecificValueFromAsyncStorage('id', setUserID)
    GetSpecificValueFromAsyncStorage('userCompleteName', setUserName)
    GetSpecificValueFromAsyncStorage('email', setUserMail)
    }
  },[])

  const checkToUpload = () => {
    if (!itemName || !itemDescription || !credits || !amount ){
      Alert.alert("Error", "Complete todos los campos",
                [{ text: "Volver", onPress: () => { return null }}],{ cancelable: false })
    } else {
        if (isNaN( Number(credits))) {
          Alert.alert("Ingrese un numero de creditos valido ...")
        } else {

          if (isNaN( Number(amount))){
            Alert.alert("Ingrese una cantidad valida ...")
          }  
          if (Number(amount) < 1 ){
            Alert.alert("Ingrese una cantidad valida ...")
          } else {
            if(CheckConnectivity()){
              UploadItem(itemName, itemDescription, images, credits, amount, userName, userMail, userID)
              setItemDescription("")
              setImages(null)
              setItemName("")
              setCredits("")
              setAmount("")
            } else {
              Alert.alert("No hay Conexion ...", " ", [{ text: "Continuar", onPress: () => {return null}}])
            }
          }   
      }
    }
  }

  return(
    <ScrollView >
      <View style={styles.topBar} >
        <TouchableOpacity onPress={()=>navigation.replace('TabsNavigator')} > 
          <Ionicons style={{left:10, marginTop:3}}  name={'arrow-back'} size={30} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.body} >
          <View style={styles.inputContainer} >
            <TextInput
              style={styles.input}
              value={itemName}
              onChangeText={(value)=>setItemName(value)}
              numberOfLines={1}
              placeholder={"Nombre del Articulo"}
              placeholderTextColor="#666" 
              autoCapitalize="none"
              autoCorrect={false}
              multiline={false} />
            </View>
              <View style={styles.inputCredits} >
                <TouchableOpacity style={styles.cameraImageStyle} onPress={()=>{lauchCameraOrLibrary("NewItem", setImages, collectionName, null )} }>
                  <Image style={styles.imageStyle} source={require('../../assets/camera2.png')} /> 
                </TouchableOpacity>
                    <TextInput
                      style={styles.input}
                      value={credits}
                      onChangeText={(value)=>setCredits(value)}
                      numberOfLines={1}
                      placeholder={"Creditos"}
                      placeholderTextColor="#666" 
                      autoCapitalize="none"
                      autoCorrect={false}
                      multiline={false} />
                  </View>
                  <Text style={styles.subText} >{'('}Opcional{')'}</Text>
                  <View style={styles.inputAmount} >
                    <TextInput
                      style={styles.input}
                      value={amount}
                      onChangeText={(value)=>setAmount(value)}
                      numberOfLines={1}
                      placeholder={"Cantidad"}
                      placeholderTextColor="#666" 
                      autoCapitalize="none"
                      autoCorrect={false}
                      multiline={false} />
                  </View>
                  
                    <View style={{flex:1}} >
                      <TextInput
                          style={styles.inputDescription}
                          value={itemDescription}
                          onChangeText={(value)=>setItemDescription(value)}
                          numberOfLines={10}
                          multiline
                          placeholder={"Descripcion del Articulo"}
                          placeholderTextColor="#666" 
                          autoCapitalize="none" 
                          autoCorrect={false}/>
                    { images ? 
                      <Text style={styles.text} >Contenido cargado con exito </Text>
                      : 
                      <Text style={styles.text}>No hay contenido seleccionada </Text>
                    }
              </View>
                <TouchableOpacity style={styles.UploadButton} onPress={()=> checkToUpload()}>
                    <Image style={styles.imageStyle} source={require('../../assets/SubirIcono.jpg')} />
                </TouchableOpacity>
              </View>
            <View style={styles.bottomBar} >
            </View>
        </ScrollView>
  )
}

export default NewItemScreen

const styles = StyleSheet.create({
  body:{
    flex:1,
    marginTop: 30,
    paddingVertical: 8,
    borderWidth: 0,
    borderColor: "#20232a",
    borderRadius: 6,
    backgroundColor: "#CAC6C2",
    color: "#20232a",
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
    height:570,
    width:'90%',
    alignSelf:'center',
  },
  input: {
    padding: 10,
    flex: 1,
    fontSize: 16,
    fontFamily: 'Lato-Regular',
    color: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign:'center',
    fontSize:19,
  },
  inputCredits: {
    marginTop: 15,
    height: windowHeight / 16,
    borderColor: '#ccc',
    borderRadius: 3,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    width:"50%",
    alignSelf:'center',
    borderRadius: 15,
    borderColor: "#DA8221",
    left:60,
    flexDirection:'row'
  },
  inputDescription: {
    marginTop: 0,
    marginBottom: 10,
    width:"85%",
    height: '83%',
    borderColor: '#ccc',
    borderRadius: 3,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    alignSelf:'center',
    borderRadius: 15,
    borderColor: "#DA8221",
    textAlign:'center',
    fontSize:18 
  },
  inputContainer: {
    marginTop: 15,
    marginBottom: 5,
    width: '100%',
    height: windowHeight / 16,
    borderColor: '#ccc',
    borderRadius: 3,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    width:"85%",
    alignSelf:'center',
    borderRadius: 15,
   borderColor: "#DA8221",
  },
  imageStyle:{
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  UploadButton : {
    width: windowWidth/10,
    height: windowHeight / 12,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: -4 ,
    right: 20,
    marginBottom:3
  },
  cameraImageStyle: {
    width: windowWidth/10,
    height: windowHeight / 12,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: -7,
    right: 200,
  },
  text:{
    textAlign:'center',
  },
  subText:{
    textAlign:'center',
    bottom: 5,
    right:72
  },
  topBar:{
    flex:1,
    paddingVertical: 8,
    borderWidth: 0.2,
    borderColor: "black",
    backgroundColor: "#EDB16E",
    color: "#20232a",
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
    height:50,
    width:'100%',
    alignSelf:'center',
    elevation:10
  },
  topBarText:{
    fontSize:20,
    color:'black',
    alignSelf:'center'
  },
  bottomBar:{
    flex:1,
    paddingVertical: 8,
    // borderWidth: 0.2,
   // borderColor: "black",
    backgroundColor: "#EDB16E",
    color: "#20232a",
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
    height:50,
    width:'100%',
    alignSelf:'center',
    elevation:10,
    marginTop:35.4
  },
  inputAmount: {
    marginTop: 0,
    marginBottom: 25,
    height: windowHeight / 16,
    borderColor: '#ccc',
    borderRadius: 3,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    width:"50%",
    alignSelf:'center',
    borderRadius: 15,
    borderColor: "#DA8221",
    left:60,
    flexDirection:'row'
  },
})