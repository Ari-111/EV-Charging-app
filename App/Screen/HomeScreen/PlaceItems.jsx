// PlaceItems.jsx
import { View, Text, Image, Pressable, Platform, Linking, Alert, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "../../Utils/Colors";
import GlobalApi from "../../Utils/GlobalApi";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { app, db } from "../../Utils/FirebaseConfig";
import { useUser } from "@clerk/clerk-expo";

export default function PlaceItems({ place, isFav, markedFav, onSelect }) {
  const [photoUrl, setPhotoUrl] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    if (place.photos && place.photos.length > 0) {
      const photoReference = place.photos[0].photo_reference;
      const photoWidth = 400;
      const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${photoWidth}&photoreference=${photoReference}&key=${GlobalApi.API_KEY}`;
      setPhotoUrl(url);
    }
  }, [place]);

  const onSetFav = async () => {
    await setDoc(doc(db, "ev-fav-place", place.place_id.toString()), {
      place: place,
      email: user?.primaryEmailAddress?.emailAddress,
    });
    markedFav();
    Alert.alert("Success", "Fav Added!");
  };

  const onRemoveFav = async () => {
    await deleteDoc(doc(db, "ev-fav-place", place.place_id));
    Alert.alert("Success", "Removed from Fav!");
  };

  const onDirectionClick = () => {
    const url = Platform.select({
      ios: `maps:${place?.location?.latitude},${place?.location?.longitude}?q=${place?.vicinity}`,
      android: `geo:${place?.location?.latitude},${place?.location?.longitude}?q=${place?.vicinity}`,
    });
    Linking.openURL(url);
  };

  return (
    <View
      style={{
        backgroundColor: Colors.CREAM,
        margin: 10,
        borderRadius: 15,
        width: Dimensions.get("screen").width * 0.8,
      }}
    >
      <LinearGradient colors={["transparent", "#ffffff"]}>
        {/* Favorite Icon */}
        {!isFav ? (
          <Pressable style={{ position: "absolute", right: 0, margin: 5 }} onPress={onSetFav}>
            <Ionicons name="heart-outline" size={30} color="white" />
          </Pressable>
        ) : (
          <Pressable style={{ position: "absolute", right: 0, margin: 5 }} onPress={onRemoveFav}>
            <Ionicons name="heart-sharp" size={30} color="red" />
          </Pressable>
        )}

        {/* Place Image */}
        {photoUrl && place.rating !== null ? (
          <Image
            source={{ uri: photoUrl }}
            style={{ width: "100%", borderRadius: 10, height: 160, zIndex: -1 }}
          />
        ) : (
          <Image
            source={require("./../../../assets/images/logo1.png")}
            style={{ width: "100%", borderRadius: 10, height: 160 }}
          />
        )}

        {/* Info Section */}
        <View style={{ padding: 5 }}>
          <Text style={{ fontSize: 18, fontWeight: "600" }}>{place.name}</Text>
          <Text style={{ color: Colors.GRAY }}>{place.vicinity}</Text>

          {/* Rating & Availability */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
            <View>
              <Text style={{ fontWeight: "600", fontSize: 15 }}>Rating</Text>
              <Text style={{ color: Colors.GRAY, fontSize: 18 }}>{place.rating}</Text>
            </View>
            <View>
              <Text style={{ fontWeight: "600", fontSize: 15 }}>Availability</Text>
              <Text
                style={{
                  color:
                    place.availability === "Available"
                      ? Colors.PRIMARY
                      : place.availability === "Busy"
                      ? "#FFA500"
                      : "#FF6B6B",
                  fontSize: 14,
                  fontWeight: "500",
                }}
              >
                {place.availability || "Unknown"}
              </Text>
            </View>
          </View>

          {/* Pricing & Wait Time */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
            <View>
              <Text style={{ fontWeight: "600", fontSize: 15 }}>Price</Text>
              <Text style={{ color: Colors.PRIMARY, fontSize: 16, fontWeight: "600" }}>
                {place.price || "₹—"}
              </Text>
            </View>
            <View>
              <Text style={{ fontWeight: "600", fontSize: 15 }}>Wait Time</Text>
              <Text style={{ color: Colors.GRAY, fontSize: 14 }}>{place.waitTime || "0 min"}</Text>
            </View>
          </View>

          {/* Charging & Connectors */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "600", fontSize: 15 }}>Charging Speed</Text>
              <Text
                style={{
                  color:
                    place.chargingSpeed === "Rapid"
                      ? "#4CAF50"
                      : place.chargingSpeed === "Fast"
                      ? "#FF9800"
                      : "#757575",
                  fontSize: 14,
                  fontWeight: "500",
                }}
              >
                {place.chargingSpeed || "Unknown"}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "600", fontSize: 15 }}>Connectors</Text>
              <Text style={{ color: Colors.GRAY, fontSize: 12, flexWrap: "wrap" }}>
                {place.connectorTypes ? place.connectorTypes.join(", ") : "Unknown"}
              </Text>
            </View>
          </View>

          {/* Amenities */}
          {place.amenities?.length > 0 && (
            <View style={{ marginVertical: 5 }}>
              <Text style={{ fontWeight: "600", fontSize: 15, marginBottom: 3 }}>Amenities</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {place.amenities.map((amenity, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: Colors.PRIMARY,
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 12,
                      margin: 2,
                    }}
                  >
                    <Text style={{ color: "white", fontSize: 10, fontWeight: "500" }}>{amenity}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Direction & Select Buttons */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 5 }}>
            <Pressable
              onPress={onDirectionClick}
              style={{
                padding: 10,
                backgroundColor: Colors.PRIMARY,
                borderRadius: 6,
                paddingHorizontal: 10,
              }}
            >
              <FontAwesome5 name="location-arrow" size={25} color="white" />
            </Pressable>

            <Pressable
              onPress={() => onSelect(place)}
              style={{
                padding: 10,
                backgroundColor: "#007AFF",
                borderRadius: 6,
                paddingHorizontal: 15,
              }}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>Select</Text>
            </Pressable>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
