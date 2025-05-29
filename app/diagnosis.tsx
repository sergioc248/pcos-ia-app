import { Stack } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Default server IP
const DEFAULT_SERVER_IP = "54.85.38.49:8000";

const NO_PCOS_IMAGE_URL =
  "https://images.pexels.com/photos/3076509/pexels-photo-3076509.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
const PCOS_IMAGE_URL =
  "https://images.pexels.com/photos/4021779/pexels-photo-4021779.jpeg";

type FormData = {
  Age: string;
  BMI: string;
  Menstrual_Irregularity: boolean;
  Testosterone_Level: string;
  Antral_Follicle_Count: string;
};

// Interface for the expected prediction response
interface PredictionResponse {
  prediction: "PCOS" | "No PCOS";
}

export default function DiagnosisScreen() {
  const insets = useSafeAreaInsets();
  const [serverIp, setServerIp] = useState(DEFAULT_SERVER_IP);
  const [formData, setFormData] = useState<FormData>({
    Age: "30",
    BMI: "25.0",
    Menstrual_Irregularity: false,
    Testosterone_Level: "50.0",
    Antral_Follicle_Count: "15",
  });
  const [isLoading, setIsLoading] = useState(false);
  // Changed predictionResult to match the string type from server
  const [predictionResult, setPredictionResult] =
    useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (name: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateInputs = (): boolean => {
    const { Age, BMI, Testosterone_Level, Antral_Follicle_Count } = formData;
    const numAge = Number.parseInt(Age, 10);
    const numBmi = Number.parseFloat(BMI);
    const numTestosterone = Number.parseFloat(Testosterone_Level);
    const numFollicles = Number.parseInt(Antral_Follicle_Count, 10);

    if (Number.isNaN(numAge) || numAge < 18 || numAge > 50) {
      Alert.alert(
        "Entrada Inválida",
        "Por favor, ingrese una edad válida (18-50)."
      );
      return false;
    }
    if (Number.isNaN(numBmi) || numBmi < 18.0 || numBmi > 40.0) {
      Alert.alert(
        "Entrada Inválida",
        "Por favor, ingrese un BMI válido (18.0-40.0)."
      );
      return false;
    }
    if (
      Number.isNaN(numTestosterone) ||
      numTestosterone < 20.0 ||
      numTestosterone > 100.0
    ) {
      Alert.alert(
        "Entrada Inválida",
        "Por favor, ingrese un nivel de testosterona válido (20.0-100.0)."
      );
      return false;
    }
    if (Number.isNaN(numFollicles) || numFollicles < 5 || numFollicles > 30) {
      Alert.alert(
        "Entrada Inválida",
        "Por favor, ingrese un recuento de folículos válido (5-30)."
      );
      return false;
    }
    if (!serverIp.trim()) {
      Alert.alert("Configuración", "Por favor, ingrese la IP del servidor.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setPredictionResult(null);

    const payload = {
      age: Number.parseInt(formData.Age, 10),
      bmi: Number.parseFloat(formData.BMI),
      menstrual_irregularity: formData.Menstrual_Irregularity ? 1 : 0,
      testosterone_level: Number.parseFloat(formData.Testosterone_Level),
      antral_follicle_count: Number.parseInt(
        formData.Antral_Follicle_Count,
        10
      ),
    };

    try {
      const response = await fetch(`http://${serverIp}/diagnose`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Explicitly type the expected success and a potential error structure
      type ErrorResponse = { [key: string]: string }; // Assuming error messages are strings
      const result: PredictionResponse | ErrorResponse = await response.json();

      if (!response.ok) {
        let errorMessageFromServer = `Error del servidor: ${response.status}`;
        // Type guard to ensure result is an ErrorResponse like object before iterating keys
        if (result && typeof result === "object" && !("prediction" in result)) {
          const errorResult = result as ErrorResponse;
          const errorKey = Object.keys(errorResult).find(
            (key) =>
              typeof errorResult[key] === "string" &&
              (key.toLowerCase().includes("error") ||
                key.toLowerCase().includes("message") ||
                key.toLowerCase().includes("detail"))
          );
          if (errorKey) {
            errorMessageFromServer = errorResult[errorKey];
          }
        }
        throw new Error(errorMessageFromServer);
      }

      // If response is ok, result should be PredictionResponse
      setPredictionResult(result as PredictionResponse);
    } catch (e: unknown) {
      console.error("Error fetching prediction:", e);
      const errorMessage =
        e instanceof Error
          ? e.message
          : "Ocurrió un error al obtener el diagnóstico. Por favor, intente de nuevo.";
      setError(errorMessage);
      Alert.alert("Error de Predicción", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      style={[styles.outerContainer, { backgroundColor: "#FDFCF8" }]}
      contentContainerStyle={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
      keyboardShouldPersistTaps="handled"
    >
      <Stack.Screen options={{ title: "Formulario de Diagnóstico" }} />
      <View style={styles.container}>
        <Text style={styles.pageTitle}>Ingrese sus datos</Text>

        {/* Server IP Input */}
        {!predictionResult && !isLoading && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>IP del Servidor (IP:Puerto)</Text>
            <TextInput
              style={styles.input}
              value={serverIp}
              onChangeText={setServerIp}
              placeholder="Ej: 192.168.1.100:8000"
              autoCapitalize="none"
              keyboardType="url"
            />
          </View>
        )}

        {!predictionResult && !isLoading && (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Edad (años)</Text>
              <Text style={styles.inputRange}>(18-50)</Text>
              <TextInput
                style={styles.input}
                value={formData.Age}
                onChangeText={(text) => handleInputChange("Age", text)}
                keyboardType="numeric"
                placeholder="Ej: 30"
                placeholderTextColor="#aaa"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Índice de Masa Corporal (BMI)</Text>
              <Text style={styles.inputRange}>(18.0-40.0)</Text>
              <TextInput
                style={styles.input}
                value={formData.BMI}
                onChangeText={(text) => handleInputChange("BMI", text)}
                keyboardType="numeric"
                placeholder="Ej: 25.0"
                placeholderTextColor="#aaa"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nivel de Testosterona (ng/dL)</Text>
              <Text style={styles.inputRange}>(20.0-100.0)</Text>
              <TextInput
                style={styles.input}
                value={formData.Testosterone_Level}
                onChangeText={(text) =>
                  handleInputChange("Testosterone_Level", text)
                }
                keyboardType="numeric"
                placeholder="Ej: 50.0"
                placeholderTextColor="#aaa"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Recuento de Folículos Antrales</Text>
              <Text style={styles.inputRange}>(5-30)</Text>
              <TextInput
                style={styles.input}
                value={formData.Antral_Follicle_Count}
                onChangeText={(text) =>
                  handleInputChange("Antral_Follicle_Count", text)
                }
                keyboardType="numeric"
                placeholder="Ej: 15"
                placeholderTextColor="#aaa"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                ¿Presenta irregularidad menstrual?
              </Text>
              <View style={styles.switchRowContainer}>
                <Text style={styles.switchLabel}>
                  {formData.Menstrual_Irregularity ? "Sí" : "No"}
                </Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={
                    formData.Menstrual_Irregularity ? "#1abc9c" : "#f4f3f4"
                  }
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={(value) =>
                    handleInputChange("Menstrual_Irregularity", value)
                  }
                  value={formData.Menstrual_Irregularity}
                  style={styles.switchStyle}
                />
              </View>
            </View>

            <Pressable
              style={styles.button}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? "Prediciendo..." : "Predecir Diagnóstico"}
              </Text>
            </Pressable>
          </>
        )}

        {isLoading && (
          <ActivityIndicator
            size="large"
            color="#1ABC9C"
            style={styles.loader}
          />
        )}

        {error && !isLoading && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable
              style={styles.button}
              onPress={() => {
                setError(null);
                setPredictionResult(null); // Clear previous results
              }}
            >
              <Text style={styles.buttonText}>Intentar de Nuevo</Text>
            </Pressable>
          </View>
        )}

        {/* Displaying result from PredictionResponse object */}
        {predictionResult && !isLoading && !error && (
          <View style={styles.resultContainer}>
            <Text
              style={
                predictionResult.prediction === "PCOS"
                  ? styles.resultTextPCOS
                  : styles.resultTextNoPCOS
              }
            >
              Diagnóstico: {predictionResult.prediction}
            </Text>
            <Image
              source={{
                uri:
                  predictionResult.prediction === "PCOS"
                    ? PCOS_IMAGE_URL
                    : NO_PCOS_IMAGE_URL,
              }}
              style={styles.resultImage}
              resizeMode="contain"
            />
            {predictionResult.prediction === "PCOS" ? (
              <Text style={styles.recommendationTextPCOS}>
                {"El diagnóstico indica la posibilidad de PCOS.\n\n" +
                  "Se recomienda consultar a un endocrinólogo o ginecólogo para una evaluación más detallada.\n\n" +
                  "El tratamiento puede incluir cambios en el estilo de vida, medicamentos o terapia hormonal.\n\n" +
                  "Es importante seguir las recomendaciones médicas para manejar los síntomas de manera efectiva."}
              </Text>
            ) : (
              <Text style={styles.recommendationTextNoPCOS}>
                {"Aunque el diagnóstico no indica PCOS, es importante mantener un estilo de vida saludable.\n\n" +
                  "Continúe con una dieta equilibrada y ejercicio regular.\n\n" +
                  "Si tiene alguna preocupación sobre su salud, consulte a un profesional médico."}
              </Text>
            )}
            <Pressable
              style={styles.button}
              onPress={() => setPredictionResult(null)} // Clear result to show form again
            >
              <Text style={styles.buttonText}>Evaluar de Nuevo</Text>
            </Pressable>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: "600",
    color: "#16a085",
    textAlign: "center",
    marginBottom: 20,
  },
  inputGroup: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    fontSize: 17,
    color: "#333",
    marginBottom: 8,
    fontWeight: "500",
  },
  inputRange: {
    fontSize: 13,
    color: "#666",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D1D1",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 2,
  },
  switchRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 5,
  },
  switchLabel: {
    fontSize: 16,
    color: "#333",
    marginRight: 10,
  },
  button: {
    backgroundColor: "#1ABC9C",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    width: "90%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  loader: {
    marginTop: 30,
    marginBottom: 30,
  },
  resultContainer: {
    alignItems: "center",
    width: "100%",
    padding: 20,
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  resultImage: {
    width: "90%",
    aspectRatio: 1.7,
    borderRadius: 10,
    marginVertical: 20,
  },
  resultTextPCOS: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#e74c3c",
    textAlign: "center",
    marginBottom: 10,
  },
  resultTextNoPCOS: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#27ae60",
    textAlign: "center",
    marginBottom: 10,
  },
  recommendationTextBase: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 23,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  recommendationTextPCOS: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 23,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: "#c0392b",
  },
  recommendationTextNoPCOS: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 23,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: "#16a085",
  },
  errorContainer: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FDECEA",
    borderRadius: 10,
    marginVertical: 20,
    width: "100%",
  },
  errorText: {
    fontSize: 16,
    color: "#e74c3c",
    textAlign: "center",
    marginBottom: 15,
  },
  switchStyle: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },
});
