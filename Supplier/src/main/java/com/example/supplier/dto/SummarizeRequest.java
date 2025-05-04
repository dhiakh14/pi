package com.example.supplier.dto;

import lombok.Getter;

@Getter
public class SummarizeRequest {
    // Getter and Setter
    private String inputs; // ✅ This matches the correct API format

    public void setInputs(String inputs) {
        this.inputs = inputs;
    }
}
