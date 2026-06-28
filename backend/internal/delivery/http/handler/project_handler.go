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

// ProjectHandler mengelola request HTTP untuk data proyek
type ProjectHandler struct {
	projectUsecase domain.ProjectUsecase
}

// NewProjectHandler menginisialisasi controller endpoint proyek
func NewProjectHandler(projectUsecase domain.ProjectUsecase) *ProjectHandler {
	return &ProjectHandler{projectUsecase: projectUsecase}
}

// Create menangani request POST /api/admin/projects
func (h *ProjectHandler) Create(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)
	var req domain.CreateProjectRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "Format request body tidak valid",
		})
	}

	project, err := h.projectUsecase.CreateProject(c.Context(), userID, &req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"status":  "success",
		"message": "Proyek berhasil ditambahkan",
		"data":    project,
	})
}

// GetByID menangani request GET /api/projects/:id (Publik)
func (h *ProjectHandler) GetByID(c *fiber.Ctx) error {
	id := c.Params("id")
	project, err := h.projectUsecase.GetProjectByID(c.Context(), id)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"status":  "error",
			"message": "Proyek tidak ditemukan",
		})
	}

	return c.JSON(fiber.Map{
		"status": "success",
		"data":   project,
	})
}

// GetAllPublic menangani request GET /api/projects (Publik Visitor)
func (h *ProjectHandler) GetAllPublic(c *fiber.Ctx) error {
	projects, err := h.projectUsecase.GetPublicProjects(c.Context())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": "Gagal mengambil data proyek: " + err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"status": "success",
		"data":   projects,
	})
}

// GetAllAdmin menangani request GET /api/admin/projects (Admin)
func (h *ProjectHandler) GetAllAdmin(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)
	projects, err := h.projectUsecase.GetProjectsByUserID(c.Context(), userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": "Gagal mengambil data proyek admin: " + err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"status": "success",
		"data":   projects,
	})
}

// Update menangani request PUT /api/admin/projects/:id
func (h *ProjectHandler) Update(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)
	id := c.Params("id")
	var req domain.UpdateProjectRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "Format request body tidak valid",
		})
	}

	project, err := h.projectUsecase.UpdateProject(c.Context(), id, userID, &req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "Proyek berhasil diperbarui",
		"data":    project,
	})
}

// UploadImage menangani request POST /api/admin/projects/:id/image
func (h *ProjectHandler) UploadImage(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)
	id := c.Params("id")

	// Ambil file gambar proyek dari multipart form data
	file, err := c.FormFile("image")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "File gambar proyek wajib disertakan",
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

	// Pastikan folder penyimpanan unggahan gambar proyek terbuat
	uploadDir := "./uploads/projects"
	err = os.MkdirAll(uploadDir, os.ModePerm)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": "Gagal menginisialisasi penyimpanan unggahan",
		})
	}

	// Buat nama berkas gambar unik
	filename := fmt.Sprintf("%s_%d%s", uuid.New().String(), time.Now().Unix(), ext)
	filePath := filepath.Join(uploadDir, filename)

	// Simpan berkas ke folder server
	err = c.SaveFile(file, filePath)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": "Gagal menyimpan berkas ke server: " + err.Error(),
		})
	}

	// URL publik statis
	imageURL := fmt.Sprintf("/uploads/projects/%s", filename)

	// Update kolom ImageURL di database
	project, err := h.projectUsecase.UpdateProjectImage(c.Context(), id, userID, imageURL)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": "Gagal memperbarui database proyek: " + err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "Gambar proyek berhasil diunggah",
		"data":    project,
	})
}

// Delete menangani request DELETE /api/admin/projects/:id
func (h *ProjectHandler) Delete(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)
	id := c.Params("id")

	err := h.projectUsecase.DeleteProject(c.Context(), id, userID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"status":  "success",
		"message": "Proyek berhasil dihapus",
	})
}
