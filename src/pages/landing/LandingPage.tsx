import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useT } from '@/features/i18n/store';
import { LanguageSwitcher, ThemeSwitcher } from '@/shared/components/layout/Switchers';
import { Carousel } from '@/shared/components/ui/Carousel';
import { PhotoImg } from '@/shared/components/ui/PhotoImg';
import { PHOTOS } from '@/shared/photos';
import { readPersisted, writePersisted } from '@/shared/utils/persist';
import { cn, formatDate, uid } from '@/shared/utils';

/* ============================================================
   Local lead storage — intentionally isolated from the tier 2
   site so each demo lives in its own sandbox.
   ============================================================ */
interface LandingLead {
  id: string;
  name: string;
  phone: string;
  comment: string;
  createdAt: string;
}
const LEADS_KEY = 'landing.leads';

const NAV = [
  { href: '#about', key: 'landing.nav.about' },
  { href: '#gallery', key: 'landing.nav.gallery' },
  { href: '#amenities', key: 'landing.nav.amenities' },
  { href: '#offices', key: 'landing.nav.offices' },
] as const;

const AMENITIES = [
  { id: 'conference', photo: PHOTOS.conference },
  { id: 'parking', photo: PHOTOS.parking },
  { id: 'security', photo: PHOTOS.security },
  { id: 'cctv', photo: PHOTOS.night },
  { id: 'internet', photo: PHOTOS.desk },
  { id: 'cafe', photo: PHOTOS.lounge },
] as const;

const OFFICES = [
  { id: 'of1', photo: PHOTOS.office, price: '450 000 ₸' },
  { id: 'of2', photo: PHOTOS.openspace, price: '1 700 000 ₸' },
  { id: 'of3', photo: PHOTOS.coworking, price: '6 200 000 ₸' },
] as const;

