import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import { GetCollection, deleteItem, BuyItem, GetAllUserData } from '../functions/firebase-firestore-functions'
import { GetCurrentSpecificInfo } from '../functions/firebase-auth-functions'
import { CheckConnectivity } from '../functions/general-functions'
import { Button } from '@ui-kitten/components'
import ItemImages from '../components/ItemImages'

const   ItemsScreen =({ navigation })=> {
  const [internet, setInternet] = useState(true)
  const [showIcon, setShowIcon] = useState(true)
  const [thrashSize, setThrasSize] = useState(Number(63))
  const [items, setItems] = useState(null)

  const [bottom, setBottom] = useState(Number(40))
  const [left, setLeft] = useState(Number(45))
  
  const [color, setColor] = useState('#EDB16E')
  const [userInfo, setUserInfo] = useState(null)

  let [userID, setUserID] = useState(null)
  let collection = 'Items'
  let collection2 = 'Usuarios'

  useEffect(()=>{
    GetCollection(collection, setItems)
    if (CheckConnectivity()){
      GetCurrentSpecificInfo('id', setUserID)
    } else {
      GetSpecificValueFromAsyncStorage('id', setUserID)
      setInternet(false)
    }
  },[])

  useEffect(()=>{
    if(userID) GetAllUserData(collection2, userID, setUserInfo)
  },[userID])

  const updateIcon = () => {
    if(showIcon === true){
      setThrasSize(Number(80))
      setColor('#FF0000')
      setBottom(58)
      setLeft(32)
    } else {
      setThrasSize(Number(63))
      setColor('#EDB16E')
      setBottom(40)
      setLeft(40)
    }
    setShowIcon(!showIcon)
  }


  const checkBeforeDelete = (itemID, userOwnerID)=>{

    if(userInfo.userID === userOwnerID){
      Alert.alert("Alerta", "¿Esta seguro que desea eliminar el articulo ?",
      [{ text: "Continuar", onPress: () => { deleteItem(itemID) }},
      { text: "Cancelar", onPress: () => {return null}}],
      { cancelable: false })
    } else {
      Alert.alert("Operacion Invalida", "Usted no es el dueño de este articulo ...",
      [{ text: "Continuar", onPress: () => { return null }},],
      { cancelable: false })
    }  
  }

  const renderItem =  ( item ) => {
     const itemID = item['item'].id
     const hasImage =  item['item'].hasImage
     const userOwnerID = item['item'].userID
     return(   
      <> 
      { internet ?
      <>
        <View style={styles.item}>
            { !items ?
            <>
                <ActivityIndicator style={styles.activityStyle} status='danger' />
            </>
            :
            <>
                <ItemImages collection={collection} itemId={itemID} hasImage={hasImage} />
            { hasImage ?
            <>
              <View style={{flexDirection:'column'}}>
                <Text style={styles.title}>
                  {item['item'].itemName} {"\n"}  
                </Text>
                <Text style={styles.subTitle}>
                  {item['item'].itemDescription} {"\n"} {"\n"}
                  Creditos : {item['item'].credits} {"\n"}{"\n"}
                  Disponibles : {item['item'].cantidad} {"\n"}{"\n"} 
                <View>
                  <Button status='warning' style={{width:'40%', height:'30%', resizeMode:'contain', left:100}}
                    appearance='outline'  onPress={()=>{ BuyItem(item, userInfo) }}>
                    <Text style={styles.innerText} >Agregar  +</Text>
                  </Button>
                </View>
                  </Text>
                </View>
            </>
            :
            <>
              <View style={{flexDirection:'column'}}>
                <Text style={styles.titleAlternative}>
                  {item['item'].itemName} {"\n"}  
                </Text>
                <Text style={styles.subTitleAlternative}>
                  {item['item'].itemDescription} {"\n"} {"\n"}
                  Creditos : {item['item'].credits} {"\n"}{"\n"}
                  Disponibles : {item['item'].cantidad} {"\n"}{"\n"} 
                <View>
                  <Button status='warning' style={{width:'40%', height:'30%', resizeMode:'contain', left:85}}
                    appearance='outline'
                    onPress={()=>{ BuyItem(item, userInfo) }}>
                    <Text style={styles.innerText} >Agregar  +</Text>
                  </Button>
                </View>
                </Text>
              </View>
            </>
            }   
            </>
            } 
        </View>
        { !showIcon ?
                  <>
                    <TouchableOpacity style={styles.thrashStyle} onPress={()=>{checkBeforeDelete(itemID, userOwnerID)}}>
                      <FontAwesome5 name={'trash'} size={21} color={'#FF0000'}/>
                    </TouchableOpacity>
                  </>
                  :
                  <>
                  </> 
                } 
      </> 
      :
      <>
        <ActivityIndicator style={styles.activityStyle} />
        <Text style={styles.text} > No hay Internet ...</Text>
      </>
      }
      </>
      )
  }

  return(
    <>
      <View style={styles.box} >
        <SafeAreaView >
          <FlatList data={items} renderItem={(item)=>renderItem(item)} keyExtractor={item => item.id} />
        </SafeAreaView>     
      </View>   
        { internet?
        <>
          <View  style={{flexDirection:'row'}}>
            <TouchableOpacity style={{bottom:bottom,left:left}} onPress={()=>{updateIcon()} }>
                <FontAwesome5 name={'trash'} size={thrashSize} color={color}/>
            </TouchableOpacity>
          </View>
        </>
        :
        <>
        </>
        }
        <TouchableOpacity style={styles.button} onPress={()=>{navigation.navigate("NewItemScreen")} }>
            <FontAwesome5 name={'plus'} size={20} color={'#ffffff'}/>
        </TouchableOpacity>
    </>
  )
}

export default ItemsScreen

const styles = StyleSheet.create({
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
  text:{
    color:'#ffffff  '
  },
  item: {
    backgroundColor: '#FFF8D9',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius:10,
    flexDirection:'row', 
  },
  title: {
    fontSize: 18,
    alignSelf:'center',
    width:'70%'
  },
  subTitle: {
    fontSize: 15,
    width:'77%',
    alignItems:'center',
  },
  activityStyle:{
    size:"large",
    color:"#0000ff"
  },
  thrashStyle:{
    elevation:10,
    left:310,
    bottom:250,
    marginBottom:-22.4
  },
  text:{
    textAlign:'center'  
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EDB16E',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10 ,
    right: 30, 
    elevation: 5,
  },
  evaButton:{
    width:'40%',
    height:'30%',
    resizeMode:'contain',
  },
  indicator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
    innerText: {
    color: 'red'
  },
  titleAlternative: {
    fontSize: 18,
    alignSelf:'center',
    width:'100%',
    left:0,
    alignItems:'center',
    alignContent:'center',  
  },
  subTitleAlternative: {
    fontSize: 15,
    width:'70%',
    alignItems:'center',
  },
})
