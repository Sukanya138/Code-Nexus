package codeNexus.backend.services;

import codeNexus.backend.dto.RepositoryResponse;
import codeNexus.backend.entity.User;
import codeNexus.backend.repository.RepositoryRepository;
import codeNexus.backend.services.github.GithubApiClient;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.Comparator;
import codeNexus.backend.exceptions.NotFoundException;

import codeNexus.backend.entity.Repository;
import codeNexus.backend.dto.IndexStatusResponse;

@Service
@RequiredArgsConstructor
public class RepoService {

    private final RepositoryRepository repositoryRepository;
    private final UserService userService;
    private final GithubApiClient githubApiClient;

    @Transactional
    public List<RepositoryResponse> syncAndListRepo(UUID userId){
        User user = userService.requiredById(userId);

        String token = userService.decryptAccessToken(user);

        List<Map<String, Object>> remoteRepos = githubApiClient.listUserRepos(token);

        List<Repository> saved = new ArrayList<>();

        for (Map<String, Object> remote : remoteRepos) {
            Long githubRepoId = toLong(remote.get("id"));

            Repository repo = repositoryRepository
                .findByUserIdAndGithubRepoId(userId, githubRepoId)
                .orElseGet(Repository::new);

            String fullName = String.valueOf(remote.getOrDefault("full_name", ""));
            String[] parts = fullName != null ? fullName.split("/", 2) : new String[0];

            repo.setUserId(userId);
            repo.setGithubRepoId(githubRepoId);
            repo.setOwner(parts.length > 0 && !parts[0].isBlank() ? parts[0] : String.valueOf(remote.get("owner")));
            repo.setName(parts.length > 1 ? parts[1] : String.valueOf(remote.get("name")));
            repo.setFullName(fullName);
            repo.setPrivate(Boolean.TRUE.equals(remote.get("private")));
            repo.setDefaultBranch(remote.get("default_branch") != null
                ? String.valueOf(remote.get("default_branch"))
                : "main");
            repo.setLanguage(remote.get("language") != null ? String.valueOf(remote.get("language")) : null);
            repo.setHtmlUrl(remote.get("html_url") != null ? String.valueOf(remote.get("html_url")) : null);
            repo.setDescription(remote.get("description") != null ? String.valueOf(remote.get("description")) : null);
            repo.setUpdatedAt(Instant.now());

            if (repo.getOwner() == null || repo.getOwner().isBlank()) {
            Object ownerObj = remote.get("owner");
            if (ownerObj instanceof Map<?, ?> ownerMap && ownerMap.get("login") != null) {
                repo.setOwner(String.valueOf(ownerMap.get("login")));
            }
            }

            saved.add(repositoryRepository.save(repo));
        }

        return saved.stream()
            .sorted(Comparator.comparing(r -> r.getFullName() == null ? "" : r.getFullName(), String.CASE_INSENSITIVE_ORDER))
            .map(this::toResponse)
            .toList();
    }

    @Transactional(Transactional.TxType.SUPPORTS)
    public List<RepositoryResponse> listStored(UUID userId) {
        return repositoryRepository.findByUserIdOrderByFullNameAsc(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public Repository requireOwned(UUID repoId, UUID userId) {
        return repositoryRepository.findByIdAndUserId(repoId, userId)
                .orElseThrow(() -> new NotFoundException("Repository not found"));
    }

    @Transactional(Transactional.TxType.SUPPORTS)
    public IndexStatusResponse status(UUID repoId, UUID userId) {
        Repository repo = requireOwned(repoId, userId);
        return new IndexStatusResponse(
                repo.getId(),
                repo.getIndexStatus(),
                repo.getFilesTotal(),
                repo.getFilesProcessed(),
                repo.getChunkCount(),
                repo.getIndexAt(),
                repo.getErrorMessage());
    }

    public RepositoryResponse toResponse(Repository r) {
        return new RepositoryResponse(
                r.getId(),
                r.getGithubRepoId(),
                r.getOwner(),
                r.getName(),
                r.getFullName(),
                r.isPrivate(),
                r.getDefaultBranch(),
                r.getLanguage(),
                r.getHtmlUrl(),
                r.getDescription(),
                r.getIndexStatus(),
                r.getIndexAt(),
                r.getChunkCount(),
                r.getFilesTotal(),
                r.getFilesProcessed(),
                r.getErrorMessage());
    }

    private static Long toLong(Object value) {
        if (value instanceof Number number) {
            return number.longValue();
        }
        return Long.parseLong(String.valueOf(value));
    }
}
