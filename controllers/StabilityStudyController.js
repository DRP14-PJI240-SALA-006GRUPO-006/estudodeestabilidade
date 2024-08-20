const StabilityStudy = require('../models/StabilityStudy');
const _ = require('lodash');

//POST
exports.createStudy = async (req, res) => {
    const { product, lot, nature, startDate, day0 } = req.body;

    try {
        const newStudy = new StabilityStudy({
            product,
            lot,
            nature,
            startDate,
            conditions: {
                estufa: { day0 },
                luz:  { day0 },
                armario:  { day0 },
                geladeira:  { day0 }
            }
        });

        const study = await newStudy.save();
        res.json(study);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
};

//GET
exports.getAllStudies = async (req, res) => {
    try {
        const studies = await StabilityStudy.find();
        res.json(studies);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
};


//GET BY ID
exports.getStudyById = async (req, res) => {
    try {
        const study = await StabilityStudy.findById(req.params.id);
        if (!study) {
            return res.status(404).json({ msg: 'Estudo não encontrado' });
        }
        res.json(study);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
};

//UPDATE
exports.updateStudy = async (req, res) => {
    const { conditions, comments, approved, responsible } = req.body;

    try {
        const study = await StabilityStudy.findById(req.params.id);
        if (!study) {
            return res.status(404).json({ msg: 'Estudo não encontrado' });
        }

        if (conditions) {
            _.merge(study.conditions, conditions);
        }

        if (comments) {
            for (const [key, value] of Object.entries(comments)) {
                const uniqueKey = `${key}-${Date.now()}`;
                study.comments.set(uniqueKey, value);
            }
        }

        if (approved !== undefined) {
            study.approved = approved;
        }

        if (responsible) {
            study.responsible = responsible;
        }

        await study.save();
        res.json(study);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
};

//DELETE
exports.deleteStudy = async (req, res) => {
    try {
        const study = await StabilityStudy.findById(req.params.id);
        if (!study) {
            return res.status(404).json({ msg: 'Estudo não encontrado' });
        }

        await study.deleteOne();
        res.json({ msg: 'Estudo removido' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
};
