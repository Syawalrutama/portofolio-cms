package handler

import (
	"backend/internal/domain"
	"github.com/gofiber/fiber/v2"
)

// AuthHandler mengelola API request login dan logout
type AuthHandler struct {
	authUsecase domain.AuthUsecase
}

// NewAuthHandler menginisialisasi controller endpoint otentikasi
func NewAuthHandler(authUsecase domain.AuthUsecase) *AuthHandler {
	return &AuthHandler{authUsecase: authUsecase}
}

// Login menangani request POST /api/auth/login
func (h *AuthHandler) Login(c *fiber.Ctx) error {
	var req domain.LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "Format request body tidak valid",
		})
	}

	if req.Email == "" || req.Password == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "Email dan password wajib diisi",
		})
	}

	resp, err := h.authUsecase.Login(c.Context(), &req)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	// Set secure HTTPOnly cookie untuk sesi dashboard admin
	c.Cookie(&fiber.Cookie{
		Name:     "token",
		Value:    resp.Token,
		HTTPOnly: true,
		Secure:   false, // Set true jika di production (HTTPS)
		SameSite: "Lax",
		Path:     "/",
	})

	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "Login berhasil",
		"data":    resp,
	})
}

// Logout menangani request POST /api/auth/logout
func (h *AuthHandler) Logout(c *fiber.Ctx) error {
	// Hapus cookie token otentikasi
	c.ClearCookie("token")

	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "Logout berhasil",
	})
}
