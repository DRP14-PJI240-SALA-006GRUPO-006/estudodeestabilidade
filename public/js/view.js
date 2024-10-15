async function loadStudy() {
    const token = sessionStorage.getItem('token');
    if (!token) {
        alert('Você precisa estar logado para buscar um estudo.');
        window.location.href = '/login';
        return;
    }

    const studyId = window.location.pathname.split('/').pop();
    const response = await fetch(`/api/studies/${studyId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
        }
    });
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

    // Adicione esta função ao seu arquivo view.js
    function createApprovalSection(study) {
        const approvalContainer = document.getElementById('approvedAndResponsible');

        // Criar radio buttons para aprovação
        const approvedRadio = document.createElement('input');
        approvedRadio.type = 'radio';
        approvedRadio.id = 'approvedRadio';
        approvedRadio.name = 'approval';
        approvedRadio.value = 'approved';
        approvedRadio.checked = study.approved === true;

        const rejectedRadio = document.createElement('input');
        rejectedRadio.type = 'radio';
        rejectedRadio.id = 'rejectedRadio';
        rejectedRadio.name = 'approval';
        rejectedRadio.value = 'rejected';
        rejectedRadio.checked = study.approved === false;

        // Criar labels para os radio buttons
        const approvedLabel = document.createElement('label');
        approvedLabel.htmlFor = 'approvedRadio';
        approvedLabel.textContent = 'APROVADO';

        const rejectedLabel = document.createElement('label');
        rejectedLabel.htmlFor = 'rejectedRadio';
        rejectedLabel.textContent = 'REPROVADO';

        // Criar input para responsável
        const responsibleInput = document.createElement('input');
        responsibleInput.type = 'text';
        responsibleInput.id = 'responsibleInput';
        responsibleInput.placeholder = 'Nome do responsável';
        responsibleInput.value = study.responsible || '';

        const responsibleLabel = document.createElement('label');
        responsibleLabel.htmlFor = 'responsibleInput';
        responsibleLabel.textContent = 'RESPONSÁVEL:';

        // Limpar e adicionar os elementos ao container
        approvalContainer.innerHTML = '';
        approvalContainer.appendChild(approvedRadio);
        approvalContainer.appendChild(approvedLabel);
        approvalContainer.appendChild(rejectedRadio);
        approvalContainer.appendChild(rejectedLabel);
        approvalContainer.appendChild(responsibleLabel);
        approvalContainer.appendChild(responsibleInput);
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
            updatedComments: [],
            approved: document.getElementById('approvedRadio').checked,
            responsible: document.getElementById('responsibleInput').value.trim()
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

    async function deleteStudy() {
        if (!confirm('Tem certeza que deseja deletar este estudo? Esta ação não pode ser desfeita.')) {
            return;
        }
    
        const studyId = window.location.pathname.split('/').pop();
        const token = sessionStorage.getItem('token');
    
        try {
            const response = await fetch(`/api/studies/${studyId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': `${token}`
                }
            });
    
            if (response.ok) {
                alert('Estudo deletado com sucesso!');
                window.location.href = '/studies'; // Redirect to the studies list page
            } else {
                const errorData = await response.json();
                alert(`Erro ao deletar o estudo: ${errorData.msg || 'Erro desconhecido'}`);
            }
        } catch (error) {
            console.error('Erro ao deletar:', error);
            alert('Erro ao deletar o estudo. Por favor, tente novamente.');
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
    createApprovalSection(study);

    // Adicionar o botão "Salvar" no formulário
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '10px';

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Salvar';
    saveButton.type = 'button';
    saveButton.addEventListener('click', saveData);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Deletar';
    deleteButton.type = 'button';
    deleteButton.style.backgroundColor = '#ff4444';
    deleteButton.style.color = 'white';
    deleteButton.addEventListener('click', deleteStudy);

    buttonContainer.appendChild(saveButton);
    buttonContainer.appendChild(deleteButton);
    document.getElementById('conditionsTables').appendChild(buttonContainer);
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
