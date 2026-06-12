import { Link } from 'react-router-dom';
import { Clock, Users, Maximize } from 'lucide-react';
import { useMeetingRoomsStore } from '@/store/meetingRooms';
import { seedServices } from '@/data/seed';
import { formatKzt } from '@/shared/utils';
import { Photo, SectionHeading, Icon } from '@/shared/components/ui';
import { PageHero, CTASection } from '@/shared/components/marketing/sections';

export const ServicesPage = () => {
  const rooms = useMeetingRoomsStore((s) => s.items);

  return (
    <>
      <PageHero
        eyebrow="Services & Amenities"
        title="A full service floor, included"
        subtitle="Everything from security and parking to conference halls and a rooftop terrace — managed by an on-site team so your business never skips a beat."
      />

      {/* Amenities grid */}
      <section className="container-page py-14">
        <div className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {seedServices.map((s) => (
            <div key={s.id} className="bg-surface p-6">
              <div className="flex h-11 w-11 items-center justify-center border border-line text-accent">
                <Icon name={s.icon} className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg">{s.title}</h3>
              <p className="mt-2 text-sm text-ink-muted leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Meeting rooms */}
      <section className="border-y border-line bg-surface-2">
        <div className="container-page py-16">
          <SectionHeading
            eyebrow="Conference & meeting rooms"
            title="Bookable rooms for every occasion"
            subtitle="Four professionally equipped rooms, from focused interviews to 120-seat conferences. Tenants book directly from their dashboard."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {rooms.map((r) => (
              <div key={r.id} className="card flex flex-col overflow-hidden sm:flex-row">
                <Photo name={r.photo} alt={r.name} className="aspect-video sm:aspect-auto sm:w-44 sm:shrink-0" />
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-xl">{r.name}</h3>
                    <div className="text-right">
                      <div className="font-display text-lg">{formatKzt(r.hourlyPrice)}</div>
                      <div className="text-xs text-ink-subtle">per hour</div>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-ink-muted">{r.description}</p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-muted">
                    <span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {r.capacity} seats</span>
                    <span className="inline-flex items-center gap-1.5"><Maximize className="h-3.5 w-3.5" /> {r.area} m²</span>
                    <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Floor {r.floor}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {r.amenities.map((a) => (
                      <span key={a} className="badge-neutral">{a}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-ink-muted">
            Already a tenant? <Link to="/login" className="link-underline">Sign in</Link> to book a room.
          </p>
        </div>
      </section>

      <CTASection
        title="Need a venue for your next event?"
        subtitle="Our events team handles AV, catering and setup end-to-end."
        primary={{ to: '/contact', label: 'Talk to events' }}
        secondary={{ to: '/gallery', label: 'See the spaces' }}
      />
    </>
  );
};
