import React from 'react';
import { View, Text, Dimensions, StyleSheet, Easing, Animated, TouchableOpacity, Image } from 'react-native';
import Colors from "./utils/Colors"
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
const SCREEN_WIDTH = Dimensions.get("window").width
const SCREEN_HEIGHT = Dimensions.get("window").height
const apiGetPredictionURL = 'http://ec2-54-158-191-10.compute-1.amazonaws.com:5000/predict';


export default class App extends React.PureComponent {
    constructor(props){
      super(props);
      this.widthAnimnVal = new Animated.Value(0)
      this.widthAnimnVal2 = new Animated.Value(0)
      this.firstPrediction = ""
      this.secondPrediction = ""
        
      this.state = {
        num: 0,
        image: "",
        isUploaded: false,
        percent: 0,
        percent2: 0
      }
    }

    _postImage = async () => {
      let uploadData = new FormData();
      uploadData.append('userImage', this.state.image);
      uploadData.append('filename', 'UserImage.jpg');
      uploadData.append('Content-Type', 'application/json');

      console.log(apiGetPredictionURL)
      fetch(apiGetPredictionURL, {
        method:'post',
        mode: 'no-cors',
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials" : true,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(uploadData)
      }).then(response => response.json())
        .then(response => {
          console.log(response);
          if(response.status){
            this.firstPrediction = response.output1;
            this.secondPrediction = response.output2;
            this.setState({isUploaded:true, percent: response.out_perc1, percent2: response.out_perc2})
            console.log(response);
          } else {
            console.log('Error', "Error on server side.");
          }
        }).catch(() => {
          console.log('Error', 'Error on network.');
        }) 
    }

    _pickImage = async () => {
      try {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
        if (!result.cancelled) {
          this._postImage();
          this.setState({image: result.uri})
        }else{
          alert("Image can not be uploaded.");
        }
        
      } catch (e) {
        alert("Image can not be uploaded.");
        console.log(e);
      }
    };

    imageDelete=() => {
      this.setState({image:"",isUploaded:false})
      this.changeWidth(0,0)
      this.state.percent = 0
      this.state.percent2 = 0
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

    //render image according to predict coming from server. 
    //If there is any predict higher than 90 there will be only 1 displayed, otherwise 2
    //Percent value should be replaced with predict value coming from API. 
    //Also disease names should come from API.

    renderImages = () => { 
      if(this.state.percent >= 90){
        return(
        <View style={{flex:1,paddingLeft:30,justifyContent:"space-evenly"}}>
          <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-evenly"}}>
            <Text style={{fontSize:30,fontWeight:"500",color:Colors.darkGrayDark.alpha1}}>
              {this.firstPrediction}
            </Text>
          <View style={styles.barContainer}>
            <Animated.View style={[styles.bar,{width: this.widthAnimnVal}]}> 
            </Animated.View>
          </View>
          <Text style={{fontSize:18,color:Colors.darkGrayDark.alpha1,fontWeight:"500"}}>
            {"%" + this.state.percent}
          </Text>
        </View>
      </View>
        ) 
      }else{
        return(
          <View style={{flex:1,paddingLeft:SCREEN_WIDTH*0.05,justifyContent:"space-evenly"}}>
            <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-evenly"}}>
              <Text style={styles.diseaseText}>
              {this.firstPrediction}
              </Text>
            <View style={styles.barContainer}>
              <Animated.View style={[styles.bar,{width: this.widthAnimnVal}]}> 
              </Animated.View>
            </View>
              <Text style={{fontSize:18,color:Colors.darkGrayDark.alpha1,fontWeight:"500",marginLeft:20}}>
                {"%" + (Math.round(this.state.percent * 100) / 100).toFixed(2)}
              </Text>
          </View>
          <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-evenly"}}>
            <Text style={styles.diseaseText}>
            {this.secondPrediction}
            </Text>
            <View style={styles.barContainer}>
              <Animated.View style={[styles.bar,{width: this.widthAnimnVal2}]}> 
              </Animated.View>
            </View>
            <Text style={{fontSize:18,color:Colors.darkGrayDark.alpha1,fontWeight:"500",marginLeft:20}}>
              {"%" + (Math.round(this.state.percent2 * 100) / 100).toFixed(2)}
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