package codeNexus.backend.services.ai;

import java.util.List;

import codeNexus.backend.dto.CitationDto;

public record RetrievedContext(
        List<CitationDto> citations,
        String contextText) {
}