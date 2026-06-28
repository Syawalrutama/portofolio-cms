package handler

import (
	"fmt"
	"os"
	"path/filepath"
	"time"

	"backend/internal/domain"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

// ProfileHandler mengelola request HTTP untuk data profil
type ProfileHandler struct {
	profileUsecase domain.ProfileUsecase
}

// NewProfileHandler menginisialisasi controller endpoint profil
func NewProfileHandler(profileUsecase domain.ProfileUsecase) *ProfileHandler {
	return &ProfileHandler{profileUsecase: profileUsecase}
}

// GetPublicProfile menangani GET /api/profile (Publik)
func (h *ProfileHandler) GetPublicProfile(c *fiber.Ctx) error {
	profile, err := h.profileUsecase.GetPublicProfile(c.Context())
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"status":  "error",
			"message": "Profil belum dikonfigurasi.",
		})
	}
	return c.JSON(fiber.Map{
		"status": "success",
		"data":   profile,
	})
}

// GetAdminProfile menangani GET /api/admin/profile (Terproteksi Admin)
func (h *ProfileHandler) GetAdminProfile(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)
	profile, err := h.profileUsecase.GetProfileByUserID(c.Context(), userID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"status":  "error",
			"message": "Profil admin tidak ditemukan.",
		})
	}
	return c.JSON(fiber.Map{
		"status": "success",
		"data":   profile,
	})
}

// UpdateProfile menangani PUT /api/admin/profile (Terproteksi Admin)
func (h *ProfileHandler) UpdateProfile(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)
	var req domain.UpdateProfileRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "Format request body tidak valid",
		})
	}

	if req.FullName == "" || req.Title == "" || req.Bio == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "Nama lengkap, judul, dan bio wajib diisi",
		})
	}

	profile, err := h.profileUsecase.UpdateProfile(c.Context(), userID, &req)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": "Gagal memperbarui profil: " + err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "Profil berhasil diperbarui",
		"data":    profile,
	})
}

// UploadPhoto menangani POST /api/admin/profile/avatar (Terproteksi Admin)
func (h *ProfileHandler) UploadPhoto(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)

	// Ambil file avatar dari multipart/form-data
	file, err := c.FormFile("avatar")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "File foto profil wajib disertakan",
		})
	}

	// Validasi tipe file ekstensi
	ext := filepath.Ext(file.Filename)
	if ext != ".jpg" && ext != ".jpeg" && ext != ".png" && ext != ".webp" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "Format file tidak didukung. Gunakan JPG, JPEG, PNG, atau WEBP",
		})
	}

	// Pastikan folder folder upload terbuat
	uploadDir := "./uploads/avatars"
	err = os.MkdirAll(uploadDir, os.ModePerm)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": "Gagal menginisialisasi penyimpanan unggahan",
		})
	}

	// Buat nama file unik memakai UUID
	filename := fmt.Sprintf("%s_%d%s", uuid.New().String(), time.Now().Unix(), ext)
	filePath := filepath.Join(uploadDir, filename)

	// Simpan file ke folder server
	err = c.SaveFile(file, filePath)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": "Gagal menyimpan file ke server: " + err.Error(),
		})
	}

	// Petakan url url publik statis untuk disajikan ke browser
	avatarURL := fmt.Sprintf("/uploads/avatars/%s", filename)

	// Update record db profil
	profile, err := h.profileUsecase.UpdateAvatar(c.Context(), userID, avatarURL)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": "Gagal memperbarui foto profil di database: " + err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "Foto profil berhasil diunggah",
		"data":    profile,
	})
}