export const LandingPage = () => {
  const { t, language } = useT();
  const [menuOpen, setMenuOpen] = useState(false);
  const [leads, setLeads] = useState<LandingLead[]>(() => readPersisted<LandingLead[]>(LEADS_KEY, []));
  const [showLeads, setShowLeads] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const localeMap = { kk: 'kk-KZ', ru: 'ru-RU', en: 'en-US' } as const;
  const locale = localeMap[language];

  const slides = useMemo(
    () => [
      { id: 'l1', ...PHOTOS.facade, title: t('landing.brand'), caption: t('landing.hero.kicker') },
      { id: 'l2', ...PHOTOS.lobby, title: t('landing.am.cafe.t'), caption: t('landing.am.cafe.d') },
      { id: 'l3', ...PHOTOS.conference, title: t('landing.am.conference.t'), caption: t('landing.am.conference.d') },
      { id: 'l4', ...PHOTOS.openspace, title: t('landing.of2.t'), caption: t('landing.of2.d') },
      { id: 'l5', ...PHOTOS.parking, title: t('landing.am.parking.t'), caption: t('landing.am.parking.d') },
      { id: 'l6', ...PHOTOS.security, title: t('landing.am.security.t'), caption: t('landing.am.security.d') },
    ],
    [t],
  );

  // Lock scroll for mobile menu
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError(t('landing.form.required'));
      return;
    }
    const lead: LandingLead = {
      id: uid(),
      name: name.trim(),
      phone: phone.trim(),
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    };
    const next = [lead, ...leads];
    setLeads(next);
    writePersisted(LEADS_KEY, next);
    setError('');
    setSent(true);
  };

  const resetForm = () => {
    setName('');
    setPhone('');
    setComment('');
    setSent(false);
  };

  const stats = [
    { value: '18', key: 'landing.stat.floors' },
    { value: '24 600', key: 'landing.stat.area' },
    { value: '180', key: 'landing.stat.parking' },
    { value: '96%', key: 'landing.stat.occupancy' },
  ];

  return (
    <div className="min-h-screen bg-surface text-ink scroll-smooth">
      {/* ===== Header ===== */}
      <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur border-b border-line">
        <div className="container-page h-16 flex items-center justify-between gap-3">
          <a href="#top" className="flex items-center gap-3 min-w-0">
            <span className="inline-flex w-8 h-8 items-center justify-center bg-accent text-accent-ink font-display text-lg leading-none select-none">
              Q
            </span>
            <span className="text-sm font-medium tracking-tight truncate max-w-[170px] sm:max-w-none">
              {t('landing.brand')}
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="px-3 py-2 text-sm text-ink-muted hover:text-ink transition-colors whitespace-nowrap"
              >
                {t(n.key)}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <div className="hidden md:flex items-center gap-2">
              <ThemeSwitcher />
              <LanguageSwitcher />
            </div>
            <a href="#contact" className="hidden sm:inline-flex btn-primary btn-sm">
              {t('landing.nav.contact')}
            </a>
            <Link to="/" className="hidden md:inline-flex btn-ghost btn-sm">
              {t('common.exitDemo')}
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 -mr-1 text-ink border border-transparent hover:border-line"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden fixed inset-0 top-16 z-40">
            <div className="absolute inset-0 bg-ink/30" onClick={() => setMenuOpen(false)} aria-hidden="true" />
            <div className="relative bg-surface border-t border-line max-h-[calc(100vh-4rem)] overflow-y-auto">
              <nav className="container-page py-4 flex flex-col">
                {NAV.map((n) => (
                  <a
                    key={n.href}
                    href={n.href}
                    onClick={() => setMenuOpen(false)}
                    className="px-1 py-3 text-base border-b border-line"
                  >
                    {t(n.key)}
                  </a>
                ))}
                <a
                  href="#contact"
                  onClick={() => setMenuOpen(false)}
                  className="px-1 py-3 text-base text-accent font-medium border-b border-line"
                >
                  {t('landing.nav.contact')}
                </a>
              </nav>
              <div className="container-page py-4 border-t border-line flex flex-wrap items-center gap-2">
                <ThemeSwitcher />
                <LanguageSwitcher />
                <Link to="/" onClick={() => setMenuOpen(false)} className="btn-secondary btn-sm ml-auto">
                  {t('common.exitDemo')}
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <main id="top">
        {/* ===== Hero ===== */}
        <section className="relative border-b border-line overflow-hidden">
          <div className="absolute inset-0">
            <PhotoImg
              src={PHOTOS.tower.src}
              fallback={PHOTOS.tower.fallback}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/25" />
          </div>
          <div className="container-page relative py-20 sm:py-28 md:py-36 lg:py-44 text-white">
            <div className="max-w-3xl">
              <div className="text-[11px] sm:text-xs uppercase tracking-[0.22em] text-white/75 mb-4 sm:mb-6 flex items-center">
                <span className="inline-block w-8 h-px bg-white/70 mr-3" />
                {t('landing.hero.kicker')}
              </div>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.04] tracking-tight text-balance">
                {t('landing.hero.title')}
              </h1>
              <p className="mt-5 sm:mt-6 max-w-xl text-sm sm:text-base text-white/85 leading-relaxed">
                {t('landing.hero.subtitle')}
              </p>
              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3">
                <a href="#contact" className="btn bg-white text-black border-white hover:bg-white/90 w-full sm:w-auto">
                  {t('landing.hero.cta')}
                </a>
                <a
                  href="#offices"
                  className="btn bg-transparent text-white border-white/50 hover:border-white w-full sm:w-auto"
                >
                  {t('landing.hero.cta2')}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Stats ===== */}
        <section className="border-b border-line bg-surface-2">
          <div className="container-page grid grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.key}
                className={cn(
                  'py-6 sm:py-8 px-1 sm:px-6',
                  i % 2 === 1 && 'border-l border-line',
                  i >= 2 && 'border-t lg:border-t-0 border-line',
                  i >= 2 && 'lg:border-l',
                  i === 2 && 'lg:border-l border-line',
                )}
              >
                <div className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight tabular-nums">
                  {s.value}
                </div>
                <div className="mt-1 text-xs sm:text-sm text-ink-muted">{t(s.key)}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== About ===== */}
        <section id="about" className="border-b border-line scroll-mt-20">
          <div className="container-page py-14 sm:py-20 md:py-24 grid lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            <div className="lg:col-span-6">
              <div className="eyebrow mb-4 flex items-center">
                <span className="inline-block w-6 h-px bg-accent mr-3" />
                {t('landing.nav.about')}
              </div>
              <h2 className="section-title text-balance">{t('landing.about.title')}</h2>
              <p className="mt-5 text-sm sm:text-base text-ink-muted leading-relaxed">
                {t('landing.about.text')}
              </p>
            </div>
            <div className="lg:col-span-6">
              <div className="relative">
                <div className="aspect-[4/3] border border-line overflow-hidden bg-surface-2 shadow-card">
                  <PhotoImg
                    src={PHOTOS.atrium.src}
                    fallback={PHOTOS.atrium.fallback}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-5 -left-5 w-36 sm:w-44 aspect-[4/3] border border-line bg-surface-2 overflow-hidden shadow-card hidden sm:block">
                  <PhotoImg
                    src={PHOTOS.meeting.src}
                    fallback={PHOTOS.meeting.fallback}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Gallery ===== */}
        <section id="gallery" className="border-b border-line scroll-mt-20">
          <div className="container-page py-14 sm:py-20 md:py-24">
            <div className="eyebrow mb-4 flex items-center">
              <span className="inline-block w-6 h-px bg-accent mr-3" />
              {t('landing.nav.gallery')}
            </div>
            <h2 className="section-title mb-8 sm:mb-10">{t('landing.gallery.title')}</h2>
            <Carousel slides={slides} aspectClassName="aspect-[16/10] sm:aspect-[16/8]" />
          </div>
        </section>

        {/* ===== Amenities ===== */}
        <section id="amenities" className="border-b border-line bg-surface-2 scroll-mt-20">
          <div className="container-page py-14 sm:py-20 md:py-24">
            <div className="eyebrow mb-4 flex items-center">
              <span className="inline-block w-6 h-px bg-accent mr-3" />
              {t('landing.amenities.title')}
            </div>
            <h2 className="section-title mb-8 sm:mb-12 text-balance">{t('landing.amenities.subtitle')}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {AMENITIES.map((a) => (
                <article key={a.id} className="group bg-surface border border-line shadow-card overflow-hidden">
                  <div className="aspect-[16/9] overflow-hidden border-b border-line bg-surface-3">
                    <PhotoImg
                      src={a.photo.src}
                      fallback={a.photo.fallback}
                      alt={t(`landing.am.${a.id}.t`)}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-medium tracking-tight">{t(`landing.am.${a.id}.t`)}</h3>
                    <p className="mt-1.5 text-sm text-ink-muted leading-relaxed">{t(`landing.am.${a.id}.d`)}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Offices ===== */}
        <section id="offices" className="border-b border-line scroll-mt-20">
          <div className="container-page py-14 sm:py-20 md:py-24">
            <div className="eyebrow mb-4 flex items-center">
              <span className="inline-block w-6 h-px bg-accent mr-3" />
              {t('landing.offices.title')}
            </div>
            <h2 className="section-title mb-8 sm:mb-12 text-balance">{t('landing.offices.subtitle')}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {OFFICES.map((o) => (
                <article key={o.id} className="group bg-surface border border-line shadow-card flex flex-col">
                  <div className="aspect-[16/10] overflow-hidden border-b border-line bg-surface-2">
                    <PhotoImg
                      src={o.photo.src}
                      fallback={o.photo.fallback}
                      alt={t(`landing.${o.id}.t`)}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-display text-xl sm:text-2xl tracking-tight">{t(`landing.${o.id}.t`)}</h3>
                    <p className="mt-1.5 text-sm text-ink-muted leading-relaxed">{t(`landing.${o.id}.d`)}</p>
                    <div className="mt-auto pt-4 flex items-baseline justify-between border-t border-line mt-4">
                      <span className="text-xs uppercase tracking-wider text-ink-muted">
                        {t('landing.priceFrom')}
                      </span>
                      <span className="text-base font-medium tabular-nums">{t('common.from')} {o.price}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Lead form ===== */}
        <section id="contact" className="border-b border-line bg-surface-2 scroll-mt-20">
          <div className="container-page py-14 sm:py-20 md:py-24 grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5">
              <div className="eyebrow mb-4 flex items-center">
                <span className="inline-block w-6 h-px bg-accent mr-3" />
                {t('landing.nav.contact')}
              </div>
              <h2 className="section-title text-balance">{t('landing.form.title')}</h2>
              <p className="mt-4 text-sm sm:text-base text-ink-muted leading-relaxed">
                {t('landing.form.subtitle')}
              </p>
              <div className="mt-8 text-sm text-ink-muted space-y-1.5">
                <p>{t('landing.footer.address')}</p>
                <p>+7 (7172) 00-00-00</p>
                <p>lease@qazyna.kz</p>
              </div>
            </div>
            <div className="lg:col-span-7">
              {sent ? (
                <div className="card p-6 sm:p-8">
                  <h3 className="font-display text-2xl sm:text-3xl tracking-tight">
                    {t('landing.form.success.t')}
                  </h3>
                  <p className="mt-3 text-sm text-ink-muted leading-relaxed">{t('landing.form.success.d')}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button type="button" className="btn-secondary" onClick={resetForm}>
                      {t('landing.form.another')}
                    </button>
                    <button type="button" className="btn-ghost" onClick={() => setShowLeads(true)}>
                      {t('landing.requests')} ({leads.length})
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={submit} className="card p-6 sm:p-8 grid gap-4" noValidate>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="lp-name" className="field-label">
                        {t('landing.form.name')}
                      </label>
                      <input
                        id="lp-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="name"
                      />
                    </div>
                    <div>
                      <label htmlFor="lp-phone" className="field-label">
                        {t('landing.form.phone')}
                      </label>
                      <input
                        id="lp-phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="+7"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="lp-comment" className="field-label">
                      {t('landing.form.comment')}
                    </label>
                    <textarea
                      id="lp-comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={4}
                    />
                  </div>
                  {error && <p className="text-sm text-danger">{error}</p>}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
                    <button type="submit" className="btn-primary w-full sm:w-auto">
                      {t('landing.form.submit')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowLeads(true)}
                      className="text-sm text-ink-muted hover:text-ink underline underline-offset-4 text-left"
                    >
                      {t('landing.requests')} ({leads.length})
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* ===== Footer ===== */}
      <footer>
        <div className="container-page py-8 sm:py-10 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="text-sm text-ink-muted">
            {t('landing.brand')} · {t('landing.footer.address')}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-ink-subtle">
              © {new Date().getFullYear()} · {t('footer.rights')}
            </span>
            <Link to="/" className="text-xs link-underline">
              {t('common.exitDemo')}
            </Link>
          </div>
        </div>
        {/* Demo bar */}
        <div className="border-t border-line bg-surface-2">
          <div className="container-page py-2.5 flex items-center justify-between gap-3 flex-wrap">
            <span className="text-[11px] uppercase tracking-[0.16em] text-ink-muted">
              {t('landing.demoBar')}
            </span>
            <button
              type="button"
              onClick={() => setShowLeads(true)}
              className="text-[11px] uppercase tracking-[0.16em] text-accent hover:underline underline-offset-4"
            >
              {t('landing.requests')} · {leads.length}
            </button>
          </div>
        </div>
      </footer>

      {/* ===== Requests viewer (demo) ===== */}
      {showLeads && (
        <div className="modal-overlay" role="dialog" aria-modal="true" onClick={() => setShowLeads(false)}>
          <div className="modal-card max-w-xl" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3 className="text-base font-medium">
                {t('landing.requests')} ({leads.length})
              </h3>
              <button
                type="button"
                onClick={() => setShowLeads(false)}
                className="w-9 h-9 inline-flex items-center justify-center text-ink-muted hover:text-ink"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p className="text-xs text-ink-muted mb-4">{t('landing.requests.note')}</p>
              {leads.length === 0 ? (
                <p className="text-sm text-ink-muted">{t('landing.requests.empty')}</p>
              ) : (
                <ul className="grid gap-3">
                  {leads.map((l) => (
                    <li key={l.id} className="border border-line p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-medium">{l.name}</div>
                          <div className="text-sm text-ink-muted tabular-nums">{l.phone}</div>
                        </div>
                        <div className="text-[11px] text-ink-subtle whitespace-nowrap">
                          {formatDate(l.createdAt, locale)}
                        </div>
                      </div>
                      {l.comment && (
                        <p className="mt-2 text-sm text-ink-muted leading-relaxed">{l.comment}</p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
