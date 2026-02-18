import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useNavigation, SCREENS } from '../../services/NavigationContext';

const SplashScreen = () => {
    const { navigate } = useNavigation();
    const videoRef = useRef(null);

    return (
        <View style={styles.container}>
            <Video
                ref={videoRef}
                style={StyleSheet.absoluteFill}
                source={require('../../../assets/splash animation/H pulse 2 (1).mp4')}
                resizeMode={ResizeMode.COVER}
                shouldPlay
                isLooping={false}
                onPlaybackStatusUpdate={(status) => {
                    if (status.didJustFinish) {
                        navigate(SCREENS.REGISTER);
                    }
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffffff', // Optional: black background before video loads
    },
});

export default SplashScreen;
