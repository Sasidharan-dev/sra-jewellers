import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { Product, GoldRateSnapshot } from "@/types";
import { products as seedProducts } from "@/data/products";
import { getPrisma } from "@/lib/server/prisma";

export type StoredOrder = {
  userId?: string;
  orderId: string;
  customerName: string;
  phone: string;
  email: string;
  address: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  paymentMethod: "upi" | "card" | "cod";
  paymentStatus: "pending" | "paid" | "cod";
  orderDate: string;
  estimatedDelivery: string;
  currentStepIndex: number;
  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    size?: string;
  }[];
  subtotal: number;
  makingCharges: number;
  tax: number;
  total: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
};

type Database = {
  orders: StoredOrder[];
  contacts: {
    id: string;
    name: string;
    phone: string;
    email: string;
    message: string;
    createdAt: string;
  }[];
  designRequests: Record<string, unknown>[];
  newsletter: { id: string; email: string; createdAt: string }[];
  users: {
    id: string;
    name: string;
    email: string;
    phone: string;
    passwordHash: string;
    role: "CUSTOMER" | "ADMIN";
    address?: {
      address: string;
      city: string;
      state: string;
      pincode: string;
      country: string;
    };
    createdAt: string;
  }[];
  sessions: { token: string; userId: string; expiresAt: string }[];
  productOverrides: Record<string, Partial<Product>>;
  customProducts: Product[];
  deletedProductIds: string[];
  goldRateOverride?: GoldRateSnapshot;
  contactStatuses: Record<string, string>;
  designStatuses: Record<string, string>;
  passwordResets: { token: string; userId: string; expiresAt: string }[];
  reviews: {
    id: string;
    productId: string;
    userId: string;
    name: string;
    rating: number;
    comment: string;
    createdAt: string;
  }[];
  wishlists: Record<string, string[]>;
  notifications: {
    id: string;
    type: string;
    recipient: string;
    subject: string;
    body: string;
    createdAt: string;
  }[];
};

// Vercel's deployed bundle is read-only. `/tmp` is writable for the lifetime of
// a serverless instance, while local development keeps using data/database.json.
const databaseDirectory = process.env.VERCEL
  ? path.join("/tmp", "sra-jewellers")
  : path.join(process.cwd(), "data");
const databasePath = path.join(databaseDirectory, "database.json");
let writeQueue = Promise.resolve();

const emptyDatabase: Database = {
  orders: [],
  contacts: [],
  designRequests: [],
  newsletter: [],
  users: [],
  sessions: [],
  productOverrides: {},
  customProducts: [],
  deletedProductIds: [],
  contactStatuses: {},
  designStatuses: {},
  passwordResets: [],
  reviews: [],
  wishlists: {},
  notifications: [],
};

async function readDatabase(): Promise<Database> {
  try {
    const raw = await fs.readFile(databasePath, "utf8");
    return { ...emptyDatabase, ...JSON.parse(raw) };
  } catch {
    await fs.mkdir(path.dirname(databasePath), { recursive: true });
    await fs.writeFile(databasePath, JSON.stringify(emptyDatabase, null, 2));
    return structuredClone(emptyDatabase);
  }
}

async function writeDatabase(database: Database) {
  writeQueue = writeQueue.then(async () => {
    await fs.mkdir(path.dirname(databasePath), { recursive: true });
    await fs.writeFile(databasePath, JSON.stringify(database, null, 2));
  });
  return writeQueue;
}

export async function listOrders() {
  const prisma = getPrisma();
  if (prisma) {
    const orders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { orderDate: "desc" },
    });

    return orders.map((order) => ({
      ...order,
      orderDate: order.orderDate.toISOString(),
      address: order.address as StoredOrder["address"],
      paymentMethod: order.paymentMethod as StoredOrder["paymentMethod"],
      paymentStatus: order.paymentStatus as StoredOrder["paymentStatus"],
      estimatedDelivery: order.estimatedDelivery,
      items: order.items.map((item) => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
      })),
    }));
  }
  return (await readDatabase()).orders;
}

export async function listCatalog() {
  const database = await readDatabase();
  const products = seedProducts
    .filter((product) => !database.deletedProductIds.includes(product.id))
    .map((product) => ({
      ...product,
      ...database.productOverrides[product.id],
    }));
  return [...products, ...database.customProducts];
}

export async function createCatalogProduct(product: Product) {
  const database = await readDatabase();
  database.customProducts.push(product);
  await writeDatabase(database);
  return product;
}

export async function updateCatalogProduct(
  id: string,
  changes: Partial<Product>,
) {
  const database = await readDatabase();
  const customIndex = database.customProducts.findIndex(
    (product) => product.id === id,
  );
  if (customIndex >= 0)
    database.customProducts[customIndex] = {
      ...database.customProducts[customIndex],
      ...changes,
    };
  else
    database.productOverrides[id] = {
      ...(database.productOverrides[id] ?? {}),
      ...changes,
    };
  await writeDatabase(database);
  return (await listCatalog()).find((product) => product.id === id);
}

