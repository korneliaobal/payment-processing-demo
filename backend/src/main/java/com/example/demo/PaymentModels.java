package com.example.demo;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
public final class PaymentModels {
    private PaymentModels() {}
    public enum Status { PENDING, OK, NOT_OK }
    public record Party(String name, String accountNumber) {}
    public record Transaction(Party creditor, BigDecimal amount) {}
    public record Payment(Party debtor, String currency, Integer transactionCount,
                          BigDecimal totalAmount, List<Transaction> transactions) {}
    public record Validation(Status status, List<String> reasons) {}
    public record TransactionResult(int index, Transaction transaction, Validation validation) {}
    public record Result(UUID paymentId, Instant createdAt, Status status, Payment payment,
                         Validation paymentValidation, List<TransactionResult> transactions) {}
}
