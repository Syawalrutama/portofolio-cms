package route

import (
	"backend/internal/delivery/http/handler"
	"backend/internal/delivery/http/middleware"
	"backend/internal/domain"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

// SetupRoutes merangkai handler dan middleware ke dalam rute endpoint API
func SetupRoutes(
	app *fiber.App,
	db *gorm.DB,
	authUsecase domain.AuthUsecase,
	profileUsecase domain.ProfileUsecase,
	skillUsecase domain.SkillUsecase,
	projectUsecase domain.ProjectUsecase,
	certUsecase domain.CertificateUsecase,
	contactUsecase domain.ContactUsecase,
	dashboardUsecase domain.DashboardUsecase,
	jwtSecret string,
) {
	api := app.Group("/api")

	// 1. Setup Auth Handler
	authHandler := handler.NewAuthHandler(authUsecase)
	api.Post("/auth/login", authHandler.Login)
	api.Post("/auth/logout", authHandler.Logout)

	// 2. Setup Profile Handler (Publik)
	profileHandler := handler.NewProfileHandler(profileUsecase)
	api.Get("/profile", profileHandler.GetPublicProfile)

	// 3. Setup Skill Handler (Publik)
	skillHandler := handler.NewSkillHandler(skillUsecase)
	api.Get("/skills", skillHandler.GetAllPublic)

	// 4. Setup Project Handler (Publik)
	projectHandler := handler.NewProjectHandler(projectUsecase)
	api.Get("/projects", projectHandler.GetAllPublic)
	api.Get("/projects/:id", projectHandler.GetByID)

	// 5. Setup Certificate Handler (Publik)
	certHandler := handler.NewCertificateHandler(certUsecase)
	api.Get("/certificates", certHandler.GetAllPublic)

	// 6. Setup Contact Handler (Publik Submit)
	contactHandler := handler.NewContactHandler(contactUsecase)
	api.Post("/contacts", contactHandler.Submit)

	// 7. Setup Auth Middleware untuk Rute Terproteksi
	authMiddleware := middleware.NewAuthMiddleware(jwtSecret)

	// Rute Admin (Terproteksi JWT)
	admin := api.Group("/admin", authMiddleware)
	admin.Get("/check", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "success",
			"message": "Anda berhasil terotentikasi ke sistem admin!",
			"user": fiber.Map{
				"userId": c.Locals("userId"),
				"email":  c.Locals("email"),
				"role":   c.Locals("role"),
			},
		})
	})

	// Rute Kelola Dashboard Admin
	dashboardHandler := handler.NewDashboardHandler(dashboardUsecase)
	admin.Get("/dashboard", dashboardHandler.GetStats)

	// Rute Kelola Profil Admin
	admin.Get("/profile", profileHandler.GetAdminProfile)
	admin.Put("/profile", profileHandler.UpdateProfile)
	admin.Post("/profile/avatar", profileHandler.UploadPhoto)

	// Rute Kelola Skill Admin (CRUD)
	admin.Post("/skills", skillHandler.Create)
	admin.Get("/skills", skillHandler.GetAllAdmin)
	admin.Put("/skills/:id", skillHandler.Update)
	admin.Delete("/skills/:id", skillHandler.Delete)

	// Rute Kelola Proyek Admin (CRUD)
	admin.Post("/projects", projectHandler.Create)
	admin.Get("/projects", projectHandler.GetAllAdmin)
	admin.Put("/projects/:id", projectHandler.Update)
	admin.Post("/projects/:id/image", projectHandler.UploadImage)
	admin.Delete("/projects/:id", projectHandler.Delete)

	// Rute Kelola Sertifikat Admin (CRUD)
	admin.Post("/certificates", certHandler.Create)
	admin.Get("/certificates", certHandler.GetAllAdmin)
	admin.Put("/certificates/:id", certHandler.Update)
	admin.Post("/certificates/:id/image", certHandler.UploadImage)
	admin.Delete("/certificates/:id", certHandler.Delete)

	// Rute Kelola Kontak Masuk Admin (CRUD)
	admin.Get("/contacts", contactHandler.GetAllAdmin)
	admin.Patch("/contacts/:id/read", contactHandler.MarkRead)
	admin.Delete("/contacts/:id", contactHandler.Delete)
}
