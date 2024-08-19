const StabilityStudy = require('../models/StabilityStudy')
const _ = require('lodash')

exports.createStudy = async (req, res) => {
    const { projectName, client, contraType, routine, product, code, batch, startDate, day0 } = req.body

    try {
        const newStudy = new StabilityStudy({
            projectName,
            client,
            contraType,
            routine,
            product,
            code,
            batch,
            startDate,
            conditions: {
                estufa: { day0 },
                luz: { day0 },
                armario: { day0 },
                geladeira: { day0 }
            }
        });

        const study = await newStudy.save()
        res.json(study)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Erro no servidor')
    }
};

exports.getAllStudies = async (req, res) => {
    try {
        const studies = await StabilityStudy.find()
        res.json(studies)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Erro no servidor')
    }
}

exports.getStudyById = async (req, res) => {
    try {
        const study = await StabilityStudy.findById(req.params.id)
        if (!study) {
            return res.status(404).json({ msg: 'Estudo não encontrado' })
        }
        res.json(study)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Erro no servidor')
    }
}

exports.updateStudy = async (req, res) => {
    const { conditions } = req.body

    try {
        const study = await StabilityStudy.findById(req.params.id)
        if (!study) {
            return res.status(404).json({ msg: 'Estudo não encontrado' })
        }

        _.merge(study.conditions, conditions)

        await study.save()
        res.json(study)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Erro no servidor')
    }
}

exports.deleteStudy = async (req, res) => {
    try {
        const study = await StabilityStudy.findById(req.params.id)
        if (!study) {
            return res.status(404).json({ msg: 'Estudo não encontrado' })
        }

        await study.remove();
        res.json({ msg: 'Estudo removido' })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor')
    }
};