export async function deleteCatalogProduct(id: string) {
  const database = await readDatabase();
  database.customProducts = database.customProducts.filter(
    (product) => product.id !== id,
  );
  if (
    seedProducts.some((product) => product.id === id) &&
    !database.deletedProductIds.includes(id)
  )
    database.deletedProductIds.push(id);
  await writeDatabase(database);
}

export async function updateStoredOrder(
  orderId: string,
  changes: Partial<StoredOrder>,
) {
  const prisma = getPrisma();
  if (prisma) {
    const order = await prisma.order.update({
      where: { orderId },
      data: {
        currentStepIndex: changes.currentStepIndex,
        paymentStatus: changes.paymentStatus,
        razorpayOrderId: changes.razorpayOrderId,
        razorpayPaymentId: changes.razorpayPaymentId,
        estimatedDelivery: changes.estimatedDelivery,
      },
      include: { items: true },
    });
    return {
      ...order,
      orderDate: order.orderDate.toISOString(),
      address: order.address as StoredOrder["address"],
      paymentMethod: order.paymentMethod as StoredOrder["paymentMethod"],
      paymentStatus: order.paymentStatus as StoredOrder["paymentStatus"],
      items: order.items.map((item) => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
      })),
    };
  }
  const database = await readDatabase();
  const index = database.orders.findIndex((order) => order.orderId === orderId);
  if (index < 0) return undefined;
  database.orders[index] = { ...database.orders[index], ...changes };
  await writeDatabase(database);
  return database.orders[index];
}

export async function getGoldRateOverride() {
  return (await readDatabase()).goldRateOverride;
}
export async function setGoldRateOverride(snapshot: GoldRateSnapshot) {
  const database = await readDatabase();
  database.goldRateOverride = snapshot;
  await writeDatabase(database);
  return snapshot;
}

export async function updateRequestStatus(
  type: "contact" | "design",
  id: string,
  status: string,
) {
  const database = await readDatabase();
  if (type === "contact") database.contactStatuses[id] = status;
  else database.designStatuses[id] = status;
  await writeDatabase(database);
}

export async function listContacts() {
  const database = await readDatabase();
  return database.contacts.map((item) => ({
    ...item,
    status: database.contactStatuses[item.id] ?? "NEW",
  }));
}
export async function listDesignRequests() {
  const database = await readDatabase();
  return database.designRequests.map((item) => ({
    ...item,
    status: database.designStatuses[String(item.id)] ?? "NEW",
  }));
}
export async function listUsers() {
  return (await readDatabase()).users.map(
    ({ passwordHash: _passwordHash, ...user }) => user,
  );
}

export async function findOrder(orderId: string) {
  const prisma = getPrisma();
  if (prisma) {
    const order = await prisma.order.findUnique({
      where: { orderId },
      include: { items: true },
    });
    return order
      ? {
          ...order,
          orderDate: order.orderDate.toISOString(),
          address: order.address as StoredOrder["address"],
          paymentMethod: order.paymentMethod as StoredOrder["paymentMethod"],
          paymentStatus: order.paymentStatus as StoredOrder["paymentStatus"],
          items: order.items.map((item) => ({
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            size: item.size,
          })),
        }
      : undefined;
  }
  return (await readDatabase()).orders.find(
    (order) => order.orderId === orderId,
  );
}

export async function createOrder(order: Omit<StoredOrder, "orderId">) {
  const prisma = getPrisma();
  if (prisma) {
    const orderId = `SRA-${new Date().getFullYear()}-${randomUUID().slice(0, 8).toUpperCase()}`;
    const created = await prisma.order.create({
      data: {
        orderId,
        customerName: order.customerName,
        phone: order.phone,
        email: order.email,
        address: order.address as object,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        orderDate: new Date(order.orderDate),
        estimatedDelivery: order.estimatedDelivery,
        currentStepIndex: order.currentStepIndex,
        subtotal: order.subtotal,
        makingCharges: order.makingCharges,
        tax: order.tax,
        total: order.total,
        user: order.userId ? { connect: { id: order.userId } } : undefined,
        razorpayOrderId: order.razorpayOrderId,
        razorpayPaymentId: order.razorpayPaymentId,
        items: { create: order.items },
      },
      include: { items: true },
    });
    return {
      ...created,
      orderDate: created.orderDate.toISOString(),
      address: created.address as StoredOrder["address"],
      paymentMethod: created.paymentMethod as StoredOrder["paymentMethod"],
      paymentStatus: created.paymentStatus as StoredOrder["paymentStatus"],
      items: created.items.map((item) => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
      })),
    };
  }
  const database = await readDatabase();
  const created = {
    ...order,
    orderId: `SRA-${new Date().getFullYear()}-${String(database.orders.length + 1).padStart(5, "0")}`,
  };
  database.orders.unshift(created);
  await writeDatabase(database);
  return created;
}

export async function saveContact(
  input: Omit<Database["contacts"][number], "id" | "createdAt">,
) {
  const database = await readDatabase();
  const created = {
    ...input,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };
  database.contacts.unshift(created);
  await writeDatabase(database);
  return created;
}

