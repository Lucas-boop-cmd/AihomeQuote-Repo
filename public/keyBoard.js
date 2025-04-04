
// document.addEventListener("DOMContentLoaded", function() {
//     document.querySelectorAll("input.form-control").forEach(function(input) {
//         let questionType = input.getAttribute("data-q");

//         if (!questionType) return;

//         // List of fields that should use the numeric keyboard
//         const numericFields = [
//             "estimated_down_payment",
//             "estimated_yearly_income",
//             "monthly_debt_payments_estimated",
//             "credit_score"
//         ];

//         if (numericFields.includes(questionType)) {
//             input.setAttribute("type", "tel");  // Use "tel" instead of "number" for better mobile support
//             input.setAttribute("inputmode", "numeric");
//             input.setAttribute("pattern", "[0-9]*");
//             input.setAttribute("placeholder", "Enter a number");
//         }

//         // Apply auto-formatting for monetary values (except credit score)
//         const moneyFields = [
//             "estimated_down_payment",
//             "estimated_yearly_income",
//             "monthly_debt_payments_estimated"
//         ];

//         if (moneyFields.includes(questionType)) {
//             input.addEventListener("input", function() {
//                 let value = input.value.replace(/\D/g, ""); // Remove non-numeric characters
//                 if (value) {
//                     input.value = Number(value).toLocaleString("en-US"); // Format with commas
//                 }
//             });
//         }

//         // Restrict Credit Score Field to Valid Range (300-850) but Allow Free Typing
//         if (questionType === "credit_score") {
//             input.addEventListener("input", function() {
//                 let value = input.value.replace(/\D/g, ""); // Remove non-numeric characters

//                 // Allow empty value for backspacing
//                 if (value === "") {
//                     input.value = "";
//                     return;
//                 }

//                 let numericValue = Number(value);

//                 // Allow any number while typing, but prevent non-numeric values
//                 if (!isNaN(numericValue)) {
//                     input.value = numericValue;
//                 }
//             });

//             // Correct value only when user leaves the field
//             input.addEventListener("blur", function() {
//                 let numericValue = Number(input.value);

//                 if (numericValue < 300 && numericValue !== 0) {
//                     input.value = "300";
//                 } else if (numericValue > 850) {
//                     input.value = "850";
//                 }
//             });
//         }
//     });
// });