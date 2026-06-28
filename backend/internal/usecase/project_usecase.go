package usecase

import (
	"context"
	"errors"
	"backend/internal/domain"
)

type projectUsecase struct {
	projectRepo domain.ProjectRepository
}

// NewProjectUsecase menginisialisasi usecase bisnis CRUD proyek
func NewProjectUsecase(projectRepo domain.ProjectRepository) domain.ProjectUsecase {
	return &projectUsecase{projectRepo: projectRepo}
}

func (u *projectUsecase) CreateProject(ctx context.Context, userID string, req *domain.CreateProjectRequest) (*domain.Project, error) {
	if req.Title == "" || req.Description == "" || req.Category == "" {
		return nil, errors.New("judul, deskripsi, dan kategori tidak boleh kosong")
	}

	project := &domain.Project{
		UserID:      userID,
		Title:       req.Title,
		Description: req.Description,
		GithubURL:   req.GithubURL,
		DemoURL:     req.DemoURL,
		Category:    req.Category,
	}

	err := u.projectRepo.Create(ctx, project)
	if err != nil {
		return nil, err
	}
	return project, nil
}

func (u *projectUsecase) GetProjectByID(ctx context.Context, id string) (*domain.Project, error) {
	return u.projectRepo.GetByID(ctx, id)
}

func (u *projectUsecase) GetProjectsByUserID(ctx context.Context, userID string) ([]domain.Project, error) {
	return u.projectRepo.GetAllByUserID(ctx, userID)
}

func (u *projectUsecase) GetPublicProjects(ctx context.Context) ([]domain.Project, error) {
	return u.projectRepo.GetAll(ctx)
}

func (u *projectUsecase) UpdateProject(ctx context.Context, id string, userID string, req *domain.UpdateProjectRequest) (*domain.Project, error) {
	project, err := u.projectRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	if project.UserID != userID {
		return nil, errors.New("tidak memiliki hak akses untuk mengubah proyek ini")
	}

	if req.Title == "" || req.Description == "" || req.Category == "" {
		return nil, errors.New("judul, deskripsi, dan kategori tidak boleh kosong")
	}

	project.Title = req.Title
	project.Description = req.Description
	project.GithubURL = req.GithubURL
	project.DemoURL = req.DemoURL
	project.Category = req.Category

	err = u.projectRepo.Update(ctx, project)
	if err != nil {
		return nil, err
	}
	return project, nil
}

func (u *projectUsecase) UpdateProjectImage(ctx context.Context, id string, userID string, imageURL string) (*domain.Project, error) {
	project, err := u.projectRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	if project.UserID != userID {
		return nil, errors.New("tidak memiliki hak akses untuk memperbarui gambar proyek ini")
	}

	project.ImageURL = imageURL

	err = u.projectRepo.Update(ctx, project)
	if err != nil {
		return nil, err
	}
	return project, nil
}

func (u *projectUsecase) DeleteProject(ctx context.Context, id string, userID string) error {
	project, err := u.projectRepo.GetByID(ctx, id)
	if err != nil {
		return err
	}

	if project.UserID != userID {
		return errors.New("tidak memiliki hak akses untuk menghapus proyek ini")
	}

	return u.projectRepo.Delete(ctx, id)
}
