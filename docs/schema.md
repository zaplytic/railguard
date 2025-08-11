# Railguard - Database Schema

This document provides a detailed definition of the ***`Proposed`*** database schema for the Railguard application, built on PostgreSQL with the TimescaleDB extension.

## Schema Diagram (ERD)

```
+-------------+       +--------------+       +----------------+       +--------------+
|   users     |       |   projects   |       |     issues     |       |   events     |
|-------------|       |--------------|       |----------------|       |--------------|
| id (PK)     |o--|---| owner_id (FK)|       |                |       |              |
| email       |       | id (PK)      |o--|---| project_id(FK) |o--|---| issue_id(FK) |
| full_name   |       | name         |       | id (PK)        |       | id (PK)      |
| ...         |       | api_key      |       | ...            |       | timestamp    |
+-------------+       | ...          |       +----------------+       | payload      |
                      +--------------+                                +--------------+

+---------------------+       +----------------+       +-------------+
| performance_metrics |       |     spans      |       | span_events |
|---------------------|       |----------------|       |-------------|
| id (PK)             |       | id (PK)        |       | id (PK)     |
| project_id (FK)     |o--|---|                |       |             |
| timestamp           |       | trace_id       |o--|---| span_id (FK)|
| trace_id            |       | span_id        |       | timestamp   |
| duration            |       | parent_span_id |       | ...         |
| ...                 |       | ...            |       +-------------+
+---------------------+       +----------------+
```

## Table Definitions

### `users`
Stores information about users who can log in to the Railguard dashboard.

| Column          | Type            | Constraints              | Description                               |
|-----------------|-----------------|--------------------------|-------------------------------------------|
| `id`            | `uuid`          | `PRIMARY KEY`            | Unique identifier for the user.           |
| `full_name`     | `varchar(255)`  | `NULL`                   | The user's full name for display purposes.|
| `email`         | `varchar(255)`  | `UNIQUE`, `NOT NULL`     | User's email address for login.           |
| `password_hash` | `varchar(255)`  | `NOT NULL`               | Hashed password for the user.             |
| `created_at`    | `timestamptz`   | `NOT NULL`, `DEFAULT now()`| Timestamp of user creation.               |

### `projects`
Each project corresponds to an application that is being monitored by Railguard.

| Column       | Type          | Constraints                 | Description                               |
|--------------|---------------|-----------------------------|-------------------------------------------|
| `id`         | `uuid`        | `PRIMARY KEY`               | Unique identifier for the project.        |
| `name`       | `varchar(255)`| `NOT NULL`                  | User-defined name for the project.        |
| `owner_id`   | `uuid`        | `NOT NULL`, `FK to users.id`| The user who owns the project.            |
| `api_key`    | `uuid`        | `UNIQUE`, `NOT NULL`        | Public key used by SDKs for ingestion.    |
| `created_at` | `timestamptz` | `NOT NULL`, `DEFAULT now()` | Timestamp of project creation.            |

### `issues`
An `issue` is a group of similar events, aggregated by a grouping hash.

| Column          | Type            | Constraints                      | Description                                        |
|-----------------|-----------------|----------------------------------|----------------------------------------------------|
| `id`            | `uuid`          | `PRIMARY KEY`                    | Unique identifier for the issue.                   |
| `project_id`    | `uuid`          | `NOT NULL`, `FK to projects.id`  | The project this issue belongs to.                 |
| `fingerprint`   | `varchar(64)`   | `NOT NULL`                       | Hash used to group similar events.                 |
| `status`        | `varchar(20)`   | `NOT NULL`, `DEFAULT 'unresolved'`| Current status (`unresolved`, `resolved`, `ignored`).|
| `level`         | `varchar(20)`   | `NOT NULL`                       | The severity level from the first event.           |
| `message`       | `text`          | `NOT NULL`                       | The error message from the first event.            |
| `first_seen`    | `timestamptz`   | `NOT NULL`                       | Timestamp of the first event for this issue.       |
| `last_seen`     | `timestamptz`   | `NOT NULL`                       | Timestamp of the most recent event for this issue. |
| `event_count`   | `bigint`        | `NOT NULL`, `DEFAULT 1`          | The total number of events for this issue.         |

*Index:* A composite unique index should be created on `(project_id, fingerprint)`.

### `events`
An `event` is a single error or crash report sent from an SDK. This will be a **TimescaleDB Hypertable**.

