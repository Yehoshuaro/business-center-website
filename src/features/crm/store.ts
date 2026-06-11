import { create } from 'zustand';
import { readPersisted, writePersisted } from '@/shared/utils/persist';
import { uid } from '@/shared/utils';

/* ============================================================
   Types
   ============================================================ */
export type CrmRole = 'admin' | 'manager' | 'viewer';

export interface CrmUser {
  id: string;
  name: string;
  email: string;
  password: string; // plain text on purpose — this is a local demo
  role: CrmRole;
  active: boolean;
}

export type DealStage = 'new' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
export const DEAL_STAGES: DealStage[] = ['new', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];

export interface Deal {
  id: string;
  title: string;
  amount: number; // KZT / month
  clientId: string;
  ownerId: string;
  stage: DealStage;
  updatedAt: string; // ISO
}

export interface CrmClient {
  id: string;
  company: string;
  contact: string;
  phone: string;
  email: string;
  industry: string;
}

export type TaskStatus = 'todo' | 'inProgress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface CrmTask {
  id: string;
  title: string;
  assigneeId: string;
  due: string; // ISO date
  status: TaskStatus;
  priority: TaskPriority;
}

export interface CrmActivity {
  id: string;
  text: string;
  createdAt: string;
}

/* ============================================================
   Demo seed
   ============================================================ */
const now = Date.now();
const day = 86_400_000;
const iso = (offsetDays: number) => new Date(now - offsetDays * day).toISOString();

export const CRM_DEMO_ACCOUNTS: { email: string; password: string; role: CrmRole }[] = [
  { email: 'admin@crm.kz', password: 'admin123', role: 'admin' },
  { email: 'manager@crm.kz', password: 'manager123', role: 'manager' },
  { email: 'viewer@crm.kz', password: 'viewer123', role: 'viewer' },
];

const seedUsers: CrmUser[] = [
  { id: 'u-01', name: 'Айгерим Сатпаева', email: 'admin@crm.kz', password: 'admin123', role: 'admin', active: true },
  { id: 'u-02', name: 'Дамир Ахметов', email: 'manager@crm.kz', password: 'manager123', role: 'manager', active: true },
  { id: 'u-03', name: 'Олжас Каиров', email: 'o.kairov@crm.kz', password: 'demo123', role: 'manager', active: true },
  { id: 'u-04', name: 'Guest Viewer', email: 'viewer@crm.kz', password: 'viewer123', role: 'viewer', active: true },
];

const seedClients: CrmClient[] = [
  { id: 'c-01', company: 'TechFlow Solutions', contact: 'Арман Бекетов', phone: '+7 701 200 10 01', email: 'a.beketov@techflow.kz', industry: 'IT' },
  { id: 'c-02', company: 'Astana Logistics Group', contact: 'Сауле Нурланова', phone: '+7 702 311 22 33', email: 's.nurlanova@alg.kz', industry: 'Logistics' },
  { id: 'c-03', company: 'KazFin Capital', contact: 'Тимур Жаксылыков', phone: '+7 705 415 60 80', email: 't.zhaksylykov@kazfin.kz', industry: 'Finance' },
  { id: 'c-04', company: 'Nomad Travel', contact: 'Дана Ермекова', phone: '+7 707 555 14 90', email: 'd.yermekova@nomad.kz', industry: 'Travel' },
  { id: 'c-05', company: 'Baiterek Consulting', contact: 'Ержан Калиев', phone: '+7 701 818 27 36', email: 'e.kaliev@baiterek-c.kz', industry: 'Consulting' },
  { id: 'c-06', company: 'Aspan Media', contact: 'Мадина Оспанова', phone: '+7 702 940 31 17', email: 'm.ospanova@aspan.media', industry: 'Media' },
  { id: 'c-07', company: 'GreenEnergy KZ', contact: 'Алишер Тулегенов', phone: '+7 708 246 80 12', email: 'a.tulegenov@greenenergy.kz', industry: 'Energy' },
  { id: 'c-08', company: 'Altyn Insurance', contact: 'Гульнара Сейтжанова', phone: '+7 705 133 75 44', email: 'g.seitzhanova@altyn-ins.kz', industry: 'Insurance' },
];

