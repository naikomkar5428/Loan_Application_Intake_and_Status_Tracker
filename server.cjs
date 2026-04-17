const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const applications = [];

app.post('/loan/apply', (req, res) => {
  const data = req.body;
  if (!data.loanType) return res.status(400).json({ message: "Loan type is required." });
  
  const isDuplicate = applications.find(app => app.mobileNumber === data.mobileNumber);
  if (isDuplicate) return res.status(400).json({ message: 'An active application already exists for this contact number.' });

  const prefix = data.loanType === 'Home Loan' ? 'HL' : data.loanType === 'Personal Loan' ? 'PL' : data.loanType === 'Business Loan' ? 'BL' : 'LN';
  const referenceNumber = prefix + '202604' + String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  const newApp = { ...data, referenceNumber, status: 'RECEIVED', createdAt: new Date().toISOString() };
  applications.push(newApp);
  
  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'naikomkar5428@gmail.com',
      pass: 'edkkcatfnacblbcz'
    }
  });

  const mailOptions = {
    from: 'naikomkar5428@gmail.com',
    to: data.email,
    subject: 'Loan Application Received',
    text: `Dear Customer,\n\nYour ${data.loanType} application has been received successfully.\nReference Number: ${referenceNumber}\nNext Steps: Our team will review your application and contact you shortly.\n\nThank you for choosing our bank.\n`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log(`[MOCK EMAIL SENT] Real email fired to ${data.email} for Ref: ${referenceNumber}`);
    }
  });

  res.status(201).json({ referenceNumber, message: 'Loan application submitted successfully' });
});

app.get('/loan/status/:refId', (req, res) => {
  const application = applications.find(app => app.referenceNumber === req.params.refId);
  if (!application) return res.status(404).json({ message: 'Could not fetch status. Please check your Reference Number.' });

  let status = application.status;
  if (application.loanType === 'Business Loan' && status === 'RECEIVED') status = 'Additional Documents Required';
  else if (application.loanType === 'Home Loan' && status === 'RECEIVED') status = 'Under Review';
  else if (status === 'RECEIVED') status = 'Received';

  const response = {
    referenceNumber: application.referenceNumber,
    fullName: application.fullName,
    loanType: application.loanType,
    loanAmount: application.loanAmount,
    status: status,
    submissionDate: application.createdAt
  };

  if (status === 'Additional Documents Required') {
    response.missingDocuments = ['Company Registration Certificate', 'Last 6 months Bank Statement'];
  }
  res.status(200).json(response);
});

app.listen(8080, () => {
    console.log('MOCK JAVA BACKEND SERVER RUNNING ON 8080!!');
});
