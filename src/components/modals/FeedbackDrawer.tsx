import React, { useState } from 'react';
import { usePG } from '../../context/PGContext';
import { X, Send, Sparkles, CheckCircle2, MessageSquare } from 'lucide-react';
import type { ClientFeedback } from '../../types';

export const FeedbackDrawer: React.FC = () => {
  const { isFeedbackOpen, setIsFeedbackOpen, clientFeedbacks, addFeedback } = usePG();

  const [author, setAuthor] = useState('');
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState<ClientFeedback['category']>('feature');
  const [submitted, setSubmitted] = useState(false);

  if (!isFeedbackOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    addFeedback(author || 'Client', comment, category);
    setComment('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
  };

  return (
    <div className="drawer-overlay" onClick={() => setIsFeedbackOpen(false)}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#fbfaf8',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-accent-subtle)',
                color: 'var(--color-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', color: 'var(--color-primary)', margin: 0 }}>
                Client Feedback & Changes
              </h3>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                Tell us what you'd like added or customized for your PG!
              </div>
            </div>
          </div>

          <button onClick={() => setIsFeedbackOpen(false)} className="btn-icon">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {/* Submission Form */}
          <div
            style={{
              padding: '16px',
              backgroundColor: '#ffffff',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '24px',
            }}
          >
            <h4 style={{ fontSize: '14px', color: 'var(--color-primary)', marginBottom: '12px' }}>
              Add a Change Request / Suggestion
            </h4>

            {submitted && (
              <div
                style={{
                  padding: '10px 14px',
                  backgroundColor: 'var(--status-available-bg)',
                  border: '1px solid #86efac',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--status-available)',
                  fontSize: '13px',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <CheckCircle2 size={16} />
                <span>Thank you! Your suggestion has been saved in the demo review list.</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Kishore Patil (PG Owner)"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                >
                  <option value="feature">New Feature Request</option>
                  <option value="customization">PG Rule Customization</option>
                  <option value="pricing">Rent & Deposit Rules</option>
                  <option value="general">General Design / Layout Feedback</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Your Suggestion / Note *</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="e.g. Can we show electric meter readings per room? Or add a WhatsApp payment link button?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-accent btn-sm" style={{ width: '100%' }}>
                <Send size={14} />
                <span>Submit Feedback</span>
              </button>
            </form>
          </div>

          {/* List of Feedback Notes */}
          <div>
            <h4 style={{ fontSize: '14px', color: 'var(--color-primary)', marginBottom: '12px' }}>
              Recorded Feedback Notes ({clientFeedbacks.length})
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {clientFeedbacks.map((fb) => (
                <div
                  key={fb.id}
                  style={{
                    padding: '12px 14px',
                    backgroundColor: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '13px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <strong style={{ color: 'var(--color-primary)' }}>{fb.author}</strong>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-light)' }}>{fb.timestamp}</span>
                  </div>
                  <div style={{ color: 'var(--color-text-main)', lineHeight: 1.4 }}>{fb.comment}</div>
                  <div style={{ marginTop: '6px' }}>
                    <span
                      style={{
                        fontSize: '10.5px',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: '#e2e8f0',
                        color: '#475569',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                      }}
                    >
                      {fb.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
