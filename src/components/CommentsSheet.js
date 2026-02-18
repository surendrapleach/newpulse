import React, { useEffect, useCallback, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Image,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    runOnJS,
    interpolate,
    Extrapolate,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { COLORS } from '../utils/theme';
import { hp, wp, rf } from '../utils/responsive';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const INITIAL_SNAP = -SCREEN_HEIGHT * 0.6;
const FULL_SNAP = -SCREEN_HEIGHT * 0.92;
const CLOSE_THRESHOLD = -SCREEN_HEIGHT * 0.25;
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 40;

const DUMMY_COMMENTS = [
    { id: '1', user: 'heritage_lover', avatar: 'https://i.pravatar.cc/150?img=1', text: 'This is absolutely fascinating! 😍', time: '2m', likes: 12 },
    { id: '2', user: 'travel_diaries', avatar: 'https://i.pravatar.cc/150?img=5', text: 'I visited this place last year, it was magical. ✨', time: '15m', likes: 8 },
    { id: '3', user: 'history_buff', avatar: 'https://i.pravatar.cc/150?img=8', text: 'Does anyone know the exact location?', time: '1h', likes: 3 },
];

const CommentsSheet = ({ visible, onClose }) => {
    const [comments, setComments] = useState(DUMMY_COMMENTS);
    const [newComment, setNewComment] = useState('');
    const [showToast, setShowToast] = useState(false);

    const translateY = useSharedValue(SCREEN_HEIGHT);
    const context = useSharedValue({ y: 0 });
    const toastOpacity = useSharedValue(0);

    const scrollTo = useCallback((destination) => {
        'worklet';
        translateY.value = withSpring(destination, {
            damping: 35,
            stiffness: 280,
        });
    }, []);

    useEffect(() => {
        if (visible) {
            scrollTo(INITIAL_SNAP);
        } else {
            scrollTo(0);
        }
    }, [visible]);

    const gesture = Gesture.Pan()
        .onStart(() => {
            context.value = { y: translateY.value };
        })
        .onUpdate((event) => {
            translateY.value = event.translationY + context.value.y;
            if (translateY.value < MAX_TRANSLATE_Y) {
                translateY.value = MAX_TRANSLATE_Y;
            }
        })
        .onEnd(() => {
            if (translateY.value > CLOSE_THRESHOLD) {
                translateY.value = withTiming(0, { duration: 250 });
                runOnJS(onClose)();
            } else if (translateY.value < -SCREEN_HEIGHT * 0.75) {
                scrollTo(FULL_SNAP);
            } else {
                scrollTo(INITIAL_SNAP);
            }
        });

    const sheetStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const backdropStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            translateY.value,
            [0, INITIAL_SNAP],
            [0, 1],
            Extrapolate.CLAMP
        ),
    }));

    const toastStyle = useAnimatedStyle(() => ({
        opacity: toastOpacity.value,
        transform: [
            {
                translateY: interpolate(
                    toastOpacity.value,
                    [0, 1],
                    [20, 0],
                    Extrapolate.CLAMP
                ),
            },
        ],
    }));

    const showToastMessage = () => {
        toastOpacity.value = withTiming(1, { duration: 250 });

        setTimeout(() => {
            toastOpacity.value = withTiming(0, { duration: 250 });
        }, 1800);
    };

    const handlePost = () => {
        if (!newComment.trim()) return;

        const newCommentObj = {
            id: Date.now().toString(),
            user: 'you',
            avatar: 'https://i.pravatar.cc/150?img=60',
            text: newComment,
            time: 'Just now',
            likes: 0,
        };

        setComments([newCommentObj, ...comments]);
        setNewComment('');
        showToastMessage();
    };

    const renderComment = ({ item }) => (
        <View style={styles.commentItem}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.commentContent}>
                <Text style={styles.username}>
                    {item.user} <Text style={styles.time}>{item.time}</Text>
                </Text>
                <Text style={styles.commentText}>{item.text}</Text>
            </View>
            <View style={styles.likeContainer}>
                <Ionicons name="heart-outline" size={14} color={COLORS.secondaryText} />
                <Text style={styles.likeCount}>{item.likes}</Text>
            </View>
        </View>
    );

    if (!visible && translateY.value === 0) return null;

    return (
        <View style={styles.overlayContainer} pointerEvents="box-none">
            <Animated.View style={[styles.backdrop, backdropStyle]}>
                <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => {
                        scrollTo(0);
                        setTimeout(onClose, 200);
                    }}
                />
            </Animated.View>

            <GestureDetector gesture={gesture}>
                <Animated.View style={[styles.sheet, sheetStyle]}>

                    <View style={styles.handleContainer}>
                        <View style={styles.handle} />
                    </View>

                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Comments</Text>
                    </View>

                    <FlatList
                        data={comments}
                        renderItem={renderComment}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />

                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
                    >
                        <View style={styles.inputContainer}>
                            <Image
                                source={{ uri: 'https://i.pravatar.cc/150?img=60' }}
                                style={styles.myAvatar}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Add a comment..."
                                placeholderTextColor={COLORS.secondaryText}
                                value={newComment}
                                onChangeText={setNewComment}
                            />
                            <TouchableOpacity onPress={handlePost}>
                                <Text
                                    style={[
                                        styles.postBtn,
                                        { opacity: newComment.trim() ? 1 : 0.5 },
                                    ]}
                                >
                                    Post
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>

                    <Animated.View style={[styles.toast, toastStyle]}>
                        <Ionicons
                            name="checkmark-circle"
                            size={18}
                            color="#FFF"
                            style={{ marginRight: 6 }}
                        />
                        <Text style={styles.toastText}>Comment added</Text>
                    </Animated.View>

                </Animated.View>
            </GestureDetector>
        </View>
    );
};

