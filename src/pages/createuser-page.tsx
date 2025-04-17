import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './createuser-page.scss';

import accountService from '../services/account-service';

function CreateAccountPage() {
  const navigate = useNavigate();
  const jwt = accountService.jwt;


  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: jwt?.email || '',
    dob: '',
    org_name: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setToastMessage('Please fill in the required fields.');
  }, []);

    useEffect(() => {
    if (!jwt) {
        navigate('/signin');
    }

    setShowHint(true);
    const timer = setTimeout(() => setShowHint(false), 5000); // auto-hide after 5 sec
    return () => clearTimeout(timer);
    }, [jwt, navigate]);


  useEffect(() => {
    // If user somehow reached here without signing in, redirect to sign in
    if (!jwt) {
      navigate('/signin');
    }
  }, [jwt, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username) {
        setError('Username is required.');
        setToastMessage('Username is required.');
        setShowHint(true);
        return;
    }

    if (!formData.username) {
        setError('Email is required.');
        setToastMessage('Email is required.');
        setShowHint(true);
        return;
    }


    const payload = {
        username: formData.username,
        email: formData.email,
        first_name: formData.firstName || null,
        last_name: formData.lastName || null,
        DOB: formData.dob || null,
        credential: accountService.credential?.credential || '',
        organization_name: formData.org_name || null,
    };

    const result = await accountService.createuser(payload);

    if (result.success) {
        navigate('/');
    } else {
        setError(result.error || 'Unexpected error.');
        setToastMessage(result.error || 'Unexpected error.');
        setShowHint(true);
    }
}


  return (
    <div className="create-account-container">
        {showHint && (
        <div className="toast">
            {toastMessage}
        </div>
        )}

      <h1>Create Your Account</h1>
      <form onSubmit={handleSubmit} className="create-account-form">
        <input
          type="texta"
          name="firstName"
          placeholder="First Name (optional)"
          value={formData.firstName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name (optional)"
          value={formData.lastName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="username"
          placeholder="Username *"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          disabled
        />
        <input
          type="date"
          name="dob"
          placeholder="Date of Birth (optional)"
          value={formData.dob}
          onChange={handleChange}
        />
        <input
          type="text"
          name="org_name"
          placeholder="Organization Name (optional)"
          value={formData.org_name}
          onChange={handleChange}
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default CreateAccountPage;