| Column        | Type          | Constraints                   | Description                                        |
|---------------|---------------|-------------------------------|----------------------------------------------------|
| `id`          | `uuid`        | `PRIMARY KEY`                 | Unique identifier for the event.                   |
| `issue_id`    | `uuid`        | `NOT NULL`, `FK to issues.id`    | **Links this event to its parent issue group.**    |
| `project_id`  | `uuid`        | `NOT NULL`, `FK to projects.id`  | Denormalized for faster queries by project.        |
| `timestamp`   | `timestamptz` | `NOT NULL`                    | The exact time the event occurred on the client.   |
| `level`       | `varchar(20)` | `NOT NULL`                    | Severity level (e.g., 'error', 'warning', 'info'). |
| `message`     | `text`        | `NOT NULL`                    | The primary error message.                         |
| `stack_trace` | `jsonb`       | `NULL`                        | The stack trace, if available.                     |
| `tags`        | `jsonb`       | `NULL`                        | Custom, searchable key-value pairs.                |
| `metadata`    | `jsonb`       | `NULL`                        | Other non-indexed metadata about the event.        |
| `context`     | `jsonb`       | `NULL`                        | User-defined context data.                         |
| `created_at`  | `timestamptz` | `NOT NULL`, `DEFAULT now()`      | Timestamp of when the record was created in the DB.|

*TimescaleDB:* This table will be converted into a hypertable partitioned by the `timestamp` column.

### `performance_metrics`
This table forms the foundation for basic Application Performance Monitoring (APM) by capturing key transaction metrics. It will be a **TimescaleDB Hypertable**.

| Column           | Type            | Constraints                   | Description                                        |
|------------------|-----------------|-------------------------------|----------------------------------------------------|
| `id`             | `uuid`          | `PRIMARY KEY`                 | Unique identifier for the performance metric record.|
| `project_id`     | `uuid`          | `NOT NULL`, `FK to projects.id`| The project this metric belongs to.                |
| `timestamp`      | `timestamptz`   | `NOT NULL`                    | The exact time the metric was recorded.            |
| `transaction_name`| `varchar(255)`  | `NOT NULL`                    | Name of the transaction (e.g., '/users/login').    |
| `duration`       | `integer`       | `NOT NULL`                    | **Duration of the transaction in milliseconds.**   |
| `trace_id`       | `varchar(255)`  | `NOT NULL`                    | Identifier for a distributed trace or transaction instance.|
| `tags`           | `jsonb`         | `NULL`                        | Custom, searchable key-value pairs.                |
| `metadata`       | `jsonb`         | `NULL`                        | Other non-indexed metadata about the metric.       |
| `created_at`     | `timestamptz`   | `NOT NULL`, `DEFAULT now()`   | Timestamp of when the record was created in the DB.|

*TimescaleDB:* This table will be converted into a hypertable partitioned by the `timestamp` column.

### `spans`
Stores individual operations within a distributed trace. This will be a **TimescaleDB Hypertable**.

| Column           | Type            | Constraints                   | Description                                        |
|------------------|-----------------|-------------------------------|----------------------------------------------------|
| `id`             | `uuid`          | `PRIMARY KEY`                 | Unique identifier for the span.                    |
| `trace_id`       | `uuid`          | `NOT NULL`                    | The ID of the trace this span belongs to.          |
| `span_id`        | `uuid`          | `NOT NULL`                    | Unique identifier for this span within its trace.  |
| `parent_span_id` | `uuid`          | `NULL`                        | ID of the parent span, if any.                     |
| `operation_name` | `varchar(255)`  | `NOT NULL`                    | Name of the operation (e.g., `GET /users`, `db.query`).|
| `service_name`   | `varchar(255)`  | `NOT NULL`                    | Name of the service performing the operation.      |
| `kind`           | `varchar(20)`   | `NOT NULL`                    | Type of span (e.g., `client`, `server`, `internal`).|
| `start_time`     | `timestamptz`   | `NOT NULL`                    | Start time of the operation.                       |
| `end_time`       | `timestamptz`   | `NOT NULL`                    | End time of the operation.                         |
| `duration`       | `integer`       | `NOT NULL`                    | Duration of the operation in milliseconds.         |
| `status_code`    | `integer`       | `NULL`                        | Status code (e.g., HTTP status, gRPC status).      |
| `tags`           | `jsonb`         | `NULL`                        | Key-value attributes for the span.                 |
| `created_at`     | `timestamptz`   | `NOT NULL`, `DEFAULT now()`   | Timestamp of when the record was created in the DB.|

*TimescaleDB:* This table will be converted into a hypertable partitioned by the `start_time` column.

### `span_events` (for logs/events within a span)
Stores events or logs that occur within the lifetime of a span. This will be a **TimescaleDB Hypertable**.

| Column           | Type            | Constraints                   | Description                                        |
|------------------|-----------------|-------------------------------|----------------------------------------------------|
| `id`             | `uuid`          | `PRIMARY KEY`                 | Unique identifier for the span event.              |
| `span_id`        | `uuid`          | `NOT NULL`, `FK to spans.id`  | The span this event belongs to.                    |
| `timestamp`      | `timestamptz`   | `NOT NULL`                    | Time the event occurred.                           |
| `name`           | `varchar(255)`  | `NOT NULL`                    | Name of the event (e.g., `log`, `error`).          |
| `attributes`     | `jsonb`         | `NULL`                        | Key-value attributes for the event (e.g., log message).|
| `created_at`     | `timestamptz`   | `NOT NULL`, `DEFAULT now()`   | Timestamp of when the record was created in the DB.|

*TimescaleDB:* This table will be converted into a hypertable partitioned by the `timestamp` column.
