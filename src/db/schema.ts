import { pgTable, uuid, text, boolean, integer, timestamp, jsonb, primaryKey } from 'drizzle-orm/pg-core';

// Roles
export const roles = pgTable('roles', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Faculties
export const faculties = pgTable('faculties', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Departments
export const departments = pgTable('departments', {
  id: uuid('id').defaultRandom().primaryKey(),
  facultyId: uuid('faculty_id').notNull().references(() => faculties.id),
  code: text('code').notNull(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Users
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').unique(),
  passwordHash: text('password_hash'),
  displayName: text('display_name').notNull(),
  primaryRoleId: uuid('primary_role_id').references(() => roles.id),
  provisionalReg: text('provisional_reg').unique(),
  officialRegNo: text('official_reg_no').unique(),
  isActive: boolean('is_active').default(true),
  isEmailVerified: boolean('is_email_verified').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
});

// Profiles
export const profiles = pgTable('profiles', {
  userId: uuid('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  facultyId: uuid('faculty_id').references(() => faculties.id),
  departmentId: uuid('department_id').references(() => departments.id),
  entryYear: text('entry_year'),
  phone: text('phone'),
  bio: text('bio'),
  avatarUrl: text('avatar_url'),
  socials: jsonb('socials'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// User Roles
export const userRoles = pgTable('user_roles', {
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  roleId: uuid('role_id').notNull().references(() => roles.id, { onDelete: 'cascade' }),
  assignedBy: uuid('assigned_by').references(() => users.id),
  assignedAt: timestamp('assigned_at', { withTimezone: true }).defaultNow(),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.roleId] }),
}));

// Clubs
export const clubs = pgTable('clubs', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique(),
  description: text('description'),
  logoUrl: text('logo_url'),
  coverUrl: text('cover_url'),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const clubMemberships = pgTable('club_memberships', {
  id: uuid('id').defaultRandom().primaryKey(),
  clubId: uuid('club_id').notNull().references(() => clubs.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: text('role').default('member'),
  joinedAt: timestamp('joined_at', { withTimezone: true }).defaultNow(),
  leftAt: timestamp('left_at', { withTimezone: true }),
});

// Announcements
export const announcements = pgTable('announcements', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  body: text('body'),
  createdBy: uuid('created_by').references(() => users.id),
  clubId: uuid('club_id').references(() => clubs.id),
  pinned: boolean('pinned').default(false),
  visibility: text('visibility').default('public'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

// Events
export const events = pgTable('events', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  organizerId: uuid('organizer_id').references(() => users.id),
  clubId: uuid('club_id').references(() => clubs.id),
  venue: text('venue'),
  address: text('address'),
  coordinates: jsonb('coordinates'),
  capacity: integer('capacity'),
  startsAt: timestamp('starts_at', { withTimezone: true }),
  endsAt: timestamp('ends_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const eventRsvps = pgTable('event_rsvps', {
  id: uuid('id').defaultRandom().primaryKey(),
  eventId: uuid('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  status: text('status').default('going'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Resources
export const resources = pgTable('resources', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  ownerId: uuid('owner_id').references(() => users.id, { onDelete: 'set null' }),
  clubId: uuid('club_id').references(() => clubs.id),
  eventId: uuid('event_id').references(() => events.id),
  resourceType: text('resource_type').notNull(), // file | link
  mimeType: text('mime_type'),
  gcsPath: text('gcs_path'),
  fileSize: integer('file_size'),
  linkUrl: text('link_url'),
  downloads: integer('downloads').default(0),
  tags: text('tags').array(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

// Projects / Portfolios
export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  ownerId: uuid('owner_id').references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  techStack: text('tech_stack').array(),
  linkUrl: text('link_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

// Mentorship
export const mentorshipProfiles = pgTable('mentorship_profiles', {
  userId: uuid('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  isMentor: boolean('is_mentor').default(false),
  expertise: text('expertise').array(),
  bio: text('bio'),
  hourlyRateMoney: integer('hourly_rate_money'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const mentorshipRequests = pgTable('mentorship_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  mentorId: uuid('mentor_id').references(() => users.id, { onDelete: 'cascade' }),
  menteeId: uuid('mentee_id').references(() => users.id, { onDelete: 'cascade' }),
  topic: text('topic'),
  message: text('message'),
  status: text('status').default('pending'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// XP & Badges
export const xpTransactions = pgTable('xp_transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  amount: integer('amount').notNull(),
  reason: text('reason'),
  meta: jsonb('meta'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const badges = pgTable('badges', {
  id: uuid('id').defaultRandom().primaryKey(),
  key: text('key').notNull().unique(),
  title: text('title').notNull(),
  description: text('description'),
  xpReward: integer('xp_reward').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const userBadges = pgTable('user_badges', {
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  badgeId: uuid('badge_id').references(() => badges.id, { onDelete: 'cascade' }),
  awardedAt: timestamp('awarded_at', { withTimezone: true }).defaultNow(),
  sourceTxnId: uuid('source_txn_id').references(() => xpTransactions.id),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.badgeId] }),
}));

// Notifications
export const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  actorId: uuid('actor_id').references(() => users.id),
  type: text('type'),
  payload: jsonb('payload'),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Audit Logs
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  actorId: uuid('actor_id').references(() => users.id),
  action: text('action').notNull(),
  targetTable: text('target_table'),
  targetId: uuid('target_id'),
  payload: jsonb('payload'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Auth Sessions
export const authSessions = pgTable('auth_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  provider: text('provider'),
  refreshTokenHash: text('refresh_token_hash'),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
