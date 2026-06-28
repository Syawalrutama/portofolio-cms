package usecase

import (
	"context"
	"errors"
	"time"
	"backend/internal/domain"
)

type certificateUsecase struct {
	certRepo domain.CertificateRepository
}

// NewCertificateUsecase menginisialisasi usecase bisnis CRUD sertifikat
func NewCertificateUsecase(certRepo domain.CertificateRepository) domain.CertificateUsecase {
	return &certificateUsecase{certRepo: certRepo}
}

func (u *certificateUsecase) CreateCertificate(ctx context.Context, userID string, req *domain.CreateCertificateRequest) (*domain.Certificate, error) {
	if req.Name == "" || req.Organization == "" || req.IssueDate == "" {
		return nil, errors.New("nama sertifikat, penerbit, dan tanggal terbit tidak boleh kosong")
	}

	issueDate, err := time.Parse("2006-01-02", req.IssueDate)
	if err != nil {
		return nil, errors.New("format tanggal terbit tidak valid. Gunakan format YYYY-MM-DD")
	}

	cert := &domain.Certificate{
		UserID:       userID,
		Name:         req.Name,
		Organization: req.Organization,
		IssueDate:    issueDate,
	}

	err = u.certRepo.Create(ctx, cert)
	if err != nil {
		return nil, err
	}
	return cert, nil
}

func (u *certificateUsecase) GetCertificateByID(ctx context.Context, id string) (*domain.Certificate, error) {
	return u.certRepo.GetByID(ctx, id)
}

func (u *certificateUsecase) GetCertificatesByUserID(ctx context.Context, userID string) ([]domain.Certificate, error) {
	return u.certRepo.GetAllByUserID(ctx, userID)
}

func (u *certificateUsecase) GetPublicCertificates(ctx context.Context) ([]domain.Certificate, error) {
	return u.certRepo.GetAll(ctx)
}

func (u *certificateUsecase) UpdateCertificate(ctx context.Context, id string, userID string, req *domain.UpdateCertificateRequest) (*domain.Certificate, error) {
	cert, err := u.certRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	if cert.UserID != userID {
		return nil, errors.New("tidak memiliki hak akses untuk mengubah sertifikat ini")
	}

	if req.Name == "" || req.Organization == "" || req.IssueDate == "" {
		return nil, errors.New("nama sertifikat, penerbit, dan tanggal terbit tidak boleh kosong")
	}

	issueDate, err := time.Parse("2006-01-02", req.IssueDate)
	if err != nil {
		return nil, errors.New("format tanggal terbit tidak valid. Gunakan format YYYY-MM-DD")
	}

	cert.Name = req.Name
	cert.Organization = req.Organization
	cert.IssueDate = issueDate

	err = u.certRepo.Update(ctx, cert)
	if err != nil {
		return nil, err
	}
	return cert, nil
}

func (u *certificateUsecase) UpdateCertificateImage(ctx context.Context, id string, userID string, imageURL string) (*domain.Certificate, error) {
	cert, err := u.certRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	if cert.UserID != userID {
		return nil, errors.New("tidak memiliki hak akses untuk memperbarui berkas sertifikat ini")
	}

	cert.ImageURL = imageURL

	err = u.certRepo.Update(ctx, cert)
	if err != nil {
		return nil, err
	}
	return cert, nil
}

func (u *certificateUsecase) DeleteCertificate(ctx context.Context, id string, userID string) error {
	cert, err := u.certRepo.GetByID(ctx, id)
	if err != nil {
		return err
	}

	if cert.UserID != userID {
		return errors.New("tidak memiliki hak akses untuk menghapus sertifikat ini")
	}

	return u.certRepo.Delete(ctx, id)
}
