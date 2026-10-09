package codeNexus.backend.controllers;

import codeNexus.backend.dto.UserResponse;
import codeNexus.backend.entity.User;
import codeNexus.backend.security.AppUserPrincipal;
import codeNexus.backend.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final CurrentUser currentUser;

    @GetMapping("/login-url")
    public Map<String,String> loginUrl(){
        return Map.of("url","/oauth2/authorization/github");
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(){
        AppUserPrincipal principal = currentUser.require();

        return ResponseEntity.ok(toUserResponse(principal.getUser()));
    }

    @GetMapping("/session")
    public ResponseEntity<UserResponse> session() {
        return ResponseEntity.ok(
                currentUser.optional()
                        .map(AppUserPrincipal::getUser)
                        .map(this::toUserResponse)
                        .orElse(null));
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getGithubId(),
                user.getGithubUsername(),
                user.getDisplayName(),
                user.getAvatarUrl());
    }

}
