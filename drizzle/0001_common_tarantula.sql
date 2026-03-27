CREATE TABLE `emailLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`to` varchar(320) NOT NULL,
	`from` varchar(320) NOT NULL,
	`cc` text,
	`bcc` text,
	`subject` varchar(500) NOT NULL,
	`textContent` text,
	`htmlContent` text,
	`status` enum('pending','sent','failed') NOT NULL DEFAULT 'pending',
	`messageId` varchar(255),
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `emailLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `verificationCodes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`code` varchar(10) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`used` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `verificationCodes_id` PRIMARY KEY(`id`)
);
