import React, { useState, useEffect } from "react";
import { SafeAreaView, ActivityIndicator, View, StyleSheet, Image} from "react-native";

import { Close } from  '../functions/firebase-auth-functions'

const SplashScreen = ({ navigation }) => {
  const [animating, setAnimating] = useState(true)
  const [user, setUser] = useState(null)
  
   useEffect(() => {
    Close(setUser)
    setTimeout(() => {
      setAnimating(false)
      if(user){
        navigation.replace("TabsNavigator") 
      }else{
        navigation.replace("LoginScreen")
      }
    }, 5000);
  }, [user])  

  return (
    <SafeAreaView style={styles.stylesheet}>
      <View style={styles.container}>
        <Image source={require("../../assets/Codelco_logo.png")} style={styles.image} />
        <ActivityIndicator animating={animating} color="#FFFFFF"size="large" style={styles.activityIndicator}/>
      </View>
    </SafeAreaView>
  )}

export default SplashScreen;

const styles = StyleSheet.create({
  stylesheet:{
    flex:1,
    backgroundColor:'#FFEAD3'
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  activityIndicator: {
    alignItems: "center",
    height: 80,
  },
  image:{
    width: "90%",
    resizeMode: "contain",
    margin: 30,
  }
})