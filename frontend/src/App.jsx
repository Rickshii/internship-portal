import React, { useState } from 'react';
import './index.css';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    branch: '',
    year: '1st Year',
    skills: '',
    transactionId: '',
  });

  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState({ type: '', text: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshot(e.target.files[0]);
      // Auto-generate a unique transaction ID after screenshot upload
      const generatedTxnId = 'TXN' + Math.floor(100000000 + Math.random() * 900000000);
      setFormData((prev) => ({ ...prev, transactionId: generatedTxnId }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMsg({ type: '', text: '' });

    if (!screenshot) {
      setResponseMsg({ type: 'error', text: 'Please upload the payment screenshot.' });
      setLoading(false);
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    data.append('screenshot', screenshot);

    try {
      // In production, this would be your deployed backend URL
      const response = await fetch('https://internship-backend-lj8e.onrender.com/api/register', {

        method: 'POST',
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        setResponseMsg({ type: 'success', text: 'Registration successful! We will contact you soon.' });
        // Reset form
        setFormData({
          name: '', email: '', phone: '', college: '', branch: '', year: '1st Year', skills: '', transactionId: ''
        });
        setScreenshot(null);
      } else {
        setResponseMsg({ type: 'error', text: result.message || 'Registration failed.' });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setResponseMsg({ type: 'error', text: 'Network error. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Animated Background */}
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <div className="app-container">
        <div className="glass-panel">
          <h1>Join Our Internship</h1>
          <p className="subtitle">Kickstart your career with hands-on experience</p>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required placeholder="John Doe" />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="john@example.com" />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="+1 234 567 8900" />
              </div>

              <div className="form-group">
                <label htmlFor="college">College / University</label>
                <input type="text" id="college" name="college" value={formData.college} onChange={handleInputChange} required placeholder="Tech University" />
              </div>

              <div className="form-group">
                <label htmlFor="branch">Branch / Major</label>
                <input type="text" id="branch" name="branch" value={formData.branch} onChange={handleInputChange} required placeholder="Computer Science" />
              </div>

              <div className="form-group">
                <label htmlFor="year">Year of Study</label>
                <select id="year" name="year" value={formData.year} onChange={handleInputChange}>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Graduated">Graduated</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label htmlFor="skills">Key Skills (comma separated)</label>
                <input type="text" id="skills" name="skills" value={formData.skills} onChange={handleInputChange} required placeholder="React, Node.js, Python..." />
              </div>
            </div>

            <div className="payment-section">
              <h2>Registration Fee Payment</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', textAlign: 'center' }}>
                Please scan the QR code below to pay the registration fee of <span className="fee-amount">₹600</span>.
              </p>

              <div className="qr-container">
                {/* Ensure you have a qr-code.png in your public folder */}
                <img src="qr-code.png" alt="Payment QR Code" />
                <p>Scan with any payment app</p>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="transactionId">Transaction ID (After Payment)</label>
                  <input type="text" id="transactionId" name="transactionId" value={formData.transactionId} onChange={handleInputChange} required placeholder="e.g. TXN123456789" />
                </div>

                <div className="form-group">
                  <label>Payment Screenshot</label>
                  <div className="file-upload-wrapper">
                    <div className="file-upload-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                      {screenshot ? 'Change Screenshot' : 'Upload Screenshot'}
                    </div>
                    <input type="file" accept="image/*" onChange={handleFileChange} required />
                  </div>
                  {screenshot && <div className="file-name">{screenshot.name}</div>}
                </div>
              </div>
            </div>

            {responseMsg.text && (
              <div className={`response-msg ${responseMsg.type}`}>
                {responseMsg.text}
              </div>
            )}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? <span className="loader"></span> : 'Submit Registration'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default App;
