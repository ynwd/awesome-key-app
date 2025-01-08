package services

import (
	"gorm.io/gorm"

	"prtr/models"
)

type StatsService struct {
	db *gorm.DB
}

func NewStatsService(db *gorm.DB) *StatsService {
	return &StatsService{db: db}
}

// GetTotals calculates the total number of staff, keys, and copies
func (s *StatsService) GetTotals() (int64, int64, int64, error) {
	var totalStaff int64
	var totalKeys int64
	var totalCopies int64

	// Count total staff
	if err := s.db.Model(&models.Staff{}).Count(&totalStaff).Error; err != nil {
		return 0, 0, 0, err
	}

	// Count total keys
	if err := s.db.Model(&models.Key{}).Count(&totalKeys).Error; err != nil {
		return 0, 0, 0, err
	}

	// Count total copies
	if err := s.db.Model(&models.Copy{}).Count(&totalCopies).Error; err != nil {
		return 0, 0, 0, err
	}

	return totalStaff, totalKeys, totalCopies, nil
}
