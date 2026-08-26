import React, { useState, useEffect } from 'react';
import { FaMobileAlt, FaToggleOn, FaToggleOff, FaSpinner, FaCheckCircle, FaExclamationTriangle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';
import { auth } from '../../services/firebase';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const MpesaSettings = () => {
  const [currentEnv, setCurrentEnv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [switching, setSwitching] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [updatedAt, setUpdatedAt] = useState(null);
  const [showConfirm, setShowConfirm] = useState(null); // 'sandbox' | 'production' | null

  useEffect(() => {
    fetchSettings();
  }, []);

  const getAuthHeaders = async () => {
    if (!auth.currentUser) throw new Error('Not authenticated');
    const token = await auth.currentUser.getIdToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/payment/mpesa/settings`, { headers });
      
      if (!response.ok) {
        throw new Error('Failed to fetch M-Pesa settings');
      }
      
      const data = await response.json();
      setCurrentEnv(data.env);
      setUpdatedAt(data.updatedAt);
    } catch (error) {
      console.error('Error fetching M-Pesa settings:', error);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (targetEnv) => {
    if (targetEnv === currentEnv) return;
    setShowConfirm(targetEnv);
  };

  const confirmToggle = async () => {
    const targetEnv = showConfirm;
    setShowConfirm(null);
    setSwitching(true);
    setMessage({ type: '', text: '' });

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/payment/mpesa/settings`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ env: targetEnv })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update settings');
      }

      const data = await response.json();
      setCurrentEnv(data.env);
      setUpdatedAt(new Date().toISOString());
      setMessage({ 
        type: 'success', 
        text: `M-Pesa environment switched to ${targetEnv === 'production' ? 'Production (LIVE)' : 'Sandbox (Testing)'}`
      });
    } catch (error) {
      console.error('Error updating M-Pesa settings:', error);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSwitching(false);
    }
  };

  const isProduction = currentEnv === 'production';

  if (loading) {
    return (
      <div className="card border-0 shadow-sm" style={{ backgroundColor: '#1B1B1B' }}>
        <div className="card-body p-4 text-center">
          <FaSpinner className="fa-spin fs-3 text-warning" />
          <p className="text-muted mt-2 mb-0">Loading M-Pesa settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm" style={{ backgroundColor: '#1B1B1B' }}>
      <div className="card-body p-4">
        <div className="d-flex align-items-center mb-4">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center me-3"
            style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)'
            }}
          >
            <FaMobileAlt className="text-white fs-5" />
          </div>
          <div>
            <h5 className="mb-0 text-gold" style={{ fontFamily: '"Playfair Display", serif' }}>M-Pesa Configuration</h5>
            <small className="text-muted">Manage your Daraja payment environment</small>
          </div>
        </div>

        {/* Status Messages */}
        {message.text && (
          <div className={`alert ${message.type === 'error' ? 'alert-danger' : 'alert-success'} d-flex align-items-center mb-4`}>
            {message.type === 'error' ? <FaExclamationCircle className="me-2 flex-shrink-0" /> : <FaCheckCircle className="me-2 flex-shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Environment Status Indicator */}
        <div 
          className="p-4 rounded-3 mb-4 border"
          style={{ 
            backgroundColor: isProduction ? 'rgba(220, 53, 69, 0.08)' : 'rgba(25, 135, 84, 0.08)',
            borderColor: isProduction ? 'rgba(220, 53, 69, 0.3)' : 'rgba(25, 135, 84, 0.3)'
          }}
        >
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <span 
                  className="d-inline-block rounded-circle"
                  style={{ 
                    width: '12px', height: '12px',
                    backgroundColor: isProduction ? '#dc3545' : '#198754',
                    animation: 'pulse 2s infinite'
                  }}
                />
                <h6 className="mb-0 text-white fw-bold">
                  {isProduction ? 'PRODUCTION — LIVE PAYMENTS' : 'SANDBOX — TEST MODE'}
                </h6>
              </div>
              <p className="text-muted mb-0 small">
                {isProduction 
                  ? 'Real money is being charged from customer M-Pesa accounts.' 
                  : 'Payments are processed through the Safaricom sandbox. No real money is charged.'}
              </p>
            </div>
            <span className={`badge ${isProduction ? 'bg-danger' : 'bg-success'} px-3 py-2 fs-6 rounded-pill`}>
              {isProduction ? 'LIVE' : 'TEST'}
            </span>
          </div>
        </div>

        {/* Toggle Buttons */}
        <div className="row g-3 mb-4">
          <div className="col-6">
            <button
              className={`btn w-100 py-3 fw-bold border ${!isProduction ? 'text-white' : 'text-muted'}`}
              style={{ 
                backgroundColor: !isProduction ? 'rgba(25, 135, 84, 0.15)' : 'transparent',
                borderColor: !isProduction ? '#198754' : '#333'
              }}
              onClick={() => handleToggle('sandbox')}
              disabled={switching || !isProduction}
            >
              {!isProduction ? <FaToggleOn className="me-2" /> : <FaToggleOff className="me-2" />}
              Sandbox
              {!isProduction && <FaCheckCircle className="ms-2 text-success" />}
            </button>
          </div>
          <div className="col-6">
            <button
              className={`btn w-100 py-3 fw-bold border ${isProduction ? 'text-white' : 'text-muted'}`}
              style={{ 
                backgroundColor: isProduction ? 'rgba(220, 53, 69, 0.15)' : 'transparent',
                borderColor: isProduction ? '#dc3545' : '#333'
              }}
              onClick={() => handleToggle('production')}
              disabled={switching || isProduction}
            >
              {isProduction ? <FaToggleOn className="me-2" /> : <FaToggleOff className="me-2" />}
              Production
              {isProduction && <FaCheckCircle className="ms-2 text-danger" />}
            </button>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirm && (
          <div 
            className="p-4 rounded-3 mb-4 border"
            style={{ 
              backgroundColor: showConfirm === 'production' ? 'rgba(220, 53, 69, 0.12)' : 'rgba(25, 135, 84, 0.12)',
              borderColor: showConfirm === 'production' ? '#dc3545' : '#198754'
            }}
          >
            <div className="d-flex align-items-start gap-3">
              <FaExclamationTriangle className={`fs-4 mt-1 flex-shrink-0 ${showConfirm === 'production' ? 'text-danger' : 'text-warning'}`} />
              <div className="flex-grow-1">
                <h6 className="text-white mb-2">
                  {showConfirm === 'production' 
                    ? 'Switch to Production (Live Payments)?' 
                    : 'Switch to Sandbox (Test Mode)?'}
                </h6>
                <p className="text-muted small mb-3">
                  {showConfirm === 'production'
                    ? 'This will start charging real money from customer M-Pesa accounts. Make sure your Daraja app has been approved for Go Live and production credentials are configured.'
                    : 'This will switch to test mode. No real payments will be processed. Existing pending payments may fail if callbacks arrive after switching.'}
                </p>
                <div className="d-flex gap-2">
                  <button 
                    className={`btn ${showConfirm === 'production' ? 'btn-danger' : 'btn-success'} fw-bold px-4`}
                    onClick={confirmToggle}
                    disabled={switching}
                  >
                    {switching ? (
                      <><FaSpinner className="fa-spin me-2" /> Switching...</>
                    ) : (
                      `Yes, Switch to ${showConfirm === 'production' ? 'Production' : 'Sandbox'}`
                    )}
                  </button>
                  <button 
                    className="btn btn-outline-secondary px-4"
                    onClick={() => setShowConfirm(null)}
                    disabled={switching}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Configuration Details */}
        <div className="p-3 bg-dark rounded-3 border border-secondary">
          <h6 className="text-muted mb-3"><FaInfoCircle className="me-2" />Configuration Details</h6>
          <div className="row g-2 small">
            <div className="col-6">
              <span className="text-muted">Transaction Type:</span>
              <span className="text-white ms-2 font-monospace">CustomerBuyGoodsOnline</span>
            </div>
            <div className="col-6">
              <span className="text-muted">Till Number:</span>
              <span className="text-white ms-2 font-monospace">3422871</span>
            </div>
            <div className="col-6">
              <span className="text-muted">Store Number:</span>
              <span className="text-white ms-2 font-monospace">{isProduction ? '(Production)' : '174379 (Sandbox)'}</span>
            </div>
            <div className="col-6">
              <span className="text-muted">Callback URL:</span>
              <span className="text-info ms-2 font-monospace small">Cloud Functions</span>
            </div>
          </div>
          {updatedAt && (
            <div className="mt-3 pt-2 border-top border-secondary">
              <small className="text-muted">Last updated: {new Date(updatedAt).toLocaleString()}</small>
            </div>
          )}
        </div>

      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

export default MpesaSettings;
