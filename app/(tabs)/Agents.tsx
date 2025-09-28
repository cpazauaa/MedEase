import { Image } from 'expo-image';
import React, { useState, useRef, useEffect } from 'react';
import { Button, KeyboardAvoidingView, Platform, StyleSheet, TextInput, ScrollView } from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';
import Constants from 'expo-constants';

const agentUrl = Constants.expoConfig?.extra?.agentUrl;

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    
    // Add user message
    const userMessage: Message = { role: 'user', content: input.trim() };
    const question = input.trim();
    setInput('');

    setMessages(prev => [...prev, userMessage]);

    const assistantMessageIndex = messages.length + 1;
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    // Start streaming
    await streamAssistantResponse(assistantMessageIndex, question);
    setIsLoading(false);
  };

  const streamAssistantResponse = async (assistantIndex: number, question: string) => {
    try {      
      const response = await fetch(
        agentUrl,
        {
          method: 'POST',
          body: JSON.stringify({
            question,
            user_id: 'demo-user',
            session_id: 'demo-session',
          }),
          headers: { 
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle as regular response (no streaming)
      const responseText = await response.text();
      const lines = responseText.split('\n');
      let fullContent = '';

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine) {
          const chunk = parseResponseLine(trimmedLine);
          if (chunk) {
            fullContent += chunk;
            updateMessageContent(assistantIndex, fullContent);
          }
        }
      }

      // If no structured content found, treat the whole response as the message
      if (!fullContent.trim()) {
        updateMessageContent(assistantIndex, responseText);
      }

    } catch (error) {
      console.error('Error fetching agent response:', error);
      setMessages(prev => {
        const updated = [...prev];
        if (updated[assistantIndex]) {
          updated[assistantIndex] = {
            role: 'assistant',
            content: 'Sorry, an error occured. Please try again!',
          };
        }
        return updated;
      });
    }
  };

  const parseResponseLine = (line: string): string => {
    try {
      const event = JSON.parse(line);      
      if (event.content?.parts && Array.isArray(event.content.parts)) {
        let extractedText = '';
        
        // Go through each part and extract text that is NOT a thought
        for (const part of event.content.parts) {
          if (part.text && !part.thought) {
            extractedText += part.text;
          }
        }
        
        return extractedText;
      }
      return '';
    } catch (parseError) {
      console.warn('Failed to parse line as JSON:', line, parseError);
    }
  };

  const updateMessageContent = (assistantIndex: number, content: string) => {
    setMessages(prev => {
      const updated = [...prev];
      if (updated[assistantIndex]) {
        updated[assistantIndex] = {
          ...updated[assistantIndex],
          content,
        };
      }
      return updated;
    });
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
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
        >
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
                {msg.content || (msg.role === 'assistant' && isLoading ? 'Thinking...' : '')}
              </ThemedText>
            </ThemedView>
          ))}
        </ScrollView>

        <ThemedView style={styles.inputContainer}>
          <TextInput
            style={[styles.input, isLoading && styles.inputDisabled]}
            placeholder="Type a message..."
            value={input}
            onChangeText={setInput}
            editable={!isLoading}
            multiline
            maxLength={1000}
          />
          <Button 
            title={isLoading ? "..." : "Send"} 
            onPress={handleSend}
            disabled={isLoading || !input.trim()}
          />
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
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    maxHeight: 100,
  },
  inputDisabled: {
    opacity: 0.6,
  },
  meLogo: {
    height: 60,
    width: 60,
    bottom: 0,
    left: 30,
    position: 'absolute',
  },
});