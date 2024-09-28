async function loadStudy() {
    try {
        const studyId = window.location.pathname.split('/').pop();
        const response = await fetch(`/api/studies/${studyId}`);
        if (!response.ok) {
            throw new Error('Erro na rede: ' + response.statusText);
        }
        const study = await response.json();
        console.log(study)

        //Leitura Inicial
        document.getElementById('product').textContent = study.product;
        document.getElementById('lot').textContent = study.lot;
        document.getElementById('nature').textContent = study.nature;
        document.getElementById('startDate').textContent = study.startDate;
        document.getElementById('aspect').textContent = study.conditions.luz.day0.aspect;
        document.getElementById('color').textContent = study.conditions.luz.day0.color;
        document.getElementById('odor').textContent = study.conditions.luz.day0.odor;
        document.getElementById('pH').textContent = study.conditions.luz.day0.pH;
        document.getElementById('viscosity').textContent = study.conditions.luz.day0.viscosity;

        //Luz Solar
        document.getElementById('aspectoLuzSolarSeteDias').textContent = study.conditions.luz.day7.aspect;
        document.getElementById('aspectoLuzSolarQuinzeDias').textContent = study.conditions.luz.day15.aspect;
        document.getElementById('aspectoLuzSolarTrintaDias').textContent = study.conditions.luz.day30.aspect;
        document.getElementById('aspectoLuzSolarSessentaDias').textContent = study.conditions.luz.day60.aspect;
        document.getElementById('aspectoLuzSolarNoventaDias').textContent = study.conditions.luz.day90.aspect;

        document.getElementById('corLuzSolarSeteDias').textContent = study.conditions.luz.day7.color;
        document.getElementById('corLuzSolarQuinzeDias').textContent = study.conditions.luz.day15.color;
        document.getElementById('corLuzSolarTrintaDias').textContent = study.conditions.luz.day30.color;
        document.getElementById('corLuzSolarSessentaDias').textContent = study.conditions.luz.day60.color;
        document.getElementById('corLuzSolarNoventaDias').textContent = study.conditions.luz.day90.color;

        document.getElementById('odorLuzSolarSeteDias').textContent = study.conditions.luz.day7.odor;
        document.getElementById('odorLuzSolarQuinzeDias').textContent = study.conditions.luz.day15.odor;
        document.getElementById('odorLuzSolarTrintaDias').textContent = study.conditions.luz.day30.odor;
        document.getElementById('odorLuzSolarSessentaDias').textContent = study.conditions.luz.day60.odor;
        document.getElementById('odorLuzSolarNoventaDias').textContent = study.conditions.luz.day90.odor;

        document.getElementById('pHLuzSolarSeteDias').textContent = study.conditions.luz.day7.pH;
        document.getElementById('pHLuzSolarQuinzeDias').textContent = study.conditions.luz.day15.pH;
        document.getElementById('pHLuzSolarTrintaDias').textContent = study.conditions.luz.day30.pH;
        document.getElementById('pHLuzSolarSessentaDias').textContent = study.conditions.luz.day60.pH;
        document.getElementById('pHLuzSolarNoventaDias').textContent = study.conditions.luz.day90.pH;

        document.getElementById('viscosidadeLuzSolarSeteDias').textContent = study.conditions.luz.day7.viscosity;
        document.getElementById('viscosidadeLuzSolarQuinzeDias').textContent = study.conditions.luz.day15.viscosity;
        document.getElementById('viscosidadeLuzSolarTrintaDias').textContent = study.conditions.luz.day30.viscosity;
        document.getElementById('viscosidadeLuzSolarSessentaDias').textContent = study.conditions.luz.day60.viscosity;
        document.getElementById('viscosidadeLuzSolarNoventaDias').textContent = study.conditions.luz.day90.viscosity;

        // Escuro (Armario)
        document.getElementById('aspectoEscuroSeteDias').textContent = study.conditions.armario.day7.aspect;
        document.getElementById('aspectoEscuroQuinzeDias').textContent = study.conditions.armario.day15.aspect;
        document.getElementById('aspectoEscuroTrintaDias').textContent = study.conditions.armario.day30.aspect;
        document.getElementById('aspectoEscuroSessentaDias').textContent = study.conditions.armario.day60.aspect;
        document.getElementById('aspectoEscuroNoventaDias').textContent = study.conditions.armario.day90.aspect;

        document.getElementById('corEscuroSeteDias').textContent = study.conditions.armario.day7.color;
        document.getElementById('corEscuroQuinzeDias').textContent = study.conditions.armario.day15.color;
        document.getElementById('corEscuroTrintaDias').textContent = study.conditions.armario.day30.color;
        document.getElementById('corEscuroSessentaDias').textContent = study.conditions.armario.day60.color;
        document.getElementById('corEscuroNoventaDias').textContent = study.conditions.armario.day90.color;

        document.getElementById('odorEscuroSeteDias').textContent = study.conditions.armario.day7.odor;
        document.getElementById('odorEscuroQuinzeDias').textContent = study.conditions.armario.day15.odor;
        document.getElementById('odorEscuroTrintaDias').textContent = study.conditions.armario.day30.odor;
        document.getElementById('odorEscuroSessentaDias').textContent = study.conditions.armario.day60.odor;
        document.getElementById('odorEscuroNoventaDias').textContent = study.conditions.armario.day90.odor;

        document.getElementById('pHEscuroSeteDias').textContent = study.conditions.armario.day7.pH;
        document.getElementById('pHEscuroQuinzeDias').textContent = study.conditions.armario.day15.pH;
        document.getElementById('pHEscuroTrintaDias').textContent = study.conditions.armario.day30.pH;
        document.getElementById('pHEscuroSessentaDias').textContent = study.conditions.armario.day60.pH;
        document.getElementById('pHEscuroNoventaDias').textContent = study.conditions.armario.day90.pH;

        document.getElementById('viscosidadeEscuroSeteDias').textContent = study.conditions.armario.day7.viscosity;
        document.getElementById('viscosidadeEscuroQuinzeDias').textContent = study.conditions.armario.day15.viscosity;
        document.getElementById('viscosidadeEscuroTrintaDias').textContent = study.conditions.armario.day30.viscosity;
        document.getElementById('viscosidadeEscuroSessentaDias').textContent = study.conditions.armario.day60.viscosity;
        document.getElementById('viscosidadeEscuroNoventaDias').textContent = study.conditions.armario.day90.viscosity;

        // Geladeira
        document.getElementById('aspectoGeladeiraSeteDias').textContent = study.conditions.geladeira.day7.aspect;
        document.getElementById('aspectoGeladeiraQuinzeDias').textContent = study.conditions.geladeira.day15.aspect;
        document.getElementById('aspectoGeladeiraTrintaDias').textContent = study.conditions.geladeira.day30.aspect;
        document.getElementById('aspectoGeladeiraSessentaDias').textContent = study.conditions.geladeira.day60.aspect;
        document.getElementById('aspectoGeladeiraNoventaDias').textContent = study.conditions.geladeira.day90.aspect;

        document.getElementById('corGeladeiraSeteDias').textContent = study.conditions.geladeira.day7.color;
        document.getElementById('corGeladeiraQuinzeDias').textContent = study.conditions.geladeira.day15.color;
        document.getElementById('corGeladeiraTrintaDias').textContent = study.conditions.geladeira.day30.color;
        document.getElementById('corGeladeiraSessentaDias').textContent = study.conditions.geladeira.day60.color;
        document.getElementById('corGeladeiraNoventaDias').textContent = study.conditions.geladeira.day90.color;

        document.getElementById('odorGeladeiraSeteDias').textContent = study.conditions.geladeira.day7.odor;
        document.getElementById('odorGeladeiraQuinzeDias').textContent = study.conditions.geladeira.day15.odor;
        document.getElementById('odorGeladeiraTrintaDias').textContent = study.conditions.geladeira.day30.odor;
        document.getElementById('odorGeladeiraSessentaDias').textContent = study.conditions.geladeira.day60.odor;
        document.getElementById('odorGeladeiraNoventaDias').textContent = study.conditions.geladeira.day90.odor;

        document.getElementById('pHGeladeiraSeteDias').textContent = study.conditions.geladeira.day7.pH;
        document.getElementById('pHGeladeiraQuinzeDias').textContent = study.conditions.geladeira.day15.pH;
        document.getElementById('pHGeladeiraTrintaDias').textContent = study.conditions.geladeira.day30.pH;
        document.getElementById('pHGeladeiraSessentaDias').textContent = study.conditions.geladeira.day60.pH;
        document.getElementById('pHGeladeiraNoventaDias').textContent = study.conditions.geladeira.day90.pH;

        document.getElementById('viscosidadeGeladeiraSeteDias').textContent = study.conditions.geladeira.day7.viscosity;
        document.getElementById('viscosidadeGeladeiraQuinzeDias').textContent = study.conditions.geladeira.day15.viscosity;
        document.getElementById('viscosidadeGeladeiraTrintaDias').textContent = study.conditions.geladeira.day30.viscosity;
        document.getElementById('viscosidadeGeladeiraSessentaDias').textContent = study.conditions.geladeira.day60.viscosity;
        document.getElementById('viscosidadeGeladeiraNoventaDias').textContent = study.conditions.geladeira.day90.viscosity;

        // Estufa
        document.getElementById('aspectoEstufaSeteDias').textContent = study.conditions.estufa.day7.aspect;
        document.getElementById('aspectoEstufaQuinzeDias').textContent = study.conditions.estufa.day15.aspect;
        document.getElementById('aspectoEstufaTrintaDias').textContent = study.conditions.estufa.day30.aspect;
        document.getElementById('aspectoEstufaSessentaDias').textContent = study.conditions.estufa.day60.aspect;
        document.getElementById('aspectoEstufaNoventaDias').textContent = study.conditions.estufa.day90.aspect;

        document.getElementById('corEstufaSeteDias').textContent = study.conditions.estufa.day7.color;
        document.getElementById('corEstufaQuinzeDias').textContent = study.conditions.estufa.day15.color;
        document.getElementById('corEstufaTrintaDias').textContent = study.conditions.estufa.day30.color;
        document.getElementById('corEstufaSessentaDias').textContent = study.conditions.estufa.day60.color;
        document.getElementById('corEstufaNoventaDias').textContent = study.conditions.estufa.day90.color;

        document.getElementById('odorEstufaSeteDias').textContent = study.conditions.estufa.day7.odor;
        document.getElementById('odorEstufaQuinzeDias').textContent = study.conditions.estufa.day15.odor;
        document.getElementById('odorEstufaTrintaDias').textContent = study.conditions.estufa.day30.odor;
        document.getElementById('odorEstufaSessentaDias').textContent = study.conditions.estufa.day60.odor;
        document.getElementById('odorEstufaNoventaDias').textContent = study.conditions.estufa.day90.odor;

        document.getElementById('pHEstufaSeteDias').textContent = study.conditions.estufa.day7.pH;
        document.getElementById('pHEstufaQuinzeDias').textContent = study.conditions.estufa.day15.pH;
        document.getElementById('pHEstufaTrintaDias').textContent = study.conditions.estufa.day30.pH;
        document.getElementById('pHEstufaSessentaDias').textContent = study.conditions.estufa.day60.pH;
        document.getElementById('pHEstufaNoventaDias').textContent = study.conditions.estufa.day90.pH;

        document.getElementById('viscosidadeEstufaSeteDias').textContent = study.conditions.estufa.day7.viscosity;
        document.getElementById('viscosidadeEstufaQuinzeDias').textContent = study.conditions.estufa.day15.viscosity;
        document.getElementById('viscosidadeEstufaTrintaDias').textContent = study.conditions.estufa.day30.viscosity;
        document.getElementById('viscosidadeEstufaSessentaDias').textContent = study.conditions.estufa.day60.viscosity;
        document.getElementById('viscosidadeEstufaNoventaDias').textContent = study.conditions.estufa.day90.viscosity;



    } catch (error) {
        console.error('Falha ao carregar o estudo:', error);
 
    }
}

loadStudy();
