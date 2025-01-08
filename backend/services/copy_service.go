package services

import (
	"prtr/models"

	"gorm.io/gorm"
)

type CopyService struct {
	db *gorm.DB
}

func NewCopyService(db *gorm.DB) *CopyService {
	return &CopyService{db: db}
}

func (s *CopyService) CreateCopy(copy *models.Copy) error {
	// Fetch the associated Key
	var key models.Key
	if err := s.db.First(&key, copy.KeyID).Error; err != nil {
		return err // Key not found or other database error
	}

	var staff models.Staff
	if err := s.db.First(&staff, copy.StaffID).Error; err != nil {
		return err // Key not found or other database error
	}

	copy.Key = key
	copy.Staff = staff

	copy.Value = key.Value
	copy.Room = key.Room

	return s.db.Create(copy).Error
}

func (s *CopyService) GetCopyByID(id uint) (*models.Copy, error) {
	var copy models.Copy
	err := s.db.Preload("Key").Preload("Staff").First(&copy, id).Error
	return &copy, err
}

func (s *CopyService) GetAllCopies(page, limit int, filters map[string]interface{}) ([]models.Copy, int64, error) {
	var copies []models.Copy
	query := s.db.Model(&models.Copy{})

	// Apply filters
	for key, value := range filters {
		query = query.Where(key, value)
	}

	var total int64
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Pagination
	offset := (page - 1) * limit
	err := query.Preload("Key").Preload("Staff").Offset(offset).Limit(limit).Find(&copies).Error
	return copies, total, err
}

func (s *CopyService) UpdateCopy(copy *models.Copy) error {
	var key models.Key
	if err := s.db.First(&key, copy.KeyID).Error; err != nil {
		return err // Key not found or other database error
	}

	var staff models.Staff
	if err := s.db.First(&staff, copy.StaffID).Error; err != nil {
		return err // Key not found or other database error
	}

	copy.Key = key
	copy.Staff = staff
	copy.StaffID = staff.ID

	copy.Value = key.Value
	copy.Room = key.Room

	return s.db.Save(copy).Error
}

func (s *CopyService) DeleteCopy(id uint) error {
	return s.db.Delete(&models.Copy{}, id).Error
}
