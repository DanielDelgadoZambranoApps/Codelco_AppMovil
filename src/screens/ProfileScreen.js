import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import { CheckConnectivity, lauchCameraOrLibrary} from '../functions/general-functions'
import { GetSpecificValueFromAsyncStorage } from '../storage/storage-functions'
import { GetCurrentSpecificInfo } from '../functions/firebase-auth-functions'
import { GetAllUserData } from '../functions/firebase-firestore-functions'

import ProfileButton from '../components/ProfileButton'

const ProfileScreen = ({ navigation }) => {
    const [userCompleteName, setUserCompleteName] = useState('Cargando Nombre ...')
    const [userEmail, setUserEmail] = useState('Cargando Mail')
    const [userInfo, setUserInfo] = useState(null)
    const [imageUrl, setImageUrl] = useState(null)
    const [credits, setCredits] =useState('Cargando...')
    const [update, setUpdate] = useState(false)

    let [userID, setUserID] = useState(null)
    let collection = 'Usuarios'

    useEffect(()=>{
        GetSpecificValueFromAsyncStorage('ProfilePicturePath', setImageUrl)
        if(CheckConnectivity()){
            GetCurrentSpecificInfo("userCompleteName", setUserCompleteName)
            GetCurrentSpecificInfo("email", setUserEmail)
            GetCurrentSpecificInfo('id', setUserID)
        } else {
            GetSpecificValueFromAsyncStorage('userCompleteName', setUserCompleteName)
            GetSpecificValueFromAsyncStorage('email', setUserEmail)
            GetSpecificValueFromAsyncStorage('id', setUserID)
        }
    },[update]) 

    useEffect(()=>{
       if(userID) GetAllUserData(collection, userID, setUserInfo)
    },[userID])
 
    useEffect(()=>{
        if(userInfo)if(userInfo.Creditos)setCredits(userInfo.Creditos)
    },[userInfo])

    return( 
        <View style={styles.container} >
            <View style={styles.box} > 
            { !imageUrl ?
                <Image style={styles.userImg} source={require('../../assets/ProfilePic.png')} /> 
                :
                <Image style={styles.userImg} source={{uri: imageUrl}} /> 
            }
            <Text style={styles.text}> {userCompleteName} </Text>
            <Text style={styles.credits}> Correo : {userEmail} </Text>
            <Text style={styles.credits}> Creditos :  {credits} </Text>
            <TouchableOpacity
                style={styles.plusButton}
                onPress={()=>lauchCameraOrLibrary("Profile", null, update, setUpdate) }>
                    <FontAwesome5
                        name={'plus'}
                        size={20}
                        color={'#ffffff'}/>
                </TouchableOpacity>
                <View style={{marginTop:50}} />
                <ProfileButton title='Mis Articulos' navigation={navigation} nextScreen='Mis Articulos' />
                <ProfileButton title='Cerrar Sesion' navigation={navigation} nextScreen='Cerrar Sesion' />
            </View>
        </View>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#ffffff"
    },
    text:{
        fontSize:20,
        justifyContent:'center',
        alignItems:'center',
        alignContent:'center',
        alignSelf:'center',
        marginTop:90,
        marginBottom:20
    },
    credits:{
        fontSize:16,
        justifyContent:'center',
        alignItems:'center',
        alignContent:'center',
        alignSelf:'flex-start',
        marginTop:10,
        marginLeft:40
    },
    email:{
        fontSize:14,
        justifyContent:'center',
        alignItems:'center',
        alignContent:'center',
        alignSelf:'center',
        marginTop:20
    },
    userImg: {
        height: 150,
        width: 150,
        borderRadius: 75,
        alignSelf:'center',
        marginTop:30,
    },
    box:{
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
        height:'90%',
        width:'90%',
        alignSelf:'center'
      },
      plusButton: {
        width: 40,
        height: 40,
        borderRadius: 30,
        backgroundColor: '#2F7FF3',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 370,
        right: 115,
        elevation: 5,
    }
})
