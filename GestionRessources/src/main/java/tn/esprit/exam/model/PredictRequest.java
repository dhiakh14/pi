package tn.esprit.exam.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class PredictRequest {

    @JsonProperty("first_name") // correspond exactement à ce que Flask attend
    private String firstName;

    @JsonProperty("category")
    private String category;

    @JsonProperty("quantity")
    private int quantity;

    // Getters et Setters
    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
