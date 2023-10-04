import React, {useState, useEffect} from 'react'
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList, Text } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

import { GetSpecificValueFromAsyncStorage } from "../storage/storage-functions"
import { GetCurrentSpecificInfo } from '../functions/firebase-auth-functions'
import { GetAllUserData } from '../functions/firebase-firestore-functions'
import { CheckConnectivity } from '../functions/general-functions'

import ItemImages from '../components/ItemImages'

const NewItemScreen =({ navigation })=>{
    const [userInfo, setUserInfo] = useState(null)
    const [internet, setInternet] = useState(false)

    let [userID, setUserID] = useState(null)
    let [userItems, setUserItems] = useState([])

    let collection = 'Usuarios'
    let collection2 = 'Items'

    useEffect(()=>{
        if(CheckConnectivity()){
            GetCurrentSpecificInfo('id', setUserID)
            setInternet(true)
        } else {
            GetSpecificValueFromAsyncStorage('id', setUserID)
        }
    },[]) 

    useEffect(()=>{
       if(userID) GetAllUserData(collection, userID, setUserInfo)
    },[userID])
 
    useEffect(()=>{
        if(userInfo)if(userInfo.userItems){
            setUserItems(userInfo.userItems)
        }
    },[userInfo])

    const renderItem =( item )=>{
        const itemID = item['item'].id
        const hasImage =  item['item'].hasImage
        return(
        <>
            <View style={styles.item}>
                { !userItems ?
                <>
                <ActivityIndicator style={styles.activityStyle} status='danger' />
                </>
                :
                <>
                <ItemImages collection={collection2} itemId={itemID} hasImage={hasImage} />
                <View style={{flexDirection:'column'}} >
                    <Text style={styles.title}>
                    {item['item'].itemName} {"\n"}  
                    </Text>
                    <Text style={styles.subTitle}>
                    {item['item'].itemDescription} 
                    </Text>
                </View>
                </>
                } 
            </View>
        </>
        )
    }

  return(
    <>
        <View style={styles.topBar} >
            <TouchableOpacity onPress={()=>navigation.navigate('ProfileScreen')} > 
                <Ionicons style={{left:10, marginTop:3}}  name={'arrow-back'} size={30} color="black" />
            </TouchableOpacity>
        </View>
        { internet ? 
        <>
            <FlatList data={userItems} renderItem={(item)=>renderItem(item)} keyExtractor={(item, index) => index} /> 
        </>
        :
        <>
            <ActivityIndicator style={styles.activityStyle} status='danger' />
        </> 
        }
    <View style={styles.bottomBar} />
    </>
  )
}

export default NewItemScreen

const styles = StyleSheet.create({
  topBar:{
    paddingVertical: 8,
    borderWidth: 0.2,
    borderColor: "black",
    backgroundColor: "#EDB16E",
    color: "#20232a",
    textAlign: "center",
    fontSize: 50,
    fontWeight: "bold",
    height:50,
    width:'100%',
    alignSelf:'center',
    elevation:10
  },
  bottomBar:{
    paddingVertical: 8,
    backgroundColor: "#EDB16E",
    color: "#20232a",
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
    height:50,
    width:'100%',
    alignSelf:'center',
    elevation:10,
    marginTop:20
  },
  item: {
    backgroundColor: '#FFF8D9',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius:10,
    flexDirection:'row',
    marginTop:20
  },
  title: {
    fontSize: 18,
    alignSelf:'center',
    marginLeft:70,
    width:'77%'
  },
  subTitle: {
    fontSize: 16,
    marginLeft:5,
    width:'60%',
  }
})