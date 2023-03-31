import { StatusBar } from 'expo-status-bar';
import { StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  TextInput, 
  Pressable, 
  ScrollView, 
  TouchableOpacity} from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 2000);
const hKey = '@MyApp:hKey';
const bmiKey = '@MyApp:bmiKey';
const key = '@MyApp:key';
export default class App extends Component{
  state = {
    weight: '',
    height: '',
    bmi: null,
    savedHeight: null,
    savedBMI: null,
    bmiText: '',
  };

  constructor(props){
    super(props)
    this.onLoad();
  }
  
  clearAllData = async () => {
    try {
      await AsyncStorage.clear();
      console.log('All data cleared successfully.');
    } catch (error) {
      console.log('Error clearing data:', error);
    }
  };

  onLoad = async () => {
    const savedHeight = await AsyncStorage.getItem(hKey);
    this.setState({savedHeight});
    console.log('savedHeight:', savedHeight);
    const savedBMI = await AsyncStorage.getItem(bmiKey);
    this.setState({savedBMI});
    console.log('savedBMI:', savedBMI);
    const bmiText = await AsyncStorage.getItem(key);
    this.setState({bmiText});
    console.log('bmiText:', bmiText);

    if (savedBMI) {
      this.setState({
        bmi: parseFloat(savedBMI).toFixed(1),
        bmiText: `Body Mass Index is ${parseFloat(savedBMI).toFixed(1)}`,
      });
  }
}
  
  onSave = async () => {
    const {height, BMI, bmiText} = this.state;
    try{
      await AsyncStorage.setItem(hKey, height);
      await AsyncStorage.setItem(bmiKey, BMI);
      await AsyncStorage.setItem(key, bmiText);
      Alert.alert('Saved', 'Successfully saved on device');
    }catch(error){
      Alert.alert('Error', 'There was an error while saving data');
    }
  }

  calculateBMI = async () => {
    const { weight, height, savedHeight } = this.state;
    const h = savedHeight ? parseFloat(savedHeight) : parseFloat(height);
    const w = parseFloat(weight);
    const value = (w / (h * h)) * 703;
    this.setState({ bmi: value.toFixed(1),
    bmiText: `Body Mass Index is ${value.toFixed(1)}` });
    await AsyncStorage.setItem(hKey, height);
    await AsyncStorage.setItem(bmiKey, value.toFixed(1));
  }

  onHeightChange = (text) =>{
    this.setState({height: text, savedHeight: text})
  }
  onWeightChange = (text) =>{
    this.setState({weight: text})
  }

  render() {
    const {height, weight, savedHeight,  bmiText, } = this.state;

    return(
      <SafeAreaView style={styles.container}>
        <Text style={styles.toolbar}>BMI Calculator</Text>
        <ScrollView>
          <TextInput 
          style={styles.input}
          onChangeText={this.onWeightChange}
          value={weight}
          keyboardType='numeric'
          placeholder='Weight in Pounds'>
          </TextInput>
          <TextInput
            style={styles.input}
            onChangeText={this.onHeightChange}
            value={height || savedHeight}
            keyboardType='numeric'
            placeholder={savedHeight ? savedHeight : 'Height in Inches'}
          />
          <TouchableOpacity onPress={this.calculateBMI} style={styles.button}><Text style={styles.buttonText}>Compute BMI</Text></TouchableOpacity>
          <TextInput
            style={styles.content}
            editable={false}
            value={bmiText || ""}
          />
          <Text style={styles.assessment}>Assessing Your BMI{'\n'}
          {'\t'}Underweight: Less than 18.5{'\n'}
          {'\t'}Healthy: 18.5 to 24.9{'\n'}
          {'\t'}Overweight: 25.0 to 29.9{'\n'}
          {'\t'}Obese: 30.0 or highter</Text>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 0,
    padding: 5,
  },
  toolbar: {
    backgroundColor: '#f4411e',
    color: '#fff',
    textAlign: 'center',
    padding: 25,
    fontSize: 28,
    fontWeight: 'bold'
  },
  content: {
    textAlign: 'center',
    fontSize: 28,
    flex: 1,
    marginTop: 50,
    marginBottom:50,
  },
  preview: {
    backgroundColor: '#bdc3c7',
    flex: 1,
    height: 500,
  },
  input: {
    backgroundColor: '#ecf0f1',
    borderRadius: 3,
    height: 40,
    padding: 5,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    flex: 1,
    fontSize: 24,
  },
  button: {
    backgroundColor: '#34495e',
    margin: 10,
    borderRadius: 2,
    padding: 10,
  },
  assessment: {
    fontSize: 20,
  },
  buttonText: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
  }
});
