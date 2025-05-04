package com.example.supplier.dto;


import lombok.Data;

@Data
public class SupplierSummaryDTO {
    private long totalSuppliers;
    private long activeSuppliers;
    private long inactiveSuppliers;

    private long newSuppliersThisMonth;
}
