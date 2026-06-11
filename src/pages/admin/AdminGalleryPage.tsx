import { useState } from 'react';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';
import { useT } from '@/features/i18n/store';
import { useGalleryStore } from '@/features/gallery/store';
import type { GalleryImage, LocalizedText } from '@/shared/types';
import { PageHeader, ConfirmDialog, EmptyState, Modal } from '@/shared/components/ui';
import { cn } from '@/shared/utils';

const DEMO_IMAGES = [
  './demo/facade.svg',
  './demo/lobby.svg',
  './demo/atrium.svg',
  './demo/openspace.svg',
  './demo/conference.svg',
  './demo/meeting.svg',
  './demo/office.svg',
  './demo/lounge.svg',
  './demo/rooftop.svg',
];

const emptyText = (): LocalizedText => ({ kk: '', ru: '', en: '' });

const emptyForm = (nextOrder: number): Omit<GalleryImage, 'id'> => ({
  src: DEMO_IMAGES[0],
  title: emptyText(),
  caption: emptyText(),
  order: nextOrder,
  isPublished: true,
});

export const AdminGalleryPage = () => {
  const { t } = useT();
  const items = useGalleryStore((s) => s.items);
  const create = useGalleryStore((s) => s.create);
  const update = useGalleryStore((s) => s.update);
  const remove = useGalleryStore((s) => s.remove);
  const reorder = useGalleryStore((s) => s.reorder);

  const [editing, setEditing] = useState<GalleryImage | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<GalleryImage, 'id'>>(emptyForm(1));

  const startCreate = () => {
    setEditing(null);
    const nextOrder = items.length > 0 ? Math.max(...items.map((i) => i.order)) + 1 : 1;
    setForm(emptyForm(nextOrder));
    setCreating(true);
  };

  const startEdit = (img: GalleryImage) => {
    setCreating(false);
    setEditing(img);
    const { id: _id, ...rest } = img;
    void _id;
    setForm(rest);
  };

  const closeForm = () => {
    setCreating(false);
    setEditing(null);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      update(editing.id, form);
    } else {
      create(form);
    }
    closeForm();
  };

  const isOpen = creating || editing !== null;

  return (
    <>
      <PageHeader
        eyebrow={t('admin.section.list')}
        title={t('admin.gallery')}
        subtitle={t('admin.gallery.subtitle')}
        actions={
          <button type="button" className="btn-primary btn-sm" onClick={startCreate}>
            <Plus size={14} /> {t('common.create')}
          </button>
        }
      />

      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-px bg-line border border-line sm:grid-cols-2 lg:grid-cols-3">
          {items.map((img, idx) => (
            <div key={img.id} className="bg-surface flex flex-col">
              <div className="aspect-[16/10] overflow-hidden bg-surface-2 border-b border-line relative">
                <img src={img.src} alt={img.title.ru} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 badge-neutral bg-surface/90">
                  #{img.order}
                </span>
                <span
                  className={cn(
                    'absolute top-2 right-2',
                    img.isPublished ? 'badge-success' : 'badge-neutral',
                  )}
                >
                  {img.isPublished ? t('common.published') : t('common.unpublished')}
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="font-display text-lg tracking-tight">
                  {img.title.ru || <span className="text-ink-subtle">—</span>}
                </div>
                <div className="mt-1 text-xs text-ink-muted line-clamp-2 flex-1">
                  {img.caption.ru}
                </div>
                <div className="mt-4 flex items-center gap-1">
                  <button
                    type="button"
                    className="btn-ghost btn-sm"
                    onClick={() => reorder(img.id, 'up')}
                    disabled={idx === 0}
                    aria-label="Move up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    className="btn-ghost btn-sm"
                    onClick={() => reorder(img.id, 'down')}
                    disabled={idx === items.length - 1}
                    aria-label="Move down"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    type="button"
                    className="btn-ghost btn-sm"
                    onClick={() => update(img.id, { isPublished: !img.isPublished })}
                    aria-label="Toggle publish"
                  >
                    {img.isPublished ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <span className="flex-1" />
                  <button
                    type="button"
                    className="btn-ghost btn-sm"
                    onClick={() => startEdit(img)}
                    aria-label={t('common.edit')}
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    className="btn-danger btn-sm"
                    onClick={() => setConfirmId(img.id)}
                    aria-label={t('common.delete')}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={isOpen}
        onClose={closeForm}
        size="lg"
        title={editing ? t('admin.section.editing') : t('admin.section.create')}
        footer={
          <>
            <button type="button" className="btn-secondary" onClick={closeForm}>
              {t('common.cancel')}
            </button>
            <button type="submit" form="gallery-form" className="btn-primary">
              {t('common.save')}
            </button>
          </>
        }
      >
        <form id="gallery-form" onSubmit={submit} className="grid gap-4">
          <div>
            <label className="field-label">{t('admin.gallery.image')}</label>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {DEMO_IMAGES.map((src) => (
                <button
                  type="button"
                  key={src}
                  onClick={() => setForm({ ...form, src })}
                  className={cn(
                    'aspect-[16/10] overflow-hidden border-2 transition-colors',
                    form.src === src ? 'border-accent' : 'border-line hover:border-line-strong',
                  )}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <input
              type="text"
              value={form.src}
              onChange={(e) => setForm({ ...form, src: e.target.value })}
              placeholder="https://… or ./demo/*.svg"
            />
          </div>

          <fieldset className="grid sm:grid-cols-3 gap-3">
            <legend className="field-label">{t('admin.gallery.title')}</legend>
            {(['kk', 'ru', 'en'] as const).map((lc) => (
              <div key={lc}>
                <div className="text-[10px] uppercase tracking-wider text-ink-subtle mb-1">{lc}</div>
                <input
                  type="text"
                  value={form.title[lc]}
                  onChange={(e) =>
                    setForm({ ...form, title: { ...form.title, [lc]: e.target.value } })
                  }
                  required={lc === 'ru'}
                />
              </div>
            ))}
          </fieldset>

          <fieldset className="grid sm:grid-cols-3 gap-3">
            <legend className="field-label">{t('admin.gallery.caption')}</legend>
            {(['kk', 'ru', 'en'] as const).map((lc) => (
              <div key={lc}>
                <div className="text-[10px] uppercase tracking-wider text-ink-subtle mb-1">{lc}</div>
                <textarea
                  className="min-h-[80px]"
                  value={form.caption[lc]}
                  onChange={(e) =>
                    setForm({ ...form, caption: { ...form.caption, [lc]: e.target.value } })
                  }
                />
              </div>
            ))}
          </fieldset>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">{t('admin.gallery.order')}</label>
              <input
                type="number"
                min={1}
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="field-label">{t('common.status')}</label>
              <select
                value={form.isPublished ? 'on' : 'off'}
                onChange={(e) => setForm({ ...form, isPublished: e.target.value === 'on' })}
              >
                <option value="on">{t('common.published')}</option>
                <option value="off">{t('common.unpublished')}</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={confirmId !== null}
        onCancel={() => setConfirmId(null)}
        onConfirm={() => {
          if (confirmId) remove(confirmId);
          setConfirmId(null);
        }}
      />
    </>
  );
};
