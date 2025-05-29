# Ejercicio de BackEnd y FrontEnd

## Objetivo

Desarrollar una aplicación móvil para Android que capture una foto, la envíe a un servidor backend en AWS EC2 mediante una API REST, procese la imagen usando el modelo preentrenado VGG16 para clasificar el objeto en la imagen y muestre la predicción en la aplicación móvil.

![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/Screenshot_2025-01-28-17-35-27-25_a76c364ee29521e4906812fb8cfe2a52.jpg?raw=true)

## Estructura del Taller

### Requisitos del Proyecto

1. Configuración del Backend en Ubuntu (AWS EC2)
2. Desarrollo del API con Flask o FastAPI
3. Desarrollo del Frontend en VsC con React Native (y Expo)
4. Pruebas de Integración

### Backend (FastAPI)

- **AWS EC2** con Ubuntu
- **FastAPI** para el backend
- **Modelo de Clasificación** guardado con **Joblib**

### Frontend (React Native)

- **Linux** para el desarrollo
- **React Native**
- **Expo**

---

## 1. **Backend - FastAPI en AWS EC2**

### 1.1 **Configurar la Instancia EC2 en AWS**

1. En la consola de administración de AWS seleccione el servicio de EC2 (servidor virtual) o escriba en buscar.
   ![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/iraEC2.JPG?raw=true)

2. Ve a la opción para lanzar la instancia

![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/irainstancias.JPG?raw=true)

3. Lanza una istancia nueva

![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/iralanzarinstancia.JPG?raw=true)

4. Inicia una nueva **instancia EC2** en AWS (elige Ubuntu como sistema operativo), puede dejar la imagen por defecto.

![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/Instancia%20Ubuntu.PNG?raw=true)

5. Para este proyecto dado que el tamaño del modelo a descargar es grande necesitamos una maquina con más memoria y disco.
   con nuesra licencia tenemos permiso desde un micro lanzar hasta un T2.Large.

![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/iratipodeinstancia.JPG?raw=true)

6. seleccione el par de claves ya creado, o cree uno nuevo (Uno de los dos, pero recuerde guardar esa llave que la puede necesitar, no la pierda)

![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/iraparclaves.JPG?raw=true)

7. Habilite los puertos de shh, web y https, para este proyecto no lo vamos a usar no es necesario, pero si vas a publicar una web es requerido.
   ![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/irfirewall.JPG?raw=true)

8. Configure el almacenamiento. Este proyecto como se dijo requere capacidad en disco. Aumente el disco a 16 GiB.

   ![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/iraconfiguraralmacenamiento.JPG?raw=true)

9. Finalmente lance la instancia (no debe presentar error, si tiene error debe iniciar de nuevo). Si todo sale bien, por favor haga click en instancias en la parte superior.

   ![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/lanzarinstanciafinal.PNG?raw=true)

10. Dado que normalmente en la lista de instancias NO VE la nueva instancia lanzada por favor actualice la pagina Web o en ir a instancias

![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/iracutualizarweb.JPG?raw=true)
![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/irainstancias.JPG?raw=true)

11. Vamos a seleccionar el servidor ec2 lanzado.
    ![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/irseleccionarinstancia.JPG?raw=true)

12. Verificar la dirección IP pública y el DNS en el resumen de la instancia

![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/irresumeninstancia.JPG?raw=true)

13. Debido a que vamos a lanzar un API rest debemos habilitar el puerto. Vamos al seguridad

    ![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/iraseguirdad.JPG?raw=true)

14. Vamos al grupo de seguridad

![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/iragruposeguridad.JPG?raw=true)

15. Vamos a ir a Editar la regla de entrada

    ![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/iraregladeentrada.JPG?raw=true)

16. Ahora vamos a agregar un regla de entrada para habilitar el puerto, recuerden poner IPV 4

    ![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/iragregarregla.JPG?raw=true)

17. Abre un puerto en el grupo de seguridad (por ejemplo, puerto **8000**) para permitir acceso a la API.

![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/Puerto.PNG?raw=true)

18. Guardemos la regla de entrada.
    ![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/irguardarreglas.JPG?raw=true)

19. Ve nuevamente a instancias
    ![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/iralanzarinstanciaB.JPG?raw=true)

