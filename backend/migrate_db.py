import os
from sqlmodel import create_engine, text
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

def migrate():
    with engine.connect() as conn:
        print("Starting comprehensive migration...")
        
        # Helper to add columns safely and drop NOT NULL
        def sanitize_column(table, col, type_info):
            try:
                # Add if not exists
                conn.execute(text(f'ALTER TABLE "{table}" ADD COLUMN IF NOT EXISTS "{col}" {type_info}'))
                # Drop NOT NULL to be safe with name mapping
                conn.execute(text(f'ALTER TABLE "{table}" ALTER COLUMN "{col}" DROP NOT NULL'))
                print(f"Sanitized column '{col}' in '{table}' table.")
            except Exception as e:
                print(f"Error sanitizing column '{col}' in '{table}': {e}")

        # 1. User Table
        user_cols = [
            ("name", "VARCHAR(255)"),
            ("email_verified", "BOOLEAN"),
            ("emailVerified", "BOOLEAN"),
            ("image", "VARCHAR(1000)"),
            ("password_hash", "VARCHAR(255)"),
            ("password", "VARCHAR(255)"),
            ("created_at", "TIMESTAMP"),
            ("createdAt", "TIMESTAMP"),
            ("updated_at", "TIMESTAMP"),
            ("updatedAt", "TIMESTAMP")
        ]
        for name, type_info in user_cols:
            sanitize_column("user", name, type_info)

        # 2. Session Table
        conn.execute(text('CREATE TABLE IF NOT EXISTS "session" (id VARCHAR(255) PRIMARY KEY)'))
        session_cols = [
            ("expiresAt", "TIMESTAMP"),
            ("expires_at", "TIMESTAMP"),
            ("token", "VARCHAR(255)"),
            ("createdAt", "TIMESTAMP"),
            ("created_at", "TIMESTAMP"),
            ("updatedAt", "TIMESTAMP"),
            ("updated_at", "TIMESTAMP"),
            ("ipAddress", "VARCHAR(255)"),
            ("ip_address", "VARCHAR(255)"),
            ("userAgent", "VARCHAR(255)"),
            ("user_agent", "VARCHAR(255)"),
            ("userId", "VARCHAR(255)"),
            ("user_id", "VARCHAR(255)")
        ]
        for name, type_info in session_cols:
            sanitize_column("session", name, type_info)

        # 3. Account Table
        conn.execute(text('CREATE TABLE IF NOT EXISTS "account" (id VARCHAR(255) PRIMARY KEY)'))
        account_cols = [
            ("accountId", "VARCHAR(255)"),
            ("account_id", "VARCHAR(255)"),
            ("providerId", "VARCHAR(255)"),
            ("provider_id", "VARCHAR(255)"),
            ("userId", "VARCHAR(255)"),
            ("user_id", "VARCHAR(255)"),
            ("accessToken", "TEXT"),
            ("access_token", "TEXT"),
            ("refreshToken", "TEXT"),
            ("refresh_token", "TEXT"),
            ("idToken", "TEXT"),
            ("id_token", "TEXT"),
            ("expiresAt", "TIMESTAMP"),
            ("expires_at", "TIMESTAMP"),
            ("password", "TEXT"),
            ("createdAt", "TIMESTAMP"),
            ("created_at", "TIMESTAMP"),
            ("updatedAt", "TIMESTAMP"),
            ("updated_at", "TIMESTAMP")
        ]
        for name, type_info in account_cols:
            sanitize_column("account", name, type_info)

        # 4. Verification Table
        conn.execute(text('CREATE TABLE IF NOT EXISTS "verification" (id VARCHAR(255) PRIMARY KEY)'))
        verification_cols = [
            ("identifier", "VARCHAR(255)"),
            ("value", "VARCHAR(255)"),
            ("expiresAt", "TIMESTAMP"),
            ("expires_at", "TIMESTAMP"),
            ("createdAt", "TIMESTAMP"),
            ("created_at", "TIMESTAMP"),
            ("updatedAt", "TIMESTAMP"),
            ("updated_at", "TIMESTAMP")
        ]
        for name, type_info in verification_cols:
            sanitize_column("verification", name, type_info)
        
        # 5. Task Table (Phase 5 fields)
        conn.execute(text('CREATE TABLE IF NOT EXISTS "task" (id TEXT PRIMARY KEY)'))
        task_cols = [
            ("title", "VARCHAR(255)"),
            ("description", "TEXT"),
            ("status", "VARCHAR(20)"),
            ("priority", "VARCHAR(20)"),
            ("tags", "TEXT"),
            ("due_date", "TIMESTAMP"),
            ("is_recurring", "BOOLEAN"),
            ("recurrence_pattern", "VARCHAR(50)"),
            ("user_id", "TEXT"),
            ("created_at", "TIMESTAMP"),
            ("completed_at", "TIMESTAMP")
        ]
        for name, type_info in task_cols:
            sanitize_column("task", name, type_info)

        conn.commit()
        print("Successfully synchronized all tables and columns including Phase 5 features.")

        print("Migration finished.")

if __name__ == "__main__":
    migrate()
