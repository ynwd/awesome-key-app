package handlers

import (
	"prtr/models"
	"prtr/services"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type StaffHandler struct {
	staffService *services.StaffService
}

func NewStaffHandler(staffService *services.StaffService) *StaffHandler {
	return &StaffHandler{staffService: staffService}
}

func (h *StaffHandler) CreateStaff(c *fiber.Ctx) error {
	var staff models.Staff
	if err := c.BodyParser(&staff); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request payload"})
	}

	if err := h.staffService.CreateStaff(&staff); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create staff"})
	}

	return c.Status(fiber.StatusCreated).JSON(staff)
}

func (h *StaffHandler) GetStaffByID(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid ID"})
	}

	staff, err := h.staffService.GetStaffByID(uint(id))
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Staff not found"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Success",
		"data":    staff,
	})
}

func (h *StaffHandler) GetAllStaff(c *fiber.Ctx) error {
	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "10"))

	filters := make(map[string]interface{})
	if value := c.Query("role"); value != "" {
		filters["role = ?"] = value
	}
	if value := c.Query("status"); value != "" {
		filters["status = ?"] = value
	}

	staffs, total, err := h.staffService.GetAllStaff(page, limit, filters)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch staff"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Success",
		"data":    staffs,
		"total":   total,
	})
}

func (h *StaffHandler) UpdateStaff(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid ID"})
	}

	var staff models.Staff
	if err := c.BodyParser(&staff); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request payload"})
	}

	staff.ID = uint(id)
	if err := h.staffService.UpdateStaff(&staff); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update staff"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Success",
		"data":    staff,
	})
}

func (h *StaffHandler) DeleteStaff(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid ID"})
	}

	if err := h.staffService.DeleteStaff(uint(id)); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete staff"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Staff deleted successfully"})
}
