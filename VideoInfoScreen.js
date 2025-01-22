import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ActivityIndicator, ProgressBarAndroid, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as FileSystem from 'expo-file-system';

const VideoInfoScreen = ({ route }) => {
  const { videoTitle, videoId } = route.params;
  const [artist, setArtist] = useState('');
  const [publishedDate, setPublishedDate] = useState('');
  const [duration, setDuration] = useState('00:00');
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [qualityOptionsVisible, setQualityOptionsVisible] = useState(false);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const apiKey = 'YOUR_API_KEY'; // Replace with your actual YouTube API key
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${apiKey}`
        );
        const data = await response.json();

        if (data.items && data.items.length > 0) {
          const videoDetails = data.items[0].snippet;
          const contentDetails = data.items[0].contentDetails;
          setArtist(videoDetails.channelTitle);
          setPublishedDate(new Date(videoDetails.publishedAt).toLocaleDateString());
          setDuration(formatDuration(parseDuration(contentDetails.duration)));
        } else {
          console.error('No video details found');
        }
      } catch (error) {
        console.error('Error fetching video details:', error);
      }
    };

    fetchVideoDetails();
  }, [videoId]);

  const handleDownloadPress = () => {
    setIsConverting(true);
    setConversionProgress(0);

    // Simulate the conversion progress
    const conversionInterval = setInterval(() => {
      setConversionProgress((prevProgress) => {
        if (prevProgress >= 1) {
          clearInterval(conversionInterval);
          setIsConverting(false);
          setQualityOptionsVisible(true);
        }
        return prevProgress + 0.1;
      });
    }, 500);
  };

  const handleQualitySelection = async (quality) => {
    setQualityOptionsVisible(false);
    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      // Simulate API call to get download URL
      const downloadUrl = `https://example.com/download/${videoId}?quality=${quality}`;
      
      // Generate a file name using the video title
      const sanitizedTitle = videoTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const fileName = `${sanitizedTitle}_${quality}.mp3`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      // Download the file
      const downloadResumable = FileSystem.createDownloadResumable(
        downloadUrl,
        fileUri,
        {},
        (downloadProgress) => {
          const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
          setDownloadProgress(progress);
        }
      );

      const { uri } = await downloadResumable.downloadAsync();
      
      setIsDownloading(false);
      Alert.alert("Download Complete", `"${videoTitle}" (${quality}) has been saved to your phone.`);
      console.log('Saved to', uri);
    } catch (error) {
      console.error(error);
      setIsDownloading(false);
      Alert.alert("Download Failed", "There was an error downloading the MP3. Please try again.");
    }
  };

  // Helper function to parse ISO 8601 duration to seconds
  const parseDuration = (duration) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = match[1] ? parseInt(match[1].replace('H', '')) : 0;
    const minutes = match[2] ? parseInt(match[2].replace('M', '')) : 0;
    const seconds = match[3] ? parseInt(match[3].replace('S', '')) : 0;
    return hours * 3600 + minutes * 60 + seconds;
  };

  // Helper function to convert seconds into MM:SS format
  const formatDuration = (durationInSeconds) => {
    if (isNaN(durationInSeconds) || durationInSeconds === null) {
      return '00:00';
    }
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = durationInSeconds % 60;
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(seconds).padStart(2, '0');
    return `${paddedMinutes}:${paddedSeconds}`;
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#56ab2f', '#a8e063']} style={styles.gradientContainer}>
        <View style={styles.videoPlaceholderContainer}>
          <View style={styles.videoPlaceholder}>
            <Text style={styles.videoPlaceholderText}>Video Thumbnail</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Title</Text>
            <Text style={styles.infoValue}>{videoTitle}</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Artist</Text>
            <Text style={styles.infoValue}>{artist}</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Published Date</Text>
            <Text style={styles.infoValue}>{publishedDate}</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Duration</Text>
            <Text style={styles.infoValue}>Duration: {duration}</Text>
          </View>
        </View>
      </LinearGradient>

      <TouchableOpacity style={styles.downloadButton} onPress={handleDownloadPress}>
        <LinearGradient
          colors={['#96c93d', '#00b09b']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.downloadButtonGradient}
        >
          <Text style={styles.downloadButtonText}>Download MP3</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Modal for conversion progress */}
      <Modal visible={isConverting} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Converting to MP3...</Text>
            <ProgressBarAndroid styleAttr="Horizontal" color="#00b09b" progress={conversionProgress} />
          </View>
        </View>
      </Modal>

      {/* Modal for MP3 quality selection */}
      <Modal visible={qualityOptionsVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Select MP3 Quality:</Text>
            <TouchableOpacity style={styles.qualityOption} onPress={() => handleQualitySelection('128kbps')}>
              <Text style={styles.qualityText}>128kbps</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.qualityOption} onPress={() => handleQualitySelection('256kbps')}>
              <Text style={styles.qualityText}>256kbps</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.qualityOption} onPress={() => handleQualitySelection('320kbps')}>
              <Text style={styles.qualityText}>320kbps</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for download progress */}
      <Modal visible={isDownloading} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Downloading MP3...</Text>
            <ProgressBarAndroid styleAttr="Horizontal" color="#96c93d" progress={downloadProgress} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
  },
  gradientContainer: {
    padding: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  videoPlaceholderContainer: {
    alignItems: 'center',
    marginBottom: 60,
    marginTop: 60,
  },
  videoPlaceholder: {
    width: 350,
    height: 300,
    backgroundColor: '#ccc',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholderText: {
    fontSize: 18,
    color: '#333',
  },
  card: {
    backgroundColor: '#444',
    borderRadius: 10,
    padding: 15,
    marginVertical: 0,
    width: '90%',
    alignSelf: 'center',
  },
  infoContainer: {
    marginBottom: 0,
  },
  infoText: {
    fontSize: 18,
    color: '#ccc',
  },
  infoValue: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  downloadButton: {
    alignSelf: 'center',
    marginTop: 20,
    width: 150,
    height: 50,
    borderRadius: 25,
  },
  downloadButtonGradient: {
    flex: 1,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  qualityOption: {
    backgroundColor: '#96c93d',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  qualityText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default VideoInfoScreen;