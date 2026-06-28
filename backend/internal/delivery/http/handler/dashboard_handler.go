package handler

import (
	"backend/internal/domain"
	"github.com/gofiber/fiber/v2"
)

// DashboardHandler exposes statistical endpoints
type DashboardHandler struct {
	dashboardUsecase domain.DashboardUsecase
}

// NewDashboardHandler initializes a controller for dashboard requests
func NewDashboardHandler(dashboardUsecase domain.DashboardUsecase) *DashboardHandler {
	return &DashboardHandler{dashboardUsecase: dashboardUsecase}
}

// GetStats handles GET /api/admin/dashboard
func (h *DashboardHandler) GetStats(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)
	stats, err := h.dashboardUsecase.GetDashboardStats(c.Context(), userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": "Gagal mengambil data statistik dashboard: " + err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"status": "success",
		"data":   stats,
	})
}
