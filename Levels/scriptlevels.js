// ------------------------------
// TAB MANAGEMENT
// ------------------------------
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('collapsed');
}

const tabButtons = document.querySelectorAll('.subtab-button');
const tabContents = document.querySelectorAll('.subtab-content');

tabButtons.forEach(button => {
  button.addEventListener('click', (evt) => {
    const target = button.getAttribute('onclick').match(/'(b1-[a-z-]+)'/)[1];
    if (!target) return;

    tabButtons.forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
      btn.setAttribute('tabindex', '-1');
    });
    tabContents.forEach(content => {
      content.hidden = true;
      content.style.display = 'none';
    });

    button.classList.add('active');
    button.setAttribute('aria-selected', 'true');
    button.setAttribute('tabindex', '0');

    const content = document.getElementById(target);
    if (content) {
      content.hidden = false;
      content.style.display = 'block';
    }
  });
});

// LISTENING
const sharedAudio = new Audio();
document.querySelectorAll('.play-word').forEach(item => {
  item.addEventListener('click', () => {
    sharedAudio.pause();
    sharedAudio.src = item.getAttribute('data-audio');
    sharedAudio.play();
  });
});

function openSubTab(evt, subTabId) {
  const subtabs = document.querySelectorAll('.subtab-content');
  const buttons = document.querySelectorAll('.subtab-button');

  subtabs.forEach(tab => tab.style.display = 'none');
  buttons.forEach(btn => btn.classList.remove('active'));

  const targetSubtab = document.getElementById(subTabId);
  if (targetSubtab) targetSubtab.style.display = 'block';

  if (evt?.currentTarget) {
    evt.currentTarget.classList.add('active');
  }
}

//-------------------------------
// LISTENING B1+ y B2
//-------------------------------

function leerFrase(texto) {
  if (!('speechSynthesis' in window)) {
    alert('Tu navegador no soporta síntesis de voz. Usa Chrome, Edge o Safari.');
    return;
  }

  const frase = new SpeechSynthesisUtterance(texto);
  frase.lang = "en-US";
  frase.rate = 0.9;
  frase.pitch = 1;

  speechSynthesis.cancel();
  speechSynthesis.speak(frase);
}

//-------------------------------
// ACTIVITIES 
//-------------------------------
function checkAnswer(button, isCorrect) {
  const card = button.closest('.activity-card');
  const result = card.querySelector('.message-result');
  const retryBtn = card.querySelector('.retry-btn');
  const allButtons = card.querySelectorAll('button');

  // Desactivar todos los botones de respuesta
  allButtons.forEach(btn => {
    if (btn !== retryBtn) btn.disabled = true;
  });

  // Mostrar resultado
  if (isCorrect) {
    result.textContent = "✅ Correct! Well done.";
    result.classList.remove('error');
    result.classList.add('success');

    // Guardar progreso si es correcto
    const actividadId = card.getAttribute('data-actividad-id');
    if (actividadId) {
      guardarProgreso("Grammar", actividadId);
    }

  } else {
    result.textContent = "❌ Not quite right. Try again!";
    result.classList.remove('success');
    result.classList.add('error');
    retryBtn.style.display = 'inline-block';
  }
}

function resetCard(button) {
  const card = button.closest('.activity-card');
  const result = card.querySelector('.message-result');
  const retryBtn = card.querySelector('.retry-btn');
  const allButtons = card.querySelectorAll('button');

  // Resetear botones
  allButtons.forEach(btn => {
    if (btn !== retryBtn) btn.disabled = false;
  });

  // Limpiar resultado
  result.textContent = '';
  result.classList.remove('success', 'error');
  retryBtn.style.display = 'none';
}


//-------------------------------
// MATCHING ACTIVITY
//-------------------------------
const pairs = [
  { word: "Neighbor", image: "Neighbor.jpg" },
  { word: "To graduate", image: "To graduate.jpg" },
  { word: "Ticket", image: "Ticket.jpg" },
  { word: "Friend", image: "Friend.jpg" },
  { word: "Luggage", image: "Luggage.jpg" }
];

let selectedWord = null;
let selectedImage = null;
let matchedPairs = [];

