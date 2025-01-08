package models

import "gorm.io/gorm"

type Copy struct {
	gorm.Model
	Status  string `gorm:"not null" json:"status"`
	Value   string `gorm:"not null" json:"value"`
	Room    string `gorm:"not null" json:"room"`
	KeyID   uint   `json:"key_id"`   // Foreign Key
	Key     Key    `json:"key"`      // Belongs To relationship
	StaffID uint   `json:"staff_id"` // Foreign Key
	Staff   Staff  `json:"staff"`    // Belongs To relationship
}
