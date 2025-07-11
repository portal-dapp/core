import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const filesTable = pgTable('files_table', {
  id: serial('id').primaryKey(),
  cid: text('cid').notNull(),
  size: integer('size').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  isDirectory: text('is_directory').default('false'),
  fileNames: text('file_names').array().notNull().default([]),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});

export type InsertFile = typeof filesTable.$inferInsert;
export type SelectFile = typeof filesTable.$inferSelect;