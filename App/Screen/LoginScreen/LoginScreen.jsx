import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import  Colors  from './../../Utils/Colors'
import * as WebBrowser from "expo-web-browser";
import { useWarmUpBrowser } from '../../../hooks/warmUpBrowser';
import { useOAuth } from "@clerk/clerk-expo";


WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {

  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPress = async() =>{
    try {
      console.log("Starting OAuth flow...");
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow();

      console.log("OAuth response:", { createdSessionId, signIn, signUp });

      if (createdSessionId) {
        console.log("Setting active session:", createdSessionId);
        await setActive({ session: createdSessionId });
        console.log("Session activated successfully");
      } else {
        console.log("No session created, checking signIn/signUp");
        
        // Handle signUp completion if missing requirements
        if (signUp && signUp.status === "missing_requirements") {
          console.log("SignUp missing requirements, attempting to complete...");
          try {
            // Try to complete signup by making phone number optional
            const completeSignUp = await signUp.update({
              // Don't require phone number for OAuth users
            });
            
            if (completeSignUp.createdSessionId) {
              console.log("SignUp completed, setting session:", completeSignUp.createdSessionId);
              await setActive({ session: completeSignUp.createdSessionId });
            } else {
              // If phone is still required, we'll skip it and try to create session anyway
              console.log("Attempting to create session without phone number...");
              try {
                await signUp.create();
                if (signUp.createdSessionId) {
                  await setActive({ session: signUp.createdSessionId });
                }
              } catch (createError) {
                console.log("Create signup error:", createError);
                // If signup still fails, try signing in instead
                if (signIn) {
                  console.log("Trying signIn instead...");
                  await signIn.attemptFirstFactor({
                    strategy: "oauth_google"
                  });
                }
              }
            }
          } catch (updateError) {
            console.log("SignUp update error:", updateError);
          }
        }
        
        // Handle signIn
        if (signIn && signIn.status === "needs_identifier") {
          console.log("SignIn needs identifier, attempting first factor...");
          try {
            const result = await signIn.attemptFirstFactor({
              strategy: "oauth_google"
            });
            if (result.createdSessionId) {
              await setActive({ session: result.createdSessionId });
            }
          } catch (signInError) {
            console.log("SignIn error:", signInError);
          }
        }
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }


  return (
    <View style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 80
    }}>
      <Image source={require('./../../../assets/images/logo1.png')} 
      style={styles.logoImage}
      />
      <Image source={require('./../../../assets/images/ev-car-charging.png')} 
      style={styles.bgImage}
      />

      <View>
        <Text style={styles.heading}>Your Ultimate Ev Charging Station Finder</Text>
        <Text style={styles.desc}>Find EV charging stations near you, plan your trip and much more</Text>

        <TouchableOpacity 
         onPress={onPress}
        style={styles.button}>
          <Text style={{
            textAlign: 'center',
            fontFamily: 'System',
            color: Colors.WHITE,
            fontSize: 15,
          
          }}>Login with Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    logoImage: {
        width: 200,
        height: 50,
        objectFit: 'contain',
    },

    bgImage: {
      height: 200,
      width: '100%',
      marginTop: 20,
      objectFit: 'cover',
    },

    heading: {
      fontSize: 25,
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: 30,
    },

    desc: {
      fontSize: 15,
      textAlign: 'center',
      marginTop: 10,
      color: Colors.GRAY
    },

    button:{
      backgroundColor: Colors.PRIMARY,
      padding:16,
      display: 'flex',
      borderRadius: 99,
      marginTop: 60
    }
    
})