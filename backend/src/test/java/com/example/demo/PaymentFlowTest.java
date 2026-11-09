package com.example.demo;
import static org.assertj.core.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static com.example.demo.PaymentModels.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.util.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
@SpringBootTest @AutoConfigureMockMvc
class PaymentFlowTest {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper mapper;
    private final String account = "PL00123456789012345678901234";
    private Payment payment(String debtor, String account, int count, String amount) {
        var transactions = java.util.stream.IntStream.range(0, count)
            .mapToObj(i -> new Transaction(new Party("Recipient", this.account), new BigDecimal(amount))).toList();
        return new Payment(new Party(debtor, account), "PLN", count,
            new BigDecimal(amount).multiply(BigDecimal.valueOf(count)), transactions);
    }
    @Test void validPayment() {
        var result = new PaymentService().process(payment("Sender", account, 1, "5.01"));
        assertThat(result.status()).isEqualTo(Status.OK);
        assertThat(result.paymentValidation().status()).isEqualTo(Status.OK);
        assertThat(result.transactions().getFirst().validation().status()).isEqualTo(Status.OK);
    }
    @Test void invalidPaymentName() {
        assertThat(new PaymentService().process(payment(" ", account, 1, "25")).status()).isEqualTo(Status.NOT_OK);
    }
    @Test void invalidPaymentAccount() {
        assertThat(new PaymentService().process(payment("Sender", "short", 1, "25")).status()).isEqualTo(Status.NOT_OK);
    }
    @Test void tooManyTransactions() {
        assertThat(new PaymentService().process(payment("Sender", account, 6, "25")).status()).isEqualTo(Status.NOT_OK);
    }
    @ParameterizedTest @ValueSource(strings={"5", "0", "-1", "4.99"})
    void invalidTransactionAmount(String amount) {
        var result = new PaymentService().process(payment("Sender", account, 1, amount));
        assertThat(result.status()).isEqualTo(Status.NOT_OK);
        assertThat(result.paymentValidation().status()).isEqualTo(Status.OK);
        assertThat(result.transactions().getFirst().validation().reasons()).isNotEmpty();
    }
    @Test void invalidCreditor() {
        var p = new Payment(new Party("Sender", account), "PLN", 1, BigDecimal.TEN,
            List.of(new Transaction(new Party(" ", "short"), BigDecimal.TEN)));
        var result = new PaymentService().process(p);
        assertThat(result.status()).isEqualTo(Status.NOT_OK);
        assertThat(result.transactions().getFirst().validation().reasons()).hasSize(2);
    }
    @Test void uploadStatusHistoryDetails() throws Exception {
        var file = new MockMultipartFile("file", "payment.json", "application/json", mapper.writeValueAsBytes(payment("Sender", account, 1, "25")));
        var response = mvc.perform(multipart("/api/payments/upload").file(file)).andExpect(status().isCreated())
            .andExpect(jsonPath("$.status").value("OK")).andReturn().getResponse().getContentAsString();
        String id = mapper.readTree(response).get("paymentId").asText();
        mvc.perform(get("/api/payment-status/" + id)).andExpect(status().isOk()).andExpect(jsonPath("$.status").value("OK"));
        mvc.perform(get("/api/payments/" + id)).andExpect(status().isOk()).andExpect(jsonPath("$.payment.debtor.name").value("Sender"));
        mvc.perform(get("/api/payments/history")).andExpect(status().isOk()).andExpect(jsonPath("$[?(@.paymentId == '" + id + "')]").isNotEmpty());
    }
    @ParameterizedTest @ValueSource(strings={"{", "null", "{}", "{} {}"})
    void invalidUpload(String content) throws Exception {
        mvc.perform(multipart("/api/payments/upload").file(new MockMultipartFile("file", "bad.json", "application/json", content.getBytes())))
            .andExpect(status().isBadRequest());
    }
    @Test void inconsistentTotalAndCount() {
        var service = new PaymentService();
        var base = payment("Sender", account, 1, "25");
        assertThatThrownBy(() -> service.process(new Payment(base.debtor(), "PLN", 2, base.totalAmount(), base.transactions())))
            .isInstanceOf(IllegalArgumentException.class);
        assertThatThrownBy(() -> service.process(new Payment(base.debtor(), "PLN", 1, BigDecimal.ONE, base.transactions())))
            .isInstanceOf(IllegalArgumentException.class);
        assertThat(service.history()).isEmpty();
    }
    @Test void missingAndUnknownPayment() throws Exception {
        mvc.perform(multipart("/api/payments/upload")).andExpect(status().isBadRequest());
        mvc.perform(get("/api/payment-status/" + UUID.randomUUID())).andExpect(status().isNotFound());
        mvc.perform(get("/api/payments/not-a-uuid")).andExpect(status().isBadRequest());
        mvc.perform(get("/api/unknown")).andExpect(status().isNotFound());
    }
    @Test void spaRoutesForward() throws Exception {
        for (String path : List.of("/", "/payments/history", "/payments/" + UUID.randomUUID()))
            mvc.perform(get(path)).andExpect(forwardedUrl("/index.html"));
    }
}