function setupMatchActivity() {
  const wordRow = document.getElementById("wordRow");
  const imageRow = document.getElementById("imageRow");
  const result = document.getElementById("matchResult");

  wordRow.innerHTML = "";
  imageRow.innerHTML = "";
  result.textContent = "";
  result.className = "message-result";
  matchedPairs = [];

  const shuffledWords = [...pairs].sort(() => Math.random() - 0.5);
  const shuffledImages = [...pairs].sort(() => Math.random() - 0.5);

  shuffledWords.forEach((pair, index) => {
    const wordDiv = document.createElement("div");
    wordDiv.textContent = pair.word;
    wordDiv.className = "match-item";
    wordDiv.dataset.word = pair.word;
    wordDiv.onclick = () => selectWord(wordDiv);
    wordRow.appendChild(wordDiv);
  });

  shuffledImages.forEach((pair, index) => {
    const img = document.createElement("img");
    img.src = pair.image;
    img.alt = pair.word;
    img.className = "match-image";
    img.dataset.word = pair.word;
    img.onclick = () => selectImage(img);
    imageRow.appendChild(img);
  });
}

function selectWord(element) {
  selectedWord = element;
  highlightSelection(element);
  tryMatch();
}

function selectImage(element) {
  selectedImage = element;
  highlightSelection(element);
  tryMatch();
}

function highlightSelection(element) {
  document.querySelectorAll(".match-item, .match-image").forEach(el => {
    if (!matchedPairs.some(pair => pair.word === el.dataset.word)) {
      el.className = el.className.replace(/pair-color-\d/, "").trim();
    }
  });
}

function tryMatch() {
  if (selectedWord && selectedImage) {
    const word = selectedWord.dataset.word;
    const imageWord = selectedImage.dataset.word;

    if (word === imageWord && !matchedPairs.some(pair => pair.word === word)) {
      const pairIndex = matchedPairs.length;
      selectedWord.classList.add(`pair-color-${pairIndex}`);
      selectedImage.classList.add(`pair-color-${pairIndex}`);
      matchedPairs.push({ word });

      document.getElementById("matchResult").textContent = `${matchedPairs.length} of ${pairs.length} matched`;

      if (matchedPairs.length === pairs.length) {
        document.getElementById("matchResult").textContent = "✅ All pairs matched!";
        document.getElementById("matchResult").classList.add("success");
      }
    } else {
      document.getElementById("matchResult").textContent = "❌ Incorrect match. Try again.";
      document.getElementById("matchResult").classList.add("error");
    }

    selectedWord = null;
    selectedImage = null;
  }
}

// ← Ejecuta la actividad automáticamente al cargar
window.addEventListener("DOMContentLoaded", setupMatchActivity);


//-------------------------------
// DRAG AND DROP ACTIVITY
//-------------------------------

// Frase correcta en orden
const correctOrder = ["I", "always", "have", "breakfast", "at", "7:30", "o'clock."];

// Palabras disponibles (puedes cambiar el orden si lo deseas)
const words = [...correctOrder];

function setupClickWords() {
  const wordOptions = document.getElementById('wordOptions');
  const sentenceBox = document.getElementById('sentenceBox');
  const result = document.querySelector('#click-drop-activity .message-result');
  const retryBtn = document.querySelector('#click-drop-activity .retry-btn');

  // Limpiar contenido anterior
  wordOptions.innerHTML = '';
  sentenceBox.innerHTML = '';
  result.textContent = '';
  result.className = 'message-result';
  retryBtn.style.display = 'none';

  // Mezclar palabras
  const shuffled = words
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

  // Crear botones para cada palabra
  shuffled.forEach(word => {
    const btn = document.createElement('button');
    btn.textContent = word;
    btn.className = 'word-button';
    btn.onclick = () => {
      btn.disabled = true;
      const span = document.createElement('span');
      span.textContent = word;
      span.className = 'word-button';
      sentenceBox.appendChild(span);
    };
    wordOptions.appendChild(btn);
  });
}

