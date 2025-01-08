package services

import (
	"prtr/models"

	"gorm.io/gorm"
)

type KeyService struct {
	db *gorm.DB
}

func NewKeyService(db *gorm.DB) *KeyService {
	return &KeyService{db: db}
}

func (s *KeyService) CreateKey(key *models.Key) error {
	return s.db.Create(key).Error
}

func (s *KeyService) GetKeyByID(id uint) (*models.Key, error) {
	var key models.Key
	err := s.db.Preload("Copies").First(&key, id).Error
	return &key, err
}

func (s *KeyService) GetAllKeys(page, limit int, filters map[string]interface{}) ([]models.Key, int64, error) {
	var keys []models.Key
	query := s.db.Model(&models.Key{})

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
	err := query.Preload("Copies").Offset(offset).Limit(limit).Find(&keys).Error
	return keys, total, err
}

func (s *KeyService) UpdateKey(key *models.Key) error {
	return s.db.Save(key).Error
}

func (s *KeyService) DeleteKey(id uint) error {
	return s.db.Delete(&models.Key{}, id).Error
}
