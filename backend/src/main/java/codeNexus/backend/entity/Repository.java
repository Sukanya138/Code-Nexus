package codeNexus.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "respositories",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id","github_repo_id"})
)
public class Repository {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @NotNull
    @Column(name="user_id", nullable = false)
    private UUID userId;

    @NotNull
    @Positive
    @Column(name="github_repo_id", nullable = false)
    private Long githubRepoId;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String owner;

    @NotBlank
    @Size(max = 200)
    @Column(nullable = false, length = 200)
    private String name;

    @Size(max = 300)
    @Column(name = "full_name", length = 300)
    private String fullName;

    @Column(name = "is_private", nullable = false)
    private boolean isPrivate;

    @Size(max = 100)
    @Column(name = "default_branch", length = 100)
    private String defaultBranch;

    @Size(max = 100)
    @Column(length = 100)
    private String language;

    @Size(max = 500)
    @Column(name="html_url", length = 500)
    private String htmlUrl;

    @Size(max = 2000)
    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(name = "index_status", nullable = false, length = 20)
    @Builder.Default
    private IndexStatus indexStatus = IndexStatus.PENDING;

    @Column(name = "index_at")
    private Instant indexAt;

    @Min(0)
    @Column(name = "chunk_count", nullable = false)
    private int chunkCount = 0;

    @Min(0)
    @Column(name = "files_total", nullable = false)
    private int filesTotal;

    @Min(0)
    @Column(name = "files_processed", nullable = false)
    @Builder.Default
    private int filesProcessed = 0;

    @Size(max = 2000)
    @Column(name="error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @NotNull
    @PastOrPresent
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @NotNull
    @PastOrPresent
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    void onCreate(){
        Instant now = Instant.now();
        if(createdAt == null){
            createdAt = now;
        }
        updatedAt = now;
        if(indexStatus == null){
            indexStatus = IndexStatus.PENDING;
        }
    }

}
