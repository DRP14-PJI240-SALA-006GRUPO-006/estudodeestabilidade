// models/StabilityStudy.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const commentSchema = new Schema({
    text: String,
    createdAt: { type: Date, default: Date.now },
    createdBy: String
});

const conditionSchema = new Schema({
    aspect: String,
    color: String,
    odor: String,
    viscosity: String,
    ph: String,
    density: String
})

const stabilityStudySchema = new Schema({
    projectNumber: Number,
    projectName: String,
    client: String,
    contraType: String,
    routine: String,
    product: String,
    code: String,
    lot: String,
    startDate: Date,
    conditions: {
        estufa: {
            day0: conditionSchema,
            day7: conditionSchema,
            day15: conditionSchema,
            day30: conditionSchema,
            day60: conditionSchema,
            day90: conditionSchema
        },
        luz: {
            day0: conditionSchema,
            day7: conditionSchema,
            day15: conditionSchema,
            day30: conditionSchema,
            day60: conditionSchema,
            day90: conditionSchema
        },
        armario: {
            day0: conditionSchema,
            day7: conditionSchema,
            day15: conditionSchema,
            day30: conditionSchema,
            day60: conditionSchema,
            day90: conditionSchema
        },
        geladeira: {
            day0: conditionSchema,
            day7: conditionSchema,
            day15: conditionSchema,
            day30: conditionSchema,
            day60: conditionSchema,
            day90: conditionSchema
        }
    },
    comments: [commentSchema],
    approved: Boolean,
    responsible: String
})

stabilityStudySchema.plugin(AutoIncrement, {inc_field: 'numero'})

module.exports = mongoose.model('StabilityStudy', stabilityStudySchema)
