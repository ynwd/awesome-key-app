package handlers

import (
	"prtr/models"
	"prtr/services"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type KeyHandler struct {
	keyService *services.KeyService
}

func NewKeyHandler(keyService *services.KeyService) *KeyHandler {
	return &KeyHandler{keyService: keyService}
}

func (h *KeyHandler) CreateKey(c *fiber.Ctx) error {
	var key models.Key
	if err := c.BodyParser(&key); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request payload"})
	}

	if err := h.keyService.CreateKey(&key); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create key"})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Success",
		"data":    key,
	})
}

func (h *KeyHandler) GetKeyByID(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid ID"})
	}

	key, err := h.keyService.GetKeyByID(uint(id))
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Key not found"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Success",
		"data":    key,
	})
}

func (h *KeyHandler) GetAllKeys(c *fiber.Ctx) error {
	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "10"))

	filters := make(map[string]interface{})
	if value := c.Query("value"); value != "" {
		filters["value = ?"] = value
	}

	keys, total, err := h.keyService.GetAllKeys(page, limit, filters)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch keys"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Success",
		"data":    keys,
		"total":   total,
	})
}

func (h *KeyHandler) UpdateKey(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid ID"})
	}

	var key models.Key
	if err := c.BodyParser(&key); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request payload"})
	}

	key.ID = uint(id)
	if err := h.keyService.UpdateKey(&key); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update key"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Success",
		"data":    key,
	})
}

func (h *KeyHandler) DeleteKey(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid ID"})
	}

	if err := h.keyService.DeleteKey(uint(id)); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete key"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Key deleted successfully"})
}
