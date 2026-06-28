package usecase

import (
	"backend/internal/domain"
	"context"
	"sort"
)

type dashboardUsecase struct {
	projectRepo domain.ProjectRepository
	skillRepo   domain.SkillRepository
	certRepo    domain.CertificateRepository
	contactRepo domain.ContactRepository
}

// NewDashboardUsecase instantiates the dashboard aggregator usecase
func NewDashboardUsecase(
	projectRepo domain.ProjectRepository,
	skillRepo domain.SkillRepository,
	certRepo domain.CertificateRepository,
	contactRepo domain.ContactRepository,
) domain.DashboardUsecase {
	return &dashboardUsecase{
		projectRepo: projectRepo,
		skillRepo:   skillRepo,
		certRepo:    certRepo,
		contactRepo: contactRepo,
	}
}

func (u *dashboardUsecase) GetDashboardStats(ctx context.Context, userID string) (*domain.DashboardStats, error) {
	// Fetch counts and records
	projects, err := u.projectRepo.GetAllByUserID(ctx, userID)
	if err != nil {
		projects = []domain.Project{}
	}

	skills, err := u.skillRepo.GetAllByUserID(ctx, userID)
	if err != nil {
		skills = []domain.Skill{}
	}

	certs, err := u.certRepo.GetAllByUserID(ctx, userID)
	if err != nil {
		certs = []domain.Certificate{}
	}

	contacts, err := u.contactRepo.GetAllByUserID(ctx, userID)
	if err != nil {
		contacts = []domain.Contact{}
	}

	// Calculate metrics
	totalProjects := len(projects)
	totalSkills := len(skills)
	totalCertificates := len(certs)
	totalMessages := len(contacts)
	unreadMessages := 0
	for _, c := range contacts {
		if !c.IsRead {
			unreadMessages++
		}
	}

	// Map and collate recent activity feeds
	var activities []domain.Activity

	for _, p := range projects {
		activities = append(activities, domain.Activity{
			ID:          p.ID,
			Type:        "project",
			Title:       p.Title,
			Description: "Proyek baru ditambahkan",
			CreatedAt:   p.CreatedAt,
		})
	}

	for _, s := range skills {
		activities = append(activities, domain.Activity{
			ID:          s.ID,
			Type:        "skill",
			Title:       s.Name,
			Description: "Skill baru didaftarkan",
			CreatedAt:   s.CreatedAt,
		})
	}

	for _, c := range certs {
		activities = append(activities, domain.Activity{
			ID:          c.ID,
			Type:        "certificate",
			Title:       c.Name,
			Description: "Sertifikat baru diunggah",
			CreatedAt:   c.CreatedAt,
		})
	}

	for _, msg := range contacts {
		activities = append(activities, domain.Activity{
			ID:          msg.ID,
			Type:        "contact",
			Title:       msg.Name,
			Description: "Pesan masuk baru diterima",
			CreatedAt:   msg.CreatedAt,
		})
	}

	// Sort chronologically descending
	sort.Slice(activities, func(i, j int) bool {
		return activities[i].CreatedAt.After(activities[j].CreatedAt)
	})

	// Slice top 10 items
	if len(activities) > 10 {
		activities = activities[:10]
	}

	return &domain.DashboardStats{
		TotalProjects:     totalProjects,
		TotalSkills:       totalSkills,
		TotalCertificates: totalCertificates,
		TotalMessages:     totalMessages,
		UnreadMessages:    unreadMessages,
		RecentActivities:  activities,
	}, nil
}