20. Vamos a conectar con la consola del servidor
    ![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/irconectar.JPG?raw=true)

    ![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/irconsola.JPG?raw=true)

21. Si no puedes conectarse directamente a la instancia EC2, conectate con SSH, es decir en la consola de administración de instancia creada hay una opcion de "Conectar", has clic y luego conectar otra vez. Si no puede conectarse puede hacerlo con el SSH:

    ```bash
    ssh -i "tu_clave.pem" ubuntu@<tu_ip_ec2>
    ```

---

### 1.2 Instalar Dependencias en el Servidor EC2

Una vez dentro de tu instancia EC2, instalar las librerias y complementos como FastAPI y las dependencias necesarias para ello debes crear una carpeta en donde realizaras las instalaciones:

**Ver las carpetas**

```bash
ls -la
```

**Ver la version de python**

```bash
python3 -V
```

**Si se requiere, puede actualizar los paquetes**

```bash
sudo apt update
```

![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/aptUpdate.PNG?raw=true)

**Si se requiere: Instalar pip y virtualenv**

```bash
sudo apt install python3-pip python3-venv
```

**Crear la carpeta del proyecto (si no existe ya desde pasos anteriores)**

```bash
mkdir proyecto_pcos
```

**Accede a tu carpeta**

```bash
cd proyecto_pcos
```

**Crear y activar un entorno virtual**

```bash
python3 -m venv venv
source venv/bin/activate
```

Recuerda que en el prompt debe obersar que el env debe quedar activo

**Instalar FastAPI, Uvicorn, Joblib, NumPy, Pandas, Pydantic y Scikit-learn**

```bash
pip install fastapi uvicorn joblib numpy pandas pydantic
```

### 1.3 Crear la API FastAPI

Crea un archivo `app.py` en tu instancia EC2 (dentro de la carpeta `proyecto_pcos`) para definir la API que servirá las predicciones de PCOS.

```bash
nano app.py
```

Copia el siguiente código en tu editor nano. Este código define la API para el diagnóstico de PCOS:

```python
from fastapi import FastAPI
from fastapi.responses import JSONResponse
import joblib
import numpy as np
import pandas as pd
import os
from pydantic import BaseModel

app = FastAPI()

# ========== 💾 Model and Scaler Loading ==========

MODEL_DIR = "app/models"
MODEL_PATH = os.path.join(MODEL_DIR, "svm_selected_model.pkl")
SCALER_PATH = os.path.join(MODEL_DIR, "scaler.bin")

model = None
scaler = None

class PCOSInput(BaseModel):
    age: int
    bmi: float
    menstrual_irregularity: int # 0 for No, 1 for Yes
    testosterone_level: float
    antral_follicle_count: int

@app.on_event("startup")
def load_model_and_scaler():
    global model, scaler
    try:
        # Asegurarse que el directorio de modelos exista al iniciar
        os.makedirs(MODEL_DIR, exist_ok=True)

        if not os.path.exists(MODEL_PATH):
            # Esta es una situación de ejemplo. En un entorno real, quizás quieras
            # que el servidor falle si el modelo no está, o tener un mecanismo para cargarlo.
            print(f"[ADVERTENCIA] Archivo de modelo no encontrado en {MODEL_PATH}. El endpoint de diagnóstico fallará.")
            # raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
        else:
            model = joblib.load(MODEL_PATH)
            print("[INFO] Modelo SVM cargado exitosamente.")

        if not os.path.exists(SCALER_PATH):
            print(f"[ADVERTENCIA] Archivo de escalador no encontrado en {SCALER_PATH}. El endpoint de diagnóstico fallará.")
            # raise FileNotFoundError(f"Scaler file not found at {SCALER_PATH}")
        else:
            scaler = joblib.load(SCALER_PATH)
            print("[INFO] Escalador cargado exitosamente.")

    except Exception as e:
        print(f"[ERROR] No se pudo cargar el modelo o el escalador: {e}")

# ========== 🧠 PCOS Diagnosis Endpoint ==========

@app.post("/diagnose")
async def diagnose_pcos(data: PCOSInput):
    if not model or not scaler:
        return JSONResponse(status_code=503, content={"error": "Modelo o escalador no cargados. Revise los logs del servidor."})

    try:
        input_df = pd.DataFrame({
            "Age": [data.age],
            "BMI": [data.bmi],
            "Menstrual_Irregularity": [data.menstrual_irregularity],
            "Testosterone_Level": [data.testosterone_level],
            "Antral_Follicle_Count": [data.antral_follicle_count]
        })

        input_data_scaled = scaler.transform(input_df)

        prediction = model.predict(input_data_scaled)
        predicted_class = int(prediction[0])

        # El modelo actual no calcula probabilidades, así que se omite esa parte.
        # Si tu modelo svm_selected_model.pkl SÍ puede generar probabilidades (ej. con predict_proba),
        # puedes descomentar y adaptar la siguiente sección:
        # probabilities = model.predict_proba(input_data_scaled)
        # probability_of_predicted_class = probabilities[0][predicted_class]

        return {
            "prediction": "PCOS" if predicted_class == 1 else "No PCOS",
            # "probability": round(float(probability_of_predicted_class), 4) # Si se habilitan las probabilidades
        }
    except AttributeError as ae:
        print(f"[ERROR] Un error de atributo ocurrió: {ae}")
        return JSONResponse(status_code=500, content={"error": f"Un error de atributo ocurrió: {str(ae)}"})
    except Exception as e:
        print(f"[ERROR] Error durante la predicción: {e}")
        return JSONResponse(status_code=500, content={"error": str(e)})

# Ejemplo para correr esta app (desde dentro de la carpeta proyecto_pcos y con el entorno virtual activado):
# uvicorn app:app --host 0.0.0.0 --port 8000 --reload
#
# Ejemplo de cuerpo para la petición POST a /diagnose (usando curl o Postman):
# {
#     "age": 30,
#     "bmi": 25.0,
#     "menstrual_irregularity": 1,
#     "testosterone_level": 50.0,
#     "antral_follicle_count": 15
# }

if __name__ == "__main__":
   uvicorn.run(app, host="0.0.0.0", port=8000)

```

