import React, {useEffect, useRef, useState} from 'react';
import {Animated, StyleSheet} from 'react-native';

enum SplashState {
  FadeInImage = 'Fade in image',
  FadeOut = 'Fade out',
  Hidden = 'Hidden',
}

function SplashScreenProvider({
  children,
  isAppReady,
}: {
  children: React.ReactNode;
  isAppReady: boolean;
}) {
  return (
    <>
      {isAppReady && children}
      <Splash isAppReady={isAppReady} />
    </>
  );
}

export default SplashScreenProvider;

const Splash = ({isAppReady}: {isAppReady: boolean}) => {
  const containerOpacity = useRef(new Animated.Value(1)).current;

  const [state, setState] = useState<SplashState>();

  useEffect(() => {
    if (isAppReady) {
      setState(SplashState.FadeOut);
    }
  }, [isAppReady]);

  useEffect(() => {
    if (state === SplashState.FadeOut) {
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 1000,
        delay: 500,
        useNativeDriver: true,
      }).start(() => {
        setState(SplashState.Hidden);
      });
    }
  }, [containerOpacity, state]);

  if (state === SplashState.Hidden) {
    return null;
  }

  return (
    <Animated.View
      collapsable={false}
      style={[style.container, {opacity: containerOpacity}]}>
      <Animated.Image
        source={require('../static/images/icon.png')}
        fadeDuration={0}
        onLoad={() => {
          setState(SplashState.FadeInImage);
        }}
        style={[style.image]}
        resizeMode="contain"
      />
    </Animated.View>
  );
};

const style = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
});