const seedDeals: Deal[] = [
  { id: 'd-01', title: 'Аренда офиса 412, 86 м²', amount: 1_290_000, clientId: 'c-01', ownerId: 'u-02', stage: 'negotiation', updatedAt: iso(1) },
  { id: 'd-02', title: 'Open space, этаж 6', amount: 3_400_000, clientId: 'c-02', ownerId: 'u-02', stage: 'proposal', updatedAt: iso(2) },
  { id: 'd-03', title: 'Этаж-блок 540 м²', amount: 8_100_000, clientId: 'c-03', ownerId: 'u-03', stage: 'qualified', updatedAt: iso(3) },
  { id: 'd-04', title: 'Кабинет 208, 28 м²', amount: 460_000, clientId: 'c-04', ownerId: 'u-03', stage: 'new', updatedAt: iso(0) },
  { id: 'd-05', title: 'Аренда зала Forum, годовой пакет', amount: 2_150_000, clientId: 'c-05', ownerId: 'u-02', stage: 'proposal', updatedAt: iso(4) },
  { id: 'd-06', title: 'Офис 715 + паркинг, 64 м²', amount: 980_000, clientId: 'c-06', ownerId: 'u-03', stage: 'won', updatedAt: iso(6) },
  { id: 'd-07', title: 'Кабинеты 1003–1005, 92 м²', amount: 1_420_000, clientId: 'c-07', ownerId: 'u-02', stage: 'won', updatedAt: iso(12) },
  { id: 'd-08', title: 'Переезд HQ, этажи 14–15', amount: 11_600_000, clientId: 'c-08', ownerId: 'u-02', stage: 'negotiation', updatedAt: iso(2) },
  { id: 'd-09', title: 'Коворкинг-пакет на 12 мест', amount: 540_000, clientId: 'c-04', ownerId: 'u-03', stage: 'lost', updatedAt: iso(9) },
  { id: 'd-10', title: 'Офис 318, 41 м²', amount: 615_000, clientId: 'c-01', ownerId: 'u-03', stage: 'new', updatedAt: iso(1) },
];

const seedTasks: CrmTask[] = [
  { id: 't-01', title: 'Показ офиса 412 для TechFlow', assigneeId: 'u-02', due: iso(-1), status: 'inProgress', priority: 'high' },
  { id: 't-02', title: 'Подготовить КП для Astana Logistics', assigneeId: 'u-02', due: iso(-2), status: 'todo', priority: 'high' },
  { id: 't-03', title: 'Согласовать договор с KazFin Capital', assigneeId: 'u-03', due: iso(-4), status: 'todo', priority: 'medium' },
  { id: 't-04', title: 'Обновить план этажа 6 в презентации', assigneeId: 'u-03', due: iso(1), status: 'done', priority: 'low' },
  { id: 't-05', title: 'Позвонить Nomad Travel по кабинету 208', assigneeId: 'u-02', due: iso(0), status: 'inProgress', priority: 'medium' },
  { id: 't-06', title: 'Счёт за зал Forum для Baiterek', assigneeId: 'u-03', due: iso(-6), status: 'todo', priority: 'low' },
  { id: 't-07', title: 'Передать ключи Aspan Media', assigneeId: 'u-02', due: iso(2), status: 'done', priority: 'medium' },
  { id: 't-08', title: 'Встреча с Altyn Insurance, этажи 14–15', assigneeId: 'u-02', due: iso(-3), status: 'todo', priority: 'high' },
];

const seedActivity: CrmActivity[] = [
  { id: 'a-01', text: 'Дамир Ахметов перевёл сделку «Аренда офиса 412» на этап «Переговоры»', createdAt: iso(1) },
  { id: 'a-02', text: 'Олжас Каиров добавил сделку «Офис 318, 41 м²»', createdAt: iso(1) },
  { id: 'a-03', text: 'Сделка «Офис 715 + паркинг» закрыта успешно', createdAt: iso(6) },
  { id: 'a-04', text: 'Добавлен клиент GreenEnergy KZ', createdAt: iso(8) },
];

/* ============================================================
   Persistence helpers
   ============================================================ */
const K = {
  session: 'crm.session',
  users: 'crm.users',
  clients: 'crm.clients',
  deals: 'crm.deals',
  tasks: 'crm.tasks',
  activity: 'crm.activity',
} as const;

export interface CrmSession {
  userId: string;
  email: string;
  name: string;
  role: CrmRole;
}

/* ============================================================
   Store
   ============================================================ */
interface CrmState {
  session: CrmSession | null;
  users: CrmUser[];
  clients: CrmClient[];
  deals: Deal[];
  tasks: CrmTask[];
  activity: CrmActivity[];

