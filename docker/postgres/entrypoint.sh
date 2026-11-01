#!/bin/sh
set -e

# Background process that waits for PostgreSQL to be ready and applies init.sql
(
  echo "Waiting for PostgreSQL to accept connections..."
  until pg_isready -h 127.0.0.1 -p 5432 -U "${POSTGRES_USER:-supoclip}" -d "${POSTGRES_DB:-supoclip}"; do
    sleep 2
  done
  echo "PostgreSQL is ready! Ensuring schema from /docker-entrypoint-initdb.d/init.sql is applied..."
  PGPASSWORD="${POSTGRES_PASSWORD:-supoclip_password}" psql -h 127.0.0.1 -U "${POSTGRES_USER:-supoclip}" -d "${POSTGRES_DB:-supoclip}" -f /docker-entrypoint-initdb.d/init.sql || true
  echo "PostgreSQL schema check completed."
) &

exec docker-entrypoint.sh "$@"

