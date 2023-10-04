import React, { useState } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView } from 'react-native'

import { RegisterInFirebase } from '../functions/firebase-auth-functions'
import FormInput from '../components/FormInput'

const RegisterScreen = ({ navigation }) => {
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [userName, setUserName] = useState("")
    const [confirmPassword, setConfirmPassword] = useState()
    const [errortext, setErrortext] = useState("")

    const checkPassword =()=>{
      if(password === confirmPassword ){
        if(password.length > 5){
          RegisterInFirebase(userName, email, password, setErrortext, navigation)
        }else{
          Alert.alert("La contraseña es muy corta ...", "" , [{ text: "Continuar", onPress: () => {return null}}])
        }
      } else {
        Alert.alert("Error", "Las contraseñas no coinciden" , [{ text: "Continuar", onPress: () => {return null}}])
      }
    }

    return(
        <View style={styles.container} >  
          <ScrollView>
            <Image source={require("../../assets/Codelco_logo.png")} style={styles.image}/>
            <FormInput
              labelValue={userName}
              onChangeText={(value) => setUserName(value)}
              placeholderText="Nombre Completo"
              iconType="idcard"
              autoCapitalize="none"
              autoCorrect={false}
          />
           <View style={{marginBottom:15}}/>
            <FormInput
              labelValue={email}
              onChangeText={(userEmail) => setEmail(userEmail)}
              placeholderText="Email"
              iconType="mail"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
          />
            <FormInput
              labelValue={password}
              onChangeText={(userPassword) => setPassword(userPassword)}
              placeholderText="Contraseña"
              iconType="lock"
              secureTextEntry={true}
            />
            <FormInput
              labelValue={confirmPassword}
              onChangeText={(userPassword) => setConfirmPassword(userPassword)}
              placeholderText="Repita la Contraseña"
              iconType="lock"
              secureTextEntry={true}
            />
             <View style={{marginBottom:12}}/>
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={()=>checkPassword() }>
              <Text style={styles.buttonTextStyle}> Registrarme !</Text>
            </TouchableOpacity>
            <Text style={styles.registerTextStyle} onPress={() => navigation.navigate("LoginScreen")}>
                Ya posees una cuenta ?  Inicia Sesion ! 
              </Text>
              </ScrollView>
          </View>
    )
}

export default RegisterScreen

const styles = StyleSheet.create({
  container:{
      flex:1,
      backgroundColor:"#FFEAD3"
  },
  image:{
      width: "70%",
      height: 160,
      resizeMode: "contain",
      margin: 30,
      alignItems: "center",
      marginTop:40,
      alignSelf:'center',
      marginBottom:50
  },
  buttonStyle: {
    backgroundColor: "#DA8221",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#DA8221",
    height: 42,
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 50,
    marginBottom: 25,
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    fontSize: 17,
  },
  registerTextStyle: {
    color: "#DA8221",
    textAlign:'center',
    fontWeight: "bold",
    fontSize: 14,
    alignSelf: "center",
    padding: 10,
    marginLeft:120,
    marginTop:0
  }
})