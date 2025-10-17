// script.js
const form = document.getElementById("register-form");
const roleSelect = document.getElementById("role");
const studentFields = document.getElementById("student-fields");
const teacherFields = document.getElementById("teacher-fields");

let estudiantes = [];

// Cargar estudiantes desde el archivo JSON
fetch('estudiantes.json')
  .then(response => response.json())
  .then(data => {
    estudiantes = data;
  });

roleSelect.addEventListener("change", () => {
  const role = roleSelect.value;
  studentFields.classList.toggle("hidden", role !== "estudiante");
  teacherFields.classList.toggle("hidden", role !== "docente");
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const role = roleSelect.value;
  const name = document.getElementById("name").value.trim();

  if (!role || !name) return mostrarAlerta("Completa todos los campos obligatorios.");

  if (role === "estudiante") {
    const course = document.getElementById("course").value.trim();
    const level = document.getElementById("level").value;
    const email = document.getElementById("student-email").value.trim();
    const password = document.getElementById("student-password").value.trim();

    if (!course || !level || !email || !password) {
      return mostrarAlerta("Completa todos los campos del estudiante.");
    }

    const existe = estudiantes.some(est => est.email === email);
    if (existe) return mostrarAlerta("Este correo ya está registrado.");

    const nuevoEstudiante = {
      nombre: name,
      curso: course,
      nivel: level,
      email,
      password
    };

    estudiantes.push(nuevoEstudiante);
    localStorage.setItem("estudiantes", JSON.stringify(estudiantes));
    
    // Guardar en el archivo JSON
    guardarEstudiantes(estudiantes);

    // Redirigir al nivel correspondiente
    window.location.href = nivelARuta(level);
  }

  if (role === "docente") {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username === "docente" && password === "1234") {
      localStorage.setItem("sesionDocente", "activa");
      window.location.href = "docente.html"; // Redirigir a la vista docente
    } else {
      mostrarAlerta("Usuario o contraseña incorrectos.");
    }
  }
});

// Función para guardar estudiantes en el archivo JSON
function guardarEstudiantes(estudiantes) {
  fetch('estudiantes.json', {
    method: 'PUT', // Cambiar el método según tu configuración de backend
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(estudiantes)
  });
}

function nivelARuta(nivel) {
  switch (nivel) {
    case "B1": return "Levels/b1.html";
    case "B1+": return "Levels/b1plus.html";
    case "B2": return "Levels/b2.html";
    default: return "#";
  }
}

function mostrarAlerta(mensaje) {
  const container = document.querySelector(".container");
  const alerta = document.createElement("div");
  alerta.className = "alerta";
  alerta.textContent = mensaje;
  container.insertBefore(alerta, container.firstChild);
  setTimeout(() => {
    if (alerta.parentNode) alerta.remove();
  }, 3500);
}