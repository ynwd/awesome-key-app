package models

import "gorm.io/gorm"

type Staff struct {
	gorm.Model
	Role   string `gorm:"not null" json:"role"`
	Status string `gorm:"not null" json:"status"`
	Copies []Copy `json:"copies"` // One-to-Many relationship
}
