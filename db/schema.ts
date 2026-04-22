import { pgTable, serial, text, timestamp, integer, boolean, real, pgEnum, uniqueIndex, unique } from 'drizzle-orm/pg-core';

// ============ ENUMS ============
export const roleEnum = pgEnum('role', ['USER', 'ADMIN', 'STAFF']);
export const cropStatusEnum = pgEnum('crop_status', ['Verde', 'Amarillo', 'Rojo']);
export const phaseEnum = pgEnum('phase', ['Germinacion', 'Vegetacion', 'Floracion', 'Senescencia']);
export const productCategoryEnum = pgEnum('product_category', ['Flores', 'Parafernalia', 'Geneticas']);
export const productStatusEnum = pgEnum('product_status', ['Active', 'Paused', 'SoldOut']);
export const orderStatusEnum = pgEnum('order_status', ['Pendiente', 'Entregado', 'Cancelado']);
export const postCategoryEnum = pgEnum('post_category', ['Clases', 'Investigaciones', 'FAQ', 'Debates', 'Papers', 'Noticias', 'Anuncios']);
export const reactionTypeEnum = pgEnum('reaction_type', ['Interesante', 'Util', 'Cientifico']);
export const cultivationMethodEnum = pgEnum('cultivation_method', ['Hidroponia', 'Organico', 'SalesMinerales', 'Mixto']);
export const planTypeEnum = pgEnum('plan_type', ['Hogar', 'Local']);
export const cultivatorStatusEnum = pgEnum('cultivator_status', ['active', 'inactive']);
export const tokenReasonEnum = pgEnum('token_reason', ['subscription_approval', 'purchase', 'sale', 'admin_grant', 'event_reservation']);

// ============ TABLES ============

