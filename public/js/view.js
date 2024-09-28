async function loadStudy() {
    try {
        const studyId = window.location.pathname.split('/').pop();
        const response = await fetch(`/api/studies/${studyId}`);
        if (!response.ok) {
            throw new Error('Erro na rede: ' + response.statusText);
        }
        const study = await response.json();
        console.log(study)
        
        document.getElementById('product').textContent = study.product;
        document.getElementById('lot').textContent = study.lot;
        document.getElementById('nature').textContent = study.nature;
        document.getElementById('startDate').textContent = study.startDate;
        document.getElementById('aspect').textContent = study.conditions.luz.day0.aspect;
        document.getElementById('color').textContent = study.conditions.luz.day0.color;
        document.getElementById('odor').textContent = study.conditions.luz.day0.odor;
        document.getElementById('pH').textContent = study.conditions.luz.day0.pH;
        document.getElementById('viscosity').textContent = study.conditions.luz.day0.viscosity;
    } catch (error) {
        console.error('Falha ao carregar o estudo:', error);
 
    }
}

loadStudy();
