package com.example.sprinproject.auth;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder

public class AuthenficationResponse {
    private String token;
}
