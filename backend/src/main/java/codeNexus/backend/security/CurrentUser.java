package codeNexus.backend.security;

import codeNexus.backend.exceptions.UnauthorizedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class CurrentUser {

	public Optional<AppUserPrincipal> optional() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();

		if (auth == null || !(auth.getPrincipal() instanceof AppUserPrincipal principal)) {
			return Optional.empty();
		}

		return Optional.of(principal);
	}

	public AppUserPrincipal require() {
		return optional().orElseThrow(() -> new UnauthorizedException("Not authenticated"));
	}
}
