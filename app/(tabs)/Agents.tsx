import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';



export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#a08787ff', dark: '#ffffffff' }}
                  headerImage={
                    <Image
                      source={require('@/assets/images/chatbot.png')}
                      style={styles.meLogo}
                    />
                  }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}>
          Agent Chat
        </ThemedText>
      </ThemedView>
      
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#e70303ff',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
meLogo: {
    height: 60,
    width: 60,
    bottom: 0,
    left: 30,
    position: 'absolute',
  },
});
