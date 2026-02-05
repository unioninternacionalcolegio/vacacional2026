// 🔥 Firebase SDK (MODULAR)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

// 🔐 CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyCd3qZLVtREsX4RbTKBC8qqBrnGW2iarpw",
  authDomain: "vacacional2026-bd295.firebaseapp.com",
  projectId: "vacacional2026-bd295",
  storageBucket: "vacacional2026-bd295.firebasestorage.app",
  messagingSenderId: "544449802911",
  appId: "1:544449802911:web:8fec071d6326e7f2b3e8aa"
};

// 🚀 INIT
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// 🔒 ESTADO DEL MURO
let muroCerrado = false;

// 🎯 GUARDAR RECUERDO
window.guardarRecuerdo = async function () {
  if (muroCerrado) {
    alert("🔒 El muro está cerrado");
    return;
  }

  const nombre = document.getElementById("nombre").value.trim();
  const comentario = document.getElementById("comentario").value.trim();
  const foto = document.getElementById("foto").files[0];
  const estado = document.getElementById("estado");

  if (!nombre || !comentario || !foto) {
    estado.innerText = "⚠️ Completa todos los campos";
    return;
  }

  estado.innerText = "⏳ Subiendo recuerdo...";

  try {
    const fotoRef = ref(storage, `recuerdos/${Date.now()}_${foto.name}`);
    await uploadBytes(fotoRef, foto);
    const fotoURL = await getDownloadURL(fotoRef);

    await addDoc(collection(db, "recuerdos"), {
      nombre,
      comentario,
      foto: fotoURL,
      fecha: new Date()
    });

    // 🎉 CONFETTI
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });

    // 🔊 SONIDO
    const audio = document.getElementById("sonidoGuardar");
    audio.currentTime = 0;
    audio.play();

    estado.innerText = "✅ Recuerdo guardado";

    // 🧼 LIMPIAR
    document.getElementById("nombre").value = "";
    document.getElementById("comentario").value = "";
    document.getElementById("foto").value = "";
    document.getElementById("preview").style.display = "none";

  } catch (error) {
    console.error(error);
    estado.innerText = "❌ Error al guardar";
  }
};

// 🧡 MOSTRAR RECUERDOS
const muro = document.getElementById("muro");

const q = query(
  collection(db, "recuerdos"),
  orderBy("fecha", "desc")
);

onSnapshot(q, (snapshot) => {
  muro.innerHTML = "";

  snapshot.forEach((doc) => {
    const r = doc.data();
    muro.innerHTML += `
      <div class="recuerdo">
        <img src="${r.foto}">
        <h3>${r.nombre}</h3>
        <p>${r.comentario}</p>
      </div>
    `;
  });
});

// 🧼 LIMPIAR MANUAL
window.limpiar = () => {
  document.getElementById("nombre").value = "";
  document.getElementById("comentario").value = "";
  document.getElementById("foto").value = "";
  document.getElementById("preview").style.display = "none";
};

// 🔒 CERRAR MURO
window.cerrarMuro = () => {
  if (confirm("¿Cerrar el muro de recuerdos?")) {
    muroCerrado = true;
    document.querySelector(".formulario").style.display = "none";
  }
};

// 👩‍🏫 MODO PROFES
window.modoProfe = () => {
  const clave = prompt("Clave de profesores:");
  if (clave === "union2026") {
    muroCerrado = false;
    document.querySelector(".formulario").style.display = "block";
    alert("✅ Modo profesor activado");
  } else {
    alert("❌ Clave incorrecta");
  }
};