function checkClickOrder() {
  const sentenceBox = document.getElementById('sentenceBox');
  const result = document.querySelector('#click-drop-activity .message-result');
  const retryBtn = document.querySelector('#click-drop-activity .retry-btn');

  const currentWords = Array.from(sentenceBox.children).map(el => el.textContent);
  const isCorrect = currentWords.length === correctOrder.length &&
                    currentWords.every((word, i) => word === correctOrder[i]);

  if (isCorrect) {
    result.textContent = "✅ ¡Correcto! Bien hecho.";
    result.classList.remove('error');
    result.classList.add('success');
  } else {
    result.textContent = "❌ No está del todo bien. ¡Intenta otra vez!";
    result.classList.remove('success');
    result.classList.add('error');
    retryBtn.style.display = 'inline-block';
  }
}

// Ejecutar automáticamente al cargar la página
window.addEventListener("DOMContentLoaded", setupClickWords);



//-------------------------------
// SPEECH RECOGNITION Y SÍNTESIS DE VOZ
//-------------------------------

document.addEventListener("DOMContentLoaded", () => {
  if (!("SpeechRecognition" in window) && !("webkitSpeechRecognition" in window)) {
    console.warn("Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge.");
    return;
  }

  document.querySelectorAll(".activity-card").forEach((card) => {
    const data = card.getAttribute("data-dialogos");
    if (!data) return;

    let dialogos;
    try {
      dialogos = JSON.parse(data);
    } catch (e) {
      console.error("Invalid dialogos JSON:", e);
      return;
    }

    if (!Array.isArray(dialogos) || dialogos.length === 0 || !dialogos.every(d => d.pregunta && d.respuesta)) {
      console.error("Los datos de diálogos están incompletos o mal formateados.");
      return;
    }

    let currentIndex = 0;

    const fraseObjetivo = card.querySelector(".fraseObjetivo");
    const resultado = card.querySelector(".resultado");
    const mensajeError = card.querySelector(".mensajeError");
    const retryBtn = card.querySelector(".retryBtn");
    const messageResult = card.querySelector(".message-result");

    const speakBtn = card.querySelector(".speakBtn");
    const repeatBtn = card.querySelector(".repeatPhraseBtn");
    const nextBtn = card.querySelector(".nextBtn");
    const repeatAnswerBtn = card.querySelector(".repeatAnswerBtn");

    if (!fraseObjetivo || !speakBtn) return;

    fraseObjetivo.textContent = `"${dialogos[currentIndex].pregunta}"`;

    speakBtn.addEventListener("click", () => startRecognition());
    if (retryBtn) {
      retryBtn.addEventListener("click", () => startRecognition());
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", siguienteFrase);
    }
    if (repeatBtn) {
      repeatBtn.addEventListener("click", () => {
        reproducirFrase(dialogos[currentIndex].pregunta);
      });
    }
    if (repeatAnswerBtn) {
      repeatAnswerBtn.addEventListener("click", () => {
        reproducirFrase(dialogos[currentIndex].respuesta);
      });
    }

    function startRecognition() {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.start();

      recognition.onresult = function (event) {
        const speech = event.results[0][0].transcript.trim();
        const expected = dialogos[currentIndex].pregunta;

        if (resultado) {
          resultado.textContent = `You said: "${speech}"`;
        }

        if (normalize(speech) === normalize(expected)) {
          if (mensajeError) mensajeError.classList.add("hidden");
          if (retryBtn) retryBtn.classList.add("hidden");

          if (messageResult) {
            messageResult.innerHTML = `✅ Correct!<br><strong>💬 ${dialogos[currentIndex].respuesta}</strong>`;
            messageResult.className = "correct-message message-result";
          }

          if (repeatAnswerBtn) repeatAnswerBtn.classList.remove("hidden");
          reproducirFrase(dialogos[currentIndex].respuesta);
        } else {
          if (mensajeError) mensajeError.classList.remove("hidden");
          if (retryBtn) retryBtn.classList.remove("hidden");
          if (messageResult) messageResult.textContent = "";
          if (repeatAnswerBtn) repeatAnswerBtn.classList.add("hidden");
        }
      };

      recognition.onerror = function (event) {
        if (resultado) {
          resultado.textContent = "🎤 Error: " + event.error;
        }
      };
    }

    function siguienteFrase() {
      currentIndex = (currentIndex + 1) % dialogos.length;
      fraseObjetivo.textContent = `"${dialogos[currentIndex].pregunta}"`;
      if (resultado) resultado.textContent = "";
      if (mensajeError) mensajeError.classList.add("hidden");
      if (retryBtn) retryBtn.classList.add("hidden");
      if (repeatAnswerBtn) repeatAnswerBtn.classList.add("hidden");
      if (messageResult) messageResult.textContent = "";
    }

    function reproducirFrase(texto) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = 'en-US';
      utterance.rate = 0.95;
      speechSynthesis.speak(utterance);
    }

    function normalize(str) {
      return str.toLowerCase()
                .replace(/[^a-z0-9 ]/gi, "")
                .replace(/\s+/g, " ")
                .trim();
    }
  });
});

