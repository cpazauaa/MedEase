import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Button, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    const question = input;
    setInput('');

    // Add user message and assistant placeholder
    setMessages((prev) => [...prev, { role: 'user', content: question }, { role: 'assistant', content: '' }]);
    const assistantIndex = messages.length;

    try {
      const response = await fetch('https://medease-agent-29640847701.us-east1.run.app/agent/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, user_id: 'demo-user', session_id: 'demo-session' }),
      });

      const text = await response.text(); // React Native-compatible
      const lines = text.split('\n').filter(Boolean);

      for (const line of lines) {
        try {
          const event = JSON.parse(line);

          const parts = event?.content?.parts || [];
          let combinedText = '';

          for (const part of parts) {
            if (part.text) combinedText += part.text;
          }

          if (combinedText) {
            // Optional typing effect
            let i = 0;
            const interval = setInterval(() => {
              if (i < combinedText.length) {
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[assistantIndex] = {
                    ...updated[assistantIndex],
                    content: (updated[assistantIndex].content || '') + combinedText[i],
                  };
                  return updated;
                });
                i++;
              } else {
                clearInterval(interval);
              }
            }, 20);
          }
        } catch (err) {
          console.warn('Failed to parse line', line, err);
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => {
        const updated = [...prev];
        updated[assistantIndex] = { role: 'assistant', content: '⚠️ Failed to fetch response' };
        return updated;
      });
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#a08787ff', dark: '#ffffffff' }}
      headerImage={<Image source={require('@/assets/images/chatbot.png')} style={styles.meLogo} />}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
          Agent Chat
        </ThemedText>
      </ThemedView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.chatContainer}
      >
        <ScrollView style={styles.messagesContainer} contentContainerStyle={{ paddingBottom: 16 }}>
          {messages.map((msg, index) => (
            <ThemedView
              key={index}
              style={[
                styles.messageBubble,
                msg.role === 'user' ? styles.userBubble : styles.assistantBubble,
              ]}
            >
              <ThemedText
                style={{
                  fontFamily: Fonts.rounded,
                  color: msg.role === 'user' ? '#fff' : '#000',
                }}
              >
                {msg.content}
              </ThemedText>
            </ThemedView>
          ))}
        </ScrollView>

        <ThemedView style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={input}
            onChangeText={setInput}
          />
          <Button title="Send" onPress={handleSend} />
        </ThemedView>
      </KeyboardAvoidingView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  chatContainer: {
    flex: 1,
    padding: 16,
  },
  messagesContainer: {
    flexGrow: 1,
    marginBottom: 12,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
    maxWidth: '75%',
  },
  userBubble: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
  },
  assistantBubble: {
    backgroundColor: '#E5E5EA',
    alignSelf: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
  },
  meLogo: {
    height: 70,
    width: 70,
    bottom: 0,
    left: 30,
    position: 'absolute',
  },
});
