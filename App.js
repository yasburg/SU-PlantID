import React from 'react';
import { View, Text, Dimensions, StyleSheet, Easing, Animated,  TouchableOpacity, Image } from 'react-native';
import Colors from "./utils/Colors"
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
const SCREEN_WIDTH = Dimensions.get("window").width
const SCREEN_HEIGHT = Dimensions.get("window").height
let percent = 0
let percent2 = 0

export default class App extends React.PureComponent {
    constructor(props){
      super(props);
      this.widthAnimnVal = new Animated.Value(0)
      this.widthAnimnVal2 = new Animated.Value(0)
        
      this.state = {
        num: 0,
        image: "",
        isUploaded: false
      }
    }
  
    _pickImage = async () => {
      try {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
        console.log(result)
        if (!result.cancelled) {
          if(this.state.isUploaded){
            percent = percent/2
            percent2 = percent*2
          }
          percent = 53.27
          percent2 = 43
          this.setState({ image: result.uri },()=>this.changeWidth(percent,percent2));
        }else{
          alert("Image can not be uploaded.")
        }
        this.setState({isUploaded: true})
      } catch (e) {
        alert("Image can not be uploaded.")
        console.log(e);
      }
    };
    

    imageDelete=() => {
      this.setState({image:"",isUploaded:false})
      this.changeWidth(0,0)
      percent = 0
      percent2 = 0

    }

    changeWidth = (value,value2) => {
      Animated.timing(this.widthAnimnVal, {
          toValue: 3 * value,
          duration: 500,
          easing: Easing.linear,
        }).start(() => {
          Animated.timing(this.widthAnimnVal2, {
            toValue: 3 * value2,
            duration: 500,
            easing: Easing.linear,
          }).start()
        })
      }

    // render image according to predict coming from server. 
    //If there is any predict higher than 90 there will be only 1 displayed, otherwise 2
    //Percent value should be replaced with predict value coming from API. 
    //Also disease names should come from API.

    renderImages = () => { 
      if(percent >= 90){
        return(
        <View style={{flex:1,paddingLeft:30,justifyContent:"space-evenly"}}>
          <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-evenly"}}>
            <Text style={{fontSize:30,fontWeight:"500",color:Colors.darkGrayDark.alpha1}}>
              Elma Kurdu
            </Text>
          <View style={styles.barContainer}>
            <Animated.View style={[styles.bar,{width: this.widthAnimnVal}]}> 
            </Animated.View>
          </View>
          <Text style={{fontSize:18,color:Colors.darkGrayDark.alpha1,fontWeight:"500"}}>
            {"%" + percent}
          </Text>
        </View>
      </View>
        ) 
      }else{
        return(
          <View style={{flex:1,paddingLeft:SCREEN_WIDTH*0.05,justifyContent:"space-evenly"}}>
            <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-evenly"}}>
              <Text style={styles.diseaseText}>
                Elma Kurdu
              </Text>
            <View style={styles.barContainer}>
              <Animated.View style={[styles.bar,{width: this.widthAnimnVal}]}> 
              </Animated.View>
            </View>
              <Text style={{fontSize:18,color:Colors.darkGrayDark.alpha1,fontWeight:"500",marginLeft:20}}>
                {"%" + (Math.round(percent * 100) / 100).toFixed(2)}
              </Text>
          </View>
          <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-evenly"}}>
            <Text style={styles.diseaseText}>
              Portakal Turunçgil Yeşillenme
            </Text>
            <View style={styles.barContainer}>
              <Animated.View style={[styles.bar,{width: this.widthAnimnVal2}]}> 
              </Animated.View>
            </View>
            <Text style={{fontSize:18,color:Colors.darkGrayDark.alpha1,fontWeight:"500",marginLeft:20}}>
              {"%" + (Math.round(percent2 * 100) / 100).toFixed(2)}
            </Text>
          </View>
        </View>
        )
      }
    }

    render(){
      return(
        <View style = {styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>
              SU-Plant Disease
            </Text>
          </View>
          <View style={{ alignSelf:"center"}}>
            <View style={{flexDirection:"row",flex:1,paddingTop:64}}>
              <View style={styles.imageContainer}>
                <Feather name={"image"} size={100} color={Colors.lightGrayDark.alpha1}/>
                <Image source={{ uri: this.state.image }} style={{width:"100%",height:"100%",position: "absolute"}} resizeMode= {"contain"}/>
                <TouchableOpacity style={{position:"absolute", top:10,right:10}} disabled={!this.state.isUploaded} onPress={()=>this.imageDelete()}>
                  <Feather name={"x"} size={20} />
                </TouchableOpacity>
              </View>
              {this.renderImages()}
            </View>
            <TouchableOpacity style={styles.uploadButton} onPress={this._pickImage} activeOpacity={0.8}>
              <Text style={{color:"white",fontSize:18,fontWeight:"500"}} onPress={this.imageUpload}>
                {!this.state.isUploaded ?  "Resim yükle" : "Yeni resim yükle"}
              </Text>
            </TouchableOpacity>       
          </View>
          <View style={{flex:1,justifyContent:"flex-end",paddingBottom: 30, paddingLeft: 50}}>
            <Text style={{fontSize:16}}>
              Sabancı Üniversitesi'nde geliştirilmiştir.
            </Text>
          </View>
        </View>
      )
    }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      height:SCREEN_HEIGHT,
      backgroundColor:Colors.lightGray.alpha1
  },
  header:{
    alignItems:'center',
    height:75,
    backgroundColor:'rgba(115,159,98,1)',
    borderBottomLeftRadius:10,
    borderBottomRightRadius:10,
    justifyContent:"center"
  },
  headerText:{
    fontSize:40,
    fontWeight:"500",
    color: Colors.white.alpha1
  },
  imageContainer:{
    width:256,
    height:256,
    borderRadius:10,
    borderWidth:2,
    borderColor: Colors.lightGrayDark.alpha1,
    overflow:"hidden",
    alignItems:"center",
    justifyContent:"center",
    shadowColor: Colors.black.alpha1,
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 7,
    shadowOpacity: 0.05,
  },
  bar:{
    height:"100%",
    backgroundColor:'rgba(115,159,98,1)',
  },
  barContainer:{
    height:30,
    borderWidth:1,
    marginLeft:100,
    width:300,
    overflow:"hidden",
    borderColor:Colors.darkGray.alpha08,
    shadowColor: Colors.black.alpha1,
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 7,
    shadowOpacity: 0.05,
    borderColor: Colors.lightGrayDark.alpha1,
  },
  uploadButton:{
    width: 256, 
    height: 50,
    alignItems:"center",
    justifyContent:"center", 
    borderRadius:10,
    backgroundColor:'rgba(115,159,98,1)',
    marginTop:40,

  },
  diseaseText:{
    fontSize:30,
    fontWeight:"500",
    color:Colors.darkGrayDark.alpha1,
    width:300,
    textAlign:"center"
  }

  });