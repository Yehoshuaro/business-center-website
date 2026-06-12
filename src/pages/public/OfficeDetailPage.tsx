import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Check, Maximize, Users, Building, Layers } from 'lucide-react';
import { useOfficesStore } from '@/store/offices';
import { formatKzt } from '@/shared/utils';
import { Photo, StatusBadge, SectionHeading } from '@/shared/components/ui';
import { OfficeCard } from '@/shared/components/marketing/OfficeCard';
import { LeadForm } from '@/shared/components/marketing/LeadForm';

export const OfficeDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const offices = useOfficesStore((s) => s.items);
  const office = offices.find((o) => o.id === id);

  if (!office) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="font-display text-3xl">{t('platform.officeDetail.notFound')}</h1>
        <p className="mt-3 text-ink-muted">{t('platform.officeDetail.notFoundDesc')}</p>
        <Link to="/offices" className="btn-primary mt-6">{t('platform.officeDetail.backAll')}</Link>
      </div>
    );
  }

  const similar = offices.filter((o) => o.id !== office.id && o.type === office.type && o.status === 'available').slice(0, 3);
  const seatLabel = office.capacity === 1 ? t('office.seat') : t('office.seats');
  const facts = [
    { icon: Maximize, label: t('platform.officeDetail.factArea'), value: office.area > 0 ? `${office.area} m²` : t('platform.officeDetail.areaFlexible') },
    { icon: Users, label: t('platform.officeDetail.factCapacity'), value: `${office.capacity} ${seatLabel}` },
    { icon: Building, label: t('platform.officeDetail.factFloor'), value: `${t('office.level')} ${office.floor}` },
    { icon: Layers, label: t('platform.officeDetail.factType'), value: t(`office.type.${office.type}`) },
  ];

  return (
    <>
      <div className="container-page pt-8">
        <Link to="/offices" className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> {t('platform.officeDetail.allSpaces')}
        </Link>
      </div>

      <section className="container-page grid gap-10 py-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <Photo name={office.photo} alt={office.title} className="aspect-[16/10] ring-soft" />
          <div className="mt-8">
            <div className="flex flex-wrap items-center gap-3">
              <div className="eyebrow">#{office.code}</div>
              {StatusBadge.space(office.status)}
            </div>
            <h1 className="mt-2 font-display text-4xl tracking-tight">{office.title}</h1>
            <p className="mt-4 max-w-2xl text-ink-muted leading-relaxed">{office.description}</p>

            <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden border border-line bg-line sm:grid-cols-4">
              {facts.map((f) => (
                <div key={f.label} className="bg-surface p-4">
                  <f.icon className="h-4 w-4 text-ink-subtle" />
                  <div className="mt-2 font-display text-lg">{f.value}</div>
                  <div className="text-xs text-ink-muted">{f.label}</div>
                </div>
              ))}
            </div>

            <h2 className="mt-10 font-display text-2xl">{t('platform.officeDetail.included')}</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {office.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sticky enquiry rail */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            <div className="font-display text-3xl tracking-tight">{formatKzt(office.monthlyPrice)}</div>
            {office.monthlyPrice !== null && <div className="text-sm text-ink-muted">{t('platform.officeDetail.perMonth')}</div>}
            <div className="mt-5 space-y-2 border-t border-line pt-5 text-sm">
              <div className="flex justify-between"><span className="text-ink-muted">{t('platform.officeDetail.availability')}</span>{StatusBadge.space(office.status)}</div>
              <div className="flex justify-between"><span className="text-ink-muted">{t('platform.officeDetail.minTerm')}</span><span>{t('platform.officeDetail.minTermVal')}</span></div>
              <div className="flex justify-between"><span className="text-ink-muted">{t('platform.officeDetail.fitOut')}</span><span>{t('platform.officeDetail.fitOutVal')}</span></div>
            </div>
            <a href="#enquire" className="btn-primary mt-6 w-full">{t('platform.officeDetail.enquireBtn')}</a>
            <Link to="/contact" className="btn-ghost mt-2 w-full">{t('platform.officeDetail.bookTour')}</Link>
          </div>
        </aside>
      </section>

      <section id="enquire" className="border-t border-line bg-surface-2">
        <div className="container-page grid gap-10 py-16 lg:grid-cols-2">
          <div>
            <div className="eyebrow mb-3">{t('platform.officeDetail.enquireEyebrow')}</div>
            <h2 className="section-title">{t('platform.officeDetail.enquireTitle', { title: office.title })}</h2>
            <p className="mt-4 text-ink-muted leading-relaxed">
              {t('platform.officeDetail.enquireText')}
            </p>
          </div>
          <LeadForm defaultInterest={office.type === 'coworking' ? 'coworking' : 'office'} relatedSpaceId={office.id} compact />
        </div>
      </section>

      {similar.length > 0 && (
        <section className="container-page py-16">
          <SectionHeading eyebrow={t('platform.officeDetail.similarEyebrow')} title={t('platform.officeDetail.similarTitle')} />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((o) => (
              <OfficeCard key={o.id} office={o} to={`/offices/${o.id}`} />
            ))}
          </div>
        </section>
      )}
    </>
  );
};
