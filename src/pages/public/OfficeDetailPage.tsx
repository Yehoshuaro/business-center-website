import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Maximize, Users, Building, Layers } from 'lucide-react';
import { useOfficesStore } from '@/store/offices';
import { formatKzt } from '@/shared/utils';
import { Photo, StatusBadge, SectionHeading } from '@/shared/components/ui';
import { OfficeCard } from '@/shared/components/marketing/OfficeCard';
import { LeadForm } from '@/shared/components/marketing/LeadForm';

const TYPE_LABEL: Record<string, string> = {
  'open-plan': 'Open-plan workspace', 'private-office': 'Private office', suite: 'Suite', coworking: 'Coworking desk',
};

export const OfficeDetailPage = () => {
  const { id } = useParams();
  const offices = useOfficesStore((s) => s.items);
  const office = offices.find((o) => o.id === id);

  if (!office) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="font-display text-3xl">Space not found</h1>
        <p className="mt-3 text-ink-muted">This listing may have been let or removed.</p>
        <Link to="/offices" className="btn-primary mt-6">Back to all spaces</Link>
      </div>
    );
  }

  const similar = offices.filter((o) => o.id !== office.id && o.type === office.type && o.status === 'available').slice(0, 3);
  const facts = [
    { icon: Maximize, label: 'Area', value: office.area > 0 ? `${office.area} m²` : 'Flexible' },
    { icon: Users, label: 'Capacity', value: `${office.capacity} ${office.capacity === 1 ? 'seat' : 'seats'}` },
    { icon: Building, label: 'Floor', value: `Level ${office.floor}` },
    { icon: Layers, label: 'Type', value: TYPE_LABEL[office.type] },
  ];

  return (
    <>
      <div className="container-page pt-8">
        <Link to="/offices" className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> All spaces
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

            <h2 className="mt-10 font-display text-2xl">What's included</h2>
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
            {office.monthlyPrice !== null && <div className="text-sm text-ink-muted">per month, excl. VAT</div>}
            <div className="mt-5 space-y-2 border-t border-line pt-5 text-sm">
              <div className="flex justify-between"><span className="text-ink-muted">Availability</span>{StatusBadge.space(office.status)}</div>
              <div className="flex justify-between"><span className="text-ink-muted">Minimum term</span><span>12 months</span></div>
              <div className="flex justify-between"><span className="text-ink-muted">Fit-out</span><span>Move-in ready</span></div>
            </div>
            <a href="#enquire" className="btn-primary mt-6 w-full">Enquire about this space</a>
            <Link to="/contact" className="btn-ghost mt-2 w-full">Book a tour</Link>
          </div>
        </aside>
      </section>

      <section id="enquire" className="border-t border-line bg-surface-2">
        <div className="container-page grid gap-10 py-16 lg:grid-cols-2">
          <div>
            <div className="eyebrow mb-3">Enquire</div>
            <h2 className="section-title">Interested in {office.title}?</h2>
            <p className="mt-4 text-ink-muted leading-relaxed">
              Send us a note and our leasing team will reach out with availability, a floor plan and a tour slot.
            </p>
          </div>
          <LeadForm defaultInterest={office.type === 'coworking' ? 'coworking' : 'office'} relatedSpaceId={office.id} compact />
        </div>
      </section>

      {similar.length > 0 && (
        <section className="container-page py-16">
          <SectionHeading eyebrow="Similar spaces" title="You might also like" />
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
