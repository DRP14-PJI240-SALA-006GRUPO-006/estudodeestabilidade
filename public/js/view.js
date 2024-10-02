async function loadStudy() {
    const studyId = window.location.pathname.split('/').pop();
    console.log(studyId)
    const response = await fetch(`/api/studies/${studyId}`);
    const study = await response.json();
    console.log(study);

    // Leitura Inicial (day 0)
    document.getElementById('product').textContent = study.product;
    document.getElementById('lot').textContent = study.lot;
    document.getElementById('nature').textContent = study.nature;
    document.getElementById('startDate').textContent = new Date(study.startDate).toLocaleDateString();

    // Função para criar as tabelas com campos editáveis
    function createTable(title, data, conditionKey) {
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
    
        // Corpo da Tabela com inputs editáveis
        //BUG
        //ainda esta bem bugado, nem todos os inputs estao vindo com o id correto
        //mas por enquanto serve, talvez uma solucao na linha 152
        const tbody = document.createElement('tbody');
        data.forEach(entry => {
            const row = document.createElement('tr');
    
            const dayCell = document.createElement('td');
            dayCell.textContent = entry.day;
            row.appendChild(dayCell);
    
            // Gerar ID do caminho para cada campo
            const baseId = `${conditionKey}.${entry.day}`;
    
            // Função auxiliar para criar uma célula de input com ID personalizado
            function createCell(field, value) {
                const cell = document.createElement('td');
                const input = document.createElement('input');
                input.type = 'text';
                input.value = value || '';
                input.id = `${baseId}.${field}`; // ID segue o caminho do objeto
                cell.appendChild(input);
                return cell;
            }
    
            row.appendChild(createCell('aspect', entry.aspect));
            row.appendChild(createCell('color', entry.color));
            row.appendChild(createCell('odor', entry.odor));
            row.appendChild(createCell('pH', entry.pH));
            row.appendChild(createCell('viscosity', entry.viscosity));
    
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
    
        tableContainer.appendChild(table);
        document.getElementById('conditionsTables').appendChild(tableContainer);
    }
    

    // Função para criar observações/comentários editáveis
    function createComments(title, comments) {
        const commentsContainer = document.createElement('div');
        const h2 = document.createElement('h2');
        h2.textContent = title;
        commentsContainer.appendChild(h2);

        Object.keys(comments).forEach(commentKey => {
            const commentObj = comments[commentKey];
            const input = document.createElement('input');
            input.type = 'text';
            input.value = commentObj.comment;
            input.name = `comment-${commentKey}-comment`; // Nome único para cada comentário
            const p = document.createElement('p');
            p.textContent = `ID: ${commentObj._id}, Date: ${new Date(commentObj.date).toLocaleDateString()}`;
            commentsContainer.appendChild(p);
            commentsContainer.appendChild(input);
        });

        document.getElementById('conditionsTables').appendChild(commentsContainer);
    }

    // Função para salvar os dados atualizados
    //BUG
    //o codigo esta carregando mais valores que o necessario para realizar o PUT
    //ao inves de carregar apenas os valores que foram mudados no payload
    //ele carrega valores que nao foram mudados, mantem os valores corretos entao pode nao ser um problema
    //pode virar um problema de performance?
    //se eu mudar mais de um input por vez pode bugar ainda mais?
    async function saveData() {
        const inputs = document.querySelectorAll('input'); // Captura todos os inputs do formulário
        const updatedConditions = {}; // Estrutura de dados para armazenar as alterações
    
        inputs.forEach(input => {
            const originalValue = input.defaultValue; // Valor original quando a página foi carregada
            const currentValue = input.value;
    
            if (originalValue !== currentValue) {
                const path = input.id.split('.'); // Divide o id para gerar o caminho no objeto
                let currentObj = updatedConditions;
    
                // Itera sobre as partes do caminho, criando a estrutura conforme necessário
                for (let i = 0; i < path.length - 1; i++) {
                    const key = path[i];
                    if (!currentObj[key]) {
                        currentObj[key] = {};
                    }
                    currentObj = currentObj[key];
                }
    
                // Define o valor modificado no campo correto
                currentObj[path[path.length - 1]] = currentValue;
            }
        });
    
        // Se não houver alterações, exibe uma mensagem
        if (Object.keys(updatedConditions).length === 0) {
            alert('Nenhuma mudança detectada.');
            return;
        }
    
        // Enviar os dados modificados no PUT
        const token = sessionStorage.getItem('token');
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': `${token}`
            },
            body: JSON.stringify({ conditions: updatedConditions }), // Envia apenas as condições modificadas
            redirect: 'follow'
        };
    
        const saveResponse = await fetch(`/api/studies/${studyId}`, requestOptions);
    
        if (saveResponse.ok) {
            alert('Dados salvos com sucesso!');
        } else {
            alert('Erro ao salvar os dados.');
        }
    }
    

    // Mapeia as condições e cria tabelas automaticamente
    //BUG
    //talvez mudando o nome das condicoes resolve o problema do mapeamento de id dos inputs
    //porem talvez seja melhor manter esses nomes e recriar o schema do banco com eles
    const conditions = {
        'LUZ SOLAR': study.conditions.luz,
        'ESCURO': study.conditions.armario,
        'ESTUFA': study.conditions.estufa,
        'GELADEIRA': study.conditions.geladeira
    };

    // Itera pelas condições para gerar as tabelas
    for (const [conditionTitle, conditionData] of Object.entries(conditions)) {
        const conditionTableData = Object.keys(conditionData)
            .filter(day => day !== 'day0') // Exclui a leitura inicial
            .map(day => ({
                day,
                aspect: conditionData[day].aspect,
                color: conditionData[day].color,
                odor: conditionData[day].odor,
                pH: conditionData[day].pH,
                viscosity: conditionData[day].viscosity
            }));

        createTable(conditionTitle, conditionTableData, conditionTitle.toLowerCase().replace(/\s/g, ''));
    }

    // Observações
    if (study.comments && Object.keys(study.comments).length > 0) {
        createComments('OBSERVAÇÕES:', study.comments);
    }

    // Adiciona o botão "Salvar" no formulário
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Salvar';
    saveButton.type = 'button';
    saveButton.addEventListener('click', saveData);
    document.getElementById('conditionsTables').appendChild(saveButton);
}

// Cria o formulário que vai englobar os inputs
const form = document.createElement('form');
form.id = 'studyForm';
document.body.appendChild(form);

// Elemento para as tabelas
const conditionsTables = document.createElement('div');
conditionsTables.id = 'conditionsTables';
form.appendChild(conditionsTables);

loadStudy();
