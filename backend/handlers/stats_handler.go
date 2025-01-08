package handlers

import (
	"prtr/services"

	"github.com/gofiber/fiber/v2"
)

type StatsHandler struct {
	statsService *services.StatsService
}

func NewStatsHandler(statsService *services.StatsService) *StatsHandler {
	return &StatsHandler{statsService: statsService}
}

// GetTotals returns the total number of staff, keys, and copies
func (h *StatsHandler) GetTotals(c *fiber.Ctx) error {
	totalStaff, totalKeys, totalCopies, err := h.statsService.GetTotals()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch totals",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message":     "Success",
		"totalStaff":  totalStaff,
		"totalKeys":   totalKeys,
		"totalCopies": totalCopies,
	})
}
