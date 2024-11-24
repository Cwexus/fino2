import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { API_CONFIG } from '../../../config';
import { useNavigate } from 'react-router-dom';
import './ProvisioningEntries.css';

const CreateProvisioningEntryForm = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [provisioningDate, setProvisioningDate] = useState(new Date().toISOString().split('T')[0]);
    const [createJournalEntries, setCreateJournalEntries] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                `${API_CONFIG.baseURL}/provisioningentries`,
                { provisioningDate, createJournalEntries },
                {
                    headers: {
                        Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                        'Fineract-Platform-TenantId': 'default',
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log('Provisioning entry created successfully');
            navigate('/accounting'); // Redirect after successful submission
        } catch (error) {
            console.error('Error creating provisioning entry:', error);
        }
    };

    return (
        <form className="provisioning-form-container" onSubmit={handleSubmit}>
            <h3 className="provisioning-form-title">Create Provisioning Entry</h3>
            <div className="provisioning-form-group">
                <label className="provisioning-form-label">Provisioning Date:</label>
                <input
                    type="date"
                    value={provisioningDate}
                    onChange={(e) => setProvisioningDate(e.target.value)}
                    className="provisioning-form-date-input"
                />
            </div>
            <div className="provisioning-form-group checkbox-group">
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={createJournalEntries}
                        onChange={(e) => setCreateJournalEntries(e.target.checked)}
                        className="provisioning-form-checkbox"
                    />
                    <span className={"span-label"}>Create Journal Entries</span>
                </label>
            </div>
            <div className="provisioning-form-actions">
                <div className="provisioning-form-button provisioning-form-submit" onClick={handleSubmit}>
                    Submit
                </div>
                <div
                    className="provisioning-form-button provisioning-form-cancel"
                    onClick={() => navigate('/accounting')}
                >
                    Cancel
                </div>
            </div>
        </form>
    );
};

export default CreateProvisioningEntryForm;
