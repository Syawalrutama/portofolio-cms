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

// CertificateHandler mengelola request HTTP untuk data sertifikat
type CertificateHandler struct {
	certUsecase domain.CertificateUsecase
}

// NewCertificateHandler menginisialisasi controller endpoint sertifikat
func NewCertificateHandler(certUsecase domain.CertificateUsecase) *CertificateHandler {
	return &CertificateHandler{certUsecase: certUsecase}
}

// Create menangani request POST /api/admin/certificates
func (h *CertificateHandler) Create(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)
	var req domain.CreateCertificateRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "Format request body tidak valid",
		})
	}

	cert, err := h.certUsecase.CreateCertificate(c.Context(), userID, &req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"status":  "success",
		"message": "Sertifikat berhasil ditambahkan",
		"data":    cert,
	})
}

// GetAllPublic menangani request GET /api/certificates (Publik Visitor)
func (h *CertificateHandler) GetAllPublic(c *fiber.Ctx) error {
	certs, err := h.certUsecase.GetPublicCertificates(c.Context())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": "Gagal mengambil data sertifikat: " + err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"status": "success",
		"data":   certs,
	})
}

// GetAllAdmin menangani request GET /api/admin/certificates (Admin)
func (h *CertificateHandler) GetAllAdmin(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)
	certs, err := h.certUsecase.GetCertificatesByUserID(c.Context(), userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": "Gagal mengambil data sertifikat admin: " + err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"status": "success",
		"data":   certs,
	})
}

// Update menangani request PUT /api/admin/certificates/:id
func (h *CertificateHandler) Update(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)
	id := c.Params("id")
	var req domain.UpdateCertificateRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "Format request body tidak valid",
		})
	}

	cert, err := h.certUsecase.UpdateCertificate(c.Context(), id, userID, &req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "Sertifikat berhasil diperbarui",
		"data":    cert,
	})
}

// UploadImage menangani request POST /api/admin/certificates/:id/image
func (h *CertificateHandler) UploadImage(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)
	id := c.Params("id")

	// Ambil file berkas dari request multipart form
	file, err := c.FormFile("image")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "File gambar sertifikat wajib disertakan",
		})
	}

	// Validasi ekstensi tipe file
	ext := filepath.Ext(file.Filename)
	if ext != ".jpg" && ext != ".jpeg" && ext != ".png" && ext != ".webp" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "Format file tidak didukung. Gunakan JPG, JPEG, PNG, atau WEBP",
		})
	}

	// Pastikan folder penyimpanan unggahan sertifikat terbuat
	uploadDir := "./uploads/certificates"
	err = os.MkdirAll(uploadDir, os.ModePerm)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": "Gagal menginisialisasi penyimpanan unggahan",
		})
	}

	// Buat nama file sertifikat unik
	filename := fmt.Sprintf("%s_%d%s", uuid.New().String(), time.Now().Unix(), ext)
	filePath := filepath.Join(uploadDir, filename)

	// Simpan file ke server
	err = c.SaveFile(file, filePath)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": "Gagal menyimpan berkas ke server: " + err.Error(),
		})
	}

	// Petakan url publik statis
	imageURL := fmt.Sprintf("/uploads/certificates/%s", filename)

	// Update kolom ImageURL di database
	cert, err := h.certUsecase.UpdateCertificateImage(c.Context(), id, userID, imageURL)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": "Gagal memperbarui berkas sertifikat di database: " + err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "Berkas sertifikat berhasil diunggah",
		"data":    cert,
	})
}

// Delete menangani request DELETE /api/admin/certificates/:id
func (h *CertificateHandler) Delete(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)
	id := c.Params("id")

	err := h.certUsecase.DeleteCertificate(c.Context(), id, userID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "Sertifikat berhasil dihapus",
	})
}
