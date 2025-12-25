import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import Header from '../../../layout/Header';
import { useTheme } from "@react-navigation/native";

const SwitchAccountLogin = ({ navigation }: any) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const [tab, setTab] = useState<"phone" | "email">("phone");
  const [value, setValue] = useState("");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.card }}>
     {/* ✅ Add Header with Back Button */}
      <Header title="Switch Account" onBack={() => navigation.goBack()} />
      {/* Profile Icon */}
      <View
        style={{
          alignItems: "center",
          marginTop: 50,
        }}
      >
        <View
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            borderWidth: 2,
            borderColor: colors.text,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 50, color: colors.text }}>👤</Text>
        </View>
      </View>

      {/* Tabs */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginTop: 40,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <TouchableOpacity
          onPress={() => setTab("phone")}
          style={{
            flex: 1,
            alignItems: "center",
            paddingVertical: 10,
            borderBottomWidth: 2,
            borderBottomColor: tab === "phone" ? colors.primary : "transparent",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: tab === "phone" ? colors.primary : colors.text,
            }}
          >
            PHONE
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setTab("email")}
          style={{
            flex: 1,
            alignItems: "center",
            paddingVertical: 10,
            borderBottomWidth: 2,
            borderBottomColor: tab === "email" ? colors.primary : "transparent",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: tab === "email" ? colors.primary : colors.text,
            }}
          >
            EMAIL
          </Text>
        </TouchableOpacity>
      </View>

      {/* Input */}
      <View style={{ marginHorizontal: 20, marginTop: 30 }}>
        <TextInput
          placeholder={tab === "phone" ? "Phone" : "Email"}
          placeholderTextColor={colors.text}
          keyboardType={tab === "phone" ? "phone-pad" : "email-address"}
          value={value}
          onChangeText={setValue}
          style={{
            backgroundColor: colors.background,
            borderRadius: 10,
            paddingHorizontal: 15,
            paddingVertical: 12,
            fontSize: 16,
            color: colors.text,
          }}
        />
      </View>

      {/* Info Text (only for phone) */}
      {tab === "phone" && (
        <Text
          style={{
            textAlign: "center",
            color: colors.text,
            fontSize: 13,
            marginTop: 15,
            marginHorizontal: 40,
          }}
        >
          You may receive SMS notifications from us for security and login
          purposes.
        </Text>
      )}

      {/* Next Button */}
      <TouchableOpacity
        style={{
          backgroundColor: colors.primary,
          marginHorizontal: 20,
          paddingVertical: 14,
          borderRadius: 10,
          alignItems: "center",
          marginTop: 30,
        }}
        onPress={() => alert("Proceeding...")}
      >
        <Text style={{ fontSize: 16, fontWeight: "600", color: "#fff" }}>
          Next
        </Text>
      </TouchableOpacity>

      {/* Footer */}
      <TouchableOpacity
        style={{ marginTop: "auto", marginBottom: 20 }}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={{ textAlign: "center", color: colors.text }}>
          Already have an account?{" "}
          <Text style={{ fontWeight: "600", color: colors.primary }}>
            Log in.
          </Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SwitchAccountLogin;
