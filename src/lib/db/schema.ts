import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const analyses = sqliteTable("analyses", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    repo_url: text("repo_url").notNull(),
    status: text("status", { enum: ["pending", "running", "completed", "failed"] }).default("pending"),
    result: text("result", { mode: "json" }),
    summary: text("summary"),
    error: text("error"),
    error_message: text("error_message"),
    created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
    updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const subscriptions = sqliteTable("subscriptions", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().unique(),
    plan: text("plan", { enum: ["free", "pro"] }).default("free"),
    status: text("status", { enum: ["active", "paused", "canceled", "completed"] }).default("active"),
    razorpay_subscription_id: text("razorpay_subscription_id"),
    razorpay_plan_id: text("razorpay_plan_id"),
    amount: real("amount").default(0),
    current_period_end: integer("current_period_end"),
    created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});
