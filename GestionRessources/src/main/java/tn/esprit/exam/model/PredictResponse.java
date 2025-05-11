package tn.esprit.exam.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class PredictResponse {

    @JsonProperty("predicted_price")
    private double predictedPrice;

    private String errorMessage; // New field to store error message

    public double getPredictedPrice() {
        return predictedPrice;
    }

    public void setPredictedPrice(double predictedPrice) {
        this.predictedPrice = predictedPrice;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    // Constructor to handle errors
    public PredictResponse(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    // Default constructor for normal responses
    public PredictResponse(double predictedPrice) {
        this.predictedPrice = predictedPrice;
    }
}
