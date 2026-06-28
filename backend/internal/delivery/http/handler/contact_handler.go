package handler

import (
	"backend/internal/domain"
	"github.com/gofiber/fiber/v2"
)

// ContactHandler mengelola request HTTP untuk data inbox pesan kontak
type ContactHandler struct {
	contactUsecase domain.ContactUsecase
}

// NewContactHandler menginisialisasi controller endpoint kontak
func NewContactHandler(contactUsecase domain.ContactUsecase) *ContactHandler {
	return &ContactHandler{contactUsecase: contactUsecase}
}

// Submit menangani request POST /api/contacts (Publik Visitor)
func (h *ContactHandler) Submit(c *fiber.Ctx) error {
	var req domain.CreateContactRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "Format request body tidak valid",
		})
	}

	contact, err := h.contactUsecase.SubmitContact(c.Context(), &req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"status":  "success",
		"message": "Pesan Anda berhasil terkirim!",
		"data":    contact,
	})
}

// GetAllAdmin menangani request GET /api/admin/contacts (Admin)
func (h *ContactHandler) GetAllAdmin(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)
	contacts, err := h.contactUsecase.GetContactsByUserID(c.Context(), userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": "Gagal mengambil data pesan masuk: " + err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"status": "success",
		"data":   contacts,
	})
}

// MarkRead menangani request PATCH /api/admin/contacts/:id/read (Admin)
func (h *ContactHandler) MarkRead(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)
	id := c.Params("id")

	contact, err := h.contactUsecase.MarkAsRead(c.Context(), id, userID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "Pesan berhasil ditandai sebagai dibaca",
		"data":    contact,
	})
}

// Delete menangani request DELETE /api/admin/contacts/:id (Admin)
func (h *ContactHandler) Delete(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)
	id := c.Params("id")

	err := h.contactUsecase.DeleteContact(c.Context(), id, userID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "Pesan berhasil dihapus",
	})
}
