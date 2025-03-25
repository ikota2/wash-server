
/**
 * Определяет HTTP статус-код на основе типа ошибки
 * @param {Error} error - Объект ошибки
 * @returns {number} HTTP статус-код
 */
const getErrorStatusCode = (error) => {
	// Mongoose ValidationError (ошибки валидации)
	if (error.name === 'ValidationError') {
		return 400; // Bad Request
	}

	// Mongoose CastError (ошибки преобразования, например, неверный ID)
	if (error.name === 'CastError') {
		return 400; // Bad Request
	}

	// Ошибки MongoDB
	if (error.name === 'MongoError' || error.name === 'MongoServerError') {
		// Проверка на дубликат (ключ уже существует)
		if (error.code === 11000) {
			return 409; // Conflict
		}
		return 500; // Internal Server Error
	}

	// Ошибки, связанные с отсутствием данных
	if (error.message && error.message.includes('not found')) {
		return 404; // Not Found
	}

	// По умолчанию возвращаем 500
	return 500; // Internal Server Error
};

/**
 * Формирует объект ответа с ошибкой
 * @param {Error} error - Объект ошибки
 * @returns {Object} Объект с сообщением и типом ошибки
 */
const createErrorResponse = (error) => {
	// Базовый объект ответа
	const response = {
		message: error.message,
		errorType: error.name || 'UnknownError'
	};

	// Добавляем дополнительную информацию в зависимости от типа ошибки
	if (error.name === 'ValidationError' && error.errors) {
		// Для ошибок валидации добавляем детали валидации
		response.validationErrors = Object.keys(error.errors).map(field => ({
			field,
			message: error.errors[field].message
		}));
	}

	if (error.name === 'CastError') {
		// Для ошибок преобразования добавляем информацию о поле и значении
		response.invalidField = error.path;
		response.invalidValue = error.value;
	}

	return response;
};

module.exports = {
	getErrorStatusCode,
	createErrorResponse
};
