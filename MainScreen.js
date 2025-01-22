import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import facts from './facts.json'; // Import the facts from JSON

const MainScreen = ({ navigation }) => {
  const [link, setLink] = useState('');
  const [randomFact, setRandomFact] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity 0
  const translateY = useRef(new Animated.Value(50)).current; // Initial position lower

  useEffect(() => {
    // Function to show a new fact with fade-in animation
    const showNewFact = () => {
      const randomIndex = Math.floor(Math.random() * facts.length);
      setRandomFact(facts[randomIndex]);

      // Reset animation values
      fadeAnim.setValue(0);
      translateY.setValue(50);

      // Animate the fact card to fade in and move upwards
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800, // Duration of the fade
        useNativeDriver: true,
      }).start();

      Animated.timing(translateY, {
        toValue: 0,
        duration: 800, // Same duration as fade
        useNativeDriver: true,
      }).start();
    };

    // Show the first fact on mount
    showNewFact();

    // Set an interval to show a new fact every 30 seconds
    const interval = setInterval(showNewFact, 10000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(interval);
  }, []);

  const fetchVideoDetails = async (url) => {
    const videoId = extractVideoId(url);
    const apiKey = 'AIzaSyBF40aOsQMEOg2x25raLdyqgnKqDAxexj4'; // Replace with your actual API key

    if (videoId) {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${apiKey}`
        );
        const json = await response.json();

        if (json.items.length > 0) {
          const video = json.items[0];
          const title = video.snippet.title;
          const duration = video.contentDetails.duration;

          return { title, duration };
        } else {
          return null; // Invalid video ID
        }
      } catch (error) {
        console.error("Error fetching video details:", error);
        return null;
      }
    } else {
      return null; // Invalid URL
    }
  };

  const extractVideoId = (url) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleNext = async () => {
    if (isValidYouTubeLink(link)) {
      const videoDetails = await fetchVideoDetails(link);

      if (videoDetails) {
        navigation.navigate('VideoInfoScreen', {
          videoTitle: videoDetails.title,
          videoDuration: videoDetails.duration,
        });
      } else {
        navigation.navigate('ErrorScreen');
      }
    } else {
      navigation.navigate('ErrorScreen');
    }
  };

  const isValidYouTubeLink = (url) => {
    const regex = /^(https?\:\/\/)?((www\.youtube\.com|youtu\.?be)\/(watch\?v=|embed\/|v\/|.+\?v=)?([-\w]+)(\S+)?)/;
    return regex.test(url);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#f3904f', '#3b4371']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.largeU}></Text>
        <Text style={styles.title}>Tube Downloader</Text>

        <LinearGradient
          colors={['#f3904f', '#3b4371']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.inputContainer}
        >
          <TextInput
            style={styles.input}
            placeholder="Enter link here"
            placeholderTextColor="#999"
            value={link}
            onChangeText={setLink}
            keyboardType="url"
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="done"
            blurOnSubmit={false} // Prevent keyboard from dismissing on submit
            onSubmitEditing={handleNext} // Allow submission from keyboard
          />
        </LinearGradient>
      </LinearGradient>

      {/* Animated "Did You Know?" fact card */}
      <Animated.View
        style={[
          styles.factCard,
          {
            opacity: fadeAnim, // Bind opacity to animated value
            transform: [{ translateY }], // Bind translateY to animated value
          },
        ]}
      >
        <Text style={styles.factLabel}>Did You Know?</Text>
        <Text style={styles.factText}>{randomFact}</Text>
      </Animated.View>

      <TouchableOpacity onPress={handleNext} style={styles.buttonContainer}>
        <LinearGradient
          colors={['#96c93d', '#00b09b']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Next</Text>
        </LinearGradient>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 0,
    paddingBottom: 100,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  title: {
    fontSize: 40,
    color: '#fff',
    marginBottom: 10,
    marginTop: 150,
  },
  inputContainer: {
    width: 350,
    borderRadius: 25,
    marginTop: 50,
  },
  input: {
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    fontSize: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  factCard: {
    backgroundColor: '#444',
    borderRadius: 15,
    padding: 20,
    marginVertical: 20,
    marginHorizontal: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5, // For Android shadow
  },
  factLabel: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
    fontWeight: '600',
  },
  factText: {
    color: '#fff',
    fontSize: 35,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginBottom: 40,
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

export default MainScreen;
