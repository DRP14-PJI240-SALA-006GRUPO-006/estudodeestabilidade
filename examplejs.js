async function loadStudy() {
    const studyId = window.location.pathname.split('/').pop();
    const response = await fetch(`/api/studies/${studyId}`);
    const study = await response.json();
    
    // Preencher dados básicos do estudo
    document.getElementById('product').textContent = study.product;
    document.getElementById('lot').textContent = study.lot;
    document.getElementById('nature').textContent = study.nature;

    // Preencher os dados para os diferentes ambientes (estufa, luz, armário, geladeira)
    fillConditions('.grid-estufa', study.conditions.estufa);
    fillConditions('.grid-luz', study.conditions.luz);
    fillConditions('.grid-escuro', study.conditions.escuro);
    fillConditions('.grid-geladeira', study.conditions.geladeira);

    // Preencher comentários
    fillComments(study.comments);
}

// Função para preencher as condições de cada ambiente ao longo dos dias
function fillConditions(sectionClass, data) {
    // Preencher para o Dia 0
    document.querySelector(`${sectionClass} .dataValueDia0`).textContent = "Dia 0";  // Se não houver data específica, podemos usar a referência do dia
    document.querySelector(`${sectionClass} .aspectoValueDia0`).textContent = data.day0.aspect;
    document.querySelector(`${sectionClass} .corValueDia0`).textContent = data.day0.color;
    document.querySelector(`${sectionClass} .odorValueDia0`).textContent = data.day0.odor;
    document.querySelector(`${sectionClass} .pHValueDia0`).textContent = data.day0.pH;
    document.querySelector(`${sectionClass} .viscosidadeValueDia0`).textContent = data.day0.viscosity;

    // Preencher para o Dia 7
    document.querySelector(`${sectionClass} .dataValueDia7`).textContent = "Dia 7";  // Se não houver data específica, podemos usar a referência do dia
    document.querySelector(`${sectionClass} .aspectoValueDia7`).textContent = data.day7.aspect;
    document.querySelector(`${sectionClass} .corValueDia7`).textContent = data.day7.color;
    document.querySelector(`${sectionClass} .odorValueDia7`).textContent = data.day7.odor;
    document.querySelector(`${sectionClass} .pHValueDia7`).textContent = data.day7.pH;
    document.querySelector(`${sectionClass} .viscosidadeValueDia7`).textContent = data.day7.viscosity;

    // Preencher para o Dia 15
    document.querySelector(`${sectionClass} .dataValueDia15`).textContent = "Dia 15";  // Se não houver data específica, podemos usar a referência do dia
    document.querySelector(`${sectionClass} .aspectoValueDia15`).textContent = data.day15.aspect;
    document.querySelector(`${sectionClass} .corValueDia15`).textContent = data.day15.color;
    document.querySelector(`${sectionClass} .odorValueDia15`).textContent = data.day15.odor;
    document.querySelector(`${sectionClass} .pHValueDia15`).textContent = data.day15.pH;
    document.querySelector(`${sectionClass} .viscosidadeValueDia15`).textContent = data.day15.viscosity;

    // Preencher para o Dia 30
    document.querySelector(`${sectionClass} .dataValueDia30`).textContent = "Dia 30";  // Se não houver data específica, podemos usar a referência do dia
    document.querySelector(`${sectionClass} .aspectoValueDia30`).textContent = data.day30.aspect;
    document.querySelector(`${sectionClass} .corValueDia30`).textContent = data.day30.color;
    document.querySelector(`${sectionClass} .odorValueDia30`).textContent = data.day30.odor;
    document.querySelector(`${sectionClass} .pHValueDia30`).textContent = data.day30.pH;
    document.querySelector(`${sectionClass} .viscosidadeValueDia30`).textContent = data.day30.viscosity;

    // Preencher para o Dia 60
    document.querySelector(`${sectionClass} .dataValueDia60`).textContent = "Dia 60";  // Se não houver data específica, podemos usar a referência do dia
    document.querySelector(`${sectionClass} .aspectoValueDia60`).textContent = data.day60.aspect;
    document.querySelector(`${sectionClass} .corValueDia60`).textContent = data.day60.color;
    document.querySelector(`${sectionClass} .odorValueDia60`).textContent = data.day60.odor;
    document.querySelector(`${sectionClass} .pHValueDia60`).textContent = data.day60.pH;
    document.querySelector(`${sectionClass} .viscosidadeValueDia60`).textContent = data.day60.viscosity;

    // Preencher para o Dia 90
    document.querySelector(`${sectionClass} .dataValueDia90`).textContent = "Dia 90";  // Se não houver data específica, podemos usar a referência do dia
    document.querySelector(`${sectionClass} .aspectoValueDia90`).textContent = data.day90.aspect;
    document.querySelector(`${sectionClass} .corValueDia90`).textContent = data.day90.color;
    document.querySelector(`${sectionClass} .odorValueDia90`).textContent = data.day90.odor;
    document.querySelector(`${sectionClass} .pHValueDia90`).textContent = data.day90.pH;
    document.querySelector(`${sectionClass} .viscosidadeValueDia90`).textContent = data.day90.viscosity;
}

// Função para preencher os comentários
function fillComments(comments) {
    const commentsContainer = document.querySelector('.comments');
    commentsContainer.innerHTML = ''; // Limpar comentários anteriores, se houver

    Object.values(comments).forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.innerHTML = `
            <p><strong>Comentário:</strong> ${comment.comment}</p>
            <p><strong>Data:</strong> ${new Date(comment.date).toLocaleDateString()}</p>
        `;
        commentsContainer.appendChild(commentElement);
    });
}

// Carregar os dados ao carregar a página
loadStudy();
