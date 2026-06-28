package middleware

import (
	"strings"

	"backend/pkg/jwtutil"
	"github.com/gofiber/fiber/v2"
)

// NewAuthMiddleware menyaring request masuk dan memvalidasi token JWT
func NewAuthMiddleware(jwtSecret string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// 1. Ambil token dari Header Authorization
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			// Fallback: Ambil dari secure cookie
			authHeader = c.Cookies("token")
		}

		if authHeader == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"status":  "error",
				"message": "Token otentikasi tidak ditemukan. Harap login kembali.",
			})
		}

		tokenString := authHeader
		if strings.HasPrefix(authHeader, "Bearer ") {
			tokenString = strings.TrimPrefix(authHeader, "Bearer ")
		}

		// 2. Validasi Token JWT
		claims, err := jwtutil.ValidateToken(tokenString, jwtSecret)
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"status":  "error",
				"message": "Token tidak valid atau telah kadaluwarsa.",
			})
		}

		// 3. Simpan data user ke dalam Fiber context untuk diakses Handler berikutnya
		c.Locals("userId", claims.UserID)
		c.Locals("email", claims.Email)
		c.Locals("role", claims.Role)

		// 4. Enforce role check
		if claims.Role != "admin" {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"status":  "error",
				"message": "Anda tidak memiliki hak akses untuk halaman ini.",
			})
		}

		return c.Next()
	}
}
