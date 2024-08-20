async function loadStudies() {
    const response = await fetch('/api/studies');
    const studies = await response.json();
    const studiesList = document.getElementById('studies-list');
    studies.forEach(study => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="/studies/${study._id}">PRODUTO: ${study.product}</br> LOTE:${study.lot}</br> NATUREZA: ${study.nature}`;
        studiesList.appendChild(li);
    });
}
loadStudies();