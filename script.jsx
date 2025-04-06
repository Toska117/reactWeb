import React, { useState } from "react";
import "./styles.css"; // Importa el archivo CSS
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set } from "firebase/database";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB-TObHyQLU94X5kpqeMHcANoiZ9AkVLUc",
    authDomain: "moviles-2eeb4.firebaseapp.com",
    projectId: "moviles-2eeb4",
    storageBucket: "moviles-2eeb4.firebasestorage.app",
    messagingSenderId: "500476381751",
    appId: "1:500476381751:web:5c94a4612875ac836ccdb2",
    measurementId: "G-620F3CZ56F"
  };

// Inicialización de Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

const App = () => {
    const [nombre, setNombre] = useState("");
    const [aciertos, setAciertos] = useState(0);
    const [intentos, setIntentos] = useState(0);
    const [banderaActual, setBanderaActual] = useState("");
    const [respuesta, setRespuesta] = useState("");
    const [juegoIniciado, setJuegoIniciado] = useState(false);
    const [juegoTerminado, setJuegoTerminado] = useState(false);
  
    const banderas = ["argentina", "colombia", "ecuador", "venezuela", "paraguay", "brasil"];
    const maxIntentos = 6;
  
    const comenzarJuego = () => {
      if (nombre.trim()) {
        guardarNombreEnFirebase(nombre);
        setIntentos(0);
        setAciertos(0);
        setJuegoIniciado(true);
        setJuegoTerminado(false);
        mostrarBandera();
      } else {
        alert("Por favor ingresa tu nombre.");
      }
    };
  
    const guardarNombreEnFirebase = (nombre) => {
      const jugadorRef = push(ref(db, "jugadores"));
      set(jugadorRef, {
        nombre: nombre,
        fecha: new Date().toISOString(),
      }).catch((error) => {
        console.error("Error al guardar en Firebase:", error);
      });
    };
  
    const mostrarBandera = () => {
      const nuevaBandera = banderas[Math.floor(Math.random() * banderas.length)];
      setBanderaActual(nuevaBandera);
      setRespuesta("");
    };
  
    const verificar = () => {
      if (respuesta.toLowerCase().trim() === banderaActual) {
        setAciertos(aciertos + 1);
      }
      setIntentos(intentos + 1);
      if (intentos + 1 >= maxIntentos) {
        setJuegoTerminado(true);
        setJuegoIniciado(false);
      } else {
        mostrarBandera();
      }
    };
  
    const reiniciarJuego = () => {
      setNombre("");
      setJuegoIniciado(false);
      setJuegoTerminado(false);
    };
  
    return (
      <div className="App">
        <h1>Juego de Adivinar Banderas</h1>
        {!juegoIniciado && !juegoTerminado && (
          <div id="inicio">
            <label>
              Ingresa tu nombre:
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre"
              />
            </label>
            <button onClick={comenzarJuego}>Comenzar</button>
          </div>
        )}
        {juegoIniciado && (
          <div id="juego">
            <h2>¡Adivina la bandera!</h2>
            <img
              src={`img/${banderaActual}.png`}
              alt="Bandera"
              style={{ width: "200px", height: "auto" }}
            />
            <label>
              ¿De qué país es esta bandera?
              <input
                type="text"
                value={respuesta}
                onChange={(e) => setRespuesta(e.target.value)}
                placeholder="Tu respuesta"
              />
            </label>
            <button onClick={verificar}>Enviar</button>
          </div>
        )}
        {juegoTerminado && (
          <div id="final">
            <h2>Juego terminado</h2>
            <p>Tuviste {aciertos} aciertos.</p>
            <button onClick={reiniciarJuego}>Reiniciar</button>
          </div>
        )}
      </div>
    );
  };
  
  export default App;
  