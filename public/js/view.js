async function loadStudy() {
    const studyId = window.location.pathname.split('/').pop();
    const response = await fetch(`/api/studies/${studyId}`);
    const study = await response.json();
    console.log(study)

    document.getElementById('product').textContent = study.product;
    document.getElementById('lot').textContent = study.lot;
    document.getElementById('nature').textContent = study.nature;

    function createTable(title, data) {
        const tableContainer = document.createElement('div');
        const h2 = document.createElement('h2');
        h2.textContent = title;
        tableContainer.appendChild(h2);

        const table = document.createElement('table');
        table.setAttribute('border', '1');

        // Cabeçalho
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = ["Day", "Aspect", "Color", "Odor", "pH", "Viscosity"];
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);
        

        // Corpo da Tabela
        const tbody = document.createElement('tbody');
        data.forEach(entry => {
            const row = document.createElement('tr');

            const dayCell = document.createElement('td');
            dayCell.textContent = entry.day;
            row.appendChild(dayCell);

            const aspectCell = document.createElement('td');
            aspectCell.textContent = entry.aspect;
            row.appendChild(aspectCell);

            const colorCell = document.createElement('td');
            colorCell.textContent = entry.color;
            row.appendChild(colorCell);

            const odorCell = document.createElement('td');
            odorCell.textContent = entry.odor;
            row.appendChild(odorCell);

            const pHCell = document.createElement('td');
            pHCell.textContent = entry.pH || "N/A";
            row.appendChild(pHCell);

            const viscosityCell = document.createElement('td');
            viscosityCell.textContent = entry.viscosity;
            row.appendChild(viscosityCell);

            tbody.appendChild(row);
        });
        table.appendChild(tbody);

        tableContainer.appendChild(table);
        document.getElementById('conditionsTables').appendChild(tableContainer);
    }

    // Leitura Inicial (day0)
    const initialData = Object.keys(study.conditions).flatMap(condition => {
        const day0Data = study.conditions[condition].day0;
        return {
            day: 'day0',
            aspect: day0Data.aspect,
            color: day0Data.color,
            odor: day0Data.odor,
            pH: day0Data.pH,
            viscosity: day0Data.viscosity
        };
    });
    createTable('Estudo Inicial', initialData);

    // Luz Solar
    const luzData = Object.keys(study.conditions.luz).filter(day => day !== 'day0').map(day => ({
        day,
        aspect: study.conditions.luz[day].aspect,
        color: study.conditions.luz[day].color,
        odor: study.conditions.luz[day].odor,
        pH: study.conditions.luz[day].pH,
        viscosity: study.conditions.luz[day].viscosity
    }));
    createTable('LUZ SOLAR', luzData);

    // Escuro
    const escuroData = Object.keys(study.conditions.armario).filter(day => day !== 'day0').map(day => ({
        day,
        aspect: study.conditions.armario[day].aspect,
        color: study.conditions.armario[day].color,
        odor: study.conditions.armario[day].odor,
        pH: study.conditions.armario[day].pH,
        viscosity: study.conditions.armario[day].viscosity
    }));
    createTable('ESCURO', escuroData);

    // Estufa
    const estufaData = Object.keys(study.conditions.estufa).filter(day => day !== 'day0').map(day => ({
        day,
        aspect: study.conditions.estufa[day].aspect,
        color: study.conditions.estufa[day].color,
        odor: study.conditions.estufa[day].odor,
        pH: study.conditions.estufa[day].pH,
        viscosity: study.conditions.estufa[day].viscosity
    }));
    createTable('ESTUFA', estufaData);

    // Geladeira
    const geladeiraData = Object.keys(study.conditions.geladeira).filter(day => day !== 'day0').map(day => ({
        day,
        aspect: study.conditions.geladeira[day].aspect,
        color: study.conditions.geladeira[day].color,
        odor: study.conditions.geladeira[day].odor,
        pH: study.conditions.geladeira[day].pH,
        viscosity: study.conditions.geladeira[day].viscosity
    }));
    createTable('GELADEIRA', geladeiraData);
}

loadStudy();