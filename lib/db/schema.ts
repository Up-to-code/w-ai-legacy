import { pgTable, text, timestamp, boolean, index } from "drizzle-orm/pg-core";

// User table
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  emailVerified: boolean("emailVerified").default(false).notNull(),
  image: text("image"),
  phone: text("phone"),
  jobTitle: text("jobTitle"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
}, (table) => ({
  emailIdx: index("user_email_idx").on(table.email),
}));

// Session table
export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
}, (table) => ({
  tokenIdx: index("session_token_idx").on(table.token),
  userIdIdx: index("session_userId_idx").on(table.userId),
}));

// Account table
export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("account_userId_idx").on(table.userId),
}));

// Verification table
export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
}, (table) => ({
  identifierIdx: index("verification_identifier_idx").on(table.identifier),
}));

// Contact table
export const contact = pgTable("contact", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  phone: text("phone"),
  email: text("email"),
  tags: text("tags").array(), // Array of tag IDs
  orderCount: text("orderCount").default("0"),
  lastActivityAt: timestamp("lastActivityAt"),
  notes: text("notes"),
  metadata: text("metadata"), // JSON string for additional data
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("contact_userId_idx").on(table.userId),
  phoneIdx: index("contact_phone_idx").on(table.phone),
  emailIdx: index("contact_email_idx").on(table.email),
}));

// Campaign table
export const campaign = pgTable("campaign", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  status: text("status").notNull().default("draft"), // draft, scheduled, active, completed, failed, paused
  
  // Audience configuration
  audienceType: text("audienceType").default("all"), // all, tags, count, recent
  includedTags: text("includedTags").array(), // Array of tag IDs if audienceType is tags
  contactLimit: text("contactLimit"), // For "count" type - send to first N contacts
  recentDays: text("recentDays"), // For "recent" type - contacts from last X days
  targetAudienceCount: text("targetAudienceCount").default("0"),
  
  // Message configuration
  messageType: text("messageType").default("text"), // text, image, template
  messageContent: text("messageContent"), // text content or image URL
  templateId: text("templateId").references(() => template.id, { onDelete: "set null" }),

  // Stats
  deliveredCount: text("deliveredCount").default("0"),
  readCount: text("readCount").default("0"),
  
  // Timing
  scheduledAt: timestamp("scheduledAt"),
  sentAt: timestamp("sentAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("campaign_userId_idx").on(table.userId),
  statusIdx: index("campaign_status_idx").on(table.status),
}));

// Message table
export const message = pgTable("message", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  campaignId: text("campaignId").references(() => campaign.id, { onDelete: "set null" }),
  contactId: text("contactId")
    .notNull()
    .references(() => contact.id, { onDelete: "cascade" }),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  direction: text("direction").notNull(), // inbound, outbound
  content: text("content").notNull(),
  status: text("status").notNull().default("sent"), // sent, delivered, read, failed
  metadata: text("metadata"), // JSON string for additional data
  sentAt: timestamp("sentAt"),
  readAt: timestamp("readAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  campaignIdIdx: index("message_campaignId_idx").on(table.campaignId),
  contactIdIdx: index("message_contactId_idx").on(table.contactId),
  userIdIdx: index("message_userId_idx").on(table.userId),
  statusIdx: index("message_status_idx").on(table.status),
}));

// Template table
export const template = pgTable("template", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  content: text("content").notNull(),
  category: text("category").default("general"), // welcome, general, marketing, support
  usageCount: text("usageCount").default("0"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("template_userId_idx").on(table.userId),
  categoryIdx: index("template_category_idx").on(table.category),
}));

// Bot Settings table
export const botSetting = pgTable("bot_setting", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").default("المساعد الذكي"),
  tone: text("tone").default("friendly"), // formal, friendly, enthusiastic
  systemPrompt: text("systemPrompt").default("أنت مساعد ذكي ومفيد لشركة تقنية. يجب أن تكون ردودك قصيرة، مهذبة، وباللغة العربية."),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("bot_setting_userId_idx").on(table.userId),
}));

// Knowledge Source table
export const knowledgeSource = pgTable("knowledge_source", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // file, text, url
  name: text("name").notNull(),
  content: text("content"), // For text type
  fileUrl: text("fileUrl"), // For file type
  metadata: text("metadata"), // JSON string for additional data
  sizeBytes: text("sizeBytes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("knowledge_source_userId_idx").on(table.userId),
  typeIdx: index("knowledge_source_type_idx").on(table.type),
}));

// Integration table
export const integration = pgTable("integration", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  serviceId: text("serviceId").notNull(), // whatsapp, zapier, slack, mailchimp, etc.
  serviceName: text("serviceName").notNull(),
  status: text("status").notNull().default("disconnected"), // connected, disconnected, error
  credentials: text("credentials"), // Encrypted JSON string
  metadata: text("metadata"), // JSON string for additional settings
  connectedAt: timestamp("connectedAt"),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("integration_userId_idx").on(table.userId),
  serviceIdIdx: index("integration_serviceId_idx").on(table.serviceId),
  statusIdx: index("integration_status_idx").on(table.status),
  uniqueUserService: index("integration_userId_serviceId_idx").on(table.userId, table.serviceId),
}));

// Tag table
export const tag = pgTable("tag", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  color: text("color").default("blue"), // blue, green, red, yellow, purple, etc.
  contactCount: text("contactCount").default("0"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("tag_userId_idx").on(table.userId),
}));

export const schema = {
  user,
  session,
  account,
  verification,
  contact,
  campaign,
  message,
  template,
  botSetting,
  knowledgeSource,
  integration,
  tag,
};
