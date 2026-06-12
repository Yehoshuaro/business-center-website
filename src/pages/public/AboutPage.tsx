import { Check } from 'lucide-react';
import { useSettingsStore } from '@/store/settings';
import { Photo, SectionHeading, Avatar } from '@/shared/components/ui';
import { PageHero, StatsBand, CTASection } from '@/shared/components/marketing/sections';

const VALUES = [
  { title: 'Service first', body: 'A dedicated on-site team treats every tenant request as a priority, day or night.' },
  { title: 'Designed to perform', body: 'Class-A engineering, natural light and acoustics that make the working day better.' },
  { title: 'A real community', body: 'Resident events, shared lounges and a network of 60+ companies under one roof.' },
];

const TIMELINE = [
  { year: '2016', text: 'Meridian opens its doors with the first six floors fully let within a year.' },
  { year: '2019', text: 'The conference center and rooftop terrace are added, hosting the first Forum.' },
  { year: '2022', text: 'Underground parking expands to 180 spaces with EV charging.' },
  { year: '2026', text: 'A new wing adds 4,200 m² of lettable space and two more conference halls.' },
];

const TEAM = [
  { name: 'Alexandra Petrova', role: 'Center Director' },
  { name: 'Daniyar Akhmetov', role: 'Head of Leasing' },
  { name: 'Sofia Belova', role: 'Community Manager' },
  { name: 'Marat Idrisov', role: 'Head of Facilities' },
];

export const AboutPage = () => {
  const settings = useSettingsStore((s) => s.settings);

  return (
    <>
      <PageHero
        eyebrow="About"
        title="A landmark business address, run like a hospitality brand"
        subtitle={`${settings.centerName} combines premium commercial real estate with the service standards of a five-star hotel.`}
      />

      <section className="container-page grid items-center gap-12 py-16 lg:grid-cols-2">
        <Photo name="lobby" alt="Main lobby" className="aspect-[4/3]" />
        <div>
          <div className="eyebrow mb-3">Our story</div>
          <h2 className="section-title">Built for the way modern companies work</h2>
          <p className="mt-4 text-ink-muted leading-relaxed">
            We started with a simple belief: a workplace should give something back to the people who use it.
            That principle shapes everything at Meridian — the light, the air, the lobby coffee, and the
            facilities team that knows tenants by name.
          </p>
          <p className="mt-4 text-ink-muted leading-relaxed">
            Today we are home to more than sixty companies across finance, law, engineering and the creative
            industries, spanning nine Class-A floors in the center of {settings.city}.
          </p>
        </div>
      </section>

      <section className="container-page pb-16">
        <StatsBand />
      </section>

      {/* Values */}
      <section className="border-y border-line bg-surface-2">
        <div className="container-page py-16">
          <SectionHeading center eyebrow="What we stand for" title="Three things we never compromise on" />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.title} className="card p-7">
                <Check className="h-6 w-6 text-accent" />
                <h3 className="mt-4 font-display text-xl">{v.title}</h3>
                <p className="mt-2 text-sm text-ink-muted leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="container-page py-16">
        <SectionHeading eyebrow="Milestones" title="A decade of growth" />
        <div className="mt-10 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {TIMELINE.map((m) => (
            <div key={m.year} className="bg-surface p-6">
              <div className="font-display text-3xl tracking-tight text-accent">{m.year}</div>
              <p className="mt-3 text-sm text-ink-muted leading-relaxed">{m.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="border-t border-line bg-surface-2">
        <div className="container-page py-16">
          <SectionHeading center eyebrow="Leadership" title="The people behind Meridian" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((p) => (
              <div key={p.name} className="card flex flex-col items-center p-7 text-center">
                <Avatar name={p.name} className="h-16 w-16 text-lg" />
                <div className="mt-4 font-medium">{p.name}</div>
                <div className="text-sm text-ink-muted">{p.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection title="Come and see it for yourself" subtitle="Book a private tour and meet the team." />
    </>
  );
};
