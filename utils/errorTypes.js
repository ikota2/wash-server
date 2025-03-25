/**
 * Error type constants for API responses
 */
const ERROR_TYPES = {
	VALIDATION_ERROR: 'VALIDATION_ERROR',
	NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
	INVALID_ID_ERROR: 'INVALID_ID_ERROR',
	DATABASE_ERROR: 'DATABASE_ERROR',
	UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

/**
 * Creates a standardized error response object
 * @param {string} message - Error message
 * @param {string} errorType - Error type from ERROR_TYPES
 * @returns {Object} Error response object
 */
const createErrorResponse = (message, errorType = ERROR_TYPES.UNKNOWN_ERROR) => {
	return {
		message,
		errorType
	};
};

/**
 * Determines the appropriate error type based on the error object
 * @param {Error} error - The error object
 * @returns {string} The error type
 */
const getErrorTypeFromError = (error) => {
	if (error.name === 'ValidationError') {
		return ERROR_TYPES.VALIDATION_ERROR;
	}

	if (error.name === 'CastError' && error.path === '_id') {
		return ERROR_TYPES.INVALID_ID_ERROR;
	}

	if (error.message && error.message.includes('not found')) {
		return ERROR_TYPES.NOT_FOUND_ERROR;
	}

	if (error.name === 'MongoError' || error.name === 'MongoServerError') {
		return ERROR_TYPES.DATABASE_ERROR;
	}

	return ERROR_TYPES.UNKNOWN_ERROR;
};

module.exports = {
	ERROR_TYPES,
	createErrorResponse,
	getErrorTypeFromError
};