//-------------------------------
// READING
//-------------------------------

function speakReadingText(btn) {
  const article = btn.closest('article');
  const paragraphs = article.querySelectorAll('p');
  const text = Array.from(paragraphs).map(p => p.textContent).join(' ');

  speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 1;
  utterance.pitch = 1;

  const stopBtn = article.querySelector('.stop-btn');
  if (stopBtn) stopBtn.style.display = 'inline-block';

  utterance.onend = () => {
    if (stopBtn) stopBtn.style.display = 'none';
  };

  utterance.onerror = () => {
    if (stopBtn) stopBtn.style.display = 'none';
  };

  speechSynthesis.speak(utterance);
}

function stopReading(btn) {
  speechSynthesis.cancel();
  btn.style.display = 'none';
}

//-------------------------------
// PROGRESS MANAGEMENT
//-------------------------------

// Variables globales para progreso
let subtabOrder = [];
let currentSubtabIndex = 0;

// Inicializar navegación secuencial
function iniciarConSoloListening() {
  // Obtener todas las subtabs de la página actual
  subtabOrder = Array.from(document.querySelectorAll(".subtab-content"))
    .map(section => section.id)
    .filter(id => id && id.includes("-")); // Filtrar IDs válidos
  
  if (subtabOrder.length === 0) return;
  
  const subtabsNav = document.getElementById("subtabs-navigation");
  if (subtabsNav) subtabsNav.style.display = "none";

  // Mostrar solo la primera subtab
  subtabOrder.forEach((id, index) => {
    const section = document.getElementById(id);
    if (section) section.style.display = index === 0 ? "block" : "none";
  });

  currentSubtabIndex = 0;
  crearBarraProgreso();
  actualizarBarraProgreso();
}

// Navegar a la siguiente subtab
function mostrarSiguienteSubtab() {
  // Reproducir audio motivacional si existe
  const audio = document.getElementById("audio-good-job");
  if (audio) {
    audio.currentTime = 0;
    audio.play().catch(e => console.log("No se pudo reproducir audio:", e));
  }

  const subtabsNav = document.getElementById("subtabs-navigation");
  if (subtabsNav) subtabsNav.style.display = "flex";

  const currentId = subtabOrder[currentSubtabIndex];
  const nextId = subtabOrder[currentSubtabIndex + 1];

  const current = document.getElementById(currentId);
  const next = document.getElementById(nextId);

  if (current) current.style.display = "none";
  if (next) next.style.display = "block";

  document.querySelectorAll(".subtab-button").forEach(btn => btn.classList.remove("active"));

  const nextBtn = Array.from(document.querySelectorAll(".subtab-button")).find(b => {
    const onclick = b.getAttribute("onclick");
    return onclick && onclick.includes(nextId);
  });
  
  if (nextBtn) nextBtn.classList.add("active");

  currentSubtabIndex++;
  actualizarBarraProgreso();

  // Ocultar botón "Next" si es la última subtab
  if (currentSubtabIndex >= subtabOrder.length - 1) {
    const nextBtnContainer = document.getElementById("next-section-btn");
    if (nextBtnContainer) nextBtnContainer.style.display = "none";
  }
}

