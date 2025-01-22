import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native'; // Import LottieView
import { LinearGradient } from 'expo-linear-gradient';

const ErrorScreen = ({ navigation }) => {
  const handleRetry = () => {
    navigation.goBack(); // Go back to the MainScreen
  };

  return (
    <View style={styles.container}>
      {/* Emoji Card with Red Gradient */}
      <LinearGradient
        colors={['#ff5f6d', '#ffc371']} // Red to orange gradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.emojiCard}
      >
        {/* Lottie Animation */}
        <LottieView
          source={require('./AnimationEM.json')}
          autoPlay
          loop
          useNativeDriver={true}
          style={styles.lottie}
        />
      </LinearGradient>

      {/* Error Text */}
      <Text style={styles.errorText}>
        Unfortunately, the link you provided is invalid
      </Text>

      {/* Retry Button */}
      <TouchableOpacity onPress={handleRetry} style={styles.buttonContainer}>
        <LinearGradient
          colors={['#96c93d', '#00b09b']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Retry</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiCard: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '60%', // Adjust card height to 40% of the screen
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',

    // Adding shadow properties
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8, // For Android shadow
  },
  lottie: {
    width: 350, // Adjust size based on your animation
    height: 350,
  },
  errorText: {
    fontSize: 35,
    color: '#fff',
    textAlign: 'center',
    marginTop: '150%', // Adjust margin to ensure text appears below the card
    marginVertical: 20,
    fontWeight: 'bold',
    fontFamily: 'PoltawskiNowy-Regular', // Make sure you have loaded the font
  },
  buttonContainer: {
    marginBottom: 60,
  },
  button: {
    width: 150,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ErrorScreen;
