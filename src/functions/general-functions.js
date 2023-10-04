import { Alert } from 'react-native'
import NetInfo from "@react-native-community/netinfo"
import ImagePicker from 'react-native-image-crop-picker';
import { SaveInStorage } from '../storage/storage-functions';

export const CheckConnectivity = () => {
  return NetInfo.fetch().then((response) => {
    if(response.isConnected === true){
    //  console.log("Hay intenet !!")
    //  console.log("Connection type", response.type)
    //  console.log("Is connected?", response.isConnected)
    //  Alert.alert("Hay Internet !!")
      return true

    } else {
    //  console.log("No hay intenet !!")
    //   Alert.alert("No hay Conexion ...", " ", [{ text: "Continuar", onPress: () => {return null}}])
      return false
    }
  })
} 

export const lauchCameraOrLibrary = (isProfileImage="", setImages, update=null, setUpdate=null)=>{
  Alert.alert( "Escoga una Opcion ", "¿Como quiere escoger la foto ?",[{text: "Cancelar", onPress: () => { return },
      },{text: "Seleccionar de la Bibloteca", onPress: () => { 
        ChooseProfilePick(isProfileImage, setImages, update, setUpdate) },},
      { text: "Tomar Fotografia", onPress: () => {
        TakeProfilePick(isProfileImage, setImages, update, setUpdate) },
      },],{ cancelable: true })}

export const TakeProfilePick = (isProfileImage, setImages, update, setUpdate) => {
  let multiplePictures = true
    if(isProfileImage==="Profile") multiplePictures = false
    ImagePicker.openCamera({
      width: 300,          
      height: 400,          
      cropping: false,      
      multiple:multiplePictures,
    }).then(image => {
    switch(isProfileImage){
      case "Profile":
        SaveInStorage('ProfilePicturePath', image.path)
        if(setUpdate)  setUpdate(!update)
      break
      case "NewItem":
        let imagesArray=[]
            imagesArray.push(image) 
            setImages(imagesArray)
      break
      default:
      break
    }
  })
}

export const ChooseProfilePick = (isProfileImage="", setImages, update, setUpdate) => {
  let multiplePictures = true
    if(isProfileImage==="Profile") multiplePictures = false
  ImagePicker.openPicker({
    width: 300,
    height: 400,
    cropping: false,
    multiple: multiplePictures
  }).then(images => {
    switch(isProfileImage){
      case "Profile":
        SaveInStorage('ProfilePicturePath', images.path)
        if(setUpdate)  setUpdate(!update)
      break
      case "NewItem":
          setImages(images)
      break
      default:
      break
    }
  })
}

export const get = (element, key, nullMessage=null) => {
  if (element) {
      if (element[key]) {
          return element[key]
      }
  }
  return nullMessage
}