export async function saveDesignRequest(input: Record<string, unknown>) {
  const database = await readDatabase();
  database.designRequests.unshift(input);
  await writeDatabase(database);
  return input;
}

export async function subscribeNewsletter(email: string) {
  const database = await readDatabase();
  if (!database.newsletter.some((entry) => entry.email === email)) {
    database.newsletter.unshift({
      id: randomUUID(),
      email,
      createdAt: new Date().toISOString(),
    });
    await writeDatabase(database);
  }
}

export async function findUserByEmail(email: string) {
  const prisma = getPrisma();
  if (prisma)
    return prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  return (await readDatabase()).users.find(
    (user) => user.email === email.toLowerCase(),
  );
}

export async function createUser(input: Database["users"][number]) {
  const prisma = getPrisma();
  if (prisma)
    return prisma.user.create({
      data: {
        id: input.id,
        name: input.name,
        email: input.email,
        phone: input.phone,
        passwordHash: input.passwordHash,
        role: input.role,
        address: input.address as object,
        createdAt: new Date(input.createdAt),
      },
    });
  const database = await readDatabase();
  database.users.push(input);
  await writeDatabase(database);
  return input;
}

export async function createSession(
  userId: string,
  token: string,
  expiresAt: string,
) {
  const prisma = getPrisma();
  if (prisma) {
    await prisma.session.create({
      data: { userId, token, expiresAt: new Date(expiresAt) },
    });
    return;
  }
  const database = await readDatabase();
  database.sessions = database.sessions.filter(
    (session) => new Date(session.expiresAt) > new Date(),
  );
  database.sessions.push({ token, userId, expiresAt });
  await writeDatabase(database);
}

export async function getUserBySession(token: string) {
  const prisma = getPrisma();
  if (prisma) {
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });
    return session && session.expiresAt > new Date() ? session.user : undefined;
  }
  const database = await readDatabase();
  const session = database.sessions.find(
    (entry) => entry.token === token && new Date(entry.expiresAt) > new Date(),
  );
  return session
    ? database.users.find((user) => user.id === session.userId)
    : undefined;
}

export async function deleteSession(token: string) {
  const prisma = getPrisma();
  if (prisma) {
    await prisma.session.deleteMany({ where: { token } });
    return;
  }
  const database = await readDatabase();
  database.sessions = database.sessions.filter(
    (session) => session.token !== token,
  );
  await writeDatabase(database);
}

export async function updateUser(
  userId: string,
  changes: Partial<Database["users"][number]>,
) {
  const prisma = getPrisma();
  if (prisma)
    return prisma.user.update({
      where: { id: userId },
      data: {
        name: changes.name,
        phone: changes.phone,
        address: changes.address as object,
      },
    });
  const database = await readDatabase();
  const index = database.users.findIndex((user) => user.id === userId);
  if (index === -1) return undefined;
  database.users[index] = { ...database.users[index], ...changes };
  await writeDatabase(database);
  return database.users[index];
}

export async function createPasswordReset(
  userId: string,
  token: string,
  expiresAt: string,
) {
  const prisma = getPrisma();
  if (prisma) {
    await prisma.passwordReset.deleteMany({ where: { userId } });
    await prisma.passwordReset.create({
      data: { userId, token, expiresAt: new Date(expiresAt) },
    });
    return;
  }
  const database = await readDatabase();
  database.passwordResets = database.passwordResets.filter(
    (item) => new Date(item.expiresAt) > new Date(),
  );
  database.passwordResets.push({ userId, token, expiresAt });
  await writeDatabase(database);
}
export async function consumePasswordReset(token: string) {
  const prisma = getPrisma();
  if (prisma) {
    const item = await prisma.passwordReset.findUnique({ where: { token } });
    if (!item || item.expiresAt <= new Date()) return undefined;
    await prisma.passwordReset.delete({ where: { token } });
    return {
      userId: item.userId,
      token: item.token,
      expiresAt: item.expiresAt.toISOString(),
    };
  }
  const database = await readDatabase();
  const item = database.passwordResets.find(
    (entry) => entry.token === token && new Date(entry.expiresAt) > new Date(),
  );
  database.passwordResets = database.passwordResets.filter(
    (entry) => entry.token !== token,
  );
  await writeDatabase(database);
  return item;
}
export async function listReviews(productId: string) {
  return (await readDatabase()).reviews.filter(
    (review) => review.productId === productId,
  );
}
export async function createReview(review: Database["reviews"][number]) {
  const database = await readDatabase();
  database.reviews.unshift(review);
  await writeDatabase(database);
  return review;
}
export async function getWishlist(userId: string) {
  return (await readDatabase()).wishlists[userId] ?? [];
}
export async function setWishlist(userId: string, productIds: string[]) {
  const database = await readDatabase();
  database.wishlists[userId] = [...new Set(productIds)];
  await writeDatabase(database);
  return database.wishlists[userId];
}
export async function queueNotification(
  input: Omit<Database["notifications"][number], "id" | "createdAt">,
) {
  const database = await readDatabase();
  const notification = {
    ...input,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };
  database.notifications.unshift(notification);
  await writeDatabase(database);
  return notification;
}
