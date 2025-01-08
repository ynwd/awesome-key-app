package models

import "gorm.io/gorm"

type Key struct {
	gorm.Model
	Value  string `gorm:"not null" json:"value"`
	Room   string `gorm:"not null" json:"room"`
	Copies []Copy `json:"copies"` // One-to-Many relationship
}