const styles = StyleSheet.create({
    overlayContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        zIndex: 100,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    sheet: {
        backgroundColor: COLORS.cardBg,
        width: '100%',
        height: SCREEN_HEIGHT,
        position: 'absolute',
        top: SCREEN_HEIGHT,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingHorizontal: wp(4),
    },
    handleContainer: {
        alignItems: 'center',
        paddingVertical: hp(1.5),
    },
    handle: {
        width: wp(12),
        height: 4,
        backgroundColor: '#CCC',
        borderRadius: 2,
    },
    header: {
        alignItems: 'center',
        marginBottom: hp(1),
    },
    headerTitle: {
        fontSize: rf(16),
        fontWeight: '700',
        color: COLORS.text,
    },
    listContent: {
        paddingBottom: hp(15),
    },
    commentItem: {
        flexDirection: 'row',
        marginBottom: hp(2),
    },
    avatar: {
        width: wp(9),
        height: wp(9),
        borderRadius: wp(4.5),
        marginRight: wp(3),
    },
    commentContent: {
        flex: 1,
    },
    username: {
        fontSize: rf(13),
        fontWeight: '600',
        color: COLORS.text,
    },
    time: {
        fontSize: rf(12),
        color: COLORS.secondaryText,
    },
    commentText: {
        fontSize: rf(14),
        color: COLORS.text,
        marginTop: 3,
    },
    likeContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: wp(2),
    },
    likeCount: {
        fontSize: rf(10),
        color: COLORS.secondaryText,
        marginTop: 2,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: hp(1.2),
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        backgroundColor: COLORS.cardBg,
    },
    myAvatar: {
        width: wp(9),
        height: wp(9),
        borderRadius: wp(4.5),
        marginRight: wp(3),
    },
    input: {
        flex: 1,
        height: hp(5),
        borderRadius: 25,
        backgroundColor: COLORS.background,
        paddingHorizontal: wp(4),
        marginRight: wp(2),
        color: COLORS.text,
    },
    postBtn: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: rf(14),
    },
    toast: {
        position: 'absolute',
        bottom: hp(12),
        alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,0.85)',
        borderRadius: 25,
        paddingHorizontal: wp(5),
        paddingVertical: hp(1),
        flexDirection: 'row',
        alignItems: 'center',
    },
    toastText: {
        color: '#FFF',
        fontSize: rf(13),
        fontWeight: '600',
    },
});

export default CommentsSheet;
