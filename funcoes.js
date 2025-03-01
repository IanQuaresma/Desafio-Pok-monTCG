const PokeName = document.getElementById('PokeName');
const procurar = document.getElementById('procurar');
const content = document.getElementById('content');

const fetchApi = async (value) => {
    try {
        if (!value) {
            throw new Error("Digite um nome antes de pesquisar.");
        }

        const response = await fetch(`https://api.pokemontcg.io/v2/cards?q=name:${value.toLowerCase()}`);
        const data = await response.json();

        if (!data.data || data.data.length === 0) {
            throw new Error("Nenhum carta encontrado.");
        }

        return data.data[0];
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        return null;
    }
};

procurar.addEventListener('click', async (event) => {
    event.preventDefault();
    
    const nomePokemon = PokeName.value.trim();
    const card = await fetchApi(nomePokemon);

    if (!card) {
        content.innerHTML = "<p style='color: red;'>Pokémon não encontrado. Tente outro nome.</p>";
        return;
    }

    content.innerHTML = `
        <h2>${card.name}</h2>
        <img src="${card.images.large}" alt="${card.name}">
        <p><strong>Tipo:</strong> ${card.types ? card.types.join(", ") : "Desconhecido"}</p>
        <p><strong>Raridade:</strong> ${card.rarity || "Desconhecida"}</p>
    `;
});

async function loadCards() {
    const url = "https://api.pokemontcg.io/v2/cards";
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        console.log(data);

        const container = document.getElementById("cardContainer");
        container.innerHTML = "";

        if (data.data && data.data.length > 0) {
            data.data.slice(0, 10).forEach(card => { 
                const cardElement = document.createElement("div");
                cardElement.classList.add("card");
                cardElement.innerHTML = `
                    <h3>${card.name}</h3>
                    <img src="${card.images.small}" alt="${card.name}">
                    <p><strong>Tipo:</strong> ${card.types ? card.types.join(", ") : "Desconhecido"}</p>
                    <p><strong>Raridade:</strong> ${card.rarity || "Desconhecida"}</p>
                `;
                container.appendChild(cardElement);
            });
        } else {
            container.innerHTML = "<p>Nenhuma carta encontrada.</p>";
        }
    } catch (error) {
        console.error("Erro ao buscar cartas:", error);
        alert("Ocorreu um erro ao carregar as cartas.");
    }
}

const cartasButton = document.getElementById('card');
cartasButton.addEventListener('click', (event) => {
    event.preventDefault();
    loadCards();
});
