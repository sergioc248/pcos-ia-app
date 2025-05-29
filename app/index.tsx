import { Link } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PCOS_IMAGE_URL =
  "https://ferticity.com/wp-content/uploads/2025/01/pcos_symtoms3-webp.webp";

const WelcomeScreen = () => {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#FDFCF8" }}
      contentContainerStyle={{
        paddingTop: insets.top + 20,
        paddingBottom: insets.bottom + 20,
      }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Diagnóstico de PCOS</Text>

        <Image
          source={{ uri: PCOS_IMAGE_URL }}
          style={styles.image}
          resizeMode="contain"
        />

        <View style={styles.introTextContainer}>
          <Text style={styles.introText}>
            El Síndrome de Ovarios Poliquísticos (PCOS) es una de las
            condiciones endocrinas más comunes en mujeres en edad reproductiva.
            A menudo, su diagnóstico representa un desafío, y muchas mujeres
            pueden pasar años sin un diagnóstico correcto debido a que sus
            síntomas se confunden con otras afecciones.
          </Text>
          <Text style={styles.introText}>
            Esta herramienta utiliza un modelo de Inteligencia Artificial para
            estimar la posibilidad de PCOS basándose en datos clínicos básicos
            como edad, índice de masa corporal (BMI), irregularidad menstrual,
            niveles de testosterona y el recuento de folículos antrales.
          </Text>
          <Text style={[styles.introText, styles.boldText]}>
            Objetivo: Ofrecer una alerta temprana que motive la búsqueda de
            estudios médicos más detallados. No reemplaza la consulta médica
            profesional, pero puede ser una pista importante para que más
            mujeres encuentren respuestas y accedan a un cuidado informado y
            oportuno.
          </Text>
        </View>

        <Link href="/diagnosis" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Iniciar Diagnóstico</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 25,
    backgroundColor: "#FDFCF8",
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#1ABC9C",
    textAlign: "center",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 30,
    borderRadius: 15,
  },
  introTextContainer: {
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  introText: {
    fontSize: 16,
    color: "#4A4A4A",
    textAlign: "justify",
    marginBottom: 15,
    lineHeight: 24,
  },
  boldText: {
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#1ABC9C",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default WelcomeScreen;
