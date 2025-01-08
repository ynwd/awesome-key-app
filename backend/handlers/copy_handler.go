package handlers

import (
	"prtr/models"
	"prtr/services"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type CopyHandler struct {
	copyService *services.CopyService
}

func NewCopyHandler(copyService *services.CopyService) *CopyHandler {
	return &CopyHandler{copyService: copyService}
}

func (h *CopyHandler) CreateCopy(c *fiber.Ctx) error {
	var copy models.Copy
	if err := c.BodyParser(&copy); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request payload"})
	}

	if err := h.copyService.CreateCopy(&copy); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create copy"})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Success",
		"data":    copy,
	})
}

func (h *CopyHandler) GetCopyByID(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid ID"})
	}

	copy, err := h.copyService.GetCopyByID(uint(id))
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Copy not found"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Success",
		"data":    copy,
	})
}

func (h *CopyHandler) GetAllCopies(c *fiber.Ctx) error {
	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "10"))

	filters := make(map[string]interface{})
	if value := c.Query("status"); value != "" {
		filters["status = ?"] = value
	}

	copies, total, err := h.copyService.GetAllCopies(page, limit, filters)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch copies"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Success",
		"data":    copies,
		"total":   total,
	})
}

func (h *CopyHandler) UpdateCopy(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid ID"})
	}

	var copy models.Copy
	if err := c.BodyParser(&copy); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request payload"})
	}

	copy.ID = uint(id)
	if err := h.copyService.UpdateCopy(&copy); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update copy"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Success",
		"data":    copy,
	})
}

func (h *CopyHandler) DeleteCopy(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid ID"})
	}

	if err := h.copyService.DeleteCopy(uint(id)); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete copy"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Copy deleted successfully"})
}
