'use strict';

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/dream-restaurant-app';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-dream-restaurant-app';
exports.PORT = process.env.PORT || 8080;