import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Pressable,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Image,
    Animated,
    Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../services/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const AskAnythingScreen = () => {
    const { colors, isDarkMode } = useTheme();
    const insets = useSafeAreaInsets();
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        {
            id: '1',
            type: 'ai',
            text: 'Namaste! I am your Heritage AI guide. Ask me anything about Indian history, architecture, or traditions.',
            timestamp: new Date()
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const flatListRef = useRef(null);

    const sendMessage = () => {
        if (input.trim() === '') return;

        const userMsg = {
            id: Date.now().toString(),
            type: 'user',
            text: input.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Mock AI Response
        setTimeout(() => {
            const aiMsg = {
                id: (Date.now() + 1).toString(),
                type: 'ai',
                text: getMockResponse(userMsg.text),
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1500);
    };

    const getMockResponse = (text) => {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('temple')) return "Indian temples are masterpieces of rock-cut architecture. The Shore Temple in Mahabalipuram, built in the 8th century, is one of the oldest structural stone temples in South India.";
        if (lowerText.includes('dance')) return "India has 8 classical dance forms recognized by Sangeet Natak Akademi. Bharatanatyam from Tamil Nadu is considered one of the oldest, dating back over 2,000 years.";
        if (lowerText.includes('food') || lowerText.includes('cuisine')) return "Indian cuisine is shaped by thousands of years of cultural exchange. Did you know that the word 'Curry' likely originated from the Tamil word 'Kari', meaning sauce?";
        return "That's a fascinating topic! India's heritage is incredibly deep. This specifically reminds me of the cultural evolution during the Deccan sultanates. Would you like to know more about that era?";
    };

    const renderMessage = ({ item }) => (
        <View style={[
            styles.messageWrapper,
            item.type === 'user' ? styles.userRow : styles.aiRow
        ]}>
            {item.type === 'ai' && (
                <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                    <Ionicons name="sparkles" size={14} color="#fff" />
                </View>
            )}
            <View style={[
                styles.messageBubble,
                item.type === 'user'
                    ? [styles.userBubble, { backgroundColor: colors.primary }]
                    : [styles.aiBubble, { backgroundColor: isDarkMode ? '#1e1e1e' : '#f0f0f0' }]
            ]}>
                <Text style={[
                    styles.messageText,
                    { color: item.type === 'user' ? '#fff' : colors.text }
                ]}>
                    {item.text}
                </Text>
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={[styles.welcome, { color: colors.primary }]}>Heritage Pulse AI</Text>
                    <Text style={[styles.subtitle, { color: colors.secondaryText }]}>Your personalized cultural guide</Text>
                </View>
                <Pressable style={[styles.iconButton, { borderColor: colors.border }]}>
                    <Ionicons name="refresh-outline" size={20} color={colors.text} />
                </Pressable>
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
                ListFooterComponent={isTyping ? (
                    <View style={styles.typingContainer}>
                        <Text style={[styles.typingText, { color: colors.secondaryText }]}>AI is thinking...</Text>
                    </View>
                ) : null}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View style={[styles.inputContainer, { borderTopColor: colors.border, paddingBottom: insets.bottom + 10 }]}>
                    <View style={[styles.inputWrapper, { backgroundColor: isDarkMode ? '#1e1e1e' : '#f5f5f5' }]}>
                        <TextInput
                            style={[styles.input, { color: colors.text }]}
                            placeholder="Ask about Indian heritage..."
                            placeholderTextColor={colors.secondaryText}
                            value={input}
                            onChangeText={setInput}
                            multiline
                        />
                        <Pressable
                            onPress={sendMessage}
                            style={[styles.sendButton, { backgroundColor: colors.primary, opacity: input.trim() ? 1 : 0.5 }]}
                        >
                            <Ionicons name="send" size={18} color="#fff" />
                        </Pressable>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgba(0,0,0,0.05)'
    },
    welcome: { fontSize: 20, fontWeight: '800' },
    subtitle: { fontSize: 13, fontWeight: '500' },
    iconButton: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },

    listContent: { padding: 20, paddingBottom: 40 },
    messageWrapper: { marginBottom: 20, maxWidth: '85%' },
    userRow: { alignSelf: 'flex-end' },
    aiRow: { alignSelf: 'flex-start', flexDirection: 'row', gap: 10 },

    avatar: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
    messageBubble: { padding: 16, borderRadius: 20 },
    userBubble: { borderBottomRightRadius: 4 },
    aiBubble: { borderBottomLeftRadius: 4 },
    messageText: { fontSize: 15, lineHeight: 22, fontWeight: '500' },

    typingContainer: { marginLeft: 38, marginBottom: 20 },
    typingText: { fontSize: 12, fontStyle: 'italic' },

    inputContainer: { paddingHorizontal: 20, paddingTop: 15 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', padding: 8, borderRadius: 30, gap: 10 },
    input: { flex: 1, paddingHorizontal: 15, paddingVertical: 10, fontSize: 15, maxHeight: 100 },
    sendButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }
});

export default AskAnythingScreen;
