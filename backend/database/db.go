package database

import (
	"fmt"
	"os"
	"prtr/models"

	"github.com/joho/godotenv"
	"gorm.io/driver/sqlserver"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() *gorm.DB {
	if err := godotenv.Load(); err != nil {
		panic("Failed to load .env file")
	}

	dsn := fmt.Sprintf("sqlserver://%s:%s@%s:%s?database=%s",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_NAME"),
	)
	db, err := gorm.Open(sqlserver.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	// Auto migrate models
	db.AutoMigrate(&models.Key{}, &models.Copy{}, &models.Staff{})
	fmt.Println("Database connected")
	return db
}
