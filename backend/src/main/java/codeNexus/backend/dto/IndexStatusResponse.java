package codeNexus.backend.dto;

import java.util.UUID;

import codeNexus.backend.entity.IndexStatus;

public record IndexStatusResponse(
        UUID id,
        IndexStatus indexStatus,
        int filesTotal,
        int filesProcessed,
        int chunkCount,
        java.time.Instant indexedAt,
        String errorMessage) {
}
