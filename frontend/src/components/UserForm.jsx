import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserForm.css';

function UserForm() {
  const [rule, setRule] = useState("");
  const [userData, setUserData] = useState({
    age: "",
    department: "",
    salary: "",
    experience: ""
  });
  const [combineRules, setCombineRules] = useState(false);
  const [rules, setRules] = useState([]); // State to store fetched rules

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const createRule = async () => {
    if (!rule) {
      alert('Please enter a rule.');
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/create-rule", { ruleString: rule });
      alert('Rule created successfully');
      setRule(""); // Clear the rule input field after creation
      fetchRules(); // Refresh the rules list
    } catch (error) {
      console.error("Error creating rule:", error);
      alert('Failed to create rule. Please check your input and try again.');
    }
  };

  const fetchRules = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/get-rules"); // Correct endpoint
      setRules(response.data); // Update the rules state with fetched rules
    } catch (error) {
      console.error("Error fetching rules:", error);
      alert('Failed to fetch rules.');
    }
  };

  const evaluateRule = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/evaluate-rule", { userData, combineRules });
      const { isEligible } = response.data;

      if (isEligible) {
        alert('User is eligible based on the defined rules.');
      } else {
        alert('User is not eligible based on the defined rules.');
      }
    } catch (error) {
      console.error("Error evaluating rule:", error);
      alert('Failed to evaluate rules.');
    }
  };

  // Fetch rules when the component mounts
  useEffect(() => {
    fetchRules();
  }, []);

  return (
    <div className="user-form">
      <div className="form-group">
        <label htmlFor="rule"><h3>Create Rule:</h3></label>
        <input
          type="text"
          id="rule"
          value={rule}
          onChange={(e) => setRule(e.target.value)}
          placeholder="Enter rule (e.g. age > 30 AND department = 'HR')"
        />
        <button onClick={createRule}>Create Rule</button>
      </div>

      <div className="form-group">
        <h3>User Data</h3>
        <label htmlFor="age">Age:</label>
        <input type="number" name="age" value={userData.age} onChange={handleChange} />
        
        <label htmlFor="department">Department:</label>
        <input type="text" name="department" value={userData.department} onChange={handleChange} />
        
        <label htmlFor="salary">Salary:</label>
        <input type="number" name="salary" value={userData.salary} onChange={handleChange} />
        
        <label htmlFor="experience">Experience (years):</label>
        <input type="number" name="experience" value={userData.experience} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={combineRules}
            onChange={(e) => setCombineRules(e.target.checked)}
          />
          Evaluate combined rules
        </label>
      </div>

      <button onClick={evaluateRule}>Evaluate Rule</button>

      <div className="rules-list">
        <h2>Created Rules</h2>
        {rules.length === 0 ? (
          <p>No rules created yet.</p>
        ) : (
          <ul>
            {rules.map((rule, index) => (
              <li key={index}>{rule.ruleString}</li> // Display the rule string
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default UserForm;