Para salir del editor **nano** oprime CTRL-X y luego (Save modified buffer? ) escribe "Y" y (Save modified buffer? app.py) ENTER.

### 1.4 Preparar Modelo y Escalador

El código de la API espera encontrar los archivos del modelo (`svm_selected_model.pkl`) y del escalador (`scaler.bin`) en un subdirectorio llamado `app/models/` dentro de tu carpeta de proyecto (`proyecto_pcos`).

1.  **Crear el directorio de modelos en tu EC2, dentro de `proyecto_pcos`:**

    ```bash
    mkdir -p app/models
    ```

2.  **Subir los archivos del modelo y escalador:**
    Deberás subir tus archivos `svm_selected_model.pkl` y `scaler.bin` desde tu máquina local a la carpeta `proyecto_pcos/app/models/` en la instancia EC2. Puedes usar `scp` (Secure Copy Protocol) para esto. Abre una terminal en **tu máquina local** (no en la EC2) y ejecuta un comando similar a este (ajusta las rutas según sea necesario):

    ```bash
    # Ejemplo para svm_selected_model.pkl
    scp -i "tu_clave.pem" ruta/local/a/svm_selected_model.pkl ubuntu@<tu_ip_ec2>:~/proyecto_pcos/app/models/svm_selected_model.pkl

    # Ejemplo para scaler.bin
    scp -i "tu_clave.pem" ruta/local/a/scaler.bin ubuntu@<tu_ip_ec2>:~/proyecto_pcos/app/models/scaler.bin
    ```

    Reemplaza `"tu_clave.pem"`, `ruta/local/a/...` y `<tu_ip_ec2>` con tus valores correspondientes.

### 1.5 Ejecutar el Servidor FastAPI

Para ejecutar el servidor de FastAPI, asegúrate de estar en la carpeta `proyecto_pcos` y que tu entorno virtual (`venv`) esté activado:

