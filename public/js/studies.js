let allStudies = [];

async function loadStudies() {
    const token = sessionStorage.getItem('token');
    if (!token) {
        alert('Você precisa estar logado para buscar um estudo.');
        window.location.href = '/login';
        return;
    }

    const response = await fetch('/api/studies', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
        }
    });
    allStudies = await response.json();
    renderStudies(allStudies);
    setupEventListeners();
}

function renderStudies(studies) {
    const studiesList = document.getElementById('studies-list');
    studiesList.innerHTML = '';
    
    studies.forEach(study => {
        const card = createStudyCard(study);
        studiesList.appendChild(card);
    });
}

function createStudyCard(study) {
    const card = document.createElement('div');
    card.className = 'study-card';
    const nextAnalysisDate = getNextAnalysisDate(study);
    const countdown = getCountdown(nextAnalysisDate);
    
    card.innerHTML = `
        <a href="/studies/${study._id}">
            <h2>${study.product}</h2>
            <p class="study-info">Lote: ${study.lot}</p>
            <p class="study-info">Natureza: ${study.nature}</p>
            <p class="countdown">Próxima análise em: ${countdown}</p>
        </a>`;
    
    // Atualiza o contador a cada segundo
    setInterval(() => {
        const updatedCountdown = getCountdown(nextAnalysisDate);
        card.querySelector('.countdown').textContent = `Próxima análise em: ${updatedCountdown}`;
    }, 1000);

    return card;
}

function setupEventListeners() {
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');

    searchInput.addEventListener('input', filterAndSortStudies);
    sortSelect.addEventListener('change', filterAndSortStudies);
}

function filterAndSortStudies() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const sortMethod = document.getElementById('sort-select').value;

    let filteredStudies = allStudies.filter(study => 
        study.product.toLowerCase().includes(searchTerm)
    );

    filteredStudies.sort((a, b) => {
        switch (sortMethod) {
            case 'newest':
                return new Date(b.startDate) - new Date(a.startDate);
            case 'oldest':
                return new Date(a.startDate) - new Date(b.startDate);
            case 'next-analysis':
                const nextA = getNextAnalysisDate(a);
                const nextB = getNextAnalysisDate(b);
                if (!nextA && !nextB) return 0;
                if (!nextA) return 1;
                if (!nextB) return -1;
                return nextA - nextB;
        }
    });

    renderStudies(filteredStudies);
}

function getNextAnalysisDate(study) {
    const today = new Date();
    const startDate = new Date(study.startDate);
    const analysisDays = [0, 7, 15, 30, 60, 90];
    
    for (let days of analysisDays) {
        const analysisDate = new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000);
        if (analysisDate > today) {
            return analysisDate;
        }
    }
    
    return null; // Retorna null se todas as análises já passaram
}

function getCountdown(date) {
    if (!date) return "Todas as análises concluídas";
    
    const now = new Date();
    const diff = date - now;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

loadStudies();