// USER - Tabla central con 12 relaciones
export const users = pgTable('user', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  email: text('email').unique(),
  role: roleEnum('role').default('USER').notNull(),
  isDev: boolean('is_dev').default(false),
  tokens: integer('tokens').default(100),
  isVerified: boolean('is_verified').default(false),
  emailVerified: boolean('email_verified').default(false),
  verificationToken: text('verification_token'),
  lastVerificationSent: timestamp('last_verification_sent'),
  phone: text('phone'),
  address: text('address'),
  bio: text('bio'),
  birthDate: timestamp('birth_date'),
  avatar: text('avatar'),
  preferredGenetics: text('preferred_genetics'),
  planType: planTypeEnum('plan_type').default('Hogar'),
  isCultivator: boolean('is_cultivator').default(false),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

// CROPS - Cultivos hidroponicos del usuario
export const crops = pgTable('crop', {
  id: serial('id').primaryKey(),
  bucketName: text('bucket_name').notNull(),
  imageUrl: text('image_url'),
  status: cropStatusEnum('status').default('Verde'),
  cultivationMethod: cultivationMethodEnum('cultivation_method').default('Organico'),
  userId: integer('user_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// CROP LOGS - Registros semanales de cultivo
export const cropLogs = pgTable('crop_log', {
  id: serial('id').primaryKey(),
  week: text('week').notNull(),
  phase: phaseEnum('phase').default('Vegetacion'),
  ph: real('ph'),
  ec: real('ec'),
  grow: real('grow').default(0),
  micro: real('micro').default(0),
  bloom: real('bloom').default(0),
  notes: text('notes'),
  imageUrl: text('image_url'),
  feedback: text('feedback'),
  lightHours: real('light_hours'),
  nutrientsSolution: text('nutrients_solution'),
  sanitaryNotes: text('sanitary_notes'),
  preventives: text('preventives'),
  cropId: integer('crop_id').notNull().references(() => crops.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// PRODUCTS - Items del marketplace
export const products = pgTable('product', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  category: productCategoryEnum('category').default('Flores'),
  price: integer('price').default(0),
  basePrice: integer('base_price').default(0),
  stock: integer('stock').default(1),
  imageUrl: text('image_url'),
  sellerId: integer('seller_id').notNull().references(() => users.id),
  labReportId: integer('lab_report_id'),
  status: productStatusEnum('status').default('Active'),
  createdAt: timestamp('created_at').defaultNow(),
});

// WISHLIST - Relación usuario-producto
export const wishlists = pgTable('wishlist', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  productId: integer('product_id').notNull().references(() => products.id),
  createdAt: timestamp('created_at').defaultNow(),
}, (t) => ({
  unq: uniqueIndex('wishlist_user_product').on(t.userId, t.productId),
}));

// NOTIFICATIONS - Notificaciones del usuario
export const notifications = pgTable('notification', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  message: text('message').notNull(),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// ORDERS - Pedidos
export const orders = pgTable('order', {
  id: serial('id').primaryKey(),
  buyerId: integer('buyer_id').notNull().references(() => users.id),
  totalPrice: integer('total_price').notNull(),
  status: orderStatusEnum('status').default('Pendiente'),
  createdAt: timestamp('created_at').defaultNow(),
});

// ORDER ITEMS - items del pedido
export const orderItems = pgTable('order_item', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').notNull().references(() => orders.id),
  productId: integer('product_id').notNull().references(() => products.id),
  quantity: integer('quantity').default(1),
  price: integer('price').notNull(),
});

// POSTS - Publicaciones del foro
export const posts = pgTable('post', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  category: postCategoryEnum('category').default('Debates'),
  youtubeLink: text('youtube_link'),
  fileUrl: text('file_url'),
  authorId: integer('author_id').notNull().references(() => users.id),
  likes: integer('likes').default(0),
  isPinned: boolean('is_pinned').default(false),
  isImmutable: boolean('is_immutable').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// ATTACHMENTS - Archivos de posts
export const attachments = pgTable('attachment', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  url: text('url').notNull(),
  type: text('type').notNull(),
  postId: integer('post_id').notNull().references(() => posts.id),
});

// COMMENTS - Comentarios de posts
export const comments = pgTable('comment', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  postId: integer('post_id').notNull().references(() => posts.id),
  authorId: integer('author_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// SUBSCRIPTIONS - Suscripciones a posts
export const subscriptions = pgTable('subscription', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  postId: integer('post_id').notNull().references(() => posts.id),
  createdAt: timestamp('created_at').defaultNow(),
}, (t) => ({
  unq: uniqueIndex('subscription_user_post').on(t.userId, t.postId),
}));

// REACTIONS - Reacciones a posts
export const reactions = pgTable('reaction', {
  id: serial('id').primaryKey(),
  type: reactionTypeEnum('type').notNull(),
  userId: integer('user_id').notNull().references(() => users.id),
  postId: integer('post_id').notNull().references(() => posts.id),
  createdAt: timestamp('created_at').defaultNow(),
}, (t) => ({
  unq: uniqueIndex('reaction_user_post').on(t.userId, t.postId),
}));

// REVIEWS - Reseñas de pedidos
export const reviews = pgTable('review', {
  id: serial('id').primaryKey(),
  rating: integer('rating').default(5),
  comment: text('comment'),
  orderId: integer('order_id').unique().notNull().references(() => orders.id),
  productId: integer('product_id').notNull().references(() => products.id),
  sellerId: integer('seller_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// EVENTS - Eventos
export const events = pgTable('event', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  date: timestamp('date').notNull(),
  time: text('time').notNull(),
  location: text('location').notNull(),
  requirements: text('requirements'),
  flyerUrl: text('flyer_url'),
  capacity: integer('capacity').default(50),
  createdAt: timestamp('created_at').defaultNow(),
});

// TICKET CATEGORIES - Categorías de tickets
export const ticketCategories = pgTable('ticket_category', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').notNull().references(() => events.id),
  name: text('name').notNull(),
  price: integer('price').default(0),
  benefits: text('benefits'),
});

// RESERVATIONS - Reservas de tickets
export const reservations = pgTable('reservation', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  categoryId: integer('category_id').notNull().references(() => ticketCategories.id),
  qrCode: text('qr_code'),
  createdAt: timestamp('created_at').defaultNow(),
});

// LEGAL CONTENT - Términos y privacidad
export const legalContents = pgTable('legal_content', {
  id: serial('id').primaryKey(),
  terms: text('terms').notNull(),
  type: text('type').unique().notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// USER DOCUMENTS - Expediente legal del usuario
export const userDocuments = pgTable('user_document', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  url: text('url').notNull(),
  type: text('type').notNull(),
  uploadedBy: integer('uploaded_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// SOLIDARY CULTIVATORS - Modelo ONG: 150 cultivadores × 3 pacientes
export const solidaryCultivators = pgTable('solidary_cultivator', {
  id: serial('id').primaryKey(),
  cultivatorUserId: integer('cultivator_user_id').notNull().references(() => users.id),
  patientUserId: integer('patient_user_id').notNull().references(() => users.id),
  status: cultivatorStatusEnum('status').default('active'),
  createdAt: timestamp('created_at').defaultNow(),
}, (t) => ({
  unq: uniqueIndex('cultivator_patient_unique').on(t.cultivatorUserId, t.patientUserId),
}));

// TOKEN TRANSACTIONS - Log auditable de movimientos de tokens
export const tokenTransactions = pgTable('token_transaction', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  amount: integer('amount').notNull(),
  reason: tokenReasonEnum('reason').notNull(),
  relatedOrderId: integer('related_order_id').references(() => orders.id),
  performedBy: integer('performed_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// LAB REPORTS - Informes de cannabinoides
export const labReports = pgTable('lab_report', {
  id: serial('id').primaryKey(),
  cropId: integer('crop_id').notNull().references(() => crops.id),
  plantId: text('plant_id'),
  collectionDate: timestamp('collection_date').notNull(),
  results: text('results').notNull(),
  reportUrl: text('report_url'),
  createdBy: integer('created_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// ============ TYPE EXPORTS ============
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Crop = typeof crops.$inferSelect;
export type NewCrop = typeof crops.$inferInsert;
export type CropLog = typeof cropLogs.$inferSelect;
export type NewCropLog = typeof cropLogs.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type UserDocument = typeof userDocuments.$inferSelect;
export type NewUserDocument = typeof userDocuments.$inferInsert;
export type SolidaryCultivator = typeof solidaryCultivators.$inferSelect;
export type NewSolidaryCultivator = typeof solidaryCultivators.$inferInsert;
export type TokenTransaction = typeof tokenTransactions.$inferSelect;
export type NewTokenTransaction = typeof tokenTransactions.$inferInsert;
export type LabReport = typeof labReports.$inferSelect;
export type NewLabReport = typeof labReports.$inferInsert;
