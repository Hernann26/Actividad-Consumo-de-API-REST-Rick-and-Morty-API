// Endpoint con los primeros 10 personajes
const API_URL = "https://rickandmortyapi.com/api/character/1,2,3,4,5,6,7,8,9,10";

// Estructura de memoria local (Caché)
let charactersData = null;

// Elementos del DOM
const btnLoad = document.getElementById("btn-load");
const btnGroup = document.getElementById("btn-group");
const btnCard = document.getElementById("btn-card");

const dataStatus = document.getElementById("data-status");
const listSection = document.getElementById("list-section");
const groupSection = document.getElementById("group-section");
const cardSection = document.getElementById("card-section");

const charactersList = document.getElementById("characters-list");
const speciesGroup = document.getElementById("species-group");
const characterCard = document.getElementById("character-card");

// --- REQUERIMIENTO PRINCIPAL: OBTENER Y OPTIMIZAR DATOS ---
async function fetchCharacters() {
  // Si ya tenemos los datos en memoria, los retornamos directamente
  if (charactersData) {
    console.log("⚡ [OPTIMIZACIÓN]: Datos recuperados desde memoria local (Sin peticiones de red).");
    dataStatus.textContent = "Datos cargados desde la memoria local (Optimizado).";
    return charactersData;
  }

  // Si no hay datos, hacemos la petición HTTP (Solo la primera vez)
  console.log("🌐 [API]: Realizando petición HTTP externa a Rick and Morty API...");
  dataStatus.textContent = "Cargando datos desde la API externa...";
  
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Error al consultar la API");
    
    // Guardamos la respuesta en la variable global
    charactersData = await response.json();
    
    // Habilitamos los botones que dependen de los datos
    btnGroup.disabled = false;
    btnCard.disabled = false;
    
    return charactersData;
  } catch (error) {
    console.error("Error crítico:", error);
    dataStatus.textContent = "Hubo un error al cargar los datos.";
  }
}

// --- FUNCIÓN 1: Mostrar Lista Básica ---
btnLoad.addEventListener("click", async () => {
  const data = await fetchCharacters();
  if (!data) return;

  // Limpiar e inyectar datos
  charactersList.innerHTML = "";
  data.forEach(char => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>ID:</strong> ${char.id} - <strong>Nombre:</strong> ${char.name} - <strong>Especie:</strong> ${char.species}`;
    charactersList.appendChild(li);
  });

  // Mostrar sección en la interfaz
  listSection.classList.remove("hidden");
});

// --- FUNCIÓN 2: Agrupar por Especie (.reduce) ---
btnGroup.addEventListener("click", () => {
  if (!charactersData) return;

  // Agrupamos usando .reduce()
  const grouped = charactersData.reduce((acc, char) => {
    if (!acc[char.species]) {
      acc[char.species] = [];
    }
    acc[char.species].push(char);
    return acc;
  }, {});

  // Limpiar e inyectar en HTML
  speciesGroup.innerHTML = "";
  
  for (const specie in grouped) {
    const specieTitle = document.createElement("h3");
    specieTitle.textContent = specie;
    
    const ol = document.createElement("ol");
    grouped[specie].forEach(char => {
      const li = document.createElement("li");
      li.textContent = `${char.name} (ID: ${char.id})`;
      ol.appendChild(li);
    });
    
    speciesGroup.appendChild(specieTitle);
    speciesGroup.appendChild(ol);
  }

  groupSection.classList.remove("hidden");
});

// --- FUNCIÓN 3: Ficha Individual ---
btnCard.addEventListener("click", () => {
  if (!charactersData) return;

  // Seleccionamos un personaje (Por ejemplo, el primero: Rick Sanchez)
  const targetChar = charactersData[0];

  // Renderizado de la tarjeta
  characterCard.innerHTML = `
    <img src="${targetChar.image}" alt="${targetChar.name}">
    <div class="card-info">
      <p><strong>ID:</strong> ${targetChar.id}</p>
      <p><strong>Nombre:</strong> ${targetChar.name}</p>
      <p><strong>Especie:</strong> ${targetChar.species}</p>
    </div>
  `;

  cardSection.classList.remove("hidden");
});