// FormatSelectionScreen.js
import React from 'react';
import { View, Text, Button } from 'react-native';

const FormatSelectionScreen = ({ route }) => {
  const { link } = route.params;

  const handleDownload = (format) => {
    // Logic for downloading the video in the selected format
    console.log(`Downloading ${link} as ${format}`);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Choose Format:</Text>
      <Button title="MP4" onPress={() => handleDownload('mp4')} />
      <Button title="MP3" onPress={() => handleDownload('mp3')} />
    </View>
  );
};

export default FormatSelectionScreen;
