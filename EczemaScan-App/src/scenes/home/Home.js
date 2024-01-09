import React, { useEffect, useState, useContext, useLayoutEffect } from 'react';
import { Text, View, ScrollView, StyleSheet, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import IconButton from '../../components/IconButton';
import ScreenTemplate from '../../components/ScreenTemplate';
import Button from '../../components/Button';
import { firestore } from '../../firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';
import { colors, fontSize } from '../../theme';
import { UserDataContext } from '../../context/UserDataContext';
import { ColorSchemeContext } from '../../context/ColorSchemeContext';
import { sendNotification } from '../../utils/SendNotification';

const { width, height } = Dimensions.get('window');

export default function Home() {
  const navigation = useNavigation();
  const [token, setToken] = useState('');
  const { userData } = useContext(UserDataContext);
  const { scheme } = useContext(ColorSchemeContext);
  const isDark = scheme === 'dark';
  const colorScheme = {
    content: isDark ? styles.darkContent : styles.lightContent,
    text: isDark ? colors.white : colors.primaryText,
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="align-right"
          color={colors.lightPurple}
          size={24}
          onPress={() => headerButtonPress()}
          containerStyle={{ paddingRight: 15 }}
        />
      ),
    });
  }, [navigation]);

  const headerButtonPress = () => {
    alert('Tapped header button');
  };

  useEffect(() => {
    const tokensRef = doc(firestore, 'tokens', userData.id);
    const tokenListner = onSnapshot(tokensRef, (querySnapshot) => {
      if (querySnapshot.exists) {
        const data = querySnapshot.data();
        setToken(data);
      } else {
        console.log('No such document!');
      }
    });
    return () => tokenListner();
  }, []);

  const onNotificationPress = async () => {
    const res = await sendNotification({
      title: 'Hello',
      body: 'This is something 👋',
      data: 'something data',
      token: token.token,
    });
    console.log(res);
  };

  return (
    <ScreenTemplate style={styles.mainContainer}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Early Detection</Text>
        <Text>Makes A Difference</Text>
      </View>
      <View style={styles.mainContent}>
        <View style={styles.scannerContainer}>
          <View style={styles.scannerContent}>
            <Image
              source={require('../../../assets/images/Scanner.png')}
              style={styles.scannerImage}
            />
            <Text style={styles.scannerText}>
              Our Scan Can Help You To detect Eczema
            </Text>
          </View>
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText}>
              Early detection of eczema is vital for timely intervention and
              effective management, ensuring relief from symptoms, preventing
              complications, and promoting an improved quality of life.
            </Text>
            <Text style={styles.descriptionText}>
              Timely identification also empowers individuals to proactively
              address triggers, minimizing flare-ups and fostering better
              long-term skin health.
            </Text>
          </View>
        </View>
        <View style={styles.cameraSection}>
          <Text style={styles.cameraSectionText}>
            Visit the Camera Section to scan for your eczema and receive instant results.
          </Text>
        </View>
      </View>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: "#FBF9F1",
    borderRadius: 5,
    marginTop: height * 0.05,
    marginLeft: width * 0.05,
    marginRight: width * 0.05,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  mainContent: {
    flex: 1,
    margin: width * 0.05,
  },
  scannerContainer: {
    backgroundColor: '#DCF2F1',
    flex: 1,
    borderRadius: 20,
    alignItems: 'center',
    padding: 20,
    marginBottom: 10,
  },
  scannerContent: {
    backgroundColor: '#7FC7D9',
    height: height * 0.15,
    width: width * 0.8,
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  scannerImage: {
    width: width * 0.15,
    height: width * 0.15,
    marginRight: 10,
    borderRadius: 5,
  },
  scannerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    padding: 5,
    flex: 1,
  },
  descriptionContainer: {
    padding: 10,
  },
  descriptionText: {
    color: 'gray',
  },
  cameraSection: {
    backgroundColor: '#7FC7D9',
    height: height * 0.1,
    width: width * 0.8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginLeft: width * 0.05,
  },
  cameraSectionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});