// Crear barra de progreso
function crearBarraProgreso() {
  if (!document.getElementById("barra-progreso")) {
    const barra = document.createElement("div");
    barra.id = "barra-progreso";
    barra.style.width = "100%";
    barra.style.background = "#ddd";
    barra.style.borderRadius = "6px";
    barra.style.overflow = "hidden";
    barra.style.margin = "20px 0";

    const progreso = document.createElement("div");
    progreso.id = "progreso-interno";
    progreso.style.height = "14px";
    progreso.style.width = "0%";
    progreso.style.background = "#4caf50";
    progreso.style.transition = "width 0.4s ease";

    barra.appendChild(progreso);
    
    // Insertar la barra en un lugar apropiado
    const contenedor = document.querySelector(".subtabs")?.parentNode || 
                      document.querySelector(".subtab-content")?.parentNode || 
                      document.body;
    contenedor.insertBefore(barra, contenedor.firstChild);
  }
}

// Actualizar barra de progreso
function actualizarBarraProgreso() {
  const progreso = document.getElementById("progreso-interno");
  if (progreso && subtabOrder.length > 0) {
    const porcentaje = ((currentSubtabIndex + 1) / subtabOrder.length) * 100;
    progreso.style.width = porcentaje + "%";
  }
}

//-------------------------------
// RESULTS MANAGEMENT
//-------------------------------

// Función para mostrar resultado final
function mostrarResultadoTotal() {
  const mensaje = `✅ Aciertos: ${totalAciertos}/10.`;

  let resultado = document.getElementById("resultado-final");
  if (!resultado) {
    resultado = document.createElement("p");
    resultado.id = "resultado-final";
    resultado.style.fontWeight = "bold";
    resultado.style.marginTop = "1rem";
    resultado.style.fontSize = "1.1rem";
    resultado.style.color = "#333";
    
    // Insertar después del último artículo o en un lugar visible
    const lastArticle = document.querySelector(".activity-card:last-child");
    if (lastArticle) {
      lastArticle.parentNode.insertBefore(resultado, lastArticle.nextSibling);
    } else {
      document.body.appendChild(resultado);
    }
  }

  resultado.textContent = mensaje;
}

//-------------------------------
// LOCALSTORAGE MANAGEMENT
//-------------------------------

// Guardar progreso en localStorage
function guardarProgreso(seccion, actividadId) {
  try {
    const estudiante = JSON.parse(localStorage.getItem("sesionEstudiante"));
    const estudiantes = JSON.parse(localStorage.getItem("estudiantes")) || [];

    const index = estudiantes.findIndex(est => est.username === estudiante.username);
    if (index !== -1) {
      if (!estudiantes[index].progreso) {
        estudiantes[index].progreso = {};
      }
      if (!estudiantes[index].progreso[seccion]) {
        estudiantes[index].progreso[seccion] = {};
      }
      estudiantes[index].progreso[seccion][actividadId] = "completado";

      localStorage.setItem("estudiantes", JSON.stringify(estudiantes));
      localStorage.setItem("sesionEstudiante", JSON.stringify(estudiantes[index]));
    }
  } catch (error) {
    console.error("Error al guardar progreso:", error);
  }
}

//-------------------------------
// INITIALIZATION
//-------------------------------

// Inicializar cuando el DOM esté listo
window.addEventListener("DOMContentLoaded", () => {
  // Inicializar navegación secuencial
  iniciarConSoloListening();
  
  // Inicializar actividad de arrastrar y soltar si existe
  if (typeof setupDragWords === 'function') {
    setupDragWords();
  }

  // Configurar evento para verificar orden de palabras
  const checkBtn = document.getElementById('checkBtn');
  if (checkBtn) {
    checkBtn.addEventListener('click', checkDragOrder);
  }
  
  // Configurar botones de reintento
  document.querySelectorAll(".retry-btn").forEach(btn => {
    btn.addEventListener("click", function () {
      const article = btn.closest("article");

      if (!article) return;

      if (article.id === "drag-drop-activity") {
        setupDragWords();
      } else if (article.classList.contains("matching-activity")) {
        // Función para resetear matching activity si existe
        if (typeof resetMatching === 'function') {
          resetMatching();
        }
      } else {
        resetCard(btn);
      }

      const msg = article.querySelector(".message-result");
      if (msg) {
        msg.textContent = "";
        msg.classList.remove("success", "error", "correct-message");
      }

      article.querySelectorAll("button").forEach(button => {
        button.disabled = false;
        button.classList.remove("correct", "incorrect");
      });

      btn.style.display = "none";
    });
  });
});