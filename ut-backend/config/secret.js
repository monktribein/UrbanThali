const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(process.cwd(), '.env') })

module.exports.secret = {
  port: process.env.PORT || 9000,
  env: process.env.NODE_ENV || 'development',
  db_url: process.env.MONGO_URI || 'mongodb://localhost:27017/urbanthali',
  token_secret: process.env.TOKEN_SECRET || 'urbanthali_jwt_secret_key_2024',
  jwt_secret_for_verify: process.env.JWT_SECRET_FOR_VERIFY || 'urbanthali_jwt_verify_secret_key_2024',

  email_service: process.env.SERVICE || 'gmail',
  email_user: process.env.EMAIL_USER || '',
  email_pass: process.env.EMAIL_PASS || '',
  email_host: process.env.HOST || 'smtp.gmail.com',
  email_port: process.env.EMAIL_PORT || 587, 

  cloudinary_name: process.env.CLOUDINARY_NAME || '', 
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY || '', 
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET || '', 
  cloudinary_upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET || '', 
  
  stripe_key: process.env.STRIPE_KEY || '', 
  client_url: process.env.STORE_URL || 'http://localhost:3000', 
  admin_url: process.env.ADMIN_URL || 'http://localhost:3001', 
}
