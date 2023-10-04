import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native'

import { LoginAuthentification } from '../functions/firebase-auth-functions'
import { GetAllPermissions } from '../functions/permission-functions'

import FormInput from '../components/FormInput.js'

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState()
    const [password, setPassword] = useState("")
    const [errortext, setErrortext] = useState("")

    useState(()=>{
      setPassword("")
      setEmail("")
    })

    return(
      <View style={styles.container} >
        <ScrollView>
          <Image source={require("../../assets/Codelco_logo.png")} style={styles.image}/>
          <FormInput
            labelValue={email}
            onChangeText={(userEmail) => setEmail(userEmail)}
            placeholderText="Email"
            iconType="mail"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
        />
          <View style={{marginBottom:15}}/>
          <FormInput
            labelValue={password}
            onChangeText={(userPassword) => setPassword(userPassword)}
            placeholderText="Password"
            iconType="lock"
            secureTextEntry={true}
          />

          {errortext != "" ? (
          <Text style={styles.errorTextStyle}>{" "}{errortext}{" "}</Text>) : null}

          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={()=>LoginAuthentification(email, password, navigation, setErrortext, null)}>
            <Text style={styles.buttonTextStyle}> Iniciar Sesion </Text>
          </TouchableOpacity>
          <Text style={styles.registerTextStyle} onPress={() => navigation.navigate("RegisterScreen")}>
              Nuevo usuario ? Registrate !
            </Text>
        </ScrollView>
      </View>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
container:{
    flex:1,
    backgroundColor:"#FFEAD3"
},
text:{
    fontSize:20,
    justifyContent:'center',
    alignItems:'center',
    alignContent:'center',
    alignSelf:'center'
},
image:{
    width: "80%",
    height: 180,
    resizeMode: "contain",
    margin: 30,
    alignItems: "center",
    marginTop:70,
    marginBottom:70
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
    marginTop: 40,
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
    marginLeft:160,
    marginTop:15
  },
  errorTextStyle: {
    color: "red",
    textAlign: "center",
    fontSize: 14,
  }
})


