import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Button, KeyboardAvoidingView, Platform, StyleSheet, TextInput } from 'react-native';

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

    // push user message
    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    const question = input;
    setInput('');

    // create empty assistant placeholder
    const assistantMessage: Message = { role: 'assistant', content: '' };
    setMessages((prev) => [...prev, assistantMessage]);
    const assistantIndex = messages.length + 1;

    try {
      const response = await fetch(
        'https://medease-agent-29640847701.us-east1.run.app/agent/respond',
        {
          method: 'POST',
          body: JSON.stringify({
            question: question,
            user_id: "demo-user",   // replace with real user id if available
            session_id: "demo-session", // replace with real session id if available
          }),
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      if (!reader) return;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // keep incomplete line

        for (const line of lines) {
          if (line.trim()) {
            try {
              const event = JSON.parse(line);

              // update assistant message as new chunks arrive
              setMessages((prev) => {
                const updated = [...prev];
                updated[assistantIndex] = {
                  role: 'assistant',
                  content: updated[assistantIndex].content + (event.text || ''),
                };
                return updated;
              });
            } catch (err) {
              console.warn('Failed to parse line', line, err);
            }
          }
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
      // show fallback error
      setMessages((prev) => {
        const updated = [...prev];
        updated[assistantIndex] = {
          role: 'assistant',
          content: '⚠️ Failed to fetch response',
        };
        return updated;
      });
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#a08787ff', dark: '#ffffffff' }}
      headerImage={
        <Image
          source={require('@/assets/images/chatbot.png')}
          style={styles.meLogo}
        />
      }
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
        <ThemedView style={styles.messagesContainer}>
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
        </ThemedView>

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
    height: 60,
    width: 60,
    bottom: 0,
    left: 30,
    position: 'absolute',
  },
});