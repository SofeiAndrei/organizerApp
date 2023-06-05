ActionMailer::Base.smtp_settings = {
  address: 'smtp.sendgrid.net',
  port: '587',
  authentication: :plain,
  user_name: 'apikey', # in loc de ENV['SENDGRID_USERNAME'] -> nu mai merge din 2020
  password: ENV.fetch('SENDGRID_API_KEY', nil),
  domain: 'heroku.com',
  enable_starttls_auto: true
}
