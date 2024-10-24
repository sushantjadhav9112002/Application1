class ASTNode {
    constructor(type, left = null, right = null, value = null) {
        this.type = type;      // "operator" for AND/OR, "operand" for conditions
        this.left = left;      // Left child
        this.right = right;    // Right child
        this.value = value;    // Operand value (e.g., condition like "age > 30")
    }
}

function createRuleAST(ruleString) {
    const tokens = ruleString.match(/(\w+\s*(?:>=|<=|>|<|=)\s*'[^']+'|\w+\s*(?:>=|<=|>|<|=)\s*\d+|AND|OR|\(|\))/g);
    if (!tokens) return null;

    const astStack = [];
    const operatorStack = [];

    const precedence = {
        'AND': 1,
        'OR': 0
    };

    tokens.forEach(token => {
        if (/^\w+\s*(?:>=|<=|>|<|=)\s*[^()]+$/.test(token)) {
            astStack.push(new ASTNode("operand", null, null, token));
        } else if (token === '(') {
            operatorStack.push(token);
        } else if (token === ')') {
            while (operatorStack.length && operatorStack[operatorStack.length - 1] !== '(') {
                const operator = operatorStack.pop();
                const right = astStack.pop();
                const left = astStack.pop();
                astStack.push(new ASTNode("operator", left, right, operator));
            }
            operatorStack.pop();
        } else if (precedence[token] !== undefined) {
            while (operatorStack.length && precedence[operatorStack[operatorStack.length - 1]] >= precedence[token]) {
                const operator = operatorStack.pop();
                const right = astStack.pop();
                const left = astStack.pop();
                astStack.push(new ASTNode("operator", left, right, operator));
            }
            operatorStack.push(token);
        }
    });

    while (operatorStack.length) {
        const operator = operatorStack.pop();
        const right = astStack.pop();
        const left = astStack.pop();
        astStack.push(new ASTNode("operator", left, right, operator));
    }

    return astStack[0];
}

function evaluateAST(node, userData) {
    if (!node) return false;

    if (node.type === "operand") {
        const [key, operator, value] = node.value.split(/(>=|<=|>|<|=)/).map(part => part.trim());
        
        console.log(`Checking key: "${key}" in userData.`);

        if (!(key in userData)) {
            console.warn(`Key "${key}" not found in userData. Returning false.`);
            return false;
        }

        const userValue = userData[key];
        const parsedValue = (operator === "=") ? value.replace(/'/g, "") : parseFloat(value);

        switch (operator) {
            case ">":
                return userValue > parsedValue;
            case "<":
                return userValue < parsedValue;
            case "=":
                return userValue === parsedValue;
            case ">=":
                return userValue >= parsedValue;
            case "<=":
                return userValue <= parsedValue;
            default:
                throw new Error(`Unknown operator "${operator}".`);
        }
    } else if (node.type === "operator") {
        const leftResult = evaluateAST(node.left, userData);
        const rightResult = evaluateAST(node.right, userData);
        return node.value === "AND" ? leftResult && rightResult : leftResult || rightResult;
    }
    return false;
}

function combineASTs(asts) {
    if (asts.length === 0) return null;
    if (asts.length === 1) return asts[0];

    let combinedAST = asts[0];

    for (let i = 1; i < asts.length; i++) {
        combinedAST = new ASTNode('operator', combinedAST, asts[i], 'AND');
    }

    return combinedAST;
}

function evaluateRules(rules, userData) {
    const combinedAST = combineASTs(rules.map(rule => rule.ast));

    const result = evaluateAST(combinedAST, userData);
    console.log("Final evaluation result:", result);
    return result;
}

module.exports = { createRuleAST, evaluateAST, ASTNode, evaluateRules, combineASTs };
