package handlers

import (
	"prtr/models"
	"prtr/services"

	"github.com/gofiber/fiber/v2"
)

type SeedHandler struct {
	keyService   *services.KeyService
	copyService  *services.CopyService
	staffService *services.StaffService
}

func NewSeedHandler(
	keyService *services.KeyService,
	copyService *services.CopyService,
	staffService *services.StaffService,
) *SeedHandler {
	return &SeedHandler{
		keyService:   keyService,
		copyService:  copyService,
		staffService: staffService,
	}
}

func (h *SeedHandler) SeedData(c *fiber.Ctx) error {
	// Seed Keys
	keys := []models.Key{
		{Value: "Key1", Room: "Room101"},
		{Value: "Key2", Room: "Room102"},
		{Value: "Key3", Room: "Room103"},
		{Value: "Key4", Room: "Room104"},
		{Value: "Key5", Room: "Room105"},
	}
	for _, key := range keys {
		if err := h.keyService.CreateKey(&key); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to seed keys",
			})
		}
	}

	// Seed Staff
	staffMembers := []models.Staff{
		{Role: "Admin", Status: "Active"},
		{Role: "Editor", Status: "Active"},
		{Role: "Viewer", Status: "Inactive"},
	}
	for _, staff := range staffMembers {
		if err := h.staffService.CreateStaff(&staff); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to seed staff",
			})
		}
	}

	// Seed Copies
	copies := []models.Copy{
		{Status: "Available", Value: "Copy1", Room: "Room101", KeyID: 1, StaffID: 1},
		{Status: "Available", Value: "Copy2", Room: "Room102", KeyID: 2, StaffID: 1},
		{Status: "Available", Value: "Copy3", Room: "Room103", KeyID: 3, StaffID: 1},
		{Status: "Available", Value: "Copy4", Room: "Room104", KeyID: 4, StaffID: 1},
		{Status: "Available", Value: "Copy5", Room: "Room105", KeyID: 5, StaffID: 1},
		{Status: "Borrowed", Value: "Copy6", Room: "Room101", KeyID: 1, StaffID: 2},
		{Status: "Borrowed", Value: "Copy7", Room: "Room102", KeyID: 2, StaffID: 2},
		{Status: "Borrowed", Value: "Copy8", Room: "Room103", KeyID: 3, StaffID: 2},
		{Status: "Borrowed", Value: "Copy9", Room: "Room104", KeyID: 4, StaffID: 2},
		{Status: "Borrowed", Value: "Copy10", Room: "Room105", KeyID: 5, StaffID: 2},
		{Status: "Lost", Value: "Copy11", Room: "Room101", KeyID: 1, StaffID: 3},
		{Status: "Lost", Value: "Copy12", Room: "Room102", KeyID: 2, StaffID: 3},
		{Status: "Lost", Value: "Copy13", Room: "Room103", KeyID: 3, StaffID: 3},
		{Status: "Lost", Value: "Copy14", Room: "Room104", KeyID: 4, StaffID: 3},
		{Status: "Lost", Value: "Copy15", Room: "Room105", KeyID: 5, StaffID: 3},
	}
	for _, copy := range copies {
		if err := h.copyService.CreateCopy(&copy); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to seed copies",
			})
		}
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Database seeded successfully",
	})
}
