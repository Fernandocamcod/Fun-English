const estudiantes = JSON.parse(localStorage.getItem("estudiantes")) || [];

document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const role = document.getElementById("login-role").value;
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();

  if (!role || !email || !password) {
    return mostrarAlerta("Completa todos los campos.");
  }

  if (role === "estudiante") {
    const estudiante = estudiantes.find(est => est.email === email && est.password === password);
    if (estudiante) {
      localStorage.setItem("sesionEstudiante", JSON.stringify(estudiante));
      window.location.href = nivelARuta(estudiante.nivel); // Redirigir al nivel correcto
    } else {
      mostrarAlerta("Usuario o contraseña incorrectos.");
    }
  }

  if (role === "docente") {
    if (email === "docente" && password === "1234") {
      localStorage.setItem("sesionDocente", "activa");
      document.getElementById("register-section").classList.add("hidden"); // Ocultar sección de registro
      mostrarListaEstudiantes(); // Mostrar la lista de estudiantes
    } else {
      mostrarAlerta("Wrong Password or User.");
    }
  }
});

function mostrarListaEstudiantes() {
  document.getElementById("login-form").classList.add("hidden");
  document.getElementById("teacher-section").classList.remove("hidden");
  const studentList = document.getElementById("student-list");
  studentList.innerHTML = "";

  if (estudiantes.length === 0) {
    studentList.innerHTML = "<p>No students registered yet.</p>";
    return;
  }

  estudiantes.forEach((est, i) => {
    const div = document.createElement("div");
    div.className = "student";
    div.innerHTML = `
      <strong>${i + 1}. ${est.nombre}</strong><br>
      Curso: ${est.curso}<br>
      Nivel: ${est.nivel}<br>
      Correo: ${est.email}<br>
      <button onclick="eliminarEstudiante('${est.email}')">Eliminar</button>
    `;
    studentList.appendChild(div);
  });
}

function verProgreso(email) {
  const estudiante = estudiantes.find(est => est.email === email);
  if (estudiante) {
    const progreso = Object.entries(estudiante.progreso).map(([nivel, estado]) => {
      return `<strong>${nivel}</strong>: ${estado}`;
    }).join("<br>");
    alert(`Progreso de ${estudiante.nombre}:\n${progreso}`);
  }
}

function eliminarEstudiante(email) {
  const index = estudiantes.findIndex(est => est.email === email);
  if (index !== -1) {
    estudiantes.splice(index, 1);
    localStorage.setItem("estudiantes", JSON.stringify(estudiantes));
    mostrarListaEstudiantes(); // Actualizar la lista después de eliminar
    mostrarAlerta("Estudiante eliminado con éxito.");
  }
}

document.getElementById("cerrar-btn").addEventListener("click", () => {
  localStorage.removeItem("sesionDocente");
  location.reload(); // Recargar la página para volver a mostrar el formulario de inicio de sesión
});

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

function nivelARuta(nivel) {
  switch (nivel) {
    case "B1": return "Levels/b1.html";
    case "B1+": return "Levels/b1plus.html";
    case "B2": return "Levels/b2.html";
    default: return "#";
  }
}
