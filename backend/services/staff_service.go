package services

import (
	"prtr/models"

	"gorm.io/gorm"
)

type StaffService struct {
	db *gorm.DB
}

func NewStaffService(db *gorm.DB) *StaffService {
	return &StaffService{db: db}
}

func (s *StaffService) CreateStaff(staff *models.Staff) error {
	return s.db.Create(staff).Error
}

func (s *StaffService) GetStaffByID(id uint) (*models.Staff, error) {
	var staff models.Staff
	err := s.db.Preload("Copies").First(&staff, id).Error
	return &staff, err
}

// func (s *StaffService) GetAllStaff(page, limit int, filters map[string]interface{}) ([]models.Staff, error) {
// 	var staffs []models.Staff
// 	query := s.db.Model(&models.Staff{})

// 	// Apply filters
// 	for key, value := range filters {
// 		query = query.Where(key, value)
// 	}

// 	// Pagination
// 	offset := (page - 1) * limit
// 	err := query.Preload("Copies").Offset(offset).Limit(limit).Find(&staffs).Error
// 	return staffs, err
// }

func (s *StaffService) GetAllStaff(page, limit int, filters map[string]interface{}) ([]models.Staff, int64, error) {
	var staffs []models.Staff
	query := s.db.Model(&models.Staff{})

	// Apply filters
	for key, value := range filters {
		query = query.Where(key, value)
	}

	// Get total count
	var total int64
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Pagination
	offset := (page - 1) * limit
	err := query.Preload("Copies").Offset(offset).Limit(limit).Find(&staffs).Error
	return staffs, total, err
}

func (s *StaffService) UpdateStaff(staff *models.Staff) error {
	return s.db.Save(staff).Error
}

func (s *StaffService) DeleteStaff(id uint) error {
	return s.db.Delete(&models.Staff{}, id).Error
}
