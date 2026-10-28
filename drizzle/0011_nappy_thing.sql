CREATE TABLE "practice_profiles" (
	"member_id" text PRIMARY KEY NOT NULL,
	"trade" text,
	"size" text,
	"pain_point" text,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "practice_reports" (
	"id" text PRIMARY KEY NOT NULL,
	"member_id" text NOT NULL,
	"subject" text NOT NULL,
	"task" text NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "practice_profiles" ADD CONSTRAINT "practice_profiles_member_id_users_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practice_reports" ADD CONSTRAINT "practice_reports_member_id_users_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "practice_reports_member" ON "practice_reports" USING btree ("member_id","created_at");