  signIn: (email: string, password: string) => boolean;
  signOut: () => void;

  log: (text: string) => void;

  upsertDeal: (deal: Omit<Deal, 'updatedAt'>) => void;
  moveDeal: (id: string, stage: DealStage) => void;
  removeDeal: (id: string) => void;

  upsertClient: (client: CrmClient) => void;
  removeClient: (id: string) => void;

  upsertTask: (task: CrmTask) => void;
  removeTask: (id: string) => void;

  upsertUser: (user: CrmUser) => void;
  removeUser: (id: string) => void;

  resetDemoData: () => void;
}

export const useCrmStore = create<CrmState>((set, get) => ({
  session: readPersisted<CrmSession | null>(K.session, null),
  users: readPersisted<CrmUser[]>(K.users, seedUsers),
  clients: readPersisted<CrmClient[]>(K.clients, seedClients),
  deals: readPersisted<Deal[]>(K.deals, seedDeals),
  tasks: readPersisted<CrmTask[]>(K.tasks, seedTasks),
  activity: readPersisted<CrmActivity[]>(K.activity, seedActivity),

  signIn: (email, password) => {
    const user = get().users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password && u.active,
    );
    if (!user) return false;
    const session: CrmSession = { userId: user.id, email: user.email, name: user.name, role: user.role };
    writePersisted(K.session, session);
    set({ session });
    return true;
  },

  signOut: () => {
    writePersisted<CrmSession | null>(K.session, null);
    set({ session: null });
  },

  log: (text) => {
    const entry: CrmActivity = { id: uid(), text, createdAt: new Date().toISOString() };
    const activity = [entry, ...get().activity].slice(0, 60);
    writePersisted(K.activity, activity);
    set({ activity });
  },

  upsertDeal: (deal) => {
    const full: Deal = { ...deal, updatedAt: new Date().toISOString() };
    const items = get().deals.some((d) => d.id === deal.id)
      ? get().deals.map((d) => (d.id === deal.id ? full : d))
      : [full, ...get().deals];
    writePersisted(K.deals, items);
    set({ deals: items });
  },

  moveDeal: (id, stage) => {
    const items = get().deals.map((d) =>
      d.id === id ? { ...d, stage, updatedAt: new Date().toISOString() } : d,
    );
    writePersisted(K.deals, items);
    set({ deals: items });
  },

  removeDeal: (id) => {
    const items = get().deals.filter((d) => d.id !== id);
    writePersisted(K.deals, items);
    set({ deals: items });
  },

  upsertClient: (client) => {
    const items = get().clients.some((c) => c.id === client.id)
      ? get().clients.map((c) => (c.id === client.id ? client : c))
      : [client, ...get().clients];
    writePersisted(K.clients, items);
    set({ clients: items });
  },

  removeClient: (id) => {
    const items = get().clients.filter((c) => c.id !== id);
    writePersisted(K.clients, items);
    set({ clients: items });
  },

  upsertTask: (task) => {
    const items = get().tasks.some((t) => t.id === task.id)
      ? get().tasks.map((t) => (t.id === task.id ? task : t))
      : [task, ...get().tasks];
    writePersisted(K.tasks, items);
    set({ tasks: items });
  },

  removeTask: (id) => {
    const items = get().tasks.filter((t) => t.id !== id);
    writePersisted(K.tasks, items);
    set({ tasks: items });
  },

  upsertUser: (user) => {
    const items = get().users.some((u) => u.id === user.id)
      ? get().users.map((u) => (u.id === user.id ? user : u))
      : [...get().users, user];
    writePersisted(K.users, items);
    set({ users: items });
  },

  removeUser: (id) => {
    const items = get().users.filter((u) => u.id !== id);
    writePersisted(K.users, items);
    set({ users: items });
  },

  resetDemoData: () => {
    writePersisted(K.users, seedUsers);
    writePersisted(K.clients, seedClients);
    writePersisted(K.deals, seedDeals);
    writePersisted(K.tasks, seedTasks);
    writePersisted(K.activity, seedActivity);
    set({
      users: seedUsers,
      clients: seedClients,
      deals: seedDeals,
      tasks: seedTasks,
      activity: seedActivity,
    });
  },
}));

/** Convenience: who can change data. Viewer is strictly read-only. */
export const useCrmCanEdit = () => {
  const role = useCrmStore((s) => s.session?.role);
  return role === 'admin' || role === 'manager';
};
