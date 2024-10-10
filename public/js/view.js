async function loadStudy() {
    const studyId = window.location.pathname.split('/').pop();
    const response = await fetch(`/api/studies/${studyId}`);
    const study = await response.json();
    console.log(study);

    // Leitura Inicial (day 0)
    document.getElementById('product').textContent = study.product;
    document.getElementById('lot').textContent = study.lot;
    document.getElementById('nature').textContent = study.nature;
    document.getElementById('startDate').textContent = new Date(study.startDate).toLocaleDateString();

    
    // Preencher os campos da leitura inicial se existirem
    if (study.conditions && study.conditions.estufa && study.conditions.estufa.day0) {
        document.getElementById('aspect').textContent = study.conditions.estufa.day0.aspect || '';
        document.getElementById('color').textContent = study.conditions.estufa.day0.color || '';
        document.getElementById('odor').textContent = study.conditions.estufa.day0.odor || '';
        document.getElementById('pH').textContent = study.conditions.estufa.day0.pH || '';
        document.getElementById('viscosity').textContent = study.conditions.estufa.day0.viscosity || '';
    }

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

    // Função para criar a seção de comentários
    function createComments(title, comments = {}) {
        const commentsContainer = document.createElement('div');
        commentsContainer.id = 'commentsSection';
        const h2 = document.createElement('h2');
        h2.textContent = title;
        commentsContainer.appendChild(h2);

        // Criar container para lista de comentários
        const commentsList = document.createElement('div');
        commentsList.id = 'commentsList';

        // Adicionar comentários existentes
        Object.entries(comments).forEach(([commentKey, commentObj]) => {
            const commentDiv = createCommentElement(commentObj);
            commentsList.appendChild(commentDiv);
        });

        commentsContainer.appendChild(commentsList);

        // Adicionar botão para novo comentário
        const addButton = document.createElement('button');
        addButton.textContent = 'Adicionar Comentário';
        addButton.type = 'button';
        addButton.onclick = createNewCommentField;
        commentsContainer.appendChild(addButton);

        document.getElementById('conditionsTables').appendChild(commentsContainer);
    }

    function createCommentElement(commentObj) {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment-item';
        
        const dateParagraph = document.createElement('p');
        dateParagraph.textContent = `Data: ${new Date(commentObj.date).toLocaleDateString()}`;
        commentDiv.appendChild(dateParagraph);

        const commentInput = document.createElement('input');
        commentInput.type = 'text';
        commentInput.value = commentObj.comment;
        commentInput.className = 'existing-comment';
        commentInput.setAttribute('data-comment-id', commentObj._id);
        commentDiv.appendChild(commentInput);

        return commentDiv;
    }

    function createNewCommentField() {
        const commentsList = document.getElementById('commentsList');
        const newCommentDiv = document.createElement('div');
        newCommentDiv.className = 'comment-item';

        const commentInput = document.createElement('input');
        commentInput.type = 'text';
        commentInput.placeholder = 'Digite seu comentário aqui';
        commentInput.className = 'new-comment';
        
        newCommentDiv.appendChild(commentInput);
        commentsList.appendChild(newCommentDiv);
    }

    async function saveData() {
        const updatedData = {
            conditions: {},
            newComments: [],
            updatedComments: []
        };

        // Coletar mudanças nas condições
        const conditionInputs = document.querySelectorAll('input[id*="."]');
        conditionInputs.forEach(input => {
            const originalValue = input.defaultValue;
            const currentValue = input.value;

            if (originalValue !== currentValue) {
                const path = input.id.split('.');
                let currentObj = updatedData.conditions;
                
                for (let i = 0; i < path.length - 1; i++) {
                    const key = path[i];
                    if (!currentObj[key]) {
                        currentObj[key] = {};
                    }
                    currentObj = currentObj[key];
                }
                
                currentObj[path[path.length - 1]] = currentValue;
            }
        });

        // Coletar novos comentários
        const newComments = document.querySelectorAll('.new-comment');
        newComments.forEach(input => {
            if (input.value.trim()) {
                updatedData.newComments.push({
                    comment: input.value.trim(),
                    date: new Date()
                });
            }
        });

        // Coletar comentários existentes modificados
        const existingComments = document.querySelectorAll('.existing-comment');
        existingComments.forEach(input => {
            if (input.value !== input.defaultValue) {
                updatedData.updatedComments.push({
                    id: input.getAttribute('data-comment-id'),
                    comment: input.value
                });
            }
        });

        if (Object.keys(updatedData.conditions).length === 0 && 
            updatedData.newComments.length === 0 && 
            updatedData.updatedComments.length === 0) {
            alert('Nenhuma mudança detectada.');
            return;
        }

        // Enviar os dados modificados
        const token = sessionStorage.getItem('token');
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': `${token}`
            },
            body: JSON.stringify(updatedData)
        };

        try {
            const saveResponse = await fetch(`/api/studies/${studyId}`, requestOptions);
            if (saveResponse.ok) {
                alert('Dados salvos com sucesso!');
                location.reload(); // Recarrega a página para mostrar os novos comentários
            } else {
                alert('Erro ao salvar os dados.');
            }
        } catch (error) {
            console.error('Erro ao salvar:', error);
            alert('Erro ao salvar os dados.');
        }
    }

    // Mapeia as condições e cria tabelas automaticamente
    const conditions = {
        'LUZ': study.conditions.luz,
        'ESCURO': study.conditions.escuro,
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

    // Sempre criar a seção de comentários, mesmo que vazia
    createComments('OBSERVAÇÕES:', study.comments || {});

    // Adicionar o botão "Salvar" no formulário
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


    //prenche campo de aprova e campo de responsável
    document.getElementById('aprovado').textContent = study.approved ? console.log('teste') : console.log('teste');
    document.getElementById('reprovado').textContent = study.conditions.estufa.day0.aspect || '';
    document.getElementById('responsavel').textContent = study.responsible || '';

loadStudy();