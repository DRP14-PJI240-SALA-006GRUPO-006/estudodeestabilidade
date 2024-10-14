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
    const studies = await response.json();
    const studiesList = document.getElementById('studies-list');
    
    studies.forEach(study => {
        const li = document.createElement('li');
        const nextAnalysisDate = getNextAnalysisDate(study);
        const countdown = getCountdown(nextAnalysisDate);
        
        li.innerHTML = `
            <a href="/studies/${study._id}">
                PRODUTO: ${study.product}<br>
                LOTE: ${study.lot}<br>
                NATUREZA: ${study.nature}<br>
                Próxima análise em: ${countdown}
            </a>`;
        studiesList.appendChild(li);
        
        // Atualiza o contador a cada segundo
        setInterval(() => {
            const updatedCountdown = getCountdown(nextAnalysisDate);
            li.querySelector('a').innerHTML = `
                PRODUTO: ${study.product}<br>
                LOTE: ${study.lot}<br>
                NATUREZA: ${study.nature}<br>
                Próxima análise em: ${updatedCountdown}
            `;
        }, 1000);
    });
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