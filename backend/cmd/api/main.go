package main

import (
	"fmt"
	"log"

	"backend/internal/bootstrap"
	"backend/internal/delivery/http/route"
	"backend/internal/domain"
	"backend/internal/repository"
	"backend/internal/usecase"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func main() {
	// 1. Inisialisasi Aplikasi (Env & Database Connection)
	app := bootstrap.NewApplication()

	// Ambil instance DB untuk defer close
	sqlDB, err := app.DB.DB()
	if err != nil {
		log.Fatalf("Failed to retrieve database connection instance: %v", err)
	}
	defer sqlDB.Close()

	// 2. Automigrasi Skema Database (User, Profile, Skill, Project, Certificate, & Contact)
	log.Println("Running database migrations...")
	err = app.DB.AutoMigrate(&domain.User{}, &domain.Profile{}, &domain.Skill{}, &domain.Project{}, &domain.Certificate{}, &domain.Contact{})
	if err != nil {
		log.Fatalf("Database migration failed: %v", err)
	}

	// 3. Seed Default Admin & Profile
	SeedDefaultAdmin(app.DB)

	// 4. Sajikan static uploads folder untuk asset foto
	app.App.Static("/uploads", "./uploads")

	// 5. Inisialisasi Repositories & Usecases (Clean Architecture Injection)
	userRepo := repository.NewUserRepository(app.DB)
	profileRepo := repository.NewProfileRepository(app.DB)
	skillRepo := repository.NewSkillRepository(app.DB)
	projectRepo := repository.NewProjectRepository(app.DB)
	certRepo := repository.NewCertificateRepository(app.DB)
	contactRepo := repository.NewContactRepository(app.DB)

	authUsecase := usecase.NewAuthUsecase(userRepo, app.Env.JWTSecret)
	profileUsecase := usecase.NewProfileUsecase(profileRepo)
	skillUsecase := usecase.NewSkillUsecase(skillRepo)
	projectUsecase := usecase.NewProjectUsecase(projectRepo)
	certUsecase := usecase.NewCertificateUsecase(certRepo)
	contactUsecase := usecase.NewContactUsecase(contactRepo, userRepo)
	dashboardUsecase := usecase.NewDashboardUsecase(projectRepo, skillRepo, certRepo, contactRepo)

	// 6. Setup Rute API
	route.SetupRoutes(app.App, app.DB, authUsecase, profileUsecase, skillUsecase, projectUsecase, certUsecase, contactUsecase, dashboardUsecase, app.Env.JWTSecret)

	// Rute Root API Health Check
	app.App.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "success",
			"message": "Welcome to Personal Portfolio CMS API",
		})
	})

	// 7. Jalankan Server HTTP
	port := app.Env.Port
	log.Printf("Server is running on port %s...", port)
	err = app.App.Listen(fmt.Sprintf(":%s", port))
	if err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

// SeedDefaultAdmin memasukkan akun admin & profil default jika database masih kosong
func SeedDefaultAdmin(db *gorm.DB) {
	var count int64
	db.Model(&domain.User{}).Count(&count)
	if count == 0 {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
		if err != nil {
			log.Fatalf("Failed to generate default admin password hash: %v", err)
		}
		
		// 1. Buat User Admin
		admin := domain.User{
			Email:        "admin@example.com",
			PasswordHash: string(hashedPassword),
			Role:         "admin",
		}
		if err := db.Create(&admin).Error; err != nil {
			log.Printf("Failed to seed default admin: %v", err)
			return
		}
		
		log.Println("--------------------------------------------------")
		log.Println("DEFAULT ADMIN CREATED:")
		log.Println("Email:    admin@example.com")
		log.Println("Password: admin123")
		log.Println("--------------------------------------------------")

		// 2. Buat Profil Detail Admin
		profile := domain.Profile{
			UserID:   admin.ID,
			FullName: "Administrator",
			Title:    "Senior Software Architect",
			Bio:      "Saya adalah seorang software engineer berpengalaman membangun solusi digital.",
			SocialLinks: domain.SocialLinks{
				Email:    "admin@example.com",
				WhatsApp: "6281234567890",
				LinkedIn: "https://linkedin.com/in/yourprofile",
				GitHub:   "https://github.com/yourgithub",
			},
			TechStack: "React.js, Go / Golang, Tailwind CSS, PostgreSQL, Vite, Docker",
		}
		if err := db.Create(&profile).Error; err != nil {
			log.Printf("Failed to seed default admin profile: %v", err)
		} else {
			log.Println("Default profile details seeded successfully.")
		}
	}
}
