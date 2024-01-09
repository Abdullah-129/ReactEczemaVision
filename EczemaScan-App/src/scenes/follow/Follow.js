import React, { useEffect, useContext, useRef, useState } from 'react'
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Image,
  Dimensions,
} from 'react-native'
import ScreenTemplate from '../../components/ScreenTemplate'
import Button from '../../components/Button'
import { colors, fontSize } from 'theme'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import { UserDataContext } from '../../context/UserDataContext'
import { useNavigation } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker'
import { Camera } from 'expo-camera'
import { ScrollView } from 'react-native-gesture-handler'
const { width, height } = Dimensions.get('window')

export default function Follow() {
  const [loading , Setloading] = useState(false);
  const [resultdata, Setresultdata] = useState(null)
  const [label, setLabel] = useState('')
  const [result, setResult] = useState('')
  const cameraRef = useRef()
  const [selectedImage, setSelectedImage] = useState(null)
  const [hasCameraPermissions, setHasCameraPermissions] = useState(null)
  const [isFrontCamera, setIsFrontCamera] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const navigation = useNavigation()
  const { userData } = useContext(UserDataContext)
  const { scheme } = useContext(ColorSchemeContext)
  const isDark = scheme === 'dark'
  const colorScheme = {
    text: isDark ? colors.white : colors.primaryText,
  }

  let url = 'http://192.168.1.6:5000/predict';
  const handleretest = async () => {
    Setresultdata(null)
    setCapturedImage(null)
    setSelectedImage(null)
    setResult('')
  }
  const sendFile = async (image1, image2) => {
    let fileToSend = capturedImage === null ? image2 : image1

    try {
      let formdata = new FormData()
      let fileName = fileToSend.substring(fileToSend.lastIndexOf('/') + 1)

      formdata.append('file', {
        uri: fileToSend,
        name: fileName,
        type: 'image/jpg',
      })

      let requestOptions = {
        method: 'POST',
        body: formdata,
        headers: {
          'Content-Type': 'multipart/form-data; boundary=some-random-boundary', // Set the boundary here
        },
      }

      let res = await fetch(url, requestOptions)

      if (res.ok) {
        let result = await res.text()
        console.log(result)
        setResult(resultdata)
        Setresultdata(JSON.parse(result))
        Setloading(false);
      } else {
        console.error('Failed to upload file')
        Setloading(false);
      }
    } catch (error) {
      console.error('Error:', error)
      Setloading(false);
    }
  }

  useEffect(() => {
    console.log('Camera screen')
  }, [])
  useEffect(() => {
    ;(async () => {
      const cameraPermissions = await Camera.requestCameraPermissionsAsync()
      setHasCameraPermissions(cameraPermissions.status === 'granted')
    })()
  }, [])
  const handleSwitchCamera = async () => {
    if (cameraRef.current) {
      setIsFrontCamera((prev) => !prev)
    }
  }

  const sendfile = () => {
    console.log('pressed')
    Setloading(true);
    sendFile(capturedImage, selectedImage);
  }

  const handleCapture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync()
      setCapturedImage(photo.uri)
      setSelectedImage(null) // Reset selectedImage when capturing a new picture
      setShowModal(true)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setCapturedImage(null)
    setSelectedImage(null)
  }

  const handleSelectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3], // Adjust the aspect ratio if needed
        quality: 1,
      })
      console.log('Selected Image URI:', selectedImage)

      if (!result.cancelled) {
        const selectedImageUri = result.assets[0].uri
        setSelectedImage(selectedImageUri)
        setCapturedImage(null) // Reset capturedImage when selecting a new image from the gallery
        setShowModal(true)
      }
    } catch (error) {
      console.error('Error selecting image from gallery:', error)
    }
  }

  if (hasCameraPermissions === null) {
    return (
      <View>
        <Text>Checking camera permissions...</Text>
      </View>
    )
  }

  if (!hasCameraPermissions) {
    return (
      <View>
        <Text>Camera permissions not granted</Text>
      </View>
    )
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScreenTemplate>
      {resultdata === null ? (
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <View style={{ alignItems: 'center' }}>
              <Text
                style={{
                  color: 'black',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: 22,
                  marginTop: 10,
                }}
              >
                Capture Image
              </Text>
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 10,
                marginTop: 30,
              }}
            >
              {capturedImage === null && selectedImage === null ? (
                <View
                  style={{
                    height: 296,
                    width: 296,
                    overflow: 'hidden',
                    borderRadius: 8,
                  }}
                >
                  <Camera
                    ref={cameraRef}
                    style={{ flex: 1, width: '100%' }}
                    type={
                      isFrontCamera
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back
                    }
                  />
                </View>
              ) : (
                <View>
                  <Modal
                    visible={showModal}
                    // transparent={true}
                    onRequestClose={handleCloseModal}
                  >
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      {selectedImage && (
                        <Image
                          style={{
                            width: 300,
                            height: 300,
                            borderRadius: 8,
                            marginBottom: 16,
                          }}
                          source={{ uri: selectedImage }}
                        />
                      )}
                      {capturedImage && (
                        <Image
                          style={{
                            width: 300,
                            height: 300,
                            borderRadius: 8,
                            marginBottom: 16,
                          }}
                          source={{ uri: capturedImage }}
                        />
                      )}
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                        }}
                      >
                        <TouchableOpacity
                          style={{
                            flex: 1,
                            margin: 8,
                            backgroundColor: '#4dccc6',
                            backgroundImage:
                              'linear-gradient(315deg, #4dccc6 0%, #96e4df 74%)',
                            paddingVertical: 10,
                            paddingHorizontal: 10,
                            borderRadius: 10,
                            marginRight: 8,
                            alignItems: 'center',
                          }}
                          onPress={handleCloseModal}
                        >
                          <Text style={{ color: 'white' }}>Retake</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            flex: 1,
                            margin: 8,
                            backgroundColor: '#4dccc6',
                            backgroundImage:
                              'linear-gradient(315deg, #4dccc6 0%, #96e4df 74%)',
                            paddingVertical: 10,
                            paddingHorizontal: 10,
                            borderRadius: 10,
                            marginLeft: 8,
                            alignItems: 'center',
                          }}
                          onPress={sendfile}
                        >
                          <Text style={{ color: 'white' }}>
                            Select this Picture
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Modal>
                </View>
              )}
            </View>
            {capturedImage === null ? (
              <View
                style={{
                  justifyContent: 'center',
                  marginTop: 20,
                  flexDirection: 'row',
                  margin: width * 0.05,
                }}
              >
                <TouchableOpacity
                  style={{
                    flex: 1,

                    backgroundColor: '#4dccc6',
                    backgroundImage:
                      'linear-gradient(315deg, #4dccc6 0%, #96e4df 74%)',
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    borderRadius: 10,
                    marginRight: 10,
                    alignItems: 'center',
                  }}
                  onPress={handleSwitchCamera}
                >
                  <Text style={{ color: 'white' }}>Switch</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: '#4dccc6',
                    backgroundImage:
                      'linear-gradient(315deg, #4dccc6 0%, #96e4df 74%)',
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    borderRadius: 10,
                    marginRight: 10,
                    alignItems: 'center',
                  }}
                  onPress={handleCapture}
                >
                  <Text style={{ color: 'white' }}>Capture</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: '#4dccc6',
                    backgroundImage:
                      'linear-gradient(315deg, #4dccc6 0%, #96e4df 74%)',
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    borderRadius: 10,
                    alignItems: 'center',
                  }}
                  onPress={handleSelectImage}
                >
                  <Text style={{ color: 'white' }}>Gallery</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <></>
            )}
          </View>
        </SafeAreaView>
      ) : (
        <>
          <ScrollView>
            <View
              style={{
                marginTop: height * 0.02,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {selectedImage && (
                <Image
                  style={{
                    width: 300,
                    height: 300,
                    borderRadius: 8,
                    // marginBottom: 16,
                    alignItems: 'center',
                  }}
                  source={{ uri: selectedImage }}
                />
              )}
              {capturedImage && (
                <Image
                  style={{
                    width: 300,
                    height: 300,
                    borderRadius: 8,
                    // marginBottom: 16,
                    alignItems: 'center',
                  }}
                  source={{ uri: capturedImage }}
                />
              )}
            </View>

            {resultdata.class === 'Eczema' ? (
              <View>
                <View
                  style={{
                    padding: 20,
                    backgroundColor: '#FBF9F1',
                    borderRadius: 5,
                    marginTop: height * 0.05,
                    marginLeft: width * 0.05,
                    marginRight: width * 0.05,
                    justifyContent: 'center', // Center text vertically
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      marginBottom: 10,
                    }}
                  >
                    Eczema Detected - Accuracy {Math.round(resultdata.Accuracy * 100)}
                    %
                  </Text>
                  <Text>
                    It is advisable to consult with a medical professional as
                    soon as possible.
                  </Text>
                </View>
                <View
                  style={{
                    padding: 20,
                    backgroundColor: '#FBF9F1',
                    borderRadius: 5,
                    marginTop: height * 0.01,
                    marginLeft: width * 0.05,
                    marginRight: width * 0.05,
                    justifyContent: 'center', // Center text vertically
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      marginBottom: 10,
                    }}
                  >
                    Dr Ahmed Raza (+92300000000)
                  </Text>
                  <Text>
                    Dermatologist MBBS, FCPS (Dermatology), CAAAM (USA)
                  </Text>
                </View>
                <View
                  style={{
                    padding: 20,
                    backgroundColor: '#FBF9F1',
                    borderRadius: 5,
                    marginTop: height * 0.01,
                    marginLeft: width * 0.05,
                    marginRight: width * 0.05,
                    justifyContent: 'center', // Center text vertically
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      marginBottom: 10,
                    }}
                  >
                    Dr. Sadaf Amin (+92300000000)
                  </Text>
                  <Text>Dermatologist MBBS, FCPS (Dermatology)</Text>
                </View>
                <View
                  style={{
                    padding: 20,
                    backgroundColor: '#FBF9F1',
                    borderRadius: 5,
                    marginTop: height * 0.01,
                    marginLeft: width * 0.05,
                    marginRight: width * 0.05,
                    justifyContent: 'center', // Center text vertically
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      marginBottom: 10,
                    }}
                  >
                    Precautions when Eczema is detected:
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      marginBottom: 8,
                    }}
                  >
                    1. Keep the affected skin moisturized.
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      marginBottom: 8,
                    }}
                  >
                    2. Avoid scratching to prevent infection.
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      marginBottom: 8,
                    }}
                  >
                    3. Use mild, fragrance-free soaps and detergents.
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      marginBottom: 8,
                    }}
                  >
                    4. Wear loose and breathable clothing.
                  </Text>
                </View>
              </View>
            ) : (
              <View
                style={{
                  padding: 20,
                  backgroundColor: '#FBF9F1',
                  borderRadius: 5,
                  marginTop: height * 0.05,
                  marginLeft: width * 0.05,
                  marginRight: width * 0.05,
                  justifyContent: 'center', // Center text vertically
                }}
              >
                <Text
                  style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}
                >
                 Your skin is in good health -- {Math.round(resultdata.Accuracy * 100)}%
                </Text>
                <Text
                  style={{
                    // fontSize: 20,
                    // fontWeight: 'bold',
                    // marginBottom: 10,
                  }}
                >
                  You have nothing to worry about; however, ensure the
                  well-being of your skin by following these steps:
                </Text>
                <Text
                  style={{
                    // fontSize: 20,
                    // fontWeight: 'bold',
                    // marginBottom: 10,
                  }}
                >
                  1. Stay hydrated by drinking enough water.
                </Text>
                <Text
                  style={{
                    // fontSize: 20,
                    // fontWeight: 'bold',
                    // marginBottom: 10,
                  }}
                >
                  2. Cleanse your face regularly with a gentle cleanser.
                </Text>
                <Text
                  style={{
                    // fontSize: 20,
                    // fontWeight: 'bold',
                    // marginBottom: 10,
                  }}
                >
                  3. Moisturize your skin to maintain its natural balance.
                </Text>
                <Text
                  style={{
                    // fontSize: 20,
                    // fontWeight: 'bold',
                    // marginBottom: 10,
                  }}
                >
                  4. Protect your skin from the sun with sunscreen.
                </Text>
              </View>
            )}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  margin: 8,
                  backgroundColor: '#4dccc6',
                  backgroundImage:
                    'linear-gradient(315deg, #4dccc6 0%, #96e4df 74%)',
                  paddingVertical: 10,
                  paddingHorizontal: 10,
                  borderRadius: 10,
                  marginRight: 8,
                  alignItems: 'center',
                }}
                onPress={handleretest}
              >
                <Text
                  style={{
                    color: 'white',
                  }}
                >
                  Retake Test
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </>
      )}
    </ScreenTemplate>
  )
}
