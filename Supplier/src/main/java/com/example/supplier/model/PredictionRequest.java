package com.example.supplier.model;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PredictionRequest {
    private String sentiment;
    private int aiRating;
    private int clickCount;
    private long createdAt;
}
