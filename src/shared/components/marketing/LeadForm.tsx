import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2 } from 'lucide-react';
import type { LeadInterest } from '@/shared/types';
import { useLeadsStore } from '@/store/leads';
import { Field } from '@/shared/components/ui';

interface LeadFormProps {
  defaultInterest?: LeadInterest;
  relatedSpaceId?: string;
  compact?: boolean;
  /** Tags the lead with the originating showcase package. */
  source?: string;
}

const INTEREST_OPTIONS: { value: LeadInterest; key: string }[] = [
  { value: 'office', key: 'lead.interestOffice' },
  { value: 'coworking', key: 'lead.interestCoworking' },
  { value: 'meeting-room', key: 'lead.interestMeeting' },
  { value: 'general', key: 'lead.interestGeneral' },
];

export const LeadForm = ({ defaultInterest = 'general', relatedSpaceId, compact, source = 'Website' }: LeadFormProps) => {
  const { t } = useTranslation();
  const createLead = useLeadsStore((s) => s.create);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: '', company: '', email: '', phone: '', interest: defaultInterest, message: '',
  });

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    createLead({
      name: form.name,
      company: form.company || undefined,
      email: form.email,
      phone: form.phone,
      interest: form.interest,
      message: form.message,
      estimatedValue: 0,
      source,
      relatedSpaceId,
    });
    setDone(true);
  };

  if (done) {
    return (
      <div className="card flex flex-col items-center p-10 text-center">
        <CheckCircle2 className="h-10 w-10 text-success" />
        <h3 className="mt-4 font-display text-2xl">{t('lead.successTitle')}</h3>
        <p className="mt-2 max-w-sm text-sm text-ink-muted">{t('lead.successText')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card p-6 sm:p-8">
      <div className={compact ? 'grid gap-4' : 'grid gap-4 sm:grid-cols-2'}>
        <Field label={t('lead.fullName')} htmlFor="lf-name">
          <input id="lf-name" required value={form.name} onChange={(e) => set('name', e.target.value)} />
        </Field>
        <Field label={t('lead.company')} htmlFor="lf-company">
          <input id="lf-company" value={form.company} onChange={(e) => set('company', e.target.value)} />
        </Field>
        <Field label={t('lead.email')} htmlFor="lf-email">
          <input id="lf-email" type="email" required value={form.email} onChange={(e) => set('email', e.target.value)} />
        </Field>
        <Field label={t('lead.phone')} htmlFor="lf-phone">
          <input id="lf-phone" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+7 700 000 00 00" />
        </Field>
      </div>
      <Field label={t('lead.interest')} htmlFor="lf-interest" className="mt-4">
        <select id="lf-interest" value={form.interest} onChange={(e) => set('interest', e.target.value as LeadInterest)}>
          {INTEREST_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{t(o.key)}</option>
          ))}
        </select>
      </Field>
      <Field label={t('lead.message')} htmlFor="lf-message" className="mt-4">
        <textarea id="lf-message" required value={form.message} onChange={(e) => set('message', e.target.value)} placeholder={t('lead.messagePlaceholder')} />
      </Field>
      <button type="submit" className="btn-primary mt-5 w-full sm:w-auto">
        {t('lead.submit')}
      </button>
    </form>
  );
};
