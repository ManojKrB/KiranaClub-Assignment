import 'react-native-gesture-handler';

import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Button, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

type StackParamList = {
  Login: undefined;
  Home: undefined;
};

type HomeScreenProps = {
  navigation: any;
};

const Stack = createStackNavigator<StackParamList>();

const USERS: {[key: string]: string} = {
  Ram: 'retailpulse',
  Shyam: 'retailpulse',
};

const LoginScreen = ({navigation}: {navigation: any}) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async () => {
    if (USERS[username] === password) {
      await AsyncStorage.setItem('userToken', 'abc');
      navigation.navigate('Home');
    } else {
      Alert.alert('Invalid username or password');
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};
const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    navigation.navigate('Login');
  };

  return (
    <View>
      <Text>Welcome to the Home Screen</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const App = () => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAsyncStorage = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        setUserToken(token);
      } finally {
        setLoading(false);
      }
    };

    checkAsyncStorage();
  }, []);

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={userToken === 'abc' ? 'Home' : 'Login'}>
        <Stack.Screen name="Login" component={LoginScreen} />

        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
