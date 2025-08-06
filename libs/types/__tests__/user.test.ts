import {
  User,
  UserRole,
  CreateUserRequest,
  UpdateUserRequest,
  UserSession,
} from "@/user";

describe("User Types", () => {
  describe("User", () => {
    test("should create a valid admin user", () => {
      const user: User = {
        id: "123",
        email: "admin@railguard.com",
        name: "Admin User",
        role: "admin",
        createdAt: "2025-01-01T00:00:00.000Z",
        updatedAt: "2025-01-01T00:00:00.000Z",
      };

      expect(user.id).toBe("123");
      expect(user.email).toBe("admin@railguard.com");
      expect(user.name).toBe("Admin User");
      expect(user.role).toBe("admin");
    });

    test("should create a valid operator user", () => {
      const user: User = {
        id: "456",
        email: "operator@railguard.com",
        name: "Operator User",
        role: "operator",
        createdAt: "2025-01-01T00:00:00.000Z",
        updatedAt: "2025-01-01T00:00:00.000Z",
      };

      expect(user.role).toBe("operator");
    });

    test("should create a valid viewer user", () => {
      const user: User = {
        id: "789",
        email: "viewer@railguard.com",
        name: "Viewer User",
        role: "viewer",
        createdAt: "2025-01-01T00:00:00.000Z",
        updatedAt: "2025-01-01T00:00:00.000Z",
      };

      expect(user.role).toBe("viewer");
    });
  });

  describe("UserRole", () => {
    test("should accept valid user roles", () => {
      const admin: UserRole = "admin";
      const operator: UserRole = "operator";
      const viewer: UserRole = "viewer";

      expect(admin).toBe("admin");
      expect(operator).toBe("operator");
      expect(viewer).toBe("viewer");
    });
  });

  describe("CreateUserRequest", () => {
    test("should create a valid user creation request", () => {
      const request: CreateUserRequest = {
        email: "newuser@railguard.com",
        name: "New User",
        role: "operator",
        password: "securepassword123",
      };

      expect(request.email).toBe("newuser@railguard.com");
      expect(request.name).toBe("New User");
      expect(request.role).toBe("operator");
      expect(request.password).toBe("securepassword123");
    });

    test("should create admin user request", () => {
      const request: CreateUserRequest = {
        email: "admin@railguard.com",
        name: "System Admin",
        role: "admin",
        password: "adminpassword456",
      };

      expect(request.role).toBe("admin");
    });

    test("should create viewer user request", () => {
      const request: CreateUserRequest = {
        email: "viewer@railguard.com",
        name: "Read Only User",
        role: "viewer",
        password: "viewerpassword789",
      };

      expect(request.role).toBe("viewer");
    });
  });

  describe("UpdateUserRequest", () => {
    test("should create request with all optional fields", () => {
      const request: UpdateUserRequest = {
        name: "Updated Name",
        role: "admin",
        email: "updated@railguard.com",
      };

      expect(request.name).toBe("Updated Name");
      expect(request.role).toBe("admin");
      expect(request.email).toBe("updated@railguard.com");
    });

    test("should create request with only name", () => {
      const request: UpdateUserRequest = {
        name: "New Name Only",
      };

      expect(request.name).toBe("New Name Only");
      expect(request.role).toBeUndefined();
      expect(request.email).toBeUndefined();
    });

    test("should create request with only role", () => {
      const request: UpdateUserRequest = {
        role: "viewer",
      };

      expect(request.role).toBe("viewer");
      expect(request.name).toBeUndefined();
      expect(request.email).toBeUndefined();
    });

    test("should create request with only email", () => {
      const request: UpdateUserRequest = {
        email: "newemail@railguard.com",
      };

      expect(request.email).toBe("newemail@railguard.com");
      expect(request.name).toBeUndefined();
      expect(request.role).toBeUndefined();
    });

    test("should create empty request", () => {
      const request: UpdateUserRequest = {};

      expect(request.name).toBeUndefined();
      expect(request.role).toBeUndefined();
      expect(request.email).toBeUndefined();
    });
  });

  describe("UserSession", () => {
    test("should create a valid user session", () => {
      const session: UserSession = {
        userId: "123",
        token: "jwt-token-here",
        expiresAt: "2025-01-01T01:00:00.000Z",
        refreshToken: "refresh-token-here",
      };

      expect(session.userId).toBe("123");
      expect(session.token).toBe("jwt-token-here");
      expect(session.expiresAt).toBe("2025-01-01T01:00:00.000Z");
      expect(session.refreshToken).toBe("refresh-token-here");
    });

    test("should create session with long token", () => {
      const longToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

      const session: UserSession = {
        userId: "456",
        token: longToken,
        expiresAt: "2025-01-01T02:00:00.000Z",
        refreshToken: "refresh-456",
      };

      expect(session.token).toBe(longToken);
      expect(session.userId).toBe("456");
    });
  });
});
