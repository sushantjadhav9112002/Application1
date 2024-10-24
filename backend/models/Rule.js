// models/Rule.js
const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema({
    ruleString: { type: String, required: true },
    ast: { type: Object, required: true } // Assuming AST will be stored as an object
});

module.exports = mongoose.model('Rule', ruleSchema);
