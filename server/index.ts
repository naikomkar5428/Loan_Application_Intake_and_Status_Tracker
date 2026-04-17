import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// In-memory mock database
const applications: any[] = [];

app.post('/loan/apply', (req, res) => {
  const data = req.body;
  
  // Server-Side Validation
  if (!data.fullName) return res.status(400).json({ error: "Full Name is required." });
  if (!/^\d{10}$/.test(data.mobileNumber)) return res.status(400).json({ error: "Contact number must be exactly 10 digits." });
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return res.status(400).json({ error: "Valid email is required." });
  if (!data.loanAmount || isNaN(data.loanAmount) || Number(data.loanAmount) <= 0) return res.status(400).json({ error: "Valid positive loan amount is required." });

  if (data.loanType === 'Home Loan' && (!data.propertyValue || !data.employmentType)) {
    return res.status(400).json({ error: "Property value and employment type are required for Home Loan." });
  }
  if (data.loanType === 'Personal Loan' && (!data.salary || !data.loanPurpose)) {
    return res.status(400).json({ error: "Monthly income and loan purpose are required for Personal Loan." });
  }
  if (data.loanType === 'Business Loan' && (!data.companyName || !data.registrationNumber || !data.annualTurnover)) {
    return res.status(400).json({ error: "All business details are required for Business Loan." });
  }

  // Duplicate check - commented out for testing
  // const isDuplicate = applications.find(app => 
  //   app.mobileNumber === data.mobileNumber && app.loanType === data.loanType
  // );
  
  // if (isDuplicate) {
  //   return res.status(400).json({ error: 'An active application already exists for this contact number and loan type.' });
  // }

  const newApp = {
    ...data,
    id: `LN${Date.now()}`,
    status: 'Received',
    submissionDate: new Date().toISOString()
  };
  
  applications.push(newApp);
  
  // Simulate notification mock
  console.log(`[MOCK NOTIFICATION] Email sent to ${data.email} for Reference No: ${newApp.id}`);
  
  res.status(201).json({ referenceNumber: newApp.id });
});

app.get('/loan/status/:id', (req, res) => {
  const { id } = req.params;
  const application = applications.find(app => app.id === id);
  
  if (!application) {
    return res.status(404).json({ error: 'Application not found with that Reference Number.' });
  }
  
  // Conditionally simulate Additional Documents Required for specific cases (for demonstration)
  if (application.loanType === 'Business Loan' && application.status === 'Received') {
    application.status = 'Additional Documents Required';
    application.missingDocuments = ['Company Registration Certificate', 'Last 6 months Bank Statement'];
  } else if (application.status === 'Received') {
    application.status = 'Under Review'; // Simulate progress
  }
  
  res.status(200).json(application);
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Backend API Server running on port ${PORT}`);
});