```bash
# Si no está activado:
source venv/bin/activate

# Ejecutar uvicorn:
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/ServidorAws.PNG?raw=true)

### 1.6 Error en el Servidor

![alt text](https://github.com/adiacla/FullStack-RNN/blob/main/Imagenes/Error.PNG?raw=true)

Si al momento de ejecutar el servidor te da un error como en el de la anterior imagen en el cual se excede la memoria del sistema utiliza el siguiente comando y vuelve a intentarlo

```bash
sudo sync; sudo sysctl -w vm.drop_caches=3
```

## Prueba del Backend

Puedes usar Postman o cURL para probar la API antes de integrarla con el frontend.

**Prueba con cURL:**

Abre una terminal en tu máquina local y ejecuta:

```bash
curl -X POST -H "Content-Type: application/json" -d '{
    "age": 30,
    "bmi": 25.0,
    "menstrual_irregularity": 1,
    "testosterone_level": 50.0,
    "antral_follicle_count": 15
}' http://<tu_ip_ec2>:8000/diagnose
```

Reemplaza `<tu_ip_ec2>` con la IP pública de tu instancia EC2. Deberías recibir una respuesta JSON como `{"prediction":"No PCOS"}` o `{"prediction":"PCOS"}`.

**Prueba con Postman:**

1.  Crea una nueva solicitud.
2.  Selecciona el método `POST`.
3.  Ingresa la URL de tu endpoint: `http://<tu_ip_ec2>:8000/diagnose` (reemplaza `<tu_ip_ec2>`).
4.  Ve a la pestaña "Body" y selecciona la opción "raw".
5.  En el menú desplegable que aparece a la derecha (que usualmente dice "Text"), selecciona "JSON".
6.  Pega el siguiente cuerpo JSON en el área de texto:
    `json
{
  "age": 30,
  "bmi": 25.0,
  "menstrual_irregularity": 1,
  "testosterone_level": 50.0,
  "antral_follicle_count": 15
}
`
    ![alt text](https://github.com/sergioc248/pcos-ia-app/blob/main/images/screenshot_postman_request.png?raw=true)
7.  Envía la solicitud. Deberías ver la respuesta JSON del servidor. Deberías ver algo como lo siguiente:

![alt text](https://github.com/sergioc248/pcos-ia-app/blob/main/images/screenshot_postman_answer.png?raw=true)

La API estará disponible en `http://<tu_ip_ec2>:8000`.

# 2. Frontend en React Native con Expo (Linux)

Node.js y npm:

```
# Descarga e instala fnm
curl -o- https://fnm.vercel.app/install | bash

# Descarga e instala Node.js:
fnm install 22

# Verifica la versión de Node.js:
node -v # Debería imprimir "v22..."

# Verifica que npm fue instalado:
npm -v
```

> Pasos replicados de: https://nodejs.org/en/download

> **Nota**: Asegúrate de tener instalado Node.js y npm antes de continuar con la configuración del frontend. Estos son componentes esenciales para el desarrollo con React Native.

## Paso 2: Limpiar posibles residuos de instalaciones previas

Si has tenido problemas con instalaciones previas, es recomendable limpiar completamente las dependencias globales de npm y Expo.

Eliminar Expo globalmente: Si tienes instalado expo-cli globalmente, elimínalo:

```
npm uninstall -g create-expo-app
```

Eliminar la caché de npm: Borra la caché de npm para evitar problemas con dependencias:

```bash

npm cache clean --force
```

## Paso 3: Crear el Proyecto de Expo con TypeScript(React Native)

Una vez que todo esté instalado y configurado correctamente, crea un nuevo proyecto de Expo con el siguiente comando:

Abre la terminal y ejecuta tu comando:

```bash
npx create-expo-app pcos-ia-app --template blank-typescript

# Dependencias necesarias para el rpoyecto
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
```

> (pcos-ia-app es el nombre del proyecto)

![alt text](https://github.com/sergioc248/pcos-ia-app/blob/main/images/screenshot_generate_project.png?raw=true)

Si deseas que la aplicación también funcione en la web y poder probarla desde el computador, ejecuta el siguiente comando para añadir las dependencias de la web:

```
# Entra en la carpeta del proyecto
cd pcos-ia-app

# Instala las dependencias en el proyecto
npx expo install react-dom react-native-web @expo/metro-runtime
```

![alt text](https://github.com/sergioc248/pcos-ia-app/blob/main/images/screenshot_install_dependencies.png?raw=true)

Para configurar Prettier, cambia tu eslint.config.js a que tenga incluya lo siguiente:

```
// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    extends: ["expo", "prettier"],
    plugins: ["prettier"],
    rules: {
      "prettier/prettier": "error",
    },
  },
]);
```

> **Debes tener instalado la extensión de ESLint y Prettier** para que te formatee automáticamente el código y ver los errores en VSCode.

## Paso 4: Estructura y Código de la Aplicación PCOS-IA

Después de configurar el proyecto base de Expo y las dependencias esenciales como `expo-router`, vamos a estructurar nuestra aplicación para el diagnóstico de PCOS. Esta aplicación se centrará en recolectar datos del usuario, enviarlos a un backend para predicción y mostrar los resultados.

### 4.1. Archivo Principal `App.tsx`

Con `expo-router`, el archivo `App.tsx` en la raíz del proyecto se vuelve muy simple. Su única responsabilidad es registrar el punto de entrada de `expo-router`. Asegúrate de que tu `App.tsx` contenga únicamente:

```typescript
import "expo-router/entry";
```

Esto difiere del `App.tsx` que podrías usar en proyectos de React Native sin `expo-router` o para otros fines, como el ejemplo anterior de reconocimiento de imágenes. Para este proyecto de PCOS, no se necesita el contenido complejo que estaba previamente documentado para `App.tsx` en este README.

### 4.2. Configuración de Rutas y Layout Principal (`app/_layout.tsx`)

`expo-router` utiliza un directorio llamado `app` en la raíz de tu proyecto para definir las rutas. Si no existe, créalo.

Crea el archivo `app/_layout.tsx`. Este archivo define el layout principal de la aplicación, incluyendo la configuración del navegador de pila (Stack Navigator) para moverse entre pantallas.

```typescript
import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index" // Corresponde a app/index.tsx
        options={{ title: "Bienvenida", headerShown: false }}
      />
      <Stack.Screen
        name="diagnosis" // Corresponde a app/diagnosis.tsx
        options={{ title: "Diagnóstico PCOS" }}
      />
    </Stack>
  );
}
```

Aquí definimos dos rutas principales: `index` para la pantalla de bienvenida y `diagnosis` para la pantalla del formulario de diagnóstico.

### 4.3. Pantalla de Bienvenida (`app/index.tsx`)

Crea el archivo `app/index.tsx`. Esta será la primera pantalla que el usuario vea.

**Propósito:**

- Mostrar el título de la aplicación: "Diagnóstico de PCOS".
- Presentar una imagen introductoria relacionada con el tema.
- Mostrar texto descriptivo sobre el PCOS y el objetivo de la herramienta.
- Incluir un botón para navegar a la pantalla de diagnóstico.

**Ejemplo de Estructura (resumido):**

```typescript
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { useSafeAreaInsets } from "react-native-safe-area-context";

const WelcomeScreen = () => {
  const insets = useSafeAreaInsets();
  const PCOS_IMAGE_URL = "https://ferticity.com/wp-content/uploads/2025/01/pcos_symtoms3-webp.webp";

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={[styles.container, {paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20}]}>
      <Text style={styles.title}>Diagnóstico de PCOS</Text>
      <Image source={{ uri: PCOS_IMAGE_URL }} style={styles.image} resizeMode="contain" />
      <Text style={styles.introText}>
        El Síndrome de Ovarios Poliquísticos (PCOS) es una de las condiciones endocrinas más comunes en mujeres en edad reproductiva.
        A menudo, su diagnóstico representa un desafío, y muchas mujeres pueden pasar años sin un diagnóstico correcto debido a que
        sus síntomas se confunden con otras afecciones.
        {/* Asegúrate de añadir el resto del texto introductorio aquí */}
      </Text>
      <Text style={styles.introText}>
        Esta herramienta utiliza un modelo de Inteligencia Artificial para estimar la posibilidad de PCOS basándose en datos clínicos básicos...
      </Text>
       <Text style={[styles.introText, styles.boldText]}>
        Objetivo: Ofrecer una alerta temprana que motive la búsqueda de estudios médicos más detallados.
        No reemplaza la consulta médica profesional...
      </Text>
      <Link href="/diagnosis" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Iniciar Diagnóstico</Text>
        </TouchableOpacity>
      </Link>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: { flex: 1, backgroundColor: "#FDFCF8" },
  container: { flexGrow: 1, alignItems: 'center', paddingHorizontal: 25, backgroundColor: "#FDFCF8" },
  title: { fontSize: 30, fontWeight: '700', color: '#1ABC9C', textAlign: 'center', marginBottom: 20 },
  image: { width: '100%', height: 200, marginBottom: 30, borderRadius: 15 },
  introText: { fontSize: 16, color: '#4A4A4A', textAlign: 'justify', marginBottom: 15, lineHeight: 24 },
  boldText: { fontWeight: '600' },
  button: { backgroundColor: '#1ABC9C', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});

export default WelcomeScreen;
```

> **Nota:** El código anterior es una representación simplificada para ilustrar la estructura. Consulta el archivo `app/index.tsx` generado y modificado durante nuestra sesión de desarrollo para ver la implementación completa y los estilos detallados.

### 4.4. Pantalla de Formulario y Diagnóstico (`app/diagnosis.tsx`)

Crea el archivo `app/diagnosis.tsx`. Esta pantalla es el núcleo funcional de la app.

**Funcionalidades:**

1.  **Campo para IP del Servidor:** Un `TextInput` para que el usuario pueda configurar la IP y el puerto del servidor backend (ej: `54.85.38.49:8000` por defecto).
2.  **Formulario de Entrada de Datos:**
    - Edad (`TextInput` numérico, validado para el rango 18-50).
    - Índice de Masa Corporal (BMI) (`TextInput` numérico, validado para 18.0-40.0).
    - Nivel de Testosterona (`TextInput` numérico, validado para 20.0-100.0).
    - Recuento de Folículos Antrales (`TextInput` numérico, validado para 5-30).
    - Irregularidad Menstrual (`Switch` para Sí/No, con el texto "Sí"/"No" visible junto al switch, y el switch debajo del label principal).
3.  **Botón de Predicción:** Un botón "Predecir Diagnóstico".
4.  **Lógica de Envío y Recepción:**
    - Al presionar el botón, se validan los datos ingresados.
    - Se construye un payload JSON con los datos del formulario. Ejemplo:
      ```json
      {
        "age": 30,
        "bmi": 25.0,
        "menstrual_irregularity": 1, // 1 para Sí, 0 para No
        "testosterone_level": 50.0,
        "antral_follicle_count": 15
      }
      ```
    - Se realiza una petición `POST` al endpoint `/diagnose` del servidor backend (configurable mediante el campo de IP, ej: `http://54.85.38.49:8000/diagnose`) con el payload JSON y `Content-Type: application/json`.
    - Se maneja la respuesta JSON del servidor, que se espera sea: `{"prediction": "PCOS"}` o `{"prediction": "No PCOS"}`. (La funcionalidad de probabilidad fue eliminada según los requisitos).
5.  **Visualización de Resultados:**
    - Se muestra el diagnóstico ("PCOS" o "No PCOS") con un estilo distintivo (ej: texto rojo para PCOS, verde para No PCOS).
    - Se muestra una imagen relevante según el diagnóstico.
    - Se presentan recomendaciones textuales adecuadas para cada caso, asegurando que los saltos de línea (`\\n`) se rendericen correctamente.
    - Se incluye un botón para "Evaluar de Nuevo", que resetea el formulario.
    - Se manejan estados de carga (con `ActivityIndicator`) y mensajes de error (`Alert` y texto en pantalla).

**Ejemplo de Estructura Lógica (resumido):**

```typescript
import React, { useState } from 'react';
import { View, Text, TextInput, Switch, TouchableOpacity, StyleSheet, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface PredictionResponse {
  prediction: "PCOS" | "No PCOS";
}

const DEFAULT_SERVER_IP = "54.85.38.49:8000";
const NO_PCOS_IMAGE_URL = "https://images.pexels.com/photos/3076509/pexels-photo-3076509.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
const PCOS_IMAGE_URL = "https://images.pexels.com/photos/4021779/pexels-photo-4021779.jpeg";

const DiagnosisScreen = () => {
  const insets = useSafeAreaInsets();
  const [serverIp, setServerIp] = useState(DEFAULT_SERVER_IP);
  const [age, setAge] = useState('30');
  // ... otros estados para bmi, testosterone, follicles ...
  const [menstrualIrregularity, setMenstrualIrregularity] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Funciones handleInputChange, validateInputs, y handlePredict (handleSubmit)
  // Deben incluir la lógica de validación, construcción del payload JSON,
  // la llamada fetch al servidor, y el manejo de la respuesta/errores.

  const handlePredict = async () => {
    // ... (validación de inputs)
    setIsLoading(true); setError(null); setPredictionResult(null);
    const payload = {
        age: parseInt(age, 10),
        // ... bmi, testosterone_level, antral_follicle_count
        menstrual_irregularity: menstrualIrregularity ? 1 : 0,
    };
    try {
      const response = await fetch(\`http://\${serverIp}/diagnose\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data: PredictionResponse = await response.json(); // Error handling mejorado en el código real
      if (!response.ok) {
         // Extraer mensaje de error del cuerpo de la respuesta si es posible
        let errorMsg = \`Error del servidor: \${response.status}\`;
        try { const errorData = data as any; if(errorData.error || errorData.message || errorData.detail) errorMsg = errorData.error || errorData.message || errorData.detail; } catch(_){}
        throw new Error(errorMsg);
      }
      setPredictionResult(data);
    } catch (err:any) {
      setError(err.message || 'Ocurrió un error.');
      Alert.alert('Error de Predicción', err.message || 'Ocurrió un error.');
    } finally {
      setIsLoading(false);
    }
  };

  // El JSX incluirá:
  // - TextInput para serverIp
  // - TextInputs para age, bmi, testosterone, follicles
  // - Label para "Irregularidad menstrual" y debajo el View con el texto "Sí/No" y el Switch
  // - Botón "Predecir Diagnóstico"
  // - ActivityIndicator para isLoading
  // - Text para mensajes de error
  // - Sección de resultados con Imagen, Diagnóstico, Recomendaciones (usando string concatenation para saltos de línea), y botón "Evaluar de Nuevo".

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', padding: 20, paddingTop: insets.top, paddingBottom: insets.bottom }}>
      {/* ... UI elements ... */}
    </ScrollView>
  );
};

// Definir los StyleSheet necesarios.
const styles = StyleSheet.create({ /* ... */ });

export default DiagnosisScreen;
```

> **Importante:** Este es un esqueleto de la lógica y la UI. El código completo en `app/diagnosis.tsx` que desarrollamos contiene validaciones más detalladas, manejo de estados (usando un objeto `formData` para los inputs), y los estilos completos para una mejor experiencia de usuario. Asegúrate de consultar esa versión para la implementación final.

## Paso 5: Corre tu app en el Emulador, PC o Dispositivo Móvil:

Correr la aplicación para desarrollo en el escritorio o conecta tu dispositivo físico usando Expo Go (recomendado):

```
npm run start
```

Esta interfaz proporciona varias opciones para interactuar con tu aplicación de React Native:

1. **QR Code**: En la interfaz de la terminal verás un código QR. Puedes escanear este código con la aplicación Expo Go en tu dispositivo móvil. Asegúrate de que tu dispositivo y tu computadora estén en la misma red Wi-Fi para que la conexión funcione correctamente.

2. **Opciones de Plataforma**: La interfaz te permite elegir en qué plataforma deseas ejecutar la aplicación. Puedes seleccionar entre Android, iOS o web. Esto es útil si estás desarrollando para múltiples plataformas y deseas probar tu aplicación en diferentes entornos.

3. **Recargar la Aplicación**: Si realizas cambios en tu código, la aplicación se recargará automáticamente. Sin embargo, si necesitas forzar un recarga, puedes hacerlo desde la interfaz.

4. **Herramientas de Desarrollo**: La interfaz también ofrece herramientas para depurar tu aplicación, como la opción de abrir el inspector de elementos o habilitar el modo de depuración remota.

Para conectar tu dispositivo móvil:

- **Android**: Abre la aplicación Expo Go y escanea el código QR que aparece en la interfaz de la terminal.
- **iOS**: Abre la aplicación Expo Go, ve a la pestaña de "Proyectos" y escanea el código QR.

# 3. Despliegue Final: Compilación Android para Pruebas con HTTP

Para probar tu aplicación en un dispositivo Android físico, especialmente si necesitas conectarte a un servidor backend que usa HTTP (no HTTPS), puedes generar una compilación de tipo producción (APK para fácil instalación) configurada para permitir tráfico HTTP a tu servidor específico.

## 3.1 Requisitos Previos

1.  **Instalar EAS CLI**: Si aún no lo has hecho:
    ```bash
    npm install -g eas-cli
    ```
2.  **Iniciar Sesión en Expo**:
    ```bash
    eas login
    ```
3.  **Configurar EAS en tu Proyecto**: Si es la primera vez:

    ```bash
    eas build:configure
    ```

    Asegúrate de que tu archivo `eas.json` tenga un perfil adecuado. Para este caso, vamos a asumir un perfil llamado `production` que configuraremos para generar un APK.

    ```json
    // Ejemplo de eas.json para un APK de "producción" para pruebas
    {
      "build": {
        "production": {
          // Puedes renombrar este perfil si lo deseas, ej. "production_http_test"
          "env": {
            // Aquí podrías definir variables de entorno si fueran necesarias
          },
          "android": {
            "buildType": "apk" // Generar un APK para fácil instalación
          }
        }
        // ...otros perfiles...
      }
    }
    ```

## 3.2 Permitir Tráfico HTTP Cleartext para Pruebas en Android

Por defecto, Android bloquea el tráfico HTTP (no encriptado) en las compilaciones de producción por motivos de seguridad. Si experimentas errores de "Network request failed" en tu APK de producción, esto es una causa probable.

La forma más sencilla y recomendada en Expo para permitir globalmente el tráfico HTTP en Android para fines de prueba es utilizando el plugin `expo-build-properties`.

### Paso 3.2.1: Instalar `expo-build-properties`

Si aún no lo ha hecho, instale el plugin en su proyecto:

```bash
npx expo install expo-build-properties
```

### Paso 3.2.2: Configurar `app.json`

Añada o modifique la sección `plugins` en su archivo `app.json` (o `app.config.js`/`ts`) para incluir `expo-build-properties` y configurar `usesCleartextTraffic` para Android:

```json
{
  "expo": {
    // ... otras configuraciones ...
    "plugins": [
      "expo-router", // Asegúrese de mantener sus otros plugins
      [
        "expo-build-properties",
        {
          "android": {
            "usesCleartextTraffic": true
            // Aquí puede añadir otras propiedades nativas si las necesita
          }
          // Puede añadir configuraciones para iOS aquí si es necesario
          // "ios": {
          //   "flipper": true // Ejemplo
          // }
        }
      ]
    ]
    // ... resto de su app.json ...
  }
}
```

Esta configuración le indica a EAS Build que modifique el `AndroidManifest.xml` nativo para incluir `android:usesCleartextTraffic="true"`, permitiendo así las solicitudes HTTP desde su aplicación.

**Importante:**

- **Alcance Global**: `usesCleartextTraffic: true` permite el tráfico HTTP a **cualquier** dominio. Esto es conveniente para pruebas pero menos seguro que especificar dominios permitidos individualmente.
- **Solo para Pruebas**: Utilice esta configuración principalmente para desarrollo y pruebas con backends que controla y que aún no usan HTTPS.
- **Seguridad en Producción**: **Para una aplicación de producción real, siempre debe configurar su servidor para que use HTTPS.**

## 3.3 Generar la Compilación APK (Perfil `production`)

Con la configuración de `usesCleartextTraffic` aplicada en su `app.json` mediante `expo-build-properties`, proceda a generar su APK. Asumiendo que está probando con un perfil llamado `production` en su `eas.json` (configurado para generar un APK como se mostró en el ejemplo de `eas.json` anteriormente), ejecute:

```bash
eas build -p android --profile production
```

Una vez que la compilación finalice, EAS CLI te proporcionará un enlace para descargar el archivo `.apk`. Instala este APK en tu dispositivo Android.
