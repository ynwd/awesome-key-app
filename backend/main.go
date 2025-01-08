//go:debug x509negativeserial=1
package main

import (
	"prtr/database"
	"prtr/handlers"
	"prtr/services"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func main() {
	db := database.Connect()

	// Initialize services
	keyService := services.NewKeyService(db)
	copyService := services.NewCopyService(db)
	staffService := services.NewStaffService(db)
	statsService := services.NewStatsService(db)

	// Initialize handlers

	// Initialize handlers
	statsHandler := handlers.NewStatsHandler(statsService)
	keyHandler := handlers.NewKeyHandler(keyService)
	copyHandler := handlers.NewCopyHandler(copyService)
	staffHandler := handlers.NewStaffHandler(staffService)
	seedHandler := handlers.NewSeedHandler(keyService, copyService, staffService)

	// Initialize Fiber app
	app := fiber.New()

	// Enable CORS
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3001",        // Allow requests from your Next.js frontend
		AllowHeaders: "Origin, Content-Type, Accept", // Allow necessary headers
		AllowMethods: "GET, POST, PUT, DELETE",       // Allow necessary HTTP methods
	}))

	app.Use(logger.New())

	api := app.Group("/api")

	keys := api.Group("/keys")
	keys.Get("/", keyHandler.GetAllKeys)
	keys.Post("/", keyHandler.CreateKey)
	keys.Get("/:id", keyHandler.GetKeyByID)
	keys.Put("/:id", keyHandler.UpdateKey)
	keys.Delete("/:id", keyHandler.DeleteKey)

	copies := api.Group("/copies")
	copies.Get("/", copyHandler.GetAllCopies)
	copies.Post("/", copyHandler.CreateCopy)
	copies.Get("/:id", copyHandler.GetCopyByID)
	copies.Put("/:id", copyHandler.UpdateCopy)
	copies.Delete("/:id", copyHandler.DeleteCopy)

	staff := api.Group("/staff")
	staff.Get("/", staffHandler.GetAllStaff)
	staff.Post("/", staffHandler.CreateStaff)
	staff.Get("/:id", staffHandler.GetStaffByID)
	staff.Put("/:id", staffHandler.UpdateStaff)
	staff.Delete("/:id", staffHandler.DeleteStaff)

	// Seed route (not grouped)
	app.Get("/api/seed", seedHandler.SeedData)
	app.Get("/api/stats", statsHandler.GetTotals)
	// Start the server
	app.Listen(":3000")
}
