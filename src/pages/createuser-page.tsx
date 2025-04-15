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
  });

  const [error, setError] = useState<string | null>(null);

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
      return;
    }

    const payload = {
      username: formData.username,
      email: formData.email,
      first_name: formData.firstName || null,
      last_name: formData.lastName || null,
      DOB: formData.dob || null,
      credential: accountService.credential?.credential || '',
    };

    accountService.createuser(payload);


    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/login/api/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        navigate('/');
      } else {
        const text = await response.text();
        setError(text || 'Something went wrong creating the account.');
      }
    } catch (err) {
      console.error(err);
      setError('Network error. Try again later.');
    }
  };

  return (
    <div className="create-account-container">
      <h1>Create Your Account</h1>
      <form onSubmit={handleSubmit} className="create-account-form">
        <input
          type="text"
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
        {error && <p className="error">{error}</p>}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default CreateAccountPage;
