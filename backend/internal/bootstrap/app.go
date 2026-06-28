package bootstrap

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"gorm.io/gorm"
)

// Application merangkum dependency core sistem
type Application struct {
	Env *Env
	DB  *gorm.DB
	App *fiber.App
}

// NewApplication menyiapkan env, database, dan engine fiber app
func NewApplication() Application {
	env := NewEnv()
	db := NewDatabase(env)

	app := fiber.New(fiber.Config{
		AppName: "Personal Portfolio CMS v1.0",
	})

	// Registrasi Middleware Global
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
	}))

	return Application{
		Env: env,
		DB:  db,
		App: app,
	}
}
