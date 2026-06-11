import { useState } from 'react';
import { useT } from '@/features/i18n/store';
import { useLeadsStore } from '@/features/leads/store';
import type { LeadInterestType } from '@/shared/types';
import { Check } from 'lucide-react';

interface LeadFormProps {
  defaultInterest?: LeadInterestType;
  relatedItemId?: string;
  compact?: boolean;
}

export const LeadForm = ({ defaultInterest = 'general', relatedItemId, compact }: LeadFormProps) => {
  const { t } = useT();
  const createLead = useLeadsStore((s) => s.create);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    interestType: defaultInterest,
    message: '',
  });

  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, boolean> = {};
    if (!form.name.trim()) newErrors.name = true;
    if (!form.phone.trim()) newErrors.phone = true;
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    createLead({
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      interestType: form.interestType,
      message: form.message.trim(),
      relatedItemId,
    });
    setSubmitted(true);
    setErrors({});
  };

  if (submitted) {
    return (
      <div className="card p-6 flex items-start gap-3">
        <span className="inline-flex items-center justify-center w-9 h-9 border border-success/40 text-success shrink-0">
          <Check size={16} />
        </span>
        <div>
          <div className="font-medium mb-1">{t('form.success')}</div>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setForm({ name: '', phone: '', email: '', interestType: defaultInterest, message: '' });
            }}
            className="text-xs text-ink-muted hover:text-ink underline"
          >
            {t('common.create')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? '' : 'card p-6 md:p-8'}>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="field-label">
            {t('form.name')} <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`input ${errors.name ? 'border-danger' : ''}`}
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
          />
        </div>
        <div>
          <label className="field-label">
            {t('form.phone')} <span className="text-danger">*</span>
          </label>
          <input
            type="tel"
            className={`input ${errors.phone ? 'border-danger' : ''}`}
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
          />
        </div>
        <div>
          <label className="field-label">{t('form.email')}</label>
          <input
            type="email"
            className="input"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
          />
        </div>
        <div>
          <label className="field-label">{t('form.interest')}</label>
          <select
            className="select"
            value={form.interestType}
            onChange={(e) => update('interestType', e.target.value as LeadInterestType)}
          >
            <option value="office">{t('interest.office')}</option>
            <option value="conference">{t('interest.conference')}</option>
            <option value="general">{t('interest.general')}</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="field-label">{t('form.message')}</label>
          <textarea
            className="textarea"
            value={form.message}
            onChange={(e) => update('message', e.target.value)}
          />
        </div>
      </div>
      <div className="mt-5">
        <button type="submit" className="btn-primary">
          {t('form.submit')}
        </button>
      </div>
    </form>
  );
};
