package handler

import (
	"backend/internal/domain"
	"github.com/gofiber/fiber/v2"
)

// SkillHandler mengelola request HTTP untuk operasi skill
type SkillHandler struct {
	skillUsecase domain.SkillUsecase
}

// NewSkillHandler menginisialisasi controller endpoint skill
func NewSkillHandler(skillUsecase domain.SkillUsecase) *SkillHandler {
	return &SkillHandler{skillUsecase: skillUsecase}
}

// Create menangani request POST /api/admin/skills
func (h *SkillHandler) Create(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)
	var req domain.CreateSkillRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "Format request body tidak valid",
		})
	}

	skill, err := h.skillUsecase.CreateSkill(c.Context(), userID, &req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"status":  "success",
		"message": "Skill berhasil ditambahkan",
		"data":    skill,
	})
}

// GetAllPublic menangani request GET /api/skills (Publik)
func (h *SkillHandler) GetAllPublic(c *fiber.Ctx) error {
	skills, err := h.skillUsecase.GetPublicSkills(c.Context())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": "Gagal mengambil data skill: " + err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"status": "success",
		"data":   skills,
	})
}

// GetAllAdmin menangani request GET /api/admin/skills (Admin)
func (h *SkillHandler) GetAllAdmin(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)
	skills, err := h.skillUsecase.GetSkillsByUserID(c.Context(), userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": "Gagal mengambil data skill admin: " + err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"status": "success",
		"data":   skills,
	})
}

// Update menangani request PUT /api/admin/skills/:id
func (h *SkillHandler) Update(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)
	id := c.Params("id")
	var req domain.UpdateSkillRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "Format request body tidak valid",
		})
	}

	skill, err := h.skillUsecase.UpdateSkill(c.Context(), id, userID, &req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "Skill berhasil diperbarui",
		"data":    skill,
	})
}

// Delete menangani request DELETE /api/admin/skills/:id
func (h *SkillHandler) Delete(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)
	id := c.Params("id")

	err := h.skillUsecase.DeleteSkill(c.Context(), id, userID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "Skill berhasil dihapus",
	})
}
