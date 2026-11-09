package com.example.demo;
import static com.example.demo.PaymentModels.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
@Service
public class PaymentService {
    private final Map<UUID, Result> payments = new ConcurrentHashMap<>();
    public Result process(Payment p) {
        if (p == null || p.debtor() == null || p.transactions() == null || p.currency() == null
            || p.currency().isBlank() || p.transactionCount() == null || p.totalAmount() == null
            || p.transactions().stream().anyMatch(t -> t == null || t.creditor() == null || t.amount() == null))
            throw new IllegalArgumentException("Required: debtor, currency, transactionCount, totalAmount, transactions with creditor and amount");
        if (p.transactionCount() != p.transactions().size())
            throw new IllegalArgumentException("Transaction count does not match declared transactionCount");
        BigDecimal sum = p.transactions().stream().map(Transaction::amount).reduce(BigDecimal.ZERO, BigDecimal::add);
        if (sum.compareTo(p.totalAmount()) != 0)
            throw new IllegalArgumentException("Total amount does not match sum of transaction amounts");
        List<String> reasons = new ArrayList<>();
        validateParty(p.debtor(), "Debtor", reasons);
        if (p.transactionCount() < 1 || p.transactionCount() > 5) reasons.add("Transaction count must be between 1 and 5");
        Validation validation = validation(reasons);
        List<TransactionResult> transactions = new ArrayList<>();
        for (int i = 0; i < p.transactions().size(); i++) {
            Transaction t = p.transactions().get(i);
            List<String> errors = new ArrayList<>();
            validateParty(t.creditor(), "Creditor", errors);
            if (t.amount().compareTo(BigDecimal.valueOf(5)) <= 0) errors.add("Amount must be greater than 5");
            transactions.add(new TransactionResult(i + 1, t, validation(errors)));
        }
        Status status = validation.status() == Status.OK && transactions.stream().allMatch(t -> t.validation().status() == Status.OK)
            ? Status.OK : Status.NOT_OK;
        // Publish only a complete, immutable result: readers never observe partial validation.
        Payment snapshot = new Payment(p.debtor(), p.currency(), p.transactionCount(), p.totalAmount(), List.copyOf(p.transactions()));
        Result result = new Result(UUID.randomUUID(), Instant.now(), status, snapshot, validation, List.copyOf(transactions));
        payments.put(result.paymentId(), result);
        return result;
    }
    private void validateParty(Party party, String role, List<String> reasons) {
        if (party.name() == null || party.name().isBlank()) reasons.add(role + " name must not be blank");
        if (party.accountNumber() == null || party.accountNumber().length() != 28) reasons.add(role + " account number must have 28 characters");
    }
    private Validation validation(List<String> reasons) { return new Validation(reasons.isEmpty() ? Status.OK : Status.NOT_OK, List.copyOf(reasons)); }
    public Result get(UUID id) {
        Result result = payments.get(id);
        if (result == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment not found");
        return result;
    }
    public List<Result> history() {
        return payments.values().stream().sorted(Comparator.comparing(Result::createdAt).reversed()).toList();
    }
}
