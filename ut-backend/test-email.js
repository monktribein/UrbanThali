const { sendEmail } = require('./services/mailer.service');
const { secret } = require('./config/secret');

async function testEmail() {
  console.log('Testing email configuration...');
  console.log('Email config:', {
    service: secret.email_service,
    user: secret.email_user,
    host: secret.email_host,
    port: secret.email_port
  });

  try {
    await sendEmail({
      to: 'test@example.com', // Replace with your test email
      subject: 'UrbanThali Email Test',
      html: '<h1>Test Email</h1><p>This is a test email from UrbanThali backend.</p>'
    });
    console.log('✅ Email test successful!');
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    
    if (error.message.includes('Invalid login')) {
      console.log('\n🔧 Fix: Check your email credentials in .env file');
      console.log('   - Make sure EMAIL_USER is correct');
      console.log('   - Make sure EMAIL_PASS is correct (use App Password for Gmail)');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.log('\n🔧 Fix: Check your email host and port settings');
      console.log('   - For Gmail: HOST=smtp.gmail.com, EMAIL_PORT=587');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('\n🔧 Fix: Check your internet connection and email host');
    }
  }
}

testEmail();


