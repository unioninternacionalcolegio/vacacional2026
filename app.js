// 🔥 CONFIGURA AQUÍ TU FIREBASE
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "XXXXXX",
  appId: "XXXXXX"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// Guardar recuerdo
function guardarRecuerdo() {
  const nombre = document.getElementById("nombre").value;
  const comentario = document.getElementById("comentario").value;
  const foto = document.getElementById("foto").files[0];
  const estado = document.getElementById("estado");

  if (!nombre || !comentario || !foto) {
    estado.innerText = "⚠️ Completa todos los campos";
    return;
  }

  estado.innerText = "Subiendo recuerdo... ⏳";

  const refFoto = storage.ref("recuerdos/" + Date.now() + "_" + foto.name);

  refFoto.put(foto).then(() => {
    refFoto.getDownloadURL().then((url) => {
      db.collection("recuerdos").add({
        nombre: nombre,
        comentario: comentario,
        foto: url,
        fecha: new Date()
      }).then(() => {
        estado.innerText = "✅ Recuerdo guardado";
        document.getElementById("nombre").value = "";
        document.getElementById("comentario").value = "";
        document.getElementById("foto").value = "";
      });
    });
  });
}

// Mostrar recuerdos
db.collection("recuerdos")
  .orderBy("fecha", "desc")
  .onSnapshot((snapshot) => {
    const muro = document.getElementById("muro");
    muro.innerHTML = "<h2>🧡 Recuerdos</h2>";

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
