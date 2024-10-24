// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createRuleAST, evaluateAST } = require('./ruleEngine');
const mongoose = require('mongoose');
const Rule = require('./models/Rule'); // Ensure this schema is defined correctly

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Endpoint to create and store rule
app.post('/api/create-rule', async (req, res) => {
    console.log('Received create rule request:', req.body);
    try {
        const { ruleString } = req.body;
        if (!ruleString) {
            return res.status(400).json({ message: 'Rule string is required' });
        }

        const ast = createRuleAST(ruleString);
        console.log('Generated AST:', ast);

        // Check if AST is defined before creating the rule
        if (!ast) {
            return res.status(400).json({ message: 'AST generation failed' });
        }

        const rule = new Rule({ ruleString, ast });
        await rule.save();
        res.json({ message: "Rule created successfully", ast });
    } catch (error) {
        console.error('Error creating rule:', error);
        res.status(500).json({ message: 'Failed to create rule', error: error.message });
    }
});

// Endpoint to fetch rules
app.get('/api/get-rules', async (req, res) => {
    try {
        const rules = await Rule.find();
        res.json(rules); // Send the list of rules as a response
    } catch (error) {
        console.error("Error fetching rules:", error);
        res.status(500).json({ error: "Failed to fetch rules." });
    }
});

// Endpoint to evaluate rules
app.post('/api/evaluate-rule', async (req, res) => {
    const { userData } = req.body;

    // Validate userData to ensure it's an object and has necessary attributes
    if (!userData || typeof userData !== 'object') {
        return res.status(400).json({ error: "Invalid user data provided." });
    }

    try {
        const rules = await Rule.find(); // Ensure Rule model has 'ast' field defined

        // Evaluate each rule against the user data
        const results = rules.map(rule => evaluateAST(rule.ast, userData));

        // Determine if the user is eligible based on any true results
        const isEligible = results.some(result => result === true);

        // Respond with the eligibility result
        res.json({ isEligible });
    } catch (error) {
        console.error("Error evaluating rules:", error);
        res.status(500).json({ error: "Failed to evaluate rules." });
    }
});

// MongoDB connection
mongoose.connect('mongodb+srv://sushantjadhav9112002:12345@cluster0.pkrkz.mongodb.net/rule-engine', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
