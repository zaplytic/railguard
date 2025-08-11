# Railguard - Technical Design Document

**Author:** `Jahid Hasan Imon`
**Date:** `August 13, 2025`

> A design document is a living document. It's meant to be challenged, debated, and updated as the project evolves.

## 1. Abstract

This document outlines the technical design and architecture for Railguard, a self-hosted application monitoring, error tracking, and crash reporting system. It details the high-level architecture, API specifications, database schema, and core components required to build the initial version of the product.

## 2. Background & Problem Statement

Developers need to track, analyze, and resolve issues in their applications to ensure a high-quality user experience. Commercial solutions like Sentry or Bugsnag can be expensive and may not meet the data privacy requirements of all organizations.

Railguard aims to solve this by providing a powerful, open-source, and self-hosted alternative, giving developers full control over their error-tracking infrastructure and data.

## 3. Goals & Non-Goals

#### Goals

*   **Multi-Language Support:** To build a system capable of ingesting, storing, and displaying error events from client applications, with initial first-party support for **JavaScript** and **Ruby on Rails**.
*   **Web Interface:** To provide a web interface for users to manage projects and view error reports with detailed stack traces.
*   **Real-time Alerting:** To implement a notification system that can send real-time alerts for new or recurring issues, with initial support for **email notifications**.
*   **Easy Deployment:** To ensure the entire system is easily deployable via a single `docker-compose up` command.
*   **Unified API:** To define a clear, versioned API for event ingestion that is flexible enough to accept payloads from different language ecosystems.
*   **Basic Performance Monitoring**: To collect and store basic performance metrics (e.g., transaction names, durations) for applications.

#### Non-Goals (for Version 1.0)

*   **Advanced Performance Monitoring (APM):** The focus is on error and crash reporting, not deep transaction tracing or performance-centric APM features.
*   **Log Management:** The system is not designed to be a general-purpose log aggregator like the ELK stack. It will only handle structured error events.
*   **Advanced Alerting Channels:** Support for other notification channels like Slack, PagerDuty, etc., will be considered for future versions.
*   **Complex Issue Grouping:** Initial grouping of events into "issues" will be based on simple heuristics (e.g., error message and top of the stack trace). Machine learning-based grouping is not a goal for V1.


## 4. High-Level Architecture

The system is split into two main paths: the **Data Ingestion Path** (asynchronous, high-throughput) and the **Control/Query Path** (synchronous, for user interaction).

```
// Row 1: Data Ingestion
+----------------------+      +----------------+
| Client Application   |----->|    Ingestor    |
| (SDK: JS, Rails)     |      | (Lightweight)  |
+----------------------+      +----------------+
                                    |
                                    |
                                    v
// Row 2: Asynchronous Backend Processing
+----------------+      +-----------------+      +--------------------------+
|   RabbitMQ     |----->|      Worker     |----->|        PostgreSQL        |
| (Message Queue)|      | (Heavy Lifting) |      |    (w/ TimescaleDB)      |
+----------------+      +-----------------+      +------------+-------------+
                                                              ^
                                                              |
// Row 3: User-Facing Control Plane & Presentation            |
+----------------------+      +----------------+              |
|   Web Dashboard      |<---->|                |--------------+
+----------------------+      |      API       |
                              | (Control Plane)|
+----------------------+      |                |
|  Mobile Dashboard    |<---->|                |
+----------------------+      +----------------+
```

### Component Breakdown:

1.  **Ingestor:** A lightweight public endpoint that receives events from SDKs, validates the project API key, and pushes the raw event into RabbitMQ.
2.  **RabbitMQ:** A robust message broker that acts as a buffer, decoupling the Ingestor from the Worker. It enables a "work queue" pattern for high reliability.
3.  **Worker:** A background service that consumes events from RabbitMQ. It performs heavy lifting like data sanitization, issue grouping, and data enrichment before writing to the database.
4.  **PostgreSQL with TimescaleDB:** The primary data store. TimescaleDB is a PostgreSQL extension that supercharges it for time-series data like events, providing significant performance gains for queries and analytics.
5.  **API:** The "Control Plane" for the system. It serves the Web and Mobile dashboards, handling user authentication, project management, and querying the processed data from the database.
6.  **Web & Mobile Apps:** User-facing dashboards for viewing and interacting with the error data. They communicate exclusively with the API.

## 5. Component Deep Dive

This section breaks down the specific responsibilities, technologies, and data models for each service defined in the architecture.

### 5.1. Ingestor Service

*   **Technology:** Node.js with **Fastify**. Fastify is chosen over Express for its higher performance and lower overhead, which is ideal for an ingestion service.
*   **Core Responsibilities:**
    1.  Expose a single primary endpoint: `POST /api/v1/events/:project_id`.
    2.  Receive the event payload in the request body.
    3.  Perform minimal, high-speed validation: check that the `:project_id` is a valid UUID format.
    4.  Publish the raw event payload and `project_id` as a message to a RabbitMQ queue (e.g., `events.raw`).
    5.  Immediately respond to the client with `202 Accepted`.

### 5.2. Worker Service

*   **Technology:** Node.js. This allows for shared code and types with the other backend services.
*   **Core Responsibilities:**
    1.  Connect to RabbitMQ and subscribe to the `events.raw` queue.
    2.  Upon receiving an event message, parse and validate the payload.
    3.  Generate a `grouping_hash` for the event (e.g., hash of error message + top stack frame).
    4.  Check if an `issue` with this `grouping_hash` exists. If not, create one. If it does, update `last_seen` and increment `event_count`.
    5.  Insert the full event payload into the `events` table, linked to the issue.
    6.  If the issue is new, publish a message to a `notifications.email` queue.

### 5.3. API Service

*   **Technology:** Node.js with **Express.js** (as already set up in the monorepo).
*   **Core Responsibilities:**
    *   User authentication and JWT management.
    *   CRUD operations for projects.
    *   Provide authenticated endpoints for frontends to query processed data from PostgreSQL.

### 5.4. Detailed Database Schema

The detailed database schema, including table definitions, column types, and relationships, is maintained in a separate document to serve as a single source of truth.

[**View the Database Schema (docs/schema.md)**](./schema.md)
