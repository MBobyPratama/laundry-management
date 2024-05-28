// Validator untuk memeriksa apakah email valid
function isValidEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

// Validator untuk memeriksa apakah nomor telepon valid
function isValidPhone(phone) {
	const phoneRegex = /^\d{10}$/; // 10 nomor minimal
	return phoneRegex.test(phone);
}

module.exports = { isValidEmail, isValidPhone };
